<?php
/* (C) Websplosion LTD., 2001-2014

IMPORTANT: This is a commercial software product
and any kind of using it must agree to the Websplosion's license agreement.
It can be found at http://www.chameleonsocial.com/license.doc

This notice may not be removed from the source code. */

$area = "login";
include("./_include/core/main_start.php");

class CProfile extends CHtmlBlock
{
    static $numberUsersNew = 0;

	function action()
	{
		global $g;
		global $g_user;
		$cmd = get_param('cmd', '');

        if ($cmd == 'hide') {
            $sql = "UPDATE `user`
                       SET `hide_time` = " . to_sql(Common::getOption('hide_time'),'Number')
                 . " WHERE `user_id` = " . to_sql(get_session('user_id'), 'Number');
			DB::execute($sql);
		}elseif ($cmd == 'active') {
            $sql = "UPDATE `user`
                       SET `hide_time` = 0
                     WHERE `user_id` = " . to_sql(get_session('user_id'), 'Number');
			DB::execute($sql);
		}
	}

	function parseBlock(&$html)
	{
		global $g;
		global $l;
		global $g_user;
		global $g_info;
		global $gc;
        $html->setvar("user_id", $g_user['user_id']);

        if (Common::isOptionActive('recorder')) {
			$html->setvar('unique', str_replace('.', '_', domain()));
			$html->setvar("myname", $g_user['name']);
			$html->parse("myrecorder", true);
			$html->parse("myrecorder_swf", true);
		}

        if (Common::isOptionActive('biorythm')) {
			$html->parse("biorythm", false);
		}

		foreach ($g_user as $k => $v) $html->setvar($k, $v);
		if ($g['options']['your_orientation'] == 'Y') {
			$html->setvar("p_orientation_for_search", $g_user['p_orientation']);
            $g_info['users_new'] = DB::result_cache("users_new_" . to_php_alfabet($g_user['p_orientation']), 30, "SELECT COUNT(user_id) FROM user WHERE hide_time = 0 " . $g['sql']['your_orientation'] .  " AND register>'" . date('Y-m-d H:i:s', (time() - 60 * 60 * 24 * $g['options']['new_time'])) . "'"); # AND register>(" . (time() - 60 * 60 * 24 * 10) . "
            $g_info['users_new_near'] = DB::result_cache("users_new_near_" . to_php_alfabet($g_user['p_orientation'] . "_" . $g_user['city_id']), 30, "SELECT COUNT(user_id) FROM user WHERE hide_time = 0 " . $g['sql']['your_orientation'] .  " AND register>'" . date('Y-m-d H:i:s', (time() - 60 * 60 * 24 * $g['options']['new_time'])) . "' AND city_id=" . $g_user['city_id'] . "");
		} else {
			$g_info['users_new'] = DB::result_cache("users_new", 30, "SELECT COUNT(user_id) FROM user WHERE hide_time = 0 AND register>'" . date('Y-m-d H:i:s', (time() - 60 * 60 * 24 * $g['options']['new_time'])) . "'"); # AND register>(" . (time() - 60 * 60 * 24 * 10) . "
			$g_info['users_new_near'] = DB::result_cache("users_new_near" . to_php_alfabet($g_user['city_id']), 30, "SELECT COUNT(user_id) FROM user WHERE hide_time = 0 AND city_id=" . $g_user['city_id'] . " AND register>'".date('Y-m-d H:i:s', (time() - 60 * 60 * 24 * $g['options']['new_time']))."'");
		}
		foreach ($g_info as $k => $v) $html->setvar($k, $v);

		$photo = User::getPhotoDefault($g_user['user_id'],"m");

		$html->setvar("photo", $photo);

		$city_title = (($g_user['city'] == "" or $g_user['city'] == "0") ? l('blank') : (isset($l['all'][to_php_alfabet($g_user['city'])]) ? $l['all'][to_php_alfabet($g_user['city'])] : $g_user['city']));
		$state_title = (($g_user['state'] == "" or $g_user['state'] == "0") ? l('blank') : (isset($l['all'][to_php_alfabet($g_user['state'])]) ? $l['all'][to_php_alfabet($g_user['state'])] : $g_user['state']));
		$country_title = (($g_user['country'] == "" or $g_user['country'] == "0") ? l('blank') : (isset($l['all'][to_php_alfabet($g_user['country'])]) ? $l['all'][to_php_alfabet($g_user['country'])] : $g_user['country']));

		$html->setvar("country_title", $country_title);
		$html->setvar("state_title", $state_title);
		$html->setvar("city_title", $city_title);
		$html->setvar("country", $g_user['country_id']);
		$html->setvar("state", $g_user['state_id']);
		$html->setvar("city", $g_user['city_id']);

        if (Common::isOptionActive('hide_profile_enabled')) {
            $sql = "SELECT `hide_time`
                      FROM `user`
                     WHERE `user_id` = " . to_sql(get_session('user_id'), 'Number');
            $hide = DB::result($sql);
            if ($hide > 0) {
                $html->parse('active', true);
            } else {
                $html->parse('hide', true);
            }
        } else {
            $html->parse('li_last', true);
        }

        if(!Common::isOptionActive('free_site')) {
            if (User::isPaidFree() && !$g_user['free_access']) {
                $html->parse("my_nogold", true);
            } else {
                $html->parse("my_gold", true);
            }
        }

        if(Common::isOptionActive('viewed_me_tab_enabled')) {
                $html->parse('viewed_me', true);
        }

        if ($g_user['gender'] == 'M') $html->parse("my_male", true);
		else $html->parse("my_female", true);

		if ($g_user['city_id'] > 0 and $g_user['city'] != '') {
            if (UserFields::isActive('orientation') && Common::isOptionActive('your_orientation')) {
                CSearch::parseChecks($html, "p_orientation", "SELECT id, title FROM const_orientation ORDER BY id ASC", $g_user['p_orientation'], 2, 0, true);
            }
			$html->parse("new_near", true);
		}

// PROFILE STATUS

DB::query("SELECT status FROM profile_status WHERE user_id=".$g_user['user_id']);
if(DB::num_rows()>0) {
    $status = DB::fetch_row();
    $html->setvar("profile_status",$status['status']);
}

if (Common::isOptionActive('profile_status')) {
    $html->parse("profile_status", true);
}
// PROFILE STATUS



// PEOPLES

global $gc;
global $gm;

$on_page = 6;
if (isset($gm) and $gm) {
	$on_page = 6;
} elseif (isset($gc) and $gc) {
	$on_page = 6;
}

global $users_stop_list, $status_style, $member_index;
$users_stop_list = $g_user['user_id'];
$status_style = 0;

$is_photo = true;
$is_city = true;
$is_state = true;
$is_country = true;

// ORDER: PHOTO - city - state - country | JUST PHOTO | any other

	// new
	if($g['options']['show_home_page_online']=="N") {
		$where = " u.user_id NOT IN({users_stop_list}) AND u.hide_time=0 AND u.register> '" . date('Y-m-d H:i:s', (time() - 60 * 60 * 24 * $g['options']['new_time'])) . "' " . $g['sql']['your_orientation'] . " ";
		$html->assign("members_link","users_new.php");
		$html->parse("members_new");
	}
	// online
	else {

            if($g_user['default_online_view']=='B' || $g_user['default_online_view']=='')
                $where = " u.user_id NOT IN({users_stop_list})  AND u.hide_time=0 AND u.last_visit>'" . (date("Y-m-d H:i:s", time() - $g['options']['online_time'] * 60))."' " . $g['sql']['your_orientation'] . " ";
		else
		$where = " u.user_id NOT IN({users_stop_list}) AND (u.gender=".to_sql($g_user['default_online_view']).") AND u.hide_time=0 AND u.last_visit>'" . (date("Y-m-d H:i:s", time() - $g['options']['online_time'] * 60))."' " . $g['sql']['your_orientation'] . " ";
		$html->assign("members_link","users_online.php");
		$html->parse("members_online");
	}

for($i=0;$i<$on_page;$i++)
{

$member_index = $i;

// SELECT city
$where_query = str_replace("{users_stop_list}",$users_stop_list,$where);

$row = array();

// FIRST OF ALL with photo
if($is_photo)
{
	if($is_city == false || !parse_user_home($html, "SELECT u.*, (DATE_FORMAT(NOW(), '%Y') - DATE_FORMAT(birth, '%Y') - (DATE_FORMAT(NOW(), '00-%m-%d') < DATE_FORMAT(birth, '00-%m-%d'))
) AS age FROM user AS u WHERE $where_query AND u.is_photo='Y' AND u.city_id = ".$g_user['city_id']))
	{
		$is_city = false;
		if($is_state == false || !parse_user_home($html, "SELECT u.*, (DATE_FORMAT(NOW(), '%Y') - DATE_FORMAT(birth, '%Y') - (DATE_FORMAT(NOW(), '00-%m-%d') < DATE_FORMAT(birth, '00-%m-%d'))
) AS age FROM user AS u WHERE $where_query AND  u.is_photo='Y' AND u.state_id = ".$g_user['state_id']))
		{
			$is_state = false;
			if($is_country == false || !parse_user_home($html, "SELECT u.*, (DATE_FORMAT(NOW(), '%Y') - DATE_FORMAT(birth, '%Y') - (DATE_FORMAT(NOW(), '00-%m-%d') < DATE_FORMAT(birth, '00-%m-%d'))
) AS age FROM user AS u WHERE $where_query AND  u.is_photo='Y' AND u.country_id = ".$g_user['country_id']))
			{
				$is_country = false;
				if(!parse_user_home($html, "SELECT u.*, (DATE_FORMAT(NOW(), '%Y') - DATE_FORMAT(birth, '%Y') - (DATE_FORMAT(NOW(), '00-%m-%d') < DATE_FORMAT(birth, '00-%m-%d'))
) AS age FROM user AS u WHERE $where_query AND u.is_photo='Y'"))
				{
					$is_photo = false;
					$is_city = true;
					$is_state = true;
					$is_country = true;
				}
			}
		}
	}
// END PHOTO
}

// WITHOUT PHOTO
if(!$is_photo)
{
	if($is_city == false || !parse_user_home($html, "SELECT u.*, (DATE_FORMAT(NOW(), '%Y') - DATE_FORMAT(birth, '%Y') - (DATE_FORMAT(NOW(), '00-%m-%d') < DATE_FORMAT(birth, '00-%m-%d'))
) AS age FROM user AS u WHERE $where_query AND u.city_id = ".$g_user['city_id']))
	{
		$is_city = false;
		if($is_state == false || !parse_user_home($html, "SELECT u.*, (DATE_FORMAT(NOW(), '%Y') - DATE_FORMAT(birth, '%Y') - (DATE_FORMAT(NOW(), '00-%m-%d') < DATE_FORMAT(birth, '00-%m-%d'))
) AS age FROM user AS u WHERE $where_query AND u.state_id = ".$g_user['state_id']))
		{
			$is_state = false;
			if($is_country == false || !parse_user_home($html, "SELECT u.*, (DATE_FORMAT(NOW(), '%Y') - DATE_FORMAT(birth, '%Y') - (DATE_FORMAT(NOW(), '00-%m-%d') < DATE_FORMAT(birth, '00-%m-%d'))
) AS age FROM user AS u WHERE $where_query AND u.country_id = ".$g_user['country_id']))
			{
				$is_country = false;
				if(!parse_user_home($html, "SELECT u.*, (DATE_FORMAT(NOW(), '%Y') - DATE_FORMAT(birth, '%Y') - (DATE_FORMAT(NOW(), '00-%m-%d') < DATE_FORMAT(birth, '00-%m-%d'))
) AS age FROM user AS u WHERE $where_query ")) $is_photo = false;
			}
		}
	}
// END PHOTO
}

}
        if(Common::isOptionActive('mail')) {
            $html->parse('mail_on');
        }
        if(Common::isOptionActive('wink')) {
            $html->parse('wink_on');
        }

        CBanner::getBlock($html, 'footer_additional');

        if (self::$numberUsersNew){
            $html->parse("users_new");
        }

// PEOPLES

        parent::parseBlock($html);
	}
}

function parse_user_home(&$html, $sql){
	global $users_stop_list, $member_index, $status_style;

    if(Users_List::isBigBase()) {
        $sql = 'SELECT * FROM (' . $sql . ' ORDER BY u.user_id DESC LIMIT 100) AS u_tmp';
    }

    $sql .= ' ORDER BY RAND() LIMIT 1';

	$row = DB::row($sql);

	#print $sql."<br>";
	#print_r($row);

	if(!is_array($row)) return false;

    CProfile::$numberUsersNew++;

	$users_stop_list .= ",".$row['user_id'];

	$row['country_title'] = trim($row['country']);
	if(pl_strlen($row['country_title']) > 7 ) $row['country_title'] = pl_substr($row['country_title'], 0, 7) . "...";
	foreach($row as $k=>$v) {
        if ($k == 'name') $v = User::nameOneLetterFull($v);
        $html->assign("members_".$k, $v);
    }

	// PHOTO
	$html->assign("members_photo",User::getPhotoDefault($row['user_id'],"s"));

	// STATUS
	$status = DB::row("SELECT status FROM profile_status WHERE user_id=".$row['user_id']);
	if(is_array($status)) {
		$html->assign("members_status",$status['status']);
		$html->assign("members_status_style",$status_style++%6 + 1);
	}
    if (Common::isOptionActive('profile_status')) {
        $html->subcond(is_array($status), "user_status");
    }


	$html->assign("members_num",$member_index);

	$html->parse("users_new_item",true);
	$html->parse("users_new_item2",true);

	return true;
}

/*class CBanerHome extends CHtmlBlock
{
	function parseBlock(&$html)
	{
		global $g;
		global $g_user;
		if (User::isPaid(guid()))
            $baner = get_banner("home_paid");
		else
            $baner = get_banner("home");
		if ($baner !== false)
		{
			$html->setvar("banner_home", $baner);
			$html->parse("banner_home", true);
			parent::parseBlock($html);
		}
	}
}*/


g_user_full();

$page = new CProfile("", $g['tmpl']['dir_tmpl_main'] . "home.html");
$header = new CHeader("header", $g['tmpl']['dir_tmpl_main'] . "_header.html");
$page->add($header);
$footer = new CFooter("footer", $g['tmpl']['dir_tmpl_main'] . "_footer.html");
$page->add($footer);
$complite = new CComplite("complite", $g['tmpl']['dir_tmpl_main'] . "_complite.html");
$page->add($complite);
$baner = new CBanner("baner_home", null);
$page->add($baner);

$search = new CSearch("search", $g['tmpl']['dir_tmpl_main'] . "_search.html");
$page->add($search);

demoImAdd();
include("./_include/core/main_close.php");

?>
