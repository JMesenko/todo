function i18n(s) {
    return s;
}

$(document).ready(function () {

    if (window.UNI_I18N_LANG) $('body').addClass('i18n-' + window.UNI_I18N_LANG);

    upgradePageTopBar();
    upgradePageMenu();
    upgradePageTitle();
    upgradePageFooter();

    $('#uniPageWrapper').fadeIn(400);
    $('#uniPageFooter').fadeIn(400);

    window.setInterval(window_resize, 500);
    $(window).on('scroll resize', window_resize);

    function window_resize() {
        var pageHeaderFixed = $('#uniMarkGm2').css('display') != 'block' && $(window).scrollTop() > 85;
        $('#uniPageWrapper').toggleClass('page-header-fixed', pageHeaderFixed);
        var $footer = $('#uniPageFooter');
        var $wrapper = $('#uniPageWrapper');
        var marginBottom = 0;
        if ($footer.css('position') == 'fixed') {
            var footerHeight = $footer.outerHeight();
            if ($wrapper.outerHeight() + footerHeight > $(window).height()) marginBottom = footerHeight;
        }
        $('#uniPageWrapper').css('margin-bottom', marginBottom + 'px');
    }

    function upgradePageMenu() {
        if ($('#topMenu').length) {
            $('#uniPageHeader .page-menu').append('<a href="#" id="primaryMenuTrigger" class="primary-menu-trigger"></a>');
            $('#primaryMenuTrigger').click(function () {
                $('#topMenu').toggleClass('top-menu-visible');
                return false;
            });
        }
    }

    function upgradePageTopBar() {
        var html = [];
        html.push('<div class="fns-links">');
        html.push('<a href="' + 'https://www.nalog.gov.ru' + '" class="lnk-fns-home">' + 'На сайт ФНС России' + '</a>');
        html.push('</div>');
        html.push('<div class="external-links">');
        html.push('<a href="' + 'https://www.nalog.gov.ru/rn77/apply_fts/' + '" target="_blank" class="lnk-fns-contacts" title="' + 'Контакт-центр ФНС' + ': 8 800 222-22-22"></a>');
        html.push('<div class="clear"></div>');
        html.push('</div>');
        $('#uniTopBar').prepend(html.join(''));
        $('#uniTopBar').append('<div class="clear"></div>');
        $('#uniTopBar').append('<div class="uni-mark-gm2" id="uniMarkGm2"></div>')
    }

    function upgradePageTitle() {
        var html = '<a href="' + (!window['HOME_PAGE'] ? 'index.html' : window['HOME_PAGE']) + '" id="lnkHomePage" class="lnk-home-page"></a>';
        $('#uniPageTitle').wrapInner(html);
    }

    function upgradePageFooter() {
        var html = [];
        html.push('<div class="page-footer-container">');

        html.push('<div class="page-footer-part-1">');
        html.push('<p class="txt-contact-center">');
        html.push('<b>' + 'Контакт-центр ФНС России' + ':</b>');
        html.push('<br/>8 800 222-22-22');
        html.push('<br/><a href="' + 'https://www.nalog.gov.ru/rn77/apply_fts/' + '" target="_blank">' + 'Все контакты' + '</a>');
        html.push('</p>');
        if (window['FEEDBACK_CODE']) {
            html.push('<a class="button btn-with-icon btn-feedback" href="https://www.nalog.gov.ru/rn77/service/service_feedback/?service=' + window['FEEDBACK_CODE'] + '" target="_blank">' + 'Техническая поддержка' + '</a>');
        }
        html.push('</div>');

        html.push('<div class="page-footer-part-2">');
        html.push('<div class="copyright">' + $('#uniPageFooter .copyright').html() + '</div>');
        html.push('<div class="version">' + $('#uniPageFooter .version').html() + '</div>');
        html.push('<div class="external-links">');
        html.push('<a href="' + 'https://www.nalog.gov.ru/rn77/apply_fts/' + '" target="_blank" class="lnk-fns-contacts" title="' + 'Контакт-центр ФНС' + ': 8 800 222-22-22"></a>');
        html.push('<div class="clear"></div>');
        html.push('</div>');
        html.push('<div class="clear"></div>');
        html.push('</div>');

        html.push('<div class="clear"></div>');

        html.push('</div>');

        $('#uniPageFooter').html(html.join(''));
    }
});

function scrollTo($el) {
    if (!$el || !$el.length) return;
    $el = $($el);
    var t = $el.offset().top;
    var h = $el.outerHeight();
    var b = t + h;
    var vpT = $(window).scrollTop();
    var vpH = $(window).height();
    var vpB = vpT + vpH;
    if ($('#uniMarkGm2').css('display') != 'block') t -= $('#uniPageHeader .page-menu-wrapper').outerHeight();
    var st;
    if (t < vpT || t > vpB) {
        st = t;
    } else if (b > vpB && h > vpH) {
        st = t;
    } else if (b > vpB && h < vpH) {
        st = vpT + b - vpB;
    } else {
        st = -1;
    }
    if (st >= 0) {
        window.setTimeout(function () {
            $('html, body').animate({
                scrollTop: st
            });
        }, 100);
    }
}
