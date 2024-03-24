function i18n(s) { return s; }

(function($) {

    var uniqueId = 0;

    function getUniqueId($obj) {
        if ($obj && $obj.attr('id')) {
            return $obj.attr('id');
        } else {
            var result = "uni_set_" + uniqueId++;
            if ($obj) $obj.attr('id', result);
            return result;
        }
    }

    var oldVal = $.fn.val;
    $.fn.val = function(value) {
        var result = oldVal.apply(this, arguments);
        if (typeof value != 'undefined') {
            $(this).each(function() {
                if (this.params && this.params.uni_set && !this.params.noRedraw) {
                    var $obj = $(this);
                    redraw($obj);
                }
            });
        }
        return result;
    }

    var oldAttr = $.fn.attr;
    $.fn.attr = function(name, value) {
        var result = oldAttr.apply(this, arguments);
        if (name === "disabled" && value) {
            $(this).each(function() {
                if (this.params && this.params.uni_set) {
                    var $obj = $(this);
                    var wrapperId = $obj.data('wrapper-id');
                    var $wrapper = $('#' + wrapperId);
                    $wrapper.addClass('uni-set-disabled');
                }
            });
        } else if (name === "readonly" && value) {
            $(this).each(function() {
                if (this.params && this.params.uni_set) {
                    var $obj = $(this);
                    var wrapperId = $obj.data('wrapper-id');
                    var $wrapper = $('#' + wrapperId);
                    $wrapper.addClass('uni-set-readonly');
                }
            });
        }
        return result;
    }

    var oldRemoveAttr = $.fn.removeAttr;
    $.fn.removeAttr = function(name) {
        if (name === "disabled") {
            $(this).each(function() {
                if (this.params && this.params.uni_set) {
                    var $obj = $(this);
                    var wrapperId = $obj.data('wrapper-id');
                    var $wrapper = $('#' + wrapperId);
                    $wrapper.removeClass('uni-set-disabled');
                }
            });
        } else if (name === "readonly") {
            $(this).each(function() {
                if (this.params && this.params.uni_set) {
                    var $obj = $(this);
                    var wrapperId = $obj.data('wrapper-id');
                    var $wrapper = $('#' + wrapperId);
                    $wrapper.removeClass('uni-set-readonly');
                }
            });
        }
        return oldRemoveAttr.apply(this, arguments);
    }

    var oldShow = $.fn.show;
    $.fn.show = function() {
        var result = oldShow.apply(this);
        $(this).each(function() {
            if (this.params && this.params.uni_set) {
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
            if (this.params && this.params.uni_set) {
                var $obj = $(this);
                var wrapperId = $obj.data('wrapper-id');
                var $wrapper = $('#' + wrapperId);
                $wrapper.hide();
            }
        });
        return result;
    }

    $.fn.uni_set = function(options) {

        switch (options) {
            case 'getText':
                return getText(this[0]);
            case 'showDialog':
                showDialog($(this[0]));
        }

        return this.each(function(){

            var obj = this;
            var $obj = $(this);

            var defaults = {
                uni_text: true,
                uni_set: true,
                style: 'nalog',
                isMultiSelect: true,
                multiSelectDelimiter: ',',
                multiSelectLimit: false,
                displayOptions: 'KEY_AND_VALUE',
                dict: false,
                kind: 'TREE',
                treeKind: 'LINKED',
                treeRoot: false,
                maxHeight: false,
                expandLevel: false,
                visibleKeys: false,
                brief: false
            }

            if (this.params && this.params.uni_set) return;
            this.params = $.extend(defaults, options, this.params);

            if ($obj.attr('data-style')) obj.params.style = $obj.data('style');
            if ($obj.attr('data-is-multi-select')) obj.params.isMultiSelect = $obj.data('is-multi-select');
            if ($obj.attr('data-multi-select-delimiter')) obj.params.multiSelectDelimiter = $obj.data('multi-select-delimiter');
            if ($obj.attr('data-multi-select-limit')) obj.params.multiSelectLimit = $obj.data('multi-select-limit');
            if ($obj.attr('data-display-options')) obj.params.displayOptions = $obj.data('display-options');
            if ($obj.attr('data-dict')) obj.params.dict = $obj.data('dict');
            if ($obj.attr('data-kind')) obj.params.kind = $obj.data('kind');
            if ($obj.attr('data-tree-kind')) obj.params.treeKind = $obj.data('tree-kind');
            if ($obj.attr('data-tree-root')) obj.params.treeRoot = $obj.attr('data-tree-root');
            if ($obj.attr('data-max-height')) obj.params.maxHeight = $obj.data('maxHeight');
            if ($obj.attr('data-expand-level')) obj.params.expandLevel = $obj.data('expand-level');
            if ($obj.attr('data-visible-keys')) obj.params.visibleKeys = $obj.data('visible-keys');
            if ($obj.attr('data-brief')) obj.params.brief = $obj.data('brief');

            var $div = $('<div class="uni-set"></div>');
            $obj.after($div);
            $obj.css('visibility', 'hidden').css('position', 'absolute').css('width', '1px').addClass('inp-std');

            // Перетаскиваем классы начинающиеся на 'txt-'
            var cls = $obj.attr('class');
            if (cls) {
                var clss = cls.split(' ');
                for (var i = 0; i < clss.length; i++) {
                    if (clss[i].indexOf('txt-') == 0) $div.addClass(clss[i]);
                }
            }

            var $lst = $('<ul></ul>');
            var $btn = $('<button type="button">' + 'Выбрать' + '</button>');

            if (obj.params.maxHeight) $lst.css('max-height', obj.params.maxHeight);

            $div.append($lst);
            $div.append($btn);

            var inpId = getUniqueId($obj);
            var divId = getUniqueId($div);
            var lstId = getUniqueId($lst);

            $obj.data('wrapper-id', divId);
            $obj.data('list-id', lstId);
            $div.toggleClass('uni-set-disabled', $obj.is(':disabled'));
            $div.toggleClass('uni-set-readonly', $obj.is('[readonly]'));
            $div.toggle($obj.css('display') != 'none');
            if ($obj.attr('placeholder')) {
                obj.params.placeholder = $obj.attr('placeholder');
            } else {
                obj.params.placeholder = obj.params.isMultiSelect ? 'Выберите значения из справочника' : 'Выберите значение из справочника';
            }

            $obj.data('input-id', inpId);
            $div.data('input-id', inpId);
            $lst.data('input-id', inpId).click(listClick);
            $btn.data('input-id', inpId).click(listClick);

            redraw($obj);
        });
    }

    function getText(obj) {
        var $obj = $(obj);
        var listId = $obj.data('list-id');
        var $list = $('#' + listId);
        var $li = $list.children(':not(.no-data)');
        if (!$li.length) {
            return '';
        } else if ($li.length == 1) {
            return $li.text();
        } else {
            return $obj.val();
        }
    }

    function listClick(e) {
        var target = e.target;
        var $target = $(target);
        var $li = $target.closest('li');
        var $ul = $li.closest('ul');
        var $obj = $('#' + $ul.data('input-id'));
        $obj.trigger('click');
        if ($target.is('a.uni-set-delete')) {
            $li.detach();
            var keys = [];
            $ul.children('li').each(function() {
                keys.push($(this).attr('data-key'));
            });
            var obj = $obj[0];
            var val = keys.join(obj.params.multiSelectDelimiter);
            if (val.length) obj.params.noRedraw = true;
            $obj.val(val).trigger('change');
            obj.params.noRedraw = false;
            return false;
        } else {
            showDialog($target.closest('div.uni-set'));
            return false;
        }
    }

    function redraw($obj) {
        var obj = $obj[0];
        var val = getVal($obj);
        var html = [];
        if (!val.length || window.RTKOMM_PAGE_STYLE == 'GU') {
            html.push('<li class="no-data"><span>' + obj.params.placeholder + '</span><a href="#"></a></li>');
        }
        if (val.length) {
            if (obj.params.brief) {
                html.push('<li><span>' + val.htmlEncode() + '</span></li>');
            } else {
                var vals = val.split(obj.params.multiSelectDelimiter);
                for (var i = 0; i < vals.length; i++) {
                    var key = vals[i].htmlEncode();
                    html.push('<li data-key="' + key + '"><span>' + key + '</span><a class="uni-set-delete" href="#" title="' + 'Удалить' + '"></a></li>');
                }
                if (obj.params.displayOptions != 'KEY_ONLY') {
                    $.ajax({
                        type: 'post',
                        url: '/static/set-proc.json',
                        data: {
                            c: 'getDict',
                            dict: obj.params.dict,
                            kind: obj.params.kind,
                            delimiter: obj.params.multiSelectDelimiter,
                            val: $obj.val()
                        },
                        success: function (result) {
                            if (result) {
                                var displayValueOnly = obj.params.displayOptions == 'VALUE_ONLY';
                                getList($obj).children('li').each(function() {
                                    var $li = $(this);
                                    if ($li.hasClass('no-data')) return;
                                    var key = $li.attr('data-key');
                                    var text = displayValueOnly ? result[key] : key + ' - ' + result[key];
                                    $li.children('span').text(text);
                                });
                            }
                        },
                        error: function () {
                        },
                        dataType: 'json'
                    });
                }
            }
        }
        getList($obj).html(html.join(''));
    }

    function getList($obj) {
        var listId = $obj.data('list-id');
        return $('#' + listId);
    }

    function getWrapper($obj) {
        var wrapperId = $obj.data('wrapper-id');
        return $('#' + wrapperId);
    }

    function getVal($obj) {
        var inpId = $obj.data('input-id');
        var $inp = $('#' + inpId)
        return $inp.val();
    }

    function showDialog($obj) {

        var inpId = $obj.data('input-id');
        var $inp = $('#' + inpId);
        if (!$inp.length || $inp.is(':disabled') || $inp.is('[readonly]')) return false;

        var params = $inp.get(0).params;
        var dict = params.dict;
        var kind = params.kind;
        var treeKind = params.treeKind;
        var treeRoot = params.treeRoot;
        var style = params.style.toUpperCase();

        if (inpId && inpId.paramEncode) inpId = inpId.paramEncode();
        if (dict && dict.paramEncode) dict = dict.paramEncode();

        var url;
        if (kind == 'TREE') {
            url = '/static/tree2.html?inp=' + inpId + '&tree=' + dict + '&treeKind=' + treeKind + '&pageStyle=' + style + (treeRoot ? '&treeRoot=' + treeRoot : '');
        } else {
            url = '/static/set2.html?inp=' + inpId + '&dict=' + dict + '&pageStyle=' + style;
        }

        showUniDialog(url, 830, 610, true, $inp);
        return false;
    }

})(jQuery);
