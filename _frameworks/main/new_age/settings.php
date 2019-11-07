<?php
/* (C) Websplosion LTD., 2001-2014

IMPORTANT: This is a commercial software product
and any kind of using it must agree to the Websplosion's license agreement.
It can be found at http://www.chameleonsocial.com/license.doc

This notice may not be removed from the source code. */

$g['template_options'] = array(
    'name' => 'new_age',
    'logo_w' => 259,
    'logo_h' => 47,
    'hide_site_sections' => array(
        'blog1',
        'blog2',
        'main_page_header_mode',
    ),
    'block_list_hide_wall' => 'Y',
    'menu_admin_banner' => 'Y',
    'banners_places' => array ('home' => 1,
                               'top' => 1,
                               'header' => 1,
                               'right_column' => 1,
                               'footer' => 1,
                               'footer_additional' => 1,
                               'left_column' => 0),
    'new_videos_on_main_pag' => 'N',
    'featured_users_on_main_page' => 'Y',
    'main_col_order' => 'N',
    'right_col_order' => 'N',
);

global $swf;

$swf['profile']['attributes']['width'] = '517';
$swf['profile']['attributes']['height'] = '864';
$swf['profile']['attributes']['bgcolor'] = '7EA7B7';
$swf['profile']['flashvars']['colorbgeditor'] = '0x7EA7B7';
$swf['profile']['flashvars']['colorbgabout'] = '0x8DB7C7';
$swf['profile']['flashvars']['colorbgfontabout'] = '0x7EA7B7';
$swf['profile']['flashvars']['colorheaderabout'] = '0xD9F4FC';
$swf['profile']['flashvars']['colorfontabout'] = '0xD9F4FC';
$swf['profile']['flashvars']['colorbgmenu1'] = '0xC1D6DD';
$swf['profile']['flashvars']['colorbgmenu2'] = '0x5F93A7';
$swf['profile']['flashvars']['colorcontourmenu'] = '0x333333';
$swf['profile']['flashvars']['editborder'] = '0x8DB7C7';
$swf['profile']['flashvars']['bgtabmenu'] = '0x7EA7B7';
$swf['profile']['flashvars']['tabmenubtn'] = '0x5F93A7';
$swf['profile']['flashvars']['bgcanvas'] = '0x719AAA';
$swf['profile']['flashvars']['colorcontourmenu'] = '0x666666';
$swf['profile']['flashvars']['colormskforbg'] = '0x7EA7B7';
$swf['profile']['flashvars']['bgColorPreloader'] = '0x7EA7B7';

$swf['flashchat']['attributes']['width'] = '750';
$swf['flashchat']['attributes']['height'] = '500';
$swf['flashchat']['attributes']['bgcolor'] = '8F9608';
$swf['flashchat']['flashvars']['btnRoomsColor'] = '0x00AACE';
$swf['flashchat']['flashvars']['usersColor'] = '0x00AACE';
$swf['flashchat']['flashvars']['bgColor'] = '0x8F9608';

$swf['games']['attributes']['bgcolor'] = '7EA7B7';
$swf['games']['flashvars']['bgColor'] = '0x7EA7B7';

$swf['postcard_inbox']['attributes']['width'] = '690';