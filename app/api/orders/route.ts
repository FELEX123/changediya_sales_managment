import { env } from 'cloudflare:workers';
import { sameOrigin, privateHeaders } from '@/lib/security';
export async function POST(req:Request) {
 if(!sameOrigin(req)) return Response.json({error:'Invalid request.'},{status:403});
 try {
 if(Number(req.headers.get('content-length')||0)>35*1024*1024) throw Error('Upload must be under 35 MB.');
 const f=await req.formData();const val=(s:string)=>String(f.get(s)||'').trim();
 const patient=val('patient'),phone=val('phone').replace(/\D/g,''),address=val('address'),area=val('area'),landmark=val('landmark'),notes=val('notes');
 if(patient.length<2||patient.length>100||!(/^[6-9]\d{9}$/.test(phone))||address.length<10||address.length>1000||!['Savedi','Ahilya Nagar','Khedgaon'].includes(area)||landmark.length>200||notes.length>1000||val('consent')!=='yes') throw Error('Please complete your name, 10-digit mobile number, full address, area and consent.');
 const originals=f.getAll('originals') as File[],pages=f.getAll('pages') as File[];
 if(!originals.length||originals.length>5||!pages.length||pages.length>15) throw Error('Add 1–5 files with no more than 15 pages in total.');
 if([...originals,...pages].some(x=>!(x instanceof File)||!x.size)||originals.reduce((n,x)=>n+x.size,0)>15*1024*1024||pages.reduce((n,x)=>n+x.size,0)>18*1024*1024) throw Error('Files exceed the upload limit.');
 for(const file of originals){const bytes=new Uint8Array(await file.slice(0,8).arrayBuffer());const ok=file.type==='application/pdf'?new TextDecoder().decode(bytes).startsWith('%PDF-'):file.type==='image/jpeg'?bytes[0]===255&&bytes[1]===216:file.type==='image/png'?bytes[0]===137&&bytes[1]===80:file.type==='image/webp'?new TextDecoder().decode(bytes.slice(0,4))==='RIFF':false;if(!ok)throw Error('Use valid PDF, JPG, PNG or WebP files.');}
 for(const file of pages){const b=new Uint8Array(await file.slice(0,2).arrayBuffer());if(file.type!=='image/jpeg'||b[0]!==255||b[1]!==216)throw Error('Invalid print page.');}
 const id=crypto.randomUUID();const saved:{key:string,name:string,type:string,kind:string}[]=[];
 try { for(const [kind,files] of [['original',originals],['page',pages]] as const){for(let i=0;i<files.length;i++){const x=files[i],key=`${id}/${kind}-${i}`;await env.BUCKET!.put(key,await x.arrayBuffer(),{httpMetadata:{contentType:x.type}});saved.push({key,name:x.name,type:x.type,kind});}}
 await env.DB!.prepare('INSERT INTO orders(id,patient,phone,address,landmark,area,notes,files,status,partner,created,print_attempts) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)').bind(id,patient,phone,address,landmark,area,notes,JSON.stringify(saved),'queued','',Date.now(),0).run();
 } catch(e) {await Promise.all(saved.map(x=>env.BUCKET!.delete(x.key)));throw e;}
 return Response.json({id,reference:'CH-'+id.slice(0,8).toUpperCase(),area},{headers:privateHeaders});
 }catch(e){return Response.json({error:e instanceof Error?e.message:'Could not save. Please try again.'},{status:400,headers:privateHeaders})}
}
