import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { beforeAll, describe, expect, it } from 'vitest';
import OgMeta from '../src/components/OgMeta.astro';

const baseProps = {
  title: 'A title',
  description: 'A description',
  image: 'https://example.com/card.png',
  url: 'https://example.com/post/',
  siteName: 'Example',
};

describe('OgMeta', () => {
  let container: AstroContainer;

  beforeAll(async () => {
    container = await AstroContainer.create();
  });

  const render = (props: Record<string, unknown> = {}) =>
    container.renderToString(OgMeta, { props: { ...baseProps, ...props } });

  it('renders the core Open Graph and Twitter tags with default card dimensions', async () => {
    const html = await render();
    expect(html).toContain('<meta property="og:title" content="A title"');
    expect(html).toContain('<meta property="og:image" content="https://example.com/card.png"');
    expect(html).toContain('<meta property="og:image:width" content="1200"');
    expect(html).toContain('<meta property="og:image:height" content="630"');
    expect(html).toContain('<meta name="twitter:card" content="summary_large_image"');
  });

  it('throws when image is a relative URL', async () => {
    await expect(render({ image: '/card.png' })).rejects.toThrow(/`image` prop must be an absolute http\(s\) URL/);
  });

  it('throws when url is a relative URL', async () => {
    await expect(render({ url: '/post/' })).rejects.toThrow(/`url` prop must be an absolute http\(s\) URL/);
  });

  it('emits article times only when type is article', async () => {
    const times = { publishedTime: '2026-01-01T00:00:00Z', modifiedTime: '2026-02-01T00:00:00Z' };

    const article = await render({ type: 'article', ...times });
    expect(article).toContain('property="article:published_time" content="2026-01-01T00:00:00Z"');
    expect(article).toContain('property="article:modified_time" content="2026-02-01T00:00:00Z"');

    const website = await render({ type: 'website', ...times });
    expect(website).not.toContain('article:published_time');
    expect(website).not.toContain('article:modified_time');
  });

  it('defaults imageAlt to the title and honors an explicit imageAlt', async () => {
    const defaulted = await render();
    expect(defaulted).toContain('property="og:image:alt" content="A title"');
    expect(defaulted).toContain('name="twitter:image:alt" content="A title"');

    const explicit = await render({ imageAlt: 'Custom alt' });
    expect(explicit).toContain('property="og:image:alt" content="Custom alt"');
    expect(explicit).toContain('name="twitter:image:alt" content="Custom alt"');
  });
});
