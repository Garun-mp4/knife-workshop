"use client";
import { useEffect, useState } from "react";
import { apiGet, apiSend } from "../../lib/api";
export default function Settings(){ const [site,setSite]=useState<any>({}); useEffect(()=>{apiGet<any>('/admin/settings').then(s=>setSite(s.site??{}))},[]); async function save(fd:FormData){ await apiSend('/admin/settings','PATCH',{site:Object.fromEntries(fd.entries())}); alert('Сохранено'); } return <div><h1>Настройки сайта</h1><form action={save} className="card" style={{padding:24, display:'grid', gap:12}}>{['workshopName','phone','telegram','whatsapp','email','city','heroTitle','heroSubtitle','guaranteeText','deliveryText'].map(k=><input key={k} className="input" name={k} placeholder={k} defaultValue={site[k] ?? ''}/>) }<button className="btn">Сохранить</button></form></div> }
