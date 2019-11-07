<?php
/* (C) Websplosion LTD., 2001-2014

IMPORTANT: This is a commercial software product
and any kind of using it must agree to the Websplosion's license agreement.
It can be found at http://www.chameleonsocial.com/license.doc

This notice may not be removed from the source code. */

$area = "login";
include("./_include/core/pony_start.php");

global $g_user;

$countFields = 0;
foreach ($g['user_var'] as $k => $v) {
    if (($v['type'] == 'text' || $v['type'] == 'textarea')
            && $v['status'] == 'active') {
                $countFields++;
    }
}
if ($countFields == 0) {

    redirect('profile_info.php');
}

$g['to_head'][] = '<link rel="stylesheet" href="'.$g['tmpl']['url_tmpl_mobile'].'css/profile.css" type="text/css" media="all"/>';

class CProfileMain  extends UserFields
{
	function action()
	{
            $cmd = get_param('cmd', '');
            $this->message = '';
            if ($cmd == 'update') {
                $this->verification('pr_check');
                if ($this->message == '') {
                    $this->updateTextsApproval();
                    redirect();
                }
            }
	}
	function parseBlock(&$html)
	{
		if ($this->message) {
			$html->setvar("error_message", $this->message);
			$html->parse("error", true);
		}

        //$this->setValueTexts();
                $this->formatValue = 'entities';
                $this->parseFieldsAll($html, 'profile');
		parent::parseBlock($html);
	}
}

g_user_full();

$page = new CProfileMain("", $g['tmpl']['dir_tmpl_mobile'] . "profile.html");
$header = new CHeader("header", $g['tmpl']['dir_tmpl_mobile'] . "_header.html");
$page->add($header);
$footer = new CFooter("footer", $g['tmpl']['dir_tmpl_mobile'] . "_footer.html");
$page->add($footer);

include("./_include/current/profile_menu.php");
$profile_menu = new CProfileMenu("profile_menu", $g['tmpl']['dir_tmpl_mobile'] . "_profile_menu.html");
$profile_menu->setActive('main');
$page->add($profile_menu);

$user_menu = new CUserMenu("user_menu", $g['tmpl']['dir_tmpl_mobile'] . "_user_menu.html");
$user_menu->setActive('profile');
$page->add($user_menu);

include("./_include/core/main_close.php");

?>