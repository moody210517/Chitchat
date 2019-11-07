<?php
/* (C) Websplosion LTD., 2001-2014

IMPORTANT: This is a commercial software product
and any kind of using it must agree to the Websplosion's license agreement.
It can be found at http://www.chameleonsocial.com/license.doc

This notice may not be removed from the source code. */

$area = 'login';
include('./_include/core/pony_start.php');

if (!City::isActiveGames()) {
    Common::toHomePage();
}
User::accessCheckFeatureSuperPowersToRedirect('3d_city', null, null, '');

class CСhoiceGames extends CHtmlBlock
{
	function action()
	{

	}

	function parseBlock(&$html)
	{
        global $g;
		global $g_user;

        $optionTmplName = Common::getOption('set', 'template_options') ;
        $parseTemplateMethod = 'parseGames' . $optionTmplName;
        if (method_exists('Games', $parseTemplateMethod)) {
            Games::$parseTemplateMethod($html);
        }

		parent::parseBlock($html);
	}
}

$dirTmpl = $g['tmpl']['dir_tmpl_mobile'];

$page = new CСhoiceGames('', "{$dirTmpl}games.html");
$header = new CHeader('header', "{$dirTmpl}_header.html");
$page->add($header);
$footer = new CFooter('footer', "{$dirTmpl}_footer.html");
$page->add($footer);

if (Common::isParseModule('user_menu')) {
    $user_menu = new CUserMenu("user_menu", $g['tmpl']['dir_tmpl_mobile'] . "_user_menu.html");
    $header->add($user_menu);
}

loadPageContentAjax($page);

include('./_include/core/main_close.php');