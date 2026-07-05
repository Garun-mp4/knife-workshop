"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { apiSend } from "../lib/api";
const statuses = ["DRAFT","IN_STOCK","MADE_TO_ORDER","SOLD","HIDDEN","COMING_SOON","ARCHIVED"];
export function ProductForm({ product, categories }: { product?: any; categories: any[] }) {
  const router = useRouter(); const [error,setError]=useState("");
  async function save(formData: FormData) { setError(""); const payload:any = Object.fromEntries(formData.entries()); for (const key of Object.keys(payload)) if (payload[key] === "") delete payload[key]; payload.engravingAvailable = payload.engravingAvailable === "on"; payload.isFeatured = payload.isFeatured === "on"; for (const k of ["bladeLengthMm","totalLengthMm","weightGrams","productionTimeDays","sortOrder"]) if (payload[k]) payload[k]=Number(payload[k]); try { const saved = await apiSend<any>(product ? `/admin/products/${product.id}` : "/admin/products", product ? "PATCH" : "POST", payload); router.push(`/products/${saved.id}`); router.refresh(); } catch(e:any){ setError(e.message); } }
  return <form action={save} className="card" style={{padding:24, display:"grid", gap:14}}>
    {error && <p style={{color:"#DC2626"}}>{error}</p>}
    <input className="input" name="title" placeholder="Название" defaultValue={product?.title} required />
    <input className="input" name="slug" placeholder="Slug" defaultValue={product?.slug} />
    <select className="input" name="categoryId" defaultValue={product?.category?.id || ""}><option value="">Без категории</option>{categories.map((c:any)=><option key={c.id} value={c.id}>{c.name}</option>)}</select>
    <select className="input" name="status" defaultValue={product?.status || "DRAFT"}>{statuses.map(s=><option key={s}>{s}</option>)}</select>
    <div style={{display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12}}><input className="input" name="price" placeholder="Цена" defaultValue={product?.price ?? ""} /><input className="input" name="oldPrice" placeholder="Старая цена" defaultValue={product?.oldPrice ?? ""} /><input className="input" name="pricePrefix" placeholder="Префикс" defaultValue={product?.pricePrefix ?? ""} /></div>
    <textarea className="input" name="shortDescription" placeholder="Краткое описание" defaultValue={product?.shortDescription ?? ""} />
    <textarea className="input" name="description" placeholder="Полное описание" rows={6} defaultValue={product?.description ?? ""} />
    <div style={{display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12}}>{["purpose","steel","handleMaterial","sheathMaterial","equipment","certificateText"].map(k=><input key={k} className="input" name={k} placeholder={k} defaultValue={product?.[k] ?? ""} />)}</div>
    <div style={{display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12}}>{["bladeLengthMm","totalLengthMm","spineThicknessMm","weightGrams","hardnessHrc","productionTimeDays","sortOrder"].map(k=><input key={k} className="input" name={k} placeholder={k} defaultValue={product?.[k] ?? ""} />)}</div>
    <label><input type="checkbox" name="engravingAvailable" defaultChecked={product?.engravingAvailable} /> Гравировка доступна</label><label><input type="checkbox" name="isFeatured" defaultChecked={product?.isFeatured} /> Избранный товар</label>
    <input className="input" name="seoTitle" placeholder="SEO title" defaultValue={product?.seoTitle ?? ""} /><input className="input" name="seoDescription" placeholder="SEO description" defaultValue={product?.seoDescription ?? ""} />
    <button className="btn">Сохранить</button>
  </form>;
}
