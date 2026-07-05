import Link from "next/link";

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <strong>Knife Workshop</strong>
          <p>
            Законные кухонные, хозяйственно-бытовые, туристические, подарочные и декоративные изделия ручной
            работы.
          </p>
        </div>
        <nav className="footer-links" aria-label="Дополнительная навигация">
          <Link href="/delivery-payment">Доставка и оплата</Link>
          <Link href="/documents">Документы</Link>
          <Link href="/privacy-policy">Конфиденциальность</Link>
        </nav>
      </div>
    </footer>
  );
}
