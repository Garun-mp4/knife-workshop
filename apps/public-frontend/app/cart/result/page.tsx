import { Suspense } from "react";
import { CartResultClient } from "../../../components/CartResultClient";

export const metadata = { title: "Статус оплаты" };

export default function CartResultPage() {
  return (
    <main>
      <Suspense fallback={null}>
        <CartResultClient />
      </Suspense>
    </main>
  );
}
