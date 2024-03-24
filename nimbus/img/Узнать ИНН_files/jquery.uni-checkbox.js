(function($) {

    var uniqueId = 0;

    function getUniqueId() {
        return "unichk_" + uniqueId++;
    }

    var oldAttr = $.fn.attr;
    $.fn.attr = function(name, value) {
        //return $.access(this, name, value, true, $.attr, true);
        var result = oldAttr.apply(this, arguments);
        if (name === "checked" && value) {
            $(this).each(function() {
                var $checkbox = $(this);
                if ($checkbox.is(':checkbox')) {
                    var wrapperId = $checkbox.data('wrapper-id');
                    var $wrapper = $('#' + wrapperId);
                    setChkClass($wrapper, true, $checkbox.is(':disabled'));
                }
            });
        } else if (name === "disabled" && value) {
            $(this).each(function() {
                var $checkbox = $(this);
                if ($checkbox.is(':checkbox')) {
                    var wrapperId = $checkbox.data('wrapper-id');
                    var $wrapper = $('#' + wrapperId);
                    setChkClass($wrapper, $checkbox.is(':checked'), true);
                }
            });
        }
        return result;
    }

    var oldRemoveAttr = $.fn.removeAttr;
    $.fn.removeAttr = function(name) {
        if (name === "checked") {
            $(this).each(function() {
                var $checkbox = $(this);
                if ($checkbox.is(':checkbox')) {
                    var wrapperId = $checkbox.data('wrapper-id');
                    var $wrapper = $('#' + wrapperId);
                    setChkClass($wrapper, false, $checkbox.is(':disabled'));
                }
            });
        } else if (name === "disabled") {
            $(this).each(function() {
                var $checkbox = $(this);
                if ($checkbox.is(':checkbox')) {
                    var wrapperId = $checkbox.data('wrapper-id');
                    var $wrapper = $('#' + wrapperId);
                    setChkClass($wrapper, $checkbox.is(':checked'), false);
                }
            });
        }
        return oldRemoveAttr.apply(this, arguments);
    }

    $.fn.uni_checkbox = function(options) {

        return this.each(function(){

            var obj = this;
            var $obj = $(this);

            var defaults = {
                uni_checkbox: true
            }

            if ($obj.hasClass('inp-std')) return;
            if (this.params && this.params.uni_checkbox) return;
            this.params = $.extend(defaults, options, this.params);
            
            var $chk = $('<a href="#" class="checkbox"></a>');
            
            $obj.after($chk);

            var objId = $obj.attr('id');
            if (!objId) {
                objId = getUniqueId();
                $obj.attr('id', objId);
            }
            var chkId = getUniqueId();
            $chk.attr('id', chkId).data('chk-id', objId).attr('title', $obj.attr('title'));
            setChkClass($chk, $obj.is(':checked'), $obj.is(':disabled'));
            $obj.data('wrapper-id', chkId);
            
            var $label = $('label[for=' + objId + ']');
            if ($label.length) {
                $label.hide();
                $chk.html($label.html());
            }
            $chk.toggle($obj.css('display') != 'none');
            $obj.css('display', 'none');
            
            $chk.click(function() {
                if ($obj.is(':disabled')) return false;
                if ($obj.is(':checked')) {
                    $obj.removeAttr('checked');
                } else {
                    $obj.attr('checked', 'checked');
                }
                $obj.triggerHandler('click');
                $obj.triggerHandler('change');
                return false;
            });

        });
    }
    
    function setChkClass($chk, isChecked, isDisabled) {
        $chk.removeClass('checkbox-on checkbox-off checkbox-disabled-on checkbox-disabled-off');
        if (isDisabled) {
            if (isChecked) {
                $chk.addClass('checkbox-disabled-on');
            } else {
                $chk.addClass('checkbox-disabled-off');
            }
        } else {
            if (isChecked) {
                $chk.addClass('checkbox-on');
            } else {
                $chk.addClass('checkbox-off');
            }
        }
    }
})(jQuery);