(function ($) {
	$.fn.open = function (t, fn) {if (this[0]) return this.data('pp_open')(t, fn)}
	$.fn.close = function (t, fn, remove) {if (this[0]) return this.data('pp_close')(t, fn, remove)}
	$.fn.modalPopup = function (opt) {
		opt=opt||{};
		var isVisible = false, el=this.addClass('pp_cont');
		var popup = $('<div /><div />');
		popup.eq(0).addClass('pp_shadow '+(opt.shClass||'')).css(opt.shCss||{});
		popup.eq(1).addClass('pp_wrapper pp_body '+(opt.wrClass||'')).css(opt.wrCss||{}).append(el);
		el.css(opt.css||{left:0, top:0, margin:'25px 3px'})
		 .data('popup', popup.hide().appendTo('body')).show();

		el.data('pp_close', el.close=function(t, fn, remove) {
			if (isVisible) {
                var c=$('.pp_wrapper:visible').length;
				popup.stop().fadeOut($.isNumeric(t)?t:"fast", function(){
                    if(c==1){
                        $('.wrapper').css('padding-right', '')
                        $('body').removeClass('themodal-lock');
                    }
					if ($(this).is('.pp_body') && typeof(fn)=='function') fn.call(el[0], el);
					if (remove) el.remove()
				});
				isVisible = false;
			}
			return el
		})

		el.data('pp_open', el.open=function(t, fn) {
			if (!isVisible) {
                if(!$('.pp_wrapper:visible')[0]){
                    var w=$('body').width();
                    $('.wrapper').width(w);
                    $('body').addClass('themodal-lock');
                    $('.wrapper').css({width:'', paddingRight: $('body').width()-w})
                }
				popup.stop().fadeIn($.isNumeric(t)?t:"fast", function(){
					if ($(this).is('.pp_body') && typeof(fn)=='function') fn.call(el[0], el);
				});
				isVisible = true;
			}
			return el
		})

		el.remove=function() {
			popup.remove(); return el
		}
		popup.options = opt;

		return el

		//$(document).keyup(function (evt) {
		//    evt = evt || window.event;
		//    if (evt.keyCode == 27 && isVisible) close();
		//});
	};
})(jQuery)