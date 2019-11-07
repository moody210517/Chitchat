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
			#if ($this->message == "")
			{
				DB::execute("
					UPDATE partner
					SET
					bank_name=" . to_sql(get_param("bank_name", ""), "Text") . ",
					bank_phone=" . to_sql(get_param("bank_phone", ""), "Text") . ",
					bank_adress1=" . to_sql(get_param("bank_adress1", ""), "Text") . ",
					bank_adress2=" . to_sql(get_param("bank_adress2", ""), "Text") . ",
					bank_city=" . to_sql(get_param("bank_city", ""), "Text") . ",
					bank_state=" . to_sql(get_param("bank_state", ""), "Text") . ",
					bank_zip=" . to_sql(get_param("bank_zip", ""), "Text") . ",
					bank_country=" . to_sql(get_param("bank_country", ""), "Text") . ",
					bank_account=" . to_sql(get_param("bank_account", ""), "Text") . ",
					bank_aba=" . to_sql(get_param("bank_aba", ""), "Text") . ",
					bank_swift=" . to_sql(get_param("bank_swift", ""), "Text") . ",
					bank_type=" . to_sql(get_param("bank_type", ""), "Text") . ",
					bank_to=" . to_sql(get_param("bank_to", ""), "Text") . ",
                    paypal=" . to_sql(get_param("paypal", ""), "Text") . ",
					other=" . to_sql(get_param("other", ""), "Text") . "
					WHERE partner_id=" . get_session("partner_id") . "
				");
			}
		}
	}

	function parseBlock(&$html)
	{
		#$html->setvar("message", $this->message);
		DB::query("SELECT * FROM partner WHERE partner_id=" . get_session("partner_id") . "");

		if ($row = DB::fetch_row())
		{
			foreach ($row as $k => $v)
			{
				$html->setvar($k, get_param($k, $v));
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

$page = new CHtmlBlock("", $g['tmpl']['dir_tmpl_partner'] . "home_bank.html");
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
