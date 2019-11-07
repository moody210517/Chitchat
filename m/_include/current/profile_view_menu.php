<?php
/* (C) Websplosion LTD., 2001-2014

IMPORTANT: This is a commercial software product
and any kind of using it must agree to the Websplosion's license agreement.
It can be found at http://www.chameleonsocial.com/license.doc

This notice may not be removed from the source code. */

class CProfileViewMenu extends CHtmlBlock
{
	var $user_id = 0;

	function parseBlock(&$html)
	{
		global $g;
		global $g_user;
		global $g_info;
		global $area;
		global $p;

		$this->user_id = $this->user_id ? $this->user_id : $g_user['user_id'];
		$html->setvar('user_id', $this->user_id);
		if ($g_user['user_id'] != $this->user_id)
		{
			if (Common::isOptionActive('mail')) {
                $html->parse('user_email', false);
            }
            if(Common::isOptionActive('contact_blocking')) {
                if(User::isBlocked('mail', guid(), $this->user_id))
                    $html->parse('user_blocked', false);
                else
                    $html->parse('user_not_blocked', false);
            }
            /*if ($html->varExists('back_offset')) {
                $html->setvar('back_offset', get_param('back_offset', 0));//??? not used
            }*/
            $blockNotMyMenu = 'not_my_menu';
            if ($html->blockExists($blockNotMyMenu)) {
                if ($html->varExists('from_page')) {
                    $html->setvar('from_page', get_param('from'));
                }
                $isBlockedUser = User::isEntryBlocked($g_user['user_id'], $this->user_id);
                if ($isBlockedUser) {
                    $html->setvar('menu_hide', 'hide');
                }

                /*$sql = 'SELECT `id`
                          FROM `encounters`
                         WHERE (`user_to` = ' . to_sql($g_user['user_id'], 'Number') . ' AND `user_from` = ' . to_sql($this->user_id, 'Number') . " AND `to_reply` != 'P')" .
                          ' OR (`user_from` = ' . to_sql($g_user['user_id'], 'Number') . ' AND `user_to` = ' . to_sql($this->user_id, 'Number') . " AND `from_reply` != 'P')";
                if (DB::result($sql)) {
                    $html->parse('meet_active', false);
                }*/
                $colMenu = 4;
                $isLikeToMeet = Encounters::parseLikeToMeet($html, $this->user_id, null, 'not_my_menu_like_to_meet');
                if (!$isLikeToMeet) {
                    $colMenu--;
                }
                $isGift = Common::isOptionActive('gifts_enabled');
                if ($isGift) {
                    $html->parse("{$blockNotMyMenu}_gift", false);
                } else {
                    $colMenu--;
                }
                $html->setvar('class_col_menu', $colMenu);
                $html->parse($blockNotMyMenu, false);
            }
        } else {
            $colMenu = 5;
            $blockMyMenu = 'my_menu';
            if ($html->blockExists($blockMyMenu)) {
                if (!Common::isOptionActive('free_site') && Common::isInAppPurchaseEnabled()) {
                    if (Common::isOptionActive('credits_enabled')) {
                        $html->parse("{$blockMyMenu}_credits", false);
                    } else {
                        $colMenu--;
                    }
                    if (Common::isAvailableFeaturesSuperPowersMobile()) {
                        $html->setvar('superpowers_active_title', User::isSuperPowers() ? l('on') : l('off'));
                        $html->parse("{$blockMyMenu}_upgrade", false);
                    } else {
                        $colMenu--;
                    }
                } else {
                    $colMenu -= 2;
                }
                $html->setvar('class_col_menu', $colMenu);
                $html->parse($blockMyMenu, false);
            }
        }

        if(guid() && !User::isFriend($this->user_id, guid())) {
            $html->parse('add_as_friend');
        }

        $html->setvar('display_profile', User::displayProfile());
        $html->setvar('display_wall', User::displayWall());

        $user = User::freeAccessApply(User::getInfoBasic($this->user_id));
        User::parseImLink($html, $user['user_id'], $user['type'], $user['gold_days'], 'im_module');

        if(Wall::isActive()) {
            $html->parse('wall', false);
        }

		parent::parseBlock($html);
	}
}
