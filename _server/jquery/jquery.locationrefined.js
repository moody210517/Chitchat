(function($) {
    $.fn.locationrefined = function (options) {

       return this.each(function() {
            options = $.extend({
                    location: 'ajax.php',
                    elState: '#state',
                    elCity: '#city',
                    elAll: $('#country, #state, #city'),
                    emptyOption: 'Select All',
                    callback: null,
            }, options);

            var container = $(this),
                state = $(options.elState),
                city = $(options.elCity),
                loc = $('#country, #state, #city');

            container
                .on('change', function() {
                    var cmd = $(this).data('location');
                    $.ajax({type: 'POST',
                            url: options.location,
                            cache: false,
                            headers: {'cache-control': 'no-cache'},
                            data: {cmd:cmd,
                                   select_id:this.value,
                                   filter:'1',
                                   list: '0'},
                            //timeout: 5000,
                            beforeSend: function(){
                                loc.prop('disabled', true).parent('.jq-selectbox').addClass('disabled')
                                                          .find('.jq-selectbox__dropdown').remove();

                            },
                            success: function(res){
                                var data=checkDataAjax(res);
                                if (data) {
                                    var option='<option value="0">' + options.emptyOption + '</option>';
                                    switch (cmd) {
                                        case 'geo_states':
                                            state.html(option + data.list);
                                            city.html(option);
                                            break
                                        case 'geo_cities':
                                            city.html(option + data.list);
                                            break
                                    }

                                    if (typeof options.callback === 'function') {
                                        options.callback();
                                    }
                                }
                                loc.prop('disabled', false).trigger('refresh');
                            }
                    });
                })
         });
    };
})(jQuery)