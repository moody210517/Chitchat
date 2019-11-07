<?php
/* (C) Websplosion LTD., 2001-2014

IMPORTANT: This is a commercial software product
and any kind of using it must agree to the Websplosion's license agreement.
It can be found at http://www.chameleonsocial.com/license.doc

This notice may not be removed from the source code. */

class CFriendsList extends CHtmlBlock
{
	var $user_id = 0;

	function parseBlock(&$html)
	{
		$uid = $this->user_id ? $this->user_id : guid();

		$html->setvar('user_id', $uid);

        $sql = 'SELECT COUNT(user_id) FROM friends_requests
            WHERE (user_id = ' . to_sql($uid, 'Number') . '
                OR friend_id = ' . to_sql($uid, 'Number') . ')
                AND accepted = 1';
        $friendsCount = DB::result($sql);


		if($uid == guid()) {

            $sql = 'SELECT count(user_id) FROM friends_requests
                WHERE accepted = 0
                    AND friend_id = ' . to_sql($uid, 'Number');
            $friendRequests = DB::result($sql);
			if($friendRequests) {
				$html->setvar('n_friend_requests', $friendRequests);
				$html->parse('friend_requests', true);
			}

			if($friendsCount) {
				$html->parse('view_all_my', false);
            }

			$html->parse('my_friends', true);
		} else {
            if(!User::isFriend(guid(), $uid)) {
				$html->parse('add_as_friend', false);
			}

			if($friendsCount) {
				$html->parse('view_all', false);
            }

			$html->setvar('name', User::getInfoBasic($uid, 'name'));
			$html->parse('users_friends', true);
		}

        $sql = 'SELECT u.* FROM user AS u
            JOIN friends_requests AS f ON ( (u.user_id = f.user_id AND f.friend_id = ' . to_sql($uid, 'Number') . ') OR (u.user_id = f.friend_id AND f.user_id = ' . to_sql($uid, 'Number') . '))
            WHERE f.accepted = 1
            LIMIT 4';

        DB::query($sql);

		if(DB::num_rows()) {
			$html->parse('view_all', false);
        }

		for($friend_n = 0; $friend_n != 4; ++$friend_n)
		{
			if($friend = DB::fetch_row())
			{
                $fid = isset($friend['fr_user_id']) ? $friend['fr_user_id'] : (($friend['user_id'] == $uid) ? $friend['friend_id'] : $friend['user_id']);
                $row = User::getInfoBasic($fid, false, 1);
                $row['photo'] = User::getPhotoDefault($fid, 'r', false, false, 1);
				$row['last_visit'] = time_mysql_dt2u($row['last_visit']);
				if (((time() - $row['last_visit']) / 60) < Common::getOption('online_time')) {
                    $html->parse('online', false);
                }

                if(isset($row['name'])) {
                    $firstNameParts = explode(' ', $row['name']);
                    $html->setvar('name_first', $firstNameParts[0]);
                }

				foreach ($row as $k => $v) {
                    $html->setvar($k, $v);
                }

				$html->parse('friend_photo', true);
			} else {
				$html->parse('friend_blank', true);
			}
		}

		parent::parseBlock($html);
	}
}