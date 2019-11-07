//var pathToHeaderjs=$('script:last')[0].src.replace('header.js','');
$('<link rel="stylesheet" type="text/css" />').appendTo('head').load(function(){
var parScale=-.9, pDur=1000, pReady=5;
var html='<div class="f-bg">\
    <img src="/blur1.png" style="top: 0px; left: 288px;">\
    <img src="/ring_l.png" style="left: 125px; top: 221px;">\
    <img src="/ring_r.png" style="left: 612px; top: 192px;">\
    <img src="/ribbon.png" style="visibility:hidden">\
    <div style="top: -19px; left: 27px; background-image:url(/ribbon.png)"></div>\
    <img src="/mask.png" style="left: 736px; top: 66px;">\
    <img src="/star.png" style="left: 162px; top: 240px;">\
    <img src="/star.png" style="top: 3px; left: 754px;">\
    <img src="/blur_y.png" style="top: 124px; left: 868px;">\
    <img src="/apple.png" style="left: 860px; top: 160px;">\
  </div>\
  <img src="/ked.png" style="top: 242px; left: 54px;">\
  <img src="/ball_red.png" style="left: 105px !important; top: 120px;">\
  <img src="/ball_y.png" style="left: 831px; top: 15px;">\
  <img class="fppl" src="/boy1.png" style="top: -10px; left: 215px;">\
  <img class="fppl" src="/girl5.png" style="left: 646px; top: 78px;">\
  <img class="fppl" src="/boy2.png" style="left: 310px; top: -5px;">\
  <img class="fppl" src="/boy4.png" style="top: 4px; left: 538px;">\
  <img class="fppl" src="/girl3.png" style="top: -10px; left: 377px;">\
  <div id="f-fire"><div style="background-image:url(/fire.png)"></div></div>\
  <img src="/flor.png" style="left: 59px; top: 322px;">\
  <div class="f-bg">\
    <img id="logo_blur3" src="/blur3.png" style="top: 257px; left: 288px; ">\
    <img id="logo_header" src="logo.png" style="left: 413px; top: 250px; ;">\
  </div>'.replace(/\/(?!div)/g, pathToHeaderjs+'images/header/');

  //html = html.replace(/\/images\/header\/logo\.png/g, headerLogo);
  html = html.replace(/logo.png/g, headerLogo);
  //console.log(html);

var $=jQuery, bodyS=$('body')[0].style, pPos=[], loadTimer,
  trans=('transition' in bodyS)||('-webkit-transition' in bodyS),
  reqAF=window.requestAnimationFrame||window.webkitRequestAnimationFrame||
	window.mozRequestAnimationFrame ||function(f,el) {f()},
  $flash=$('#flash').append(html).mousemove(function(e){
	if (pReady>0) return
	var pos=(e.pageX-$(window).width()/2)*parScale/*, tr='skewX('+pos/-50+'deg)';
	reqAF( function(){$fl.css({transform:tr, WebkitTransform:tr}) }, $fl)*/
//	console.log(pos)
	$('img[src*="girl3"]', $flash).moveX(pos/5)
	$('[src*="boy2"], [src*="boy4"]', $flash).moveX(pos/4)
	$('[src*="boy1"]', $flash).moveX(pos/3)
	$('[src*="girl5"]', $flash).moveX(pos/3.4)
	$('[src*="logo."]', $flash).moveX(-pos/25)
	$('[src*="blur3"]', $flash).moveX(-pos/35)
  }).mouseleave(function(e){$people.add('.f-bg:eq(1) img').moveX(0)})
	.one('mouseover', function(){$('#flash [src*="mixer."]').addClass('f-ready2')}),
  $fl=$('#flash #f-fire'),
  pLoad=function(el){
	if (this!=window) el=this;
	if ((bgReady>0)||$(el).hasClass('f-ready')) return;
	$(el).addClass('f-ready')
	var x='rotate('+(Math.random()*4-2)+'deg)';
	setTimeout(function(){ pReady--;// console.log(pReady)
		reqAF( function(){$(el).css({transform:x, WebkitTransform:x}) }, el)
	}, Math.random()*320+280)
  },
  $people=$('.fppl', $flash).load(pLoad)
  $bgImg=$('img:not(.fppl)', $flash).bind('load', imgLoad), bgReady=$bgImg.length;
  function imgLoad(el){
	if (this!=window) el=this;
	setTimeout(function(){
		if ($(el).hasClass('f-ready')) return;
		$(el).addClass('f-ready');
		loadTimer=new Date()*1;
	//console.log(el.src.replace(pathToHeaderjs, ''), bgReady)
		if (--bgReady) return;
		$('#flash #f-fire').addClass('f-ready');
		setTimeout(function(){
			bgReady=0;
			$('#flash').addClass('f-ready');
			$('#flash .fppl:not(.f-ready)').each(function(){
				var el=this; setTimeout(function(){
					pLoad(el)
				}, Math.random()*700)
			})
		}, 600)
	}, Math.random()*(Math.max(1500+loadTimer-new Date()*1,0)||3000))
  };
$(window).load(function(){
	//console.log('window', bgReady)
	$bgImg.each(imgLoad);
    var logo_header = $('#logo_header'),
        logo_blur = $('#logo_blur3'),
    left_logo = parseInt(logo_blur.css('left'), 10) + logo_blur.width()/2 - logo_header.width()/2;
    logo_header.css('left', left_logo+'px');
})
$.fn.moveX=function(val){
	if (trans) { this.each(function(i){
		var $el=$(this), x='translateX('+val+'px)';
		reqAF( function(){$el.css({transform:x, WebkitTransform:x}) }, this)
	}) } else {this.stop().animate({marginLeft:val}, !trans&&pDur)}
}
/*$('#flash img').attr({draggable:'false', alt:''})
 .mousedown(function(e){
	x0=e.clientX-this.offsetLeft; y0=e.clientY-this.offsetTop;
	targ=this
})
$(window).mouseup(function(){targ=0}).mousemove(function(e){
    if (targ) {
        $(targ).css({left:e.clientX-x0, top:e.clientY-y0})
        return false
    }
}).mouseup()*/
}).attr('href', pathToHeaderjs+'css/header.css')
!$('script:last').hasClass('noConflict')||$.noConflict()