export function ImageBlock({
  src,
  alt,
  title,
  ratio = "16 / 9",
  className = ""
}: {
  src: string;
  alt?: string;
  title?: string;
  ratio?: string;
  className?: string;
}) {
  return (
    <figure className={`image-block ${className}`} style={{ aspectRatio: ratio }}>
      <img src={src} alt={alt ?? title ?? ""} />
    </figure>
  );
}
