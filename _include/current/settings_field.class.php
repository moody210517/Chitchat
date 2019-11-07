<?php
/* (C) Websplosion LTD., 2001-2014

  IMPORTANT: This is a commercial software product
  and any kind of using it must agree to the Websplosion's license agreement.
  It can be found at http://www.chameleonsocial.com/license.doc

  This notice may not be removed from the source code. */

class SettingsField extends CHtmlBlock{

    public $settings;
    private $setOptionTmpl;
    private $optionEnableDisable;

    function allowShowOption($name) {
        $hideOption = User::isSettingEnabled($name);
        return $hideOption;
    }

    function parseBlock(&$html) {

        AudioGreeting::parseProfileSettings($html);

        $this->fieldsList();
        if (is_array($this->settings)) {

            $hideOption = Common::getOption('hide_profile_settings', 'template_options');
            $notificationSettingsUrban = false;
            foreach($this->settings as $key => $item) {
                if (!self::allowShowOption($key)) {
                    continue;
                }
                if (isset($item['active']) && ($item['active'] == "Y" || $item['active'] == true)) {
                    if (!$notificationSettingsUrban && isset($item['group']) && $item['group'] == 2) {
                        $notificationSettingsUrban = true;
                    }
                    $group = isset($item['group']) ? '_' . $item['group'] : '';

                    if ($item['type'] == 'radio') {
                        $this->prepareRadio($html, $item['name'],  $item['value'], $item['default'], $item['label'], $group);
                    } elseif ($item['type'] == 'select') {
                        $this->prepareSelect($html, $item['value'], $item['default'],$item['label'], $item['name'], $item['sort'], $group);
                    } elseif ($item['type'] == 'selectLangs') {
                        $this->prepareSelectLangs($html, $item['value'], $item['default'],$item['label'], $item['name'], $item['sort'], $group);
                    }
                }

                $html->setblockvar('field_radio_item','');
                $html->setblockvar('field_select_item','');
            }

            if ($notificationSettingsUrban && $html->blockExists('notification_settings')) {
                $html->parse('notification_settings');
            }

            $isActiveInvisibleMode = Common::isActiveFeatureSuperPowers('invisible_mode');
            if ($html->blockExists('invisible_mode_settings')) {
                if (Common::isOptionActive('free_site') || !$isActiveInvisibleMode || ($isActiveInvisibleMode && User::isSuperPowers())) {
                    $html->parse('invisible_mode_settings');
                    if ($html->blockExists('invisible_mode_settings_btn')) {
                        $html->parse('invisible_mode_settings_btn');
                    }
                } elseif($html->blockExists('invisible_mode_settings_upgrade')) {
                    $html->parse('invisible_mode_settings_upgrade');
                }
            }
            if ($html->blockExists('invisible_mode')) {
                $html->parse('invisible_mode');
            }

            $display = get_param('display');
            $block = "settings_{$display}";
            if ($display && $html->blockExists($block)) {
                $html->parse($block);
            }
            if($display == '' && $this->setOptionTmpl == 'urban' && Common::isMobile()) {
                $html->parse('settings_menu');
            }
            if(Common::isOptionActive('autotranslator_enabled') && $html->blockExists('autotranslator_settings')){
               $html->parse('autotranslator_settings');
            }
            parent::parseBlock($html);
        }
    }

    public function fieldsList() {
        global $g;
        global $g_user;
        global $sitePart;
        global $sitePartParam;

        $this->setOptionTmpl = Common::getTmplSet();
        $this->optionTmplName = Common::getTmplName();
        $this->optionTmplSettingsGroup = Common::getOptionTemplate('group_profile_settings');
        $isMobile = Common::isMobile();
        if ($g['options']['select_language'] == "Y") {
            $langs = Common::listLangs($sitePart);
            if ($langs) {// && !Common::isMobile()
                $this->settings['lang'] = array(
                    'value' => $langs,
                    'sort' => TRUE,
                    'name' => 'set_language' . $sitePartParam,
                    'label' => l('select_language'),
                    'default' => Common::getOption('lang_loaded', 'main'),
                    'type' => 'selectLangs',
                    'active' => $g['options']['select_language'],
                );
                if ($this->setOptionTmpl == 'urban') {
                    $this->settings['lang']['label'] = l('interface_language');
                    $this->settings['lang']['group'] = 1;
                }
            }
        }

        if (Common::isOptionActive('color_scheme_settings', 'template_options')) {
            $scheme = Common::getOption('color_scheme', 'template_options');

            unset($scheme['custom']);
            unset($scheme['default']);
            $colorScheme = array();
            $colorScheme[''] = l('please_choose');
            foreach ($scheme as $key => $value) {
                $colorScheme[$key] = $value['title'];
            }
            $this->settings['color_scheme'] = array(
                'value' => $colorScheme,
                'sort' => FALSE,
                'name' => 'color_scheme',
                'label' => l('color_scheme_settings'),
                'default' => $g_user['color_scheme'],
                'type' => 'select',
                'active' => Common::isOptionActive('allow_users_color_scheme'),
            );
        }

        if(!$isMobile) {
            $optionEnableDisable = array(1 => l('on'), 2 => l('off'));
        } else {
            $optionEnableDisable = array(1 => l('enabled'), 2 => l('disabled'));
        }
        $this->optionEnableDisable = $optionEnableDisable;

        $this->settings['set_email_mail'] = array(
            'value' => $optionEnableDisable,
            'label' => l('new_mail_alert'),
            'name' => 'new_mail_alert',
            'default' => $g_user['set_email_mail'],
            'type' => 'radio',
            'active' => Common::isOptionActive('mail') && Common::isEnabledAutoMail('mail_message'),
        );

        if (!$isMobile) {
            $setEmailInterest = array(
                'value' => $optionEnableDisable,
                'name' => 'interest_alert_options',
                'label' => l('show_interest_alert'),
                'default' => $g_user['set_email_interest'],
                'type' => 'radio',
                'active' => Common::isOptionActive('wink') && Common::isEnabledAutoMail('interest'),
            );
            if ($this->setOptionTmpl != 'urban') {
                $this->settings['set_email_interest'] = $setEmailInterest;
            }
        }

        $wallLikeCommentAlert = array(
            'value' => $optionEnableDisable,
            'default' => $g_user['wall_like_comment_alert'],
            'type' => 'radio',
            'label' => l('wall_like_comment_alert'),
            'name' => 'wall_like_comment_alert',
            'active' => Wall::isActive() && Common::isOptionActive('wall_like_comment_alert')
                        && (Common::isEnabledAutoMail('wall_alert_message')
                            || Common::isEnabledAutoMail('wall_alert_like')
                            || Common::isEnabledAutoMail('wall_alert_comment')),
        );

        if ($this->setOptionTmpl != 'urban') {
            $this->settings['wall_like_comment_alert'] = $wallLikeCommentAlert;
        }

        $set_albums_to_see = array(
            'users' => l("All users' albums"),
            'friends' => l("My friends' albums"),
        );
        if(!$isMobile) {
            $this->settings['albums_to_see'] = array(
                'value' => $set_albums_to_see,
                'default' => $g_user['albums_to_see'],
                'type' => 'select',
                'name' => 'albums_to_see',
                'label' => l('albums_to_see'),
                'sort' => false,
                'active' => Common::isOptionActive('gallery'),
            );
        }
        $set_default_online_view = array(
            'B' => l('Men and women'),
            'M' => l('Men only'),
            'F' => l('Women only'),
        );
        $sql = 'SELECT gender FROM const_orientation GROUP BY gender';
        DB::query($sql);
        if (DB::num_rows() > 1) {
            $genders = true;
        } else {
            $genders = false;
        }
        $this->settings['default_online_view'] = array(
            'value' => $set_default_online_view,
            'default' => $g_user['default_online_view'],
            'type' => 'select',
            'name' => 'default_online_view',
            'label' => l('default_online_view'),
            'sort' => false,
            'active' => $genders && Common::isOptionActive('user_choose_default_profile_view'),
        );
        if (DB::result("SELECT id FROM email WHERE mail = " . to_sql(guser('mail'), 'Text')) == 0) {
            $newsletter = 'N';
        } else {
            $newsletter = 'Y';
        }
        if(!$isMobile)
            $optionEnableDisableYN = array('Y' => l('on'), 'N' => l('off'));
        else
            $optionEnableDisableYN = array('Y' => l('enabled'), 'N' => l('disabled'));

        $newsletterOption = array(
            'value' => $optionEnableDisableYN,
            'default' => $newsletter,
            'type' => 'radio',
            'name' => 'newsletter',
            'active' => Common::isOptionActive('newsletter'),
            'label' => l('date_newsletter'),
        );
        if ($this->setOptionTmpl != 'urban') {
            $this->settings['newsletter'] = $newsletterOption;
        }

        if (get_cookie("c_user") == $g_user['name'] and get_cookie("c_password") == $g_user['password']) {

            $autologin = 'Y';
        } else {
            $autologin = 'N';
        }
        $this->settings['autologin'] = array(
            'value' => $optionEnableDisableYN,
            'default' => $autologin,
            'type' => 'radio',
            'name' => 'auto_login',
            'label' => l('auto_login'),
            'active' => true,
        );

        $matchMailOption = array(
            'value' => $optionEnableDisable,
            'default' => $g_user['match_mail'],
            'type' => 'radio',
            'name' => 'match_mail',
            'label' => l('match_mail_settings'),
            'active' => Common::isOptionActive('active', 'match_mail') && Common::isEnabledAutoMail('match_mail'),
        );
        if ($this->setOptionTmpl != 'urban') {
            $this->settings['match_mail'] = $matchMailOption;
        }

        if(!$isMobile) {
            $this->settings['smart_profile'] = array(
                'value' => $optionEnableDisable,
                'default' => $g_user['smart_profile'],
                'type' => 'radio',
                'name' => 'smart_profile',
                'label' => l('smart_profile_settings'),
                'active' => Common::isOptionActive('allow_users_profile_mode'),
            );
        }

        $wallOnlyPost = array(
            'value' => $optionEnableDisable,
            'default' => $g_user['wall_only_post'],
            'type' => 'radio',
            'name' => 'wall_only_post',
            'label' => l('wall_only_post_settings'),
            'active' => !Common::isOptionActive('only_friends_wall_posts'),
        );
        if ($this->setOptionTmpl != 'urban') {
            $this->settings['wall_only_post'] = $wallOnlyPost;
        }

        if(!$isMobile) {
            $this->settings['sound'] = array(
                'value' => $optionEnableDisable,
                'default' => $g_user['sound'],
                'type' => 'radio',
                'name' => 'sound',
                'label' => lCascade(l('im_sound_settings'), array('im_sound_settings_' . $this->optionTmplName)),
                'active' => Common::isOptionActive('im'),
            );
            if (isset($this->optionTmplSettingsGroup['sound'])) {
                $this->settings['sound']['group'] = $this->optionTmplSettingsGroup['sound'];
            }
        }
        if(get_cookie('frameworks_version') == '1') {
            $Mversion = '2';
            $Dversion = 'Y';
        } else {
            $Mversion = '1';
            $Dversion = 'N';
        }
        if (countFrameworks('mobile') && countFrameworks('main')) {
            if (!$isMobile) {
                $this->settings['framework_version'] = array(
                    'value' => $optionEnableDisable,
                    'default' => $Mversion,
                    'type' => 'radio',
                    'name' => 'framework_version',
                    'label' => l('mobile_version'),
                    'active' => Common::isOptionActive('frameworks_version'),
                );
            } else {
                $this->settings['framework_version'] = array(
                    'value' => $optionEnableDisableYN,
                    'default' => $Dversion,
                    'type' => 'radio',
                    'name' => 'framework_version',
                    'label' => l('desktop_version'),
                    'active' => Common::isOptionActive('frameworks_version'),
                );
            }
        }

            $zonesArr = DateTimeZone::listIdentifiers();
            $zones=array();
            foreach($zonesArr as $v){
                $zones[$v]=$v;
            }

            if ($zones) {// && !Common::isMobile()
                $this->settings['timezone'] = array(
                    'value' => $zones,
                    'sort' => FALSE,
                    'name' => 'timezone',
                    'label' => l('users_time_zone'),
                    'default' => $g_user['timezone'],
                    'type' => 'select',
                    'active' => true,
                    'group' => -1
                );
            }


        /* URBAN */
        $setValue = array(
            'anyone' => l('anyone'),
            'members' => l('only_members'),
        );
        if ($this->allowShowOption('set_who_view_profile')) {
            $this->settings['set_who_view_profile'] = array(
                'value' => $setValue,
                'default' => $g_user['set_who_view_profile'],
                'type' => 'select',
                'name' => 'set_who_view_profile',
                'label' => l('who_can_view_your_profile'),
                'sort' => false,
                'active' => true,
                'group' => 1
            );
        }
        if ($this->allowShowOption('set_can_comment_photos')) {
            $this->settings['set_can_comment_photos'] = array(
                'value' => $setValue,
                'default' => $g_user['set_can_comment_photos'],
                'type' => 'select',
                'name' => 'set_can_comment_photos',
                'label' => l('who_can_comment_on_your_photos'),
                'sort' => false,
                'active' => true,
                'group' => 1
            );
        }

        /* Translation */
        if(Common::isOptionActive('autotranslator_enabled')){
            $langs = Common::listLangs($sitePart);

            if($langs) {
                $langsOff = explode(',', $g_user['translation_off']);

                foreach($langs as $v => $k){
                    if($g_user['lang'] != $v){
                        $enabled = 1;
                        if(in_array($v, $langsOff)){
                            $enabled = 2;
                        }
                        $this->settings['set_translation['.$v.']'] = array(
                            'value' => $optionEnableDisable,
                            'default' => $enabled,
                            'type' => 'radio',
                            'name' => 'set_translation['.$v.']',
                            'label' => $k,
                            'active' => 1,
                            'group' => 8
                        );
                    }
                }
                $this->settings['translation_off'] = array(
                    'value' => $g_user['translation_off'],
                    'default' =>'',
                    'type' => 'text',
                    'name' => 'translation_off',
                    'label' => 'translation_off',
                    'active' => 0,
                    'group' => 8
                );
            }

        }

        /* Translation */

        if ($this->allowShowOption('set_notif_new_msg') && isset($g_user['set_notif_new_msg'])) {
            $this->settings['set_notif_new_msg'] = array(
                'value' => $optionEnableDisable,
                'default' => $g_user['set_notif_new_msg'],
                'type' => 'radio',
                'name' => 'set_notif_new_msg',
                'label' => l('set_notif_new_msg'),
                'active' => Common::isEnabledAutoMail('new_message'),
                'group' => 2
            );
        }

        if (!$isMobile && $this->setOptionTmpl == 'urban') {
            $this->settings['wall_like_comment_alert'] = $wallLikeCommentAlert;
            $this->settings['wall_like_comment_alert']['label'] = l('wall_like_comment_alert_urban');
            $this->settings['wall_like_comment_alert']['group'] = 2;
        }

        if ($this->allowShowOption('set_notif_new_comments') && isset($g_user['set_notif_new_comments'])) {
            $this->settings['set_notif_new_comments'] = array(
                'value' => $optionEnableDisable,
                'default' => $g_user['set_notif_new_comments'],
                'type' => 'radio',
                'name' => 'set_notif_new_comments',
                'label' => l('set_notif_new_comments'),
                'active' => Common::isEnabledAutoMail('new_comment_photo'),
                'group' => 2
            );
        }

        if ($this->allowShowOption('set_notif_profile_visitors')) {
            $this->settings['set_notif_profile_visitors'] = array(
                'value' => $optionEnableDisable,
                'default' => $g_user['set_notif_profile_visitors'],
                'type' => 'radio',
                'name' => 'set_notif_profile_visitors',
                'label' => l('profile_visitors'),
                'active' => Common::isEnabledAutoMail('profile_visitors'),
                'group' => 2
            );
        }
        if ($this->allowShowOption('set_notif_want_to_meet_you') && isset($g_user['set_notif_want_to_meet_you'])) {
            $this->settings['set_notif_want_to_meet_you'] = array(
                'value' => $optionEnableDisable,
                'default' => $g_user['set_notif_want_to_meet_you'],
                'type' => 'radio',
                'name' => 'set_notif_want_to_meet_you',
                'label' => l('set_notif_want_to_meet_you'),
                'active' => Common::isEnabledAutoMail('want_to_meet_you'),
                'group' => 2
            );
        }

        if ($this->allowShowOption('set_notif_mutual_attraction') && isset($g_user['set_notif_mutual_attraction'])) {
            $this->settings['set_notif_mutual_attraction'] = array(
                'value' => $optionEnableDisable,
                'default' => $g_user['set_notif_mutual_attraction'],
                'type' => 'radio',
                'name' => 'set_notif_mutual_attraction',
                'label' => l('set_notif_mutual_attraction'),
                'active' => Common::isEnabledAutoMail('mutual_attraction'),
                'group' => 2
            );
        }

        if ($this->allowShowOption('set_notif_gifts')) {
            $this->settings['set_notif_gifts'] = array(
                'value' => $optionEnableDisable,
                'default' => $g_user['set_notif_gifts'],
                'type' => 'radio',
                'name' => 'set_notif_gifts',
                'label' => l('gifts'),
                'active' => Common::isEnabledAutoMail('gift'),
                'group' => 2
            );
        }
        if ($this->allowShowOption('set_notif_voted_photos')) {
            $this->settings['set_notif_voted_photos'] = array(
                'value' => $optionEnableDisable,
                'default' => $g_user['set_notif_voted_photos'],
                'type' => 'radio',
                'name' => 'set_notif_voted_photos',
                'label' => l('who_voted_on_your_photos'),
                'active' => Common::isEnabledAutoMail('voted_photo')&&Common::isOptionActive('photo_rating_enabled'),
                'group' => 2
            );
        }

        if ($this->setOptionTmpl == 'urban') {
            $this->settings['wall_only_post'] = $wallOnlyPost;
            $this->settings['wall_only_post']['label'] = l('wall_only_post_settings_urban');
            $this->settings['wall_only_post']['group'] = 1;

            if (!$isMobile) {
                $this->settings['set_email_interest'] = $setEmailInterest;
                $this->settings['set_email_interest']['label'] = l('show_interest_alert_urban');
                $this->settings['set_email_interest']['group'] = 2;
            }

            $this->settings['match_mail'] = $matchMailOption;
            $this->settings['match_mail']['label'] = l('match_mail_settings_urban');
            $this->settings['match_mail']['group'] = 2;

            $this->settings['newsletter'] = $newsletterOption;
            $this->settings['newsletter']['label'] = l('date_newsletter_urban');
            $this->settings['newsletter']['group'] = 2;
        }

        $notFree = !Common::isOptionActive('free_site');
        if ($this->allowShowOption('set_hide_my_presence')) {
            $this->settings['set_hide_my_presence'] = array(
                'value' => $optionEnableDisable,
                'default' => $g_user['set_hide_my_presence'],
                'type' => 'radio',
                'name' => 'set_hide_my_presence',
                'label' => l('hide_my_presence_from_other_users'),
                'active' => true,
                'group' => 3
            );
        }

        if ($this->allowShowOption('set_do_not_show_me_visitors')) {
            $this->settings['set_do_not_show_me_visitors'] = array(
                'value' => $optionEnableDisable,
                'default' => $g_user['set_do_not_show_me_visitors'],
                'type' => 'radio',
                'name' => 'set_do_not_show_me_visitors',
                'label' => l('dont_show_me_as_a_profile_visitor'),
                'active' => true,
                'group' => 3
            );
        }
        /* URBAN */

        if ($this->allowShowOption('set_notif_show_my_age') && Common::isOptionActive('show_age_profile', 'edge_member_settings')) {
            $this->settings['set_notif_show_my_age'] = array(
                'value' => $optionEnableDisable,
                'default' => $g_user['set_notif_show_my_age'],
                'type' => 'radio',
                'name' => 'set_notif_show_my_age',
                'label' => l('show_my_age_in_the_profile'),
                'active' => true,
                'group' => 1,
            );
        }

        $optionName = 'set_notif_push_notifications';
        if ($this->allowShowOption($optionName)) {
            $isActive = Common::isAppIos() || Common::isAppAndroid();
            $this->setOption($optionName, 'radio', $isActive, 2);
        }
    }

    function setOption($optionName, $type = 'radio', $active = true, $group = 0) {
        $this->settings[$optionName] = array(
                'value' => $this->optionEnableDisable,
                'default' => intval(guser($optionName)),
                'type' => $type,
                'name' => $optionName,
                'label' => l($optionName),
                'active' => $active,
        );
        if ($group) {
            $this->settings[$optionName]['group'] = $group;
        }
    }

    function setOptionCheckIsAllowed($optionName, $type = 'radio', $active = true, $group = 0) {
        if ($this->allowShowOption($optionName)) {
            self::setOption($optionName, $type , $active, $group);
        }
    }

    public  function save($value) {
        global $g_user;
        $this->fieldsList();
        $sql = array();
        foreach ($this->settings as $key => $item) {
            if(isset($value[$item['name']]) && isset($item['active']) && ($item['active'] == "Y" || $item['active'] == true)) {
                if($item['name'] == 'newsletter') {
                    if ($value['newsletter'] == 'Y') {
                        User::emailAdd(guser('mail'));
                    } else {
                        User::emailRemove(guser('mail'));
                    }
                } elseif($item['name'] == 'framework_version') {
                    if($value['framework_version'] != 'N' && $value['framework_version'] != '1') {
                        set_cookie("frameworks_version", "1");
                    } elseif($value['framework_version'] != '2' && $value['framework_version'] != 'Y') {
                        set_cookie('frameworks_version', "");
                    }
                }
                elseif ($item['name'] == 'auto_login') {
                    if ($value['auto_login'] == "Y") {
                        set_cookie("c_user", $g_user['name']);
                        set_cookie("c_password", $g_user['password']);
                    } else {
                        set_cookie("c_user", "");
                        set_cookie("c_password", "");
                    }
                } elseif ($item['name'] == 'sound') {
                    if ($g_user['sound'] != $value['sound'])
                        User::saveImSound($value['sound']);
                } else  {
                    if ($item['name'] == 'set_language') {
                        $lang = guser('lang');
                        if (empty($lang)) {
                            $lang = 'default';
                        }
                        if ($lang != $value['set_language']) {
                            set_session('alert_after_page_loaded', 'changes_saved');
                        }
                    }elseif ($item['name'] == 'timezone') {
                        $value['timezone']=trim($value['timezone']);
                    }
                    $sql[$key] =  $value[$item['name']];
                }
            }
        }

        if(Common::isOptionActive('autotranslator_enabled')){
            $langsOff=array();
            $setTranslation=get_param_array('set_translation');
                foreach($setTranslation as $k=>$v){
                    if($v==2){
                        $langsOff[]=$k;
                    }
            }
            $sql['translation_off']=implode(',',$langsOff);
        }

        DB::update('user',$sql,'user_id = '.guid());
    }

    public function prepareSelectLangs(&$html, $value, $default, $label, $name, $sort = false, $group) {

        foreach($value as $title => $item) {
            if($sort == true) {
                if ($title == $default) {
                    $html->setvar('selected', 'selected="selected"');
                } else {
                    $html->setvar('selected', '');
                }
                $html->setvar('value', $title);
                $html->setvar('title', $item);
            } else {
                if ($item == $default) {
                    $html->setvar('selected', 'selected="selected"');
                } else {
                    $html->setvar('selected', '');
                }
                $html->setvar('value', $item);
                $html->setvar('title', $title);
            }
            $html->parse('field_select_item' . $group);
            $html->setvar('name_select', $name);
            $html->setvar('label', $label);
           # $html->setblockvar('field_radio_item','');
        }

        $html->parse('field_select' . $group, false);
        $html->clean('field_select_item' . $group);
        $html->clean('field_radio' . $group);
        $html->parse('field' . $group);
    }

    public function prepareSelect(&$html, $value, $default, $label, $name, $sort = false, $group) {

        foreach($value as $item => $title) {
            if($sort == true) {
                if ($title == $default) {
                    $html->setvar('selected', 'selected="selected"');
                } else {
                    $html->setvar('selected', '');
                }
                $html->setvar('value',$title);
                $html->setvar('title',$item);
            } else {
                if ($item == $default) {
                    $html->setvar('selected', 'selected="selected"');
                } else {
                    $html->setvar('selected', '');
                }
                $html->setvar('value', $item);
                $html->setvar('title', $title);
            }
            $html->parse('field_select_item' . $group);
            $html->setvar('name_select', $name);
            $html->setvar('label', $label);
           # $html->setblockvar('field_radio_item','');
        }

        $html->parse('field_select' . $group, false);
        $html->clean('field_select_item' . $group);
        $html->clean('field_radio' . $group);
        $html->parse('field' . $group);
    }

    public function prepareRadio(&$html, $name, $value, $default, $label, $group) {
        foreach($value as $item => $title) {

            if(empty($default)) {
                $html->setvar('checked','checked');
                $default = $item;
            }
            elseif($item == $default) {
                $html->setvar('checked','checked');
            }
            else {
                $html->setvar('checked','');
            }
            $html->setvar('value',$item);
            $html->setvar('label',$label);
            $html->setvar('title',$title);
            $html->setvar('name_radio',$name);
            $html->parse('field_radio_item' . $group);
        }
        $html->parse('field_radio' . $group, false);
        $html->clean('field_radio_item' . $group);
        $html->clean('field_select' . $group);
        $html->parse('field' . $group);
    }
}