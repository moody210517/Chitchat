<?php
/* (C) Websplosion LTD., 2001-2014

IMPORTANT: This is a commercial software product
and any kind of using it must agree to the Websplosion's license agreement.
It can be found at http://www.chameleonsocial.com/license.doc

This notice may not be removed from the source code. */

//$area = "login";
include("./_include/core/main_start.php");
include("./_include/current/menu_section.class.php");

checkByAuth();

$cmd = get_param('cmd');
$isProfileSettingsPopup = Common::isOptionActive('profile_settings_popup', 'template_options');
if ($isProfileSettingsPopup && !$cmd) {
    Common::toHomePage();
}


class CProfileSettings extends SettingsField
{
    public $settings;
    public $responseData = null;

	function action()
	{
		global $g;
		global $l;
		global $g_user;
		$cmd = get_param('cmd');
        $ajax = get_param('ajax');

        if($cmd == 'facebook_connect') {
            Social::connect();
        }
        if($cmd == 'facebook_disconnect') {
            Social::disconnect();
        }
		if ($cmd == "mail")
		{

            $this->save($_POST);
            if ($ajax) {
                $this->responseData = 'save';
                if (get_param_int('get_title')) {
                    $this->responseData = array('title' => l('alert_success'), 'msg' => l('changes_saved'));
                }
            } else {
                if(Common::isMobile(false)) {
                    if(isset($_POST['framework_version']) && $_POST['framework_version'] != '2' && $_POST['framework_version'] != 'Y')
                        redirect(Common::urlSite() . MOBILE_VERSION_DIR . '/profile_settings.php');
                    else
                        redirect('');
                } else {
                    redirect('');
                }
            }
		}
        if ($cmd == "setavatar")
		{
            User::setAvatar(get_param("avatar", 0));
            if ($ajax) {
                die();
            }
        }

        if ($cmd == 'update_email')
		{
            $this->responseData = '';
            $newEmail = trim(get_param('new_email'));
            $password = get_param('password');
            if (md5($password) != $g_user['password'] && $password != $g_user['password']){
				$this->responseData = "<span class='password_error'>" . l('current_password_incorrect') . "</span>";
			}
            $errorEmail = User::validateEmail($newEmail);
            if ($errorEmail != '') {
                $this->responseData .= "<span class='email_new_error'>" . $errorEmail . "</span>";
            } elseif ($newEmail == $g_user['mail']) {
                $this->responseData .= "<span class='email_new_error'>" . l('the_new_email_matches_the_current') . "</span>";
            }
            if($this->responseData==''){
                user_change_email($g_user['user_id'], $newEmail, 'change_email');
            }
        } elseif($cmd == 'profile_delete' || $cmd == 'check_password') {
            $this->responseData = '';
            $password = get_param('password');
            if (md5($password) != $g_user['password'] && $password != $g_user['password']){
				$this->responseData = "<error>" . l('current_password_incorrect') . "</error>";
			}
            if ($this->responseData == '' && $cmd == 'profile_delete') {
                if (IS_DEMO && is_demo_user()) {
                    $this->responseData = 'demo';
                } else {
                    User::delete($g_user['user_id'], '');
                    set_session('user_profile_delete_alert', true);
                    $this->responseData = 'delete';
                }
            }
            if ($this->responseData == '' && $cmd == 'check_password') {
                $this->responseData = 'check';
            }

        }

		if ($cmd == 'password')
		{
			$this->password_message = '';
            $this->responseData = '';
            $newPass = get_param('new_password');
            $oldPass = get_param('old_password');

			if (md5($oldPass) != $g_user['password'] && $oldPass != $g_user['password']){
				$this->password_message .= l('old_password_incorrect') . '<br>';
                $this->responseData .= "<span class='old_password_error'>" . l('old_password_incorrect') . '</span>';
			}

			if ($newPass != get_param('verify_new_password')){
				$this->password_message .= l('passwords_not_same') . '<br>';
                $this->responseData .= "<span class='ver_password_error'>" . l('passwords_not_same') . '</span>';
			}

            $msg = User::validatePassword($newPass);
            $this->password_message .= $msg;

            if ($msg!= '') {
                $this->responseData .= "<span class='new_password_error'>" . $msg . '</span>';
            }

			if ((!IS_DEMO || !is_demo_user()) && $this->password_message == '') {
					DB::execute("
						UPDATE user SET
						password=" . to_sql(Common::isOptionActive('md5') ? md5($newPass) : $newPass) . "
						WHERE user_id=" . $g_user['user_id'] . "
					");
                    $this->save = true;
			}

		}

		if ($cmd == 'hide') {
            $sql = "UPDATE `user`
                       SET `hide_time` = " . to_sql(Common::getOption('hide_time'),'Number')
                 . " WHERE `user_id` = " . to_sql(guid(), 'Number');
			DB::execute($sql);
            redirect('');
		}elseif ($cmd == 'active') {
            $sql = "UPDATE `user`
                       SET `hide_time` = 0
                     WHERE `user_id` = " . to_sql(guid(), 'Number');
			DB::execute($sql);
            redirect('');
		}

        if($cmd == 'delete_audio_greeting') {
            AudioGreeting::delete();
            redirect();
        }
	}
	function parseBlock(&$html)
	{
		global $l;
		global $g;
		global $g_user;

        Social::parseSettings($html);
		if (isset($this->password_message)) $html->setvar("password_message", $this->password_message);

        $html->setvar('is_allow_invisible_mode', intval(User::isAllowedInvisibleMode()));
        $block = 'sp_active';
        if ($html->blockexists($block)
            && !Common::isOptionActive('free_site')
            && User::isSuperPowers() && !User::isFreeAccess()) {
            $vars = array('data' => User::getWhatDateActiveSuperPowers());
            $html->setvar($block . '_till', lSetVarsCascade('super_powers_active', $vars));
            $html->parse($block);
        }

        $block = 'timezone';
        if ($html->blockexists($block) && Common::isOptionActive('user_choose_time_zone')) {
            if( Common::getOption('set', 'template_options') == 'urban'){
                $firstItem = l('choose_a_city');
            } else {
                $firstItem = l('please_choose');
            }
            $options = TimeZone::getTimeZoneOptionsSelect($g_user['timezone'],$firstItem);
            $optionsABK = TimeZone::getTimeZoneOptionsSelect($g_user['timezone'],$firstItem,false);
            $time = array('time_utc' => gmdate('Y-m-d H:i:s'),
                          'time_local' => TimeZone::getDateTimeZone($g_user['timezone']));
//                    $html->setvar('info_timezone', lSetVars('info_timezone', $time));
//                    $html->parse('info_timezone', false);

            $html->setvar('selectbox_options', $options);
            $html->setvar('selectbox_options_abk', $optionsABK);

            $html->parse($block);
        }

		/*if (get_param("set_im_mail", $g_user['set_im_mail']) == 'Y') $html->setvar("im_mail_on", " checked");
		else  $html->setvar("im_mail_off", " checked");

		if (get_param("set_im_popup", $g_user['set_im_popup']) == 'Y') $html->setvar("im_popup_on", " selected");
		else  $html->setvar("im_popup_off", " selected");*/

        $isProfileStatusParsed = false;
        if (Common::isOptionActive('hide_profile_enabled')) {
            $sql = "SELECT `hide_time`
                    FROM `user`
                    WHERE `user_id` = " . to_sql(guid(), 'Number');
            $hide = DB::result($sql);
            if ($hide > 0) {
                $html->parse("active", true);
            } else {
                $html->parse("hide", true);
            }
            $isProfileStatusParsed = true;
        }
        if(Common::isOptionActive('delete_enabled')) {
            if ($isProfileStatusParsed){
                $html->setvar('separator_profile','separator_profile');
            }
            $html->parse("delete_profile", true);
            $isProfileStatusParsed = true;
        }
        if ($isProfileStatusParsed) {
            $html->parse("profile_status", true);
        }


		if (get_param("cmd", "") == "avatar"){
			$html->setvar("chat_message", isset($l['profile_settings.php']['please_choose_avatar']) ? $l['profile_settings.php']['please_choose_avatar'] : "Please choose an avatar first.");
		}

        $avs = User::getListAvatar();
        User::setAvatar();

		for ($i = 1; $i <= (ceil(count($avs) / 2) * 2); $i++)
		{
			$html->setvar("numer", $i);
			if (isset($avs[$i]) and file_exists($g['path']['dir_main'] . "_server/chat/avatar/portrait" . $i . ".jpg"))
			{
				$html->setvar("avatar", $avs[$i]);

				if ($i % 2 == 1) $html->parse("photo_odd", true);
				else $html->setblockvar("photo_odd", "");
				if ($i % 2 == 0 and $i != (ceil(count($avs) / 2) * 2)) $html->parse("photo_even", true);
				else $html->setblockvar("photo_even", "");
				if ($i % 3 == 0 and $i != (ceil(count($avs) / 2) * 2) and $i != 0) $html->parse("photo_after3", true);
				else $html->setblockvar("photo_after3", "");
                if ($g_user['avatar'] == $avs[$i]) {
                    $html->parse("photo_item_selected", false);
                }
				$html->parse("photo_item", true);
                $html->setblockvar('photo_item_selected', '');
                $html->parse("photo", false);
			}
			else
			{
				if ($i == 1 or $i == 3) $html->parse("nophoto_odd", true);
				else $html->setblockvar("nophoto_odd", "");
				if ($i == 2) $html->parse("nophoto_even", true);
				else $html->setblockvar("nophoto_even", "");
				$html->parse("nophoto_item", true);
				$html->parse("photo", false);
			}
		}

        $maxLength = Common::getOption('password_length_max');
        $minLength = Common::getOption('password_length_min');

        $html->setvar('max_min_length_password', sprintf(toJsL('max_min_length_password'), $minLength, $maxLength));
        $html->setvar('password_length_max', $maxLength);
        $html->setvar('password_length_min', $minLength);
        //$html->setvar('current_users_email', $g_user['mail']);
		if (Common::isOptionActive('chat')) {
			$html->parse('my_chat', true);
		}
        if(isset($this->save)) {
            $html->parse('save_password');
        }

        TemplateEdge::parseColumn($html);

		parent::parseBlock($html);
	}

}

$ajax = get_param('ajax');
if ($ajax) {
    $page = new CProfileSettings('', '', '', '', true);
    $page->action(false);
    die(getResponseDataAjaxByAuth($page->responseData));
}

g_user_full();

$page = new CProfileSettings("", getPageCustomTemplate('profile_settings.html', 'profile_settings_template'));
if ($isProfileSettingsPopup && $cmd == 'pp_profile_settings_editor') {
    die(getResponsePageAjaxByAuth(guid(), $page));
}

$header = new CHeader("header", $g['tmpl']['dir_tmpl_main'] . "_header.html");
$page->add($header);
$footer = new CFooter("footer", $g['tmpl']['dir_tmpl_main'] . "_footer.html");
$page->add($footer);


if (Common::isAllowedModuleTemplate('profile_settings_with_editor_main')) {
    $profileEditor = new CProfileEditMain('profile_edit_main',  $g['tmpl']['dir_tmpl_main'] . "_profile_edit_main.html", false, false, false, 'birthday');
    $page->add($profileEditor);

    if (UserFields::isActiveAboutMe()) {
        $profileEditorAbout = new CProfileEditMain('profile_edit_about', $g['tmpl']['dir_tmpl_main'] . "_profile_edit_about.html", false, false, false, 'profile_about_urban', guid());
        $profileEditorAbout::$nameCustomField = 'about_me';
        $profileEditorAbout::$parseTextDescrption = true;
        $profileEditor->add($profileEditorAbout);
    }
}

if (Common::isParseModule('profile_menu')) {
    $profile_menu = new CMenuSection("profile_menu", $g['tmpl']['dir_tmpl_main'] . "_profile_menu.html");
    $profile_menu->setActive('settings');
    $page->add($profile_menu);
}
if (Common::isParseModule('complite')) {
    $complite = new CComplite("complite", $g['tmpl']['dir_tmpl_main'] . "_complite.html");
    $page->add($complite);
}
if (Common::isParseModule('profile_colum_narrow')) {
    $column_narrow = new CProfileNarowBox('profile_column_narrow', $g['tmpl']['dir_tmpl_main'] . '_profile_column_narrow.html');
    $page->add($column_narrow);
}

include("./_include/core/main_close.php");