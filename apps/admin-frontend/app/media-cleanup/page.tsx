export default function MediaCleanup() {
  return (
    <div className="page-stack">
      <div className="page-intro-admin">
        <p className="eyebrow">Хранилище</p>
        <h1>Медиа</h1>
        <p className="muted">Контроль фоновой очистки изображений товара.</p>
      </div>
      <div className="card detail-card">
        <p>
          Фоновый worker каждые 30 минут ставит в очередь изображения, помеченные для удаления. В MVP потерянные
          файлы только логируются и обрабатываются безопасно, без агрессивного удаления.
        </p>
      </div>
    </div>
  );
}
