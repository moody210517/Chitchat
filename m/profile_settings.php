<?php

/* (C) Websplosion LTD., 2001-2014

IMPORTANT: This is a commercial software product
and any kind of using it must agree to the Websplosion's license agreement.
It can be found at http://www.chameleonsocial.com/license.doc

This notice may not be removed from the source code. */

$area = "login";
include("./_include/core/pony_start.php");


$g['to_head'][] = '<link rel="stylesheet" href="' . $g['tmpl']['url_tmpl_mobile'] . 'css/profile.css" type="text/css" media="all"/>';

$display = get_param('display');
if ($display == 'invisible') {
    if (!User::isAllowedInvisibleMode()) {
        redirect('upgrade.php');
    }
}

class CProfileSettings extends SettingsField {

    public $responseData = null;

    function action()
    {
        global $g_user;

        $cmd = get_param('cmd', '');
        $isResponseAjax = get_param('ajax');
        $responseData = '';
        if ($isResponseAjax) {
            $this->responseData = 'update';
            if ($cmd == 'update') {
                $this->save($_POST);
                $responseData = l('changes_saved');
            } elseif ($cmd == 'update_email') {
                $newEmail = trim(get_param('new_email'));
                $password = get_param('password');
                if (md5($password) != $g_user['password'] && $password != $g_user['password']){
                    $responseData = "<span class='password_error'>" . l('current_password_incorrect') . "</span>";
                }
                $errorEmail = User::validateEmail($newEmail);
                if ($errorEmail != '') {
                    $errorEmail = strip_tags($errorEmail);
                    $responseData .= '<span class="new_email_error">' . $errorEmail . "</span>";
                } elseif ($newEmail == $g_user['mail']) {
                    $responseData .= '<span class="new_email_error">' . l('the_new_email_matches_the_current') . "</span>";
                }
                if($responseData == ''){
                    user_change_email($g_user['user_id'], $newEmail, 'change_email');
                    $responseData = 'update';
                }
            }elseif ($cmd == 'update_password'){
                $newPass = get_param('new_password');
                $oldPass = get_param('old_password');

                if (md5($oldPass) != $g_user['password'] && $oldPass != $g_user['password']){
                    $responseData .= '<span class="old_password_error">' . l('old_password_incorrect') . '</span>';
                }
                if ($newPass != get_param('verify_new_password')){
                    $responseData .= '<span class="ver_password_error">' . l('passwords_not_same') . '</span>';
                }

                $msg = User::validatePassword($newPass);
                if ($msg!= '') {
                    $msg = strip_tags($msg);
                    $responseData .= '<span class="new_password_error">' . $msg . '</span>';
                }

                if ((!IS_DEMO || !is_demo_user()) && $responseData == '') {
                    DB::execute("
                        UPDATE user SET
                                  password = " . to_sql(Common::isOptionActive('md5') ? md5($newPass) : $newPass) . "
                             WHERE user_id = " . $g_user['user_id'] . "
                        ");
                }

            } elseif($cmd == 'profile_delete' || $cmd == 'check_password') {
                $password = get_param('password');
                if (md5($password) != $g_user['password'] && $password != $g_user['password']){
                    $responseData = "<error>" . l('current_password_incorrect') . "</error>";
                }
                if ($responseData == '' && $cmd == 'profile_delete') {
                    if (IS_DEMO && is_demo_user()) {
                        $responseData = 'demo';
                    } else {
                        User::delete($g_user['user_id'], '');
                        $responseData = 'delete';
                    }
                }
                if ($responseData == '' && $cmd == 'check_password') {
                    $responseData = 'check';
                }
            }
            die(getResponseDataAjaxByAuth($responseData));

        }

        if ($cmd == 'update') {
            $this->save($_POST);
            if(Common::isOptionActive('frameworks_version') && isset($_POST['framework_version']) && $_POST['framework_version'] != 'N' && $_POST['framework_version'] != '1')
                redirect('../profile_settings.php');
            else
                redirect('');
            Common::mobileRedirect();
        }
    }

    function parseBlock(&$html)
    {
        global $l;
        global $g;
        global $g_user;

        $isSp = User::isSuperPowers()*1;
        $html->setvar('super_powers', $isSp);
        $block = 'sp_active';
        if ($html->blockexists($block)
            && !Common::isOptionActive('free_site')
            && $isSp && !User::isFreeAccess()) {
            $vars = array('data' => User::getWhatDateActiveSuperPowers());
            $html->setvar($block . '_till', lSetVarsCascade('super_powers_active', $vars));
            $html->parse($block);
        }

        $maxLength = Common::getOption('password_length_max');
        $minLength = Common::getOption('password_length_min');
        $html->setvar('max_min_length_password', sprintf(l('max_min_length_password'), $minLength, $maxLength));
        $html->setvar('password_length_max', $maxLength);
        $html->setvar('password_length_min', $minLength);

        $block = 'timezone';
        if ($html->blockexists($block) && Common::isOptionActive('user_choose_time_zone')) {

            $firstItem=l('please_choose');
            $options = TimeZone::getTimeZoneOptionsSelect($g_user['timezone'],$firstItem);
            $html->setvar('selectbox_options', $options);

            $html->parse($block);

        }

        $display = get_param('display');
        if ($display == '') {
            $blockMenu = 'settings_menu';
            $blockMenuInvisible = "{$blockMenu}_invisible";
            if ($html->blockExists($blockMenuInvisible)) {
                $html->parse($blockMenuInvisible);
            }
            if(Common::isOptionActive('delete_enabled')) {
                $html->parse("delete_profile", true);
            }
            $html->setvar('header_settings', l('header_settings'));
            //$html->parse($blockMenu);
            $html->parse('hide_btn_submit');

        } else {
            $html->setvar('header_settings', l('header_' . $display));
        }
        parent::parseBlock($html);
    }
}

$page = new CProfileSettings("", $g['tmpl']['dir_tmpl_mobile'] . "profile_settings.html");
$header = new CHeader("header", $g['tmpl']['dir_tmpl_mobile'] . "_header.html");
$page->add($header);
$footer = new CFooter("footer", $g['tmpl']['dir_tmpl_mobile'] . "_footer.html");
$page->add($footer);

if (Common::isParseModule('user_menu')) {
    $user_menu = new CUserMenu("user_menu", $g['tmpl']['dir_tmpl_mobile'] . "_user_menu.html");
    if (Common::getOption('set', 'template_options') != 'urban') {
        include("./_include/current/profile_menu.php");
        $profile_menu = new CProfileMenu("profile_menu", $g['tmpl']['dir_tmpl_mobile'] . "_profile_menu.html");
        $profile_menu->setActive('settings');
        $page->add($profile_menu);

        $user_menu->setActive('profile');
        $page->add($user_menu);
    } else {
        $header->add($user_menu);
    }
}

loadPageContentAjax($page);

include("./_include/core/main_close.php");