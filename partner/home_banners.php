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

	function parseBlock(&$html)
	{
		global $g;

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

		DB::query("SELECT id, name, code, size, file FROM partner_banners WHERE langs = '' OR langs = " . to_sql(Common::getOption('lang_loaded', 'main')) . " ORDER BY id");
		while ($row = DB::fetch_row())
		{
			$html->setvar("id", $row['id']);
			$html->setvar("b_name", $row['name']);
			$html->setvar("size", $row['size']);
			$html->setvar("file", $row['file']);

			$abs_url =  "http://".str_replace("//", "/", str_replace("partner", "", str_replace("//", "/", str_replace("\\", "", $_SERVER['HTTP_HOST'] . dirname($_SERVER['PHP_SELF']) . "/"))));

			$row['code'] = str_replace("{id}", get_session("partner_id"), $row['code']);
			$row['code'] = str_replace("{file}", $row['file'], $row['code']);
			$row['code'] = str_replace("{files_dir}", $abs_url . $g['dir_files'], $row['code']);
			$row['code'] = str_replace("{url_main}", $abs_url . '', $row['code']);
			$row['code'] = str_replace("{url_files}", $abs_url . $g['dir_files'], $row['code']);
			$html->setvar("code", $row['code']);

			$html->parse("show", true);
			$html->parse("hide", true);

			if ($row['file'] != "")
			{
				$html->parse("img", false);
			}
			else
			{
				$html->setblockvar("img", "");
			}
			$html->parse("question", true);
		}

		parent::parseBlock($html);
	}
}

$page = new CHtmlBlock("", $g['tmpl']['dir_tmpl_partner'] . "home_banners.html");
$header = new CPartnerHeader("header", $g['tmpl']['dir_tmpl_partner'] . "_header.html");
$page->add($header);
$footer = new CPartnerFooter("footer", $g['tmpl']['dir_tmpl_partner'] . "_footer.html");
$page->add($footer);

$b = new CPartner("home", null);
$page->add($b);

$banner_top = new CbannerP("banner_top",  $g['tmpl']['dir_tmpl_partner'] . "_banner.html");
$page->add($banner_top);

include("../_include/core/partner_close.php");

?>
