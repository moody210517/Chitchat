(function($) {
    $.fn.hint = function (options) {
        
       return this.each(function() {  
            options = $.extend({
                    hint: "Description",
                    setValue: false
            }, options);
            
            var container = $(this);
            if (options.setValue == true) {
               container.attr('value', options.hint) 
            }
            container.focus(function(){
                        if (container.val() == options.hint){
                                container.attr('value', '')
                        }
                      })
                     .blur(function(){
                        if (container.val().trim() == ''){
                                container.attr('value', options.hint);
                        }
                      })
      });
    };
})(jQuery)



