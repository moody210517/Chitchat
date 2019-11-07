/**
 * LavaLamp - A menu plugin for jQuery with cool hover effects.
 * @requires jQuery v1.2.x
 * http://nixbox.com/lavalamp.php
 * Version: 1.3
 */
 
(function($) {
$.fn.lavaLamp = function(o) {
	o = $.extend({ fx: 'linear', speed: 500, click: function(){return true}, linum: 'no' }, o || {});

	return this.each(function() {
		var path = location.pathname + location.search + location.hash;
		var $current = new Object;
		var $li = $('li', this);
		
		// check for complete path match, if so flag element into $current
		if ( o.linum == 'no' )
			$current = $('li a[href$="' + path + '"]', this).parent('li');
			
		// double check, this may be just an anchor match
		if ($current.length == 0 && o.linum == 'no')
			$current = $('li a[href$="' + location.hash + '"]', this).parent('li');

		// no default current element matches worked, or the user specified an index via linum
		if ($current.length == 0 || o.linum != 'no') {
			if (o.linum == 'no') o.linum = 0;                         
			$current = $($li[o.linum]);
		}

		var $back = $('<li class="back"><div class="left"></div><div class="bottom"></div><div class="corner"></div></li>').appendTo(this);
		var curr = $('li.current', this)[0] || $($current).addClass('current')[0];

		$li.not('.back').hover(function() {
			move(this);
		}, function(){});

		$(this).hover(function(){}, function() {
			move(curr);
		});

		$li.click(function(e) {
			setCurr(this);
			return o.click.apply(this, [e, this]);
		});

        setCurr(curr);

        function setCurr(el) {
            $back.css({ 'left': el.offsetLeft+'px', 
						'width': el.offsetWidth+'px', 
						'height': el.offsetHeight+'px', 
						'top': el.offsetTop+'px' });
            curr = el;
		};

		function move(el) { 
			$back.stop()
			.animate({
					width: el.offsetWidth,
					left: el.offsetLeft,
					height: el.offsetHeight,
					top: el.offsetTop
			}, o.speed, o.fx);
		};
	});
};
})(jQuery);
