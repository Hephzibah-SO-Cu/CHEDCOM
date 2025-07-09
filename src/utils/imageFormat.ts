// utils/imageFormat.ts
export function toNextGenUrl(
  url: string,
  format: 'webp' | 'avif' = 'webp'
): string {
  if (!url || typeof url !== 'string') return url;

  const preferredFormat =
    (process.env.NEXT_PUBLIC_IMAGE_FORMAT as 'webp' | 'avif') || format;

  const extMatch = url.match(/\.(jpg|jpeg|png)(\?.*)?$/i);
  if (!extMatch) return url;

  return url.replace(
    /\.(jpg|jpeg|png)(\?.*)?$/i,
    `.${preferredFormat}${extMatch[2] || ''}`
  );
}
