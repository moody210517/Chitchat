<?php
/* (C) Websplosion LTD., 2001-2014

IMPORTANT: This is a commercial software product
and any kind of using it must agree to the Websplosion's license agreement.
It can be found at http://www.chameleonsocial.com/license.doc

This notice may not be removed from the source code. */

include("./_include/core/main_start.php");

payment_check('gallery_view');
if (isset($g['options']['gallery']) and $g['options']['gallery'] == "N") Common::toHomePage();

$uid = intval(get_param('user_id', '0'));
if($uid == 0) {
	redirect('gallery_index.php');
}

$page = new CGalleryAlbums("gallery_albums_all", $g['tmpl']['dir_tmpl_main'] . "gallery_albums_all.html");

$header = new CHeader("header", $g['tmpl']['dir_tmpl_main'] . "_header.html");
$page->add($header);
$footer = new CFooter("footer", $g['tmpl']['dir_tmpl_main'] . "_footer.html");
$page->add($footer);

$where = ' a.user_id = ' . to_sql($uid, 'Number') . '
    AND a.access = "public" ';

if(guid()) {
    $where = ' a.user_id = ' . to_sql($uid, 'Number') . '
        AND (a.access = "public"
            OR a.user_id = '. to_sql(guid(), 'Number') . '
            OR (a.access = "friends" AND (f1.friend_id IS NOT NULL OR f2.friend_id IS NOT NULL OR 
                                f3.friend_id IS NOT NULL OR f4.friend_id IS NOT NULL))
        ) ';
}

$page->m_sql_where = $where;

$sort_order = get_param('sort', 'date');

if($sort_order == 'views') {
	$page->m_sql_order = 'a.views DESC';
} elseif($sort_order == 'title') {
	$page->m_sql_order = 'a.title ASC';
} else {
	$page->m_sql_order = 'a.date DESC';
}

$page->userAlbums = true;

include("./_include/core/main_close.php");

?>