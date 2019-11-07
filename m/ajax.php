<?php
/* (C) Websplosion LTD., 2001-2014

IMPORTANT: This is a commercial software product
and any kind of using it must agree to the Websplosion's license agreement.
It can be found at http://www.chameleonsocial.com/license.doc

This notice may not be removed from the source code. */

include('./_include/core/pony_start.php');

if(!guid()) {
    die();
}

/* check list of possible items:
 * - mail
 * - friend request
 * - IM
 * return - URL, title of link
 */

class CMobileAjax extends CHtmlBlock
{
    private $items = array();

    function addItems($type, $items)
    {
        if($items) {
            $items['type'] = $type;
            $this->items[$items['date']] = $items;
        }
    }

    function getItems()
    {
        return $this->items;
    }

    function getItemLast()
    {
        $result = false;
        $items = $this->getItems();

        if(count($items) > 0) {
            ksort($items);
            $result = end($items);
        }
        return $result;
    }

    function addInfo($type, $sql)
    {
        $items = DB::row($sql);
        $this->addItems($type, $items);
    }

	function parseBlock(&$html)
	{
		$cmd = get_param('cmd', '');
        $exclude = get_param('exclude', '');
        $uid = get_param('uid', '');

		if($cmd == 'check_new_items') {
            // sort items by last time DESC

            $sqlExclude = '';

            if($exclude == 'im') {
                $sqlExclude = ' AND from_user != ' . to_sql($uid, 'Number');
            }

            $sqls = array(
                'mail' => 'SELECT COUNT(*) AS count, MAX(date_sent) AS date
                FROM mail_msg
                WHERE new = "Y"
                    AND type != "postcard"
                    AND folder = 1
                    AND user_id = ' . to_sql(guid(), 'Number') . '
                GROUP BY user_id',

                'friend_request' => 'SELECT COUNT(*) AS count,
                    UNIX_TIMESTAMP(MAX(created_at)) AS date
                FROM friends_requests
                WHERE accepted = 0
                    AND friend_id = ' . to_sql(guid(), 'Number') . '
                GROUP BY friend_id',

                'im' => 'SELECT COUNT(*) AS count,
                UNIX_TIMESTAMP(MAX(born)) AS date
                FROM im_msg
                WHERE is_new > 0
                    AND to_user = ' . to_sql(guid(), 'Number') . '
                    ' . $sqlExclude . '
                GROUP BY to_user',
            );

            foreach($sqls as $type => $sql) {
                $this->addInfo($type, $sql);
            }

            $item = $this->getItemLast();

            // choose latest item
            if($item) {
                // set count of items via language
                $suffix = '';
                if($item['count'] > 1) {
                    $suffix = 's';
                }
                $item['value'] = str_replace('{count}', $item['count'], l('ajax_new_' . $item['type'] . $suffix));

                htmlSetVars($html, $item);

                $html->parse($item['type']);
            }

		}

		parent::parseBlock($html);
	}
}

$page = new CMobileAjax('', $g['tmpl']['dir_tmpl_mobile'] . 'ajax.html');

include('./_include/core/main_close.php');