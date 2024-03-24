$(document).ready(function () {
    var isSecure = location.protocol === 'https:';
    var currentLang = window['UNI_I18N_LANG'];
    if (window['UNI_I18N']) {
        var $topBar = $('#uniTopBar');
        if (!$topBar.length) return;
        var html = [];
        html.push('<ul class="i18n-selector i18n-selector-' + currentLang.toLowerCase() + '">');
        $.each(['RUS', 'ENG'], function (i, lang) {
            if (lang === currentLang) {
                setLangCookie(lang);
                html.push('<li><span></span></li>');
            } else {
                html.push('<li><a href="#" data-lang="' + lang + '"></a></li>');
            }
        });
        html.push('</ul>');
        var $ul = $(html.join(''));
        $topBar.append($ul);
        $ul.find('a').click(function () {
            var lang = $(this).attr('data-lang');
            setLangCookie(lang);
            var url = removeQueryParam(location.href, 'lang');
            url = setQueryParam(url, 't', new Date().getTime() + '');
            location.replace(url);
            return false;
        });
    } else if (currentLang === 'ENG') {
        setLangCookie('RUS');
        var url = setQueryParam(location.href, 'lang', 'RUS');
        url = setQueryParam(url, 't', new Date().getTime() + '')
        location.replace(url);
    }

    function setLangCookie(lang) {
        if (isSecure) {
            Cookies.set('uniI18nLang', lang, {
                expires: 365,
                secure: true
            });
        } else {
            Cookies.set('uniI18nLang', lang, {
                expires: 365
            });
        }
    }
});
