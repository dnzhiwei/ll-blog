/* global hexo */

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function isExternal(item) {
  if (item.external === true) return true;
  if (item.external === false) return false;
  return /^https?:\/\//i.test(item.url);
}

function renderIcon(icon) {
  if (!icon) {
    return '<span class="tools-card-icon tools-card-icon--default"><i class="fas fa-link"></i></span>';
  }
  if (/^https?:\/\//i.test(icon) || icon.startsWith('/')) {
    return `<img class="tools-card-icon-img" src="${escapeHtml(icon)}" alt="" loading="lazy">`;
  }
  return `<span class="tools-card-icon"><i class="${escapeHtml(icon)}"></i></span>`;
}

function resolveUrl(url) {
  if (/^https?:\/\//i.test(url)) return url;
  const base = String(hexo.config.url || '').replace(/\/$/, '');
  return url.startsWith('/') ? base + url : `${base}/${url}`;
}

function renderItem(item) {
  const external = isExternal(item);
  const href = external ? resolveUrl(item.url) : item.url;
  const attrs = external
    ? ' target="_blank" rel="noopener noreferrer" data-pjax="0" data-tools-newtab="true"'
    : '';
  return `<a class="tools-card" href="${escapeHtml(href)}"${attrs} title="${escapeHtml(item.desc || item.title)}">
    ${renderIcon(item.icon)}
    <span class="tools-card-body">
      <span class="tools-card-title">${escapeHtml(item.title)}</span>
      <span class="tools-card-desc">${escapeHtml(item.desc || '')}</span>
    </span>
    <span class="tools-card-corner"></span>
  </a>`;
}

function renderSection(section, index) {
  const sectionId = section.id || `section-${index}`;
  const tabs = section.tabs || [];
  const tabNav = tabs.map((tab, tabIndex) => {
    const active = tabIndex === 0 ? ' is-active' : '';
    return `<button type="button" class="tools-tab${active}" data-section="${escapeHtml(sectionId)}" data-tab="${tabIndex}">${escapeHtml(tab.name)}</button>`;
  }).join('');

  const tabPanels = tabs.map((tab, tabIndex) => {
    const hidden = tabIndex === 0 ? '' : ' is-hidden';
    const items = (tab.items || []).map(renderItem).join('');
    return `<div class="tools-panel${hidden}" data-section="${escapeHtml(sectionId)}" data-tab="${tabIndex}">
      <div class="tools-grid">${items}</div>
    </div>`;
  }).join('');

  return `<section class="tools-section" id="${escapeHtml(sectionId)}">
    <h2 class="tools-section-title"><i class="${escapeHtml(section.icon || 'fas fa-folder')}"></i>${escapeHtml(section.title)}</h2>
    <div class="tools-tabs" role="tablist">${tabNav}</div>
    <div class="tools-panels">${tabPanels}</div>
  </section>`;
}

function renderToolsPage(data) {
  const sections = (data && data.sections) || [];
  const content = sections.map(renderSection).join('');
  return `<div class="tools-page">${content}</div>`;
}

const TOOLS_CSS = `
.tools-page .tools-section { margin-bottom: 2.5rem; }
.tools-page .tools-section-title {
  display: flex; align-items: center; gap: .5rem;
  font-size: 1.25rem; font-weight: 600; margin-bottom: 1rem; color: #363636;
}
.tools-page .tools-section-title i { color: #3273dc; }
.tools-page .tools-tabs {
  display: flex; flex-wrap: wrap; gap: .5rem 1.25rem;
  border-bottom: 1px solid #ededed; margin-bottom: 1.25rem; padding-bottom: .5rem;
}
.tools-page .tools-tab {
  background: none; border: none; cursor: pointer;
  font-size: .95rem; color: #7a7a7a; padding: .25rem 0;
  position: relative; transition: color .2s;
}
.tools-page .tools-tab:hover { color: #3273dc; }
.tools-page .tools-tab.is-active { color: #3273dc; font-weight: 600; }
.tools-page .tools-tab.is-active::after {
  content: ''; position: absolute; left: 0; right: 0; bottom: -.55rem;
  height: 2px; background: #3273dc; border-radius: 1px;
}
.tools-page .tools-panel.is-hidden { display: none; }
.tools-page .tools-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1rem;
}
.tools-page .tools-card {
  display: flex; align-items: flex-start; gap: .75rem;
  padding: .85rem 1rem; background: #fff;
  border: 1px solid #f0f0f0; border-radius: 8px;
  text-decoration: none !important; color: inherit !important;
  position: relative; overflow: hidden;
  transition: box-shadow .2s, border-color .2s, transform .2s;
  min-height: 72px;
}
.tools-page .tools-card:hover {
  border-color: #dbdbdb;
  box-shadow: 0 4px 12px rgba(10,10,10,.08);
  transform: translateY(-1px);
}
.tools-page .tools-card-icon,
.tools-page .tools-card-icon--default {
  flex-shrink: 0; width: 36px; height: 36px;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.35rem; color: #3273dc;
}
.tools-page .tools-card-icon-img {
  width: 36px; height: 36px; object-fit: contain; border-radius: 6px;
}
.tools-page .tools-card-body { flex: 1; min-width: 0; }
.tools-page .tools-card-title {
  display: block; font-weight: 600; font-size: .95rem;
  color: #363636; margin-bottom: .2rem;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.tools-page .tools-card-desc {
  display: block; font-size: .8rem; color: #999;
  line-height: 1.4;
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;
  overflow: hidden;
}
.tools-page .tools-card-corner {
  position: absolute; top: 0; right: 0;
  width: 0; height: 0;
  border-top: 10px solid #f5f5f5;
  border-left: 10px solid transparent;
}
.tools-page .tools-card:hover .tools-card-corner { border-top-color: #ebebeb; }
body.tools-page-active .card-content.article > h1.title,
.card-content.article:has(.tools-page) > h1.title { display: none; }
.card-content.article:has(.tools-page) .article-licensing { display: none; }
@media (max-width: 768px) {
  .tools-page .tools-grid { grid-template-columns: 1fr; }
}
`;

const TOOLS_JS = `
(function () {
  function bindToolsTabs() {
    document.querySelectorAll('.tools-tab').forEach(function (btn) {
      if (btn.dataset.toolsTabBound) return;
      btn.dataset.toolsTabBound = 'true';
      btn.addEventListener('click', function () {
        var section = btn.getAttribute('data-section');
        var tab = btn.getAttribute('data-tab');
        document.querySelectorAll('.tools-tab[data-section="' + section + '"]').forEach(function (b) {
          b.classList.remove('is-active');
        });
        btn.classList.add('is-active');
        document.querySelectorAll('.tools-panel[data-section="' + section + '"]').forEach(function (panel) {
          panel.classList.toggle('is-hidden', panel.getAttribute('data-tab') !== tab);
        });
      });
    });
  }

  function bindToolsNewTab() {
    document.querySelectorAll('a.tools-card[data-tools-newtab]').forEach(function (link) {
      if (link.dataset.toolsNewtabBound) return;
      link.dataset.toolsNewtabBound = 'true';
      link.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        window.open(link.href, '_blank', 'noopener,noreferrer');
      }, true);
    });
  }

  function initToolsPage() {
    bindToolsTabs();
    bindToolsNewTab();
  }

  initToolsPage();
  document.addEventListener('pjax:complete', initToolsPage);
})();
`;

hexo.extend.tag.register('tools_page', function () {
  const data = hexo.locals.get('data').tools;
  return `<style>${TOOLS_CSS}</style>${renderToolsPage(data)}<script>${TOOLS_JS}</script>`;
});
