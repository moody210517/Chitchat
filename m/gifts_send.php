<?php
/* (C) Websplosion LTD., 2001-2014

IMPORTANT: This is a commercial software product
and any kind of using it must agree to the Websplosion's license agreement.
It can be found at http://www.chameleonsocial.com/license.doc

This notice may not be removed from the source code. */

$area = "login";
include("./_include/core/pony_start.php");

class CGifts extends CHtmlBlock {

    function action() {
        $cmd = get_param('cmd');
        if ($cmd == 'gift_send') {
            $responseData = ProfileGift::send();
            die(getResponseDataAjaxByAuth($responseData));
        }

    }

    function parseBlock(&$html) {
        global $g;
        global $g_user;
        $cmd = get_param('cmd');
        $uid = get_param('user_id');

        $html->setvar('user_id', $uid);
        if ($uid) {
            ProfileGift::parseGiftBox($html);
        }

        $block = 'response_refill_credits';
        if ($html->blockExists($block) && get_session($block)) {
            delses($block);
            $html->parse($block, false);
        }
        if(Common::isTransferCreditsEnabled()){
            $html->setVar('is_gift_credits_class', 'two_fields');
        } else {
            $html->setVar('is_gift_credits_class', '');
        }
        parent::parseBlock($html);
    }
}

$page = new CGifts("", $g['tmpl']['dir_tmpl_mobile'] . "gifts_send.html");
$header = new CHeader("header", $g['tmpl']['dir_tmpl_mobile'] . "_header.html");
$page->add($header);

$user_menu = new CUserMenu("user_menu", $g['tmpl']['dir_tmpl_mobile'] . "_user_menu.html");
$header->add($user_menu);

$footer = new CFooter("footer", $g['tmpl']['dir_tmpl_mobile'] . "_footer.html");
$page->add($footer);

include("./_include/core/main_close.php");