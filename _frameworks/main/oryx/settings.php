<?php
/* (C) Websplosion LTD., 2001-2014

IMPORTANT: This is a commercial software product
and any kind of using it must agree to the Websplosion's license agreement.
It can be found at http://www.chameleonsocial.com/license.doc

This notice may not be removed from the source code. */

if (IS_DEMO) {
    global $g;
    Common::setOptionRuntime('Y', 'main_users');
    Common::setOptionRuntime('N', 'status_relation');
    $g['user_var']['relation']['status'] = 'inactive';
}

$g['template_options'] = array(
    'name' => 'oryx',
    'logo_w' => 207,
    'logo_h' => 47,
    'no_photo_by_template' => 'Y',
    '3d_chat_custom_css' => 'Y',
    'hide_site_sections' => array(
        'main_search',
        'main_page_header_mode',
    ),
    'new_videos_on_main_pag' => 'N',
    'featured_users_on_main_page' => 'N',
    'main_col_order' => 'Y',
    'right_col_order' => 'Y',
    'events_quests_per_page' => 8,
    'groups_members_per_page' => 8,
    'im_msg_layout' => 'oryx',
    'header_color_admin' => 'Y',
    'website_background' => 'Y',
    'website_background_default' => '77.jpg',
    'website_background_compression_ratio' => 'Y',
    'upload_image_main_page' => 'Y',
    'upload_big_banner_main_page' => 'Y',
    'upload_small_banner_main_page' => 'Y',
    'top_five_button' => 'Y',
    'network' => 'Y',
    'stats' => 'N',
    'header_block_info' => 'Y',
    'number_video_main' => 3,
    'menu_admin_banner' => 'Y',
    'banners_places' => array ('home' => 1,
                               'top' => 1,
                               'header' => 1,
                               'right_column' => 1,
                               'footer' => 1,
                               'footer_additional' => 1,
                               'left_column' => 0),
    'color_scheme_settings' => 'Y',
    'color_scheme' => array('default' => array('title' => 'Default', 'upper' => '#5a9dd2', 'lower' => '#185f92'),
                            'purple_dreams'=> array('title' => 'Purple Dreams', 'upper' => '#d0328d', 'lower' => '#8e045a'),
                            'green_water' => array('title' => 'Green Water', 'upper' => '#63c7b5', 'lower' => '#2b837b'),
                            'russian_red' => array('title' => 'Russian Red', 'upper' => '#f23131', 'lower' => '#850000'),
                            'autumn_woods' => array('title' => 'Autumn Woods', 'upper' => '#bf8f00', 'lower' => '#835700'),
                            'fresh_morning' => array('title' => 'Fresh Morning', 'upper' => '#40c7db', 'lower' => '#1972a3'),
                            'royal' => array('title' => 'Royal', 'upper' => '#bf0000', 'lower' => '#000000'),
                            'business' => array('title' => 'Business', 'upper' => '#f23a3a', 'lower' => '#606060'),
                            'natural' => array('title' => 'Natural', 'upper' => '#a2d45a', 'lower' => '#a37505'),
                            'bubble_gum' => array('title' => 'Bubble Gum', 'upper' => '#e3368a', 'lower' => '#007e62'),
                            'toolbox' => array('title' => 'Toolbox', 'upper' => '#696cc5', 'lower' => '#2e3076'),
                            'mint_candy' => array('title' => 'Mint Candy', 'upper' => '#63caa6', 'lower' => '#1d7b89'),
                            'pink' => array('title' => 'Pink', 'upper' => '#ee8bcd', 'lower' => '#ae036d'),
                            'vanilla' => array('title' => 'Vanilla', 'upper' => '#ee8bcd', 'lower' => '#00b27b'),
                            'bread_and_butter' => array('title' => 'Bread and Butter', 'upper' => '#e3be00', 'lower' => '#ab8700'),
                            'strict' => array('title' => 'Strict', 'upper' => '#6ADB90', 'lower' => '#606060'),
                            'navy' => array('title' => 'Navy', 'upper' => '#5DC5DB', 'lower' => '#606060'),
                            'tenderness' => array('title' => 'Tenderness', 'upper' => '#D84882', 'lower' => '#606060'),
                            'green_and_gray' => array('title' => 'Green and Gray', 'upper' => '#A1C348', 'lower' => '#606060'),
                            'african_safari' => array('title' => 'African Safari', 'upper' => '#E3B400', 'lower' => '#606060'),
                            'french_evening' => array('title' => 'French Evening', 'upper' => '#8A73C5', 'lower' => '#606060'),
                            'sea_morning' => array('title' => 'Sea Morning', 'upper' => '#47A8C3', 'lower' => '#5C5C5C'),
                            'freshness' => array('title' => 'Freshness', 'upper' => '#42B262', 'lower' => '#5C5C5C'),
                            "elenas_tears" => array('title' => "Elena's Tears", 'upper' => '#31B0B6', 'lower' => '#5C5C5C'),
                            'grayscale' => array('title' => 'Grayscale', 'upper' => '#ABABAB', 'lower' => '#5C5C5C'),
                            'rainy_day' => array('title' => 'Rainy Day', 'upper' => '#79B0C1', 'lower' => '#5C5C5C'),
                            'clean_fun' => array('title' => 'Clean Fun', 'upper' => '#4CB1D0', 'lower' => '#7C7C7C'),
                            'modest_green' => array('title' => 'Modest Green', 'upper' => '#8FB662', 'lower' => '#7C7C7C'),
                            'custom' => array('title' => 'Custom', 'upper' => '', 'lower' => ''),
    ),
    'options_main_title' => 'Y',
    'options_main_text' => 'Y',
);

global $swf;

$swf['profile']['attributes']['width'] = '547';
$swf['profile']['attributes']['height'] = '864';
$swf['profile']['attributes']['bgcolor'] = 'FFFFFF';
$swf['profile']['flashvars']['colorbgeditor'] = '0xFFFFFF';
$swf['profile']['flashvars']['colorbgabout'] = '0xFFFFFF';
$swf['profile']['flashvars']['colorbgfontabout'] = '0xFFFFFF';
$swf['profile']['flashvars']['colorheaderabout'] = '0x000000';
$swf['profile']['flashvars']['colorfontabout'] = '0x000000';
$swf['profile']['flashvars']['colorbgmenu1'] = '0xF0F0F0';
$swf['profile']['flashvars']['colorbgmenu2'] = '0x989898';
$swf['profile']['flashvars']['colorcontourmenu'] = '0x6A6A6A';
$swf['profile']['flashvars']['editborder'] = '0xFAFAFA';
$swf['profile']['flashvars']['bgtabmenu'] = '0x6f6f6f';
$swf['profile']['flashvars']['tabmenubtn'] = '0xffffff';
$swf['profile']['flashvars']['bgcanvas'] = '0xFAFAFA';
$swf['profile']['flashvars']['colorcontourmenu'] = '0x666666';
$swf['profile']['flashvars']['colormskforbg'] = '0xFFFFFF';
$swf['profile']['flashvars']['bgColorPreloader'] = '0xFFFFFF';


$swf['flashchat']['attributes']['width'] = '746';
$swf['flashchat']['attributes']['height'] = '500';
$swf['flashchat']['attributes']['bgcolor'] = 'FFFFFF';
$color = str_replace('#', '0x', get_session('color_lower'));
$swf['flashchat']['flashvars']['btnRoomsColor'] = $color;
$swf['flashchat']['flashvars']['usersColor'] = $color;
$swf['flashchat']['flashvars']['bgColor'] = '0xFFFFFF';

$swf['games']['attributes']['bgcolor'] = 'FAFAFA';
$swf['games']['flashvars']['bgColor'] = '0xFAFAFA';

global $gc;
$gc = true;