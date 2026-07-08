/* global hexo */

hexo.extend.injector.register('head-end', () => {
  return [
    '<link rel="stylesheet" href="/css/brand.css">',
    '<link rel="icon" type="image/png" sizes="32x32" href="/img/favicon-32.png">',
    '<link rel="icon" type="image/png" sizes="64x64" href="/img/favicon.png">',
    '<link rel="apple-touch-icon" sizes="180x180" href="/img/avatar.png">',
  ].join('');
});
