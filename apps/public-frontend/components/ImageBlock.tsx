export function ImageBlock({
  src,
  alt,
  title,
  ratio = "16 / 9",
  className = "",
  priority = false
}: {
  src: string;
  alt?: string;
  title?: string;
  ratio?: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <figure className={`image-block ${className}`} style={{ aspectRatio: ratio }}>
      <img src={src} alt={alt ?? title ?? ""} width={1200} height={ratio === "4 / 3" ? 900 : 675} loading={priority ? "eager" : "lazy"} />
    </figure>
  );
}
