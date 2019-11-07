<?php
class CProfileVideo
{
    static $isGetDataWithFilter = false;

    static function includePath()
    {
        return dirname(__FILE__) . '/../../';
    }

    static public function getTotalVideos($uid = null)
	{
        if ($uid === null) {
            $uid = User::getParamUid(0);
        }

        $whereTags = '';
        if (self::$isGetDataWithFilter) {
            $whereTags = self::getWhereTags('TR.');
        }
        if ($whereTags == 'no_tags') {
            return 0;
        }
        if ($whereTags) {
            $where = self::getWhereList('V.', $uid);
            $sql = 'SELECT COUNT(*)
                      FROM `vids_tags_relations` AS TR
                      JOIN `vids_video` AS V ON V.id = TR.video_id
                     WHERE ' . $where . $whereTags;
            return DB::result($sql);
        } else {
            $where = self::getWhereList('', $uid);
            return DB::count('vids_video', $where);
        }
    }

    static function getWhereList($table = '', $uid = 0)
    {
        $guid = guid();
        $vis = " AND {$table}active != '2' ";
        if (Common::isOptionActive('video_approval') && $uid && $uid != $guid) {
            $vis = " AND {$table}active='1' ";
        }
        $vis .= " AND {$table}private = 0 ";//so far, only public albums
        $where = " {$table}is_uploaded = 1 " . $vis ;

        if ($uid) {
            $where .= " AND {$table}user_id = " . to_sql($uid);
        } elseif ($guid) {
            $isShowMyVideo = Common::isOptionActive('show_your_video_browse_videos', 'edge_member_settings');
            $onlyFriends = false;
            if (self::$isGetDataWithFilter) {
                $onlyFriends = get_param_int('only_friends', false);
                if ($onlyFriends) {
                    $friends = User::friendsList($guid, $isShowMyVideo);
                    if ($friends) {
                        $where .= " AND {$table}user_id IN ({$friends})";
                    }
                }
            }
            if (!$onlyFriends && !$isShowMyVideo) {
                $where .= " AND {$table}user_id != " . to_sql($guid);
            }
        }
        if (!$uid) {
            $searchQuery = trim(get_param('search_query'));
            if ($searchQuery) {
                $searchQuery = urldecode($searchQuery);
                $where .= " AND {$table}subject  LIKE '%" . to_sql($searchQuery, 'Plain') . "%'";
            }
        }
        return $where;
    }

    /*
     * All videos on the site except the current user
     */
    static function getOrderList($typeOrder = '')
    {
        $orderBy = 'V.dt DESC, V.id DESC';
        if ($typeOrder == 'order_most_commented') {
            $orderBy = 'V.count_comments DESC, V.id DESC';
        } elseif ($typeOrder == 'order_most_viewed') {
            $orderBy = 'V.count_views DESC, V.id DESC';
        } elseif ($typeOrder == 'order_random') {
            $orderBy = 'RAND()';
        }

        return $orderBy;
    }

    static public function getTags($id)
	{
        $sql = 'SELECT TR.tag_id, T.tag
                  FROM `vids_tags_relations` as TR
                  LEFT JOIN `vids_tags` as T ON TR.tag_id = T.id
                 WHERE TR.video_id = ' . to_sql($id) . ' ORDER BY T.id';
        $tagsPhoto = DB::all($sql);
        $tags = array();
        if ($tagsPhoto) {
            foreach ($tagsPhoto as $key => $tag) {
                $tags[$tag['tag_id']] = $tag['tag'];
            }
        }
        return $tags;
    }

    static public function getTagInfo($id)
	{
        if (!$id) {
            return false;
        }
        $tag = DB::one('vids_tags', '`id` = ' . to_sql($id));

        return $tag;
    }

    static public function getWhereTags($table = '', $tags = null)
	{
        if ($tags === null) {
            $tags = trim(get_param('tags'));
        }

        if (!$tags) {
            return '';
        }

        $tags =  explode(',', trim($tags));
        if (!is_array($tags)) {
            return '';
        }

        $whereSql = 'no_tags';
        $where = '';
        $i = 0;
        foreach ($tags as $k => $tag) {
            $tag = trim($tag);
            if ($tag) {
                if ($i) {
                   $where .= ' OR ';
                }
                $where .= '`tag` LIKE "%' . $tag . '%"';
            }
            $i++;
        }
        if ($where) {
            $sql = "SELECT `id` FROM `vids_tags` WHERE ({$where})";
            $tagsId = DB::rows($sql);
            $tags = array();
            if ($tagsId) {
                foreach ($tagsId as $k => $tag) {
                    $tags[] = $tag['id'];
                }
                $whereSql = implode(',', $tags);
                $whereSql = " AND {$table}tag_id IN({$whereSql})";
            }
        }

        return $whereSql;
    }


    static function getVideosList($typeOrder = '', $limit = '', $uid = null, $getOffset = false, $cache = true, $vid = 0, $whereSql = '')
    {
        global $g;

        $result = array();
        if ($uid === null) {
            $uid = User::getParamUid(0);
        }

        if ($typeOrder == '') {
            $typeOrder = Common::getOption('list_videos_type_order', 'edge_general_settings');
        }

        if ($limit != '') {
            $limit = ' LIMIT ' . $limit;
        }

        $key = 'CProfileVideo_getVideosList_' . $uid . '_' . $vid . '_' . $typeOrder . str_replace(' ', '_', $limit) . '_' . intval($getOffset);
        if ($cache) {
            /*$videos = Cache::get($key);
            if ($videos !== null) {
                return $videos;
            }*/
        }

        $whereTags = '';
        if (self::$isGetDataWithFilter) {
            $whereTags = self::getWhereTags('TR.');
            if ($whereTags == 'no_tags') {
                return $result;
            }
        }

        include_once(self::includePath() . '_include/current/video_hosts.php');

        $autoPlayDefault = VideoHosts::getAutoplay();
        VideoHosts::setAutoplay(Common::isOptionActive('video_autoplay'));

        $guid = guid();
        $photoIds = array();

        $where = self::getWhereList('V.', $uid);
        if ($whereSql) {
            $where .= $whereSql;
        }

        if ($vid) {//Wall
            $where .= ' AND V.id = ' . to_sql($vid);
        }

        $order = self::getOrderList($typeOrder);
        if ($order) {
            $order = ' ORDER BY ' . $order;
        }

        if ($whereTags) {
            $sql = 'SELECT V.*, U.name, U.name_seo, U.country, U.city, U.gender
                      FROM `vids_tags_relations` AS TR
                      JOIN `vids_video` AS V  ON V.id = TR.video_id
                      JOIN `user` AS U ON U.user_id = V.user_id
                     WHERE ' . $where
                             . $whereTags
                             . $order
                             . $limit;
        } else {
            $sql = 'SELECT V.*, U.name, U.name_seo, U.country, U.city
                      FROM `vids_video` AS V
                      JOIN `user` AS U ON U.user_id = V.user_id
                      WHERE ' . $where
                              . $order
                              . $limit;
        }

        $videos = DB::rows($sql);
        foreach ($videos as $item) {
            $pid = 'v_' . $item['id'];

            $result[$pid]['name'] = $item['name'];
            $result[$pid]['user_info'] = array('name' => $item['name'], 'name_seo' => $item['name_seo']);
            $result[$pid]['user_id'] = $item['user_id'];
            $result[$pid]['user_name'] = $item['name'];
            $result[$pid]['user_url'] = User::url($item['user_id'], $item);
            $result[$pid]['user_photo_r'] = User::getPhotoDefault($item['user_id'], 'r');

            $result[$pid]['city'] = $item['city'];
            $result[$pid]['country'] = $item['country'];

            $result[$pid]['video_id'] = $item['id'];
            $result[$pid]['photo_id'] = $pid;

            $result[$pid]['created'] = $item['dt'];
            $result[$pid]['subject'] = $item['subject'];
            $result[$pid]['description'] = $item['subject'];
            $result[$pid]['private'] = $item['private'];
            $result[$pid]['default'] = 0;
            $result[$pid]['visible'] = $item['active'] == 1 ? 'Y' : 'N';
            $result[$pid]['count_comments'] = $item['count_comments'];
            $result[$pid]['src_b'] = User::getVideoFile($item, 'b', '');
            $result[$pid]['src_s'] = User::getVideoFile($item, 's', '');
            $result[$pid]['src_src'] = User::getVideoFile($item, 'src', '');
            $result[$pid]['src_v'] = User::getVideoFile($item, 'video_src', '');

            $clearUrl = explode('?',$result[$pid]['src_v']);
            $result[$pid]['format'] = mb_strtolower(pathinfo($clearUrl[0], PATHINFO_EXTENSION));
            VideoHosts::$items[$item['id']] = $item;
            $result[$pid]['html_code'] = VideoHosts::getHtmlCodeOneFromSite($item['id'], 807, 454, true, 'auto', '_gallery');
            $result[$pid]['is_video'] = 1;
            $result[$pid]['reports'] = $item['users_reports'];

            $result[$pid]['comments_count'] = $item['count_comments'];

            $result[$pid]['time_ago'] = timeAgo($item['dt'], 'now', 'string', 60, 'second');
            $result[$pid]['date'] = Common::dateFormat($item['dt'], 'photo_date');
            $result[$pid]['hide_header'] = $item['hide_header']*1;

            $tags = self::getTags($item['id']);
            $result[$pid]['tags'] = $tags;
            $tagsTitle = '';
            $tagsHtml = '';
            if ($tags) {
                foreach ($tags as $id => $tag) {
                    $tagsHtml .= ' <a href="' . Common::pageUrl('vids_list') . '?tag=' . $id . '">' . $tag . '</a>';
                    $tagsTitle .= ', ' . $tag;
                }
                $tagsTitle = substr($tagsTitle, 1);
            }
            $result[$pid]['tags_title'] = trim($tagsTitle);
            $result[$pid]['tags_html'] = trim($tagsHtml);

            $photoIds[] = $pid;
        }

        VideoHosts::setAutoplay($autoPlayDefault);

        if ($getOffset && $photoIds) {
            $total = count($result);
            foreach($photoIds as $photoIdkey => $pid) {
                if ($total == 1) {
                    $next = 0;
                    $prev = 0;
                } else {
                    if ($photoIdkey == 0) {
                        $next = $photoIdkey + 1;
                        $prev = $total - 1;
                    } elseif ($photoIdkey == $total - 1) {
                        $next = 0;
                        $prev = $photoIdkey - 1;
                    } else {
                        $next = $photoIdkey + 1;
                        $prev = $photoIdkey - 1;
                    }
                }

                $result[$pid]['offset'] = $photoIdkey;
                $result[$pid]['next'] = $next;
                $result[$pid]['prev'] = $prev;
                $result[$pid]['next_id'] = $photoIds[$next];
                $result[$pid]['prev_id'] = $photoIds[$prev];

                $isFriend = 1;

                $private = $result[$photoIds[$prev]]['private'];
                if($private == '1' && !$isFriend && $uid != $guid) {
                    $title = '';
                } else {
                    $title = $result[$photoIds[$prev]]['description'];
                }
                $result[$pid]['prev_title'] = $title;


                $private = $result[$photoIds[$next]]['private'];
                if($private == '1' && !$isFriend && $uid != $guid) {
                    $title = '';
                } else {
                    $title = $result[$photoIds[$next]]['description'];
                }
                $result[$pid]['next_title'] = $title;
            }
        }

        Cache::add($key, $result);

        return $result;
    }

    /*
     * For self::getVideosList
     */
    static public function getTypeOrderVideosList($notRandom = false, $lang = false)
	{
        global $p;

        if ($lang !== false) {
            $pLast = $p;
            $p = 'vids_list.php';
        }
        $list = array(
            'order_new'              => l('order_new', $lang),
            'order_most_commented'   => l('order_most_commented', $lang),
            'order_most_viewed'      => l('order_most_viewed', $lang),
            'order_random'           => l('order_random', $lang)
        );
        if ($lang !== false) {
            $p = $pLast;
        }
        if ($notRandom) {
            unset($list['order_random']);
        }
        return $list;
    }

    /*
     * count_comments =  photo commets + replies comments
     * count_comments_replies = replies comments
     */
    static function updateCountComment($vid)
    {
        $countComments = '(SELECT COUNT(*)
                             FROM `vids_comment`
                            WHERE `parent_id` = 0
                              AND `video_id` = ' . to_sql($vid) . ')';

        $countCommentsReplies = '(SELECT COUNT(*)
                                 FROM `vids_comment`
                                WHERE `parent_id` != 0
                                  AND `video_id` = ' . to_sql($vid) . ')';

        $sql = 'UPDATE `vids_video` SET
                `count_comments` = ' . $countComments . ',
                `count_comments_replies` = ' . $countCommentsReplies . '
                 WHERE `id` = ' . to_sql($vid);

        DB::execute($sql);
    }

    static function updateCountCommentReplies($cid)
    {
        $sql = "SELECT COUNT(*)
                  FROM `vids_comment`
                 WHERE `parent_id` = " . to_sql($cid);
        $countCommentsReplies = DB::result($sql);
        $sql = "UPDATE `vids_comment` SET
                `replies` = " . $countCommentsReplies . '
                WHERE `id` = ' . to_sql($cid);
        DB::execute($sql);
    }

    static function getCountCommentReplies($cid)
    {
        $sql = 'SELECT COUNT(*)
                  FROM `vids_comment`
                 WHERE `parent_id` = ' . to_sql($cid);
        return DB::result($sql);
    }

    static function getCountComment($pid)
    {
        $sql = 'SELECT `count_comments`
                  FROM `vids_video`
                 WHERE `id` = ' . to_sql($pid);
        return DB::result($sql, 0, DB_MAX_INDEX);
    }

    static function getId($pid)
    {
        return str_replace('v_', '', $pid);
    }
}