(function($) {

    var uniqueId = 0;

    function getUniqueId($obj) {
        if ($obj && $obj.attr('id')) {
            return $obj.attr('id');
        } else {
            var result = "uni_text_" + uniqueId++;
            if ($obj) $obj.attr('id', result);
            return result;
        }
    }

    var oldAttr = $.fn.attr;
    $.fn.attr = function(name, value) {
        var result = oldAttr.apply(this, arguments);
        if (name === "disabled" && value) {
            $(this).each(function() {
                if (this.params && this.params.uni_text) {
                    var $obj = $(this);
                    var wrapperId = $obj.data('wrapper-id');
                    var $wrapper = $('#' + wrapperId);
                    $wrapper.addClass('disabled');
                }
            });
        } else if (name === "readonly" && value) {
            $(this).each(function() {
                if (this.params && this.params.uni_text) {
                    var $obj = $(this);
                    var wrapperId = $obj.data('wrapper-id');
                    var $wrapper = $('#' + wrapperId);
                    $wrapper.addClass('readonly');
                }
            });
        }
        return result;
    }

    var oldRemoveAttr = $.fn.removeAttr;
    $.fn.removeAttr = function(name) {
        if (name === "disabled") {
            $(this).each(function() {
                if (this.params && this.params.uni_text) {
                    var $obj = $(this);
                    var wrapperId = $obj.data('wrapper-id');
                    var $wrapper = $('#' + wrapperId);
                    $wrapper.removeClass('disabled');
                }
            });
        } else if (name === "readonly") {
            $(this).each(function() {
                if (this.params && this.params.uni_text) {
                    var $obj = $(this);
                    var wrapperId = $obj.data('wrapper-id');
                    var $wrapper = $('#' + wrapperId);
                    $wrapper.removeClass('readonly');
                }
            });
        }
        return oldRemoveAttr.apply(this, arguments);
    }

    var oldShow = $.fn.show;
    $.fn.show = function() {
        var result = oldShow.apply(this);
        $(this).each(function() {
            if (this.params && this.params.uni_text) {
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
            if (this.params && this.params.uni_text) {
                var $obj = $(this);
                var wrapperId = $obj.data('wrapper-id');
                var $wrapper = $('#' + wrapperId);
                $wrapper.hide();
            }
        });
        return result;
    }

    $.fn.uni_text = function(options) {

        return this.each(function(){

            var $obj = $(this);

            var defaults = {
                uni_text: true
            }

            if ($obj.hasClass('inp-std')) return;
            if (this.params && this.params.uni_text) return;
            this.params = $.extend(defaults, options, this.params);

            var wrapperClass;
            var objHeight = false;
            if ($obj.is('textarea')) {
                wrapperClass = 'textarea';
                if ($obj.attr('rows') || $obj.attr('height')) {
                    objHeight = getTextareaHeight($obj);
                } else {
                    objHeight = 100;
                }
            } else if ($obj.is('input[type="search"]')) {
                wrapperClass = 'input-search';
            } else {
                wrapperClass = 'input-text';
            }

            var $div = $obj.parent().parent();
            if (!$div.is('div.inp-nalog')) {
                var resetId = getUniqueId();
                $div = $('<div><div><b id="' + resetId + '"></b></div></div>');
                $div.addClass('inp-nalog').addClass(wrapperClass);
                $obj.after($div);
                $obj.prependTo($div.children());
                if (objHeight) {
                    $obj.css('height', objHeight + 'px');
                    var wrapperHeight = $obj.outerHeight() + 2;
                    $div.css('height', wrapperHeight + 'px');
                    $div.children('div').css('height', wrapperHeight + 'px');
                }
                if (wrapperClass == 'input-search') {
                    var $btn = $('<a href="#"></a>');
                    $btn.appendTo($div.children());
                    var buttonId = getUniqueId($btn);
                    $obj.data('button-id', buttonId);
                    $btn.click(function() {
                        $obj.focus();
                        $obj.closest('form').submit();
                        return false;
                    });
                }
                var $reset = $('#' + resetId);
                $reset.click(function() {
                    if ($obj.val() != '') $obj.val('').trigger('change');
                    $obj.focus();
                    return false;
                });
            }

            // Перетаскиваем классы начинающиеся на 'txt-'
            var cls = $obj.attr('class');
            if (cls) {
                var clss = cls.split(' ');
                for (var i = 0; i < clss.length; i++) {
                    if (clss[i].indexOf('txt-') == 0) $div.addClass(clss[i]);
                }
            }

            var divId = getUniqueId($div);
            $obj.data('wrapper-id', divId);
            $div.toggleClass('disabled', $obj.is(':disabled'));
            $div.toggleClass('readonly', $obj.is('[readonly]'));
            $div.toggle($obj.css('display') != 'none');

            $obj.focus(function() {
                $div.addClass('inp-focus');
            });

            $obj.blur(function() {
                $div.removeClass('inp-focus');
            });

            if ($.fn.is_input) {
                if ($obj.hasClass('txt-numeric')) {
                    $obj.is_input({
                        regexp: /^\d*$/,
                        hint: 'Вы пытаетесь ввести недопустимые символы.\nРазрешается вводить только цифры.'
                    });
                } else if ($obj.hasClass('txt-sum')) {
                    $obj.is_input({
                        regexp: /^\d*\.{0,1}\d{0,2}$/,
                        hint: 'Вы пытаетесь ввести недопустимые символы.\nРазрешается вводить только цифры.\nВ качестве разделителя рублей и копеек используйте точку, например: 123.45'
                    });
                } else if ($obj.hasClass('txt-number')) {
                    $obj.is_input({
                        regexp: /^\-{0,1}\d*\.{0,1}\d*$/,
                        hint: 'Вы пытаетесь ввести недопустимые символы.\nРазрешается вводить только цифры.\nВ качестве разделителя целой и дробной частей используйте точку, например: 123.45'
                    });
                }
            }
        });

        function getTextareaHeight($obj) {
            var $clone = $obj.clone();
            var result = $clone.appendTo('body').show().outerHeight();
            $clone.remove();
            return result;
        }
    }

})(jQuery);
