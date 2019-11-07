<?php
/* (C) Websplosion LTD., 2001-2014

IMPORTANT: This is a commercial software product
and any kind of using it must agree to the Websplosion's license agreement.
It can be found at http://www.chameleonsocial.com/license.doc

This notice may not be removed from the source code. */

$area = 'login';
include('./_include/core/pony_start.php');

class CProfileInterests extends UserFields
{

	function action()
	{
        global $g;
        global $g_user;

        $cmd = get_param('cmd');
        $isResponseAjax = get_param('ajax');
        if ($isResponseAjax) {

        }

	}
	function parseBlock(&$html)
	{
		global $g;
		global $g_user;

        UserFields::parseFieldsStyle($html, array('interests'));

        parent::parseBlock($html);
	}
}



$isResponseAjax = get_param('ajax');
if ($isResponseAjax) {
    $cmd = get_param('cmd');
    if (in_array($cmd, array('more_interests', 'add_new_interest', 'search_interests'))) {
        $responsePage = false;
        if ($g_user['user_id']) {
            $responsePage = new Interests('', $g['tmpl']['dir_tmpl_mobile'] .  '_interests_item.html');
        }
    } elseif ($cmd == 'delete_interest') {
        $responseData = Interests::deleteInterest();
    }
    if (isset($responsePage)) {
        die(getResponsePageAjaxAuth($responsePage));
    }
    if (isset($responseData)) {
        die(getResponseDataAjaxByAuth($responseData));
    }
}

$page = new CProfileInterests('', $g['tmpl']['dir_tmpl_mobile'] . 'profile_interests_edit.html', false, false, false, 'profile_html_urban_mobile', guid());

$header = new CHeader('header', $g['tmpl']['dir_tmpl_mobile'] . '_header.html');
$page->add($header);

$user_menu = new CUserMenu("user_menu", $g['tmpl']['dir_tmpl_mobile'] . "_user_menu.html");
$header->add($user_menu);

$footer = new CFooter('footer', $g['tmpl']['dir_tmpl_mobile'] . '_footer.html');
$page->add($footer);

include("./_include/core/main_close.php");