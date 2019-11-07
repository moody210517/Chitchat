<?php
class Chat extends CHtmlBlock
{

    private static $userId;
    private static $action;
    private static $type = '';
    private static $tableInvite;
    private static $tableReject;

    function action() {

        $cmd = get_param('cmd');

    }

    static function setType($type = null)
    {
        if ($type === null) {
            $type = get_param('type', 'audio');
        }
        self::$type = $type;
        self::$tableInvite = $type . '_invite';
        self::$tableReject = $type . '_reject';
    }

    static function setUserId($uid)
    {
        self::$userId = $uid;
    }

    static function setAction($action)
    {
        self::$action = $action;
    }

    static function isAction($data)
    {
        return is_array($data)
               &&isset($data['action'])&&!empty($data['action'])
               &&isset($data['user_id'])&&!empty($data['user_id']);
    }

    static function invite()
    {
        global $g_user;
        global $l;

        $optionTmplSet = Common::getOption('set', 'template_options');

        $result = false;
        $uid = get_param('user_id');
        $responseData = false;
        self::setType();
        if ($g_user['user_id'] && $uid) {
            if ($optionTmplSet == 'urban') {
                $check = User::isEntryBlocked($uid, guid());
            } else {
                $check = User::isBlocked(self::$type . 'chat', $uid, guid());
            }
            if ($check) {
                $responseData = l('you_are_in_block_list');
            }
            $isFreeSite = Common::isOptionActive('free_site');
            $isSuperPowers = User::isSuperPowers();
             if (!$responseData && !$isFreeSite && !$isSuperPowers) {
                if (Common::isActiveFeatureSuperPowers(self::$type . 'chat')) {
                    $responseData = 'upgrade';
                } else if (Common::isActiveFeatureSuperPowers('chat_with_popular_users')){//
                    $level = User::getLevelOfPopularity($uid);
                    if ($level == 'very_high') {
                        $gender = User::getInfoBasic($uid, 'gender');
                        $type = 'chat_to_user_popular_' . mb_strtolower($gender, 'UTF-8');
                        $vars = array('name' => User::getInfoBasic($uid, 'name'),
                                  'url' =>  "search_results.php?display=profile&uid={$uid}");
                        if (Common::isMobile()) {
                            $vars['url'] = "profile_view.php?user_id={$uid}";
                        }
                        $responseData = Common::lSetLink($type, $vars);
                        $requestUri = self::$type . 'chat.php?id=' . $uid . '&type=' . self::$type;
                        $vars = array('url' => 'upgrade.php?request_uri=' . base64_encode($requestUri));
                        $responseData = Common::lSetLink($responseData, $vars, false, 1);
                    }
                }
            }

            if (!$responseData) {
                /*if (IS_DEMO && $optionTmplSet == 'urban'
                    && Common::getOption('type_media_chat') == 'webrtc'
                    && User::isDemoUser($uid)
                    && !get_param('device')) {
                    return 'demo_user';
                }*/

                $sql = 'SELECT *
                          FROM `' . self::$tableInvite . '`
                         WHERE `to_user` = ' . to_sql($uid, 'Number') .
                         ' AND `from_user` = ' . to_sql($g_user['user_id'], 'Number');
                DB::query($sql);

                if (!($row = DB::fetch_row())) {
                    $sql = 'INSERT INTO `' . self::$tableInvite . '`
                               SET `to_user` = ' . to_sql($uid, 'Number') . ',
                                   `from_user` = ' . to_sql($g_user['user_id'], 'Number');
                    DB::execute($sql);
                } else {
                    $sql = 'DELETE FROM `' . self::$tableInvite . '`
                             WHERE `to_user` = ' . to_sql($uid, 'Number') .
                             ' AND from_user=' . to_sql($g_user['user_id'], 'Number');
                    DB::execute($sql);
                    $sql = 'INSERT INTO `' . self::$tableInvite . '`
                               SET `to_user` = ' . to_sql($uid, 'Number') . ',
                                   `from_user` = ' . to_sql($g_user['user_id'], 'Number');
                    DB::execute($sql);
                }
                $responseData = true;
            }
        }
        return $responseData;
    }

    static function update($type, $uid = 0)
    {
        global $g_user;

        $responseData = array();
        self::setType($type);

        if ($g_user['user_id']) {
            $sql = 'SELECT *
                      FROM `' . self::$tableInvite . '`
                     WHERE `to_user` = ' . to_sql($g_user['user_id'], 'Number');
            if ($uid) {
                $sql .= ' AND `from_user` = ' . to_sql($uid);
            }
            DB::query($sql);
            if ($row = DB::fetch_row()){

                $responseData = array('action' => 'request',
                                      'user_id' => $row['from_user']);
                $sql = 'DELETE FROM `' . self::$tableInvite . '`
                         WHERE `to_user` = ' . to_sql($g_user['user_id'], 'Number') .
                         ' AND `from_user` = ' . to_sql($row['from_user'], 'Number');
                DB::execute($sql);
                $isFreeSite = Common::isOptionActive('free_site');
                $isSuperPowers = User::isSuperPowers();
                if (!$isFreeSite && !$isSuperPowers) {
                    $isUpgrade = false;
                    $offChatWithPopular = Common::isOptionActive('chat_with_popular_users_off', 'template_options');
                    if (Common::isActiveFeatureSuperPowers($type . 'chat')) {
                        $isUpgrade = true;
                    } else if (!$offChatWithPopular && Common::isActiveFeatureSuperPowers('chat_with_popular_users')){
                        $level = User::getLevelOfPopularity($row['from_user']);
                        if ($level == 'very_high') {
                            $isUpgrade = true;
                        }
                    }
                    if ($isUpgrade) {
                        $requestUri = $type . 'chat.php?id=' . $row['from_user'] . '&type=' . $type;
                        $responseData = array('action' => 'request',
                                              'user_id' => $row['from_user'],
                                              'type' => $type . 'chat',
                                              'request_uri' =>  base64_encode($requestUri));
                    }
                }
            }

            $sql = 'SELECT *
                      FROM `' . self::$tableReject . '`
                     WHERE `to_user` = ' . to_sql($g_user['user_id'], 'Number');
            if ($uid) {
                $sql .= ' AND `from_user` = ' . to_sql($uid);
            }
            DB::query($sql);
            if ($row = DB::fetch_row()){
                $responseData['action'] = ($row['go'] == 'N') ? 'reject' : 'start_talk';
                $responseData['user_id'] = $row['from_user'];

                $sql = 'DELETE FROM `' . self::$tableReject . '`
                         WHERE `to_user` = ' . to_sql($g_user['user_id'], 'Number') .
                         ' AND from_user=' . to_sql($row['from_user'], 'Number');
                DB::execute($sql);
            }
            if (!empty($responseData)) {
                $user = User::getInfoBasic($responseData['user_id']);
                $responseData['user_name'] = User::nameShort($user['name']);
                $responseData['city'] = $user['city'];
                $responseData['age'] = $user['age'];
                $responseData['url'] = User::url($responseData['user_id'], $user);
                $responseData['user_url'] = $responseData['url'];
                $responseData['photo'] = User::getPhotoDefault($responseData['user_id'], 'm');
            }
        }
        return $responseData;

    }

    static function checkRequest($type, $uid)
    {

        global $g_user;

        if (!$g_user['user_id'] || !in_array($type, array('audio', 'video')) || !$uid) {
            return false;
        }

        $responseData = self::update($type);
        if ($responseData) {
            return $responseData;
        }

        self::setType($type);

        $responseData = array('action' => 'request',
                              'user_id' => $uid);

        $isFreeSite = Common::isOptionActive('free_site');
        $isSuperPowers = User::isSuperPowers();
        if (!$isFreeSite && !$isSuperPowers) {
            $isUpgrade = false;
            $offChatWithPopular = Common::isOptionActive('chat_with_popular_users_off', 'template_options');
            if (Common::isActiveFeatureSuperPowers($type . 'chat')) {
                $isUpgrade = true;
            } else if (!$offChatWithPopular && Common::isActiveFeatureSuperPowers('chat_with_popular_users')){
                $level = User::getLevelOfPopularity($row['from_user']);
                if ($level == 'very_high') {
                    $isUpgrade = true;
                }
            }
            if ($isUpgrade) {
                $requestUri = $type . 'chat.php?id=' . $uid . '&type=' . $type;
                $responseData = array('action' => 'request',
                                      'user_id' => $row['from_user'],
                                      'type' => $type . 'chat',
                                      'request_uri' =>  base64_encode($requestUri));
            }
        }

        $user = User::getInfoBasic($responseData['user_id']);
        if ($user) {
            $responseData['user_name'] = User::nameShort($user['name']);
            $responseData['city'] = $user['city'];
            $responseData['age'] = $user['age'];
            $responseData['url'] = User::url($responseData['user_id'], $user);
            $responseData['user_url'] = $responseData['url'];
            $responseData['photo'] = User::getPhotoDefault($responseData['user_id'], 'm');
        } else {
            $responseData = false;
        }

        return $responseData;
    }

    static function reject()
    {
        global $g_user;

        $responseData = false;
        $uid = get_param('user_id');
        self::setType();

        if ($g_user['user_id'] && $uid) {
            $sql = 'INSERT INTO `' . self::$tableReject . '`
                       SET `to_user` = ' . to_sql($uid, 'Number') . ',
                           `from_user` = ' . to_sql($g_user['user_id'], 'Number') . ",
                           `go` = 'N'";
            DB::execute($sql);
            $responseData = true;
        }
        return $responseData;
    }

    static function talk()
    {
        global $g_user;

        $responseData = false;
        $uid = get_param('user_id', get_param('id'));
        self::setType();

        if ($g_user['user_id'] && $uid) {
            $sql = 'INSERT INTO `' . self::$tableReject . '` SET `to_user` = ' . to_sql($uid, 'Number') . ',
                                `from_user` = ' . to_sql($g_user['user_id'], 'Number') . ", go='Y'";
       		DB::execute($sql);
            $responseData = true;
        }
        return $responseData;
    }

    static function paid()
    {
        global $g_user;

        $responseData = false;
        $uid = get_param('user_id');
        self::setType();

        $price=Pay::getServicePrice(self::$type.'_chat', 'credits');
        if($price>0 && Common::isCreditsEnabled()){
            if($g_user['credits']>=$price){
                $responseData = $price;
                $data = array('credits' => $g_user['credits']-$price);
                User::update($data);
            } else {
                $responseData = -1;
            }
        }else{
            $responseData = true;
        }
        return $responseData;
    }


    static function getIdByChat($callId, $client = true, $type = '')
    {
        if ($client) {
            $uid = guser('user_id') . '_' . $callId;
        } else {
            $uid = $callId . '_' . guser('user_id');
        }
        if ($type) {
            $type = '_' . $type;
        }
        $key = domain() . '_' . $type . '_' . $uid;
        $key = str_replace(array('.'), '_', $key);
        return $key;
    }

    //never used - may need
    static function parseMediaChat($html, $type = '', $uid = 0, $redirect = false, $alwaysParseChat = true) {
        global $g;
		global $g_user;

        $callUid = intval(get_param('id', $uid));
        $clientId = $g_user['user_id'];

        $sql = "SELECT *
                  FROM `user`
                 WHERE `user_id` = " . to_sql($callUid);
        DB::query($sql);
        $isParseChat = true;
		if ($row = DB::fetch_row()){
            $sql = "DELETE FROM `video_reject`
                     WHERE `to_user` = " . to_sql($g_user['user_id'])
                   . " AND `from_user` = " . to_sql($row['user_id']);
            DB::execute($sql);

			if (User::isOnline($callUid, $row)) {
				#foreach ($row as $k => $v) $html->setvar($k, $v);
				$html->setvar('enemy_name', $row['name']);
				$html->setvar('my_name', $g_user['name']);
			} else {
                $isParseChat = $alwaysParseChat;
                $html->parse('alert_js');
            }
		} elseif ($redirect) {
            Common::toHomePage();
        }

        $typeChat = Common::getOption('type_media_chat');

    	$html->setvar("{$type}_type_chat", $typeChat);

        if ($typeChat == 'webrtc') {
            if (IS_DEMO && get_param('demo')) {
                $html->setvar('demo_url', Common::urlSiteSubfolders());
                $html->setvar('demo_user_gender', mb_strtolower(User::getInfoBasic($callUid, 'gender'), 'UTF-8'));
                $html->setvar('demo', 1);
            }
            $clientId = Chat::getIdByChat($callUid, true, $type);
            $callUid = Chat::getIdByChat($callUid, false, $type);
        }
        $html->setvar("{$type}_client_id", $clientId);
        $html->setvar("{$type}_call_to_id", $callUid);

        if ($isParseChat && $typeChat == 'webrtc') {
            $html->setvar('media_server', $g['media_server']);
            $html->parse("{$type}_chat_webrtc_script", false);
            $html->parse("{$type}_chat_webrtc_js", false);
        }
        $html->parse("{$type}_chat_{$typeChat}", false);
    }

    static function getMediaConstraints() {
        $mediaConstraints = array(
            'width' => array('min' => 'webrtc_camera_resolution_width_min',
                             'ideal' => 'webrtc_camera_resolution_width_ideal',
                             'max' => 'webrtc_camera_resolution_width_max'),
            'framerate' => array('min' => 'webrtc_framerate_min',
                                 'ideal' => 'webrtc_framerate_ideal',
                                 'max' => 'webrtc_framerate_max'),
        );
        foreach ($mediaConstraints as $option => $rows) {
            foreach ($rows as $key => $value) {
                $mediaConstraints[$option][$key] = Common::getOption($value);
            }
        }

        $mediaConstraints = json_encode($mediaConstraints);
        if ($mediaConstraints === false) {
            $mediaConstraints = '{"width":{"min":"640","ideal":"720","max":"1280"},"framerate":{"min":"15","ideal":"18","max":"24"}}';
        }

        return $mediaConstraints;
    }

	function parseBlock(&$html) {

		global $g_user;

        $cmd = get_param('cmd');

        //if (self::$action == 'request') {
            //if (self::parseInvite($html)) {

            //}
        //}
        parent::parseBlock($html);

	}
}