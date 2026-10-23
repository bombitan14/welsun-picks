export function safeLink(value: string, fallback: string): string {
  const candidate = value.trim();

  if (candidate.startsWith('/') && !candidate.startsWith('//')) {
    return candidate;
  }

  try {
    const url = new URL(candidate);
    if (url.protocol === 'http:' || url.protocol === 'https:') {
      return url.toString();
    }
  } catch {
    return fallback;
  }

  return fallback;
}
