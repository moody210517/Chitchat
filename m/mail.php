<?php
/* (C) Websplosion LTD., 2001-2014

IMPORTANT: This is a commercial software product
and any kind of using it must agree to the Websplosion's license agreement.
It can be found at http://www.chameleonsocial.com/license.doc

This notice may not be removed from the source code. */

$area = "login";
include("./_include/core/pony_start.php");
if(!Common::isOptionActive('mail')) {
    redirect(Common::toHomePage());
}
payment_check('mail_read');

//payment_check('mail_read');
$g['to_head'][] = '<link rel="stylesheet" href="'.$g['tmpl']['url_tmpl_mobile'].'css/mail.css" type="text/css" media="all"/>';

$view = get_param('view', '');
if($view == 'new') {
    $sql = 'SELECT * FROM mail_msg
        WHERE new = "Y"
            AND type != "postcard"
            AND user_id = ' . to_sql(guid(), 'Number') . '
        ORDER BY id ASC
        LIMIT 1';
    $mail = DB::row($sql);
    if($mail) {
        $sql = 'UPDATE mail_msg SET new = "N"
            WHERE id = ' . to_sql($mail['id'], 'Number');
        DB::execute($sql);
        redirect($p . '?display=text&mid=' . $mail['id'] . '&folder=' . $mail['folder']);
    }
}

$folder = get_param("folder", "1");
if($folder == 1)
{
	$l['all']['title'] = $g['main']['title'] . ' - My Mail [Inbox]';
	$l['all']['header_title'] = 'Inbox';
}
else if($folder == 2)
{
	$l['all']['title'] = $g['main']['title'] . ' - My Mail [Trash]';
	$l['all']['header_title'] = 'Trash';
}
else if($folder == 3)
{
	$l['all']['title'] = $g['main']['title'] . ' - My Mail [Sent]';
	$l['all']['header_title'] = 'Sent';
}

$page = new CHtmlBlock("", $g['tmpl']['dir_tmpl_mobile'] . "mail.html");

$type = get_param("display", "list");
if ($type == "list") {
    $list = new CHtmlMailList("users_list", $g['tmpl']['dir_tmpl_mobile'] . "_mail_list.html");
    $list->m_on_page = 6;
}
elseif ($type == "text"){
    $list = new CHtmlMailText("users_list", $g['tmpl']['dir_tmpl_mobile'] . "_mail_text.html");
}
else redirect("mail.php");


$list->m_folder = (int) get_param("folder", 1);
if (DB::result("SELECT id FROM mail_folder WHERE id=" . $list->m_folder . "") == 0) $list->m_folder = 1;

$whereMid = '';
$mid = get_param('mid', '');
if($mid) {
    $whereMid = ' AND m.id = ' . to_sql($mid, 'Number');
}

$list->m_sql_where = " m.type != 'postcard' AND m.user_id=" . $g_user['user_id'] . " AND m.folder=" . $list->m_folder . $whereMid;
$list->m_sql_order = "m.id DESC";
$list->m_sql_from_add = "";
$page->add($list);

$header = new CHeader("header", $g['tmpl']['dir_tmpl_mobile'] . "_header.html");
$page->add($header);
$footer = new CFooter("footer", $g['tmpl']['dir_tmpl_mobile'] . "_footer.html");
$page->add($footer);

$folders = new CFolders("folders", $g['tmpl']['dir_tmpl_mobile'] . "_folders.html");
$page->add($folders);

$user_menu = new CUserMenu("user_menu", $g['tmpl']['dir_tmpl_mobile'] . "_user_menu.html");
$user_menu->active = 'mail';
$page->add($user_menu);

include("./_include/core/main_close.php");
