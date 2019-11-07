/* Color sheme impact */
function main_page_header_background_type(){
    $('#main_page_header_background_type').change(function() {
        if (this.value == 'color') {
            $('#label_main_page_header_background_color_direction, #main_page_header_background_color_direction').hide();
            hideColor($('.field_main_page_header_background_color_upper'));
            hideColor($('.field_main_page_header_background_color_lower'));
            hideInput($('#input_main_page_header_background_color_upper_stop'));
            hideInput($('#input_main_page_header_background_color_lower_stop'));
            showColor($('.field_main_page_header_background_color'));
        } else {
            hideColor($('.field_main_page_header_background_color'));
            $('#label_main_page_header_background_color_direction, #main_page_header_background_color_direction').show();
            showColor($('.field_main_page_header_background_color_upper'));
            showColor($('.field_main_page_header_background_color_lower'));
            showInput($('#input_main_page_header_background_color_upper_stop'));
            showInput($('#input_main_page_header_background_color_lower_stop'));
        }
    }).change();

}

function color_scheme_background_type_impact(){
    $('#color_scheme_background_type_impact').change(function() {
        if (this.value == 'color') {
            $('#label_color_scheme_background_color_direction_impact, #color_scheme_background_color_direction_impact').hide();
            hideColor($('.field_color_scheme_background_color_upper_impact'));
            hideColor($('.field_color_scheme_background_color_lower_impact'));
            hideInput($('#input_color_scheme_background_color_upper_stop_impact'));
            hideInput($('#input_color_scheme_background_color_lower_stop_impact'));
            showColor($('.field_color_scheme_background_color_impact'));
        } else {
            hideColor($('.field_color_scheme_background_color_impact'));
            $('#label_color_scheme_background_color_direction_impact, #color_scheme_background_color_direction_impact').show();
            showColor($('.field_color_scheme_background_color_upper_impact'));
            showColor($('.field_color_scheme_background_color_lower_impact'));
            showInput($('#input_color_scheme_background_color_upper_stop_impact'));
            showInput($('#input_color_scheme_background_color_lower_stop_impact'));
        }
    }).change();
}

function color_scheme_mobile_main_page_background_type_impact(){
    $('#color_scheme_mobile_main_page_background_type_impact').change(function() {
        if (this.value == 'color') {
            $('#label_color_scheme_mobile_main_page_background_color_direction_impact, #color_scheme_mobile_main_page_background_color_direction_impact').hide();
            hideColor($('.field_color_scheme_mobile_main_page_background_color_upper_impact'));
            hideColor($('.field_color_scheme_mobile_main_page_background_color_lower_impact'));
            hideInput($('#input_color_scheme_mobile_main_page_background_color_upper_stop_impact'));
            hideInput($('#input_color_scheme_mobile_main_page_background_color_lower_stop_impact'));
            showColor($('.field_color_scheme_mobile_main_page_background_color_impact'));
        } else {
            hideColor($('.field_color_scheme_mobile_main_page_background_color_impact'));
            $('#label_color_scheme_mobile_main_page_background_color_direction_impact, #color_scheme_mobile_main_page_background_color_direction_impact').show();
            showColor($('.field_color_scheme_mobile_main_page_background_color_upper_impact'));
            showColor($('.field_color_scheme_mobile_main_page_background_color_lower_impact'));
            showInput($('#input_color_scheme_mobile_main_page_background_color_upper_stop_impact'));
            showInput($('#input_color_scheme_mobile_main_page_background_color_lower_stop_impact'));
        }
    }).change();
}
/* Color sheme impact */

$(function(){
    $('.group_options').show();
})