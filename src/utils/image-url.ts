import { API_URL } from '@/constants/config';

export function resolveImageUrl(url?: string | null): string | null {
  if (!url) return null;
  if (
    url.startsWith('http') ||
    url.startsWith('file:') ||
    url.startsWith('blob:')
  ) {
    return url;
  }
  return `${API_URL}${url}`;
}
