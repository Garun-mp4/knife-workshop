"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { apiSend } from "../../lib/api";
export default function Login() { const router=useRouter(); const [error,setError]=useState(""); async function submit(formData:FormData){ setError(""); try{ await apiSend('/auth/login','POST',Object.fromEntries(formData.entries())); router.push('/dashboard'); }catch(e:any){setError(e.message)} } return <main style={{minHeight:"100vh", display:"grid", placeItems:"center", padding:24}}><form action={submit} className="card" style={{width:"min(420px,100%)", padding:28, display:"grid", gap:14}}><h1>Вход в админку</h1><input className="input" name="email" type="email" placeholder="Email" required /><input className="input" name="password" type="password" placeholder="Пароль" required minLength={10}/>{error && <p style={{color:'#DC2626'}}>{error}</p>}<button className="btn">Войти</button></form></main> }
