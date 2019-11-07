<?php
/* (C) Websplosion LTD., 2001-2014

IMPORTANT: This is a commercial software product
and any kind of using it must agree to the Websplosion's license agreement.
It can be found at http://www.chameleonsocial.com/license.doc

This notice may not be removed from the source code. */

class CUserMenu extends CHtmlBlock
{
	var $message_template = "";
	var $active = '';
    static private $type = '';

    static function setType($type)
	{
        self::$type = $type;
    }

	function setActive($active)
	{
		$this->active = $active;
	}

    static function parseRow(&$html, $rowLine, $block = 'start', $blockUserMenu = 'user_menu')
	{
        $html->parse("{$blockUserMenu}_row_{$block}_{$rowLine}", true);
        $html->parse("{$blockUserMenu}_row", true);
        $html->clean("{$blockUserMenu}_row_{$block}_{$rowLine}");
    }

    static function parseRowItem(&$html, &$i, &$z, &$rowsItems, &$rowItems, &$rowLine, &$isParseStart, &$isParseEnd, &$prevIcon, $blockUserMenu = 'user_menu')
	{
         if (++$i == 10) {
            self::parseRow($html, $rowLine, 'end');
            if ($z == 1) {
                $html->parse("{$blockUserMenu}_part_show", false);
            } else {
                $html->clean("{$blockUserMenu}_part_show");
            }
            $z++;
            $html->parse("{$blockUserMenu}_part", true);
            $html->clean("{$blockUserMenu}_row");
            $rowsItems = array();
            $rowItems = 0;
            $rowLine = 0;
            $isParseStart = true;
            $isParseEnd = false;
            $i = 0;
            // echo "{$blockUserMenu}_row_end_{$rowLine}" . '<br>';
        }
        if (!$rowsItems) {
            $rowsItems = array(3,3,2,1);
        }
        if ($isParseStart && !$rowItems) {
            self::parseRow($html, $rowLine + 1);
            //echo "{$blockUserMenu}_row_start_" . ($rowLine+1) . '<br>';
            $isParseStart = false;
        }
        if (!$rowItems) {
            $rowItems = array_shift($rowsItems);
            if ($isParseEnd) {
                self::parseRow($html, $rowLine, 'end');
                //echo "{$blockUserMenu}_row_end_{$rowLine}" . '<br>';
                self::parseRow($html, $rowLine + 1);
            }
            $rowLine++;
            $isParseEnd = true;
        }
        //echo $rowItems . '/row-' . $rowLine . '<br>';
        $rowItems--;
        $html->setvar("{$blockUserMenu}_line", $rowLine);
        $html->setvar("{$blockUserMenu}_line_item", $rowItems);
        return $i;
    }

    static function parseMenu(&$html)
	{
        global $g_user;

        $blockUserMenu = 'user_menu';
        if ($html->blockExists($blockUserMenu)) {
            $where = '';
            $prf = '';
            $table = 'mobile_user_menu';
            $typeMenu = Common::getOption('user_menu_type', 'template_options');
            if ($typeMenu) {
                $table .= '_' . $typeMenu;
                $prf .= '_' . $typeMenu;
            }
            if (!Common::isOptionActive('photo_rating_enabled')) {
                $where = " AND `name` != 'photo_rating'";
            }
            $limit = '';
            if (self::$type == 'profile_view') {
                $where .= " AND `additional` = 1";
                $limit = ' LIMIT 9';
            }
            $sql = "SELECT *
                      FROM `col_order`
                     WHERE `section` = '{$table}'
                       AND `status` = 'Y'
                       {$where}
                     ORDER BY `position`" . $limit;
            DB::query($sql, 1);
            $isParseUserMenu = false;

            $pageUrl = array('people_nearby' => 'search_results.php',
                             'encounters' => 'search_results.php?display=encounters',
                             'photo_rating' => 'search_results.php?display=rate_people',
                             'messages' => 'messages.php',
                             'matches' => 'mutual_attractions.php',
                             'who_likes_you' => 'mutual_attractions.php?display=want_to_meet_you',
                             'profile_visitors' => 'users_viewed_me.php'
						);
            if (Common::isOptionActive('friends_enabled')) {
				$pageUrl['friends'] = 'my_friends.php';
			}
            $urlPageUpgrade = Common::pageUrl('upgrade');
            if ($typeMenu == 'impact') {
                $pageUrl = array(
                    'profile_view' => Common::pageUrl('profile_view'),
                    'search_results' => Common::pageUrl('search_results'),
                    'profile_visitors' => Common::pageUrl('users_viewed_me'),
                    'settings' => Common::pageUrl('profile_settings'),
                    'messages' => Common::pageUrl('messages'),
                    'hot_or_not' => Common::pageUrl('hot_or_not'),
                    'logout' => Common::pageUrl('index') . '?cmd=logout',
                    'who_likes_you' => Common::pageUrl('who_likes_you'),
                    'whom_you_like' => Common::pageUrl('whom_you_like'),
                    'mutual_likes' => Common::pageUrl('mutual_likes'),
                    'can_see_your_private_photos' => Common::pageUrl('private_photo_access')
				);
            }

            $listCounters = array('street_chat' => 0, 'game_choose' => 0, '3d_city' => 0);

            if (Common::isModuleCityActive()) {

                $numbersCity = City::getNumberUsersVisitors();

                $pageUrl['3d_city'] = City::url('city', false, false);
                if (City::isActiveStreetChat()) {
                    $pageUrl['street_chat'] = City::url('street_chat', false, false);
                    $numbersCity['all_number'] -= $numbersCity[12];
                    $listCounters['street_chat'] = $numbersCity[12];
                }
                if (City::isActiveGames()) {
                    $pageUrl['game_choose'] = Common::pageUrl('games');
                    $cityNumberUsersGames = City::getNumberUsersGames($numbersCity);
                    $numbersCity['all_number'] -= $cityNumberUsersGames;
                    $listCounters['game_choose'] = $cityNumberUsersGames;
                }

                $listCounters['3d_city'] = $numbersCity['all_number'];
            }

            if ($typeMenu == 'impact') {
                if (!Common::isOptionActive('free_site')) {
                    if (!User::isSuperPowers()) {
                        $pageUrl['upgrade'] = $urlPageUpgrade;
                    }
                    if (Common::isOptionActive('credits_enabled')) {
                        $pageUrl['boost'] = Common::pageUrl('profile_boost');
                    }
                }
            }

            $blockUserMenuItem = "{$blockUserMenu}_item";
            $blockUserMenuCounter = "{$blockUserMenuItem}_counter";
            $blockNoLoadAjax = "{$blockUserMenuItem}_no_load_ajax";
            $i = 0;
            $rowsItems = array();
            $rowItems = 0;
            $rowLine = 0;
            $isParseStart = true;
            $isParseEnd = false;
            $prevIcon = 'icon_empty';
            $z = 1;
            $j = 0;
            $numberItems = DB::num_rows(1);
            while ($row = DB::fetch_row(1)) {
                if(!isset($pageUrl[$row['name']])){
                    continue;
                }
                if (self::$type == 'profile_view') {
                    $num = self::parseRowItem($html, $i, $z, $rowsItems, $rowItems, $rowLine, $isParseStart, $isParseEnd, $prevIcon);
                }

                $j++;

                $html->setvar("{$blockUserMenu}_name", $row['name']);
                $html->setvar("{$blockUserMenu}_title", l('user_menu_' . $row['name'] . $prf));
                $html->setvar("{$blockUserMenu}_url", $pageUrl[$row['name']]);

                /* Impact */
                $prevIcon = "icon_{$row['name']}";
                if ($html->blockExists($prevIcon)) {
                    $html->parse($prevIcon, false);
                }
                if (self::$type == 'profile_view') {
                    $html->parse("{$blockUserMenuItem}_go_to_page", false);
                }
                if (self::$type == 'user_menu') {
                    if ($html->varExists("{$blockUserMenuItem}_num")) {
                        $html->setvar("{$blockUserMenuItem}_num", $j);
                    }
                }
                /* Impact */

                if (!in_array($row['name'], array('encounters', 'people_nearby', 'photo_rating'))) {
                    $counter = 0;
                    if ($row['name'] == 'messages') {
                        $counter = CIm::getCountNewMessages(null, get_param('user_id'));
                    } elseif ($row['name'] == 'matches' || $row['name'] == 'mutual_likes') {
                        $counter = MutualAttractions::getNumberMutualAttractions('mutual');
                    } elseif ($row['name'] == 'who_likes_you') {
                        if ($typeMenu == 'impact') {
                            $counter = MutualAttractions::getNumberMutualAttractions('WhoLikesYou');
                        } else {
                            $counter = MutualAttractions::getNumberMutualAttractions('wanted');
                        }
                    } elseif ($row['name'] == 'whom_you_like') {
                        $counter = MutualAttractions::getNumberMutualAttractions('WhomYouLike');
                    } elseif ($row['name'] == 'profile_visitors') {
                        $counter = DB::count('users_view', "`user_to` = " . to_sql($g_user['user_id']));
                    } elseif ($row['name'] == 'friends') {
                        $counter = User::getNumberFriendsAndPending();
                    } elseif ($row['name'] == 'can_see_your_private_photos') {
                        $counter = User::getNumberFriends();
                    } elseif ($row['name'] == '3d_city') {
                        $counter = $listCounters['3d_city'];
                    } elseif ($row['name'] == 'street_chat') {
                        $counter = $listCounters['street_chat'];
                    } elseif ($row['name'] == 'game_choose') {
                        $counter = $listCounters['game_choose'];
                    }
                    if (!$counter) {
                        $counter = '';
                    }
                    $html->setvar($blockUserMenuCounter, $counter);
                    if ($html->blockExists("{$blockUserMenuCounter}_show")) {
                        if ($counter) {
                            $html->parse("{$blockUserMenuCounter}_show", false);
                        } else {
                            $html->clean("{$blockUserMenuCounter}_show");
                        }
                    }
                    $html->parse($blockUserMenuCounter, false);
                }

                if (in_array($row['name'], array('3d_city', 'street_chat')) && $html->blockExists($blockNoLoadAjax)) {
                    $html->parse($blockNoLoadAjax, false);
                }
                $html->parse($blockUserMenuItem, true);
                $html->clean($blockUserMenuCounter);
                $html->clean($blockNoLoadAjax);

                if (self::$type == 'user_menu') {
                    $html->clean($prevIcon);
                    if ($j%4 == 0) {
                        $html->parse("{$blockUserMenu}_items", true);
                        $html->clean($blockUserMenuItem);
                    }
                } elseif (self::$type == 'profile_view') {
                    $html->parse("{$blockUserMenu}_row", true);
                    $html->clean($prevIcon);
                    $html->clean($blockUserMenuItem);
                }

                $isParseUserMenu = true;
            }
            if (self::$type == 'profile_view' && $i < 10) {
                $html->setvar("{$blockUserMenu}_url", '');
                $html->clean("{$blockUserMenuItem}_go_to_page");
                $html->clean($prevIcon);
                $html->clean($blockUserMenuItem);
                $prevIcon = 'icon_empty';
                for ($x = $i; $x++ < 10;){
                    $num = self::parseRowItem($html, $i, $z, $rowsItems, $rowItems, $rowLine, $isParseStart, $isParseEnd, $prevIcon);
                    //if ($x < 9) {
                        $html->setvar("{$blockUserMenu}_name", 'empty');
                        $html->parse($blockUserMenuItem, true);
                        $html->parse("{$blockUserMenu}_row", true);
                        $html->clean($blockUserMenuItem);
                    //}
                }
                $isParseUserMenu = true;
            }
            if ($isParseUserMenu) {
                if (self::$type == 'user_menu' && $j%4 != 0) {
                    $html->parse("{$blockUserMenu}_items", true);
                }
                $html->parse($blockUserMenu);
            }
        }
    }
    static function checkItemShow($name, $section = 'mobile_user_menu')
	{
        $sql = "SELECT *
                  FROM `col_order`
                 WHERE `section` = " . to_sql($section) . "
                   AND `status` = 'Y'
                   AND `name` = " . to_sql($name);
        return DB::result($sql);
    }

	function parseBlock(&$html)
	{
		global $g;
		global $g_user;
		global $g_info;
		global $area;
		global $p;

		$html->setvar('user_id', $g_user['user_id']);

		if ($g_info['new_mails']){
			$html->setvar('n_new_mails', $g_info['new_mails']);
			$html->parse('new_mail');
		}
        if (Common::isOptionActive('mail')) {
            $html->parse('mail_on');
        }
		if ($this->active)
			$html->parse('active_'.$this->active, true);

        if (Common::isOptionActive('online_tab_enabled')) {
            $html->parse('online_tab_enabled', false);
        }
        if (Wall::isActive()) {
            $html->parse('menu_wall');
            $html->parse('wall_addon_menu');
        }

        if ($html->varExists('user_name')) {
            $html->setvar('user_name', $g_user['name']);
        }

        if ($html->varExists('photo_my_s')) {
            $html->setvar('photo_my_s', User::getPhotoDefault($g_user['user_id']));
        }

        if ($html->varExists('new_messages')) {
            $counter = CIm::getCountNewMessages(null, get_param('user_id'));
            if ($counter) {
                $html->setvar('new_messages', $counter);
            }
        }
        if ($html->varExists('number_matches')) {
            $counter = MutualAttractions::getNumberMutualAttractions('mutual');
            if ($counter) {
                $html->setvar('number_matches', $counter);
            }
        }
        if ($html->varExists('number_who_likes_you')) {
            $counter = MutualAttractions::getNumberMutualAttractions('wanted');
            if ($counter) {
                $html->setvar('number_who_likes_you', $counter);
            }
        }
        if ($html->varExists('number_profile_visitors')) {
            $counter = DB::count('users_view', "`user_to` = " . to_sql($g_user['user_id']));
            if ($counter) {
                $html->setvar('number_profile_visitors', $counter);
            }
        }

        self::parseMenu($html);

		parent::parseBlock($html);
	}
}
