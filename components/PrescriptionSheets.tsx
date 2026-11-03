'use client';
import {useEffect,useRef,useState} from 'react';
export type PrintPage={key:string;src?:string};
export function PrescriptionSheets({order:o,density=6}:{order:any;density?:number}){
 const pages:PrintPage[]=JSON.parse(o.files).filter((f:any)=>f.kind==='page');
 const batches:PrintPage[][]=[];for(let i=0;i<pages.length;i+=density)batches.push(pages.slice(i,i+density));
 return <div className="a4-stack">{batches.map((batch,n)=><Sheet key={n+'-'+density} order={o} pages={batch} index={n} total={batches.length} offset={n*density}/>)}</div>
}
function Sheet({order:o,pages,index,total,offset}:{order:any;pages:PrintPage[];index:number;total:number;offset:number}){
 const grid=useRef<HTMLDivElement>(null);const [columns,setColumns]=useState(pages.length===1?1:2);
 function arrange(){const el=grid.current;if(!el)return;const imgs=Array.from(el.querySelectorAll('img'));if(imgs.some(i=>!i.naturalWidth))return;const w=el.clientWidth,h=el.clientHeight;let best=0,bestCols=1;
 for(let cols=1;cols<=Math.min(3,pages.length);cols++){const rows=Math.ceil(pages.length/cols),cw=(w-(cols-1)*12)/cols,ch=(h-(rows-1)*12)/rows-20;const score=imgs.reduce((s,img,i)=>{const rowCount=i>=Math.floor((pages.length-1)/cols)*cols?(pages.length%cols||cols):cols;const actualWidth=(w-(rowCount-1)*12)/rowCount;const scale=Math.min(actualWidth/img.naturalWidth,ch/img.naturalHeight);return s+img.naturalWidth*img.naturalHeight*scale*scale},0);if(score>best){best=score;bestCols=cols}}
 setColumns(bestCols);
 }
 useEffect(()=>{const obs=new ResizeObserver(arrange);if(grid.current)obs.observe(grid.current);return()=>obs.disconnect()},[pages.length]);
 const reference='CH-'+o.id.slice(0,8).toUpperCase();
 return <section className="a4-sheet"><div className="sheet-id"><strong>{reference}</strong><span>{o.patient} · {o.area}</span><span>A4 sheet {index+1} / {total}</span></div>
 {index===0&&<><section className="parcel-label" aria-label="Cut-out parcel delivery label"><div className="cut-caption">CUT ALONG THE DOTTED BORDER · PARCEL LABEL</div><div className="parcel-zone"><strong>{o.area.toUpperCase()}</strong><span>{reference}</span></div><div className="parcel-columns"><div className="parcel-to"><div className="label-kicker">DELIVER TO</div><strong className="recipient-name">{o.patient}</strong><strong className="recipient-phone">+91 {o.phone}</strong><p>{o.address}</p>{o.landmark&&<p><b>Landmark:</b> {o.landmark}</p>}</div><div className="parcel-from"><div className="label-kicker">FROM</div><div className="sender-brand"><img src="/changediya-logo.svg" alt=""/><strong>CHANGEDIYA<br/>MEDICAL STORES</strong></div><p>Shop No. 9, Mutha Chambers,<br/>Mali Wada, Ahilyanagar</p><p>Phone: +91 90117 58889</p>{o.partner&&<p><b>Delivery partner:</b> {o.partner}</p>}</div></div></section>{o.notes&&<div className="print-order-note"><b>For pharmacy staff:</b> {o.notes}</div>}</>}
 <div className="rx-grid" ref={grid} style={{gridTemplateColumns:`repeat(6, minmax(0,1fr))`,gridTemplateRows:`repeat(${Math.ceil(pages.length/columns)}, minmax(0,1fr))`}}>{pages.map((f,i)=><figure className="rx-tile" key={f.key} style={{gridColumn:`span ${6/(i>=Math.floor((pages.length-1)/columns)*columns?(pages.length%columns||columns):columns)}`}}><figcaption>Prescription {offset+i+1}</figcaption><img onLoad={arrange} src={f.src||'/api/files/'+encodeURIComponent(f.key)} alt={'Prescription '+(offset+i+1)}/></figure>)}</div><div className="sheet-bottom">{reference} · For pharmacist review · Patient information — confidential</div></section>
}
