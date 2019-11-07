<?php
/* (C) Websplosion LTD., 2001-2014

IMPORTANT: This is a commercial software product
and any kind of using it must agree to the Websplosion's license agreement.
It can be found at http://www.chameleonsocial.com/license.doc

This notice may not be removed from the source code. */

$area = "login";
include("./_include/core/pony_start.php");

$g['to_head'][] = '<link rel="stylesheet" href="'.$g['tmpl']['url_tmpl_mobile'].'css/main.css" type="text/css" media="all"/>';
$g['options']['no_user_menu'] = 'Y';

class CRegisterEmailConfirmation extends CHtmlBlock
{
	function action()
	{
	}
	function parseBlock(&$html)
	{
		parent::parseBlock($html);
	}
}

$page = new CRegisterEmailConfirmation("", $g['tmpl']['dir_tmpl_mobile'] . "register_email_confirmation.html");
$header = new CHeader("header", $g['tmpl']['dir_tmpl_mobile'] . "_header.html");
$page->add($header);
$footer = new CFooter("footer", $g['tmpl']['dir_tmpl_mobile'] . "_footer.html");
$page->add($footer);

include("./_include/core/main_close.php");

?>
