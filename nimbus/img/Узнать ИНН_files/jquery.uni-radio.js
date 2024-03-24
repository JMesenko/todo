(function($) {

    var uniqueId = 0;

    function getUniqueId() {
        return "unirad_" + uniqueId++;
    }

    var oldAttr = $.fn.attr;
    $.fn.attr = function(name, value) {
        var result = oldAttr.apply(this, arguments);
        if (name === 'checked' && value) {
            $(this).each(function() {
                var $radio = $(this);
                if ($radio.is(':radio')) {
                    var wrapperId = $radio.data('wrapper-id');
                    var $wrapper = $('#' + wrapperId);
                    setRadioClass($wrapper, true, $radio.is(':disabled'));
                }
            });
        } else if (name === 'disabled' && value) {
            $(this).each(function() {
                var $radio = $(this);
                if ($radio.is(':radio')) {
                    var wrapperId = $radio.data('wrapper-id');
                    var $wrapper = $('#' + wrapperId);
                    setRadioClass($wrapper, $radio.is(':checked'), true);
                }
            });
        }
        return result;
    }

    var oldRemoveAttr = $.fn.removeAttr;
    $.fn.removeAttr = function(name) {
        if (name === 'checked') {
            $(this).each(function() {
                var $radio = $(this);
                if ($radio.is(':radio')) {
                    var wrapperId = $radio.data('wrapper-id');
                    var $wrapper = $('#' + wrapperId);
                    setRadioClass($wrapper, false, $radio.is(':disabled'));
                }
            });
        } else if (name === 'disabled') {
            $(this).each(function() {
                var $radio = $(this);
                if ($radio.is(':radio')) {
                    var wrapperId = $radio.data('wrapper-id');
                    var $wrapper = $('#' + wrapperId);
                    setRadioClass($wrapper, $radio.is(':checked'), false);
                }
            });
        }
        return oldRemoveAttr.apply(this, arguments);
    }

    $.fn.uni_radio = function(options) {

        return this.each(function(){

            var obj = this;
            var $obj = $(this);

            var defaults = {
                uni_radio: true
            }

            if ($obj.hasClass('inp-std')) return;
            if (this.params && this.params.uni_radio) return;
            this.params = $.extend(defaults, options, this.params);

            var $radio = $('<a href="#" class="radio"></a>');

            $obj.after($radio);

            var objId = $(obj).attr('id');
            var radioId = getUniqueId();
            $radio.attr('id', radioId).data('radio-id', objId).attr('title', $obj.attr('title'));
            setRadioClass($radio, $obj.is(':checked'), $obj.is(':disabled'));
            $obj.data('wrapper-id', radioId);

            var $label = $('label[for=' + objId + ']');
            if ($label.length) {
                $label.hide();
                $radio.html($label.html());
            }
            $radio.toggle($obj.css('display') != 'none');
            $obj.css('display', 'none');

            $radio.click(function() {
                if ($obj.is(':disabled')) return false;
                var name = $obj.attr('name');
                var $group = $(':radio[name="' + name + '"]');
                $group.each(function() {
                    var $rd = $(this);
                    if (!$rd.is($obj) && $rd.is(':checked')) {
                        $rd.removeAttr('checked');
                    }
                });
                if (!$obj.is(':checked')) {
                    $obj.attr('checked', 'checked');
                }
                $obj.triggerHandler('click');
                $obj.triggerHandler('change');
                return false;
            });

        });
    }

    function setRadioClass($chk, isChecked, isDisabled) {
        $chk.removeClass('radio-on radio-off radio-disabled-on radio-disabled-off');
        if (isDisabled) {
            if (isChecked) {
                $chk.addClass('radio-disabled-on');
            } else {
                $chk.addClass('radio-disabled-off');
            }
        } else {
            if (isChecked) {
                $chk.addClass('radio-on');
            } else {
                $chk.addClass('radio-off');
            }
        }
    }
})(jQuery);
