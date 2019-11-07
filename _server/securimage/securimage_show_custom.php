<?php

$g['mobile_redirect_off'] = true;
if (isset($_GET['site_part_mobile']) && $_GET['site_part_mobile']) {
    $sitePart = 'mobile';
}
include('../../_include/core/main_start.php');

$img = new securimage();
$ratioFontSize = 1;
$ratioDistancee = 1;
$width = 175;
$height = 45;
$optionSet = get_param('tmpl', Common::getOption('set', 'template_options'));
if ($optionSet == 'urban') {
    $width = get_param('width_captcha', Common::getOption('width_captcha', 'template_options'));
    $height = get_param('height_captcha', Common::getOption('height_captcha', 'template_options'));
} else {
    $ratioFontSize = 2;
    $ratioDistancee = 1.8;
}

$ratioFontSizeTmpl = Common::getOption('ratio_font_captcha', 'template_options');
if ($ratioFontSizeTmpl) {
    $ratioFontSize = $ratioFontSizeTmpl;
}
$ratioDistanceeTmpl = Common::getOption('ratio_distance_captcha', 'template_options');
if ($ratioDistanceeTmpl) {
    $ratioDistancee = $ratioDistanceeTmpl;
}

//The desired width of the CAPTCHA image.
$img->image_width = $width;
//The image format for output.
$img->image_height = $height;
//The percentage of transparency
$img->text_transparency_percentage = Common::getOption('captcha_text_transparency_percentage');
//The length of the code to generate.
$img->code_length = Common::getOption('captcha_code_length');
//The character set for individual characters in the image.
$img->charset = 'ABCDEFGHKLMNPRSTUVWYZ23456789';
$img->font_size = Common::getOption('captcha_font_size') * $ratioFontSize;
//Letters can be spaced apart at random distances.
$img->text_minimum_distance = Common::getOption('captcha_text_minimum_distance') * $ratioDistancee;
//Letters can be spaced apart at random distances.
$img->text_maximum_distance = Common::getOption('captcha_text_maximum_distance') * $ratioDistancee;
//The background color for the image.
$img->image_bg_color = "#FFFFFF";
//String of HTML hex colors to use.
$img->multi_text_color = Common::getOption('captcha_multi_text_color');
//Draw vertical and horizontal lines on the image
$img->draw_lines = Common::isOptionActive('captcha_draw_lines');
//The color of the lines drawn on the image
$img->line_color = "#80BFFF";
$img->ttf_file = dirname(__FILE__) . '/elephant.ttf';


//For added security, it is a good idea to draw arced lines over the letters to make it harder for bots to segment the letters.
$img->arc_linethrough = Common::isOptionActive('captcha_arc_linethrough');
//The colors or color of the arced lines.
$img->arc_line_colors = "#8080ff";

$img->show(); // alternate use:  $img->show('/path/to/background.jpg');

include('../../_include/core/main_close.php');