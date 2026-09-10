/**
 * Throws unless `value` is an absolute http(s) URL. Open Graph scrapers
 * (Facebook, X, LinkedIn, Slack, iMessage) only fetch absolute `og:image`/
 * `og:url` values - a relative or protocol-relative value produces a card
 * with no image and no error anywhere in the build.
 */
export function assertAbsoluteUrl(value: string, propName: string): void {
  let parsed: URL;
  try {
    parsed = new URL(value);
  } catch {
    throw new Error(invalidUrlMessage(propName, value));
  }
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    throw new Error(invalidUrlMessage(propName, value));
  }
}

function invalidUrlMessage(propName: string, value: string): string {
  return `OgMeta's \`${propName}\` prop must be an absolute http(s) URL, got "${value}". Open Graph scrapers don't fetch relative or protocol-relative URLs.`;
}
