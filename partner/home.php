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
		$cmd = get_param("cmd", "");
		global $g;

		if ($cmd == "payment")
		{
			$payment = get_param("payment", "");
			if ($payment >= $g['options']['partner_min_money'])
			{
				$account = DB::result("SELECT account FROM partner WHERE partner_id=" . get_session("partner_id") . "");

				if ($account > $payment)
				{
					DB::execute("
						UPDATE partner
						SET
						payment=" . to_sql($payment, "Number") . "
						WHERE partner_id=" . get_session("partner_id") . "
					");
				}
				else
				{
					$this->message = "You have not enjoy money.";
				}
			}
			else
			{
				$this->message = "Minimal payment - $" . $g['options']['partner_min_money'] . "";
			}
		}
	}
	function parseBlock(&$html)
	{
		global $g;
        $sql = 'SELECT text FROM partner_main
            WHERE name = "account_information_in_partner_home"
                AND lang = ' . to_sql(Common::getOption('lang_loaded', 'main'));
		$html->setvar("account_info", DB::result($sql));

		$html->setvar("message", $this->message);
		$html->setvar("partner_min_money", $g['options']['partner_min_money']);
		DB::query("SELECT * FROM partner WHERE partner_id=" . get_session("partner_id") . "");

		if ($row = DB::fetch_row())
		{
			$row['domain'] = str_replace(",", "", $row['domain']);
			$row['domain'] = str_replace("  ", " ", $row['domain']);
			$row['domain'] = str_replace("  ", " ", $row['domain']);
			$row['domain'] = str_replace("  ", " ", $row['domain']);
			$d = explode(" ", $row['domain']);
			foreach ($d as $k => $v)
			{
				$d[$k] = "<a href=\"https://" . $v  ."\">" . $v  . "</a>";
			}
			$row['domain'] = implode(", ", $d);

            $row_city = DB::row('SELECT city_title FROM geo_city WHERE `city_id` = '.  to_sql($row['city_id'], "Number").'');
            $row_state = DB::row('SELECT state_title FROM geo_state WHERE `state_id` = '.  to_sql($row['state_id'], "Number").'');
            $row_country = DB::row('SELECT country_title FROM geo_country WHERE `country_id` = '.  to_sql($row['country_id'], "Number").'');
            if ((isset($row_country['country_title'])) && (!empty($row_country['country_title']))){
                $row['country'] = $row_country['country_title'];
            }
            if ((isset($row_state['state_title'])) && (!empty($row_state['state_title']))){
                $row['state_province'] = $row_state['state_title'];
            }
            if ((isset($row_city['city_title'])) && (!empty($row_city['city_title']))){
                $row['city'] = $row_city['city_title'];
            }


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

		parent::parseBlock($html);
	}
}

$page = new CHtmlBlock("", $g['tmpl']['dir_tmpl_partner'] . "home.html");
$header = new CPartnerHeader("header", $g['tmpl']['dir_tmpl_partner'] . "_header.html");
$page->add($header);
$footer = new CPartnerFooter("footer", $g['tmpl']['dir_tmpl_partner'] . "_footer.html");
$page->add($footer);

$join = new CPartner("home", null);
$page->add($join);

$banner_top = new CbannerP("banner_top",  $g['tmpl']['dir_tmpl_partner'] . "_banner.html");
$page->add($banner_top);

include("../_include/core/partner_close.php");

?>

