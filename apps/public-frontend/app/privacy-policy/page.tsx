import { apiGet } from "../../lib/api";

export const metadata = { title: "Политика конфиденциальности" };

export default async function Privacy() {
  const page = await apiGet<any>("/public/pages/privacy-policy").catch(() => null);

  return (
    <main className="section">
      <div className="container">
        <div className="page-intro">
          <p className="section-kicker">Конфиденциальность</p>
          <h1 className="page-title">Политика конфиденциальности</h1>
        </div>
        <div className="prose-dark">
          <p>
            {page?.content ||
              "Отправляя форму, вы соглашаетесь на обработку персональных данных для связи по вашей заявке."}
          </p>
        </div>
      </div>
    </main>
  );
}
