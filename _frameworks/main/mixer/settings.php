<?php
/* (C) Websplosion LTD., 2001-2014

IMPORTANT: This is a commercial software product
and any kind of using it must agree to the Websplosion's license agreement.
It can be found at http://www.chameleonsocial.com/license.doc

This notice may not be removed from the source code. */

$g['template_options'] = array(
    'name' => 'mixer',
    'logo_w' => 287,
    'logo_h' => 75,
    'logo_inner_w' => 173,
    'logo_inner_h' => 66,
    'new_videos_on_main_pag' => 'Y',
    'featured_users_on_main_page' => 'Y',
    'main_col_order' => 'N',
    'right_col_order' => 'N',
    'main_page_by_first_menu_item_after_login' => 'Y',
    'no_photo_by_template' => 'Y',
    '3d_chat_custom_css' => 'Y',
    'hide_site_sections' => array(
        'main_page_mode',
        'main_search',
        'blog1',
        'blog2',
    ),
    'im_msg_layout' => 'mixer',
    'menu_items_hide' => array(
        'partner',
        'upgrade',
    ),
    'groups_members_per_page' => 8,
    'events_quests_per_page' => 8,
    'logo_inner' => 'Y',
    'number_items_menu' => 22,
    'menu_admin_banner' => 'Y',
    'banners_places' => array ('home' => 1,
                               'top' => 1,
                               'header' => 1,
                               'right_column' => 0,
                               'footer' => 1,
                               'footer_additional' => 1,
                               'left_column' => 0),
);

global $swf;

$swf['profile']['attributes']['width'] = '652';
$swf['profile']['attributes']['height'] = '864';
$swf['profile']['attributes']['bgcolor'] = 'FF7900';
$swf['profile']['flashvars']['colorbgeditor'] = '0xFF7900';
$swf['profile']['flashvars']['colorbgabout'] = '0xff9e01';
$swf['profile']['flashvars']['colorbgfontabout'] = '0xffc700';
$swf['profile']['flashvars']['colorheaderabout'] = '0xA3062E';
$swf['profile']['flashvars']['colorfontabout'] = '0x000000';
$swf['profile']['flashvars']['colorbgmenu1'] = '0xFF7900';
$swf['profile']['flashvars']['colorbgmenu2'] = '0xFFDF00';
$swf['profile']['flashvars']['colorcontourmenu'] = '0xFFA200';
$swf['profile']['flashvars']['editborder'] = '0xFF7900';
$swf['profile']['flashvars']['bgtabmenu'] = '0xFF7900';
$swf['profile']['flashvars']['tabmenubtn'] = '0xA3062E';
$swf['profile']['flashvars']['bgcanvas'] = '0xFFA200';
$swf['profile']['flashvars']['colorcontourmenu'] = '0xA3062';
$swf['profile']['flashvars']['colormskforbg'] = '0xFF9E01';
$swf['profile']['flashvars']['bgColorPreloader'] = '0xFF9E01';

$swf['flashchat']['attributes']['width'] = '746';
$swf['flashchat']['attributes']['height'] = '500';
$swf['flashchat']['attributes']['bgcolor'] = 'FFb200';
$swf['flashchat']['flashvars']['bgColor'] = '0xFFb200';
$swf['flashchat']['flashvars']['btnRoomsColor'] = '0xFF7900';
$swf['flashchat']['flashvars']['usersColor'] = '0xFF7900';

$swf['games']['attributes']['bgcolor'] = 'FF7900';
$swf['games']['flashvars']['bgColor'] = '0xFF7900';