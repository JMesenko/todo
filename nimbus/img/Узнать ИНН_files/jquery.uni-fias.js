(function($) {

    var uniqueId = 0;

    function getUniqueId($obj) {
        if ($obj && $obj.attr('id')) {
            return $obj.attr('id');
        } else {
            var result = "uni_fias_" + uniqueId++;
            if ($obj) $obj.attr('id', result);
            return result;
        }
    }

    var oldAttr = $.fn.attr;
    $.fn.attr = function(name, value) {
        var result = oldAttr.apply(this, arguments);
        if (name === "disabled" && value) {
            $(this).each(function() {
                if (this.params && this.params.uni_kladr) {
                    var $obj = $(this);
                    var wrapperId = $obj.data('wrapper-id');
                    var $wrapper = $('#' + wrapperId);
                    $wrapper.addClass('disabled');
                }
            });
        }
        return result;
    }

    var oldRemoveAttr = $.fn.removeAttr;
    $.fn.removeAttr = function(name) {
        if (name === "disabled") {
            $(this).each(function() {
                if (this.params && this.params.uni_kladr) {
                    var $obj = $(this);
                    var wrapperId = $obj.data('wrapper-id');
                    var $wrapper = $('#' + wrapperId);
                    $wrapper.removeClass('disabled');
                }
            });
        }
        return oldRemoveAttr.apply(this, arguments);
    }

    var oldShow = $.fn.show;
    $.fn.show = function() {
        var result = oldShow.apply(this);
        $(this).each(function() {
            if (this.params && this.params.uni_kladr) {
                var $obj = $(this);
                var wrapperId = $obj.data('wrapper-id');
                var $wrapper = $('#' + wrapperId);
                $wrapper.show();
            }
        });
        return result;
    }

    var oldHide = $.fn.hide;
    $.fn.hide = function() {
        var result = oldHide.apply(this);
        $(this).each(function() {
            if (this.params && this.params.uni_kladr) {
                var $obj = $(this);
                var wrapperId = $obj.data('wrapper-id');
                var $wrapper = $('#' + wrapperId);
                $wrapper.hide();
            }
        });
        return result;
    }

    $.fn.uni_fias = function(options) {

        return this.each(function(){

            var $obj = $(this);

            var defaults = {
                uni_text: true,
                uni_fias: true
            }

            if (this.params && this.params.uni_fias) return;
            this.params = $.extend(defaults, options, this.params);

            var wrapperClass = 'input-enum';

            var $div = $obj.parent().parent();
            if (!$div.is('div.' + wrapperClass)) {
                $div = $('<div><div></div></div>');
                $div.addClass(wrapperClass);
                $obj.after($div);
                $obj.appendTo($div.children());
            }

            var $btn = $div.children().children('a');
            if (!$btn.length) {
                $btn = $('<a href="#"></a>');
                $btn.appendTo($div.children());
            }

            // Перетаскиваем классы начинающиеся на 'txt-'
            var cls = $obj.attr('class');
            if (cls) {
                var clss = cls.split(' ');
                for (var i = 0; i < clss.length; i++) {
                    if (clss[i].indexOf('txt-') == 0) $div.addClass(clss[i]);
                }
            }

            var inpId = getUniqueId($obj);
            var divId = getUniqueId($div);
            var btnId = getUniqueId($btn);

            $obj.data('wrapper-id', divId);
            $obj.data('button-id', btnId);
            $obj.attr('readonly', 'readonly');
            $div.toggleClass('disabled', $obj.is(':disabled'));
            $div.toggle($obj.css('display') != 'none');

            $btn.data('input-id', inpId).click(showDialog);
            $obj.data('input-id', inpId).click(showDialog);
        });
    }

    function showDialog() {
        var inpId = $(this).data('input-id');
        var $inp = $('#' + inpId);
        if ($inp.is(':disabled')) return false;
        var url = '/static/fias-dialog.html?inp=' + encodeURIComponent(inpId);
        showUniDialog(url, 830, 630, true, $inp);
        return false;
    }
})(jQuery);
