export function formatSize(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return "0 KB";
  }

  const kilobyte = 1024;
  const megabyte = kilobyte * 1024;
  const gigabyte = megabyte * 1024;

  if (bytes >= gigabyte) {
    return `${(bytes / gigabyte).toFixed(2).replace(/\.00$/, "")} GB`;
  }

  if (bytes >= megabyte) {
    return `${(bytes / megabyte).toFixed(2).replace(/\.00$/, "")} MB`;
  }

  return `${(bytes / kilobyte).toFixed(2).replace(/\.00$/, "")} KB`;
}

export const generateUUID = () => crypto.randomUUID();
