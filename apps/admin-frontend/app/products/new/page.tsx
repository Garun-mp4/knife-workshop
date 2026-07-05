import { apiGetServer } from "../../../lib/server-api";
import { ProductForm } from "../../../components/ProductForm";
export default async function NewProduct(){ const categories = await apiGetServer<any[]>('/admin/categories').catch(()=>[]); return <div><h1>Новый товар</h1><ProductForm categories={categories} /></div>; }
