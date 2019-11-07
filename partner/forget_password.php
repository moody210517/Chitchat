<?php
/* (C) Websplosion LTD., 2001-2014

IMPORTANT: This is a commercial software product
and any kind of using it must agree to the Websplosion's license agreement.
It can be found at http://www.chameleonsocial.com/license.doc

This notice may not be removed from the source code. */

include("../_include/core/partner_start.php");

class CForget extends CHtmlBlock
{

	var $message = "";
	var $login = "";

	function action()
	{
		global $g;
		$mail = get_param('mail' , '');
		if ($mail != '')
		{
            $sql = 'SELECT * FROM partner
                WHERE mail = ' . to_sql($mail, 'Text');
            DB::query($sql);
			$row = DB::fetch_row();

			if ($row['mail'] != '')
			{
                $vars = array(
                    'title' => Common::getOption('title', 'main'),
                    'name' => $row['name'],
                    'mail' => $row['mail'],
                    'password' => $row['password'],
                );
                Common::sendAutomail(Common::getOption('lang_loaded', 'main'), $row['mail'], 'partner_forget', $vars);

				redirect("index.php");
			}
			else
			{
				$this->message = l('Incorect e-mail adress.');
			}
		}
	}

	function parseBlock(&$html)
	{
		$html->setvar("message", $this->message);
		parent::parseBlock($html);
	}
}

$page = new CHtmlBlock("", $g['tmpl']['dir_tmpl_partner'] . "forget_password.html");
$header = new CPartnerHeader("header", $g['tmpl']['dir_tmpl_partner'] . "_header.html");
$page->add($header);
$footer = new CPartnerFooter("footer", $g['tmpl']['dir_tmpl_partner'] . "_footer.html");
$page->add($footer);

$forget = new CForget("forget", null);
$page->add($forget);

$banner_top = new CbannerP("banner_top",  $g['tmpl']['dir_tmpl_partner'] . "_banner.html");
$page->add($banner_top);

include("../_include/core/partner_close.php");

?>