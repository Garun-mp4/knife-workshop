import type { Metadata } from "next";
import { AccountClient } from "../../components/AccountClient";

export const metadata: Metadata = {
  title: "Аккаунт",
  description: "Вход, регистрация и профиль пользователя Knife Workshop."
};

export default async function AccountPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const params = await searchParams;
  const initialMode = params.mode === "register" ? "register" : "login";
  return <AccountClient initialMode={initialMode} />;
}
