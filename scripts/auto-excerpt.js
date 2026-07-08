/* global hexo */

const MORE_TAG = /<!-- ?more ?-->/i;
const MAX_EXCERPT_LENGTH = 200;

function stripHtml(html) {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function buildExcerpt(content) {
  const intro = content.split(/<h[1-6][^>]*>/i)[0].trim();
  const source = intro || content;
  const plain = stripHtml(source);

  if (!plain) return '';
  if (plain.length <= MAX_EXCERPT_LENGTH) {
    return source;
  }

  const truncated = plain
    .substring(0, MAX_EXCERPT_LENGTH)
    .replace(/\s+\S*$/, '')
    .concat('…');

  return `<p>${truncated}</p>`;
}

hexo.extend.filter.register('after_post_render', (data) => {
  if (data.layout !== 'post') return;
  if (data.excerpt) return;
  if (!data.content || MORE_TAG.test(data._content || '')) return;

  const excerpt = buildExcerpt(data.content);
  if (excerpt) {
    data.excerpt = excerpt;
  }
}, 20);
