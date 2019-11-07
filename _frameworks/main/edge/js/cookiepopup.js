(function ($) {
    "use strict";

    var cookiePopupHtml = '<div id="cookie-popup-container">' +
        '<div class="cookie-popup" style="display: none;">' +
            '<div class="cookie-popup-inner">' +
                '<div class="cookie-popup-left">' +
                    '<div class="cookie-popup-headline">This website uses cookies</div>' +
                    '<div class="cookie-popup-sub-headline">By using this site, you agree to our use of cookies.</div>' +
                '</div>' +

                '<div class="cookie-popup-right">' +
                    '<a href="#" class="btn btn-success btn-cookie-accept">Accept</a>' +
                    '<a href="#" class="cookie-popup-learn-more">Learn More</a>' +
                '</div>' +
            '</div>' +
            '<div class="cookie-popup-lower" style="display: none;">' +
            '</div>' +
        '</div>' +
    '</div>';

    var onAccept;

    $.extend({
        acceptCookies : function(options) {
            var cookiesAccepted = getCookie("cookiesAccepted");

            if (!cookiesAccepted) {
                var cookiePopup = $(cookiePopupHtml);

                var fnWidthPopup=function(){
                    var $w=$jq('body'), w=$w.width(), d=w-$w[0].clientWidth+20;
                    $jq('.cookie-popup-right').css('padding-right', d+'px')
                }

                var position = "bottom";

                if(options != undefined) {
                    position = options.position != undefined ? options.position : "bottom";

                    if(options.title != undefined)
                        cookiePopup.find('.cookie-popup-headline').text(options.title);
                    if(options.text != undefined)
                        cookiePopup.find('.cookie-popup-sub-headline').html(options.text);
                    if(options.acceptButtonText != undefined)
                        cookiePopup.find(".btn-cookie-accept").text(options.acceptButtonText);
                    if(options.learnMoreButtonText != undefined)
                        cookiePopup.find(".cookie-popup-learn-more").text(options.learnMoreButtonText);
                    if(options.learnMoreInfoText != undefined)
                        cookiePopup.find(".cookie-popup-lower").text(options.learnMoreInfoText);
                    if(options.theme != undefined)
                        cookiePopup.addClass("theme-" + options.theme);
                    if(options.onAccept != undefined)
                        onAccept = options.onAccept;
                    if(options.learnMore != undefined) {
                        if(options.learnMore == false)
                            cookiePopup.find(".cookie-popup-learn-more").remove();
                    }
                    if(options.learnMoreText != undefined) {
                        cookiePopup.find(".cookie-popup-lower").html(options.learnMoreText);
                    }
                }

                cookiePopup.find('.cookie-popup').addClass("position-" + position);
                cookiePopup.find('.more_link').click(function(){
                    OpenWindow(this.href,'650','400');
                    return false;
                })
                $jq('#cham-page').append(cookiePopup);
                fnWidthPopup();
                $win.on('resize',fnWidthPopup);
                $('.cookie-popup').delay(100).slideToggle();

            }
        }
    });

    $(function(){
        $('body').on('click', '.btn-cookie-accept', function (e) {
            saveCookie();
            $('.cookie-popup').slideToggle();
            if (typeof onAccept === "function")
                onAccept();
            return false;
        }).on('click', '.cookie-popup-learn-more', function (e) {
            $('.cookie-popup-lower').slideToggle();
            return false;
        });
    })

    function getCookie(cname) {
        var name = cname + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }

    function saveCookie() {
        var expires = "expires=Tue, 01 Jan 2038 00:00:01 GMT";
        document.cookie = "cookiesAccepted=true; " + expires + "; path=/";
    }
}(jQuery));