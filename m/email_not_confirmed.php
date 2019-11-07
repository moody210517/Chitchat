<?php
/* (C) Websplosion LTD., 2001-2014

IMPORTANT: This is a commercial software product
and any kind of using it must agree to the Websplosion's license agreement.
It can be found at http://www.chameleonsocial.com/license.doc

This notice may not be removed from the source code. */

$area = "login";
include("./_include/core/pony_start.php");


$g['to_head'][] = '<link rel="stylesheet" href="'.$g['tmpl']['url_tmpl_mobile'].'css/main.css" type="text/css" media="all"/>';
$g['options']['no_user_menu'] = 'Y';

if ($g_user['user_id'] && !$g_user['active_code']){
    Common::toHomePage();
}

class CRegisterEmailConfirmation extends CHtmlBlock
{
	function action()
	{
		global $g;
		global $g_info;
		global $g_user;
		global $l;
		global $gc;

        $isResponseAjax = get_param('ajax');
        $responseData = '';
		$mail = get_param("email", "");
		$this->message = "";
		if($mail){
			if (!Common::validateEmail($mail)){
                $responseData = l('this_email_address_is_not_correct');
				$this->message = $responseData . " \\n";
			} else {
				$user_with_same_email = DB::result("SELECT user_id FROM user WHERE mail=" . to_sql($mail, "Text") . ";");
				if ($user_with_same_email && $user_with_same_email != $g_user['user_id']){
                    $responseData = l('exists_email');
					$this->message = $responseData . " \\n";
				}
			}

			if(!$this->message){
				user_change_email($g_user['user_id'], $mail);
			}

            if ($isResponseAjax) {
                die(getResponseDataAjaxByAuth($responseData));
            }
		}
	}

	function parseBlock(&$html)
	{
		$mail = get_param("email", "");
		$html->setvar("email", $mail);

        if($html->varExists('header_url_logo_mobile')) {
            $urlLogo = Common::getUrlLogo('logo', 'mobile');
            Common::parseSizeParamLogo($html, 'logo', $urlLogo);
            $html->setvar('header_url_logo_mobile', $urlLogo);
        }

		if($this->message){
			$html->setvar("email_error_message", $this->message);
			$html->parse("email_error", true);
		}

		if(!$this->message && $mail)
			$html->parse("email_sent_title", true);
		else
			$html->parse("default_title", true);

        if ($html->blockExists('email_sent_info')) {
            if (DB::result('SELECT `active_code` FROM user WHERE `user_id` = ' . to_sql(guid()))) {
                $html->parse('email_sent_info');
            }
        }

		parent::parseBlock($html);
	}
}

$page = new CRegisterEmailConfirmation("", $g['tmpl']['dir_tmpl_mobile'] . "email_not_confirmed.html");
$page->parseBanner = true;
$header = new CHeader("header", $g['tmpl']['dir_tmpl_mobile'] . "_header.html");
$page->add($header);

$tmplFooter = $g['tmpl']['dir_tmpl_mobile'] . "_footer.html";
if (Common::isOptionActive('is_allow_empty_footer', 'template_options')) {
    $tmplFooter = $g['tmpl']['dir_tmpl_mobile'] .  "_footer_empty.html";
}
$footer = new CFooter("footer", $tmplFooter);
$page->add($footer);

include("./_include/core/main_close.php");
