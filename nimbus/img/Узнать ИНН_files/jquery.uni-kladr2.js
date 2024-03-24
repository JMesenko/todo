(function($) {

    var uniqueId = 0;

    function getUniqueId($obj) {
        if ($obj && $obj.attr('id')) {
            return $obj.attr('id');
        } else {
            var result = "uni_kladr_" + uniqueId++;
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

    $.fn.uni_kladr = function(options) {

        return this.each(function(){

            var obj = this;
            var $obj = $(this);

            var defaults = {
                uni_text: true,
                uni_kladr: true,
                required_code: false,
                required_ifns: false,
                required_okatom: false,
                required_zip: false,
                regions: false,
                excludeRegions: false,
                ifnsKind: 'fl',
                okatom: false
            }

            if (this.params && this.params.uni_kladr) return;
            this.params = $.extend(defaults, options, this.params);

            if ($obj.data('required-code')) obj.params.required_code = $obj.data('required-code');
            if ($obj.data('required-ifns')) obj.params.required_ifns = $obj.data('required-ifns');
            if ($obj.data('required-okatom')) obj.params.required_okatom = $obj.data('required-okatom');
            if ($obj.data('required-zip')) obj.params.required_zip = $obj.data('required-zip');
            if ($obj.data('regions')) obj.params.regions = $obj.data('regions');
            if ($obj.data('exclude-regions')) obj.params.excludeRegions = $obj.data('exclude-regions');
            if ($obj.data('ifns-kind')) obj.params.ifnsKind = $obj.data('ifns-kind');
            if ($obj.data('okatom')) obj.params.okatom = $obj.data('okatom');
            
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

            if (obj.params.required_code) addHidden($obj, '_code', $div);
            if (obj.params.required_ifns) addHidden($obj, '_ifns', $div);
            if (obj.params.required_okatom) addHidden($obj, '_okatom', $div);
            if (obj.params.required_zip) addHidden($obj, '_zip', $div);

            $btn.data('input-id', inpId).click(showDialog);
            $obj.data('input-id', inpId).click(showDialog);
        });

    }

    function showDialog() {

        var inpId = $(this).data('input-id');
        var $inp = $('#' + inpId);
        if ($inp.is(':disabled')) return false;
        var inp = $inp[0];
        
        if (inpId && inpId.paramEncode) inpId = inpId.paramEncode();

        var url = '/static/kladr2.html?inp=' + inpId;
        if (inp.params.regions) url += '&regions=' + inp.params.regions;
        if (inp.params.excludeRegions) url += '&excludeRegions=' + inp.params.excludeRegions;

        showUniDialog(url, 830, 530, true, $inp);
        return false;
    }

    function addHidden($obj, suffix, $container) {
        var id = $obj.attr('id') + suffix;
        var $inp = $('#' + id);
        if (!$inp.length) {
            $inp = $('<input type="hidden" name="' + $obj.attr('name') + suffix + '" id="' + id + '"/>')
            $container.append($inp);
        }
    }

})(jQuery);
