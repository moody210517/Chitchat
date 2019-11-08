(function($) {
   $.fn.flowtype = function(options) {
      var settings = $.extend({
         maxWidth  : 1000,
         minFont   : 16,
         maxFont   : 24,
         callback  : function(){}
      }, options),
      changes = function(el) {
        var $el=$(el), isFont=false;
        for (var i=settings.maxFont; i>=settings.minFont; i--) {
            $el.css('font-size', i+'px');
            if($el.width()<=settings.maxWidth){
                //console.log('Font-size',i);
                settings.callback.call(el);
                isFont=true;
                break;
            }
        }
        if(!isFont){
            settings.callback.call($el);
        }
      };
      return this.each(function() {
         var that = this;
         $(window).resize(function(){changes(that);});
         changes(this);
      });
   };
}(jQuery));