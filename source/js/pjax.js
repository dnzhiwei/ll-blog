(function() {
    // eslint-disable-next-line no-unused-vars
    let pjax;

    function resetPageStyles() {
        document.querySelectorAll('body > .navbar, body > .section, body > .footer').forEach(function(el) {
            el.style.opacity = '1';
            el.style.transform = '';
            el.style.transition = '';
        });
        document.querySelectorAll(
            '.column-main > .card, .column-main > .pagination, .column-main > .post-navigation,' +
            '.column-left > .card, .column-right-shadow > .card, .column-right > .card'
        ).forEach(function(el) {
            el.style.opacity = '1';
            el.style.transform = '';
            el.style.transition = '';
        });
    }

    function initPjax() {
        try {
            const Pjax = window.Pjax || function() {};
            pjax = new Pjax({
                elements: 'a[href]:not([data-tools-newtab]), form[action]',
                selectors: [
                    // 不用通配 [data-pjax]，避免 PJAX 替换 head 里的 stylesheet 导致样式丢失
                    'script[data-pjax]',
                    '.pjax-reload',
                    'head title',
                    '.columns',
                    '.navbar-start',
                    '.navbar-end',
                    '.searchbox link',
                    '.searchbox script',
                    '#back-to-top',
                    '#comments link',
                    '#comments script'
                ],
                cacheBust: false
            });
        } catch (e) {
            console.warn('PJAX error: ' + e);
        }
    }

    document.addEventListener('pjax:send', resetPageStyles);

    document.addEventListener('pjax:complete', function() {
        resetPageStyles();
    });

    document.addEventListener('DOMContentLoaded', function() {
        resetPageStyles();
        initPjax();
    });

    document.addEventListener('click', function(e) {
        const link = e.target.closest('a[data-tools-newtab]');
        if (!link) return;
        e.preventDefault();
        e.stopPropagation();
        window.open(link.href, '_blank', 'noopener,noreferrer');
    }, true);
}());
