import { apiGetServer } from "../../../lib/server-api";
import { ProductForm } from "../../../components/ProductForm";
import { ImageManager } from "../../../components/ImageManager";
export default async function ProductEdit({ params }: { params: Promise<{id:string}> }){ const { id } = await params; const [product,categories] = await Promise.all([apiGetServer<any>(`/admin/products/${id}`), apiGetServer<any[]>('/admin/categories').catch(()=>[])]); return <div style={{display:'grid', gap:24}}><h1>Редактирование товара</h1><ProductForm product={product} categories={categories} /><ImageManager product={product} /></div>; }
