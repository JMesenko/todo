$(document).ready(function() {

    if ($.isFunction(window.addEventListener)) {
        window.addEventListener("message", receiveMessage, false);
    } else {
        window.attachEvent("message", receiveMessage);
    }

    function receiveMessage(event) {
        try {
            var messageData = $.parseJSON(event.data);
            if (messageData.id == 'captcha.ready' && messageData.data) {
                var captcha = messageData.data.captcha;
                window['CAPTCHA_READY'] = captcha;
                var onCaptchaReady = window['ON_CAPTCHA_READY'];
                if ($.isFunction(onCaptchaReady)) onCaptchaReady(captcha);
            }
        } catch (err) {
        }
    }
});

function resetCaptcha() {
    window['CAPTCHA_READY'] = false;
}

function isCaptchaRequired() {
    return window['CAPTCHA_REQUIRED'];
}

function isCaptchaReady() {
    return window['CAPTCHA_READY'];
}

function showCaptchaDialog(onCaptchaReady) {
    window['ON_CAPTCHA_READY'] = onCaptchaReady;
    showUniDialog('/static/captcha-dialog.html', 600, 350, true);
}
