(function($) {

    var uniqueId = 0;

    function getUniqueId($obj) {
        if ($obj && $obj.attr('id')) {
            return $obj.attr('id');
        } else {
            var result = "uni_tree_" + uniqueId++;
            if ($obj) $obj.attr('id', result);
            return result;
        }
    }

    var oldAttr = $.fn.attr;
    $.fn.attr = function(name, value) {
        var result = oldAttr.apply(this, arguments);
        if (name === "disabled" && value) {
            $(this).each(function() {
                if (this.params && this.params.uni_tree) {
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
                if (this.params && this.params.uni_tree) {
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
            if (this.params && this.params.uni_tree) {
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
            if (this.params && this.params.uni_tree) {
                var $obj = $(this);
                var wrapperId = $obj.data('wrapper-id');
                var $wrapper = $('#' + wrapperId);
                $wrapper.hide();
            }
        });
        return result;
    }

    $.fn.uni_tree = function(options) {

        return this.each(function(){

            var obj = this;
            var $obj = $(this);

            var defaults = {
                uni_text: true,
                uni_tree: true,
                style: 'nalog',
                isMultiSelect: false,
                multiSelectDelimiter: ',',
                displayOptions: 'KEY_AND_VALUE',
                tree: false,
                treeKind: 'LINKED',
                expandLevel: false
            }

            if (this.params && this.params.uni_tree) return;
            this.params = $.extend(defaults, options, this.params);

            if ($obj.attr('data-style')) obj.params.style = $obj.data('style');
            if ($obj.attr('data-is-multi-select')) obj.params.isMultiSelect = $obj.data('is-multi-select');
            if ($obj.attr('data-multi-select-delimiter')) obj.params.multiSelectDelimiter = $obj.data('multi-select-delimiter');
            if ($obj.attr('data-display-options')) obj.params.displayOptions = $obj.data('display-options');
            if ($obj.attr('data-tree')) obj.params.tree = $obj.data('tree');
            if ($obj.attr('data-dict')) obj.params.tree = $obj.data('dict');
            if ($obj.attr('data-tree-kind')) obj.params.treeKind = $obj.data('tree-kind');
            if ($obj.attr('data-expand-level')) obj.params.expandLevel = $obj.data('expand-level');

            var wrapperClass = 'input-enum';

            var $div = $obj.parent().parent();
            if (!$div.is('div.' + wrapperClass)) {
                $div = $('<div><div></div></div>');
                $div.addClass(wrapperClass);
                $obj.after($div);
                $obj.css('visibility', 'hidden').css('position', 'absolute').css('width', '1px').addClass('inp-std');
            }

            var $txt = $div.children().children(':text');
            if (!$txt.length) {
                $txt = $('<input type="text" class="inp-std"/>').val($obj.val());
                $txt.appendTo($div.children());
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
            var txtId = getUniqueId($txt);
            var btnId = getUniqueId($btn);

            $obj.data('wrapper-id', divId);
            $obj.data('text-id', txtId);
            $obj.data('button-id', btnId);
            $obj.attr('readonly', 'readonly');
            $txt.attr('readonly', 'readonly');
            $div.toggleClass('disabled', $obj.is(':disabled'));
            $div.toggle($obj.css('display') != 'none');

            $btn.data('input-id', inpId).click(showDialog);
            $txt.data('input-id', inpId).click(showDialog);
            $obj.data('input-id', inpId).click(showDialog);

            if (!obj.params.isMultiSelect) {
                $.ajax({
                    type: 'post',
                    url: '/static/tree-edit.json',
                    data: {
                        c: 'getText',
                        tree: obj.params.tree,
                        displayOptions: obj.params.displayOptions,
                        key: $obj.val()
                    },
                    success: function (result) {
                        $txt.val(result).attr('title', result);
                    },
                    error: function () {
                    },
                    dataType: 'json'
                });
            }

        });

    }

    function showDialog() {

        var inpId = $(this).data('input-id');
        var $inp = $('#' + inpId)
        if (!$inp.length || $inp.is(':disabled')) return false;

        var params = $inp.get(0).params;
        var tree = params.tree;
        var treeKind = params.treeKind;
        var style = params.style.toUpperCase();

        if (inpId && inpId.paramEncode) inpId = inpId.paramEncode();
        if (tree && tree.paramEncode) tree = tree.paramEncode();

        var url = '/static/tree2.html?inp=' + inpId + '&tree=' + tree + '&treeKind=' + treeKind + '&pageStyle=' + style;

        showUniDialog(url, 830, 610, true, $inp);
        return false;
    }

})(jQuery);
