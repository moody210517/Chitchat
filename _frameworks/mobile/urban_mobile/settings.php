<?php
/* (C) Websplosion LTD., 2001-2014

IMPORTANT: This is a commercial software product
and any kind of using it must agree to the Websplosion's license agreement.
It can be found at http://www.chameleonsocial.com/license.doc

This notice may not be removed from the source code. */

$g['template_options'] = array(
    'set' => 'urban',
    'name' => 'urban_mobile',
    'main_template' => array('urban'),
    'type_payment_features' => 'urban',
    'logo_mobile_inner' => 'Y',
    'logo_mobile_svg' => 'Y',
    'logo_mobile_inner_svg' => 'Y',
    'logo_w' => 131,
    'logo_h' => 29,
    'logo_inner_w' => 108,
    'logo_inner_h' => 19,

    'login_page_template' => 'login.html',
    'register_page_template' => 'register.html',
    'display_info_page_template' => '_profile_info.html',
    'login_by_name_or_mail' => 'Y',
    'not_display_module' => array('profile_menu', 'friends_list', 'search_filter'),
    'profile_photo_w' => 315,
    'home_page' => 'profile_view.php',

    'usersinfo_per_page' => 10,
    'usersinfo_pages_per_list' => 10,
    'list_users_info_ajax' => 'Y',
    'list_users_info_tmpl' => 'Y',
    'do_not_show_me_in_search' => 'Y',
    'private_photo_by_template' => 'Y',
    'custom_profile_html' => 'profile_html_urban_mobile',
    'custom_profile_info_html' => 'profile_html_urban',

    'custom_show_part_interests' => 'Y',
    'custom_show_part_interests_number' => 5,
    'custom_show_part_interests_trim' => array(13,18),

    'custom_show_part_gifts_number' => 3,

    'page_upgrade_allowed' => 'Y',

    'hide_profile_settings' => array('set_can_comment_photos', 'color_scheme', 'set_email_interest', 'wall_like_comment_alert',
                                     'albums_to_see', 'default_online_view', 'autologin', 'smart_profile',
                                     'wall_only_post', 'sound', 'framework_version', 'set_email_mail'),
    'number_empty_block_spotlight' => 6,

    'upload_icon_field_i_am_here_to' => 'Y',
    'upload_icon_field_interests' => 'Y',
    'upload_icon_field_orientation' => 'Y',

    'order_mobile_user_menu' => 'Y',

    'private_photo_by_template' => 'Y',
    'no_photo_by_template' => 'Y',

    'banner_header_mobile' => 'Y',

    'format_date_months_join' => 'M',
    'redirect_user_blocked' => 'Y',
    'width_captcha' => 95,
    'height_captcha' => 24,
    'access_check_to_profile' => 'Y',

    'profile_photo_main_size' => 'bm',
    'profile_photo_size' => 'mm',
    'encounters_only_public_photos' => 'Y',

    'type_profile_photo' => 'urban_mobile'
);