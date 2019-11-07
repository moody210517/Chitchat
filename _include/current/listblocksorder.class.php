<?php
class ListBlocksOrder extends CHtmlBlock {
    static $langsPage = false;
    static $module = '';
    static $tmpl = '';
    static $urlParams = '';
    static $itemsList = '';

    function action() {
        global $g, $p;

        $cmd = get_param('cmd');
        if($cmd == 'update') {
            $order = get_param('order');
            $status = get_param('status');
            if(self::$module == 'member_header_menu'){
                $status['menu_sign_out_edge'] = 1;
            }

            if (self::$module != 'member_home_page') {
                $listItems = array();
                foreach ($order as $key => $item) {
                    if(isset($status[$item])) {
                        $stat = 1;
                    } else {
                        $stat = 0;
                    }
                    $listItems[$item] = $stat;
                }
                if(Common::getOption(self::$module, self::$tmpl)){
                    Config::update(self::$tmpl, self::$module, json_encode($listItems), true);
                } else {
                    Config::add(self::$tmpl, self::$module, json_encode($listItems), 'max', 0, '', true);
                }
            }

            if (self::$module == 'member_home_page'){
                $option = 'set_home_page';
                $setHomePage = get_param($option);
                Config::update(self::$tmpl, $option, $setHomePage, true);
            } elseif (self::$module == 'member_profile_tabs') {
                $option = 'set_default_profile_tab';
                $setDefaultTab = get_param($option);
                Config::update(self::$tmpl, $option, $setDefaultTab, true);
            }

            redirect($p . '?action=saved' . self::$urlParams);
        }
    }

    static function setParam($params = array())
    {
        foreach ($params as $key => $value) {
            self::$$key = $value;
        }
    }

    static function getOrderItemsList($module, $onlyActive = true, $tmpl = null)
    {
        global $sitePart;

        $itemsList = array();
        if ($tmpl === null) {
            $tmpl = Common::getOption('name', 'template_options');
        }

        $uid = User::getParamUid();
        $guid = guid();
        if ($tmpl == 'edge') {
            if ($module == 'main_page_block_order') {
                $itemsList = array(
                    'our_app'         => 1,
                    'register_now'    => 1,
                    'log_in'          => 1,
                    //'list_blog_posts' => 1,
                    'list_people'     => 1,
                    'list_videos'     => 1,
                    'list_photos'     => 1,
                    'info_block'      => 1
                );

                if(Common::isApp()) {
                    unset($itemsList['our_app']);
                }

            } elseif ($module == 'member_column_left_order') {
                $itemsList = array(
                    'photos'      => 1,
                    'videos'      => 1,
                    'custom_menu' => 1,
                    'banner'      => 1
                );
            } elseif ($module == 'member_column_right_order') {
                $itemsList = array(
					'credits' => 1,
                    'friends_online' => 1,
                    'friends'        => 1,
                    'send_message'   => 1,
                    'friend_add'     => 1,
                    'user_menu'      => 1,
                    'profile_info'   => 1,
                    'custom_menu'    => 1,
                    'videos_list_1'  => 1,
                    'videos_list_2'  => 1,
                    'photos_list_1'  => 1,
                    'photos_list_2'  => 1,
                    'banner'         => 1
                );
            } elseif($module == 'member_header_menu' || $module == 'member_user_additional_menu') {
                $itemsList = array(
                    'menu_profile_edge'         => array(
                                                    'url' => '',
                                                    'url_real' => User::url($guid),
                                                    'icon' => 'fa-user',
                                                    'tooltip' => l('tooltip_profile')
                                                ),
                    'menu_timeline_edge'        => array(
                                                    'url' => 'wall',
                                                    'icon' => 'fa-bars',
                                                    'tooltip' => l('tooltip_timeline')
                                                ),
                    'menu_people_edge'          => array(
                                                    'url' => 'search_results',
                                                    'icon' => 'fa-search',
                                                    'tooltip' => l('tooltip_people')
                                                ),
                    /*'menu_blogs_edge'           => array(
                                                    'url' => 'blogs_list',
                                                    'icon' => 'fa-file-text-o',
                                                    'tooltip' => l('tooltip_browse_posts')
                                                    ),
                    'menu_blogs_add_edge'       => array(
                                                    'url' => 'blogs_add',
                                                    'icon' => 'fa-pencil-square-o',
                                                    'tooltip' => l('tooltip_blog_add')
                                                    ),*/
                    'menu_videos_edge'          => array(
                                                    'url' => 'vids_list',
                                                    'icon' => 'fa-film',
                                                    'tooltip' => l('tooltip_browse_videos')
                                                    ),
                    'menu_my_videos_edge'          => array(
                                                    'url' => 'user_my_vids_list',
                                                    'url_real' => Common::pageUrl('user_vids_list', $guid),
                                                    'icon' => 'fa-file-video-o',
                                                    'tooltip' => l('tooltip_browse_my_videos')
                                                    ),
                    'menu_video_add_edge'       => array(
                                                    'url' => '',
                                                    'icon' => 'fa-video-camera',
                                                    'tooltip' => l('tooltip_video_add')
                                                    ),
                    'menu_photos_edge'          => array(
                                                    'url' => 'photos_list',
                                                    'icon' => 'fa-picture-o',
                                                    'tooltip' => l('tooltip_browse_photos')
                                                    ),
                    'menu_my_photos_edge'          => array(
                                                    'url' => 'user_my_photos_list',
                                                    'url_real' => Common::pageUrl('user_photos_list', $guid),
                                                    'icon' => 'fa-file-image-o',
                                                    'tooltip' => l('tooltip_browse_my_photos')
                                                    ),
                    'menu_photo_add_edge'       => array(
                                                    'url' => '',
                                                    'icon' => 'fa-camera',
                                                    'tooltip' => l('tooltip_photo_add')
                                                    ),
                    'menu_3dcity_edge'          => array(
                                                    'url' => 'city',
                                                    'icon' => 'fa-globe',
                                                    'tooltip' => l('tooltip_3dcity')
                                                    ),
                    'menu_street_chat_edge'     => array(
                                                    'url' => 'street_chat',
                                                    'icon' => 'fa-map-marker',
                                                    'tooltip' => l('tooltip_street_chat')
                                                    ),
                    'menu_games_edge'           => array(
                                                    'url' => 'games',
                                                    'icon' => 'fa-gamepad',
                                                    'tooltip' => l('tooltip_games')
                                                    ),
                    'menu_invite_friends_by_sms_edge'  => array(
                                                    'url' => '',
                                                    'icon' => 'fa-user-plus',
                                                    'tooltip' => l('menu_invite_friends_by_sms_edge')
                                                    ),
                    'menu_friends_edge'         => array(
                                                    'url' => 'user_friends_list',
                                                    'icon' => 'fa-users',
                                                    'tooltip' => l('tooltip_browse_friends')
                                                    ),
					'menu_credits_edge'  => array(
                                                    'url' => 'increase_popularity',
                                                    'icon' => 'fa-credit-card',
                                                    'tooltip' => l('tooltip_browse_credits')
                                                    ),
					'menu_friends_online_edge'  => array(
                                                    'url' => 'my_friends_online',
                                                    'icon' => 'fa-user-circle',
                                                    'tooltip' => l('tooltip_browse_friends_online')
                                                    ),
                    'menu_users_viewed_me_edge' => array(
                                                    'url' => 'users_viewed_me',
                                                    'icon' => 'fa-user-circle-o',
                                                    'tooltip' => l('tooltip_profile_visitors')
                                                    ),
                    'menu_users_favorites_edge' => array(
                                                    'url' => 'favorite_list',
                                                    'icon' => 'fa-star',
                                                    'tooltip' => l('tooltip_users_favorites')
                                                    ),
                    'menu_settings_edge'        => array(
                                                    'url' => 'profile_settings',
                                                    'icon' => 'fa-cog',
                                                    'tooltip' => l('tooltip_settings')
                                                    ),
                    'menu_moderator_edge'       => array(
                                                    'url' => 'moderator',
                                                    'icon' => 'fa-graduation-cap',
                                                    'tooltip' => l('tooltip_moderator')
                                                    ),
                    'menu_users_blocked_edge' => array(
                                                    'url' => 'user_block_list',
                                                    'icon' => 'fa-times-circle',
                                                    'tooltip' => l('tooltip_users_blocked')
                                                    ),

                    /*'menu_groups_edge'           => array(
                                                    'url' => 'groups',
                                                    'icon' => 'fa-file-text-o',
                                                    'tooltip' => l('tooltip_groups_posts')
                                                    ),
                    'menu_my_groups_edge'           => array(
                                                    'url' => Common::pageUrl('user_vids_list', $guid),
                                                    'icon' => 'fa-file-text-o',
                                                    'tooltip' => l('tooltip_groups_posts')
                                                    ),
                    'menu_groups_add_edge'       => array(
                                                    'url' => Common::pageUrl('group_add'),
                                                    'icon' => 'fa-pencil-square-o',
                                                    'tooltip' => l('tooltip_blog_add')
                                                    ),*/


                    'menu_sign_out_edge'        => array(
                                                    'url' => '',
                                                    'icon' => 'fa-sign-out',
                                                    'tooltip' => l('tooltip_sign_out')
                                                    ),
                );

                if(((Common::getAppIosApiVersion() < 48) || ($module == 'member_user_additional_menu' || (!Common::isAppIos() && $sitePart != 'administration'))) && isset($itemsList['menu_invite_friends_by_sms_edge'])) {
                    unset($itemsList['menu_invite_friends_by_sms_edge']);
                }

                if(IS_DEMO) {
                    $edgeSetHomePage = Common::paramFromSession('edge_set_home_page');
                    if($edgeSetHomePage != '' && $edgeSetHomePage != 'off') {
                        if(isset($itemsList[$edgeSetHomePage])) {
                            $itemsList = array_merge(array($edgeSetHomePage => $itemsList[$edgeSetHomePage]), $itemsList);
                        }
                    }

                    $edgeDisablePages = Common::paramFromSession('edge_disable_pages');
                    if($edgeDisablePages != '' && $edgeDisablePages != 'off') {
                        $edgeDisablePagesList = explode(',', $edgeDisablePages);
                        foreach($edgeDisablePagesList as $edgeDisablePage) {
                            if(isset($itemsList[$edgeDisablePage])) {
                                unset($itemsList[$edgeDisablePage]);
                            }
                        }
                    }
                }

            } elseif($module == 'member_header_menu_short') {
                $itemsList = array(
                    'friends_pending' => 1,
                    'new_message'     => 1,
                    'new_events'     => 1
                );
            } elseif($module == 'member_profile_tabs') {
                $itemsList = array(
                    'menu_inner_wall_posts_edge' => array('url' => '',
                                                          'url_real'=> User::url($uid, null, null, true, true),
                                                          'tooltip' => l('tooltip_browse_posts')),
                    'menu_inner_credits_edge'     => array('url' => 'increase_popularity',
                                                          'url_page' => 'increase_popularity.php',
                                                          'tooltip' => l('tooltip_browse_credits')),
                    'menu_inner_videos_edge'     => array('url' => 'user_vids_list',
                                                          'url_page' => 'vids_list.php',
                                                          'tooltip' => l('tooltip_browse_videos')),
                    'menu_inner_photos_edge'     => array('url' => 'user_photos_list',
                                                          'url_page' => 'photos_list.php',
                                                          'tooltip' => l('tooltip_browse_photos')),
                    'menu_inner_friends_edge'    => array('url' => 'user_friends_list',
                                                          'url_page' => 'friends_list.php',
                                                          'url_empty' => 'search_results',
                                                          'tooltip' => l('tooltip_browse_friends'),
                                                          'tooltip_empty' => l('tooltip_browse_friends')),
                    //'menu_inner_blogs_edge'   => array('url' => '', 'tooltip' => l('tooltip_browse_blogs'))
                );
            } elseif($module == 'member_visited_additional_menu'
                        || $module == 'member_visited_additional_menu_inner'
                        || $module == 'member_visited_right_column_menu') {
                $itemsList = array(
                    'menu_messages_edge'  => array(
                                                'url' => '',
                                                'icon' => 'fa-comments',
                                                'tooltip' => l('tooltip_messages')
                                             ),
                    'menu_friends_add_edge'    => array(
                                                'url' => '',
                                                'icon' => 'fa-user-plus',
                                                'tooltip' => ''
                                             ),
                    'menu_videochat_edge'  => array(
                                                'url' => '',
                                                'icon' => 'fa-video-camera',
                                                'tooltip' => l('tooltip_videochat')
                                             ),
                    'menu_audiochat_edge'  => array(
                                                'url' => '',
                                                'icon' => 'fa-phone',
                                                'tooltip' => l('tooltip_audiochat')
                                             ),
                    'menu_audio_greeting_edge'  => array(
                                                'url' => '',
                                                'icon' => 'fa-microphone',
                                                'tooltip' => l('tooltip_audio_greeting'),
                                                'cmd' => AudioGreeting::getUrl($uid),
                                             ),
                    'menu_favorite_add_edge'  => array(
                                                'url' => '',
                                                'icon' => 'fa-star',
                                                'tooltip' => l('tooltip_add_favorite')
                                             ),
                    'menu_timeline_edge'  => array(
                                                'url' => '',
                                                'url_real' => User::url($uid, null, null, true, true),
                                                'icon' => 'fa-bars',
                                                'tooltip' => l('tooltip_timeline')
                                             ),
                    'menu_street_chat_edge'  => array(
                                                'url' => '',
                                                'icon' => 'fa-street-view',
                                                'tooltip' => l('tooltip_street_chat')
                                             ),
                    /*'menu_blogs_edge'     => array(
                                                'url' => 'blogs_list',
                                                'icon' => 'fa-file-text-o',
                                                'tooltip' => l('tooltip_browse_posts')
                                             ),*/
                    'menu_videos_edge'    => array(
                                                'url' => 'user_vids_list',
                                                'icon' => 'fa-file-video-o',
                                                'tooltip' => l('tooltip_browse_videos')
                                             ),
                    'menu_photos_edge'    => array(
                                                'url' => 'user_photos_list',
                                                'icon' => 'fa-file-image-o',
                                                'tooltip' => l('tooltip_browse_photos')
                                             ),
                    'menu_friends_edge'    => array(
                                                'url' => 'user_friends_list',
                                                'icon' => 'fa-users',
                                                'tooltip' => l('tooltip_browse_friends')
                                             ),
                    'menu_user_block_edge'   => array(
                                                'url' => '',
                                                'icon' => 'fa-ban',
                                                'tooltip' => l('menu_user_block_edge')
                                             ),
                    'menu_user_report_edge'   => array(
                                                'url' => '',
                                                'icon' => 'fa-exclamation-triangle',
                                                'tooltip' => l('tooltip_user_report')
                                             )
                );

                if(!AudioGreeting::isActive() || (!Common::isAdminSitePart() && !$itemsList['menu_audio_greeting_edge']['cmd'])) {
                    unset($itemsList['menu_audio_greeting_edge']);
                }

            } elseif($module == 'member_home_page') {
                $itemsList = array(
                    'menu_profile_edge'   => array('url' => '',
                                                   'url_real' => User::url($guid)),
                    'menu_timeline_edge'  => array('url' => 'wall'),
                    'menu_people_edge'    => array('url' => 'search_results'),
                    //'menu_blogs_edge'     => array('url' => 'blogs_list'),
                    'menu_videos_edge'    => array('url' => 'vids_list'),
                    'menu_photos_edge'    => array('url' => 'photos_list')
                );
            }
        }

        if ($module == 'member_user_additional_menu') {
            $itemsListTemp = array(
                'menu_messages_edge' => array(
                    'url' => '',
                    'icon' => 'fa-comments',
                    'tooltip' => l('tooltip_messages')
                )
            );

            unset($itemsList['menu_moderator_edge']);
            unset($itemsList['menu_profile_edge']);
            unset($itemsList['menu_sign_out_edge']);

            $itemsList = array_merge($itemsListTemp, $itemsList);
        }
		
        if (!Common::isOptionActive('friends_enabled')) {
            unset($itemsList['friends']);
            unset($itemsList['friends_online']);
            unset($itemsList['menu_friends_edge']);
            unset($itemsList['friends_pending']);
            unset($itemsList['menu_inner_friends_edge']);
            unset($itemsList['menu_friends_add_edge']);
            unset($itemsList['friend_add']);
        }

        if (!Common::isOptionActive('favorite_add')){
            unset($itemsList['menu_favorite_add_edge']);
            unset($itemsList['menu_users_favorites_edge']);
        }

        if (!Common::isOptionActive('contact_blocking')){
            unset($itemsList['menu_user_block_edge']);
            unset($itemsList['menu_users_blocked_edge']);
        }

        if (!Common::isOptionActive('audiochat')) {
            unset($itemsList['menu_audiochat_edge']);
        }

        if (!Common::isOptionActive('videochat')) {
            unset($itemsList['menu_videochat_edge']);
        }

        if (!Common::isModuleCityActive()) {
            unset($itemsList['menu_3dcity_edge']);
            unset($itemsList['menu_games_edge']);
        }
        if (!City::isActiveStreetChat()){
            unset($itemsList['menu_street_chat_edge']);
        }
        if (isset($itemsList['menu_user_report_edge']) && User::isReportUser($uid)) {
            unset($itemsList['menu_user_report_edge']);
        }


        if($module == 'member_header_menu') {
            if (!Moderator::checkAccess(true)) {
                unset($itemsList['menu_moderator_edge']);
            }
        } elseif ($module == 'member_visited_right_column_menu') {
            unset($itemsList['menu_messages_edge']);
        }

        self::$itemsList = $itemsList;

        $orderItems = Common::getOption($module, $tmpl);
        if ($orderItems) {
            $orderItems = json_decode($orderItems, true);
            if(!is_array($orderItems)){
                $orderItems = array();
            }
        } else {
            $orderItems = array();
        }
        $orderItemsList = array();
        foreach ($orderItems as $k => $v) {
            if (isset($itemsList[$k])){
                $value = is_array($itemsList[$k]) ? $itemsList[$k] : array();
                $value['active'] = $v;
                $orderItemsList[$k] = $value;
                unset($itemsList[$k]);
            }
        }
        foreach($itemsList as $k => $v){
            $value = is_array($v) ? $v : array();
            $value['active'] = 1;
            $orderItemsList[$k] = $value;
        }
        if ($onlyActive) {
            foreach($orderItemsList as $k => $v){
                if (!$v['active']) {
                    unset($orderItemsList[$k]);
                }
            }
        }

        $guid = guid();

        if (isset($orderItemsList['menu_user_block_edge'])) {
            $orderItemsList['menu_user_block_edge']['cmd'] = 'block_visitor_user';
            $isEntryBlocked = intval(User::isEntryBlocked($guid, $uid));
            if ($isEntryBlocked) {
                $value = array('menu_user_unblock_edge' => array(
                                'url' => '',
                                'icon' => 'fa-times-circle',
                                'tooltip' => l('menu_user_unblock_edge'),
                                'cmd' => 'user_unblock',
                                'active' => $orderItemsList['menu_user_block_edge']['active']

                         )
                );
                $orderItemsList = array_splice_assoc($orderItemsList, 'menu_user_block_edge', $value);
            }
        }

        if (isset($orderItemsList['menu_favorite_add_edge'])) {
            if (User::isFavoriteExists($guid, $uid)){
                $value = array('menu_favorite_remove_edge' => array(
                                    'url' => '',
                                    'icon' => 'fa-star active',
                                    'tooltip' => l('tooltip_remove_favorite'),
                                    'active' => $orderItemsList['menu_favorite_add_edge']['active']
                               )
                );
                $orderItemsList = array_splice_assoc($orderItemsList, 'menu_favorite_add_edge', $value);
            }
        }

        if (isset($orderItemsList['menu_friends_add_edge'])) {
            $icon = 'fa-user-times';
            $title = l('unfriend');
            $cmd = 'remove';
            $uidReqiest = 0;
            if (!User::isFriend($uid, $guid)) {
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
                    }
                }
            }

            $value = array('menu_friends_add_edge' => array(
                                'url' => '',
                                'icon' => $icon,
                                'tooltip' => $title,
                                'title' => $title,
                                'cmd' => $cmd,
                                'param' => $uidReqiest,
                                'active' => $orderItemsList['menu_friends_add_edge']['active']
                    )
            );
            $orderItemsList = array_splice_assoc($orderItemsList, 'menu_friends_add_edge', $value);
        }
        return $orderItemsList;
		
    }

    static function getCountMenuItem($k)
    {
        $count = 0;
        $uid = User::getParamUid();
        if ($k == 'menu_inner_videos_edge') {
            $count = CProfileVideo::getTotalVideos($uid);
        } elseif ($k == 'menu_inner_friends_edge') {
            $count = User::getNumberFriends($uid);
        } elseif ($k == 'menu_inner_photos_edge') {
            $count = CProfilePhoto::getTotalPhotos($uid);
        } elseif ($k == 'menu_inner_wall_posts_edge') {
            $count = Wall::getCountItems($uid);
        }elseif ($k == 'menu_inner_credits_edge') {
            $count = User::getCreditCount($uid);
        } elseif ($k == 'menu_users_viewed_me_edge') {
            $count = 0;
            //$viewers = User::getNumberViewersMeProfiles();
            //$count = $viewers['count'];
        } elseif ($k == 'menu_friends_edge') {
            $count = 0;
            //$count = User::getNumberFriends();
        } elseif ($k == 'menu_friends_online_edge') {
            $count = 0;
            //$count = User::getNumberFriendsOnline();
        }

        return $count;
    }

    static function isMenuItemProfileTab($key)
    {
        $defaultProfileTab = Common::getOption('set_default_profile_tab', 'edge');
        return $key  == $defaultProfileTab;
    }

    static function parseMenuItem(&$html, $data, $block, $k, $prf = '', $checkCounter = false, $j = 0)
    {

        if (!is_array($data)) {
            return;
        }
        if ($prf) {
            $prf = '_' . $prf;
        }

        $blockItem = "{$block}{$prf}_item";
        $blockItemCounter = "{$blockItem}_count";
        $blockItemActive = "{$blockItem}_active";
        $html->clean($blockItemCounter);
        if (isset($data['count'])) {
            $count = $data['count'];
        }else{
            $count = self::getCountMenuItem($k);
        }

        $uid = User::getParamUid();
        if ($checkCounter && !$count && $uid != guid() && !self::isMenuItemProfileTab($k)) {
            return false;
        }

        $html->setvar("{$blockItem}_key", $k);
        $title = l($k);
        if (isset($data['title']) && $data['title']) {
            $title = $data['title'];
        }
        $html->setvar("{$blockItem}_title", $title);
        $url = '';
        if (isset($data['url_real']) && $data['url_real']) {
            $url = $data['url_real'];
        } elseif ($data['url']) {
            if ($data['url'] == '#mn_circle_more_list') {// || in_array($k, array('menu_timeline_edge'))
                $url = $data['url'];
            } else {
                if ($block == 'member_header_menu' && $k == 'menu_friends_edge') {
                    $url = Common::pageUrl($data['url'], guid());
                } else {
                    $url = Common::pageUrl($data['url']);
                }
            }
        }
        $html->setvar("{$blockItem}_url", $url);

        if (isset($data['icon']) && $data['icon']) {
            $html->setvar("{$blockItem}_icon", $data['icon']);
        }

        $html->setvar($blockItemCounter, $count);
        if ($count) {
            $html->parse($blockItemCounter, false);
        }
        if ($block == 'profile_menu_inner_small') {
            $html->subcond($j == 0, "{$blockItem}_user_name", $blockItemCounter);
        }

        $isActive = Common::isPage($data['url']);
        if ($k == 'menu_inner_wall_posts_edge') {
            $isActive = Common::isPage('profile');
            if ($isActive) {
                $wallPost = true;
                if (guid() != $uid) {
                   $wallPost = Wall::isOnlyPostFriends($uid);
                }
                if ($wallPost) {
                   $html->parse("{$blockItem}_wall_show_post_input", false);
                }
            }
        } elseif ($block == 'member_header_menu') {
            if ($k == 'menu_profile_edge') {
                $profileTabUrl = User::getActiveProfileTabsAlias();
                if (!$profileTabUrl) {
                    $profileTabUrl = 'profile_view';
                }
                $isActive = Common::isPage($profileTabUrl, true);
            } else if($k == 'menu_friends_edge') {
                $isActive = Common::isPage($data['url'], true);
            }
        }

        $title = '';
        if (isset($data['tooltip'])) {// && !$isActive
            //$title = $isActive ? '' : $data['tooltip'];
            $title = $data['tooltip'];
        }
        $html->setvar("{$blockItem}_tooltip", $title);
        $html->subcond($isActive, $blockItemActive);

        if (isset($data['cmd'])) {
            $html->setvar("{$blockItem}_cmd", $data['cmd']);
        }

        if (isset($data['param'])) {
            $html->setvar("{$blockItem}_param", $data['param']);
        }

        $html->parse($blockItem);
        return true;
    }

    static function parseMenu(&$html, $module = '', $block = '', $maxVisibleItem = 0, $alias = '')
    {
        global $g;

        $orderItemsList = self::getOrderItemsList($module);

        if (!$html->blockExists($block) || !$orderItemsList) {
            return;
        }

        $guid = guid();
        $uid = User::getParamUid();
        if ($module == 'member_header_menu') {
            // $html->clean("{$block}_item");
            //$html->clean("{$block}_more");
            //$html->clean($block);
        }
        $isProfileMenuInner = false;
        $checkCounter = false;
        if ($block == 'profile_menu_inner_big' || $block == 'profile_menu_inner_small') {
            $checkCounter = true;
            $isProfileMenuInner = $block == 'profile_menu_inner_big';
            if (!$isProfileMenuInner) {
                $i = 0;
                $orderItemsListLeft = array();
                $orderItemsListRight = array();
                foreach ($orderItemsList as $k => $item) {
                    if ($i%2 == 0) {
                        $orderItemsListLeft[$k] = $item;
                    } else {
                        $orderItemsListRight[$k] = $item;
                    }
                    $i++;
                }
                $orderItemsList = array_merge($orderItemsListLeft, $orderItemsListRight);
            } elseif ($isProfileMenuInner && ($uid != $guid || count($orderItemsList) < 4)) {
                if ($uid != $guid) {
                    foreach ($orderItemsList as $k => $item) {
                        $count = self::getCountMenuItem($k);
                        $orderItemsList[$k]['count'] = $count;
                        if (!$count && !self::isMenuItemProfileTab($k)) {
                            unset($orderItemsList[$k]);
                        }
                    }
                }
                $countItems = count($orderItemsList);
                $orderListTemp = $orderItemsList;
                if ($countItems == 1) {
                    $key = key($orderItemsList);
                    $orderItemsList = array(
                        'menu_inner_empty_1' => array('count' => 0),
                        'menu_inner_empty_2' => array('count' => 0),
                        $key =>  $orderItemsList[$key],
                        'menu_inner_empty_4' => array('count' => 0)
                    );
                } elseif($countItems == 2) {
                    $orderItemsListTemp = array(
                        'menu_inner_empty_1' => array('count' => 0)
                    );
                    $orderItemsList = array_reverse($orderItemsList);
                    foreach ($orderItemsList as $key => $item) {
                        $orderItemsListTemp[$key] = $item;
                    }
                    $orderItemsListTemp['menu_inner_empty_4'] = array('count' => 0);
                    $orderItemsList = $orderItemsListTemp;
                } elseif($countItems == 3) {
                    $orderItemsList['menu_inner_empty_4'] = array('count' => 0);
                }
            }
        }
        $i = 0;
        $j = 0;
        $blockClean = '';
        foreach ($orderItemsList as $k => $v){
            $blockItem = $block;
            if ($isProfileMenuInner) {
                $html->clean($blockItem);
                if ($blockClean) {
                    $html->clean($blockClean);
                }
                $blockItem .= $i%2 == 0 ? '_left' : '_right';
            }
            if ($isProfileMenuInner && isset($v['count']) && !$v['count'] && !self::isMenuItemProfileTab($k)) {
                $html->parse($blockClean, true);
                $isParseItem = true;
            } else {
                if ($alias) {
                    $html->setvar("{$blockItem}_item_alias", $alias);
                }
                $isParseItem = self::parseMenuItem($html, $v, $blockItem, $k, '', $checkCounter, $j);
                $blockClean = "{$blockItem}_item";
            }

            if ($isParseItem) {
                $j++;
            }
            if ($isProfileMenuInner) {
                $html->parse($blockItem);
            }

            if ($maxVisibleItem) {
                unset($orderItemsList[$k]);
                if($isParseItem) {
                    if (++$i == $maxVisibleItem) {
                        break;
                    }
                }
            }
        }

        if ($maxVisibleItem && $orderItemsList && !$isProfileMenuInner) {
            foreach($orderItemsList as $k => $v){
                if ($alias) {
                    $html->setvar("{$blockItem}_item_alias", $alias);
                }
                self::parseMenuItem($html, $v, $block, $k, 'more');
            }
            $html->parse("{$block}_more", false);
        }
        $html->parse($block, false);
    }

    static function parseAdditionMenuCustomItems(&$html, $uid, $k, $blockItemOne, $blockCustomItem)
    {
        if ($blockCustomItem) {
            $html->clean($blockCustomItem);
            $blockCustomItem = '';
        }

        if ($k == 'menu_messages_edge' && $uid == guid()) {
            $blockCustomItem = "{$blockItemOne}_message";
            $disabled = CIm::getCountAllMsgIm() ? '' : 'disabled';
            $html->setvar("{$blockCustomItem}_disabled", $disabled);
            $html->parse($blockCustomItem);
        } elseif ($k == 'menu_more_list_edge') {
            $blockCustomItem = "{$blockItemOne}_more_link";
            $html->parse($blockCustomItem);
        }

        return $blockCustomItem;
    }

    static function parseAdditionMenu(&$html, $module = '', $block = '', $maxVisibleItem = 6)
    {
        global $g;

        $orderItemsList = self::getOrderItemsList($module);
        if (!$html->blockExists($block) || !$orderItemsList) {
            return;
        }

        $uid = User::getParamUid();
        $guid = guid();

        $isProfileMenuBig = $block == 'mn_circle';
        $isProfileMenuSmall = $block == 'mn_circle_small';
        $isProfileMenu = $isProfileMenuBig || $isProfileMenuSmall;
        $numMore = 3;
        if ($isProfileMenuSmall) {
            $numMore = 2;
        }
        $i = 0;
        $classes = array('top', 'center', 'bottom', 'bottom', 'center', 'top');

        $blockMoreMenu = "{$block}_more";
        $isParseMore = false;
        if ($isProfileMenu && $uid != $guid && count($orderItemsList) > $maxVisibleItem) {
            $isParseMore = true;

            $orderItemsListTemp = $orderItemsList;
            $orderItemsList = array();
            foreach ($orderItemsListTemp as $k => $v){
                if ($i == $numMore) {
                    $orderItemsList['menu_more_list_edge'] = array(
                            'url' => "#{$block}_more_list",
                            'icon' => 'fa-ellipsis-h',
                            'tooltip' => l('tooltip_more_menu')
                    );
                }
                $orderItemsList[$k] = $v;
                $i++;
            }
        }

        $i = 0;
        $j = 3;
        $blockCustomItem = '';
        foreach ($orderItemsList as $k => $v){
            $blockItem = $block;

            if ($isProfileMenu) {
                if ($uid != $guid && $isParseMore && $i > ($maxVisibleItem - 1)) {
                    $blockItemOne = "{$blockItem}_item";
                    $blockItem = $blockMoreMenu;
                } else {
                    if ($uid == $guid && $i == $maxVisibleItem) {
                        break;
                    }
                    if ($isProfileMenuBig) {
                        $blockItem .= $i < 3 ? '_left' : '_right';
                    }
                    $blockItemOne = "{$blockItem}_item";
                    if ($isProfileMenuBig) {
                        $html->setvar("{$blockItemOne}_class", $classes[$i]);
                    } else {
                        $html->setvar("{$blockItemOne}_num_order", $j--);
                    }
                }
            }

            $blockCustomItem = self::parseAdditionMenuCustomItems($html, $uid, $k, $blockItemOne, $blockCustomItem);

            $isParseItem = self::parseMenuItem($html, $v, $blockItem, $k);
            if ($isParseItem) {
                $i++;
            }
        }

        if ($isParseMore) {
            $html->parse($blockMoreMenu, false);
        }

        /*if ($maxVisibleItem && $orderItemsList && !$isProfileMenuInner) {
            foreach($orderItemsList as $k => $v){
                self::parseMenuItem($html, $v, $block, $k, 'more');
            }
            $html->parse("{$block}_more", false);
        }*/
        $html->parse($block, false);
    }

    static function parseListAdmin(&$html)
    {
        global $g, $p, $l;

        $module = self::$module;
        $tmpl = self::$tmpl;
        $orderItemsList = self::getOrderItemsList($module, false, $tmpl);

        if (self::$langsPage) {
            $lang = loadLanguageAdmin();
            $langPage = isset($lang[self::$langsPage]) ? $lang[self::$langsPage] : array();
            $l[$p] = array_merge($l[$p], $langPage);
        }

        $html->setvar('current_module', $module);

        if ($module == 'member_home_page'){
            $html->parse('home_page_th', false);
            $checked = Common::getOption('set_home_page', self::$tmpl);
            $html->setvar('current_checked', $checked);
        } elseif ($module == 'member_profile_tabs'){
            $html->parse('default_page_th', false);
            $checked = Common::getOption('set_default_profile_tab', self::$tmpl);
            $html->setvar('current_checked', $checked);
        }

        foreach($orderItemsList as $k => $v){
            $classNoSortable = '';
            $isParseStatus = true;
            if ($k == 'menu_sign_out_edge' && $module == 'member_header_menu'){
                $isParseStatus = false;
                $classNoSortable = 'no_sortable';
                $html->clean('order_item_status');
            } else {
                $html->parse('order_item_status', false);
            }

            $html->setvar('no_sortable', $classNoSortable);
            $html->setvar('menu_value', $v);
            $html->setvar('menu_key', $k);
            $html->setvar('menu_title', ucfirst(l($k)));
            if($v['active']){
                $html->setvar('checked', 'checked');
            } else {
                $html->setvar('checked', '');
            }
            if ($isParseStatus) {
                $html->parse('order_item_status', false);
            } else {
                $html->clean('order_item_status');
            }
            if ($module == 'member_home_page'){
                $html->parse('home_page_item', false);
            } elseif ($module == 'member_profile_tabs') {
                $html->parse('default_page_item', false);
            }

            $html->parse('order_item');
        }
    }

    function parseBlock(&$html)
    {
        if (self::$urlParams) {
            $html->setvar('url_params', self::$urlParams);
        }
        self::parseListAdmin($html);

        parent::parseBlock($html);
    }
}