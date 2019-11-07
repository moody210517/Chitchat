<?php
/* (C) Websplosion LTD., 2001-2014

IMPORTANT: This is a commercial software product
and any kind of using it must agree to the Websplosion's license agreement.
It can be found at http://www.chameleonsocial.com/license.doc

This notice may not be removed from the source code. */

include("./_include/core/pony_start.php");


$g['to_head'][] = '<link rel="stylesheet" href="'.$g['tmpl']['url_tmpl_mobile'].'css/main.css" type="text/css" media="all"/>';
$g['options']['no_loginform'] = 'Y';
$g['options']['no_user_menu'] = 'Y';

class CRegisterConfirmEmail extends CHtmlBlock
{
	function action()
	{
		$hash = get_param("hash", "");
		if($hash)
		{
			//$user_id = DB::result("SELECT user_id FROM user WHERE active_code = " . to_sql($hash, "Text") .";");
            $user = DB::select('user', "`active_code` = " . to_sql($hash));
			if (!empty($user)) {
				DB::execute("UPDATE user SET active_code = '' WHERE user_id=" . $user[0]['user_id'] . "");
                DB::execute("UPDATE user SET last_ip='" . $_SERVER['REMOTE_ADDR'] . "' WHERE user_id=" . $user[0]['user_id'] . "");
                if (Common::isOptionActive('manual_user_approval') && !$user[0]['active']) {
                        redirect('index.php?cmd=wait_approval');
                } else {
                    set_session('user_id', $user[0]['user_id']);
                    set_session('user_id_verify', $user[0]['user_id']);
                }
			} else {
				redirect('index.php');
			}


		}
		else
		{
			redirect('index.php');
		}
	}
	function parseBlock(&$html) {

        if (guid()) {
            if ($html->varExists('header_url_logo_mobile')) {
                $urlLogo = Common::getUrlLogo('logo', 'mobile');
                Common::parseSizeParamLogo($html, 'logo', $urlLogo);
                $html->setvar('header_url_logo_mobile', $urlLogo);
                $html->parse('logo_bl', false);
            }
        } else {
            if ($html->blockExists('page_visitor')) {
                $html->parse('page_visitor', false);
            }
        }

		parent::parseBlock($html);
	}
}

$page = new CRegisterConfirmEmail("", $g['tmpl']['dir_tmpl_mobile'] . "confirm_email.html");
$page->parseBanner = true;

$header = new CHeader("header", $g['tmpl']['dir_tmpl_mobile'] . "_header.html");
$page->add($header);

$tmplFooter = $g['tmpl']['dir_tmpl_mobile'] . "_footer.html";
if (guid() && Common::isOptionActive('is_allow_empty_footer', 'template_options')) {
    $tmplFooter = $g['tmpl']['dir_tmpl_mobile'] .  "_footer_empty.html";
}

$footer = new CFooter("footer", $tmplFooter);
$page->add($footer);

include("./_include/core/main_close.php");

?>