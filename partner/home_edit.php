<?php
/* (C) Websplosion LTD., 2001-2014

IMPORTANT: This is a commercial software product
and any kind of using it must agree to the Websplosion's license agreement.
It can be found at http://www.chameleonsocial.com/license.doc

This notice may not be removed from the source code. */

include("../_include/core/partner_start.php");

class CPartner extends CHtmlBlock
{

	var $message;

	function action()
	{

	}

	function init()
	{
		$cmd = get_param("cmd", "");

		if ($cmd == "edit")
		{
			$pass = to_sql(get_param("join_password", ""), "Text");
			$pass2 = to_sql(get_param("verify_password", ""), "Text");
			$mail = get_param("email", "");

			$this->jmessage = "";

			if (!Common::validateEmail($mail)) {
				$this->jmessage .= "The E-mail incorrect.<br>Please choose another.<br>";
			}

			if ($pass != $pass2 || !User::validatePassword($pass))
			{
				$this->jmessage .= "The Password incorrect.<br>Please choose another.<br>";
			}

			$contact_name = to_sql(get_param("contact_name", ""), "Text");
			$phone = to_sql(get_param("phone", ""), "Text");
			$checkPayee = to_sql(get_param("checkPayee", ""), "Text");
			$addr1 = to_sql(get_param("addr1", ""), "Text");
			$addr2 = to_sql(get_param("addr2", ""), "Text");
			$zip = to_sql(get_param("zip", ""), "Text");
            $tax = to_sql(get_param("tax", ""), "Text");

			$company_name = to_sql(get_param("name", ""), "Text");
			$referring_domains = to_sql(get_param("referring_domains", ""), "Text");

            $real_email = DB::result("SELECT mail FROM partner WHERE partner_id=" .  to_sql(get_session("partner_id"), "Number"));

			if ($mail!=$real_email && DB::result("SELECT partner_id FROM partner WHERE mail=" . to_sql($mail) . ";") != "")
			{
				$this->jmessage .= "The E-mail you entered already exists on our system.<br>Please enter another.<br>";
			}

			if ($this->jmessage == "")
			{
				$country = to_sql(get_param("country", ""), "Number");
				$state = to_sql(get_param("state", ""), "Number");
				$city = to_sql(get_param("city", ""), "Number");

				DB::execute("
					UPDATE partner
					SET
					password=" . $pass . ",
					company=" . $company_name . ",
					domain=" . $referring_domains . ",
					real_name=" . $contact_name . ",
					phone=" . $phone . ",
					mail=" . to_sql($mail) . ",
					adress=" . $addr1 . ",
					adress2=" . $addr2 . ",
					country_id=" . $country . ",
					state_id=" . $state . ",
					city_id=" . $city  . ",
					zip=" . $zip . ",
                    tax=" . $tax . "
					WHERE partner_id=" . get_session("partner_id") . "
				");
                redirect();
			}
		}
	}

	function parseBlock(&$html)
	{
		$html->setvar("message", $this->message);
		DB::query("SELECT * FROM partner WHERE partner_id=" . get_session("partner_id") . "");

		if ($row = DB::fetch_row())
		{
			foreach ($row as $k => $v)
			{
				$html->setvar($k, $v);
			}
		}
		else
		{
			session_unset();
			redirect("index.php");
		}



		$html->setvar("join_message", isset($this->jmessage) ? $this->jmessage : "");

		$name = get_param("join_username", "");
		$pass = get_param("join_password", "");
		$pass2 = get_param("verify_password", "");
		$mail = get_param("email", "");

		$html->setvar("join_handle", $name);
		$html->setvar("join_password", $pass);
		$html->setvar("verify_password", $pass2);
		$html->setvar("email", $mail);

        if ($row['country_id']) {
            $defaultCountry = $row['country_id'];
            $defaultState = $row['state_id'];
            $defaultCity = $row['city_id'];
        } else {
            $defaultCountry = 0;
            $defaultState = 0;
            $defaultCity = 0;
            $geoInfo = getDemoCapitalCountry();
            if ($geoInfo) {
                $defaultCountry = $geoInfo['country_id'];
                $defaultState = $geoInfo['state_id'];
                $defaultCity = $geoInfo['city_id'];
            }
        }

		$defaultCountry = get_param("country", $defaultCountry);
		$html->setvar("country_options", Common::listCountries($defaultCountry));

		$paramState = get_param("state");
        if ($paramState) {
            $defaultState = DB::result("SELECT state_id FROM geo_state WHERE country_id=" . to_sql($defaultCountry) . " AND state_id=" . to_sql($paramState));
            if (!$defaultState) {
                $defaultState = DB::result("SELECT state_id FROM geo_state WHERE country_id=" . to_sql($defaultCountry) . " AND hidden = 0 ORDER BY state_title LIMIT 1");
            }
        }
        $html->setvar("state_options", Common::listStates($defaultCountry, $defaultState));

        $paramCity = get_param("city");
        if ($paramCity) {
            $defaultCity = 0;
        }
		$html->setvar("city_options", Common::listCities($defaultState, $defaultCity));


		parent::parseBlock($html);
	}
}

$page = new CHtmlBlock("", $g['tmpl']['dir_tmpl_partner'] . "home_edit.html");
$header = new CPartnerHeader("header", $g['tmpl']['dir_tmpl_partner'] . "_header.html");
$page->add($header);
$footer = new CPartnerFooter("footer", $g['tmpl']['dir_tmpl_partner'] . "_footer.html");
$page->add($footer);

$join = new CPartner("home_edit", null);
$page->add($join);

$banner_top = new CbannerP("banner_top",  $g['tmpl']['dir_tmpl_partner'] . "_banner.html");
$page->add($banner_top);

include("../_include/core/partner_close.php");

?>
