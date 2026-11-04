import {env} from 'cloudflare:workers';
import {isStaff,privateHeaders} from '@/lib/security';
export async function GET(req:Request){
 if(!isStaff(req))return Response.json({error:'Staff session expired. Sign in again.'},{status:401,headers:privateHeaders});
 const key=new URL(req.url).searchParams.get('key');if(!key||key.length>200)return new Response(null,{status:400});
 const file=await env.BUCKET!.get(key);if(!file)return Response.json({error:'This file could not be found.'},{status:404,headers:privateHeaders});
 return new Response(file.body,{headers:{...privateHeaders,'Content-Type':file.httpMetadata?.contentType||'application/octet-stream','Content-Length':String(file.size),'Content-Security-Policy':"default-src 'none'; img-src 'self' data:; style-src 'unsafe-inline'; sandbox"}});
}
