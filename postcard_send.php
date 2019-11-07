<?php
/* (C) Websplosion LTD., 2001-2014

IMPORTANT: This is a commercial software product
and any kind of using it must agree to the Websplosion's license agreement.
It can be found at http://www.chameleonsocial.com/license.doc

This notice may not be removed from the source code. */

$area = "login";
include("./_include/core/main_start.php");

payment_check('mail_compose');

class CPage extends CHtmlBlock
{
	function parseBlock(&$html)
	{
		global $g;
		global $g_user;
		parent::parseBlock($html);
	}
}
$page = new CPage("", $g['tmpl']['dir_tmpl_main'] . "postcard_send.html");
$header = new CHeader("header", $g['tmpl']['dir_tmpl_main'] . "_header.html");
$page->add($header);
$footer = new CFooter("footer", $g['tmpl']['dir_tmpl_main'] . "_footer.html");
$page->add($footer);




include("./_include/core/main_close.php");

?>