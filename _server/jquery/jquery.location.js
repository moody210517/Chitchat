(function($) {
    $.fn.location = function (options) {

       return this.each(function() {
            options = $.extend({
                    method: 'states',
                    location: 'tools_ajax.php',
                    elState: '#state',
                    elCity: '#city',
                    first_option_state: '- Select All -',
                    first_option_city: '- Select All -'
            }, options);

            var container = $(this);

            container
                .on('change', function() {
                    $.ajax({type: 'POST',
                            url: options.location,
                            data: {'cmd':'location',
                                   'method': options.method,
                                   'param': container.val()},
                            success: function(response){
                                switch (options.method) {
                                    case 'states':
                                        $(options.elState).html('<option value="0">'
                                                                        + options.first_option_state
                                                                        + '</option>' + response);
                                        $(options.elCity).html('<option value="0">'
                                                                        + options.first_option_city
                                                                        + '</option>');
                                        break
                                    case 'cities':
                                        $(options.elCity).html('<option value="0">'
                                                                        + options.first_option_city
                                                                        + '</option>' + response);
                                        break
                                }

                           }
                    });
                })
         });
    };
})(jQuery)

