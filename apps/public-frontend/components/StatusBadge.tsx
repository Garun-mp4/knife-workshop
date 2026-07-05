import { statusLabel, type ProductStatus } from "@knife/shared";

export function StatusBadge({ status }: { status: ProductStatus }) {
  return <span className="status-badge">{statusLabel[status]}</span>;
}
