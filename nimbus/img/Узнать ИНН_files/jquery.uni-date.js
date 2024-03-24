function i18n(s) { return s; }

(function($) {

    var uniqueId = 0;

    function getUniqueId($obj) {
        if ($obj && $obj.attr('id')) {
            return $obj.attr('id');
        } else {
            var result = "uni_date_" + uniqueId++;
            if ($obj) $obj.attr('id', result);
            return result;
        }
    }

    var oldAttr = $.fn.attr;
    $.fn.attr = function(name, value) {
        var result = oldAttr.apply(this, arguments);
        if (name === "disabled" && value) {
            $(this).each(function() {
                if (this.params && this.params.uni_date) {
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
                if (this.params && this.params.uni_date) {
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
            if (this.params && this.params.uni_date) {
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
            if (this.params && this.params.uni_date) {
                var $obj = $(this);
                var wrapperId = $obj.data('wrapper-id');
                var $wrapper = $('#' + wrapperId);
                $wrapper.hide();
            }
        });
        return result;
    }

    $.fn.uni_date = function(options) {

        return this.each(function(){

            var obj = this;
            var $obj = $(this);

            var defaults = {
                uni_text: true,
                uni_date: true,
                monthNames: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
                minYear: false,
                maxYear: false,
                minDate: false,
                maxDate: false,
                format: 'dd.MM.yyyy'
            }

            if (this.params && this.params.uni_date) return;
            this.params = $.extend(defaults, options, this.params);

            if ($obj.data('format')) obj.params.format = $obj.data('format');

            if (!obj.params.minDate) obj.params.minDate = $obj.data('min-date');
            if (!obj.params.minYear) obj.params.minYear = $obj.data('min-year');
            if (!obj.params.minYear) obj.params.minYear = new Date().getFullYear() - 100;

            if (!obj.params.maxDate) obj.params.maxDate = $obj.data('max-date');
            if (!obj.params.maxYear) obj.params.maxYear = $obj.data('max-year');
            if (!obj.params.maxYear) obj.params.maxYear = new Date().getFullYear() + 50;

            if (obj.params.minDate) {
                if (typeof(obj.params.minDate) == 'string') obj.params.minDate = stringToDate(obj.params.minDate);
                obj.params.minYear = obj.params.minDate.getFullYear();
            } else if (obj.params.minYear) {
                obj.params.minDate = stringToDate('01.01.' + obj.params.minYear);
            }
            if (obj.params.maxDate) {
                if (typeof(obj.params.maxDate) == 'string') obj.params.maxDate = stringToDate(obj.params.maxDate);
                obj.params.maxYear = obj.params.maxDate.getFullYear();
            } else if (obj.params.maxYear) {
                obj.params.maxDate = stringToDate('31.12.' + obj.params.maxYear);
            }

            if (!$obj.attr('title')) $obj.attr('title', 'Формат ввода даты: ' + getFormatDescription($obj));
            if (!$obj.attr('placeholder')) $obj.attr('placeholder', getFormatDescription($obj));

            var wrapperClass = 'input-date';

            var $div = $obj.parent().parent();
            if (!$div.is('div.inp-nalog')) {
                $div = $('<div><div></div></div>');
                $div.addClass('inp-nalog').addClass(wrapperClass);
                $obj.after($div);
                $obj.appendTo($div.children());
            }

            var $reset = $div.children().children('b');
            if (!$reset.length) {
                $reset = $('<b></b>');
                $reset.appendTo($div.children());
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

            var inputId = getUniqueId($obj);
            var wrapperId = getUniqueId($div);
            var resetId = getUniqueId($reset);
            var buttonId = getUniqueId($btn);

            $obj.data('wrapper-id', wrapperId);
            $obj.data('reset-id', resetId);
            $obj.data('button-id', buttonId);

            $div.data('input-id', inputId);
            $div.toggleClass('disabled', $obj.is(':disabled'));
            $div.toggle($obj.css('display') != 'none');

            $reset.click(function() {
                if ($obj.val() != '') $obj.val('').trigger('change');
                return false;
            });

            $btn.attr('tabIndex', -1).click(function() {
                if ($obj.is(':disabled')) return false;
                showCalendar($obj);
                return false;
            });

            $obj.focus(function() {
                $div.addClass('inp-focus');
            });

            $obj.blur(function() {
                $div.removeClass('inp-focus');
            });

            if ($.fn.mask) {
                $obj.mask(getFormatMask($obj)).removeAttr('maxLength');
            } else if ($.fn.is_input) {
                $obj.is_input({
                    regexp: getFormatRegexp($obj),
                    hint:
                    'Вы пытаетесь ввести недопустимые символы.\n' +
                    'Формат ввода даты: ' + getFormatDescription($obj)
                });
            }

            var $cal = $('#uniCalendar');
            if ($cal.length == 0) {
                var html = [];
                html.push('<div id="uniCalendar" class="uni-calendar">');
                html.push('<div class="uni-calendar-head">');
                html.push('<a id="uniCalendarPrev" class="uni-calendar-prev"></a>');
                html.push('<a id="uniCalendarTitle" class="uni-calendar-title"></a>');
                html.push('<a id="uniCalendarNext" class="uni-calendar-next"></a>');
                html.push('</div>');
                html.push('<div id="uniCalendarBody" class="uni-calendar-body"></div>');
                html.push('</div>');
                $cal = $(html.join('')).hide();
                $('body').append($cal);
                $cal.mousedown(function(e) {
                    e.cancelBubble = true;
                    if (e.stopPropagation) e.stopPropagation();
                    return true;
                });
                $(document).mousedown(function() {
                    hideCalendar(obj);
                });
                $('#uniCalendarPrev').click(function() {
                    var $a = $(this);
                    if ($a.hasClass('uni-calendar-prev-disabled')) return false;
                    var value = $a.data('value');
                    if (value && value.length) {
                        $cal.data('date', stringToDate(value));
                        redrawCalendar();
                    }
                    return false;
                });
                $('#uniCalendarNext').click(function() {
                    var $a = $(this);
                    if ($a.hasClass('uni-calendar-next-disabled')) return false;
                    var value = $a.data('value');
                    if (value && value.length) {
                        $cal.data('date', stringToDate(value));
                        redrawCalendar();
                    }
                    return false;
                });
                $('#uniCalendarTitle').click(function() {
                    var selector = $cal.data('selector');
                    if (selector == 'year') {
                        return false;
                    } else if (selector == 'month') {
                        selector = 'year';
                    } else {
                        selector = 'month';
                    }
                    $cal.data('selector', selector);
                    redrawCalendar();
                    return false;
                });
                $('#uniCalendarBody').click(function(e) {
                    var $obj = $('#' + $cal.data('input-id'));
                    if (!$obj || !$obj.length) {
                        hideCalendar();
                        return false;
                    }
                    var params = getObjParams($obj);
                    var $a = $(e.target).closest('a');
                    var value = $a.data('value');
                    var date = value && value.length ? stringToDate(value) : false;
                    if ($a.is('a.uni-calendar-item-disabled')) {
                        return false;
                    } else if ($a.is('a.uni-calendar-item-day')) {
                        if (date) {
                            value = dateToString(date, params.format);
                            $obj.val(value).trigger('change');
                            hideCalendar();
                        }
                    } else if ($a.is('a.uni-calendar-item-month')) {
                        if (date) {
                            $cal.data('date', date);
                            $cal.data('selector', 'day');
                            redrawCalendar();
                        }
                    } else if ($a.is('a.uni-calendar-item-year')) {
                        if (date) {
                            $cal.data('date', date);
                            $cal.data('selector', 'month');
                            redrawCalendar();
                        }
                    }
                    return false;
                });
            }
        });
    }

    function getObj($cal) {
        var inputId = $cal.data('input-id');
        return $('#' + inputId);
    }

    function getObjParams($obj) {
        return $obj instanceof jQuery && $obj.length && $.isPlainObject($obj[0].params) ? $obj[0].params : {};
    }

    function getObjValue($obj) {
        if ($obj instanceof jQuery) {
            return $.trim($obj.val()).substr(0, 10);
        } else {
            return '';
        }
    }

    function hideCalendar() {
        $('#uniCalendar').hide();
    }

    function showCalendar($obj) {
        var params = getObjParams($obj);
        var date = $obj.val();
        if (date) {
            try {
                date = date.substr(0, 10);
                var aDate = date.split(/\./g);
                var _date = new Number(aDate[0]);
                var _month = new Number(aDate[1]) - 1;
                var _year = new Number(aDate[2]);
                if (_year < params.minYear || _year > params.maxYear) {
                    date = null;
                } else {
                    date = new Date(_year, _month, _date);
                    if (date.getFullYear() != _year ||
                        date.getMonth() != _month ||
                        date.getDate() != _date) date = null;
                }
            } catch (e) {
                date = null;
            }
        }
        if (!date) date = new Date();
        var $cal = $('#uniCalendar');
        $cal.data('month-names', params.monthNames);
        $cal.data('min-date', params.minDate);
        $cal.data('max-date', params.maxDate);
        $cal.data('date', date);
        $cal.data('input-id', $obj.attr('id'));
        $cal.data('selector', 'day');

        redrawCalendar();

        var $btn = $('#' + $obj.data('button-id'));
        var left = $btn.offset().left + $btn.outerWidth() - $cal.outerWidth();
        if (left < 0) left = $obj.offset().left;
        var top = $btn.offset().top + $btn.outerHeight() + 2;
        if (top + $cal.outerHeight() > $(window).height() + $(window).scrollTop()) top -= $cal.outerHeight() + $btn.outerHeight() + 2;
        if (top < 0) top = 0;
        $cal.css({
            'top': top,
            'left': left
        }).show();

        $obj.focus();
    }

    function redrawCalendar() {
        var $cal = $('#uniCalendar');
        var selector = $cal.data('selector');
        if (selector == 'year') {
            redrawSelectorYear();
        } else if (selector == 'month') {
            redrawSelectorMonth();
        } else {
            redrawSelectorDay();
        }
    }

    function redrawSelectorYear() {
        var $cal = $('#uniCalendar');
        var $obj = getObj($cal);
        var currentValue = getObjValue($obj);
        var currentDate = stringToDate(currentValue);
        var minDate = $cal.data('min-date');
        var maxDate = $cal.data('max-date');
        var date = $cal.data('date');
        if (date < minDate) {
            date = minDate;
        } else if (date > maxDate) {
            date = maxDate;
        }
        var year = date.getFullYear();
        var yearFrom = Math.floor((year - 1) / 20) * 20 + 1;
        var yearTo = yearFrom + 19;
        $('#uniCalendarTitle').text(yearFrom + '-' + yearTo);

        var currentYear = currentDate ? currentDate.getFullYear() : null;

        var html = [];
        for (var i = yearFrom; i <= yearTo; i++) {
            var dt1 = new Date(date.getTime());
            dt1.setFullYear(i, 0, 1);
            var dt2 = new Date(date.getTime());
            dt2.setFullYear(i, 11, 31);
            var value = dateToString(dt1);
            var cls = ['uni-calendar-item-year'];
            if ((minDate && dt2 <= minDate) || (maxDate && dt1 >= maxDate)) cls.push('uni-calendar-item-disabled');
            if (i == currentYear) cls.push('uni-calendar-item-active');
            html.push('<a class="' + cls.join(' ') + '" href="#" data-value="' + value + '">' + i + '</a>');
        }
        $('#uniCalendarBody').html(html.join(''));

        var dtPrev = new Date(date.getTime());
        dtPrev.setFullYear(yearFrom - 1, 11, 31);
        $('#uniCalendarPrev').data('value', dateToString(dtPrev)).toggleClass('uni-calendar-prev-disabled', dtPrev < minDate);
        var dtNext = new Date(date.getTime());
        dtNext.setFullYear(yearTo + 1, 0, 1);
        $('#uniCalendarNext').data('value', dateToString(dtNext)).toggleClass('uni-calendar-next-disabled', dtNext > maxDate);
    }

    function redrawSelectorMonth() {
        var $cal = $('#uniCalendar');
        var $obj = getObj($cal);
        var currentValue = getObjValue($obj);
        var currentDate = stringToDate(currentValue);
        var minDate = $cal.data('min-date');
        var maxDate = $cal.data('max-date');
        var date = $cal.data('date');
        if (date < minDate) {
            date = minDate;
        } else if (date > maxDate) {
            date = maxDate;
        }
        var year = date.getFullYear();
        $('#uniCalendarTitle').text(year);
        var dt1 = new Date(date.getTime());
        var dt2 = new Date(date.getTime());

        var currentYear = currentDate ? currentDate.getFullYear() : null;
        var currentMonth = currentDate ? currentDate.getMonth() : null;

        var html = [];
        var monthNames = $cal.data('month-names');
        for (var i = 0; i <= 11; i++) {
            dt1.setMonth(i, 1);
            dt2.setMonth(i + 1, 0);
            var value = dateToString(dt1);
            var cls = ['uni-calendar-item-month'];
            if ((minDate && dt2 <= minDate) || (maxDate && dt1 >= maxDate)) cls.push('uni-calendar-item-disabled');
            if (i == currentMonth && dt1.getFullYear() == currentYear) cls.push('uni-calendar-item-active');
            html.push('<a class="' + cls.join(' ') + '" href="#" data-value="' + value + '">' + monthNames[i] + '</a>');
        }
        $('#uniCalendarBody').html(html.join(''));

        var dtPrev = new Date(date.getTime());
        dtPrev.setFullYear(date.getFullYear() - 1);
        dtPrev.setMonth(11, 31);
        $('#uniCalendarPrev').data('value', dateToString(dtPrev)).toggleClass('uni-calendar-prev-disabled', dtPrev <= minDate);
        var dtNext = new Date(date.getTime());
        dtNext.setFullYear(date.getFullYear() + 1);
        dtNext.setMonth(0, 1);
        $('#uniCalendarNext').data('value', dateToString(dtNext)).toggleClass('uni-calendar-next-disabled', dtNext >= maxDate);
    }

    function redrawSelectorDay() {
        var $cal = $('#uniCalendar');
        var $obj = getObj($cal);
        var currentValue = getObjValue($obj);
        var minDate = $cal.data('min-date');
        var maxDate = $cal.data('max-date');
        var date = $cal.data('date');
        if (date < minDate) {
            date = minDate;
        } else if (date > maxDate) {
            date = maxDate;
        }
        var year = date.getFullYear();
        var month = date.getMonth();
        var monthNames = $cal.data('month-names');
        var monthName = monthNames[month];
        $('#uniCalendarTitle').text(monthName + ' ' + year);
        var dt1 = new Date(date.getTime());
        dt1.setDate(1);
        var dayOfWeek = dt1.getDay() - 1;
        if (dayOfWeek < 0) dayOfWeek = 6;
        if (dayOfWeek > 0) dt1.setDate(-dayOfWeek + 1);
        var dt2 = new Date(dt1.getTime());

        dt1.setHours(0, 0, 0, 0);
        dt2.setHours(23, 59, 59, 999);

        var html = [];
        for (var i = 1; i <= 42; i++) {
            if (dt1.getMonth() != month) {
                html.push('<a class="uni-calendar-item-day uni-calendar-item-disabled" href="#"></a>');
            } else {
                var value = dateToString(dt1);
                var cls = ['uni-calendar-item-day'];
                if ((minDate && dt2 <= minDate) || (maxDate && dt1 >= maxDate)) cls.push('uni-calendar-item-disabled');
                if (value == currentValue) cls.push('uni-calendar-item-active');
                if (dt1.getDay() == 0 || dt1.getDay() == 6) cls.push('uni-calendar-item-red');
                html.push('<a class="' + cls.join(' ') + '" href="#" data-value="' + value + '">' + dt1.getDate() + '</a>');
            }
            dt1.setDate(dt1.getDate() + 1);
            dt2.setDate(dt2.getDate() + 1);
        }
        $('#uniCalendarBody').html(html.join(''));

        var dtPrev = new Date(date.getTime());
        dtPrev.setDate(0);
        $('#uniCalendarPrev').data('value', dateToString(dtPrev)).toggleClass('uni-calendar-prev-disabled', dtPrev <= minDate);
        var dtNext = new Date(date.getTime());
        dtNext.setMonth(date.getMonth() + 1, 1);
        $('#uniCalendarNext').data('value', dateToString(dtNext)).toggleClass('uni-calendar-next-disabled', dtNext >= maxDate);
    }

    function dateToString(date, format) {
        if (!date) date = new Date();
        var _year = new String(date.getFullYear());
        var _month = new String(date.getMonth() + 1);
        var _date = new String(date.getDate());
        while (_month.length < 2) _month = "0" + _month;
        while (_date.length < 2) _date = "0" + _date;
        switch (format) {
            case 'dd.MM.yyyy HH:mm:ss':
                return _date + "." + _month + "." + _year + ' 00:00:00';
            default:
                return _date + "." + _month + "." + _year;
        }
    }

    function stringToDate(sValue) {
        if (!sValue) return null;
        if (sValue.toUpperCase() == "TODAY" || sValue.toUpperCase() == "СЕГОДНЯ") {
            var now = new Date();
            return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12, 0, 0);
        }
        var aDate = sValue.split(".");
        if (aDate.length != 3) return null;
        if (aDate[0].length != 2 || aDate[1].length != 2 || aDate[2].length != 4) return null;
        try {
            var dDate = new Date(aDate[2], aDate[1] - 1, aDate[0], 12, 0, 0);
            if (dDate.getDate() == aDate[0] &&
                dDate.getMonth() + 1 == aDate[1] &&
                dDate.getFullYear() == aDate[2]) {
                return dDate;
            } else {
                return null;
            }
        } catch(err) {
            return null;
        }
        return null;
    }

    function getFormatDescription($obj) {
        switch(getObjParams($obj).format) {
            case 'dd.MM.yyyy HH:mm:ss':
                return 'ДД.ММ.ГГГГ чч:мм:сс';
            default:
                return 'ДД.ММ.ГГГГ';
        }
    }

    function getFormatRegexp($obj) {
        switch(getObjParams($obj).format) {
            case 'dd.MM.yyyy HH:mm:ss':
                return /^[0-9\.\:\s]*$/;
            default:
                return /^[0-9\.]*$/;
        }
    }

    function getFormatMask($obj) {
        switch(getObjParams($obj).format) {
            case 'dd.MM.yyyy HH:mm:ss':
                return '99.99.9999 99:99:99';
            default:
                return '99.99.9999';
        }
    }

    function getValue($obj) {
        var format = getObjParams($obj).format;
        var value = $obj.val();
        var result = stringToDate(value, format);
        if (!result) return null;
        return dateToString(result, format);
    }
})(jQuery);

