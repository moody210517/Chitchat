/*
 * Lazy Load - jQuery plugin for lazy loading images
 *
 * Copyright (c) 2007-2013 Mika Tuupola
 *
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Project home:
 *   http://www.appelsiini.net/projects/lazyload
 *
 * Version:  1.9.3
 *
 */

(function($, window, document, undefined) {
    var $window = $(window),
		updates=[];

    $.fn.lazyload = function(options) {
        var elements = this;
        var $container, cont=window.mainContentBlock||window;
        var settings = {
            threshold       : 0,
            failure_limit   : 0,
            event           : "scroll",
            effect          : "show",
            container       : cont,
			containerScroll : null,
            data_attribute  : "original",
            skip_invisible  : true,
            appear          : null,
            load            : null,
            effect_end      : null,
            placeholder     : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXYzh8+PB/AAffA0nNPuCLAAAAAElFTkSuQmCC"
        };

        function update() {
            var counter = 0;
            if (settings.check && !settings.check()) return;
            elements.each(function() {
                var $this = $(this);
                if (settings.skip_invisible && this.style.display=='hidden') return;
                if (!$.inviewport(this, settings)) return;
                if (counter++ > settings.failure_limit) return false;
                $this.trigger("appear");
                /* if we found an image we'll load, reset the counter */
                counter = 0;
            });
        }

        if(options) {
            /* Maintain BC for a couple of versions. */
            if (undefined !== options.failurelimit) {
                options.failure_limit = options.failurelimit;
                delete options.failurelimit;
            }
            if (undefined !== options.effectspeed) {
                options.effect_speed = options.effectspeed;
                delete options.effectspeed;
            }

            $.extend(settings, options);
        }

        /* Cache container as jQuery as object. */
		if ((settings.container=$(settings.container)[0])==window) delete settings.container;
        $container = $(settings.container||$window).add(cont);

        /* Fire one scroll event per scroll. Not one scroll event per image. */
        if (0 === settings.event.indexOf("scroll")) {
			if(settings.containerScroll){
				settings.containerScroll.on(settings.event, update);
			} else {
				$window.on(settings.event, update);
			}
        }

        this.each(function() {
            var self = this;
            var $self = $(self);

            self.loaded = false;

            /* If no src attribute given use data:uri. */
            if ($self.attr("src") === undefined || $self.attr("src") === false) {
                if ($self.is("img")) {
                    $self.attr("src", settings.placeholder);
                }
            }

            /* When appear is triggered load original image. */
            $self.one("appear", settings.appear||function() {
                if (!this.loaded) {
                    if (settings.appear) {
                        var elements_left = elements.length;
                        settings.appear.call(self, elements_left, settings);
                    }
                    var original = $self.data(settings.data_attribute);
                    if (original) $("<img />").one("load", function() {
                        $self.fadeOut(50, function(){
                        if ($self.is("img")) {
                            $self.attr("src", original);
                        } else {
                            $self.css("background-image", "url('" + original + "')");
                        }
                        $self[settings.effect](settings.effect_speed, function(){
                            if (settings.effect_end) {
                                var elements_left = elements.length;
                                settings.effect_end.call(self, elements_left, settings);
                            }
                        });

                        self.loaded = true;

                        /* Remove image from array so it is not looped next time. */
                        var temp = $.grep(elements, function(element) {
                            return !element.loaded;
                        });
                        elements = $(temp);

                        if (settings.load) {
                            var elements_left = elements.length;
                            settings.load.call(self, elements_left, settings);
                        }
                        });
                    }).attr("src", $self.attr("data-" + settings.data_attribute));
                }
            });

            /* When wanted event is triggered load original image */
            /* by triggering appear.                              */
            if (0 !== settings.event.indexOf("scroll")) {
                $self.on(settings.event, function() {
                    if (!self.loaded) {
                        $self.trigger("appear");
                    }
                });
            }
        });

        /* Check if something appears when window is resized. */
        $window.on("resize", update);

        /* With IOS5 force loading images when navigating with back button. */
        /* Non optimal workaround. */
        if ((/(?:iphone|ipod|ipad).*os 5/gi).test(navigator.appVersion)) {
            $window.on("pageshow", function(event) {
                if (event.originalEvent && event.originalEvent.persisted) {
                    elements.each(function() {
                        $(this).trigger("appear");
                    });
                }
            });
        }

        /* Force initial check if images should appear. */
        $(document).ready(function() {
            update();
        });
        update();
        return this;
    };

    /* Convenience methods in jQuery namespace.           */
    /* Use as  $.belowthefold(element, {threshold : 100, container : window}) */

    $.belowthefold = function(element, settings, rect) {
		if (!element.getBoundingClientRect) return false;
        var fold = (window.innerHeight || $window.height());
        if (settings.container) fold = Math.min(fold, settings.container.getBoundingClientRect().bottom);

        return fold <= element.getBoundingClientRect().top - (settings.threshold||0);
    };

    $.rightoffold = function(element, settings, rect) {
		if (!element.getBoundingClientRect) return false;
        var fold = (window.innerWidth || $window.width());
        if (settings.container) fold = Math.min(fold, settings.container.getBoundingClientRect().right);

        return fold <= element.getBoundingClientRect().left - (settings.threshold||0);
    };

    $.abovethetop = function(element, settings, rect) {
		if (!element.getBoundingClientRect) return false;
        var fold = 0;
        if (settings.container) fold = Math.max(0, settings.container.getBoundingClientRect().top);
        return fold >= element.getBoundingClientRect().bottom + (settings.threshold||0);
    };

    $.leftofbegin = function(element, settings, rect) {
		if (!element.getBoundingClientRect) return false;
        var fold = 0;
        if (settings.container) fold = Math.max(0, settings.container.getBoundingClientRect().left);
        return fold >= element.getBoundingClientRect().left + (settings.threshold||0);
    };

    $.inviewport = function(element, settings) {
		if (!element.getBoundingClientRect) return true;
		settings.threshold>>=0;
		var elRect=element.getBoundingClientRect(), top=0, left=0,
			bottom=window.innerHeight||$window.height(), right=window.innerWidth||$window.width();
        if (settings.container) {
			var contRect=settings.container.getBoundingClientRect();
			top = Math.max(0, contRect.top);
			left = Math.max(0, contRect.left);
			bottom = Math.min(bottom, contRect.bottom);
			right = Math.min(right, contRect.right);
		}
		return top   < elRect.bottom + settings.threshold
			&& left  < elRect.right + settings.threshold
			&& bottom> elRect.top - settings.threshold
			&& right > elRect.left - settings.threshold;
     };

    /* Custom selectors for your convenience.   */
    /* Use as $("img:below-the-fold").something() or */
    /* $("img").filter(":below-the-fold").something() which is faster */

    $.extend($.expr[":"], {
        "below-the-fold" : function(a) { return $.belowthefold(a, {}); },
        "above-the-top"  : function(a) { return !$.belowthefold(a, {}); },
        "right-of-screen": function(a) { return $.rightoffold(a, {}); },
        "left-of-screen" : function(a) { return !$.rightoffold(a, {}); },
        "in-viewport"    : function(a) { return $.inviewport(a, {}); },
        /* Maintain BC for couple of versions. */
        "above-the-fold" : function(a) { return !$.belowthefold(a, {}); },
        "right-of-fold"  : function(a) { return $.rightoffold(a, {}); },
        "left-of-fold"   : function(a) { return !$.rightoffold(a, {}); }
    });

})(jQuery, window, document);