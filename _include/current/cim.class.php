<?php
class CIm extends CHtmlBlock
{
	static $demoWhere = '';
	static $demoInsert = '';
    static $isMobileGeneralChatUpdate = false;
    static $isMobileOneChat = false;
    static $isPageListChats = false;
    static $isNotificationParsed = false;
    static $isReadMsg = false;
    static $usersListMobileGeneralChat = null;
    static $usersListMobileGeneralChatOrder = array();
    static $countMessagesFromUsers = null;

    /* SET */
	static function setCurrentData($table = '', $set = false)
	{
		if (defined('IS_DEMO') && IS_DEMO) {
            if (empty(self::$demoWhere) || empty(self::$demoInsert) || $set) {
                self::$demoWhere = " AND {$table}session = " . to_sql(addslashes(session_id())) . ' ';
                self::$demoInsert = ", {$table}session = " . to_sql(addslashes(session_id())) . ", {$table}session_date = NOW()";
            }
		}else{
            self::$demoWhere = '';
        }
	}

    static function getWhereNoSysytem($table = '')
	{
        $where = '';
        if (Common::isOptionActiveTemplate('im_no_system_msg')) {
            /* system_type
             * 1 - welcoming_message
             */
            $where = " AND ({$table}system != 1 OR ({$table}system = 1 AND {$table}system_type = 1)) ";
            //$where = ' AND (system != 1 OR system_type = 1)';
        }

        return $where;
    }

    static function checkTimeStatus($time)
	{

    }

	static function setWriting($status = null)
	{
		if ($status === null) {
			$status = self::jsonDecodeParamArray('status_writing');
		}
		if ($status && is_array($status)) {
            self::setCurrentData();
            foreach ($status as $user => $time) {
				self::setLastWriting($user, $time);
			}
		}
	}

    static function setWritingMobileOneChat()
	{
		global $g_user;

		$status = get_param_int('status_writing');
        $userTo = get_param('user_to');
		if ($status && $userTo) {
            self::setLastWriting($userTo, $status);
		}
	}

    static function checkTimeLastWriting($time, $currentTime = null)
	{
        if ($currentTime == null) {
            $currentTime = time();
        }

		$time = intval($time);
        $d = 120;//If time is more than 2 minutes
        $d1 = abs($currentTime - $time);
        if($time && $d1 && $d1 > $d){
            $time = 0;
        }

        return $time;
    }

    static function statusLastWriting($time, $currentTime = null, $timeoutSecServer = null)
	{
        if ($currentTime == null) {
            $currentTime = time();
        }

        if ($timeoutSecServer === null) {
			$timeoutSecServer = get_param('timeout_server');
		}

        $time = self::checkTimeLastWriting($time, $currentTime);

        if (!$time) {
            return 0;
        }

        return (($currentTime - $time) <= $timeoutSecServer) ? 1 : 0;
    }

	static function setLastWriting($userId, $time)
	{
        $time = self::checkTimeLastWriting($time);
        self::setCurrentData();
		$where = self::getWhereMessagesFrom($userId) . self::$demoWhere;
		DB::update('im_open', array('last_writing' => $time), $where);
	}

    static function getWritingUser($timeoutSecServer = null, $userTo = null)
    {
        if ($timeoutSecServer === null) {
			$timeoutSecServer = get_param('timeout_server');
		}
        self::setCurrentData();

        $fromUserWriting = array();
        $writing = array();
        $currentTime = time();

        $userTo = get_param_int('user_to', get_param_int('user_current'));
        if ($userTo) {
            $where = self::getWhereMessagesTo($userTo) . ' AND `last_writing` != 0 ' . self::$demoWhere;
            $user = DB::one('im_open', $where);
            if ($user) {
                $writing[$user['from_user']] = self::statusLastWriting($user['last_writing'], $currentTime, $timeoutSecServer);
            }
        } else {
            $param = 'users_list';
            if (get_param('users_list_open_im')) {
                $param = 'users_list_open_im';
            }
            $usersList = self::jsonDecodeParamArray($param);

            if ($usersList) {
                $where = '`to_user` = ' . to_sql(guid())
                  . ' AND `last_writing` != 0 '
                  . ' AND `from_user` IN(' . self::getSqlImplodeKeys($usersList)  . ')'
                  . self::$demoWhere;
                $fromUserWriting = DB::select('im_open', $where);
                if ($fromUserWriting) {
                    foreach ($fromUserWriting as $user) {
                        $writing[$user['from_user']] = self::statusLastWriting($user['last_writing'], $currentTime, $timeoutSecServer);
                    }
                }
            }
        }

        return $writing;
    }

	static function setLastViewedIm($currentUser = null)
	{
		global $g_user;

		if ($g_user['user_id']) {
			if ($currentUser === null) {
				$currentUser = get_param('user_current');
			}
			if (!empty($currentUser)) {
                self::setCurrentData();
				$sql = 'UPDATE `im_open` SET `z` = ' . time() .
					   ' WHERE `to_user` = ' . to_sql($currentUser, 'Number') . "
						   AND `from_user` = " . to_sql($g_user['user_id'], 'Number') . self::$demoWhere;
				DB::execute($sql);
			}
		}
	}

    static function setVisibleOpenIm($uid = null, $visible = 'Y')
	{
		global $g_user;
        $response = false;
		if ($g_user['user_id']) {
			if ($uid === null) {
				$uid = get_param('user_id');
			}
            $paramVisible = get_param('visible');
            if ($paramVisible && in_array($paramVisible, array('Y', 'N', 'C'))) {
                $visible = $paramVisible;
            }
			if ($uid) {
                self::setCurrentData();
				$sql = 'UPDATE `im_open` SET `im_open_visible` = ' . to_sql($visible) .
					   ' WHERE `to_user` = ' . to_sql($uid, 'Number') . "
						   AND `from_user` = " . to_sql($g_user['user_id'], 'Number') . self::$demoWhere;
				DB::execute($sql);
                $response = true;
			}
		}
        return $response;
	}


    static function setMessageAsReadOneMsg($mid, $userFrom)
	{
        $isMode = get_param('is_mode_fb');
        if ($isMode != 'false') return true;

        if ($mid) {
            DB::update('im_msg', array('is_new' => 0), '`id` = ' . to_sql($mid));
            if(!self::getCountNewMessages($userFrom)){
                $where = '`from_user` = ' . to_sql(guid()) .
                         ' AND `to_user`= ' . to_sql($userFrom)
                         ;//For demo . self::$demoWhere
                DB::update('im_open', array('is_new_msg' => 0), $where);
            }
        }
        return true;
	}

	static function setMessageAsRead($userFrom = null, $getCount = true)
	{
        $isMode = get_param('is_mode_fb', 'false');

        if ($isMode != 'false') return true;
        $guid = guid();
        if ($userFrom === null) {
			$userFrom = get_param('user_current', get_param('user_id'));
		}
        if (!$guid || !$userFrom) {
            return true;
        }
        $where = '`from_user` = ' . to_sql($guid) .
		      	 ' AND `to_user`= ' . to_sql($userFrom)
                 ;//For demo . self::$demoWhere
        $sql = 'SELECT * FROM `im_open`
            WHERE ' . $where . self::$demoWhere;

        $row = DB::row($sql, DB_MAX_INDEX);
        if($row && $row['is_new_msg']) {
            DB::update('im_open', array('is_new_msg' => 0), $where);

            $where = '`from_user` = ' . to_sql($userFrom) .
                     ' AND `to_user`= ' . to_sql($guid) .
                     ' AND `is_new` = 1';
            DB::update('im_msg', array('is_new' => 0), $where);
        }

        return $getCount ? CIm::getCountNewMessages() : '';
	}

    static function setMessageMobileAsRead($isJson = false)//??? NOT USED
	{
		global $g_user;

		if ($g_user['user_id']) {
			$isMode = get_param('is_mode_fb');
            if ($isJson) {//Impact - messages.php - one chat
                $display = get_param('display');
                $cache = self::jsonDecodeParamArray('cache_messages');
                if (!$cache) {
                    return false;
                }
                if ($display == 'one_chat') {
                    $cache = array_shift($cache);
                }
            } else {//Urban mobile - messages.php
                $cache = get_param_array('cache_messages');
            }

			if ($isMode == 'false' && !empty($cache)) {
				$where = '`id` IN(';
                $prf = '';
                foreach ($cache as $users => $item) {
                    $key = $display == 'one_chat' ? $users : key($item);
                    $where .= $prf . $key;
                    $prf = ',';
                }
                $where .= ')';
                DB::update('im_msg', array('is_new' => 0), $where);
			}
            return true;
		} else {
            return false;
        }
	}

	static function setStatusUsers(&$html, $usersList = null, $alwaysCheck = false)
	{
    	if ($usersList === null) {
            $usersList = self::jsonDecodeParamArray('users_list');
		}

        if (!$usersList) return;
        $usersStatus = array();

        /*
        foreach ($usersList as $userId => $online) {
            $userOnline = intval(User::isOnline($userId));
            if ($userOnline != $online || $alwaysCheck) {
                $usersStatus[$userId] = $userOnline;
            }
        }*/

        $rows = DB::select('user', 'user_id IN (' . self::getSqlImplodeKeys($usersList) . ')', '', '', 'user_id, last_visit');

        if($rows) {
            foreach($rows as $row) {
                $userId = $row['user_id'];
                $userOnline = intval(User::isOnline($userId, $row));
                if ($userOnline != $usersList[$userId] || $alwaysCheck) {
                    $usersStatus[$userId] = $userOnline;
                }
            }
        }

        if ($usersStatus) {
            $html->setvar('update_users_status_check', intval($alwaysCheck));
            $html->setvar('update_users_status', json_encode($usersStatus));
            $html->parse('update_users_status', false);
        }
	}

	static function clearHistoryMessages($userId = null)
	{
		global $g_user;

        $responseData = false;

        if ($userId === null) {
            $userId = get_param('user_id', 0);
		}
		if ($g_user['user_id'] && $userId) {
            self::setCurrentData();

			DB::update('im_msg', array('from_user_deleted' => 1), self::getWhereMessagesFrom($userId));
            DB::update('im_msg', array('to_user_deleted' => 1), self::getWhereMessagesTo($userId));

            if (!User::isFriend($userId, $g_user['user_id'])) {
                $mid = self::getMidRequestPrivateAccess($userId);
                if ($mid) {
                    self::sendPrivateDeclined($userId, $mid);
                }
            }
            DB::delete('im_msg', self::getWhereMessagesFrom($userId) . ' AND `to_user_deleted` = 1');
			DB::delete('im_msg', self::getWhereMessagesTo($userId) . ' AND `from_user_deleted` = 1');
            DB::delete('im_open', self::getWhereMessagesFrom($userId) . self::$demoWhere);
            $responseData = true;
		}
        return $responseData;
	}
	/* SET */
	/* GET */
	static function getDateIm($date)
    {
		return Common::dateFormat($date, 'im_datatime');
	}

	static function lastId($return = true)
    {
        $sql = 'SELECT MAX(`id`) FROM im_msg';

        $lastId = intval(DB::result($sql));

        set_session('im_id', $lastId);
        if($return) {
            return get_session('im_id');
        }

        /*
		DB::query("SHOW TABLE STATUS LIKE 'im_msg'");
		$line = DB::fetch_row();
		if (intval($line['Auto_increment']) == 0)
            set_session('im_id', 0);
		else
            set_session('im_id', intval($line['Auto_increment']) - 1);

		return get_session('im_id');
         */
	}

    static function getCountAllMsgIm()
    {
		global $g_user;

        $where = self::getWhereNoSysytem();

        $sql = 'SELECT
                (SELECT COUNT(*) FROM `im_msg`
				  WHERE `from_user` = ' . to_sql($g_user['user_id'], 'Number') . '
					AND `from_user_deleted` = 0 ' . $where . ' LIMIT 1)
				+
				(SELECT COUNT(*) FROM `im_msg`
				  WHERE `to_user` = ' . to_sql($g_user['user_id'], 'Number') .
				  ' AND `to_user_deleted` = 0 ' . $where . ' LIMIT 1)
				';

		return DB::result($sql);
	}

    static function getCountMsgIm($userId)
    {
		global $g_user;

        $where = self::getWhereNoSysytem();
        if (Common::isOptionActive('gifts_disabled', 'template_options')) {
            //$where = " AND `msg` NOT LIKE '{gift:%'";
        }

        $sql = 'SELECT
                (SELECT COUNT(*) FROM `im_msg`
				  WHERE `to_user` = ' . to_sql($userId, 'Number') .
				  ' AND `from_user` = ' . to_sql($g_user['user_id'], 'Number') . '
					AND `from_user_deleted` = 0 ' . $where . ')
				+
				(SELECT COUNT(*) FROM `im_msg`
				  WHERE `to_user` = ' . to_sql($g_user['user_id'], 'Number') .
				  ' AND `from_user` = ' . to_sql($userId, 'Number') . '
					AND `to_user_deleted` = 0 ' . $where . ')
				';

		return DB::result($sql);
	}

    static function getDataNewMessagesLast($limit = '', $order = 'id ASC')
    {
        global $g_user;
        $msg = array();
		if ($g_user) {
            $lastNewMsgId = intval(get_param('last_new_msg_id'));
            $where = '`is_new` = 1
                  AND `to_user` = ' . to_sql($g_user['user_id']) .
		        ' AND `to_user_deleted` = 0 ' . self::getWhereNoSysytem() .  '
                  AND `id` > ' . to_sql($lastNewMsgId);
            $msg = DB::select('im_msg', $where, $order, $limit);
		}

        return $msg;
    }

    static function getDataJsNewMessages()
    {
        global $g_user;

        $js = '';
        $urlFiles = Common::getOption('url_files', 'path');
        $allMsgs = array();
        $msgs = self::getDataNewMessagesLast();
        if ($msgs) {
            $i = 0;
            foreach ($msgs as $msg) {

                $msg=self::switchOnTranslate($msg);

                $allMsgs[$i]['id'] = $msg['id'];
                $vars = array('url' => User::url($msg['from_user']),
                              'name' => User::nameOneLetterFull($msg['name']));
                $allMsgs[$i]['title'] = Common::lSetLink('name_sent_you_a_message', $vars);

                $vars['user_id'] = $msg['from_user'];
                $photo = $urlFiles . User::getPhotoDefault($msg['from_user'], 'r');
                $allMsgs[$i]['photo'] = $photo;
                $vars['text'] = hard_trim($msg['msg'], 55);
                if ($msg['system']) {
                    $types = array('private_photo_request_approved',
                                   'private_photo_request_declined',
                                   'private_photo_request',
                                   '{gift:',
                                   'welcoming_message');
                    foreach ($types as $type) {
                        if(stristr($msg['msg'], $type) !== false) {
                            if ($type == '{gift:') {
                                $vars['text'] = l('sent_you_a_gift');
                            } else if ($type == 'private_photo_request') {
                                $vars['text'] = l('private_photo_report');
                            } else if ($type == 'private_photo_request_approved') {
                                $vars['text'] = l('private_photo_request_approved_notif');
                            } else if ($type == 'welcoming_message') {
                                $emailAuto = Common::sendAutomail(Common::getOption('lang_loaded', 'main'), '','welcoming_message', array('name' => guser('name')), false, DB_MAX_INDEX, true);
                                $vars['text'] = hard_trim($emailAuto['text'], 55);
                            } else {
                                $vars['text'] = l($type);
                            }
                            break;
                        }
                    }
                }
                $allMsgs[$i]['text'] = Common::replaceByVars(l('sent_you_new_message'), $vars);
                $i++;
            }
        }
        return defined('JSON_UNESCAPED_UNICODE') ? json_encode($allMsgs, JSON_UNESCAPED_UNICODE) : json_encode($allMsgs);
    }


	static function getCountNewMessages($fromUser = null, $exceptUser = null)
    {
		global $g_user;
		$countMsgNew = 0;
		if ($g_user) {
            $where = 'WHERE `is_new` = 1
                        AND `to_user` = ' . to_sql($g_user['user_id'], 'Number') .
				      ' AND `to_user_deleted` = 0';
            if (!empty($fromUser)) {
                $where .= ' AND	`from_user` = ' . to_sql($fromUser, 'Number');
            }elseif (!empty($exceptUser)) {
                $where .= ' AND	`from_user` != ' . to_sql($exceptUser, 'Number');
            }

            $where .= self::getWhereNoSysytem();

            if($fromUser && $exceptUser === null && self::$countMessagesFromUsers !== null) {
                $countMsgNew = isset(self::$countMessagesFromUsers[$fromUser]) ? self::$countMessagesFromUsers[$fromUser] : 0;
            } else {
                $sql = 'SELECT COUNT(*) FROM `im_msg` ' . $where;
                $countMsgNew = DB::result($sql, 0, 2, true);
            }
		}

		return $countMsgNew;
	}


    static function getLastNewMessageInfo()
    {
		global $g_user;

        $optionTmplName = Common::getTmplName();
		$info = array('uid' => 0, 'message' => '');
		if ($g_user && (Common::isApp() || $optionTmplName == 'edge')) {
            $where = 'WHERE `is_new` = 1
                        AND `to_user` = ' . to_sql($g_user['user_id'], 'Number') .
				      ' AND `to_user_deleted` = 0';
            $where .= self::getWhereNoSysytem();

			$sql = 'SELECT from_user
                FROM `im_msg` USE INDEX (is_new_to_user_to_user_deleted_id) ' . $where . '
                ORDER BY id DESC LIMIT 1';
			$uid = DB::result($sql, 0, 2);
            if($uid) {
                $info['uid'] = $uid;
                $info['message'] = addslashes(lSetVars('app_notification_text', array('name' => User::nameShort(User::getInfoBasic($uid, 'name')))));
            }
		}

        return $info;
    }

    static function getCountNewMessagesFromUsers()
    {
		global $g_user;

		$countMsgNewFromUsers = array();
		if ($g_user) {
			$sql = 'SELECT SUM(is_new) as count, `from_user` FROM `im_msg`
                     WHERE `to_user` = ' . to_sql($g_user['user_id'], 'Number') .
				     ' AND `to_user_deleted` = 0 ' . self::getWhereNoSysytem() . '
                     GROUP BY `from_user`';

			$countMsgNew = DB::rows($sql);
            foreach ($countMsgNew as $item) {
                $countMsgNewFromUsers[$item['from_user']] = $item['count'];
            }
		}

		return $countMsgNewFromUsers;
	}

    static function getCountNewMessagesFromListUsers($json = true)
    {
        if(self::$countMessagesFromUsers === null) {
            $usersNewMsg = self::getCountNewMessagesFromUsers();
        } else {
            $usersNewMsg = self::$countMessagesFromUsers;
        }

        $usersNewMsg['all'] = array_sum($usersNewMsg);
        return $json ? json_encode($usersNewMsg) : $usersNewMsg;
    }

    static function getLastWatchedMsgId()
    {
		global $g_user;

		$lastId = 0;
		if ($g_user) {
            $where = 'WHERE `to_user` = ' . to_sql($g_user['user_id'], 'Number') . self::getWhereNoSysytem() . ' ORDER BY `id` DESC LIMIT 1';
			$lastId = DB::result('SELECT `id` FROM `im_msg` ' . $where);
		}
		return $lastId;
	}

    static function setWindowEvent()
    {
        global $g_user;

		if ($g_user) {
            delses('window_count_event_last');
            $lastMsg = self::getLastWatchedMsgId();
            $where = '`to_user` = ' . to_sql($g_user['user_id'], 'Number') . ' AND id > ' . to_sql($lastMsg, 'Number');
            $where .= self::getWhereNoSysytem();
            $count = DB::count('im_msg', $where);
            set_session('window_last_im_msg', $lastMsg);
            set_session('window_count_event', $count);
        }

    }

	static function getWhereMessagesFrom($userId)
    {
		global $g_user;

		$where = ' `to_user` = ' . to_sql($userId, 'Number') .
				  ' AND
				   `from_user` = ' . to_sql($g_user['user_id'], 'Number') . ' ';
		return $where;
	}

	static function getWhereMessagesTo($userId)
    {
		global $g_user;

		$where = ' `to_user` = ' . to_sql($g_user['user_id'], 'Number') .
			      ' AND
			       `from_user` = ' . to_sql($userId, 'Number') . ' ';
		return $where;
	}

	static function getWhereMessages($userId)
    {
		global $g_user;

		$where = '(`to_user` = ' . to_sql($userId, 'Number') .
				  ' AND
				   `from_user` = ' . to_sql($g_user['user_id'], 'Number') . ')
			   OR (`to_user` = ' . to_sql($g_user['user_id'], 'Number') .
			      ' AND
			       `from_user` = ' . to_sql($userId, 'Number') . ') ';
		return $where;
	}
	/* GET */


	/* UPDATE */
	static function parseReadMessage(&$html, $block = 'show_read_marks')
	{
        if (!$html->blockExists($block) || !guid()) {
            return false;
        }

        $optionTmplName = Common::getOption('name', 'template_options');

        $userTo = get_param_int('user_to', get_param_int('user_current'));
        if ($optionTmplName == 'edge') {
            $userTo = 0;
        }
        $getReadMsgFromIm = $userTo ? get_param_int('get_read_msg_from_im') : self::jsonDecodeParamArray('get_read_msg_from_im');
        if (!$getReadMsgFromIm) {
            return false;
        }

        if (Common::allowedFeatureSuperPowersFromTemplate('message_read_receipts')
                && !User::accessCheckFeatureSuperPowers('message_read_receipts')) {
            return false;
        }

        $result = false;
        if ($userTo) {
            $sql = 'SELECT MAX(`id`)
                      FROM `im_msg`
                     WHERE `from_user` = ' . to_sql(guid())
                   . ' AND `to_user` =' . to_sql($userTo)
                   . ' AND `is_new` = 0';
                     //AND `from_user_deleted` = 0'
            $lastMsgReadId = DB::result($sql);
            if ($lastMsgReadId) {
                $html->setvar($block, $lastMsgReadId);
                $html->parse($block, false);
                $result = true;
            }
        } else {
            $sql = 'SELECT MAX(`id`) AS max_id, `to_user`
                      FROM `im_msg`
                     WHERE `from_user` = ' . to_sql(guid())
                   . ' AND `to_user` IN(' . self::getSqlImplodeKeys($getReadMsgFromIm) . ')'
                   . ' AND `is_new` = 0'
                     //AND `from_user_deleted` = 0'
                 . ' GROUP BY `to_user`';
            $lastMsgsRead = DB::all($sql);
            if ($lastMsgsRead) {
                $msgsReadResult = array();
                foreach ($lastMsgsRead as $msg) {
                    $msgsReadResult[$msg['to_user']] = $msg['max_id'];
                }
                $html->setvar($block, json_encode($msgsReadResult));
                $html->parse($block, false);
                $result = true;
            }
        }

        return $result;
	}


    static function updateMessagesLast(&$html)
    {
        global $g_user;
        $lastId = get_param('last_id');
        self::updateMessages($html, $lastId);

        /* Verification of the existence of messages Not used - DISABLED
        $where = '(`from_user` = ' . to_sql($g_user['user_id'], 'Number') . ' AND `from_user_deleted` = 0)
                    OR
                  (`to_user` = ' . to_sql($g_user['user_id'], 'Number') . ' AND `to_user_deleted` = 0)';
        $existingMessages = DB::field('im_msg', 'id' ,$where);
        $html->setvar('existing_messages', json_encode(array_flip($existingMessages)));
        $html->parse('messages_existing_ajax', true);
        /* Verification of the existence of messages */
    }

	static function updateMessages(&$html, $lastId, $setIsReadMsg = null)
    {
		global $g_user;

		if ($g_user['user_id'] > 0)
		{
            $optionTmplName = Common::getOption('name', 'template_options');

			$isUpdate = false;
			$received = false;

            $isFbMode = get_param('is_mode_fb');
            //if ($isFbMode == 'false' && $optionTmplName != 'urban_mobile') {
                //self::setMessageAsRead();
            //}
            $isUpdateMsgOpenListChats = get_param('display') == 'update_msg_open_list_chats';
            if (!$isUpdateMsgOpenListChats) {
                self::setStatusUsers($html);
            }

            $userTo = get_param('user_to');
            $userToOneChat = null;
            if (self::$isMobileOneChat && $userTo) {
                $userToOneChat = $userTo;
                $where = ' ((`to_user` = ' . to_sql($g_user['user_id'], 'Number') .
                            ' AND `from_user` = ' . to_sql($userTo, 'Number') .
                            ' AND `to_user_deleted` = 0)
                            OR
                            (`from_user` = ' . to_sql($g_user['user_id'], 'Number') .
                            ' AND `to_user` = ' . to_sql($userTo, 'Number') .
                            ' AND `from_user_deleted` = 0)) ';
            } else {
                $where = ' ((`to_user` = ' . to_sql($g_user['user_id'], 'Number') . ' AND `to_user_deleted` = 0)
                            OR
                            (`from_user` = ' . to_sql($g_user['user_id'], 'Number') . ' AND `from_user_deleted` = 0)) ';
            }

            $where .= self::getWhereNoSysytem();

            $listUsersOpen = array();

            if ($isUpdateMsgOpenListChats) {
                $listUsersOpen = self::jsonDecodeParamArray('users_list_open_im');
                if (!is_array($listUsersOpen)) {
                    $listUsersOpen = array();
                }
            }

            $fromUserWriting = array();
            if ($html->blockExists('update_writing_users')) {
                $fromUserWriting = self::getWritingUser(null, $userToOneChat);
            }

			$sql = 'SELECT *
					  FROM `im_msg`
					 WHERE ' . $where . '
					   AND id > ' . to_sql($lastId, 'Number') .
				   ' ORDER BY id ASC';
			DB::query($sql, 1);

			while ($row = DB::fetch_row(1))
			{
                $html->clean('message_list');
				if($lastId == $row['id']) {
					break;
				}

				$isUpdate = true;

                if ($g_user['user_id'] == $row['to_user']) {
					$received = true;
					$userTo = $row['from_user'];
                    if (isset($fromUserWriting[$userTo])) {
                        $fromUserWriting[$userTo] = 0;
                    }
				} else {
					$userTo = $row['to_user'];
				}
                /* Impact */
                $prevMsgUid = 0;
                self::parseResponderInfo($html, $row['from_user'], $prevMsgUid);
                /* Impact */

				self::parseImOneMsg($html, $row, true, 1, $isFbMode, $listUsersOpen);
                //$html->clean('message_responder');
                //$html->clean('message_answer');
				$html->parse('message_list', true);
			}

            $isVisibleMessages = get_param('is_visible_messages');
            if ($html->blockExists('update_writing_users') && $fromUserWriting && ($isVisibleMessages == 'true' || self::$isMobileOneChat)) {
                $updateWritingUsers = array();
                $deleteWritingUsers = array();
                foreach ($fromUserWriting as $user => $status) {
                    if ($status) {
                        $updateWritingUsers[$user] = 1;
                    } else {
                        $deleteWritingUsers[$user] = 1;
                    }
                }
                if ($updateWritingUsers) {
                    $isUpdate = true;
                    $html->setvar('update_writing_users', json_encode($updateWritingUsers));
                    $html->parse('update_writing_users', false);
                }

                if ($deleteWritingUsers) {
                    $isUpdate = true;
                    $where = '`to_user` = ' . to_sql(guid())
                      . ' AND `from_user` IN(' . self::getSqlImplodeKeys($deleteWritingUsers)  . ')';
                    DB::update('im_open', array('last_writing' => 0), $where);
                    $html->setvar('delete_writing_users', json_encode($deleteWritingUsers));
                    $html->parse('delete_writing_users', false);
                }
            }

            $isParseRead = self::parseReadMessage($html);

			if ($isUpdate || $isParseRead) {
				if ($received && $g_user['sound'] != 2) {
					$html->parse('sound');
				}
				self::lastId(false);
				//$html->setvar('last_id', self::getLastId());
				$html->parse('update_messages');
			}
		}
	}
	/* UPDATE */
    static function closeEmptyIm()
	{
        global $g_user;
        $responseData = false;
		if ($g_user['user_id'])	{
            self::setCurrentData();
            $sql = 'SELECT `to_user`
                      FROM `im_open`
                     WHERE `from_user` = ' . to_sql($g_user['user_id'], 'Number') .
                     ' AND `mid` = 1 ' . self::$demoWhere;
            DB::query($sql, 1);
            while ($row = DB::fetch_row(1)){
                $count = self::getCountMsgIm($row['to_user']);
                if (!$count) {
                    self::closeIm($row['to_user'], false);
                }
            }
            $responseData = true;
		}
        return $responseData;
    }

    static function closeEmptyOneIm($userTo)
	{
        $count = self::getCountMsgIm($userTo);
        if (!$count) {
            self::closeIm($userTo, false);
        }
    }

    static function closeSelectedIm($users = null)
	{
		global $g_user;

        $responseData = false;
		if ($g_user['user_id'])	{
			if ($users === null) {
				$users = get_param_array('delete_im');
			}
			if (!empty($users)) {
                foreach ($users as $userId => $value) {
                    self::closeIm($userId);
                }
                $responseData = true;
			}
		}
        return $responseData;
    }

	static function closeIm($userId = null, $isDeletedMsg = true)
	{
		global $g_user;

		if ($g_user['user_id'])	{
			if ($userId === null) {
				$userId = get_param('user_id');
			}
            if ($isDeletedMsg) {
                self::clearHistoryMessages($userId);
            }
			if (!empty($userId)) {
                self::setCurrentData();
				$where = '`to_user` = ' . to_sql($userId, 'Number') .
					' AND `from_user` = ' . to_sql($g_user['user_id'], 'Number') . self::$demoWhere;
				DB::delete('im_open', $where);
			}
		}
	}

	static function firstOpenIm($userId, $isUpdate = true, $isVisible = false, $lastMid = 0)
	{
		global $g_user;

        $guid = $g_user['user_id'];
		if (!$guid) return;

        self::setCurrentData();

		/*$where = '`to_user` = ' . to_sql($userId, 'Number') .
				 ' AND `from_user` = ' . to_sql($guid, 'Number');
        $whereDemo = $where . self::$demoWhere;
		$lastMid = DB::field('im_open', 'mid', $whereDemo);
		if ($lastMid && isset($lastMid[0])) {
            if ($isUpdate) {
                $mid = $lastMid[0] ? $lastMid[0] : 1;
                DB::update('im_open', array('mid' => $mid, 'z' => $z), $whereDemo, '', 1);
            }
		} else {*/
			/*$sql = "INSERT INTO `im_open`
					   SET `to_user`= " . to_sql($userId, 'Number') . ',
						   `from_user` = ' . to_sql($g_user['user_id'], 'Number') . ',
						   `mid` = 1,
						   `z` = ' . time() . self::$demoInsert;
			DB::execute($sql);*/
        $visible = '';
        if ($isVisible) {
            $visible = ", `im_open_visible` = 'Y'";
        }
        if ($lastMid) {
            $sql = 'INSERT INTO `im_open`
                       SET `from_user` = ' . to_sql($guid, 'Number') . ',
                           `to_user` = ' . to_sql($userId, 'Number') . ',
						   `mid` = ' . to_sql($lastMid, 'Number')
                           . $visible
                           . self::$demoInsert .
                      ' ON DUPLICATE KEY UPDATE
                            `mid` = ' . to_sql(to_sql($lastMid, 'Number')) . $visible;
        } else {
            $z = time();
            $zSql = $isUpdate ? ',`z` = ' . $z : '';
            $isNewMsg = self::getCountNewMessages($userId) ? 1 : 0;
            $sql = 'INSERT INTO `im_open`
                       SET `from_user` = ' . to_sql($guid, 'Number') . ',
                           `to_user` = ' . to_sql($userId, 'Number') . ',
						   `mid` = 1,
						   `z` = ' . $z . ','
                        . '`is_new_msg` = ' . $isNewMsg
                        . $visible
                        . self::$demoInsert .
                      ' ON DUPLICATE KEY UPDATE
                            mid = IF(mid > 0, mid, 1)' . $visible . $zSql;
        }
		DB::execute($sql);
		//}

		/*$where = '`from_user` = ' . to_sql($userId, 'Number') .
				 ' AND `to_user` = ' . to_sql($guid, 'Number') . self::$demoWhere;
		$isIm = DB::count('im_open', $where);
		if (!$isIm) {
			$sql = 'INSERT INTO `im_open`
 						    SET `from_user` = ' . to_sql($userId, 'Number') . ',
							    `to_user` = ' . to_sql($g_user['user_id'], 'Number') . ',
                                `mid` = 0'
                               . self::$demoInsert;
			DB::execute($sql);
		}*/

        $sql = 'INSERT IGNORE INTO `im_open`
                        SET `from_user` = ' . to_sql($userId, 'Number') . ',
                            `to_user` = ' . to_sql($guid, 'Number') . ',
						    `mid` = 0 '
                            . self::$demoInsert;
		DB::execute($sql);
	}

    static function getMidRequestPrivateAccess($userId)
    {
        $mid = 0;
        $where = self::getWhereMessagesTo($userId) . " AND `system` = 1 AND `msg` = 'private_photo_request'";
        $privatPhotoRequest = DB::field('im_msg', 'id' , $where);
        if (!empty($privatPhotoRequest) && isset($privatPhotoRequest[0])) {
              $mid = $privatPhotoRequest[0];
        }
        return $mid;
    }

    static function sendRequestMsgPrivateAccess($userTo, $date = null)
    {
        if ($date === null) {
            $date = date('Y-m-d H:i:s');
        }
        self::addMessageToDb($userTo, 'private_photo_request', $date, 1, 0, true, true, 1);
        self::addMessageToDb($userTo, 'private_photo_report', $date, 0, 1, true, true, 1, 1);
    }

    static function updateSystemMessagePrivateAccess($userTo, $typeMsg, $typeMsgAddDb, $date = null,  $mid = null)
    {
        if ($date === null) {
            $date = date('Y-m-d H:i:s');
        }
        if ($mid === null) {
            $mid = self::getMidRequestPrivateAccess($userTo);
        }
        if ($mid) {
            self::updateCustomMessageToDb($mid, $userTo, $typeMsg);
        }
        self::addMessageToDb($userTo, $typeMsgAddDb, $date, 1, 0, true, true, 1);
        self::closeEmptyOneIm($userTo);
    }

	static function sendRequestPrivateAccess($userTo = null, $type = null)
    {
        global $g_user;

        $response = false;

        if ($g_user['user_id']) {
            if ($userTo === null) {
                $userTo = get_param('user_to', 0);
            }
            if (empty($userTo)) {
                return false;
            }
            $fromDelete = 1;
            $toDelete = 0;
            $date = date('Y-m-d H:i:s');
            $mid = get_param('mid',0);
            if ($type === null) {
                $type = get_param('type', 'request_access');
            }
            $isFriendRequestExists = User::isFriendRequestExists($userTo, $g_user['user_id']);
            $isFriend = User::isFriend($userTo, $g_user['user_id']);
            if ($type == 'request_access') {
                $user = User::getInfoBasic($userTo);
                if (!empty($user)) {
                    if (!$isFriendRequestExists && !$isFriend) {
                        User::friendRequestSend($user, '', false);
                    }
                    self::sendRequestMsgPrivateAccess($userTo);
                    $response = true;
                }
            } elseif ($type == 'request_approved') {
                //if ($isFriendRequestExists) {
                    User::friendApprove($userTo, $g_user['user_id'], false, false);
                    self::updateSystemMessagePrivateAccess($userTo, 'you_granted_access', 'private_photo_request_approved', $date, $mid);
                    $response = true;
                //}
            } elseif ($type == 'request_declined') {
                $response = self::sendPrivateDeclined($userTo, $mid, $isFriend, $isFriendRequestExists);
            }
        }
        return $response;
    }

    static function sendPrivateDeclined($userTo, $mid = null,  $isFriend = null, $isFriendRequestExists = null)
    {
        global $g_user;

        if ($mid === null) {
            $mid = get_param('mid', 0);
        }
        if ($isFriend === null) {
            $isFriend = User::isFriend($userTo, $g_user['user_id']);
        }
        if ($isFriendRequestExists === null) {
            $isFriendRequestExists = User::isFriendRequestExists($userTo, $g_user['user_id']);
        }

        $isAction = false;
        if ($isFriend) {
            User::friendDelete($userTo, $g_user['user_id']);
            self::updateSystemMessagePrivateAccess($userTo, 'private_photo_request_declined', 'private_photo_request_declined', null, $mid);
        } else if ($isFriendRequestExists) {
            User::friendDecline($userTo, $g_user['user_id']);
            if ($isFriendRequestExists == $g_user['user_id']) {
                $where = "`to_user` = " . to_sql($userTo)
                       . " AND `from_user` = " . to_sql($g_user['user_id'])
                       . "  AND `system` = 1 AND (`msg` = 'private_photo_request' OR `msg` = 'private_photo_report')";
                DB::delete('im_msg', $where);
            } else {
                self::updateSystemMessagePrivateAccess($userTo, 'private_photo_request_declined', 'private_photo_request_declined', null, $mid);
            }
        }

        return true;
    }

    static function updateCustomMessageToDb($mid = 0, $userTo, $msg)
    {
        global $g_user;
        $data = array('from_user' => $g_user['user_id'],
                      'to_user' => $userTo,
                      'name' => $g_user['name'],
                      'msg' => $msg,
                      'from_user_deleted' => 0,
                      'to_user_deleted' => 1);
        DB::update('im_msg', $data, '`id` = ' . to_sql($mid ,'Number'));
    }


    static function addMessageToDb($userTo, $msg, $date = null, $fromDelete = 0, $toDelete = 0, $firstIm = false, $popularity = true, $system = 0, $is_new = 1, $send = 0)
    {
        global $g_user;

        //if ($firstIm) {
        $optionTmplName = Common::getOption('name', 'template_options');
        $visible = false;
        if ($optionTmplName == 'impact') {
            $visible = true;
        }
        self::firstOpenIm($userTo, true, $visible);//???????????
        //}
        if ($date === null) {
            $date = date('Y-m-d H:i:s');
        }
        $translated = '';
        $systemType = 0;
        if (!$system) {
            $translated=self::getTranslate($msg,$userTo);
        } elseif ($msg == 'welcoming_message') {
            $systemType = 1;
        }

        $userToSql = to_sql($userTo, 'Number');
        $gUser = to_sql($g_user['user_id'], 'Number');
		$sql = 'INSERT INTO `im_msg`
				   SET `from_user` = ' . $gUser . ',
                       `to_user` = ' . $userToSql . ',
					   `born` = ' . to_sql($date) . ',
					   `ip` = ' . to_sql(IP::getIp()) . ',
					   `name` = ' . to_sql($g_user['name']) . ',
					   `msg` = ' . to_sql($msg) . ',
					   `msg_translation` = ' . to_sql($translated) . ',
                       `from_user_deleted` = ' . $fromDelete . ',
                       `to_user_deleted` = ' . $toDelete . ',
                       `system` = ' . to_sql($system) . ',
                       `system_type` = ' . to_sql($systemType) . ',
					   `send` = ' . to_sql($send) . ',
                       `is_new` = ' . to_sql($is_new);
        DB::execute($sql);
        $lastMid = DB::insert_id();

        if(IS_DEMO && !$system) {
            Demo::addImMessage($gUser, $userToSql, $date, $msg);
        }

        if(self::isContactReplyItemExists($gUser, $userToSql)) {
            self::markContactAsReplied($gUser, $userToSql);
        } else {
            self::addContactReplyItem($userToSql, $gUser);
        }

        $sqlData = array('mid' => $lastMid);
        $isActiveSpecialDelivery = Common::isActiveFeatureSuperPowers('special_delivery');
        if (Common::isOptionActive('free_site')
              || (($isActiveSpecialDelivery && User::isSuperPowers())
                    ||!$isActiveSpecialDelivery)) {
            $sqlData['z'] = time();
        }

        self::setCurrentData();

        $isUpdateFromIm = true;
        if ($msg == 'welcoming_message' && $system) {
            $lastMid = 1;
            $isUpdateFromIm = false;
        }
        self::firstOpenIm($userTo, true, $visible, $lastMid);
        self::updateLastIdFromAddMessage($userTo, $lastMid, $sqlData, $is_new, $isUpdateFromIm);

        if ($popularity) {
            User::updatePopularity($userTo);
        }
        return $lastMid;
    }

    static function updateLastIdFromAddMessage($userTo, $lastMid, $sqlData = null, $isNew = null, $isUpdateFromIm = true)
    {
        self::setCurrentData();

        if ($sqlData === null) {
            $sqlData = array('mid' => $lastMid, 'z' => time());
        }

        $userToSql = to_sql($userTo, 'Number');
        $gUser = to_sql(guid(), 'Number');

        if ($isUpdateFromIm) {
            $where = '`from_user` =  ' . $gUser . ' AND `to_user` =  ' . $userToSql;//For demo . self::$demoWhere
            DB::update('im_open', $sqlData, $where);//For demo , '', 1
        }

        $where = '`from_user` =  ' . $userToSql . ' AND `to_user` =  ' . $gUser;//For demo  . self::$demoWhere
        if ($isNew === null || $isNew) {
            $sqlData['is_new_msg'] = 1;
        }
        DB::update('im_open', $sqlData, $where);//For demo , '', 1
    }

	static function addMessage(&$html, $userTo = null, $msg = null, $parseMsg = true)
    {
        global $g;
		global $g_user;

		if ($userTo === null) {
			$userTo = get_param('user_to', 0);
		}

		if ($msg === null) {
			$msg = get_param('msg');
		}

        $msg = trim($msg);
        $fromDelete = get_param('from_delete', 0);
        $toDelete = get_param('to_delete', 0);
        $send = get_param('send', 0);

        $cmd = get_param('cmd');
        if ($cmd == 'send_message' && get_param_int('retry')) {
            $sql = 'SELECT `id` FROM `im_msg`
                     WHERE `from_user` = ' . to_sql($g_user['user_id']) .
                     ' AND `to_user` = ' . to_sql($userTo) .
                     ' AND `send` = ' . to_sql($send);
            $isAlreadySent = DB::result($sql);
            if ($isAlreadySent) {
                return false;
            }
        }

		$row = array();
        $responseData = false;
		if ($g_user['user_id'] && $userTo && $msg != '') {
			$optionTmplName = Common::getOption('name', 'template_options');
            $blockMsg = 'message';
            $isFreeSite = Common::isOptionActive('free_site');
            $isSuperPowers = User::isSuperPowers();
            $isCreditsEnabled = Common::isOptionActive('credits_enabled');
            $system = 0;
            //$isBlocked = User::isBlocked('im', $userTo, $g_user['user_id']);
            $isBlocked = User::isEntryBlocked($userTo, $g_user['user_id']);
            $isNotifSend = true;
            $cost=Pay::getServicePrice('message','credits');
            $notMsgToDb = false;
            if ($isBlocked) {
                $msg = 'sent_to_block_list';
                $system = 1;
                $isNotifSend = false;
                //$toDelete = 1;
                $notMsgToDb = true;
            } elseif (!$isFreeSite && !$isSuperPowers) {
                $notAllowedChatWithPopularUsers = Common::isOptionActive('not_allowed_chat_with_popular_users', 'template_options');
                $numberSpMsgDay = $g_user['sp_sending_messages_per_day'] + 1;
                if ($numberSpMsgDay > Common::getOption('sp_sending_messages_per_day_urban')) {
                    $gender = User::getInfoBasic($userTo, 'gender');
                    $msg = 'msg_limit_is_reached_' . mb_strtolower($gender, 'UTF-8');
                    $system = 1;
                    $isNotifSend = false;
                    //$toDelete = 1;
                    $notMsgToDb = true;
                } elseif (!$notAllowedChatWithPopularUsers
                            && User::getLevelOfPopularity($userTo) == 'very_high'
                                && Common::isActiveFeatureSuperPowers('chat_with_popular_users')) {
                    $gender = User::getInfoBasic($userTo, 'gender');
                    $msg = 'sent_to_user_popular_' . mb_strtolower($gender, 'UTF-8');
                    $system = 1;
                    $isNotifSend = false;
                    //$toDelete = 1;
                    $notMsgToDb = true;
                } else  {
                    User::update(array('sp_sending_messages_per_day' => $numberSpMsgDay));
                }
            }

            if($isCreditsEnabled && $isNotifSend){
                if($g_user['credits']>=$cost){
                    $data = array('credits' => $g_user['credits']-$cost);
                    User::update($data);
                    $row['new_credits']=$g_user['credits']-$cost;
                } else {
                    $gender = User::getInfoBasic($userTo, 'gender');
                    $msg = 'no_credits_for_msgs_' . mb_strtolower($gender, 'UTF-8');
                    $system = 1;
                    $isNotifSend = false;
                   // $toDelete = 1;
                    $notMsgToDb = true;
                }
            }

			self::setCurrentData();

			$msg = str_replace("<", "&lt;", $msg);
            $msg = censured($msg);

            $date = date('Y-m-d H:i:s');
            if ($notMsgToDb) {
                $lastMid = 'system_' . time();
            }else{
                $lastMid = self::addMessageToDb($userTo, $msg, $date, $fromDelete, $toDelete, false, true, $system, 1, $send);
                CStatsTools::count('im_messages');
            }
   		    $row['from_user'] = $g_user['user_id'];
            $row['to_user'] = $userTo;
            $row['msg'] = $msg;
			$row['id'] = $lastMid;
			$row['born'] = $date;
			$row['name'] = $g_user['name'];
			$row['is_new'] = 1;
            $row['system'] = $system;
			$row['send'] = $send;
            if ($parseMsg) {
                self::parseImOneMsg($html, $row, true, 0);
            }

            $userInfo = User::getInfoBasic($userTo);
            if ($isNotifSend
                && Common::isEnabledAutoMail('new_message')
                && User::isOptionSettings('set_notif_new_msg', $userInfo)
                && !User::isOnline($userTo, $userInfo)) {
                $vars = array('title' => Common::getOption('title', 'main'),
                              'name' => $userInfo['name'],
                              'uid' => $userTo,
                              'name_sender'  => $g_user['name'],
                              'uid_sender' => $g_user['user_id'],
                              'url_site' => Common::urlSite());
                Common::sendAutomail($userInfo['lang'], $userInfo['mail'], 'new_message', $vars);
            }
            if ($parseMsg) {
                $html->parse($blockMsg . '_list');
            }
            /* Imapct mobile */
            if (get_param('send_msg_from_profile') && $notMsgToDb) {
                if ($msg == 'sent_to_block_list') {
                    $responseData = 'you_are_in_block_list';
                } elseif ($msg == 'msg_limit_is_reached_f' || $msg == 'msg_limit_is_reached_m') {
                    $responseData = $msg;
                }else{
                    $responseData = 'buy_credits';
                }
            }else{
               $responseData = true;
            }
		}
        return $responseData;
	}

	static function parseTitleIm(&$html, $toUser, $show, $userInfo = null)
    {
        $guid = guid();

		if ($userInfo === null) {
			$userInfo = User::getInfoBasic($toUser);
		}

		if ($userInfo) {

            $cmd = get_param('cmd');
            $isOpenImImpact = $cmd == 'open_im_with_user';

			$html->setvar('user_to_id', $toUser);
			$html->setvar('user_to_profile_link', User::url($toUser, $userInfo));

            $sizePhoto = 'r';
            if ($isOpenImImpact) {
                $sizePhoto = 'm';
            }
            $photoUserTo = User::getPhotoDefault($toUser, 'r', false, $userInfo['gender']);

			$html->setvar('user_to_photo', $photoUserTo);
            $html->setvar('user_to_age', $userInfo['age']);
			$html->setvar('user_to_city', l($userInfo['city']));

			$html->setvar('user_to_name', $userInfo['name']);
            $varNameShort = 'user_to_name_short';
            if ($html->varExists($varNameShort)) {
                $html->setvar($varNameShort, User::nameOneLetterFull($userInfo['name']));
            }

            // DUBL take UserFields->parseInterests
			$userInterests = User::getInterests($toUser);

			if (!empty($userInterests) && !$isOpenImImpact) {
                $guidInterests = User::getInterests(guid());
                $userInterestsAll = array();
                $guidInterestsAll = array();

                foreach ($guidInterests as $item) {
                    $guidInterestsAll[$item['id']] = $item;
                    $guidInterestsAll[$item['id']]['main'] = 1;
                }
                foreach ($userInterests as $item) {
                    $userInterestsAll[$item['id']] = $item;
                }
                $userInterests = array_merge(array_intersect_key($guidInterestsAll, $userInterestsAll), array_diff_key($userInterestsAll, $guidInterestsAll));

                $i = 0;
                $j = 0;
                foreach ($userInterests as $item) {
                    if ($i == 4) {
                        break;
                    }
                    $html->setvar('cat_id', $item['category']);
                    $titleUpper = mb_ucfirst($item['interest']);
                    $html->setvar('interest', $titleUpper);
                    $html->setvar('interest_he', he($titleUpper));
                    $html->setvar('int_id', $item['id']);
                    if (isset($item['main'])) {
                        $j++;
                        $html->parse('main_interest', false);
                        $type = 'shared';
                    } else {
                        $type = 'normal';
                        $html->clean('main_interest');
                    }
                    $html->setvar('interest_class', UserFields::getArrayNameIcoField('interests', $item['category'], $type));

                    $html->parse('interest_item', true);
                    $i++;
                }
                // interest_dots_custom - Out of UserFields->parseInterests
                if ($j == 4) {
                    $html->parse('interest_dots_custom');
                }

				$html->parse('list_interest', false);
                $html->clean('interest_item');
			} else {
				$html->clean('list_interest');
			}

            if (Common::isOptionActive('videochat')){
                $html->parse('videochat_button', false);
            }

            if (Common::isOptionActive('audiochat')){
                $html->parse('audiochat_button', false);
            }

            if (City::isActiveStreetChat()) {
                $html->parse('citychat_button', false);
            }

            if (!User::isFriend($toUser, $guid)
                && User::isFriendRequestExists($toUser, $guid) != $guid) {
                $html->parse('friend_add', false);
            } else {
                $html->clean('friend_add');
            }

            $html->parse('user_info_name', false);

			if (!$show) {
				$html->parse('user_info_hide', false);
				$html->parse('user_pic_hide', false);
			} else {
				$html->setvar('current_user_to_id', $toUser);
			}
			$html->parse('user_to_info');
		}
	}

    static function parseStatusOnline(&$html, $toUser, $userInfo = null)
    {
        if ($userInfo === null) {
			$userInfo = User::getInfoBasic($toUser);
		}

        $isOnline = User::isOnline($toUser, $userInfo);
        if ($isOnline) {
            $online = 1;
			$html->parse('status_online', false);
			$html->clean('status_offline');
		} else {
            $online = 0;
            $html->parse('status_offline', false);
			$html->clean('status_online');
		}
        $html->setvar('status_online', $online);
        if ($html->varExists('open_im_active')) {
            $html->setvar('open_im_active', $isOnline ? 'active' : 'noactive');
        }
    }

	static function parseInfoUserToIm(&$html, $toUser, $userInfo = null)
    {
        global $g_user;

		if ($userInfo === null) {
			$userInfo = User::getInfoBasic($toUser);
		}
		if ($userInfo) {
            $lastMsg = '';
            /* EDGE */
            if (isset($userInfo['last_msg'])) {
                if ($userInfo['last_msg']) {
                    $lastMsg = self::grabsRequestNotif($userInfo['last_msg'], $userInfo['last_msg_system']);
                    /*if ($userInfo['last_msg_system']) {//only "welcoming_message"
                        $lastMsg = self::grabsRequest($userInfo['last_msg'], $userInfo['last_msg_from_user'], $userInfo['last_msg_to_user']);
                    } else {
                        $lastMsg = Common::parseLinksTag(to_html($userInfo['last_msg']), 'a', '&lt;', 'parseLinksSmile');
                    }*/
                } elseif ($userInfo['last_msg_system'] === NULL) {//Fix last msg gift - rarely can be met
                    $sql = 'SELECT * FROM `im_msg`
                             WHERE `from_user_deleted` = 0
                               AND ((`from_user` = ' . to_sql($g_user['user_id']) . ' AND `to_user` = ' . to_sql($toUser) . ')
                                OR (`from_user` = ' . to_sql($toUser) . ' AND `to_user` = ' . to_sql($g_user['user_id']) . '))' .
                              self::getWhereNoSysytem('') .
                           ' ORDER BY `id` DESC LIMIT 1';
                    $lastMsgInfo = DB::row($sql, DB_MAX_INDEX);
                    if (isset($lastMsgInfo['msg'])) {
                        $lastMsg = self::grabsRequestNotif($lastMsgInfo['msg'], $lastMsgInfo['system']);
                    }
                }
                if ($userInfo['last_msg_from_user'] == guid() && $lastMsg) {
                    $lastMsg = lSetVars('you_message', array('message' => $lastMsg));
                }
            }
            /* EDGE */
            $vars = array('user_id'  => $toUser,
                          'name'     => $userInfo['name'],
                          'photo'    => User::getPhotoDefault($toUser, 'r', false, $userInfo['gender']),
                          'last_msg' => $lastMsg);
            $html->assign('list_users_item', $vars);

            self::parseStatusOnline($html, $toUser, $userInfo);
        }
	}

    static function cleanBlockMsg(&$html, $noCleanBlock)
    {
        $blocks = array('message_text',
                        'message_gift');
        foreach ($blocks as $block) {
            if ($block != $noCleanBlock) {
                $html->clean($block);
            }
        }
    }

    static function grabsRequestNotifToAttr($msg, $system)
    {
        $msgNotif = self::grabsRequestNotif($msg, $system);
        $msgNotif = str_replace(array("\r\n", "\n"), ' ', $msgNotif);
        return toAttr($msgNotif);
    }

    static function grabsRequestNotif($msg, $system)
    {
        if (!$system) {
            return $msg;
        }
        $types = array('private_photo_request_approved',
                       'private_photo_request_declined',
                       'private_photo_request',
                       '{gift:',
                       'welcoming_message');
        foreach ($types as $type) {
            if (stristr($msg, $type) !== false) {
                if ($type == '{gift:') {
                    $msg = l('sent_you_a_gift');
                } else if ($type == 'private_photo_request') {
                    $msg = l('private_photo_report');
                } else if ($type == 'private_photo_request_approved') {
                    $msg = l('private_photo_request_approved_notif');
                } else if ($type == 'welcoming_message') {
                    $emailAuto = Common::sendAutomail(Common::getOption('lang_loaded', 'main'), '','welcoming_message', array('name' => guser('name')), false, DB_MAX_INDEX, true);
                    $msg = $emailAuto['text'];
                } else {
                    $msg = l($type);
                }
                break;
            }
        }
        return $msg;
    }

    static function grabsRequest($msg, $msgUserId, $toUserId)
    {
        $types = array('private_photo_request',
                       'private_photo_report',
                       'private_photo_request_approved',
                       'private_photo_request_declined',
                       'private_photo_you_granted_access',
                       'sent_to_user_popular_f',
                       'sent_to_user_popular_m',
                       'msg_limit_is_reached_f',
                       'msg_limit_is_reached_m',
                       'sent_to_block_list',
                       'no_credits_for_msgs_m',
                       'no_credits_for_msgs_f',
                       'welcoming_message',
                       );
        $craftedMsg = '';
        if (!empty($msg)) {
            $optionTmplName = Common::getOption('name', 'template_options');
            foreach ($types as $type) {
                if(stristr($type, $msg) !== FALSE) {
                    if ($type == 'private_photo_request') {
                        $attrLink = array('class' => 'photo_grant_access',
                                          'data-user-id' => $msgUserId);
                        $vars = array('url' => '');
                        $craftedMsg = Common::lSetLink($type, $vars, false, '', $attrLink);
                        $attrLink1 = array('class' => 'photo_deny_access',
                                           'data-user-id' => $msgUserId);
                        $craftedMsg = Common::lSetLink($craftedMsg, $vars, false, 1, $attrLink1);
                    } elseif ($type == 'private_photo_request_approved') {
                        $attrLink = array();
                        $vars = array('url' => 'search_results.php?display=profile&uid=' . $msgUserId . '&show=gallery');
                        if ($optionTmplName == 'urban_mobile') {
                            $vars['url'] = 'profile_view.php?user_id=' . $msgUserId;
                        }elseif ($optionTmplName == 'impact_mobile') {
                            $attrLink = array('class' => 'go_to_albums',
                                              'data-layer-loader' => 'true');
                            $vars['url'] = 'profile_view.php?user_id=' . $msgUserId.'&show=albums';
                        }
                        $craftedMsg = Common::lSetLink('private_photo_request_approved', $vars, false, '', $attrLink);
                    } elseif ($type == 'sent_to_user_popular_f' || $type == 'sent_to_user_popular_m') {
                        if ($optionTmplName == 'urban_mobile') {
                            $url = 'profile_view.php?user_id=';
                        } else {
                            $url = 'search_results.php?display=profile&uid=';
                        }
                        $vars = array('name' => User::getInfoBasic($toUserId, 'name', 5),
                                      'url' =>  $url . $toUserId);
                        $craftedMsg = Common::lSetLink($type, $vars);
                        $vars = array('url' => 'upgrade.php');
                        $craftedMsg = Common::lSetLink($craftedMsg, $vars, false, 1);
                    } elseif ($type == 'msg_limit_is_reached_f' || $type == 'msg_limit_is_reached_m') {
                        $vars = array('number' => Common::getOption('sp_sending_messages_per_day_urban'),
                                      'url' => 'upgrade.php');
                        $craftedMsg = Common::lSetLink($type, $vars, false, '', array(), 'l', true);
                    } elseif ($type == 'no_credits_for_msgs_m' || $type == 'no_credits_for_msgs_f') {
                        $attr = array();
                        if ($optionTmplName == 'urban_mobile' || $optionTmplName == 'impact_mobile') {
                            $url = 'upgrade.php?action=refill_credits';
                            if ($optionTmplName == 'impact_mobile') {
                                $url = 'upgrade.php?action=refill_credits&service=message&request_uid=' . $toUserId;
                                $attr = array('class' => 'refill_credits go_to_page',
                                              'data-cl-loader' => 'loader_msg_access');
                            }
                        } elseif($optionTmplName == 'impact') {
                            $url = '';
                            $attr = array('class' => 'credits_balans');
                        } else {
                            $url = 'increase_popularity.php';
                        }
                        $vars = array('url' => $url);
                        $craftedMsg = Common::lSetLink($type, $vars, false, '', $attr);
                    } elseif ($type == 'welcoming_message') {
                        $vars = array('name' => User::getInfoBasic($toUserId, 'name'));
                        $emailAuto = Common::sendAutomail(Common::getOption('lang_loaded', 'main'), '','welcoming_message', $vars, false, DB_MAX_INDEX, true);
                        $craftedMsg = $emailAuto['text'];
                    } else {
                        $craftedMsg = l($type);
                    }
                    break;
                }
            }
        }
        return $craftedMsg;
    }

    static function grabsMsg(&$html, $msg, $msgUserId, $toUserId)
    {
        global $g_user;

        $blockMsg = 'message';
        $gift = grabs($msg, '{gift:', '}');
        $giftCrd = 0;
        $isGiftsDisabled = false;
        if (isset($gift[0])) {
            self::cleanBlockMsg($html, $blockMsg . '_gift');
            $giftInfo = explode(':', $gift[0]);
            $giftId = $giftInfo[0];
            $giftImg = $giftInfo[1];
            if(count($giftInfo)>2 && Common::isTransferCreditsEnabled()){
                $giftCrd = $giftInfo[2];
            }
            $msgGift = DB::result('SELECT `text` FROM `user_gift` WHERE `id` = ' . to_sql($giftId, 'Number'), 0, 3);
            $urlImg = ProfileGift::getUrlImg($giftImg);

            $isGiftsDisabled = Common::isOptionActiveTemplate('gifts_disabled');
            if ($isGiftsDisabled) {
                $msg = trim(str_replace("{gift:{$giftId}:{$giftImg}:{$giftCrd}}", '<img height="20" src=' . $urlImg . " />  {$msgGift}", $msg));
            } else {
                $html->setvar('gift_img_url', $urlImg);

                if($giftCrd>0){
                    $msgGift = trim($msgGift.' + '.lSetVars('credit_balance',array('credit'=>$giftCrd)));
                    $html->setvar('credits', $g_user['credits']);
                    $html->parse($blockMsg . '_set_credits', false);
                }

                if ($msgGift){
                    $html->setvar('gift_text', $msgGift);
                    $html->parse($blockMsg . '_gift_text');
                }
                $html->parse($blockMsg . '_gift', false);
                $html->clean('message_gift_text');
            }
        }
        if (!$gift || $isGiftsDisabled) {
            self::cleanBlockMsg($html, $blockMsg . '_text');
            $requestPrivatePhotoMsg = self::grabsRequest($msg, $msgUserId, $toUserId);
            if($requestPrivatePhotoMsg != ''){
                $msg = $requestPrivatePhotoMsg;
            }
            $html->setvar($blockMsg, $msg);
            $html->parse($blockMsg . '_text', false);
        }

    }

	static function parseImOneMsg(&$html, $row, $js = false, $update = 0, $isFbMode = 'false', $listUsersOpen = array())
    {
		global $g_user, $g;

		if (!empty($row) && is_array($row)) {
            $optionTmplName = Common::getOption('name', 'template_options');
            $typeIm = Common::getOptionTemplate('im_type');
            $cmd = get_param('cmd');
            $userCurrent = get_param('user_current');
            $showIm = intval(get_param('show_im', 0));
            $isMyMsg = $row['from_user'] == $g_user['user_id'];
            $isAdmin = $row['to_user'] == $g_user['user_id'] && $row['system'];
            $isUpdateMsgOpenListChats = get_param('display') == 'update_msg_open_list_chats';
            if ($g_user['user_id'] == $row['to_user']) {
        		$userTo = $row['from_user'];
			} else {
    			$userTo = $row['to_user'];
			}
            if(!$isMyMsg){
                $row=self::switchOnTranslate($row);
            } else {
                $row['msg_translation']='';
            }

            $blockMsg = 'message';
            if ($html->varExists("{$blockMsg}_notif")) {//Edge
                $html->setvar("{$blockMsg}_notif", self::grabsRequestNotifToAttr($row['msg'], $row['system']));
            }
			$msg = Common::parseLinksTag(to_html($row['msg']), 'a', '&lt;', 'parseLinksSmile');
			$html->setvar('tit_class', $isMyMsg ? 'blue' : 'green');

            /* Mobile */
            if ($html->varExists($blockMsg . '_whose')) {
                $html->setvar($blockMsg . '_whose', $isMyMsg ? 'right' : 'left');
            }
            /* Mobile */
		    $html->setvar($blockMsg . '_send', $row['send']);
            $html->setvar($blockMsg . '_id', $row['id']);

			$html->setvar($blockMsg . '_user_id', $row['from_user']);
            $html->setvar($blockMsg . '_user_name', $row['name']);
            $html->setvar($blockMsg . '_user_profile_link', User::url($row['from_user']));

            $userInfo = User::getInfoBasic($row['from_user'], false, 3);
            $formatName = 'im_datetime';
            $isSetRead = ((!$isMyMsg && $row['is_new'] == 1) || $isAdmin) && $isFbMode == 'false';
            $isSetDate = true;
            if ($optionTmplName == 'urban_mobile') {
                if(self::$isNotificationParsed) {
                    $html->clean($blockMsg . '_new');
                }
                $formatName = self::getFormatDateMobile($row['born']);
                //mark read one since not all at once deduces
                if (self::$isMobileOneChat && !$isMyMsg && $row['is_new'] == 1) {
                //if (self::$isMobileOneChat && $isSetRead) {
                    if(!self::$isNotificationParsed) {
                        $html->setvar($blockMsg . '_notification_text', addslashes(lSetVars('app_notification_text', array('name' => User::nameShort($row['name'])))));
                        $html->parse($blockMsg . '_new', false);
                        self::$isNotificationParsed = true;
                    }
                    if ($isSetRead) {
                        self::setMessageAsReadOneMsg($row['id'], $row['from_user']);
                    }
                }
            } elseif ($optionTmplName == 'impact' || $optionTmplName == 'impact_mobile') {
				$isSetDate = false;
                if (!self::$isMobileOneChat && !self::$isPageListChats && $cmd != 'open_im_with_user') {
                    $g['date_formats']['im_general_impact_part_1'] = 'j M';
                    $g['date_formats']['im_general_impact_part_2'] = 'Y';
                    $html->setvar($blockMsg . '_date_part_1', Common::dateFormat($row['born'], 'im_general_impact_part_1', false));
                    $html->setvar($blockMsg . '_date_part_2', Common::dateFormat($row['born'], 'im_general_impact_part_2', false));
                }else{
					$html->setvar($blockMsg . '_date', timeAgo($row['born'], 'now', 'string', 60, 'second'));
                    if ($isSetRead) {
                         if ($isUpdateMsgOpenListChats) {
                            if(isset($listUsersOpen[$userTo])&&$listUsersOpen[$userTo]){//read only open im
                                self::setMessageAsReadOneMsg($row['id'], $row['from_user']);
                            }
                        }else{
                            self::setMessageAsReadOneMsg($row['id'], $row['from_user']);
                        }
                    }
				}

                /* Impact общая страница IM*/
                if ($html->varExists('user_from_photo')) {
                    $userRespondentId = $row['from_user'];
                    if ($isMyMsg && !self::$isMobileOneChat) {
                        $userRespondentId = $row['to_user'];
                    }
                    $userRespondent = User::getInfoBasic($userRespondentId, false, 3);
                    $keyPhotoRespondent = 'user_respondent_photo_im_' . $userRespondentId;
                    $keyPhotoPlugPrivatePhoto = 'user_plug_private_photos_' . $userRespondentId;
                    $userPhotoUrl = Cache::get($keyPhotoRespondent);
                    if ($userPhotoUrl === null) {
                        $sizePhoto = 'r';
                        if ($optionTmplName == 'impact_mobile') {
                            $sizePhoto = 'm';
                        }
                        $userPhotoUrl = User::getPhotoDefault($userRespondentId, $sizePhoto, false, $userRespondent['gender']);
                        Cache::add($keyPhotoRespondent, $userPhotoUrl);
                        $userPhotoId = User::getPhotoDefault($userRespondentId, $sizePhoto, true);
                        $isPlugPrivate = User::isVisiblePlugPrivatePhotoFromId($userRespondentId, $userPhotoId);
                        Cache::add($keyPhotoPlugPrivatePhoto, $isPlugPrivate);
                    }
                    $html->setvar('user_from_photo', $userPhotoUrl);
                    $html->setvar('user_from_url', User::url($userRespondentId));
                    if ($html->blockExists('message_plug_private_photos') && !$isMyMsg) {
                        if (Cache::get($keyPhotoPlugPrivatePhoto)) {
                            $html->parse('message_plug_private_photos', false);
                        } else {
                            $html->clean('message_plug_private_photos');
                        }
                    }
                }

                $countNewMsg = 0;
                if ($html->varExists('user_from_new_msg_count')) {
                    $countNewMsg = self::getCountNewMessages($userRespondentId);
                    $html->setvar('user_from_new_msg_count', $countNewMsg);
                }

                if ($html->varExists('user_from_name')) {
                    $name = $userInfo['name'];
                    $titleNewMsgCount = '';
                    if ($isMyMsg) {
                        $name = lSetVars('you_to_msg', array('name' => $userRespondent['name']));
                    } elseif ($countNewMsg > 1){
                        $titleNewMsgCount = lSetVars('general_im_title_count', array('count' => $countNewMsg));
                    }
                    $html->setvar('user_from_title_new_msg_count', $titleNewMsgCount);
                    $html->setvar('user_from_name', $name);
                }
                if ($html->varExists('user_from_one_name')) {
                    $html->setvar('user_from_one_name', $userInfo['name']);
                }
                /*Impact*/
            } elseif (($cmd == 'update_im' && $row['from_user'] == $userCurrent) && $isSetRead) {
                self::setMessageAsReadOneMsg($row['id'], $row['from_user']);
            }

            if ($isSetDate) {
                if ($typeIm == 'edge') {
                    $html->setvar($blockMsg . '_date', timeAgo($row['born'], 'now', 'string', 60, 'second'));
                } else {
                    $html->setvar($blockMsg . '_date', Common::dateFormat($row['born'], $formatName, false));
                }
            }

            $isFreeSite = Common::isOptionActive('free_site');
            //$goldDays = User::getInfoBasic($row['from_user'], 'gold_days', 3);

            /* Cache */
            $keyCache = 'is_active_feature_special_delivery';
            $isActiveSpecialDelivery = Cache::get($keyCache);
            if ($isActiveSpecialDelivery === null) {
                $isActiveSpecialDelivery = Common::isActiveFeatureSuperPowers('special_delivery');
                Cache::add($keyCache, $isActiveSpecialDelivery);
            }

            $keyCache = 'is_super_powers_' . $row['from_user'];
            $isSuperPowersFromUser = Cache::get($keyCache);
            if ($isSuperPowersFromUser === null) {
                $isSuperPowersFromUser = User::isSuperPowers($userInfo['gold_days'], $userInfo['orientation']);
                Cache::add($keyCache, $isSuperPowersFromUser);
            }
            /* Cache */

            $isSpecialDelivery = $isFreeSite || (($isActiveSpecialDelivery && $isSuperPowersFromUser)||!$isActiveSpecialDelivery);
            if (IS_DEMO) {
                $isSpecialDelivery = $isSpecialDelivery || in_array($row['from_user'], array(12, 454, 439, 443));
            }
            $html->setvar($blockMsg . '_user_special_delivery', intval($isSpecialDelivery));
            $html->setvar($blockMsg . '_user_is_new', intval($row['is_new']));
            $html->setvar($blockMsg . '_to_user_id', $isMyMsg ? $row['to_user'] : $row['from_user']);
			$html->setvar($blockMsg . '_update', $update);
            // check in the basic version
			if (Common::allowedFeatureSuperPowersFromTemplate('message_read_receipts')) {
                $keyCache = 'is_message_read_receipts_' . $row['from_user'];
                $isMessageReadReceipts = Cache::get($keyCache);
                if ($isMessageReadReceipts === null) {
                    $isMessageReadReceipts = User::accessCheckFeatureSuperPowers('message_read_receipts', $userInfo['gold_days'], $userInfo['orientation']);
                    Cache::add($keyCache, $isMessageReadReceipts);
                }
				if($isMessageReadReceipts) {
					$html->parse('upgrade_hide', false);
					if ($row['is_new'] == 0 && $isMyMsg && !$isAdmin) {
						$html->clean('read_hide');
					} else {
						$html->parse('read_hide', false);
					}
				} else {
					$html->clean('upgrade_hide');
					$html->parse('read_hide', false);
				}
			} else {
				if ($row['is_new'] == 0 && $isMyMsg && !$isAdmin) {
					$html->clean('read');
				} else {
					$html->parse('read', false);
				}
			}

            /* Mobile */
            if ($html->blockExists($blockMsg . '_time')) {
                $html->parse($blockMsg . '_time', false);
            }
            /* Mobile */

            $notDisplayTitle = array('sent_to_user_popular_f',
                                     'sent_to_user_popular_m',
                                     'msg_limit_is_reached_f',
                                     'msg_limit_is_reached_m',
                                     'sent_to_block_list',
                                     'welcoming_message',
                               );
            if ($row['system'] && in_array($msg, $notDisplayTitle)) {
                $html->clean($blockMsg . '_info');
            } else {
                $html->parse($blockMsg . '_info', false);
            }
            // check in the basic version
            // Will integrate
            if ($row['system']) {
                self::grabsMsg($html, $msg, $row['from_user'], $row['to_user']);
            } else {
                self::cleanBlockMsg($html, $blockMsg . '_text');
                $html->setvar($blockMsg, nl2br($msg));
                if(!$isMyMsg && trim($row['msg_translation'])!='' && Common::isOptionActive('autotranslator_show_original')){
                    $msg_original = Common::parseLinksTag(to_html($row['msg_translation']), 'a', '&lt;', 'parseLinksSmile');

                    $html->setvar($blockMsg.'_original', nl2br($msg_original));
                    $html->parse($blockMsg . '_original_text', false);
                } else {
                    $html->clean($blockMsg . '_original_text');
                }

                $html->parse($blockMsg . '_text', false);
            }
            // Will integrate

			/*if ($row['is_new'] == 0 && $isMyMsg) {
				$html->clean('read');
			} else {
				$html->parse('read', false);
			}
            $notDisplayTitle = array('sent_to_user_popular_f',
                                     'sent_to_user_popular_m',
                                     'msg_limit_is_reached_f',
                                     'msg_limit_is_reached_m',
                                     'sent_to_block_list',
                               );
            if ($row['system'] && in_array($msg, $notDisplayTitle)) {
                $html->clean($blockMsg . '_info');
            } else {
                $html->parse($blockMsg . '_info', false);
            }*/


            if(isset($row['new_credits']) && $row['new_credits']>=0){
                $html->setvar('credits', $row['new_credits']);
                $html->setvar('new_credits_balans', lSetVars('credit_balance', array('credit' => $row['new_credits'])));
                $html->parse($blockMsg . '_set_credits', false);
            }

			if ($js) {
				$html->parse($blockMsg . '_ajax', false);
			}
			/* Imapct */
			if ($isMyMsg) {
				$html->clean($blockMsg. '_responder');
				$html->parse($blockMsg. '_answer', true);
			} else {
                $blockNewMsg = "{$blockMsg}_to_new";
                if ($html->blockExists($blockNewMsg)) {
                    $html->subcond($row['is_new'], $blockNewMsg);
                }
				$html->clean($blockMsg. '_answer');
				$html->parse($blockMsg. '_responder', true);
			}

			$html->parse($blockMsg, true);
		}
	}

    static function getWhereAllMessages($toUser, $limit = '', $order = 'ASC', $limitMsgParams = false)
    {
        global $g_user;

        $limitParam = $limit;

        if ($limit != '') {
            $limit = ' LIMIT ' . $limit;
        }

        $where = self::getWhereNoSysytem();
        if (Common::isOptionActive('gifts_disabled', 'template_options')) {
            //$where = " AND `msg` NOT LIKE '{gift:%'";
        }

        if($limitParam == 1) {

            if($order == 'DESC') {
                $aggregateFunction = 'MAX';
            } else {
                $aggregateFunction = 'MIN';
            }

            $sql = 'SELECT * FROM im_msg WHERE id = (
                SELECT ' . $aggregateFunction . '(mid) FROM (
                    (SELECT ' . $aggregateFunction . '(id) AS mid FROM `im_msg`
                        WHERE `to_user` = ' . to_sql($toUser, 'Number') . '
                            AND `from_user` = ' . to_sql($g_user['user_id'], 'Number') . '
                            AND `from_user_deleted` = 0 ' . $where . ')
                    UNION
                    (SELECT ' . $aggregateFunction . '(id) AS mid FROM `im_msg`
                        WHERE `to_user` = ' . to_sql($g_user['user_id'], 'Number') . '
                            AND `from_user` = ' . to_sql($toUser, 'Number') . '
                            AND `to_user_deleted` = 0 ' . $where . ')
                ) AS T)';
        } else {

            if($limitMsgParams !== false) {
                $limitAll = $limitMsgParams[0] + $limitMsgParams[1];
            } else {
                $limitAll = $limitParam;
            }

            if($limitAll != '') {
                $limitAll = ' LIMIT ' . $limitAll;
            }

            $sql = '(SELECT * FROM `im_msg` USE INDEX (to_user_from_user_from_user_deleted_id)
                        WHERE `to_user` = ' . to_sql($toUser, 'Number') . '
                            AND `from_user` = ' . to_sql($g_user['user_id'], 'Number') . '
                            AND `from_user_deleted` = 0 ' . $where . '
                        ORDER BY id ' . $order . ' ' . $limitAll . ')
                    UNION
                    (SELECT * FROM `im_msg` USE INDEX (to_user_from_user_to_user_deleted_id)
                        WHERE `to_user` = ' . to_sql($g_user['user_id'], 'Number') . '
                            AND `from_user` = ' . to_sql($toUser, 'Number') . '
                            AND `to_user_deleted` = 0 ' . $where . '
                        ORDER BY id ' . $order . ' ' . $limitAll . ')
                    ORDER BY id ' . $order . $limit;
        }

        /*$sql = '(SELECT * FROM `im_msg`
				  WHERE `to_user` = ' . to_sql($toUser, 'Number') .
				  ' AND `from_user` = ' . to_sql($g_user['user_id'], 'Number') . '
					AND `from_user_deleted` = 0 ' . $where . ')
				  UNION
				(SELECT * FROM `im_msg`
				  WHERE `to_user` = ' . to_sql($g_user['user_id'], 'Number') .
				  ' AND `from_user` = ' . to_sql($toUser, 'Number') . '
					AND `to_user_deleted` = 0 ' . $where . ')
				  ORDER BY id ' . $order . ' ' . $limit;*/

        return $sql;
    }

	static function parseImMessages(&$html, $toUser, $show = true, $limit = '', $order = 'ASC', $userPhotoUrl = '', $limitMsgParams = false)
    {
		global $g_user;

        $firstMsgId = 0;
        $isSetFirstMsgId = self::$isMobileOneChat || self::$isPageListChats;
        if ($isSetFirstMsgId) {
            $firstMsgId = DB::result(self::getWhereAllMessages($toUser, 1),0,2);
            $html->setvar('first_msg_id', $firstMsgId);
        }

        $prevMsgUid = 0;
        $sql = self::getWhereAllMessages($toUser, $limit, $order, $limitMsgParams);
        $rows = DB::rows($sql, 2);
        if (self::$isMobileOneChat) {
            $blockStart = 'messages_block_start';
            $blockEnd = 'messages_block_end';
            $i = 0;
            $isMore = true;
        }
        krsort($rows);

        $blockList = 'message_list';
        $blockMsg = 'message';
        $numberMsg = count($rows);
        foreach ($rows as $key => $row) {
            if (self::$isMobileOneChat) {
                if ($row['from_user'] != $g_user['user_id']) {
                    $html->setvar($blockStart . '_from_user', $row['from_user']);
                    $html->setvar($blockStart . '_photo_url', $userPhotoUrl);
                    $html->parse($blockStart . '_photo');
                }
                if ($i == 0) {
                    $html->parse($blockStart);
                } else {
                    if (($prevMsgUid == $g_user['user_id'] && $row['from_user'] != $g_user['user_id'])
                        || ($prevMsgUid != $g_user['user_id'] && $row['from_user'] == $g_user['user_id'])    ) {
                        $html->parse($blockEnd);
                        $html->parse($blockList);
                        $html->clean($blockEnd);
                        $html->parse($blockStart);
                    }
                }
                $prevMsgUid = $row['from_user'];
                $i++;
                $html->parse($blockList);
                $html->clean($blockStart . '_photo');
                $html->clean($blockStart);
                $html->clean($blockEnd);
            }

            /* Impact */
            self::parseResponderInfo($html, $row['from_user'], $prevMsgUid);
            /* Impact */

            self::parseImOneMsg($html, $row);

            if (self::$isMobileOneChat) {
                $html->parse($blockList);
                $html->clean($blockMsg . '_responder');
                $html->clean($blockMsg . '_answer');
                $html->clean($blockMsg);
                if ($i == $numberMsg) {
                    $html->parse($blockEnd);
                    $html->parse($blockList);
                }
                if ($isMore && $firstMsgId == $row['id']) {
                    $isMore = false;
                }
            }
        }

        if (self::$isMobileOneChat) {
            if ($isMore && $firstMsgId) {
                $html->parse('one_chat_profile_pic_hide', false);
            }
        } else {
            if (!$show) {
                $html->parse('message_list_hide', false);
            }
            $html->parse('message_list_start', false);
            $html->parse('message_list_end', false);
            $html->parse($blockList);
            $html->clean($blockMsg);
        }
        return $numberMsg;
	}

    /* Mobile */
    static function getFormatDateMobile($date)
	{
        #2008-12-12 02:02:02

		$yearMsg = substr($date, 0, 4);
		$monthMsg = substr($date, 5, 2);
		$dayMsg = substr($date, 8, 2);

        $curDate = date("Y-m-d");
        $year = substr($curDate, 0, 4);
		$month = substr($curDate, 5, 2);
		$day = substr($curDate, 8, 2);

        $format = 'im_mobile_datetime';
        if ($dayMsg == $day
            && $monthMsg == $month
            && $yearMsg == $year) {
            $format = 'im_mobile_datetime_today';
        } elseif ($monthMsg == $month
                  && $yearMsg == $year) {
            $format = 'im_mobile_datetime_this_month';
        }
        return $format;

    }

    static function isNeededTranslate($toUser)
    {
        global $g_user;
        if(Common::isOptionActive('autotranslator_enabled')){
            $toUser=User::getInfoBasic($toUser);
            if($toUser['lang']!=$g_user['lang']){
                $translatedOff=explode(',',$toUser['translation_off']);
                if(!in_array($g_user['lang'],$translatedOff)){
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        }
        return false;
    }

    static function getTranslate($msg='',$toUser=0,$emptyIfNotTranslated=true)
    {
        global $g_user;
        if($emptyIfNotTranslated){
            $trMsg='';
        } else {
            $trMsg=$msg;
        }

        if(self::isNeededTranslate($toUser)){
            $toLang=User::getInfoBasic($toUser,'lang');
            $trMsg=Common::autoTranslate($msg, $g_user['lang'], $toLang);
        }

        return $trMsg;
    }

    static function initListOrderImMobileGeneral($limit)
    {
        $userListNewMsg = array();
        if (self::$usersListMobileGeneralChat === null) {
            self::setCurrentData('IMO.');
            $sql = "SELECT IMO.*, CU.name, CU.name_seo, CU.gender,
                           CU.last_visit, DATE_FORMAT(NOW(), '%Y') - DATE_FORMAT(CU.birth, '%Y') - (DATE_FORMAT(NOW(), '00-%m-%d') < DATE_FORMAT(CU.birth, '00-%m-%d')) AS age
                      FROM `im_open` AS IMO
                      LEFT JOIN `user` AS CU ON CU.user_id = IMO.to_user
                     WHERE `from_user` = " . to_sql(guid())
                   . ' AND IMO.mid > 0 '
                    . self::$demoWhere
                 . ' ORDER BY is_new_msg DESC, z DESC, mid DESC LIMIT ' . to_sql($limit, 'Plain');
            self::setCurrentData('', true);
            $usersList = DB::all($sql,3);
            //self::$usersListMobileGeneralChat = $usersList;
            self::$usersListMobileGeneralChat = array();
            foreach ($usersList as $key => $user) {
                self::$usersListMobileGeneralChat[$user['to_user']] = $user;
                $userListNewMsg[$user['to_user']] = $user['is_new_msg'];
            }
        }
        return $userListNewMsg;
    }

    static function parseImMobile(&$html, $isPageListChats = null)
	{
        global $g, $g_user;

        self::setCurrentData();

        self::closeEmptyIm();

        $userId = intval(get_param('user_id', 0));
        $cmd = get_param('cmd');
        $display = get_param('display');
        self::$isMobileOneChat = $display == 'one_chat';
        if ($isPageListChats === null) {
            $isPageListChats = $display == 'open_list_chats';
        }
        self::$isPageListChats = $isPageListChats;
        $isInitListChats = $cmd == 'init_list_im';

        $fetchUsers = null;
        $limitStart = get_param('limit_start', 0);
        $limitLoad = 0;

        $limitMsgParams = false;

        if (self::$isMobileOneChat) {
            $optionImHistory = Common::getOption('im_history_messages');
            $html->setvar('is_one_chat', $display);
            $limitMsg = $limitStart . ', ' . $optionImHistory;

            $limitMsgParams = array($limitStart, $optionImHistory);

            $html->setvar('user_to', $userId);
			if ($html->varExists('current_user_photo')) {
				$userPhotoUrl = User::getPhotoDefault($g_user['user_id'], 'r', false, $g_user['gender']);
				$html->setvar('current_user_photo', $userPhotoUrl);
                $html->setvar('current_user_name', $g_user['name']);
			}
        } else {
            $limitLoad = intval(get_param('limit'));//when deleted the chat in the general chat, then loaded one
            $optionImHistory = Common::getOption('im_history_chat');
            if ($limitLoad) {
                $optionImHistory = $limitLoad;
            }
            $limitMsg = 1;
            if ($isInitListChats) {
                $limitMsg = Common::getOption('im_history_messages');
                $initListChatsNumberVisibleIm = get_param_int('number_visible_im');
                if (!$initListChatsNumberVisibleIm) {
                    $initListChatsNumberVisibleIm = 10;
                }
            }
            $html->parse('general', false);

            self::$countMessagesFromUsers = self::getCountNewMessagesFromUsers();
        }
        $html->setvar('limit_start', $limitStart);
        if ($html->varExists('im_history_messages')) {
            $html->setvar('im_history_messages', $optionImHistory);
        }
        if ($html->varExists('im_history_list_messages')) {
            $html->setvar('im_history_list_messages', $limitMsg);
        }

        if (IS_DEMO && !self::$isMobileOneChat) {
            DB::query('SELECT *
                         FROM im_msg
                        WHERE ((to_user = ' . to_sql($g_user['user_id'], 'Number') . ' AND to_user_deleted = 0)
                           OR  (from_user = ' . to_sql($g_user['user_id'], 'Number') . ' AND from_user_deleted = 0))
                          AND id > 0', 2);
            while ($item = DB::fetch_row(2)){
                $userIdOpen = ($g_user['user_id'] == $item['to_user']) ? $item['from_user'] : $item['to_user'];
                self::firstOpenIm($userIdOpen, false);
            }
        }

		$html->setvar('user_id', $g_user['user_id']);
		$html->setvar('user_name', $g_user['name']);

        $isImOpenOneRowOnly = false;

		$where = '`from_user` = ' . to_sql($g_user['user_id'], 'Number');
		if ($userId) {
            self::firstOpenIm($userId, self::$isMobileOneChat);
            $where .= ' AND `to_user` = ' . to_sql($userId, 'Number');
            $isImOpenOneRowOnly = true;
        } elseif (self::$isMobileGeneralChatUpdate) {
            $usersList = self::jsonDecodeParamArray('users_list');
            if (!is_array($usersList)) {
                $usersList = array();
            }
            $count = count($usersList);
            $maxI = $count > $optionImHistory ? $count : $optionImHistory;

            $listNewMsgForUsersData = self::initListOrderImMobileGeneral($maxI);

            $usersRemove = $usersList;
            $i = 0;
            //$usersParse = array();
            $usersParseOrder = array();
            $usersListOrder = array();
            $fetchUsers = array();
            $lastId = get_param('last_id');
            foreach (self::$usersListMobileGeneralChat as $uid => $user) {
                /*if (($count && $i == $count)
                     || (!$count && $i == $optionImHistory)) {
                    break;
                }*/
                if ($i == $maxI) {
                    break;
                }
                if (!isset($usersList[$uid])) {
                    //$usersParse[] = $uid;
                    $usersParseOrder[$uid] = $i;
                    $fetchUsers[] = $user;
                } else {
                    //echo self::$usersListMobileGeneralChat[$uid]['mid'].'-'. $lastId;
                    if ($user['mid'] > $lastId) {
                        $usersParseOrder[$uid] = $i;
                        $fetchUsers[] = $user;
                    }
                    unset($usersRemove[$uid]);
                }
                $usersListOrder[$uid] = $i;
                $i++;
            }
            if ($usersRemove) {
                $html->setvar('general_remove_users_list', json_encode($usersRemove));
                $html->parse('general_remove_users', false);
            }
            if ($usersListOrder) {
                $listNewMsgForUsers = array();
                $numberNewMsgForUsers = array();
                $isUpdateNewMsgNumber = $html->varExists('general_users_list_new_msg_count');
                foreach ($usersListOrder as $uid => $value) {
                    $listNewMsgForUsers[$uid] = $listNewMsgForUsersData[$uid];
                    if ($isUpdateNewMsgNumber) {
                        $numberNewMsgForUsers[$uid] = self::getCountNewMessages($uid);
                    }
                }
                if ($isUpdateNewMsgNumber) {
                    $html->setvar('general_users_list_new_msg_count', json_encode($numberNewMsgForUsers));
                }
                $html->setvar('general_users_list_new_msg', json_encode($listNewMsgForUsers));
                $html->setvar('general_order_users_list', json_encode($usersListOrder));
                $html->parse('general_order_users', false);
            }

            $usersOpenIm = self::jsonDecodeParamArray('users_list_open_im');
            if ($usersOpenIm) {
                self::setStatusUsers($html, $usersOpenIm, true);

                $existsImOpen = array();
                $sqlExists = 'SELECT `to_user` FROM `im_open`
                               WHERE `from_user` = ' . to_sql($g_user['user_id'], 'Number')
                             . ' AND `to_user` IN(' . self::getSqlImplodeKeys($usersOpenIm)  . ')'
                             . ' AND mid > 0 ' . self::$demoWhere;
                $existsIm = DB::rows($sqlExists);
                if ($existsIm) {
                    foreach ($existsIm as $key => $item) {
                        $existsImOpen[$item['to_user']] = 1;
                    }
                }
                $html->setvar('update_exists_im_value', json_encode($existsImOpen));
                $html->parse('update_exists_im', false);
            } else {
                self::setStatusUsers($html);
            }
            self::parseReadMessage($html, 'general_show_read_marks');
            if (!$fetchUsers) {
                return;
            }
        }

        self::setCurrentData('IMO.');
        $sql = "SELECT IMO.*, CU.name, CU.name_seo, CU.gender,
                       CU.last_visit, DATE_FORMAT(NOW(), '%Y') - DATE_FORMAT(CU.birth, '%Y') - (DATE_FORMAT(NOW(), '00-%m-%d') < DATE_FORMAT(CU.birth, '00-%m-%d')) AS age
                  FROM `im_open` AS IMO
                  LEFT JOIN `user` AS CU ON CU.user_id = IMO.to_user
                 WHERE " . $where
               . ' AND IMO.mid > 0 '
               . self::$demoWhere;
        self::setCurrentData('', true);

        $order = ' ORDER BY IMO.is_new_msg DESC, IMO.z DESC, IMO.mid DESC';
        if ($isInitListChats) {
            $sqlInitList = 'SELECT * FROM (
                            (' . $sql . $order . ' LIMIT 0,' . $optionImHistory . ')
                            UNION
                            (' . $sql  . ' AND IMO.im_open_visible != "C" ' . $order . ')) AS IMOU
                            GROUP BY to_user ORDER BY is_new_msg DESC, z DESC, mid DESC';
        }

        if(!$isImOpenOneRowOnly) {
            $sql .= $order;
        }

        if (!self::$isMobileOneChat && !$userId && !self::$isMobileGeneralChatUpdate) {
            $limitOpenChat = ' LIMIT ' . $limitStart . ',' . $optionImHistory;
            $thereIm = DB::count('im_open', $where . ' AND mid > 0 ' . self::$demoWhere);
            $html->setvar('stop_more', $thereIm > ($limitStart + $optionImHistory) ? 0 : 1);
            $html->setvar('stop_more', $thereIm ? 0 : 1);
            $html->setvar('limit_load', $limitLoad);
            $html->parse('general_limit_info');
            if ($isInitListChats) {
                $sql = $sqlInitList;
            } else {
                $sql .= $limitOpenChat;
            }
        }

        if ($fetchUsers === null) {
            $fetchUsers = DB::all($sql, 1);
        }

        $blockListUsers = '';
        $blockListUsersItem = 'messages_users_list_item';
        if ($isPageListChats) {
            $blockListUsers = 'list_chats_open_users';
            $blockListUsersItem = 'list_chats_open_users_item';
        }

        $html->setvar('user_to_photo', 'empty.gif');
        $blockNewMessages = 'new_messages_item';
        $i = 0;
        $j = 0;

        //print_r_pre($fetchUsers,true);
        foreach ($fetchUsers as $k => $row) {

            if (self::$isMobileGeneralChatUpdate) {
                $html->setvar('user_to_order', $usersParseOrder[$row['to_user']]);
            }

			//$userInfo = User::getInfoBasic($row['to_user']);
            $userInfo = array(
                'name'       => $row['name'],
                'name_seo'   => $row['name_seo'],
                'gender'     => $row['gender'],
                'age'        => $row['age'],
                'last_visit' => $row['last_visit']
            );
            $html->setvar('user_to_id', $row['to_user']);
            $userPhotoUrl = '';
            $userUrl = '';
            if (!$isInitListChats) {
                $userUrl = User::url($row['to_user'], $userInfo);
                if ($html->varExists('user_to_profile_link')) {
                    $html->setvar('user_to_profile_link', $userUrl);
                }
                if ($html->varExists('user_to_photo') || $html->blockExists("{$blockListUsersItem}_plug_private_photos")) {
                    $sizePhoto = self::$isMobileOneChat ? 'm' : 'r';
                    $userPhotoUrl = User::getPhotoDefault($row['to_user'], $sizePhoto, false, $userInfo['gender']);
                    if ($html->blockExists("{$blockListUsersItem}_plug_private_photos")) {// != $isInitListChats
                        $userPhotoId = User::getPhotoDefault($row['to_user'], $sizePhoto, true);
                        if (User::isVisiblePlugPrivatePhotoFromId($row['to_user'], $userPhotoId)){
                            $html->parse("{$blockListUsersItem}_plug_private_photos", false);
                        } else {
                            $html->clean("{$blockListUsersItem}_plug_private_photos");
                        }
                    }

                    $html->setvar('user_to_name', $userInfo['name']);
                    $html->setvar('user_to_photo', $userPhotoUrl);
                    if ($html->varExists('user_to_age')) {
                        $html->setvar('user_to_age', $userInfo['age']);
                    }
                    if ($html->varExists('user_to_profile_url')) {
                        $html->setvar('user_to_profile_url',  $userUrl);
                    }
                }
            }
            if($isInitListChats) {//Impact Init List Load Page
                $html->setvar('user_to_name', $userInfo['name']);

                self::parseStatusOnline($html, $row['to_user'], $userInfo);

                if ($row['is_new_msg']) {
                    $html->parse($blockNewMessages, true);
                }
                if ($row['im_open_visible'] != 'C') {
                    $html->setvar('user_to_age', $userInfo['age']);
                    if ($j < $initListChatsNumberVisibleIm && $row['im_open_visible'] == 'Y') {
                        self::setMessageAsRead($row['to_user'], false);
                    }
                    self::parseOpenImTitle($html, $row['to_user'], $userInfo['name']);
                    if ($j < $initListChatsNumberVisibleIm) {
                        $userUrl = User::url($row['to_user'], $userInfo);
                        $html->setvar('user_to_profile_link', $userUrl);

                        $userPhotoUrl = User::getPhotoDefault($row['to_user'], 'r', false, $userInfo['gender']);
                        $html->setvar('user_to_photo', $userPhotoUrl);
                        self::parseImMessages($html, $row['to_user'], true, $limitMsg, 'DESC', $userPhotoUrl, $limitMsgParams);

                        $isVisibleOpenImOne = $row['im_open_visible'] == 'Y';
                        $isVisibleOpenImOneDemo = intval(get_cookie('im_open_visible_demo'));
                        if (defined('IS_DEMO') && IS_DEMO && !$isVisibleOpenImOneDemo) {
                            $isVisibleOpenImOne = true;
                            set_cookie('im_open_visible_demo', true);
                        }
                        if($isVisibleOpenImOne){
                            $html->parse('open_im_show', false);
                        }else{
                            $html->clean('open_im_show', false);
                        }
                        $html->parse('open_im', true);
                    }else{
                        $html->parse('list_chats_open_item_more', true);
                    }
                    $html->clean('message');
                    $html->clean('message_list');
                    $j++;
                }
                if ($i < $optionImHistory) {
                    if (!$userPhotoUrl) {
                        $userPhotoUrl = User::getPhotoDefault($row['to_user'], 'r', false, $userInfo['gender']);
                        $html->setvar('user_to_photo', $userPhotoUrl);
                    }
                    if (!$userUrl) {
                        $userUrl = User::url($row['to_user'], $userInfo);
                        $html->setvar('user_to_profile_link', $userUrl);
                    }
                    $html->parse($blockListUsersItem);
                    $html->clean($blockNewMessages);
                }
            }else{
                $isMsg = false;
                if (!$isPageListChats) {
                    if (!$userPhotoUrl) {
                        $userPhotoUrl = User::getPhotoDefault($row['to_user'], 'r', false, $userInfo['gender']);
                    }
                    $isMsg = self::parseImMessages($html, $row['to_user'], true, $limitMsg, 'DESC', $userPhotoUrl, $limitMsgParams);
                }
                $isParseIm = true;
                if (self::$isMobileOneChat) {
                    if (!$isMsg) {
                        $isParseIm = false;
                    }
                } else {
                    self::parseStatusOnline($html, $row['to_user'], $userInfo);
                    if ($row['is_new_msg']) {
                        $html->parse($blockNewMessages, true);
                    }
                }
                if ($isParseIm) {
                    $html->parse($blockListUsersItem);
                    $html->clean($blockNewMessages);
                    $html->clean('message_list');
                }
            }
            $i++;
		}
        if (self::$isMobileOneChat) {
            //$html->setvar('first_msg_id', $firstMsgId);
            $html->parse('set_data_one_chat', false);
        } else {
            $html->parse('one_chat_profile_pic_hide', false);
            $html->parse('set_general_chat', false);
        }
		$html->setvar('last_id', self::lastId());
        if ($isPageListChats) {
            $isOpen = intval(get_cookie('open_list_chats', true));
            $isOpenDemo = intval(get_cookie('open_list_chats_demo', true));
            if (defined('IS_DEMO') && IS_DEMO && !$isOpenDemo) {
                $isOpen = true;
            }
            if ($isOpen) {
                $html->parse($blockListUsers . '_show', false);
            }
            $countNewMessages = CIm::getCountNewMessages();
            $titleOnlineCount = l('popup_messages_list_title_empty');
            if ($countNewMessages) {
                $titleOnlineCount = lSetVars('popup_messages_list_title', array('count' => $countNewMessages));
            }
            $html->setvar($blockListUsers . '_count_value', $countNewMessages);
            $html->setvar($blockListUsers . '_count', $titleOnlineCount);
            $html->parse($blockListUsers, false);
            if ($isInitListChats) {
                $html->setvar('open_im_all_new_msg_count', self::getCountNewMessagesFromListUsers());
            }
        }
    }
    /* Mobile */
    /* Impact list small popup IM */
    static function parseOpenImTitle(&$html, $uid, $name = null, $countNewMsg = null)
    {
        if ($name === null) {
            $name = User::getInfoBasic($uid, 'name');
        }
        if ($countNewMsg === null) {
            $countNewMsg = self::getCountNewMessages($uid);
        }
        if ($countNewMsg) {
            $vars =  array('name' => $name, 'count' => $countNewMsg);
            $title = lSetVars('open_im_title_count', $vars);
        } else {
            $vars =  array('name' => $name);
            $title = lSetVars('open_im_title', $vars);
        }
        $html->setvar('open_im_new_msg_count', $countNewMsg);
        $html->setvar('open_im_title', $title);
    }

    static function parseResponderInfo(&$html, $fromUid, &$prevMsgUid)
    {
        $blockMsg = 'message';
        $blockResponderInfo = $blockMsg . '_responder_info';
        if ($html->blockExists($blockResponderInfo)) {
            $blockResponderInfo = $blockMsg . '_responder_info';
            $blockAnswerInfo = $blockMsg . '_answer_info';
            $html->clean($blockResponderInfo . '_arrow');
            $html->clean($blockResponderInfo);
            $html->clean($blockAnswerInfo . '_arrow');
            $html->clean($blockAnswerInfo);

            $blockParse = $fromUid == guid() ? $blockAnswerInfo : $blockResponderInfo;
            if ($prevMsgUid != $fromUid) {
                $userInfo = User::getInfoBasic($fromUid);
                $userPhotoUrl = User::getPhotoDefault($fromUid, 'm', false, $userInfo['gender']);
                $html->setvar($blockParse . '_user_id', $fromUid);
                $html->setvar($blockParse . '_photo_url', $userPhotoUrl);
                $html->setvar($blockParse . '_name', User::nameOneLetterFull($userInfo['name']));
                $html->setvar($blockParse . '_age', $userInfo['age']);
                $html->setvar($blockParse . '_profile_url', User::url($fromUid, $userInfo));
                $html->parse($blockParse);
                $html->parse($blockParse . '_arrow');
            }
            $prevMsgUid = $fromUid;
            $html->clean($blockMsg . '_responder');
            $html->clean($blockMsg . '_answer');
        }
    }
    /* Impact list small popup IM */

	function parseBlock(&$html)
	{
		global $g, $g_user;

        $guid = $g_user['user_id'];
        $cmd = get_param('cmd');
        $display = get_param('display');
        self::$isMobileOneChat = $display == 'one_chat';
        self::$isMobileGeneralChatUpdate = ($display == 'general_chat') && $cmd == 'update_im';
        self::$isPageListChats = $display == 'open_list_chats'  && ($cmd == 'update_im' || $cmd == 'uploading_msg');
		self::setCurrentData();

        $allowedCmd = array('pp_messages','uploading_msg','open_im_with_user');
        //'open_im_with_user' - Impact

        if ($guid && in_array($cmd, $allowedCmd)) {
            self::closeEmptyIm();

			$userId = intval(get_param('user_id'));
			$showIm = intval(get_param('show_im'));
            $uploadIm = intval(get_param('upload_im'));
            $notUploadingMsg = $cmd != 'uploading_msg';
            $isOpenImImpact = $cmd == 'open_im_with_user';
            $typeIm = Common::getOptionTemplate('im_type');

            $where = '';
			if ($userId) {
                if (!$showIm) {
                    self::setMessageAsRead($userId, false);
                }
                self::firstOpenIm($userId, !$showIm, $isOpenImImpact);
			}
            $isShowUserImInfo = true;
            if ($showIm) {
                $isShowUserImInfo = false;
            }

            if (IS_DEMO && $notUploadingMsg && (!$userId || ($userId && $showIm))) {
                if (!$userId) {
                    DB::query('SELECT *
                                 FROM im_msg
                                WHERE ((to_user = ' . to_sql($g_user['user_id'], 'Number') . ' AND to_user_deleted = 0)
                                   OR (from_user = ' . to_sql($g_user['user_id'], 'Number') . ' AND from_user_deleted = 0))
                                  AND id > 0', 4);
                    while ($row2 = DB::fetch_row(4)){
                        $userIdOpen = ($g_user['user_id'] == $row2['to_user']) ? $row2['from_user'] : $row2['to_user'];
                        self::firstOpenIm($userIdOpen, false);
                    }
                } else {
                    self::firstOpenIm($userId, false);
                }
            }

            if ($isOpenImImpact && $userId) {
                self::setVisibleOpenIm($userId);
            }

			$html->setvar('user_id', $g_user['user_id']);
			$html->setvar('user_name', $g_user['name']);

			$html->cond($g_user['sound'] == 2, 'no_sound', 'is_sound');

            if ($showIm || !$notUploadingMsg || $uploadIm || $isOpenImImpact) {
				$where = ' AND IMO.to_user = ' . to_sql($userId, 'Number');
			}

			$currentUser = get_param('user_current');
            $isFbModeTitle = get_param('is_mode_fb');
            $optionImHistory = Common::getOption('im_history_messages','options');
            $limitStart = get_param('limit_start', 0);
            $limitMsg = $limitStart . ', ' . $optionImHistory;
            $html->setvar('limit_start', $limitStart);

            $limitMsgParams = array($limitStart, $optionImHistory);


            self::setCurrentData('IMO.');
			/*$sql = 'SELECT *
					  FROM `im_open`
					 WHERE `from_user` = ' . to_sql($guid) .
                    $where . ' AND mid > 0 ' . self::$demoWhere .
                    ' ORDER BY z DESC';*/

            $joinSql = '';
            $selectSql = '';
            if ($typeIm == 'edge') {
                $joinSql = 'LEFT JOIN `im_msg` AS IMM ON IMM.id = IMO.mid '
                         . ' AND ((IMM.from_user_deleted = 0 AND IMM.from_user = ' . to_sql($guid) . ') OR (IMM.to_user_deleted = 0 AND IMM.to_user = ' . to_sql($guid) . ')) '
                         . ' AND (IMO.to_user = IMM.from_user OR IMO.to_user = IMM.to_user)' . self::getWhereNoSysytem('IMM.');
                $selectSql = ', IF(IMM.msg IS NULL, "", IMM.msg) AS last_msg, IMM.from_user AS last_msg_from_user, IMM.to_user AS last_msg_to_user, IMM.system AS last_msg_system';
            }
            $sql = "SELECT IMO.*, CU.name, CU.name_seo, CU.gender, CU.city,
                           CU.last_visit, DATE_FORMAT(NOW(), '%Y') - DATE_FORMAT(CU.birth, '%Y') - (DATE_FORMAT(NOW(), '00-%m-%d') < DATE_FORMAT(CU.birth, '00-%m-%d')) AS age " .
                      $selectSql .
                    ' FROM `im_open` AS IMO
                      LEFT JOIN `user` AS CU ON CU.user_id = IMO.to_user ' .
                      $joinSql .
                   ' WHERE IMO.from_user = ' . to_sql($guid) .
                     ' AND IMO.mid > 0 '
                    . $where
                    . self::$demoWhere .
                   ' ORDER BY IMO.z DESC';

            self::setCurrentData('', true);
			DB::query($sql, 1);

            self::$isReadMsg = false;
            if (!$userId
                || ($userId && !$currentUser)
                || ($currentUser == $userId && $isFbModeTitle == 'false')) {
                //self::$isReadMsg = true;
            }

            $countMsgNewAll = 0;
            $isParseMessagesLastActiveIm = true;

			while ($row = DB::fetch_row(1))
			{
                $userInfo = $row;//User::getInfoBasic($row['to_user']);
                if ($html->varExists('first_msg_id')) {
                    $firstMsgId = DB::result(self::getWhereAllMessages($row['to_user'], 1),0,2);
                    $html->setvar('first_msg_id', $firstMsgId);
                }
                if ($notUploadingMsg && !$isOpenImImpact) {
                    self::parseInfoUserToIm($html, $row['to_user'], $userInfo);
                }
                if ($isParseMessagesLastActiveIm) {
                    if ($notUploadingMsg) {
                        self::parseTitleIm($html, $row['to_user'], $isShowUserImInfo, $userInfo);
                        if (!$showIm) {
                            self::setMessageAsRead($row['to_user'], false);
                        }
                    }
                    self::parseImMessages($html, $row['to_user'], $isShowUserImInfo, $limitMsg, 'DESC', '', $limitMsgParams);
                    $isParseMessagesLastActiveIm = false;
                }
                if ($notUploadingMsg) {
                    $countMsgNew = self::getCountNewMessages($row['to_user']);
                    $countMsgNewAll += $countMsgNew;
                    $blockCountNewHide = 'count_new_hide';
                    $blockCountNewShow = 'count_new_show';
                    $blockSelectedUser = 'selected_user';
                    //'upload_im_new' - so that the counters of new messages are parsed
                    if ($isShowUserImInfo && !get_param_int('upload_im_new')) {
                        $isShowUserImInfo = false;
                        $html->parse($blockSelectedUser);
                        $html->parse($blockCountNewHide);
                    } else {
                        $html->setvar('messages_count_new', $countMsgNew);
                        if ($countMsgNew) {
                            $html->parse($blockCountNewShow, false);
                            $html->clean($blockCountNewHide);
                        } else {
                            $html->parse($blockCountNewHide, false);
                            $html->clean($blockCountNewShow);
                        }
                        $html->clean($blockSelectedUser);
                    }
                    $html->parse('list_users');
                }
                if ($html->varExists('user_to_profile_url')) {
                    $html->setvar('user_to_profile_url',  User::url($row['to_user'], $userInfo));
                }
                if ($isOpenImImpact && $userId) {
                    self::parseStatusOnline($html, $row['to_user'], $userInfo);
                    self::parseOpenImTitle($html, $row['to_user']);
                    $html->setvar('open_im_all_new_msg_count', self::getCountNewMessagesFromListUsers());
                    $html->parse('open_im_js');
                    $html->parse('open_im');
                }
			}

			if ($countMsgNewAll) {
				$html->setvar('messages_count', $countMsgNewAll);
			}
            if ($html->varExists('messages_count_data')) {
                $dataMessageCount = array('count' => self::getCountNewMessages(), 'enabled' => self::getCountAllMsgIm());
                $html->setvar('messages_count_data', json_encode($dataMessageCount));
            }
			$html->setvar('last_id', self::lastId());
			if ($notUploadingMsg && !$showIm) {
				if (Common::isOptionActive('contact_blocking')) {
					$html->parse('user_blocking');
				}
                if (City::isActiveStreetChat()) {
					$html->parse('user_invite_streetchat');
				}
                if (Common::isOptionActive('videochat')) {
					$html->parse('user_invite_videochat');
				}
                if (Common::isOptionActive('audiochat')) {
					$html->parse('user_invite_audiochat');
				}
				if ($isShowUserImInfo) {
					$html->setvar('current_user_to_id', 0);
				} else {
					$html->parse('message_list_empty_hide');
				}
				$html->parse('message_list_empty');
			}
        } elseif ($guid && (self::$isMobileGeneralChatUpdate || self::$isPageListChats)) {
            if (self::$isPageListChats) {
                self::$isMobileGeneralChatUpdate=true;
            }
            self::parseImMobile($html, self::$isPageListChats);
        } elseif ($guid && $cmd == 'update_im') {
            self::$isPageListChats = get_param('display') == 'update_msg_open_list_chats';
            self::updateMessagesLast($html);
		} elseif ($guid && $cmd == 'send_message') {
			self::addMessage($html);
            //sleep(20);
		} elseif ($guid && $cmd == 'init_list_im') {//impact init list chat load page
            self::parseImMobile($html, true);
        }

		parent::parseBlock($html);
	}

    static function switchOnTranslate($msg)
    {
        if(trim($msg['msg_translation'])!=''){
            $tmp=$msg['msg'];
            $msg['msg']=$msg['msg_translation'];
            $msg['msg_translation']=$tmp;
        }
        return $msg;
    }

    static function replyOnNewContactRate($user)
    {
        return isset($user['im_reply_new_contact_rate']) ? $user['im_reply_new_contact_rate'] : 0;
    }

    static function replyOnNewContactRateLevel($user)
    {
        $levels = array(
            30 => 'medium',
            70 => 'high',
        );

        $rate = self::replyOnNewContactRate($user);

        $rateColor = 'low';

        foreach($levels as $level => $levelColor) {
            if($rate > $level) {
                $rateColor = $levelColor;
            }
        }

        return $rateColor;
    }

    static function markContactAsReplied($userId, $userTo)
    {
        DB::update('im_contact_replied', array('replied' => 1), 'user_id = ' . to_sql($userId) . ' AND user_to = ' . to_sql($userTo));
        self::updateUserReplyRate($userId);
    }

    static function addContactReplyItem($userId, $userTo)
    {
        if($userId == $userTo || !$userId || !$userTo || guser('welcoming_message_sender')) {
            return;
        }
        $sql = 'INSERT IGNORE INTO im_contact_replied
            SET user_id = ' . to_sql($userId) . ', user_to = ' . to_sql($userTo);

        DB::execute($sql);
        $isAdded = DB::affected_rows();

        if($isAdded) {
            self::updateUserReplyRate($userId);
        }
    }

    static function isContactReplied($userId, $userTo)
    {
        $sql = 'SELECT replied FROM im_contact_replied
            WHERE user_id = ' . to_sql($userId) . '
                AND user_to = ' . to_sql($userTo);
        return DB::result($sql);
    }

    static function isContactReplyItemExists($userId, $userTo)
    {
        $sql = 'SELECT user_id FROM im_contact_replied
            WHERE user_id = ' . to_sql($userId) . '
                AND user_to = ' . to_sql($userTo);
        return DB::result($sql);
    }

    static function calculateContactReplyRate($uid)
    {
        $sql = 'SELECT COUNT(*) FROM im_contact_replied
            WHERE user_id = ' . to_sql($uid);
        $contactsCount = DB::result($sql);

        $sql = 'SELECT COUNT(*) FROM im_contact_replied
            WHERE user_id = ' . to_sql($uid) . ' AND replied = 1';
        $contactsRepliedCount = DB::result($sql);

        $rate = 0;

        if($contactsCount) {
            $rate = intval(100 * $contactsRepliedCount / $contactsCount);
        } else {
            $rate = 100;
        }

        return $rate;
    }

    static function updateUserReplyRate($uid)
    {
        $rate = self::calculateContactReplyRate($uid);
        User::update(array('im_reply_new_contact_rate' => $rate), $uid);
    }

    static public function jsonDecodeParamArray($param = null, $data = null)
    {
        if ($data === null && $param !== null) {
            $data = get_param($param);
        }
        if (is_string($data)) {
            $data = json_decode($data, true);
        }
        if (!is_array($data)) {
            $data = array();
        }
        return $data;
    }

    static public function getSqlImplodeKeys($data)
    {
        return to_sql(implode(',', array_keys($data)), 'Plain');
    }

}