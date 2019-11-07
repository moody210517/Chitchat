<?php
/* (C) Websplosion LTD., 2001-2014

IMPORTANT: This is a commercial software product
and any kind of using it must agree to the Websplosion's license agreement.
It can be found at http://www.chameleonsocial.com/license.doc

This notice may not be removed from the source code. */

$area = "login";
include("./_include/core/pony_start.php");


$g['to_head'][] = '<link rel="stylesheet" href="'.$g['tmpl']['url_tmpl_mobile'].'css/profile.css" type="text/css" media="all"/>';

class CProfileMain extends CHtmlBlock
{
	function action()
	{
		global $g;
		global $g_user;
		$cmd = get_param('cmd', '');
		
		$this->message = '';
		
		if ($cmd == 'update')
		{
			$mail = get_param('email', '');

            $month  = (int) get_param('month', 1);
			$day    = (int) get_param('day', 1);
			$year   = (int) get_param('year', 1980);

            $country = get_param('country', '');
            $state   = get_param('state', '');
            $city    = get_param('city', '');
            
            $this->message .= User::validate('email,birthday,location');

            if ($this->message == '')
			{
				$h = zodiac($year . "-" . $month . "-" .  $day);

                DB::execute("
					UPDATE user SET
                                mail        =" . to_sql($mail, 'Text') . ",
                                country_id  =" . to_sql($country, 'Number') . ",
                                state_id    =" . to_sql($state, 'Number') . ",
                                city_id     =" . to_sql($city, 'Number') . ",
                                country     =" . to_sql(Common::getLocationTitle('country', $country), 'Text') . ",
                                state       =" . to_sql(Common::getLocationTitle('state', $state), 'Text') . ",
                                city        =" . to_sql(Common::getLocationTitle('city', $city), 'Text') . ",
                                birth       ='" . $year . '-' . $month . '-' .  $day . "',
                                horoscope   ='" . $h . "'
                    WHERE user_id=" . get_session("user_id") . ";
                ");

                DB::query("SELECT *, YEAR(FROM_DAYS(TO_DAYS('" . date('Y-m-d H:i:s') . "')-TO_DAYS(birth))) AS age FROM user WHERE user_id=" . get_session("user_id") . "");
                $g_user = DB::fetch_row();
                g_user_full();
			}
		}
	}
	function parseBlock(&$html)
	{
		global $g;
		global $l;
		global $g_user;

		if ($this->message) 
		{
			$html->setvar('error_message', str_replace('<br>', '\r\n', ($this->message)));
			$html->parse('error', true);
		}
		else if(get_param('cmd', '') == 'update')
		{
			$html->parse('changes_saved');
		}
		
		if (Common::isOptionActive('blogs'))
		{
			$html->parse('my_blog', true);
		}

		if (isset($this->message)) $html->setvar('update_message', $this->message);

		DB::query("SELECT * FROM texts WHERE user_id=" . get_session("user_id") . " ORDER BY id DESC LIMIT 1");
		if ($row2 = DB::fetch_row())
		{
			foreach ($row2 as $k => $v)
			{
				if ($k != "id" and $k != "user_id" and !is_int($k)) $g_user[$k] = $v;
			}
		}

		$html->setvar('name', $g_user['name']);
		$html->setvar('mail', get_param('email', $g_user['mail']));
		$or_title = DB::result("SELECT title FROM const_orientation WHERE id=" . $g_user['orientation'] . "");
		$html->setvar('orientation', l($or_title));

		$d = explode('-', $g_user['birth']);
		$html->setvar('month_options', h_options(Common::listMonths(), get_param('month', (int) $d[1])));
		$html->setvar('day_options', n_options(1, 31, get_param('day', (int) $d[2])));
		$html->setvar('year_options', n_options(date("Y") - $g['options']['users_age_max'], date("Y") - $g['options']['users_age'] + 1, get_param("year", (int) $d[0])));
		#echo n_options(date("Y") - $g['options']['users_age_max'], date("Y") - $g['options']['users_age'] + 1, get_param("year", (int) $d[0]));
		
        $country = get_param('country', $g_user['country_id']);
		$state   = get_param('state', $g_user['state_id']);
        $city    = get_param('city', $g_user['city_id']);
		$html->setvar('country_options', Common::listCountries($country));
        $html->setvar('state_options', Common::listStates($country, $state));	
		$html->setvar('city_options', Common::listCities($state, $city));		
		
		if ($g_user['couple_id'] > 0) 
            $html->setvar("couple_name", DB::result("SELECT name FROM user WHERE user_id=" . $g_user['couple_id'] . ""));
		if ($g_user['couple'] == 'A' && $g_user['couple_id'] > 0) 
            $html->parse('couple_approve', true);
		elseif ($g_user['couple'] == 'N' and $g_user['couple_id'] > 0) 
            $html->parse('couple_request_cancel', true);
		elseif ($g_user['couple'] == 'Y' and $g_user['couple_id'] > 0) 
            $html->parse('couple_cancel', true);
		else 
            $html->parse('couple_request', true);

		parent::parseBlock($html);
	}
}

g_user_full();

$page = new CProfileMain("", $g['tmpl']['dir_tmpl_mobile'] . "profile_info.html");
$header = new CHeader("header", $g['tmpl']['dir_tmpl_mobile'] . "_header.html");
$page->add($header);
$footer = new CFooter("footer", $g['tmpl']['dir_tmpl_mobile'] . "_footer.html");
$page->add($footer);

include("./_include/current/profile_menu.php");
$profile_menu = new CProfileMenu("profile_menu", $g['tmpl']['dir_tmpl_mobile'] . "_profile_menu.html");
$profile_menu->setActive('info');
$page->add($profile_menu);

$user_menu = new CUserMenu("user_menu", $g['tmpl']['dir_tmpl_mobile'] . "_user_menu.html");
$user_menu->setActive('profile');
$page->add($user_menu);

include("./_include/core/main_close.php");

?>
