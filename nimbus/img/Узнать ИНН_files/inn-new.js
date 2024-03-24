$(document).ready(function () {

    $('.txt-ru-name-ex').is_input({
        regexp: /^[а-яА-ЯёЁIV\-\'\s\.\,\(\)]*$/,
        hint: 'Допускается вводить только русские буквы, символы I и V, одиночные пробелы, апострофы, дефисы, точки, запятые и круглые скобки.'
    });
    $('a.lnk-more').click(function () {
        $(this).closest('p').slideUp().next('div').slideDown();
        return false;
    });
    $('a.lnk-more-hide').click(function () {
        $(this).closest('div').slideUp().prev('p').slideDown();
        return false;
    });
    $('#opt_otch').click(updateOtch);
    $('#btnOpenUrl').click(function () {
        location.href = FROM_URL + '?inn=' + $('#resultInn').text();
    });

    updateOtch();

    $('#doctype').change(function () {
        var docType = $(this).val();
        $('.doctype').hide().filter('.doctype-' + docType).show();
        var tooltip = '';
        var maxlength = 25;
        var mask = false;
        var placeholder = false;
        var translation = {};
        switch (docType) {
            case '01':
                tooltip =
                        'Серия и номер паспорта гражданина СССР имеют формат R-ББ 999999, где:\n' +
                        'R – порядковый номер серии, обозначается римскими цифрами "I", "V", "X", "L", "C" (например, "LV") и вводится латиницей в верхнем регистре;\n' +
                        'ББ – буквенный индекс, вводится заглавным буквами русского алфавита (например, "БГ");\n' +
                        '9 – десятичная цифра (обязательная к вводу).';
                mask = 'RRRRRRRRRR-BB 000000';
                placeholder = '____-__ ______';
                translation = {
                    'R': {
                        pattern: /[IVXLC]/i,
                        optional: true
                    },
                    'B': {
                        pattern: /[А-ЯЁ]/i
                    }
                }
                break;
            case '03':
                tooltip =
                        'Серия и номер свидетельства о рождении имеют формат R-ББ 999999, где:\n' +
                        'R – порядковый номер серии, обозначается римскими цифрами "I", "V", "X", "L", "C" (например, "LV") и вводится латиницей в верхнем регистре;\n' +
                        'ББ – буквенный индекс, вводится заглавным буквами русского алфавита (например, "БГ");\n' +
                        '9 – десятичная цифра (обязательная к вводу).';
                mask = 'RRRRRRRRRR-BB 000000';
                placeholder = '____-__ ______';
                translation = {
                    'R': {
                        pattern: /[IVXLC]/i,
                        optional: true
                    },
                    'B': {
                        pattern: /[А-ЯЁ]/i
                    }
                }
                break;
            case '21':
                tooltip =
                        'Серия и номер паспорта гражданина РФ имеют формат 99 99 9999990, где:\n' +
                        '9 - любая десятичная цифра (обязательная);\n' +
                        '0 - любая десятичная цифра (необязательная, может отсутствовать).';
                mask = '00 00 0000009';
                placeholder = '__ __ _______';
                break;
        }
        if (mask) {
            $('#docno').mask(mask, {
                placeholder: placeholder,
                translation: translation
            });
        } else {
            var val = $('#docno').val();
            $('#docno').mask('', {
                placeholder: ' '
            }).unmask().val(val);
        }
        $('#docno').attr('title', tooltip).attr('maxlength', maxlength).val('');
    }).change();

});

function updateOtch() {
    var checked = $('#opt_otch').is(':checked');
    var $inp = $('#otch');
    var $fld = $inp.closest('.form-field');
    var $req = $fld.find('.field-caption span.req');
    var $err = $fld.find('.field-data .field-errors');
    $err.hide();
    if (checked) {
        $req.hide();
        $inp.attr('disabled', 'disabled').removeClass('input-error');
    } else {
        $req.show();
        $inp.removeAttr('disabled');
    }
}

function frmInn_onsubmit(form) {
    return checkCaptchaAndSubmit(form);
}

function checkCaptchaAndSubmit(form) {
    if (isCaptchaRequired() && !isCaptchaReady()) {
        showCaptchaDialog(function (captchaToken) {
            $('input[name="captchaToken"]').val(captchaToken);
            $('.result').hide();
            $(form).submit();
        });
        return false;
    }
    resetCaptcha();
    $('.result').hide();
    return true;
}

var REQUEST_ID;
var CHECK_TIMEOUT = 0;
var CHECK_TIMEOUT_STEP = 1000;
var CHECK_TIMEOUT_MAX = 60000;

var REQUEST_START = 0;

function getCheckTimeout() {
    CHECK_TIMEOUT += CHECK_TIMEOUT_STEP;
    return CHECK_TIMEOUT > CHECK_TIMEOUT_MAX ? CHECK_TIMEOUT_MAX : CHECK_TIMEOUT;
}

function form_onsuccess(result) {
    if ('captchaRequired' in result) window.CAPTCHA_REQUIRED = result.captchaRequired;
    CHECK_TIMEOUT = 0;
    REQUEST_START = new Date().getTime();
    REQUEST_ID = result.requestId;
    window.setTimeout(getInnResult, getCheckTimeout());
    return true;
}

function getInnResult() {
    if (new Date().getTime() - REQUEST_START > REQUEST_TIMEOUT) {
        var msg = '<p>Извините, сервис временно не доступен. Пожалуйста, повторите запрос позднее.</p>';
        $('#result_err_message').html(msg);
        $('#result_err').show().get(0);
        unblockUI();
        scrollToTop();
        return;
    }
    $.ajax({
        type: 'POST',
        url: 'inn-new-proc.json',
        data: {
            c: 'get',
            requestId: REQUEST_ID
        },
        success: function (result) {
            if (result.state === 0) {
                $('#result_0').show();
                unblockUI();
                scrollToTop();
            } else if (result.state === 1) {
                $('#resultInn').text(result.inn);
                $('#result_1').show().get(0);
                unblockUI();
                scrollToTop();
            } else if (result.state === -1) {
                window.setTimeout(getInnResult, getCheckTimeout());
            } else if (result.state === -2) {
                var msg = '<p>Извините, сервис временно не доступен. Пожалуйста, повторите запрос позднее.</p>';
                $('#result_err_message').html(msg);
                $('#result_err').show().get(0);
                unblockUI();
                scrollToTop();
            } else {
                var msg = '<p>Ошибка вызова сервиса (state = ' + result.state + '). Пожалуйста, повторите запрос позднее.</p>';
                $('#result_err_message').html(msg);
                $('#result_err').show().get(0);
                unblockUI();
                scrollToTop();
            }
        },
        dataType: 'json'
    });
}

function scrollToTop() {
    $("html, body").animate({
        scrollTop: 0
    }, 400);
}
