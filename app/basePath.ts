export const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

export function getAssetPath(path: string): string {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  if (basePath && cleanPath.startsWith(basePath)) return cleanPath;
  return `${basePath}${cleanPath}`;
}
