function i18n(s) { return s; }

(function($) {

    var uniqueId = 0;

    function getUniqueId($obj) {
        if ($obj && $obj.attr('id')) {
            return $obj.attr('id');
        } else {
            var result = "uni_select_" + uniqueId++;
            if ($obj) $obj.attr('id', result);
            return result;
        }
    }

    var oldVal = $.fn.val;
    $.fn.val = function(value) {
        var result = oldVal.apply(this, arguments);
        if (typeof value != 'undefined') {
            $(this).each(function() {
                if (this.params && this.params.uni_select) {
                    var $select = $(this);
                    var item = findItem(this, $select.val());
                    if (item) getEditor($select).val(item.text);
                }
            });
        }
        return result;
    }

    var oldHtml = $.fn.html;
    $.fn.html = function(value) {
        var result = oldHtml.apply(this, arguments);
        if (typeof value != 'undefined') {
            $(this).each(function() {
                if (this.params && this.params.uni_select) {
                    var $select = $(this);
                    prepareData($select)
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
                if (this.params && this.params.uni_select) {
                    var $obj = $(this);
                    getWrapper($obj).addClass('disabled');
                    getEditor($obj).attr('disabled', 'disabled');
                }
            });
        } else if (name === "readonly" && value) {
            $(this).each(function() {
                if (this.params && this.params.uni_select) {
                    var $obj = $(this);
                    getWrapper($obj).addClass('readonly');
                    getEditor($obj).attr('readonly', 'readonly');
                }
            });
        } else if (name === 'title' && value) {
            $(this).each(function() {
                if (this.params && this.params.uni_select) {
                    var $obj = $(this);
                    getEditor($obj).attr('title', value);
                }
            });
        }
        return result;
    }

    var oldRemoveAttr = $.fn.removeAttr;
    $.fn.removeAttr = function(name) {
        if (name === "disabled") {
            $(this).each(function() {
                if (this.params && this.params.uni_select) {
                    var $obj = $(this);
                    getWrapper($obj).removeClass('disabled');
                    getEditor($obj).removeAttr('disabled');
                }
            });
        } else if (name === "readonly") {
            $(this).each(function() {
                if (this.params && this.params.uni_select) {
                    var $obj = $(this);
                    getWrapper($obj).removeClass('readonly');
                    getEditor($obj).removeAttr('readonly');
                }
            });
        } else if (name === "title") {
            $(this).each(function() {
                if (this.params && this.params.uni_select) {
                    var $obj = $(this);
                    getEditor($obj).removeAttr('title');
                }
            });
        }
        return oldRemoveAttr.apply(this, arguments);
    }

    var oldShow = $.fn.show;
    $.fn.show = function() {
        var result = oldShow.apply(this);
        $(this).each(function() {
            if (this.params && this.params.uni_select) {
                var $obj = $(this);
                getWrapper($obj).show();
            }
        });
        return result;
    }

    var oldHide = $.fn.hide;
    $.fn.hide = function() {
        var result = oldHide.apply(this);
        $(this).each(function() {
            if (this.params && this.params.uni_select) {
                var $obj = $(this);
                getWrapper($obj).hide();
            }
        });
        return result;
    }

    $.fn.uni_select = function(options) {

        var args = arguments;

        return this.each(function(){

            var obj = this;
            var $obj = $(this);

            switch (options) {
                case 'setData':
                    return setData($obj, args[1]);
            }

            var defaults = {
                uni_select: true,
                displayOptions: 'VALUE_ONLY',
                filterTimeout: false,
                filter: '',
                visibleCount: false,
                activeIndex: -1,
                listMaxSize: false
            }

            if ($obj.hasClass('inp-std')) return;
            if (this.params && this.params.uni_select) return;
            this.params = $.extend(defaults, options, this.params);
            if ($obj.data('display-options')) obj.params.displayOptions = $obj.data('display-options');
            if ($obj.data('list-max-size')) obj.params.listMaxSize = $obj.data('list-max-size');

            var objId = getUniqueId($obj);
            var wrapperId = getUniqueId();
            var buttonId = getUniqueId();
            var resetId = getUniqueId();
            var editorId = getUniqueId();
            var listId = getUniqueId();

            var $div = $(
                '<div id="' + wrapperId + '">'
                + '<div>'
                + '<input type="text" id="' + editorId + '" class="inp-std" autocomplete="off"/>'
                + '<b id="' + resetId + '"></b>'
                + '<a href="#" id="' + buttonId + '"></a>'
                + '</div>'
                + '<ul class="ontop" id="' + listId + '"></ul>'
                + '</div>');
            var cls = $obj.attr('class');
            if (cls) $div.attr('class', cls);
            $div.addClass('inp-nalog select');
            if (!$div.is('.txt-xxs,.txt-xs,.txt-s,.txt-sm,.txt-m,.txt-l,.txt-xl,.txt-wide,.txt-year') && $obj.closest('.form-field').length) $div.addClass('txt-wide');
            var title = $obj.attr('title');
            if (title) $div.attr('title', title);
            $obj.css('visibility', 'hidden').css('position', 'absolute').css('width', '1px');
            $obj.after($div);

            $obj.data('wrapper-id', wrapperId);
            $obj.data('editor-id', editorId);
            $obj.data('button-id', buttonId);
            $obj.data('reset-id', resetId);
            $obj.data('list-id', listId);

            var $editor = $('#' + editorId);
            var $button = $('#' + buttonId);
            var $reset = $('#' + resetId);
            var $list = $('#' + listId);

            $editor.data('obj-id', objId);
            $button.data('obj-id', objId);

            $button.attr('tabindex', -1);

            if ($obj.is(':disabled')) {
                $div.addClass('disabled');
                $editor.attr('disabled', 'disabled');
            }
            if ($obj.is('[readonly]')) {
                $div.addClass('readonly');
                $editor.attr('readonly', 'readonly');
            }
            $div.toggle($obj.css('display') != 'none');

            if ($obj.attr('placeholder')) {
                obj.params.placeholder = $obj.attr('placeholder');
                $editor.attr('placeholder', obj.params.placeholder);
            }

            $reset.click(function() {
                if ($obj.val() != '') $obj.val('').trigger('change');
                return false;
            });
            $button.click(function() {
                return false;
            });

            prepareData($obj);

            var item = findItem(obj, $obj.val());
            if (item) $editor.val(item.text);

            $button.mousedown(function() {
                if ($obj.is(':disabled') || $obj.is('[readonly]')) return false;
                if (listVisible($obj)) {
                    hideList($obj);
                } else {
                    filterData($obj);
                    showList($obj);
                    obj.params.noHideList = true;
                }
                window.setTimeout(function() {
                    $editor.focus();
                }, 100);
                return false;
            });

            $list.mousedown(function() {
                obj.params.noHideList = true;
                window.setTimeout(function() {
                    obj.params.noHideList = false;
                }, 100);
                return true;
            });

            $editor.focus(function() {
                obj.params.noHideList = false;
                $div.addClass('inp-focus');
            });

            $editor.blur(function() {

                $div.removeClass('inp-focus');

                var text = $.trim($editor.val());
                var textUpper = text.toUpperCase();

                var list = $list[0];
                if (list.childNodes.length == 1 && obj.params.visibleCount == 1) {
                    var $li = $(list.childNodes[0]);
                    var code = $li.attr('data-code');
                    var item = findItem(obj, code);
                    if (item.textUpper.indexOf(textUpper) == 0) {
                        text = item.text;
                        textUpper = item.textUpper;
                        if ($obj.val() != code) {
                            $obj.val(code).trigger('change');
                        } else {
                            $editor.val(text);
                        }
                    }
                }

                var code = $obj.val();
                if (code.length) {
                    var item = findItem(obj, code);
                    if (!item || item.textUpper != textUpper) {
                        if ($obj.val() != '') {
                            $obj.val('').trigger('change');
                        }
                    }
                } else {
                    $editor.val('');
                }

                if (!listVisible($obj)) return true;
                if (obj.params.noHideList) {
                    obj.params.noHideList = false;
                    window.setTimeout(function() {
                        $editor.focus();
                    }, 100);
                } else {
                    hideList($obj);
                }
                return true;
            });

            $editor.keydown(function(e) {
                if ($obj.is(':disabled') || $obj.is('[readonly]')) return true;
                if (obj.params.filterTimeout) {
                    window.clearTimeout(obj.params.filterTimeout);
                    obj.params.filterTimeout = false;
                }
                switch (e.keyCode) {
                    case 13: // enter
                        if (listVisible($obj)) {
                            var list = $list[0];
                            var $li = false;
                            if (obj.params.activeIndex >= 0 && obj.params.activeIndex < list.childNodes.length) {
                                $li = $(list.childNodes[obj.params.activeIndex]);
                            } else if (list.childNodes.length == 1 && obj.params.visibleCount == 1) {
                                $li = $(list.childNodes[0]);
                            }
                            if ($li) {
                                var code = $li.attr('data-code');
                                var item = findItem(obj, code);
                                if ($obj.val() != code) {
                                    $obj.val(code).trigger('change');
                                }
                                getEditor($obj).val(item.text)
                            }
                            hideList($obj);
                            e.cancelBubble = true;
                            if (e.stopPropagation) e.stopPropagation();
                            if (e.preventDefault) e.preventDefault();
                            return false;
                        }
                        break;
                    case 27: // esc
                        hideList($obj);
                        return false;
                    case 9: // tab
                    case 16: // shift
                    case 17: // ctrl
                    case 18: // alt
                    case 35: // end
                    case 36: // home
                    case 37: // left
                    case 39: // right
                        break;
                    case 33: // pageUp
                        moveBy($obj, -5);
                        return false;
                        break;
                    case 34: // pageDown
                        moveBy($obj, 5);
                        return false;
                        break;
                    case 38: // up
                        moveBy($obj, -1);
                        return false;
                        break;
                    case 40: // down
                        moveBy($obj, 1);
                        return false;
                        break;
                    default:
                        var delay = 1 + obj.params.visibleCount / 10;
                        if (delay > 1000) delay = 1000;
                        obj.params.filterTimeout = window.setTimeout(function() {
                            filterData($obj);
                            showList($obj);
                        }, delay);
                        break;
                }
                return true;
            });

            var editorVal = $editor.val();

            $editor.bind("input paste", function(e) {
                if ($obj.is(':disabled') || $obj.is('[readonly]')) return true;
                if ($editor.val() == editorVal) return true;
                editorVal = $editor.val();
                if (obj.params.filterTimeout) {
                    window.clearTimeout(obj.params.filterTimeout);
                    obj.params.filterTimeout = false;
                }
                var delay = 1 + obj.params.visibleCount / 10;
                if (delay > 1000) delay = 1000;
                obj.params.filterTimeout = window.setTimeout(function() {
                    filterData($obj);
                    showList($obj);
                }, delay);
                return true;
            });

            $list.mouseover(function(e) {
                if (e.target.tagName != 'LI') return true;
                var $li = $(e.target);
                if ($li.hasClass('static') || $li.hasClass('active')) return true;
                setActive($obj, $li.data('index'));
                return true;
            });

            $list.click(function(e) {
                var target = e.target;
                if (target.tagName != 'LI') target = target.parentNode;
                if (target.tagName != 'LI') return true;
                var $li = $(target);
                if ($li.hasClass('active')) {
                    var code = $li.attr('data-code');
                    var item = findItem(obj, code);
                    if ($obj.val() != code) {
                        $obj.val(code).trigger('change');
                    }
                    getEditor($obj).val(item.text);
                    hideList($obj);
                }
                return true;
            });

            $obj.focus(function() {
                $editor.focus()
            });

            $obj.change(function() {
                var item = findItem(obj, $obj.val());
                if (item) {
                    $editor.val(item.text);
                } else {
                    $editor.val('');
                }
            });
        });

    }

    function findItem(obj, code) {
        if (!obj.params.data) return false;
        var data = obj.params.data;
        for (var i = 0; i < data.length; i++) {
            if (data[i].key == code) return data[i];
        }
        return false;
    }

    function prepareData($obj) {
        var obj = $obj[0];
        if (obj.params.preparingData) return;
        obj.params.preparingData = true;
        var options = obj.params.options;
        var displayKeyOnly = obj.params.displayOptions == 'KEY_ONLY';
        var displayValueOnly = obj.params.displayOptions == 'VALUE_ONLY';
        var data = [];
        var visibleCount = 0;
        if ($.isArray(options)) {
            var html = [];
            var hasEmptyKey = false;
            for (var i = 0; i < options.length; i++) {
                var option = options[i];
                var key;
                var value;
                if (option.length) {
                    key = $.trim(option[0]);
                    value = $.trim(option[1]);
                } else {
                    key = $.trim(option.value);
                    value = $.trim(option.text);
                }
                if (!key.length) hasEmptyKey = true;
                var text;
                if (displayKeyOnly) {
                    text = key;
                } else if (displayValueOnly) {
                    text = value;
                } else {
                    text = key + ' - ' + value;
                }
                var item = {
                    key: key,
                    text: text,
                    textUpper: text.toUpperCase(),
                    visible: true
                };
                data.push(item);
                visibleCount++;
                html.push('<option value="' + key.htmlEncode() + '">' + text.htmlEncode() + '</option>');
            }
            if (!hasEmptyKey) {
                var emptyItem = {
                    key: '',
                    text: '',
                    textUpper: '',
                    visible: true
                };
                var emptyOption = '<option value=""></option>';
                visibleCount++;
                html = [emptyOption].concat(html);
                data = [emptyItem].concat(data);
            }
            $obj.html(html.join(''));
        } else {
            $obj.children('option').each(function() {
                var $opt = $(this);
                var key = $.trim($opt.val());
                var text = $.trim($opt.text());
                var item = {
                    key: key,
                    text: text,
                    textUpper: text.toUpperCase(),
                    visible: true
                };
                data.push(item);
                visibleCount++;
            });
        }
        obj.params.options = false;
        obj.params.data = data;
        obj.params.visibleCount = visibleCount;
        obj.params.filter = '';
        obj.params.preparingData = false;
    }

    function setData($obj, data) {
        var obj = $obj[0];
        if (obj && obj.params && obj.params.uni_select) {
            var val = $obj.val();
            obj.params.options = data;
            prepareData($obj);
            $obj.val(val);
        }
    }

    function getWrapper($obj) {
        return $('#' + $obj.data('wrapper-id'));
    }

    function getEditor($obj) {
        return $('#' + $obj.data('editor-id'));
    }

    function getButton($obj) {
        return $('#' + $obj.data('button-id'));
    }

    function getList($obj) {
        return $('#' + $obj.data('list-id'));
    }

    function listVisible($obj) {
        var $list = getList($obj);
        return $list.is(':visible');
    }

    function showList($obj) {
        var obj = $obj[0];
        var $list = getList($obj);
        var list = $list[0];
        if ($list.is(':visible')) return false;
        var $div = getWrapper($obj);
        if (!$div.is(':visible')) return false;

        var height = $list.outerHeight();
        var top1 = $div.offset().top + $div.outerHeight() - 2;
        var top2 = $div.offset().top - height + 2;
        if (top1 + height < $(document).height() || top2 < 0) {
            $list.css('top', $div.outerHeight() - 2).css('width', $div.outerWidth()).show();
        } else {
            $list.css('top', 2 - height).css('width', $div.outerWidth()).show();
        }
        // все ради глючных ie
        $list.parents().addClass('ontop');

        if (obj.params.listMaxSize > 1 && obj.params.listMaxSize < 15) {
            var maxHeight = $(list.childNodes[0]).outerHeight() * obj.params.listMaxSize;
            var delta = $list.outerHeight() - $list.height();
            if (maxHeight + delta < height) {
                $list.css('max-height', (maxHeight + delta) + 'px');
            }
            obj.params.listMaxSize = 0;
        }

        if (obj.params.activeIndex >= 0 && obj.params.activeIndex < list.childNodes.length) {
            var li = list.childNodes[obj.params.activeIndex];
            //li.scrollIntoView(true);
            var $li = $(li);
            $li.addClass('active');
            var offsetTop = li.offsetTop;
            if (offsetTop + $li.outerHeight() >= $list.scrollTop() + $list.innerHeight()) {
                $list.scrollTop(offsetTop + $li.outerHeight() - $list.innerHeight() - 1);
            } else if (offsetTop < $list.scrollTop()) {
                $list.scrollTop(offsetTop);
            }
        }
        return true;
    }

    function hideList($obj) {
        var $list = getList($obj);
        if ($list.is(':visible')) {
            setActive($obj, -1);
            $list.hide();
            // все ради глючных ie
            $list.parents().removeClass('ontop');
            return true;
        } else {
            return false;
        }
    }

    function setActive($obj, index) {
        var obj = $obj[0];
        var $list = getList($obj);
        var list = $list[0];
        if (obj.params.activeIndex >= 0 && obj.params.activeIndex < list.childNodes.length) {
            $(list.childNodes[obj.params.activeIndex]).removeClass('active');
        }
        if (index >= 0 && index < list.childNodes.length) {
            obj.params.activeIndex = index;
            var li = list.childNodes[obj.params.activeIndex];
            var $li = $(li);
            $li.addClass('active');

            var offsetTop = li.offsetTop;
            if (offsetTop + $li.outerHeight() >= $list.scrollTop() + $list.innerHeight()) {
                $list.scrollTop(offsetTop + $li.outerHeight() - $list.innerHeight() - 1);
            } else if (offsetTop < $list.scrollTop()) {
                $list.scrollTop(offsetTop);
            }

        } else {
            obj.params.activeIndex = -1;
        }
    }

    function moveBy($obj, offset) {
        if (!listVisible($obj)) {
            filterData($obj);
            showList($obj);
        } else {
            var obj = $obj[0];
            var index = obj.params.activeIndex + offset;
            if (index < 0) {
                index = 0
            } else if (index >= obj.params.visibleCount) {
                index = obj.params.visibleCount - 1;
            }
            setActive($obj, index);
        }
    }

    function drawItems($obj) {
        var obj = $obj[0];
        var data = obj.params.data;
        var html = '';
        if (data) {
            if (obj.params.visibleCount > 1000) {
                html = '<li class="static">' + 'Начните вводить текст, чтобы уточнить условия отбора элементов списка...' + '</li>';
            } else if (obj.params.visibleCount == 0) {
                html = '<li class="static">' + 'Данные не найдены' + '</li>';
            } else if (obj.params.visibleCount != 0) {
                var index = 0;
                for (var i = 0; i < data.length; i++) {
                    var item = data[i];
                    if (item.visible) {
                        if (item.html) {
                            html += '<li data-index=' + index++ + ' data-code="' + item.key + '">' + item.html + '</li>';
                        } else {
                            html += '<li data-index=' + index++ + ' data-code="' + item.key + '">' + item.text.htmlEncode() + '</li>';
                        }
                    }
                }
            }
        }
        getList($obj).html(html);
    }

    function filterData($obj) {
        var obj = $obj[0];
        obj.params.filterTimeout = false;
        var visibleCount = obj.params.visibleCount;
        var data = obj.params.data;
        var redraw = false;
        var filter = $.trim(getEditor($obj).val().toUpperCase());
        // получаем выбранный элемент
        var currentItem = findItem(obj, $obj.val());
        // если элемент выбран и он совпадает с фильтром - сбрасываем фильтр (показываем весь список)
        if (currentItem && currentItem.textUpper == filter) filter = '';
        if (!obj.params.filter.length || filter != obj.params.filter) {
            var filter1 = ' ' + filter;
            var filter2 = '-' + filter;
            var filter3 = ',' + filter;
            var filter4 = '.' + filter;
            var filter5 = '(' + filter;
            var isSubset = obj.params.filter.length && filter.indexOf(obj.params.filter) == 0;
            redraw = true;
            obj.params.activeIndex = -1;
            visibleCount = 0;
            if (data) {
                var filterLength = filter.length;
                for (var i = 0; i < data.length; i++) {
                    var item = data[i];
                    // если фильтруем подмножество, то невидимые элементы сразу пропускаем без проверки
                    if (isSubset && !item.visible) continue;
                    // ищем вхождение фильтра в строке
                    item.index = item.textUpper.indexOf(filter);
                    if (item.index > 0) {
                        item.index = item.textUpper.indexOf(filter1) + 1;
                        if (item.index == 0) item.index = item.textUpper.indexOf(filter2) + 1;
                        if (item.index == 0) item.index = item.textUpper.indexOf(filter3) + 1;
                        if (item.index == 0) item.index = item.textUpper.indexOf(filter4) + 1;
                        if (item.index == 0) item.index = item.textUpper.indexOf(filter5) + 1;
                        if (item.index == 0) {
                            item.visible = false;
                        } else {
                            item.visible = true;
                            item.html = item.text.substr(0, item.index).htmlEncode() + '<b>' + item.text.substr(item.index, filterLength).htmlEncode() + '</b>' + item.text.substr(item.index + filterLength).htmlEncode();
                        }
                    } else if (item.index < 0) {
                        item.visible = false;
                    } else if (item.index == 0) {
                        item.visible = true;
                        item.html = '<b>' + item.text.substr(0, filterLength).htmlEncode() + '</b>' + item.text.substr(filterLength).htmlEncode();
                    }
                    if (item.visible) {
                        if (item == currentItem) obj.params.activeIndex = visibleCount;
                        visibleCount++;
                    }
                }
            }
        }
        obj.params.filter = filter;
        obj.params.visibleCount = visibleCount;
        if (redraw) drawItems($obj);
    }

})(jQuery);
