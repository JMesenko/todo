$(document).ready(function() {
    window.setTimeout(initUniHints, 10);
    $(window).resize(hideUniHint);
});

function initUniHints() {
    $('.uni-hint').hide().each(function() {
        var $uniHint = $(this);
        var selector = $uniHint.attr('data-for');
        var $el = selector && selector.length ? $(selector) : $uniHint.parent();
        $el.each(function() {
            var $target = $(this);
            if ($target.hasClass('.uni-hint-linked')) return;
            $target.addClass('uni-hint-linked');

            var $wrapper = false;
            var wrapperId = $target.data('wrapper-id');
            if (wrapperId) $wrapper = $('#' + wrapperId);
            var $trigger;
            if ($target.hasClass('uni-hint-trigger')) {
                $trigger = !$wrapper ? $target : $wrapper;
            } else {
                $trigger = $('<i class="uni-hint-trigger">i</i>');
                if ($wrapper) {
                    $wrapper.after($trigger);
                } else {
                    var $fieldValue = $(this).closest('.field-value');
                    if ($fieldValue.length) {
                        $fieldValue.append($trigger);
                    } else {
                        $target.append($trigger);
                    }
                }
            }
            $trigger.mouseenter(function() {
                showUniHint($(this), $uniHint);
                resetHideUniHint();
            }).mouseleave(function() {
                wantHideUniHint();
            });
        });
    });
}

function showDefaultHint() {
}

function getUniHintTriggerId($el) {
    var id = $el.attr('id');
    if (id && id.length) return id;
    var seed = window['UNI_HINT_TRIGGER_ID'];
    if (!seed) seed = 0;
    id = "uni_hint_trigger_" + seed++;
    $el.attr('id', id);
    window['UNI_HINT_TRIGGER_ID'] = seed;
    return id;
}

function showUniHint($el, $hint) {
    var $popup;
    if ($el.hasClass('uni-hint-trigger-custom') && $.isFunction(window['showUniHintCustom'])) {
        $popup = window['showUniHintCustom']($el, $hint);
    } else {
        $popup = showUniHintRB($el, $hint);
        if (!$popup) $popup = showUniHintRT($el, $hint);
        if (!$popup) $popup = showUniHintT($el, $hint);
        if (!$popup) $popup = showUniHintB($el, $hint);
        if (!$popup) $popup = showUniHintL($el, $hint);
    }
    if ($popup instanceof jQuery) {
        $('#uniHintPopupRB,#uniHintPopupRT,#uniHintPopupT,#uniHintPopupB,#uniHintPopupL').not($popup).hide();
        $popup.attr('data-uni-hint-trigger-id', getUniHintTriggerId($el));
        $popup.off('mouseenter').on('mouseenter', function() {
            resetHideUniHint();
        });
        $popup.off('mouseleave click').on('mouseleave click', function() {
            wantHideUniHint();
        });
    }
}

function resetHideUniHint() {
    if (window['UNI_HINT_HIDE_TIMEOUT_ID']) window.clearTimeout(window['UNI_HINT_HIDE_TIMEOUT_ID']);
}

function wantHideUniHint() {
    resetHideUniHint();
    window['UNI_HINT_HIDE_TIMEOUT_ID'] = window.setTimeout(hideUniHint, 100);
}

function uniHintInViewPort($popup, x, y) {
    var left = x - $(window).scrollLeft();
    var top = y - $(window).scrollTop();
    if (left < 0 || top < 0) return false;
    var right = left + $popup.outerWidth();
    var bottom = top + $popup.outerHeight();
    if (right > $(window).width() || bottom > $(window).height()) return false;
    $popup.css({
        'top': y + 'px',
        'left': x + 'px'
    }).show();
    return $popup;
}

function showUniHintRB($el, $hint) {
    var $popup = $('#uniHintPopupRB');
    if (!$popup.length) {
        var html = '<div class="uni-hint-popup uni-hint-popup-right-bottom" id="uniHintPopupRB"></div>';
        $popup = $(html);
        $('body').append($popup);
    }
    $popup.html($hint.html());
    var height = $el.outerHeight();
    if (height > 26) height = 26;
    var top = $el.offset().top - height / 2 - 10;
    var left = $el.offset().left + $el.outerWidth() + 15;
    if (!$el.is('i')) top += 10;
    return uniHintInViewPort($popup, left, top);
}

function showUniHintRT($el, $hint) {
    var $popup = $('#uniHintPopupRT');
    if (!$popup.length) {
        var html = '<div class="uni-hint-popup uni-hint-popup-right-top" id="uniHintPopupRT"></div>';
        $popup = $(html);
        $('body').append($popup);
    }
    $popup.html($hint.html());
    var height = $el.outerHeight();
    if (height > 26) height = 26;
    var top = $el.offset().top + height / 2 + 25 - $popup.outerHeight();
    var left = $el.offset().left + $el.outerWidth() + 15;
    return uniHintInViewPort($popup, left, top);
}

function showUniHintL($el, $hint) {
    var $popup = $('#uniHintPopupL');
    if (!$popup.length) {
        var html = '<div class="uni-hint-popup uni-hint-popup-left" id="uniHintPopupL"></div>';
        $popup = $(html);
        $('body').append($popup);
    }
    $popup.html($hint.html());
    var height = $el.outerHeight();
    if (height > 26) height = 26;
    var top = $el.offset().top - height / 2 - 10;
    var left = $el.offset().left - $popup.outerWidth() - 15;
    if (!$el.is('i')) top += 10;
    return uniHintInViewPort($popup, left, top);
}

function showUniHintT($el, $hint) {
    var $popup = $('#uniHintPopupT');
    if (!$popup.length) {
        var html = '<div class="uni-hint-popup uni-hint-popup-top" id="uniHintPopupT"></div>';
        $popup = $(html);
        $('body').append($popup);
    }
    $popup.html($hint.html());
    var top = $el.offset().top - $popup.outerHeight() - 12;
    var left = $el.offset().left - $popup.outerWidth() + $el.outerWidth();
    return uniHintInViewPort($popup, left, top);
}

function showUniHintB($el, $hint) {
    var $popup = $('#uniHintPopupB');
    if (!$popup.length) {
        var html = '<div class="uni-hint-popup uni-hint-popup-bottom" id="uniHintPopupB"></div>';
        $popup = $(html);
        $('body').append($popup);
    }
    $popup.html($hint.html());
    var top = $el.offset().top + $el.outerHeight() + 12;
    var left = $el.offset().left - $popup.outerWidth() + $el.outerWidth();
    return uniHintInViewPort($popup, left, top);
}

function hideUniHint() {
    window['UNI_HINT_HIDE_TIMEOUT_ID'] = false;
    $('#uniHintPopupRB').hide();
    $('#uniHintPopupRT').hide();
    $('#uniHintPopupT').hide();
    $('#uniHintPopupB').hide();
    $('#uniHintPopupL').hide();
    $('#uniHintPopupCustom').hide();
}
