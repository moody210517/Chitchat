<?php

/* (C) Websplosion LTD., 2001-2014

IMPORTANT: This is a commercial software product
and any kind of using it must agree to the Websplosion's license agreement.
It can be found at http://www.chameleonsocial.com/license.doc

This notice may not be removed from the source code. */

Class TemplateEdge {

    static function headerParseBlock(&$html)
    {
        global $p;

        $guid = guid();

        $uid = User::getParamUid();
        $html->setvar('header_uid', $uid);
        $uidParam = User::getParamUid(0);
        $html->setvar('header_param_uid', $uidParam);

        $cmd = get_param('cmd');
        $isMobile = Common::isMobile(false);
        $isAppAndroid = Common::isAppAndroid();
        $typeUsers = 'member';
        $varsHeader = array();
        $varsFooter = array();
        $isHeader = $html->blockExists('header_visitor');
        $isFooter = $html->blockExists('footer_visitor');

        if (IS_DEMO){
            $html->parse('check_demo_iframe', false);
            $html->parse('check_demo_iframe_body', false);
        }

        if ($guid) {
            if ($isHeader) {
                $maxFileSize = Common::getOption('photo_size');
                $maxVideoSize = Common::getOption('video_size');
                $varsHeader = array(
                    'user_photo_m' => User::getPhotoDefault($guid, 'm'),
                    'photo_file_size_limit' => $maxFileSize,
                    'max_photo_file_size_limit' => lSetVars('max_file_size', array('size' => $maxFileSize), 'toJsL'),
                    'video_file_size_limit' => $maxVideoSize,
                    'max_video_file_size_limit' => lSetVars('max_file_size', array('size' => $maxVideoSize), 'toJsL'),
                    'auto_play_video' => Common::isOptionActive('video_autoplay')?'autoplay':'',
                    'body_class' => '',
                    'number_comments_frm_show' => Common::getOptionTemplateInt('gallery_number_comments_to_show_bottom_frm'),
                    'gallery_preload_data_number' => Common::getOptionTemplateInt('gallery_preload_data'),
                    'crop_min_width' => intval(trim(Common::getOption('min_photo_width_urban', 'image'))),
                    'crop_min_height' => intval(trim(Common::getOption('min_photo_height_urban', 'image'))),
                );
                if ($p == 'videochat.php') {
                    $varsHeader['body_class'] = 'body_video_chat';
                } elseif ($p == 'audiochat.php') {
                    $varsHeader['body_class'] = 'body_audio_chat';
                } elseif ($p == 'email_not_confirmed.php') {
                    $varsHeader['body_class'] = 'email_not_confirmed';
                }

                $galleryImageHeight = Common::getOptionInt('gallery_image_height_mobile', 'edge_gallery_settings');
                if ($galleryImageHeight <= 0 || $galleryImageHeight < 20) {
                    $galleryImageHeight = 20;
                } elseif ($galleryImageHeight > 100) {
                    $galleryImageHeight = 100;
                }
                $varsHeader['gallery_image_height_mobile'] = intval($galleryImageHeight);

                $isMobile = CityBase::isMobile();
                $html->setvar('city_class', $isMobile ? 'city_mobile' : 'city_desktop');

                $counter = CIm::getCountNewMessages();
                $html->setvar('number_messages', $counter);

                if ($guid != $uid) {
                    $html->setvar('is_profile_blocked', User::isEntryBlocked($guid, $uid));
                }

                if ($uid != $guid) {
                    $html->setvar('user_status_online', intval(User::isOnline($uid)));
                    $html->setvar('real_status_online', intval(User::isOnline($uid, null, true)));
                }
            }
            if ($isFooter) {
                $arrayKeys = array('comment_current', 'comment', 'comments_reply_item');
                $varsGallery = array(
                    'user_id' => $guid,
                    'user_name' => guser('name'),
                    'user_url' => User::url($guid),
                    'user_photo' => User::getPhotoDefault($guid, 'r'),
                    'like_title' => l('like'),
                    'like' => 1
                );

                foreach ($arrayKeys as $key => $value) {
                    $html->assign($value, $varsGallery);
                }
                $html->parse('comments_reply_item_likes_hide', false);
                $html->parse('comments_reply_item_delete', false);
                $html->parse('comments_reply_item', false);
                $html->parse('comments_reply_list', false);
                $html->parse('comment_likes_hide', false);
                $html->parse('comment_delete', false);

                $show = get_param('show');
                if ($show) {
                    $isParse = in_array($show, array('friend_request'));
                    if ($show == 'message') {
                        $uidSender = get_param_int('uid_sender');
                        if ($uidSender) {
                            $isParse = true;
                            $html->setvar('show_message_uid_sender', $uidSender);
                        }
                    }
                    if ($isParse) {
                        $html->parse("show_{$show}_js", false);
                    }
                }
            }

            self::parseNavbarMenuShort($html, 'menu_short_md');
            ListBlocksOrder::parseMenu($html, 'member_header_menu', 'member_header_menu', 4, 'header_menu_desktop');
            //ListBlocksOrder::parseMenu($html, 'member_header_menu', 'member_header_menu', 7, 'header_menu_mobile');
            self::parseCustomHeader($html);
            if ($p == 'city.php' && $html->blockExists('body_city')) {
				$html->parse('body_city', false);
			}

            Common::parseErrorAccessingUser($html);
        } else {
            $loginPage = $p == 'join.php' && $cmd == 'please_login';
            $typeUsers = 'visitor';
            $blHeaderParseCustom = 'header_visitor_inner';
            if ($p == 'index.php') {
                $blockInfoHeader = 'info_block_header_visitor';
                if ($html->blockExists($blockInfoHeader)) {
                    $blockInfoHeaderLeayout = Common::getOption('info_block_leayout', 'edge_main_page_settings');
                    $html->parse($blockInfoHeaderLeayout, false);
                    if (Common::isOptionActive('info_block_header_show', 'edge_main_page_settings')) {
                        $html->parse($blockInfoHeader, false);
                    }
                }
                $blHeaderParseCustom = 'header_visitor_main_page';
                $html->parse('body_main_page', false);
            }

            $settingsModule = 'edge_color_scheme_visitor';
            $mainPageBackgroundType = Common::getOption('main_page_background_type', $settingsModule);
            if($isHeader) {

                $mainPageVideoCode = '';

                if($mainPageBackgroundType == 'video') {

                    $mainPageVideoCode = Common::getOption('main_page_video_code', $settingsModule);

                    if ($mainPageVideoCode) {
                        $html->setvar('main_page_video_mute', intval(Common::isOptionActive('main_page_video_mute', $settingsModule)));
                        $html->setvar('main_page_video_volume', intval(Common::getOption('main_page_video_volume', $settingsModule)));
                        $html->setvar('main_page_video_show_video_once', intval(Common::isOptionActive('main_page_video_show_video_once', $settingsModule)));
                        $html->setvar('main_page_video_play_disabled', intval($p != 'index.php'));
                        $html->setvar('main_page_video_background_head_js_is_index_page', intval($p == 'index.php'));

                        if(Common::isOptionActive('main_page_image_darken', $settingsModule)) {
                            $html->setvar('main_page_video_background_darken', 'main_page_video_background_darken');
                        }

                        $html->parse('main_page_video_background_head_js', false);
                        $html->parse('main_page_video_background_js', false);
                        $html->parse('main_page_video_background', false);
                    }

                }

                if($mainPageVideoCode == '') {
                    $mainPageVideoCode = '{}';
                }
                $html->setvar('user_profile_bg_video', $mainPageVideoCode);
            }

            $prf = $p == 'index.php' ? '' : '_inner';

            if(!isset($mainPageBackgroundType) || $mainPageBackgroundType != 'video') {
                Common::parseBackgroundImage($html, 'edge_color_scheme_visitor', $prf);
            }

            if ($html->blockExists('popup_forgot_password')) {
                $html->parse('popup_forgot_password', false);
            }


            if (!$isMobile && !$loginPage) {
                if ($p == 'index.php') {
                    Social::parse($html);
                }
                $blHeaderNavbar = 'header_visitor_navbar';
                if ($html->blockExists($blHeaderNavbar)) {
                    $html->parse($blHeaderNavbar, false);
                }
            }

            if ($html->blockExists($blHeaderParseCustom)) {
                $html->parse($blHeaderParseCustom, false);
            }

            Common::parseErrorForNotLoginUserNotExist($html);
        }

        $isCheckMobileDevice = Common::isMobile(false, true, true);
        if ($isHeader) {
            $varsHeader['url_site_subfolder'] = Common::urlSiteSubfolders();
            $varsHeader['is_app_android'] = intval($isAppAndroid);
            if ($isAppAndroid && $html->blockExists('app_android_style')) {
                if (Common::getOption('lang_loaded_rtl', 'main')) {
                    $html->parse('app_android_style_rtl', false);
                }
                $html->parse('app_android_style', false);
            }

            if ($html->blockExists('app_ios_style') && Common::isAppIos()) {
                $html->parse('app_ios_style', false);
            }

            $varsHeader['user_allowed_feature'] = User::accessСheckFeatureSuperPowersGetList();

            $isPlayerNative = $isCheckMobileDevice || Common::getOption('video_player_type') == 'player_native';
            $varsHeader['is_player_native_site'] = intval($isPlayerNative);

            $html->assign('', $varsHeader);
            if ($p != 'city.php' || ($p == 'city.php' && get_param('view') != 'mobile')) {
                if ($isCheckMobileDevice) {
                    $html->parse('meta_viewport_device_dpi', false);
                }
                $html->parse('meta_viewport', false);
            }
        }

        if ($isFooter) {
            if ($varsFooter) {
                $html->assign('', $varsFooter);
            }

            if($guid) {
                if (Common::isAppIos() && Common::getAppIosApiVersion() >= 48) {
                    $html->parse('app_ios_image_editor');
                    $html->parse('app_ios_video_editor');
                }
                if (!$isCheckMobileDevice) {
                    $html->parse('sound_silence_activate', false);
                }
            }
        }

        if ($p != 'city.php') {
            CustomPage::parseMenu($html, 'bottom');

            Social::parseLinks($html);

            $blockFooterAbout = 'footer_about';
            if ($html->blockExists($blockFooterAbout)) {
                $id = CustomPage::getIdFromAlias('menu_bottom_about_us', 'bottom');
                if ($id) {
                    CustomPage::parsePage($html, $id, 'footer_about', 90);
                    if (Common::isOptionActive('contact')) {
                        $html->parse("{$blockFooterAbout}_contact", false);
                    }
                    $html->parse($blockFooterAbout, false);
                }
            }

            if ($isFooter) {
                CBanner::getBlock($html, 'footer');

                if (!$guid && ($p == 'index.php' || $p == 'join.php')) {
                    $html->assign('terms', PageInfo::getInfo('term_cond'));
                    $html->assign('priv', PageInfo::getInfo('priv_policy'));
                    $html->parse('page_info', false);
                }
            }
        }

        $parseBlocks = array('header_js' => "header_{$typeUsers}_js",
                             'header' => "header_{$typeUsers}",
                             'color_scheme_general' => 'color_scheme_general',
                             'color_scheme' => "color_scheme_{$typeUsers}",
                             'footer' => "footer_{$typeUsers}");

        foreach ($parseBlocks as $key => $block) {
            if ($html->blockExists($block)) {
                if ($key == 'color_scheme' || $key == 'color_scheme_general') {
                    $colorSchemeOptions = Config::getOptionsAll("edge_{$block}");
                    if ($block == 'color_scheme_visitor') {
                        $headerBackgroundColor = self::getHeaderBackgroundColor();
                        $colorSchemeOptions['main_page_header_background_color_inner'] = $headerBackgroundColor;
                        $value = Common::getBackgroundColorSheme('main_page_header_background', '', 'edge_color_scheme_visitor');
                        $colorSchemeOptions['main_page_header_background_color'] = $value;
                        $colorSchemeOptions['meta_theme_color'] = $headerBackgroundColor;
                    } elseif ($block == 'color_scheme_general') {
                        $colorSchemeOptions['color_online_user'] = getHex2Rgba(Common::getOption('color_1', 'edge_color_scheme_general'), Common::getOption('label_online_opacity', 'edge_color_scheme_general'));

                        $rgba = array('footer_title_orig_color', 'footer_menu_color',
                                      'footer_menu_color_hover', 'footer_text_color',
                                      'footer_btn_border_color', 'footer_btn_border_color_hover');
                        foreach ($rgba as $value) {
                            $colorSchemeOptions[$value] = getHex2Rgba(Common::getOption($value, 'edge_color_scheme_general'), Common::getOption("{$value}_opacity", 'edge_color_scheme_general'));
                        }
                    } elseif ($block == 'color_scheme_member') {
                        $colorSchemeOptions['meta_theme_color'] = $colorSchemeOptions['member_navbar_background_color'];
                    }

                    $html->assign('', $colorSchemeOptions);
                }
                $html->parse($block, false);
            }
        }

        if ($isHeader) {

            $htmlBackgroundColor = '';

            if($p == 'index.php') {
                $htmlBackgroundColor = self::getHeaderBackgroundColor();
            } elseif($p == 'city.php') {
                $htmlBackgroundColor = Common::getOption('3dcity_background_color', 'edge_color_scheme_general');
            } else {
                $htmlBackgroundColor = Common::getOption('page_content_background_color', 'edge_color_scheme_general');
            }

            $html->setvar('html_background_color', $htmlBackgroundColor);

            PWA::parseHeader($html);
        }
    }

    static function getHeaderBackgroundColor()
    {
        $mainPageHeaderBackgroundType = Common::getOption('main_page_header_background_type', 'edge_color_scheme_visitor');

        if($mainPageHeaderBackgroundType == 'color') {
            $headerBackgroundColor = Common::getOption('main_page_header_background_color', 'edge_color_scheme_visitor');
        } else {
            $gradientDirection = Common::getOption('main_page_header_background_color_direction', 'edge_color_scheme_visitor');
            if($gradientDirection == 'top' || $gradientDirection == 'left') {
                $headerBackgroundColor = Common::getOption('main_page_header_background_color_lower', 'edge_color_scheme_visitor');
            } else {
                $headerBackgroundColor = Common::getOption('main_page_header_background_color_upper', 'edge_color_scheme_visitor');
            }
        }

        return $headerBackgroundColor;
    }

    static function getUserName($row)
    {
        $vars = array('name_1' => $row['name'], 'name_2' => '', 'age' => $row['age']);
        $name = preg_replace('/(\s)+/u', ' ', $row['name']);
        if ($name) {
            $name = User::nameOneLetterFull($row['name']);
            $parts = explode(' ', $name);
            $numParts = count($parts);
            if ($numParts > 1) {
                $vars['name_2'] = $parts[$numParts - 1];
                $vars['name_1'] = str_replace($vars['name_2'], '', $name);
            }
        }
        if (User::isShowAge($row)) {
            $userName = lSetVars('edge_profile_user_name_and_age', $vars);
        } else {
            $userName = lSetVars('edge_profile_user_name', $vars);
        }
        return $userName;
    }

    static function getOptionCustomHeader()
    {
        global $p;

        if ($p == 'city.php') {
            return 'header_custom_only_navbar';
        }

        $guid = guid();
        $option = 'header_page_inner';

        $pageChecked = array(
            'profile_view.php',
            'search_results.php'
        );

        $paramGetUid = User::getParamUid(0);
        if ($paramGetUid) {
            $pageProfileList = ListBlocksOrder::getOrderItemsList('member_profile_tabs');
            $defaultProfileTab = Common::getOption('set_default_profile_tab', 'edge');
            if (isset($pageProfileList[$defaultProfileTab]['url_page'])) {
                $pageChecked = array($pageProfileList[$defaultProfileTab]['url_page']);
            }
        }

        $display = get_param('display');
        if (in_array($p, $pageChecked)) {
            if ($p == 'profile_view.php') {
                $option = 'header_profile_my';
            }elseif (($p == 'search_results.php' && $display == 'profile')
                        || $p != 'search_results.php') {
                if ($guid == $paramGetUid) {
                    $option = 'header_profile_my';
                } else {
                    $option = 'header_profile_someones';
                }
            }
        }

        return $option;
    }

    static function parseCustomHeader(&$html, $uid = null)
    {
        global $g;
        global $p;

        if (!$html->blockExists('header_custom_big')) {
            return;
        }

        if (in_array($p, array('videochat.php', 'audiochat.php', 'email_not_confirmed.php'))) {
           return;
        }

        $guid = guid();

        $option = self::getOptionCustomHeader();

        $blockHeader = Common::getOption($option, 'edge_member_settings');

        if ($blockHeader == 'header_custom_only_navbar') {
            return;
        }

        $html->setvar('type_custom_header', $blockHeader);

        if ($uid === null) {
            $uid = User::getRequestUserId('uid', $guid);
        }

        $row = User::getInfoBasic($uid);
        $blockHeaderCustom = 'header_custom';
        $infoBlock = array('uid' => $uid,
                           'user_name' => User::nameShort($row['name']),
                           'url' => User::url($uid, $row));

        $infoBlock['name'] = self::getUserName($row);

        $sizePhotoMain = Common::getOption('profile_photo_main_size', 'template_options');
        $photoMain = User::getPhotoDefault($row['user_id'], $sizePhotoMain, false, $row['gender']);
        $infoBlock['photo'] = $photoMain;

        $photoMainId = User::getPhotoDefault($row['user_id'], $sizePhotoMain, true);
        $infoBlock['photo_id'] = $photoMainId;

        $html->assign($blockHeaderCustom, $infoBlock);

        if ($option == 'header_profile_someones' && $guid != $uid) {
            if (User::isOnline($uid, $row)) {
                $html->parse('status_online_profile', false);
            }
            if (Common::isOptionActive('contact_blocking')) {
                $isEntryBlocked = intval(User::isEntryBlocked($guid, $uid));
                $blockProfileBlocked = 'profile_user_blocked_bl';
                if ($isEntryBlocked) {
                    $html->parse("{$blockProfileBlocked}_show", false);
                }
                $html->parse($blockProfileBlocked, false);
            }
        }

        if ($blockHeader == 'header_custom_big') {
            $photoMainId = User::getPhotoDefault($row['user_id'], $sizePhotoMain, true);
            if (!$photoMainId && $guid == $uid) {
                $html->parse('header_custom_empty_photo', false);
                $html->parse('header_custom_empty_photo_title', false);
            }
            $blockAdditionMenu = 'mn_circle';
            $numberItem = 6;
        } else {
            $blockAdditionMenu = 'mn_circle_small';
            $numberItem = 3;
        }

        $module = 'member_user_additional_menu';
        if ($guid != $uid) {
            $module = 'member_visited_additional_menu';
            if ($blockHeader != 'header_custom_big') {
                $module = 'member_visited_additional_menu_inner';
            }
        }
        ListBlocksOrder::parseAdditionMenu($html, $module, $blockAdditionMenu, $numberItem);

        $blockPhotosGrid = "{$blockHeader}_grid";
        $numberPhoto = 26;

        $whereSql = ' AND `hide_header` = 0';
        $profilePhoto = CProfilePhoto::preparePhotoList($row['user_id'], null, $whereSql, 26);
        $profileVideo = CProfileVideo::getVideosList('', 26, $row['user_id'], false, true, 0, $whereSql);

        /* Grid Photos */
        $i = 0;
        $profilePhoto = array_merge($profilePhoto, $profileVideo);
        shuffle($profilePhoto);

        $blockPhotosGridItem = "{$blockPhotosGrid}_item";
        $varPhotosGridItemId = "{$blockPhotosGridItem}_id";
        $varPhotosGridItemDesc = "{$blockPhotosGridItem}_desc";
        $varPhotosGridItemUrl = "{$blockPhotosGridItem}_url";
        $profilePhotoDisplay = array();
        $noPrivatePhoto = Common::isOptionActiveTemplate('no_private_photos');
        $showPrivatePhoto = false;
        if ($noPrivatePhoto) {
            $showPrivatePhoto = true;
        }
        foreach ($profilePhoto as $id => $photo) {
            if ($photo['default'] === 'Y' || ($photo['private'] === 'Y' && !$showPrivatePhoto) || $photo['visible'] !== 'Y') {
                continue;
            }
            $isVideo = isset($photo['video_id']);
            if ($isVideo) {
                $urlPhoto = $g['path']['url_files'] . $photo['src_src'];
            } else {
                $urlPhoto = $g['path']['url_files'] . $photo['src_b'];
            }
            $vars = array('id'          => $photo['photo_id'],
                          'url'         => $urlPhoto,
                          'description' => $photo['description'],
                          'info'        => json_encode($photo),
                          'video'       => intval($isVideo));
            $profilePhotoDisplay[] = $vars;
            $html->assign($blockPhotosGridItem, $vars);
            $html->parse($blockPhotosGridItem, true);
            if ($i++ == ($numberPhoto - 1)) {
                break;
            }
        }
        if ($i < $numberPhoto) {//&& false
            if ($profilePhotoDisplay) {
                $numberPhoto = 10;
                $d = $numberPhoto - count($profilePhotoDisplay);
                $j = 0;
                for ($i = 1; $i <= $d; $i++) {
                    if (!isset($profilePhotoDisplay[$j])) {
                        $j = 0;
                    }
                    $html->assign($blockPhotosGridItem, $profilePhotoDisplay[$j]);
                    $html->parse($blockPhotosGridItem, true);
                    $j++;
                }
            } else {
                for ($i = 1; $i <= $numberPhoto; $i++) {
                    $html->setvar("{$blockPhotosGridItem}_class", 'photo_upload');
                    $html->setvar("{$blockPhotosGridItem}_info", json_encode(array()));
                    $html->setvar($varPhotosGridItemId, 'empty_photo');
                    $html->setvar($varPhotosGridItemDesc, l('upload_photo_link'));
                    $html->setvar($varPhotosGridItemUrl, $g['tmpl']['url_tmpl_main'] . 'images/photo_camera.png');
                    $html->parse($blockPhotosGridItem, true);
                }
            }
        }
        if ($blockHeader == 'header_custom_small') {
            ListBlocksOrder::parseMenu($html, 'member_profile_tabs', 'profile_menu_inner_small');
        } else {
            ListBlocksOrder::parseMenu($html, 'member_profile_tabs', 'profile_menu_inner_big', 4);
        }
        /* Grid Photos */

        $html->parse($blockHeader, false);
    }

    static function isTemplateColums($showAlways = false)
    {
        global $p;

        $guid = guid();
        if ($guid) {
            $header = self::getOptionCustomHeader();
            if ($header == 'header_profile_my' || $header == 'header_profile_someones') {
                $showAlways = true;
            }
            /*$paramUid = get_param_int('uid');
            $display = get_param('display');
            if ($p == 'search_results.php' && $display == 'profile' && $guid == $paramUid){
                $guid = 1;
            }*/
        }

        return $guid && Common::isAllowedModuleTemplate('profile_column')
               && (Common::isOptionActive('show_columns_inner_pages', 'edge_member_settings')  || $showAlways)
               && !in_array($p, Common::getOptionTemplate('pages_one_column'));
    }

    static function parseColumnListImg(&$html, $uid, $type, $numColumn, $typeOrder, $blockColumnType)
    {
        global $g;

        if (!$numColumn) {
            $numColumn = 9;
        }
        $isPhotos = in_array($type, array('photos', 'photos_list_1', 'photos_list_2'));
        if ($isPhotos) {
            $list = CProfilePhoto::getPhotosList($typeOrder, false, '0, ' . $numColumn, $uid);
            $count = CProfilePhoto::getTotalPhotos($uid);
        } else {
            $list = CProfileVideo::getVideosList($typeOrder, '0, ' . $numColumn, $uid);
            $count = CProfileVideo::getTotalVideos($uid);
        }

        $isParseColumn = false;
        $blockColumn = "{$blockColumnType}_{$type}";
        $blockColumnItem = "{$blockColumn}_item";


        if (in_array($type, array('photos_list_1', 'photos_list_2', 'videos_list_1', 'videos_list_2'))) {
            $typeKey = str_replace(array('_1', '_2'), '', $type);
            $lTitle = "edge_column_{$typeKey}_{$typeOrder}_title";
            $html->setvar("{$blockColumn}_title", l($lTitle));
        } else {
            $vars = array('count' => $count);
            $lTitle = "edge_column_{$type}_title";
            if (in_array($type, array('photos', 'videos')) && guid() != $uid) {
                $lTitle = "edge_column_{$type}_title_other_user";
            }
            $html->setvar("{$blockColumn}_title", lSetVars($lTitle, $vars));
        }
        $html->setvar("{$blockColumn}_type_order", $typeOrder);

        foreach ($list as $id => $item) {
            /*if ($type == 'photos'
                    && (($item['private'] == 'Y') || ($uid == guid() && $item['default'] == 'Y') && $count > $numColumn)) {
                    continue;
            }*/
            if ($numColumn) {
                $isParseColumn = true;
                $id = $isPhotos ? $item['photo_id'] : $item['video_id'];
                $html->setvar("{$blockColumnItem}_id", $id);
                $html->setvar("{$blockColumnItem}_info", json_encode($item));
                $html->setvar("{$blockColumnItem}_user_id", $item['user_id']);
                $html->setvar("{$blockColumnItem}_desc", $item['description']);
                $urlPhoto = $g['path']['url_files'] . $item['src_s'];
                $html->setvar("{$blockColumnItem}_url", $urlPhoto);
                $html->parse($blockColumnItem, true);
            } else {
                break;
            }
            $numColumn--;
        }
        return $isParseColumn;
    }

    static function parseColumn(&$html, $uid = null, $row = null, $showAlways = false)
    {
        global $g, $p;

        if (!self::isTemplateColums($showAlways)) {
            if ($p == 'profile_settings.php') {
                $html->parse('one_column', false);
            }
            return;
        }

        $guid = guid();
        $blockColumnLeft = 'left_column';

        if ($uid === null) {
            $uid = $guid;
        }

        $html->setvar('profile_column_user_id', $uid);
        /*$param = $uid == guid() ? '' : 'uid=' . $uid;
        if ($param) {
            $param1 = $param2 = '?' . $param;
            $html->setvar('profile_column_page_param_1', $param1);
            if (!Common::isOptionActive('seo_friendly_urls')) {
                $param2 = '&' . $param;
            }
            $html->setvar('profile_column_page_param_2', $param2);
        }*/

        $isPageVids = Common::isPage('vids_list');
        $isPagePhotos = Common::isPage('photos_list');

        /* Left */
        $blocksColumnLeft = ListBlocksOrder::getOrderItemsList('member_column_left_order');
        $blockColumnLeftItem = "{$blockColumnLeft}_item";
        $blockItem = '';
        if ($isPageVids) {
            unset($blocksColumnLeft['photos']);
        } elseif ($isPagePhotos) {
            unset($blocksColumnLeft['videos']);
        }
        foreach ($blocksColumnLeft as $type => $value) {
            if ($blockItem) {
                $html->clean($blockItem);
            }
            $blockItem = '';
            if ($type == 'photos' || $type == 'videos') {
                $numColumn = Common::getOptionInt("number_{$type}_left_column", 'edge_member_settings');
                $typeOrder = Common::getOption("list_{$type}_type_order", 'edge_general_settings');
                $blockColumn = "{$blockColumnLeft}_{$type}";
                $isParse = self::parseColumnListImg($html, $uid, $type, $numColumn, $typeOrder, $blockColumnLeft);
                if (!$isParse && $uid == $guid) {
                    $html->parse("{$blockColumn}_hide", false);
                    $isParse = true;
                }
                if ($isParse) {
                    $blockItem = $blockColumn;
                }
            } elseif ($type == 'banner') {
                $blockItem = 'left_banner';
                CBanner::getBlock($html, 'left_column');
            } elseif ($type == 'custom_menu') {
                $blockItem = 'left_menu';
                CustomPage::parseMenu($html, 'left_column');
            }
            if ($blockItem) {
                $html->parse($blockItem, false);
                $html->parse($blockColumnLeftItem, true);
            }
        }
        if ($blocksColumnLeft) {
            $html->parse($blockColumnLeft, false);
        }
        /* Left */
        /* Right */
        $blocksColumnRight = ListBlocksOrder::getOrderItemsList('member_column_right_order');
        $blockColumnRight = 'right_column';
        $blockColumnRightItem = "{$blockColumnRight}_item";
        $blockItem = '';
		
        if ($row === null) {
            $row = User::getInfoFull($uid);
        }
		if(isset($row['name']))
			$userNameShort = User::nameShort($row['name']);
		else
			$userNameShort = 'none';
		
        $html->setvar('profile_column_user_name', $userNameShort);

        $parseTypeList = array('videos_list_1', 'videos_list_2', 'photos_list_1', 'photos_list_2');

        if ($isPageVids || $isPagePhotos) {
            unset($blocksColumnRight['friends']);
            unset($blocksColumnRight['friends_online']);
            unset($blocksColumnRight['profile_info']);
            if ($isPageVids) {
                unset($blocksColumnRight['photos_list_1']);
                unset($blocksColumnRight['photos_list_2']);
            } else {
                unset($blocksColumnRight['videos_list_1']);
                unset($blocksColumnRight['videos_list_2']);
            }
        } else {
            unset($blocksColumnRight['photos_list_1']);
            unset($blocksColumnRight['photos_list_2']);
            unset($blocksColumnRight['videos_list_1']);
            unset($blocksColumnRight['videos_list_2']);
        }
        foreach ($blocksColumnRight as $type => $value) {
            if ($blockItem) {
                $html->clean($blockItem);
            }
            $blockItem = '';
            if (($type == 'friends' || $type == 'friends_online') && Common::isOptionActive('friends_enabled')) {
                $blockItem = "{$blockColumnRight}_friend";
                $uidCur = $uid;
                $vars = array();
                if ($type == 'friends_online') {
                    $blockItem .= '_online';
                    $maxNumberFriends = Common::getOptionInt('number_friends_online_right_column', 'edge_member_settings');
                    $uidCur = guid();
                    $lTitle = 'edge_column_friends_online_title';
                } else {
                    $maxNumberFriends = Common::getOptionInt('number_friends_right_column', 'edge_member_settings');
                    $lTitle = 'edge_column_friends_title';
                    if (guid() != $uid) {
                        $lTitle .= '_other_user';
                    }
                }
				
                $friends = User::getListFriends($uidCur, $type == 'friends_online', $maxNumberFriends);
				
                $blockFriendItem = "{$blockItem}_item";
                $count = 0;
                if ($friends) {
                    if ($type == 'friends_online') {
                        $count = User::getNumberFriendsOnline();
                    } else {
                        $count = User::getNumberFriends($uid);
                    }
                    foreach ($friends as $key => $friend) {
                        $html->setvar("{$blockFriendItem}_user_id", $friend['user_id']);
                        $title = $friend['name'];
                        if (User::isShowAge($friend)) {
                            $title .= ', ' .  getAge($friend['birth']);
                        }
                        $html->setvar("{$blockFriendItem}_name", $title);
                        $photo = $g['path']['url_files'] .  User::getPhotoDefault($friend['user_id'], 's', false, $friend['gender']);
                        $html->setvar("{$blockFriendItem}_photo", $photo);
                        $html->setvar("{$blockFriendItem}_url", User::url($friend['user_id']));
                        if ($type == 'friends' && $uidCur == $guid) {
                            $html->parse("{$blockFriendItem}_link_im", false);
                        }

                        $html->parse($blockFriendItem, true);
                    }
                    if ($type == 'friends_online') {
                        if ($count <= $maxNumberFriends) {
                            $html->parse("{$blockItem}_more_hide", false);
                        }
                    }
                    $html->parse("{$blockItem}_show", false);
                }
                $vars['count'] = $count;
                $html->setvar("{$blockItem}_title", lSetVars($lTitle, $vars));
            } elseif (in_array($type, $parseTypeList)) {
                $numColumn = Common::getOptionInt("number_{$type}_right_column", 'edge_member_settings');
                $typeOrder = Common::getOption("{$type}_type_order", 'edge_member_settings');
                $blockColumn = "{$blockColumnRight}_{$type}";
                if (self::parseColumnListImg($html, 0, $type, $numColumn, $typeOrder, $blockColumnRight)) {
                    $blockItem = $blockColumn;
                }
            } elseif ($type == 'profile_info') {
                $blockItem = "{$blockColumnRight}_profile_info";
                $optionDate = 'profile_birth_edge';
                if (User::isShowAge($row)) {
                    $optionDate = 'profile_birth_full_edge';
                }
                $aboutMe = trim(isset($row['about_me']) ? $row['about_me'] : '');
                if (IS_DEMO && $aboutMe) {
                    preg_match_all("/.*?[.?!](?:\s|$)/s", $aboutMe, $matches);
                    if ($matches && isset($matches[0][0])) {
                        $aboutMe = $matches[0][0];
                    }
                }
				if(isset($row['gender']))
					$gender = $row['gender'];
				else
					$gender = '';
				
				if(isset($row['city']))
					$city = $row['city'];
				else
					$city = '';
				
                $info = array('city' => $city,
                              'birth_title' => l('edge_column_birth_' . $gender),
                              'birth' => isset($row['birth']) ? Common::dateFormat($row['birth'], $optionDate, false, false, false, true) : '',
                              'about_me' => $aboutMe);
                $html->assign($blockItem, $info);
                if (Common::isOptionActive('location_enabled', 'edge_join_page_settings')) {
                    if ($city == '') {
                        $html->parse("{$blockItem}_location_hide", false);
                    }
                    $html->parse("{$blockItem}_location", false);
                }
                if (UserFields::isActive('orientation')) {
                    $html->cond($gender == 'M', "{$blockItem}_gender_m", "{$blockItem}_gender_f");
                    $html->parse("{$blockItem}_gender", false);
                }
                if (UserFields::isActiveAboutMe()) {
                    if ($aboutMe) {
                        $html->parse("{$blockItem}_about_me_show", false);
                    }
                }
            } elseif ($type == 'banner') {
                $blockItem = 'right_banner';
                CBanner::getBlock($html, 'right_column');
            } elseif ($type == 'send_message' && $uid != $guid) {
                $blockItem = "{$blockColumnRight}_send_message";
            } elseif ($type == 'friend_add' && $uid != $guid) {
                $blockItem = "{$blockColumnRight}_friend_add";
                $icon = 'fa-user-times';
                $title = l('unfriend');
                $cmd = 'remove';
                $uidReqiest = 0;
                $isHideBtn = User::isFriend($uid, $guid);
                if (!$isHideBtn) {
                    $title = l('add_to_friends');
                    $icon = 'fa-user-plus';
                    $cmd = 'request';
                    $uidReqiest = User::isFriendRequestExists($uid, $guid);
                    if ($uidReqiest) {
                        $icon = 'fa-user-times';
                        $title = l('approve_request');
                        $cmd = 'approve';
                        if ($uidReqiest == $guid) {
                            $icon = 'fa-user-times';
                            $title = l('remove_request');
                            $cmd = 'remove';
                            $isHideBtn = true;
                        }
                    }
                }
                $vars = array('user_id'   => $uid,
                              'user_name' => $userNameShort,
                              'icon'      => $icon,
                              'title'     => $title,
                              'cmd'       => $cmd,
                              'param'     => $uidReqiest
                );
                $html->assign($blockItem, $vars);
                if ($isHideBtn) {
                    $html->parse("{$blockItem}_hide", false);
                }
            } elseif ($type == 'user_menu' && $uid != $guid) {
                $blockItem = "{$blockColumnRight}_user_menu";
                ListBlocksOrder::parseMenu($html, 'member_visited_right_column_menu', 'right_column_user_menu');
            } elseif ($type == 'custom_menu') {
                $blockItem = 'right_menu';
                CustomPage::parseMenu($html, 'right_column');
            } elseif ($type == 'credits') {
				$blockItem = "{$blockColumnRight}_friend";				
			}
            
			if ($blockItem) {
                $html->parse($blockItem, false);
                $html->parse($blockColumnRightItem, true);
            }
        }
        if ($blocksColumnRight) {
            $html->parse($blockColumnRight, false);
        }
        /* Right */
    }

    static function indexParseBlock(&$html)
    {
        global $g;

        $mainPageBlock = 'main_page';
        $mainPageBlocks = ListBlocksOrder::getOrderItemsList('main_page_block_order');
        $blockItems = '';
        foreach($mainPageBlocks as $k => $active){
            if ($blockItems) {
                $html->clean($blockItems);
            }
            $blockItems = "{$mainPageBlock}_{$k}";
            $blockItem = "{$blockItems}_item";
            if ($k == 'list_people') {
                $blockItems = self::parseListUsersMainPage($html);
            } elseif ($k == 'list_blog_posts') {
                $blockItems = self::parseListBlogsMainPage($html);
            } elseif ($k == 'list_videos') {
                $blockItems = self::parseListVideosMainPage($html);
            }  elseif ($k == 'list_photos') {
                $blockItems = self::parseListPhotosMainPage($html);
            } elseif ($k == 'log_in') {
                Social::parse($html, 'log_in_social');
            } elseif ($k == 'register_now') {
                $registerFrm = new CJoinForm('register_frm', null, false, false, true);
                $registerFrm->parseBlock($html);
            } elseif ($k == 'our_app') {
                $blockBtn = 'btn_download_app_bottom';
                $isParse = Common::parseMobileBtnDownloadApp($html, "{$blockBtn}_item");
                if ($isParse){
                    $html->parse($blockBtn, false);
                } else {
                    $isParse = Common::parseBtnDownloadApp($html, 'bottom', array('ios' => 'apple'));
                }
                if (!$isParse) {
                    $blockItems = '';
                }
            } elseif ($k == 'info_block') {
                $id = CustomPage::getIdFromAlias('social_network_info', 'not_in_menu');
                if ($id) {
                    CustomPage::parsePage($html, $id);
                } else {
                    $blockItems = '';
                }
            }
            if ($blockItems) {
                $isBrowseBtn = Common::isOptionActive("{$k}_browse_btn", 'edge_main_page_settings');
                if ($isBrowseBtn) {
                    $html->parse("{$blockItems}_browse_btn", false);
                }
                $html->parse($blockItems, false);
            }

            $html->parse("{$mainPageBlock}_items", true);
        }
        if ($mainPageBlocks) {
            $html->parse($mainPageBlock, false);
        }
    }

    static function parseListBlogsMainPage(&$html)
    {
        include('./_include/current/blogs/tools.php');
        $numberPosts = Common::getOptionInt('list_blog_posts_number_items', 'edge_main_page_settings');
        $limit = '0,' . $numberPosts;
        $typeOrder = Common::getOption('list_blog_posts_type_order', 'edge_main_page_settings');
        return self::parseListBlogs($html, $typeOrder, $limit, 'main_page_list_blog_posts');
    }

    static function getOptionList($param)
    {
        global $p;

        $module = 'edge_general_settings';
        if ($p == 'index.php') {
            $module = 'edge_main_page_settings';
        }

        return Common::getOption($param, $module);
    }

    static function parseListBlogs(&$html, $typeOrder, $limit, $blockItems)
    {
        global $p;

        $postDisplayType = self::getOptionList('list_blog_posts_display_type');
        $rows = CBlogsTools::getListBlogs($limit, $typeOrder);
        $numberRow = intval(self::getOptionList('list_blog_posts_number_row'));

        if ($rows) {
            $i = 1;
            foreach ($rows as $row) {
                self::parseBlogPost($html, $row, $numberRow, $postDisplayType, $i);
                $i++;
            }
            $html->parse("list_blogs_{$postDisplayType}");
        } else {
            $blockItems = '';
        }

        return $blockItems;
    }


    static function parseBlogPost(&$html, $row, $numberRow, $postDisplayType, $i)
    {
        $blockItem = 'list_blog_posts_item';
        $blockItemType = "{$blockItem}_{$postDisplayType}";
        if ($html->blockExists($blockItemType)) {
            global $g;

            $image = explode('|', $row['images']);
            if ($image) {
                $image = CBlogsTools::getImg($row['id'], $image[0], 's');
            }
            if ($image) {
                $html->clean("{$blockItemType}_image_placeholder");
            } else {
                $image = $g['tmpl']['url_tmpl_main'] . 'images/blogs_placeholder.svg';
                $html->parse("{$blockItemType}_image_placeholder", false);
            }
            $uid = $row['user_id'];
            $subject = trim($row['subject']);
            if (!$subject) {
                $subject = neat_trim($row['text_short'], 55, '');
            }
            $info = array('number_row'     => $numberRow,
                          'id'             => $row['id'],
                          'user_name'      => User::nameOneLetterFull($row['name']),
                          'user_url'       => User::url($uid, $row['user_info']),
                          'user_city'      => $row['city'] ? l($row['city']) : l($row['country']),
                          'image'          => $image,
                          'subject'        => $subject,
                          'count_comments' => $row['count_comments'],
                          'text'           => $row['text_short'],
                          'time_ago'       => timeAgo($row['dt'], 'now', 'string', 60, 'second'),
                          'date'           => Common::dateFormat($row['dt'], 'list_blogs_info_plain_edge')
                    );
            $html->assign($blockItem, $info);
            if (get_param('ajax')) {
                $html->parse("{$blockItemType}_hide", false);
            }
            if ($postDisplayType == 'info') {
                $html->subcond(User::isOnline($uid), "{$blockItemType}_online");
            } elseif ($postDisplayType == 'info_big') {
                $html->subcond($i%2 == 0, "{$blockItemType}_right");
            }
            $html->parse($blockItemType);
        }
    }

    static function countPostsByUser($uid)
	{
        return DB::count('blogs_post', 'user_id=' . to_sql($uid));
    }

    static function parseListVideosMainPage(&$html)
    {
        $numberPosts = Common::getOptionInt('list_videos_number_items', 'edge_main_page_settings');
        $limit = '0,' . $numberPosts;
        $typeOrder = Common::getOption('list_videos_type_order', 'edge_main_page_settings');
        return self::parseListVideos($html, $typeOrder, $limit, 'main_page_list_videos');
    }

    static function parseListVideos(&$html, $typeOrder, $limit, $blockItems)
    {
        global $p;

        $postDisplayType = 'info';

        $rows = CProfileVideo::getVideosList($typeOrder, $limit, null, guid());
        $numberRow = intval(self::getOptionList('list_videos_number_row'));
        $html->parse("list_video_{$postDisplayType}");

        if ($rows) {
            foreach ($rows as $row) {
                self::parseVideo($html, $row, $numberRow, $postDisplayType);
            }
        } else {
            $blockItems = '';
        }

        return $blockItems;
    }


    static function parseVideo(&$html, $row, $numberRow, $postDisplayType)
    {
        $blockItem = 'list_video_item';
        $blockItemType = "{$blockItem}_{$postDisplayType}";
        if ($html->blockExists($blockItemType)) {
            global $g;
            $uidParam = User::getParamUid(0);
            $uid = $row['user_id'];
            $guid = guid();
            $info = array('number_row'     => $numberRow,
                          'id'             => $row['video_id'],
                          'video_id'       => 'v_' . $row['video_id'],
                          'user_id'        => $row['user_id'],
                          'user_name'      => User::nameOneLetterFull($row['name']),
                          'user_url'       => User::url($uid, $row['user_info']),
                          'user_city'      => $row['city'] ? l($row['city']) : l($row['country']),
                          'image'          => $g['path']['url_files'] . $row['src_src'],
                          'src'            => $g['path']['url_files'] . $row['src_v'],
                          'subject'        => $row['subject'],
                          'count_comments' => $row['count_comments'],
                          'text'           => $row['description'],
                          'time_ago'       => $row['time_ago'],
                          'info'           => json_encode($row),
                          'tags'           => $row['tags_html'],
                          'hide_header'     => $row['hide_header'] ? l('picture_add_in_header') : l('picture_remove_from_header'),
                          'hide_header_icon'=> $row['hide_header'] ? 'fa-plus-square' : 'fa-minus-square'
                    );
            $html->assign($blockItem, $info);
            if (guid()) {
                $html->parse('set_video_data', false);
            }
            $html->subcond($row['tags_html'], "{$blockItemType}_tags");

            $html->subcond(CProfilePhoto::isVideoOnVerification(0, $row['visible']), "{$blockItemType}_not_checked");

            if (!$uidParam) {
                $html->subcond(User::isOnline($uid), "{$blockItemType}_online");
                $html->subcond(!$uidParam, "{$blockItemType}_name");
            }
            $html->subcond($row['subject'], "{$blockItemType}_description");

            if($uidParam == $guid && Common::isAppIos() && Common::getAppIosApiVersion() >= 48) {
                $html->parse('app_ios_video_editor', false);
            }

            if ($uidParam && $uidParam == $guid && $row['user_id'] == $guid) {
                if (Common::isOptionActive('gallery_show_download_original', 'edge_gallery_settings')) {
                    $html->parse("{$blockItemType}_link_download", false);
                }
                $html->parse("{$blockItemType}_menu", false);
            } else {
                $html->clean("{$blockItemType}_menu");
            }

            //$html->subcond($uidParam && $uidParam == $guid && $uid == $guid, "{$blockItemType}_menu");

            if (get_param('ajax')) {
                $html->parse("{$blockItemType}_hide", false);
            }
            $html->parse($blockItemType);
        }
    }

    static function parseListUsersMainPage(&$html, $blockItems = 'main_page_list_people')
    {
        $typeOrder = Common::getOption('list_people_type_order', 'edge_main_page_settings');
        $profileDisplayType = Common::getOption('list_people_display_type', 'edge_main_page_settings');
        $numberUsers = Common::getOptionInt('list_people_number_users', 'edge_main_page_settings');
        $numberRow = Common::getOptionInt('list_people_number_row', 'edge_main_page_settings');
        $rows = User::listUsers($typeOrder, $numberUsers);
        if ($rows) {
            foreach ($rows as $row) {
                self::parseUser($html, $row, $numberRow, $profileDisplayType);
                $html->parse('users_list_item');
            }
            $html->parse("{$blockItems}_{$profileDisplayType}");
        } else {
            $blockItems = '';
        }

        return $blockItems;
    }

    static function parseUser(&$html, $row, $numberRow, $profileDisplayType, $blockItem = 'users_list_item')
    {
        if ($html->blockExists($blockItem)) {
            global $p;

            $display = get_param('display');
            $paramsLink = array();
            if ($p == 'search_results.php' && !$display) {
                $paramsLink = array('ref' => 'people_nearby',
                                    'ref_offset' => get_param('offset', 1));
            }

            $infoProfile = '';
            $delimiter = '';
            if (Common::isOptionActive('location_enabled', 'edge_join_page_settings')) {
                $infoProfile .= $row['city'] ? l($row['city']) : '';
                $delimiter = ', ';
            }
            if (User::isShowAge($row)) {
                $infoProfile .= $delimiter .  $row['age'];
            }
            $info = array('number_row' => $numberRow,
                          'user_id'    => $row['user_id'],
                          'url_profile' => User::url($row['user_id'], $row),
                          'url_profile_params' => http_build_query($paramsLink),
                          'name'       => User::nameOneLetterFull($row['name']),
                          //'age'        => $age,
                          //'city'       => l($row['city']),
                          'photo'      => ubmphoto($row['user_id']),
                          'info_profile' => $infoProfile
                    );

            if (isset($row['last_visit_date'])) {
                $row['last_visit'] = $row['last_visit_date'];
            }
            $isOnline = User::isOnline($row['user_id'], $row);

            if ($profileDisplayType == 'info') {
                $lastVisitTitle = l('online_now');
                if (!$isOnline) {
                    $lastVisitTitle = timeAgo($row['last_visit'], 'now', 'string', 60, 'second');
                }
                $info['last_visit'] = $lastVisitTitle;
                if (UserFields::isActiveAboutMe()) {
                    $rowInfo = User::getInfoFull($row['user_id'], DB_MAX_INDEX);
                    $info['about_title'] = neat_trim($rowInfo['about_me'],100);
                }
            }
            $html->assign($blockItem, $info);

            if ($profileDisplayType == 'info') {
                if (isset($info['about_title'])) {
                    $html->parse("{$blockItem}_about", false);
                }
            } else {
                if ($isOnline) {
                    $html->parse("{$blockItem}_online", false);
                }
            }
            $html->parse("{$blockItem}_{$profileDisplayType}", false);
        }
    }

    static function parseListPhotosMainPage(&$html, $blockItems = 'main_page_list_photos')
    {
        $typeOrder = Common::getOption('list_photos_type_order', 'edge_main_page_settings');
        $layoutType = str_replace('layout_photos_', '', Common::getOption('list_photos_display_type', 'edge_main_page_settings'));
        $numberRow = Common::getOptionInt('list_photos_number_row', 'edge_main_page_settings');
        $numberItems = Common::getOptionInt('list_photos_number_items', 'edge_main_page_settings');
        if ($layoutType == 'small') {
            $numberItems = 4;
        }
        $limit = '0,' . $numberItems;
        $rows = CProfilePhoto::getPhotosList($typeOrder, true, $limit);
        if ($layoutType == 'small' && count($rows) < 4) {
            $layoutType = 'default';
        }
        if ($rows) {
            if ($layoutType == 'small') {
                global $g;
                $blockItem = '';
                $i = 0;
                foreach ($rows as $row) {
                    if ($blockItem) {
                        $html->clean($blockItem);
                    }
                    $info = array('photo_id'  => $row['photo_id'],
                                  'src'       => $g['path']['url_files'] . $row['src_bm'],
                                  'user_name' => User::nameOneLetterFull($row['user_name']),
                                  'user_url'  => User::url($row['user_id'])
                    );

                    $blockItem = 'list_photos_item_' . $i;
                    $html->assign($blockItem, $info);
                    $html->subcond(User::isOnline($row['user_id']), "{$blockItem}_online");

                    $i++;
                    if ($i == 4) {
                        break;
                    }
                }
                $html->parse('list_photos_item_small', false);
            } else {
                foreach ($rows as $row) {
                    self::parsePhoto($html, $row, $numberRow, $layoutType);
                }
            }
            $html->parse("list_photos_{$layoutType}", false);
        } else {
            $blockItems = '';
        }

        return $blockItems;
    }

    static function parseListPhotos(&$html, $typeOrder, $limit)
    {
        $layoutType = 'default';
        $rows = CProfilePhoto::getPhotosList($typeOrder, false, $limit);
        $numberRow = intval(self::getOptionList('list_photos_number_row'));

        if ($rows) {
            foreach ($rows as $row) {
                self::parsePhoto($html, $row, $numberRow, $layoutType);
            }
        }
        $html->parse('list_photos_default');

        return $rows;
    }

    static function parsePhoto(&$html, $row, $numberRow, $layoutType)
    {
        global $g;

        $blockItem = 'list_photos_item';
        $blockItemType = "{$blockItem}_{$layoutType}";
        if ($html->blockExists($blockItemType)) {
            global $g;
            $guid = guid();
            $uidParam = User::getParamUid(0);
            $info = array('number_row' => $numberRow,
                          'photo_id'   => $row['photo_id'],
                          'src'        => $g['path']['url_files'] . $row['src_bm'],
                          'user_id'    => $row['user_id'],
                          'user_name'  => User::nameOneLetterFull($row['user_name']),
                          'user_url'   => $row['user_url'],
                          'info'       => json_encode($row),
                          'time_ago'   => $row['time_ago'], //timeAgo($row['date'], 'now', 'string', 60, 'second'),
                          'comments_count'  => $row['comments_count'],
                          'tags'            => $row['tags_html'],
                          'description'     => $row['description'],
                          'hide_header'     => $row['hide_header'] ? l('picture_add_in_header') : l('picture_remove_from_header'),
                          'hide_header_icon'=> $row['hide_header'] ? 'fa-plus-square' : 'fa-minus-square'
                    );
            $html->assign($blockItem, $info);
            if (guid()) {
                $html->parse('set_photo_data', false);
            }
            $html->subcond($row['tags_html'], "{$blockItemType}_tags");

            $html->subcond(CProfilePhoto::isPhotoOnVerification($row['visible']), "{$blockItemType}_not_checked");

            if (!$uidParam) {
                $html->subcond(User::isOnline($row['user_id']), "{$blockItemType}_online");
                $html->subcond(!$uidParam, "{$blockItemType}_name");
            }
            $html->subcond($row['description'], "{$blockItemType}_description");

            if ($uidParam == $guid && Common::isAppIos() && Common::getAppIosApiVersion() >= 48) {
                $html->parse('app_ios_image_editor', false);
            }

            if ($uidParam && $uidParam == $guid && $row['user_id'] == $guid) {
                if (Common::isOptionActive('gallery_show_download_original', 'edge_gallery_settings')) {
                    $html->parse("{$blockItemType}_link_download", false);
                }
                $html->subcond($row['default'] == 'Y', "{$blockItemType}_profile_pic");
                $html->parse("{$blockItemType}_menu", false);
            } else {
                $html->clean("{$blockItemType}_menu");
            }

            //$html->subcond($uidParam && $uidParam == $guid && $row['user_id'] == $guid, "{$blockItemType}_menu");

            if (get_param('ajax')) {
                $html->parse("{$blockItemType}_hide", false);
            }
            $html->parse($blockItemType);
        }
    }


    static function getFriendsPending($where = '', $order = 'DESC',  $ajax = false)
    {
        global $g;

        $sql = "SELECT FR.*, CU.name, CU.name_seo
                  FROM `friends_requests` AS FR
                  LEFT JOIN `user` AS CU ON CU.user_id = FR.user_id
                 WHERE FR.friend_id = " . to_sql(guid()) .
                 " AND FR.accepted = 0 " . $where . " ORDER BY FR.created_at {$order}";
        $result = DB::rows($sql);
        if ($ajax) {
            $friendsPending = array();
            foreach ($result as $key => $item) {
                $urlUserPending = User::url($item['user_id'], array('name' => $item['name'], 'name_seo' => $item['name_seo']));
                $vars = array('name' => User::nameOneLetterFull($item['name']),
                              'url'  => $urlUserPending
                        );
                $title = Common::lSetLink('wants_to_add_you_to_friends', $vars);
                $friendsPending[] = array(
                    'user_id' => $item['user_id'],
                    'title'   => $title,
                    'created' => $item['created_at'],
                    'url'     => $urlUserPending,
                    'photo'   => $g['path']['url_files'] . User::getPhotoDefault($item['user_id'])
                );
            }
        } else {
            $friendsPending = $result;
        }
        return $friendsPending;
    }

    static function getListFriends($uid = null, $online = false)
    {
        if ($uid === null) {
            $uid = guid();
        }

        if ($online) {
            $count = User::getNumberFriendsOnline($uid);
            $maxNumberFriends = Common::getOptionInt('number_friends_online_right_column', 'edge_member_settings');
            $lTitle = 'edge_column_friends_online_title';
        } else {
            $count = User::getNumberFriends($uid);
            $maxNumberFriends = Common::getOptionInt('number_friends_right_column', 'edge_member_settings');
            $lTitle = 'edge_column_friends_title';
            if (guid() != $uid) {
                $lTitle .= '_other_user';
            }
            /*if ($uid != guid()){
                $userGender = User::getInfoBasic($uid, 'gender');
                $lTitle = 'edge_column_friends_someones_title_' . mb_strtolower($userGender, 'UTF-8');
            }*/
        }
        $list = User::getListFriends($uid, $online, $maxNumberFriends, true);
        $countList = count($list);
        if ($countList < $maxNumberFriends && $count > $countList) {
            $count = $countList;
        }
        $result = array('count' => $count,
                        'count_title' => lSetVars($lTitle, array('count' => $count)),
                        'max_number' => $maxNumberFriends,
                        'list' => $list);
        return $result;
    }

    static function parseNavbarMenuShort(&$html, $block)
    {
        global $g;

        if (!$html->blockExists($block)) {
            return;
        }
        $orderItemsList = ListBlocksOrder::getOrderItemsList('member_header_menu_short');
        if (!$orderItemsList) {
            return;
        }
        $guid = guid();
        $blockItem = "{$block}_item";
        $blockItemClean = '';
        foreach($orderItemsList as $k => $v){
            if ($blockItemClean) {
                $html->clean($blockItemClean);
            }
            $blockItemClean = "{$blockItem}_{$k}";
            $count = 0;
            $disabled = 0;
            if ($k == 'friends_pending') {
                if (!Common::isOptionActive('friends_enabled')) {
                    continue;
                }
                $count = User::getNumberRequestsToFriendsPending();
                $disabled = $count;
                $blockFriendsPending = 'notif_friends_pending';
                if ($count) {
                    $friendsPending = self::getFriendsPending();
                    $blockFriendsPendingItem = "{$blockFriendsPending}_item";
                    foreach ($friendsPending as $key => $item) {
                        $urlUserPending = User::url($item['user_id'], array('name' => $item['name'], 'name_seo' => $item['name_seo']));
                        $vars = array('name' => User::nameOneLetterFull($item['name']),
                                      'url'  => $urlUserPending);
                        $title = Common::lSetLink('wants_to_add_you_to_friends', $vars);
                        $vars = array('pending'    => $title,
                                      'user_id'    => $item['user_id'],
                                      'created_at' => $item['created_at'],
                                      'url'        => $urlUserPending,
                                      'photo'      => $g['path']['url_files'] . User::getPhotoDefault($item['user_id'])
                                );
                        $html->assign($blockFriendsPendingItem, $vars);
                        $html->parse($blockFriendsPendingItem, true);
                    }
                }
                $html->parse($blockFriendsPending, false);
            } elseif ($k == 'new_message') {
                $count = CIm::getCountNewMessages();
                $disabled = CIm::getCountAllMsgIm();
            } elseif ($k == 'new_events') {
                $blockEvents = 'notif_events';
                $blockEventsItem = "{$blockEvents}_item";

                $count = 0;

                $events = User::getListGlobalEvents();
                $eventsCount = count($events);
                $eventsCountAll = 0;
                if ($eventsCount) {
                    $eventsCountAll = User::getNumberGlobalEvents(true);
                    $count = User::getNumberGlobalEvents();
                }
                $disabled = $eventsCount;
                $rank = 0;
                foreach ($events as $key => $item) {
                    $html->assign($blockEventsItem, $item);
                    $html->subcond($item['new'], "{$blockEventsItem}_new");
                    $html->subcond($item['new'], "{$blockEventsItem}_menu_mark_see");
                    $html->parse($blockEventsItem, true);

                    $rank = $item['rank'];
                }
                $html->setvar("{$blockEvents}_rank", $rank);
                if ($eventsCountAll == $eventsCount) {
                    $html->parse("{$blockEvents}_hide_more", false);
                }
                $html->parse($blockEvents, false);
            }

            $html->setvar("{$k}_count", intval($count));
            $html->subcond($count, "{$blockItemClean}_count_show");
            $html->subcond(!$disabled, "{$blockItemClean}_disabled");

            $html->parse($blockItemClean, false);
            $html->parse($blockItem, true);
        }
        $html->parse($block, true);
    }

    static function updateListFriends($uid = null)
    {
        if ($uid === null) {
            $uid = guid();
        }
        $script = '<script>';
        $script .= 'clFriends.updateFriends(' . json_encode(self::getListFriends(null, true)) . ',true);';
        $script .= 'clFriends.updateFriends(' . json_encode(self::getListFriends($uid)) . ');';
        $script .= '</script>';
        return $script;
    }
}