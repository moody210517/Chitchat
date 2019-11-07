<?php
/* (C) Websplosion LTD., 2001-2014

IMPORTANT: This is a commercial software product
and any kind of using it must agree to the Websplosion's license agreement.
It can be found at http://www.chameleonsocial.com/license.doc

This notice may not be removed from the source code. */

$area = "login";
include("./_include/core/pony_start.php");


$g['to_head'][] = '<link rel="stylesheet" href="'.$g['tmpl']['url_tmpl_mobile'].'css/search.css" type="text/css" media="all"/>';

//payment_check('search_advaced');

class CSearchAdvanced extends UserFields
{
    function action()
	{
        $cmd = get_param('cmd');
        if(in_array($cmd, array('geo_cities', 'geo_states', 'geo_countries'))) {
            $id = get_param('select_id');
            $selected = get_param('selected');
            $type = str_replace('geo_', '', $cmd);
            $method = 'list' . ucfirst($type);
            $responseData['list'] = Common::$method($id, '', 0);
            die(getResponseDataAjaxByAuth($responseData));
        }
    }

	function parseBlock(&$html)
	{
		/*global $g;
		global $l;
		global $g_user;

        if (Common::getOption('set', 'template_options') == 'urban') {
            User::setGetParamsFilter('user_search_filters_mobile');
        }

        if ($html->varExists('display_params')) {
            $html->setvar('display_params', get_param('display'));
        }

		$status = array('' => l('search_show_all'),
                        'new' => l('search_show_new'),
                        'online' => l('search_show_online'),
                        //"birthday" => l('birthday'),
                        );
		$html->setvar('status_options', h_options($status, get_param('status')));

		if (!Common::isOptionActive('no_profiles_without_photos_search')) {
			if ($html->blockExists('with_photo_checked') && get_param('with_photo', 1)) {
				$html->parse('with_photo_checked', false);
			}
			$html->parse('with_photo_partl', false);
			$html->parse('with_photo_resizel', false);
			$html->parse('with_photo_param', false);
		}

		//if (get_param("cmd", "") == "location") {
		$country = get_param('country', $g_user['country_id']);
		$state   = get_param('state', $g_user['state_id']);
        $city    = get_param('city', $g_user['city_id']);
		//} else 	{
			//$country = get_param('country', $g_user['country_id']);
			//$state = get_param('state', -1);

		//}

        $html->setvar('country_options', Common::listCountries($country, false, false, false, false));
		$html->setvar('state_options', Common::listStates($country, $state));

		$state = DB::result("SELECT state_id, state_title FROM geo_state WHERE country_id=" . to_sql($country, "Number") . " AND state_id=" . to_sql($state, "Number") . ";");

		if ($state != '' and $state != 0) {
			$city_options = DB::db_options("SELECT city_id, city_title FROM geo_city WHERE state_id=" . to_sql($state, "Number") . ";", get_param("city", $g_user['city_id']));
			$html->setvar('city_options', Common::listCities($state, $city));
		}

		/*$html->setvar("p_age_from_options", n_options($g['options']['users_age'], "100", get_param("p_age_from", $g['options']['users_age'])));
		$html->setvar("p_age_to_options", n_options($g['options']['users_age'], "100", get_param("p_age_to", 100)));

		$checks = get_checks_param("p_orientation");
		$this->parseChecks($html, "SELECT id, title FROM const_orientation", $checks, 2, 0, "p_orientation");
		$checks = get_checks_param("p_relation");
		$this->parseChecks($html, "SELECT id, title FROM const_relation", $checks, 2, 0, "p_relation");

		foreach ($g['user_var'] as $k => $v)
		{
			if (substr($k, 0, 2) == "p_")
			{
				if ($v[0] == "from_table")
				{
					if ($v[1] == "int")
					{
						if (isset($v[5]) and $v[5] == "from")
						{
							$html->setvar("name_from", $k);
							$html->setvar("name_to", substr($k, 0, strlen($k) - 4) . "to");

							$html->setvar("field", isset($l['all'][to_php_alfabet($v[3])]) ? $l['all'][to_php_alfabet($v[3])] : $v[3]);
							if (get_param($k) == '') {
								$html->setvar("from_options", DB::db_options("SELECT id, title FROM " . $v[2] . " ORDER BY id", ""));
							} else {
								$html->setvar("from_options", DB::db_options("SELECT id, title FROM " . $v[2] . " ORDER BY id", get_param($k)));
							}
							if (get_param(substr($k, 0, strlen($k) - 4) . "to") == '') {
								$html->setvar("to_options", DB::db_options("SELECT id, title FROM " . $v[2] . " ORDER BY id", "last_option"));
							} else {
								$html->setvar("to_options", DB::db_options("SELECT id, title FROM " . $v[2] . " ORDER BY id", get_param(substr($k, 0, strlen($k) - 4) . "to")));
							}
							$html->parse("p_from_to", true);
						}
					}
					elseif ($v[1] == "checks")
					{

						$html->setvar("name", $k);
						$html->setvar("field", isset($l['all'][to_php_alfabet($v[3])]) ? $l['all'][to_php_alfabet($v[3])] : $v[3]);
						$checks = get_checks_param($k) == 0 ? 0 : get_checks_param($k);
						$this->parseChecks($html, "SELECT id, title FROM " . $v[2] . "", $checks, 3, 0);
					}
				}
			}
		}
		if (get_param('photo') == '1') {
			$html->setvar("photo_checked", 'checked="checked"');
		}*/
        /*$this->selectionFields['search_advanced'] = array('from', 'checks', 'group');
        $this->parseLookingFor($html);
		if ($html->varExists('radius')) {
			$html->setvar('radius', get_param('radius',0));
			$maxSearchDistance = intval(Common::getOption('max_search_distance'));
			$html->setvar('radius_max', $maxSearchDistance + 1);
			$isMaxFilterDistanceCountry = intval(Common::getOption('max_filter_distance') == 'max_search_country');
			$html->setvar('max_filter_distance_country', $isMaxFilterDistanceCountry);
			$vars = array('unit' => l(Common::getOption('unit_distance')));
			$html->setvar('slider_within', lSetVars('slider_within', $vars));
		}

		$html->setvar("keyword", get_param("keyword", ""));
		$html->setvar("search_name", get_param("search_name", ""));*/

        $this->parseMobileAdvancedFilter($html);

		parent::parseBlock($html);
	}

	/*function parseChecks(&$html, $sql, $mask, $num_columns = 1, $add = 0, $p = "")
	{
		global $l;
		if (DB::query($sql))
		{
			$i = 0;
			$total_checks = DB::num_rows();
			$in_column = ceil(($total_checks + $add) / $num_columns);

			if ($p == "") {
				$p = "check";
			}

			while ($row = DB::fetch_row()) {
				$i++;
				#p(to_php_alfabet($row[1]));
				$html->setvar("id", $row[0]);
				$html->setvar("title", isset($l['all'][to_php_alfabet($row[1])]) ? $l['all'][to_php_alfabet($row[1])] : $row[1]);
				if ($mask & (1 << ($row[0] - 1))) {
					$html->setvar("checked", " checked");
				} else {
					$html->setvar("checked", "");
				}

				if ($i % $in_column == 0 and $i != 0 and ($i != $total_checks or $add > 0) and $num_columns != 1) {
					$html->parse($p . "_column", false);
				} else {
					$html->setblockvar($p . "_column", "");
				}

				$html->parse($p, true);
			}
			$html->parse($p . "s", true);
			$html->setblockvar($p, "");
			DB::free_result();
		}
	}*/
}

$responseAjax = get_param('ajax');
if($responseAjax) {
    $cmd = get_param('cmd');
    if(in_array($cmd, array('geo_states', 'geo_cities'))) {
        $page = new CSearchAdvanced('', null);
        $page->action(false);
        die();
    }
}

$page = new CSearchAdvanced("", $g['tmpl']['dir_tmpl_mobile'] . "search.html");

$header = new CHeader("header", $g['tmpl']['dir_tmpl_mobile'] . "_header.html");
$page->add($header);
$footer = new CFooter("footer", $g['tmpl']['dir_tmpl_mobile'] . "_footer.html");
$page->add($footer);

if (Common::isParseModule('friends_list')) {
    $friends_list = new CFriendsList("friends_list", $g['tmpl']['dir_tmpl_mobile'] . "_friends_list.html");
    $page->add($friends_list);
}

$user_menu = new CUserMenu("user_menu", $g['tmpl']['dir_tmpl_mobile'] . "_user_menu.html");
if (Common::getOption('set', 'template_options') == 'urban') {
    $header->add($user_menu);
} else {
    $user_menu->setActive('search');
    $page->add($user_menu);
}

include("./_include/core/main_close.php");