(function($) {
    $.fn.editable_input = function (options) {
        
       return this.each(function() {  
            options = $.extend({
                    lAdd: "Click to add...",
                    lEdit: "Click to edit...",
                    lSave: "Save...",
                    inputSize: 1000,
                    type: "album",
                    typeData: "desc", //"title"
                    style: '',
                    classHover: 'input_editable_hover',
                    colorHover: '',
                    classInput: 'editable_input',
                    editor: 'text', //"textarea"
                    location: 'ajax.php',
                    empty: false
            }, options);
            
            var container = $(this),
                text = container.text().replace(/\s/g,'');
            
            container.data('startEdit', false);
            container.data('valueDefault', text);
            container.data('colorHoverDefault', container.css('background-color'));
            container.data('classHoverDefault', container.attr('class'));
            
            if (text == '') {container.text(options.lAdd);}
            container
                .on('mouseover', function() {
                    if($("#inputEdit").length == 0) {
                        if (container.text() == options.lAdd) { 
                            container.attr('title', options.lAdd);
                        }
                        if (options.colorHover != '')
                            container.css('background-color', options.colorHover);
                        container.attr('class', container.data('classHoverDefault') + ' ' + options.classHover);
                    }
                }).on('mouseout', function() {
                    if (options.colorHover != '')
                        container.css('background-color', container.data('colorHoverDefault'));
                    container.attr('class', container.data('classHoverDefault'));
                }).on('mouseup', function() {
                    if (container.data('startEdit') == false) {
                        var valueDiv = $.trim(container.text());
                        if (valueDiv == options.lAdd) {valueDiv = '';}
                        container.data('p_left', container.css('padding-left'));
                        container.css('padding-left', '0px');
                        if (options.editor == 'text') {
                        container.html('<input class="' + options.classInput + '" id="inputEdit" type="text" name="content"' 
                                        + ' size="' + options.inputSize + '"'
                                        + ' style="' + options.style
                                        + '; font-family: ' + container.css("font-family")
                                        + '; font-weight: ' + container.css("font-weight")
                                        + '; font-style: ' + container.css("font-style")
                                        + '; font-size: ' + container.css("font-size")
                                        + ';"/>');
      
                        } else if (options.editor == 'textarea') {
                        container.html('<textarea class="' + options.classInput + '" id="inputEdit" name="content"' 
                                        + ' size="' + options.inputSize + '"'
                                        + ' style="' + options.style
                                        + ' font-family: ' + container.css("font-family")
                                        + '; font-weight: ' + container.css("font-weight")
                                        + '; font-style: ' + container.css("font-style")
                                        + '; font-size: ' + container.css("font-size") + ';"></textarea><br>');   
                        }        
                        container.data('startEdit', true); 
                        $('#inputEdit').val(valueDiv).focus();                       
                    } 
                })
                $('body').on('keypress', '#inputEdit', function(e){
                    if(e.keyCode == 13){ 
                        $(this).blur();
                    }
                }).on('blur', '#inputEdit', function(){
                    if (container.data('startEdit') == true)
                    {
                        var input = $('#inputEdit'),
                            value = $.trim(input.val()),
                            valueNoSpace = value.replace(/\s/g,''),
                            id = container.attr('id').split('_'),
                            index = id.length - 1;
                        input.remove();
                        if (((value != container.data('valueDefault'))
                            && (valueNoSpace != '')) || (options.empty == true)){
                            $.ajax({type: 'POST',
                                    url: options.location,
                                    data: {'cmd':'saveoptions',
                                           'data': value,
                                           'type': options.type, 
                                           'type_data': options.typeData,
                                           'id': id[index]},
                                    beforeSend: function(){
                                            container.text(options.lSave);
                                    },
                                    dataFilter: function(){
                                            container.data('valueDefault', value);
                                    },
                                    success: function(){
                                        var valueDefault = container.data('valueDefault');
                                        if ((valueNoSpace == '') 
                                                && (valueDefault == '')){ 
                                            container.text(options.lAdd).attr('title', options.lAdd);}
                                        else 
                                            container.text(valueDefault).attr('title', valueDefault);
                                        container.data('startEdit', false);
                                    }
                            });
                        } else {
                            var valueDefault = container.data('valueDefault');
                            if ((valueNoSpace == '') 
                                && (valueDefault == '')){ 
                            
                                container.text(options.lAdd).attr('title', options.lAdd);}
                            else 
                                container.text(valueDefault).attr('title', valueDefault);
                                container.data('startEdit', false);
                        }
                    }
                    container.css('padding-left', container.data('p_left'));
                });
         });
    };
})(jQuery)