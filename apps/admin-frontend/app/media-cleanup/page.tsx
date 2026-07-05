export default function MediaCleanup() {
  return (
    <div className="page-stack">
      <h1>Media cleanup</h1>
      <div className="card detail-card">
        <p>
          Worker каждые 30 минут ставит в очередь изображения с pendingDelete=true. В MVP orphan images только
          логируются/обрабатываются безопасно, без агрессивного удаления.
        </p>
      </div>
    </div>
  );
}
