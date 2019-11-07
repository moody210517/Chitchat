<?php
/* (C) Websplosion LTD., 2001-2014

IMPORTANT: This is a commercial software product
and any kind of using it must agree to the Websplosion's license agreement.
It can be found at http://www.chameleonsocial.com/license.doc

This notice may not be removed from the source code. */

$area = "login";
include("./_include/core/pony_start.php");


$g['to_head'][] = '<link rel="stylesheet" href="'.$g['tmpl']['url_tmpl_mobile'].'css/account.css" type="text/css" media="all"/>';

class CProfileSettings extends CHtmlBlock
{
	var $message = '';

	function action()
	{
		global $g;
		global $l;
		global $g_user;
        
        $newPassword = get_param('new_password', '');
        $newPasswordConf = get_param('new_password_confirmation', '');
		if ($newPassword || $newPasswordConf)
		{
			$this->message = '';
           
			if ($newPassword != $newPasswordConf){
				$this->message .= l('passwords_not_same');
			} else {
                $this->message .= User::validatePassword($newPassword, false);
            }
            
			if (IS_DEMO and is_demo_user());
			else
			{
				if ($this->message == "")
				{
                    if (Common::isOptionActive('md5'))
                        $newPassword = md5($newPassword);
					DB::execute("UPDATE `user` 
                                    SET `password` = " . to_sql($newPassword, "Text") 
                              . " WHERE `user_id` = " . to_sql($g_user['user_id'], 'Number'));

					$this->message .= l('password_successfully_changed');
				}
			}
		}

		$account_status = get_param('account_status');
		if ($account_status == 'hidden')
		{
			DB::execute("UPDATE user SET hide_time=" . to_sql($g['options']['hide_time'], "Number") . " WHERE user_id=" . $g_user['user_id'] . "");
		}
		else if ($account_status == 'active')
		{
			DB::execute("UPDATE user SET hide_time=0 WHERE user_id=" . $g_user['user_id'] . "");
		}
		else if ($account_status == 'delete')
		{

            if (IS_DEMO and is_demo_user());
            else
            {
                User::delete(guid());
            }

		}
	}
	function parseBlock(&$html)
	{
		global $l;
		global $g;
		global $g_user;

		if ($this->message)
		{
			$html->setvar("error_message", $this->message);
			$html->parse("error", true);
		}
        $isProfileStatusParsed = false;
        if (Common::isOptionActive('hide_profile_enabled')) {
            $sql = "SELECT `hide_time` 
                      FROM `user` 
                     WHERE `user_id` = " . to_sql($g_user['user_id'], 'Number');
            $hide = DB::result($sql);
            if ($hide > 0) {
                $html->setvar("account_status_hidden_checked", ' checked="checked"');
            } else {
                $html->setvar("account_status_active_checked", ' checked="checked"');
            }
            $html->parse('hide_profile', false);
             $isProfileStatusParsed = true;
        }        
        if(Common::isOptionActive('delete_enabled')) {
            $html->parse("delete_profile", true);
            $isProfileStatusParsed = true;
        } 
        if ($isProfileStatusParsed) {
            $html->parse("profile_status", true);
        }
        
		parent::parseBlock($html);
	}
}

g_user_full();

$page = new CProfileSettings("", $g['tmpl']['dir_tmpl_mobile'] . "account.html");
$header = new CHeader("header", $g['tmpl']['dir_tmpl_mobile'] . "_header.html");
$page->add($header);
$footer = new CFooter("footer", $g['tmpl']['dir_tmpl_mobile'] . "_footer.html");
$page->add($footer);

$user_menu = new CUserMenu("user_menu", $g['tmpl']['dir_tmpl_mobile'] . "_user_menu.html");
$user_menu->setActive('account');
$page->add($user_menu);

include("./_include/core/main_close.php");

?>
