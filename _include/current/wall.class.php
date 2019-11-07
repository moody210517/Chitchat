<?php

/* (C) Websplosion LTD., 2001-2014

IMPORTANT: This is a commercial software product
and any kind of using it must agree to the Websplosion's license agreement.
It can be found at http://www.chameleonsocial.com/license.doc

This notice may not be removed from the source code. */


/* Table 'wall'
 * wall.comments_item
 * - comment counter for posts single photo and single video(`photo`, `vids_video`) without replies comments
 * - comment counter for wall posts without replies comments
 */

class Wall {

    const EMBED_VIDEO_WIDTH = 588;
    const EMBED_VIDEO_COMMENT_WIDTH = 540;
    const EMBED_VIDEO_COMMENT_WIDTH_CUSTOM = 420;
    const IMAGE_WIDTH_MOBILE = 612;
    static $dbIndex = 0;
    static $templatesUsername = array();
    static $templatesUsernameS = array();
    static $templatesUsernameLike = array();
    static $infoPhotoBigLimit = 3;
    static $infoPhotoBigLimitMobile = 2;
    //const URL_PROFILE = '<strong><a href="{url_main}search_results.php?display={display_profile}&name={name}">{name}</a></strong>';
    const URL_PROFILE = '<strong><a href="{url_main}{url_profile}">{name}</a></strong>';
    //const URL_PROFILE_S = '<strong><a href="{url_main}search_results.php?display={display_profile}&name={name}">{name}\'s</a></strong>';
    const URL_PROFILE_S = '<strong><a href="{url_main}{url_profile}">{name}\'s</a></strong>';
    const URL_PROFILE_LIKE = '<a href="{url_main}search_results.php?display={display_profile}&name={name}">{name}</a>';
    const URL_LIKE_USERS_LIST = '<a href="{url_main}search_results.php?wall_item_id={id}&uids_exclude={uids_exclude}">';

    static $urlSection = array(
        'forum_thread' => 'forum_topic.php?topic_id={item_id}',
        'forum_post' => 'forum_topic.php?topic_id={topic_id}&message_id={item_id}',
        'blog_post' => 'blogs_post.php?id={item_id}',
        'blog_comment' => 'blogs_post.php?id={post_id}',
        'pics' => 'gallery_album.php?album_id={album_id}',
        'pics' => 'gallery_album.php?album_id={album_id}',
        'places_review' => 'places_place_show.php?id={place_id}',
        'group_join' => 'groups_group_show.php?group_id={item_id}',
        'group_wall' => 'groups_group_show.php?group_id={group_id}',
        'group_wall_comment' => 'groups_group_show.php?group_id={group_id}',
        'group_link' => 'groups_group_show.php?group_id={group_id}',
        'group_forum_post' => 'groups_group_forum_show.php?forum_id={forum_id}',
        'group_forum_post_comment' => 'groups_group_forum_show.php?forum_id={forum_id}',

        'vids_comment' => 'vids_watch.php?id={item_id}',
        'event_comment' => 'events_event_show.php?event_id={event_id}',
        'event_comment_comment' => 'events_event_show.php?event_id={event_id}',
        'photo_comment' => 'search_results.php?display={display_profile}&name={name_uploader}',
        'vids' => 'vids_watch.php?id={item_id}',
        'music_comment' => 'music_song_show.php?song_id={song_id}',

        '3dcity' => 'city.php',
        'music' => 'music_song_show.php?song_id={item_id}',
        'music_photo' => 'music_song_show.php?song_id={item_id}',
        'pics_comment' => 'gallery_image.php?img_id={image_id}',
        'musician' => 'music_musician_show.php?musician_id={musician_id}',
        'musician_comment' => 'music_musician_show.php?musician_id={musician_id}',
        'musician_photo' => 'music_musician_show.php?musician_id={musician_id}',
        'event_added' => 'events_event_show.php?event_id={event_id}',
        'event_member' => 'events_event_show.php?event_id={event_id}',
        'event_photo' => 'events_event_show.php?event_id={event_id}',
        'places_photo' => 'places_place_show.php?id={place_id}',
        'comment' => '{url_main}search_results.php?display={display_profile}&name={wall}',
        'comment_urban' => '{url_main}search_results.php?display={display_profile}&uid={wall_user_id}',
    );
    static $uid = 0;
    static $siteSection = '';
    static $siteSectionItemId = '';
    static $tableWallItemsForUser = 'wall_items_for_user';
    static $singleItemMode = false;
    static $shareItem = false;
    static $siteSectionsOnly = false;
    static $sectionsHidden = false;
    static $isMobile = false;
    static $maxMediaWidth = 0;
    static $typeWall = '';
    static $tmplName = '';
    static $commentCustomClass = '';
    static $commentReplyCustomClass = '';
    static $commentsReplyParse = array();

    static function getIsMobile()
    {
        return self::$isMobile;
    }

    static function setIsMobile($isMobile)
    {
        self::$isMobile = $isMobile;
    }

    static $outsideImageSizes = array(
        array(
	        'width' => 588,
	        'height' => 440,
	        'allow_smaller' => true,
	        'file_postfix' => 'th',
            ),
        array(
	        'width' => 1200,
	        'height' => 1000,
	        'allow_smaller' => true,
	        'file_postfix' => 'b',
            ),
    );

    static $outsideImageSizesComment = array(
        array(
	        'width' => 540,
	        'height' => 404,
	        'allow_smaller' => true,
	        'file_postfix' => 'th',
            ),
        );

    static $commentsPreloadCount = 3;
    static $commentsLoadCount = 10;

    static function setCommentsPreloadCount($count)
    {
        self::$commentsPreloadCount = $count;
    }

    static function getCommentsPreloadCount()
    {
        $optionNameTemplate = Common::getTmplName();
        $defaultShowCommentsTemplate = Common::getOption('wall_show_comments', "{$optionNameTemplate}_wall_settings");
        if ($defaultShowCommentsTemplate !== null) {
            $defaultShowCommentsTemplate = intval($defaultShowCommentsTemplate);
            if (!$defaultShowCommentsTemplate) {
                $defaultShowCommentsTemplate = 1;
            }
            self::$commentsPreloadCount = $defaultShowCommentsTemplate;
        }

        return self::$commentsPreloadCount;
    }

	static function setCommentsLoadCount($count)
    {
        self::$commentsLoadCount = $count;
    }

    static function getCommentsLoadCount()
    {
        $optionNameTemplate = Common::getTmplName();
        $defaultLoadCommentsTemplate = Common::getOption('wall_show_comments_load', "{$optionNameTemplate}_wall_settings");
        if ($defaultLoadCommentsTemplate !== null) {
            $defaultLoadCommentsTemplate = intval($defaultLoadCommentsTemplate);
            if (!$defaultLoadCommentsTemplate) {
                $defaultLoadCommentsTemplate = 1;
            }
            self::$commentsLoadCount = $defaultLoadCommentsTemplate;
        }
        return self::$commentsLoadCount;
    }

    static function getPostsLoadCount()
    {
        $optionNameTemplate = Common::getTmplName();
        $defaultLoadTemplate = Common::getOption('wall_posts_by_default', "{$optionNameTemplate}_wall_settings");
        if ($defaultLoadTemplate !== null) {
            $defaultLoadTemplate = intval($defaultLoadTemplate);
        } else {
            $defaultLoadTemplate = Common::getOptionInt('wall_posts_by_default');
        }
        if (!$defaultLoadTemplate) {
            $defaultLoadTemplate = 10;
        }
        return $defaultLoadTemplate;
    }

    static function checkSectionsHidden()
    {
        $sectionsList = array(
            'city' => array('3dcity'),
            'blogs' => array('blog_post', 'blog_comment'),
            'forum' => array('forum_thread', 'forum_post'),
            'gallery' => array('pics', 'pics_comment'),
            'videogallery' => array('vids', 'vids_comment'),
            'music' => array('music', 'music_photo', 'music_comment', 'musician', 'musician_photo', 'musician_comment'),
            'places' => array('places_review', 'places_photo'),
            'events' => array('event_member', 'event_comment', 'event_comment_comment', 'event_photo'),
            'groups' => array('group_join', 'group_wall', 'group_wall_comment', 'group_forum_post', 'group_forum_post_comment'),
        );

        $sectionsHidden = self::getSectionsHidden();

        foreach($sectionsList as $option => $sections) {
            if(!Common::isOptionActive($option)) {
                if(!is_array($sectionsHidden)) {
                    $sectionsHidden = $sections;
                } else {
                    $sectionsHidden = array_merge($sectionsHidden, $sections);
                }
            }
        }

        self::setSectionsHidden($sectionsHidden);
    }

    static function setSectionsHidden($sectionsHidden)
    {
        self::$sectionsHidden = $sectionsHidden;
    }

    static function getSectionsHidden()
    {
        return self::$sectionsHidden;
    }

    static function setSiteSectionsOnly($sections)
    {
        self::$siteSectionsOnly = $sections;
    }

    static function getSiteSectionsOnly()
    {
        return self::$siteSectionsOnly;
    }

    static function setShareItem($shareItem)
    {
        self::$shareItem = $shareItem;
    }

    static function isShareItem()
    {
        return self::$shareItem;
    }

    static function setSingleItemMode($mode)
    {
        self::$singleItemMode = $mode;
    }

    static function isSingleItemMode()
    {
        return self::$singleItemMode;
    }


    static function getTableWallItemsForUser()
    {
        return self::$tableWallItemsForUser;
    }

    static function setSiteSection($siteSection)
    {
        self::$siteSection = $siteSection;
    }

    static function getSiteSection()
    {
        return self::$siteSection;
    }

    static function setSiteSectionItemId($siteSectionItemId)
    {
        self::$siteSectionItemId = $siteSectionItemId;
    }

    static function getSiteSectionItemId()
    {
        return self::$siteSectionItemId;
    }


    static function setUid($uid)
    {
        self::$uid = $uid;
    }

    static function getUid()
    {
        return self::$uid;
    }

    static function prepareUrlSection($section, $vars)
    {
        if (!Common::isOptionActive('seo_friendly_urls')) {
            return;
        }
        $tmplOptionSet = Common::getOption('set', 'template_options');
        if ($tmplOptionSet === 'urban' && $vars && is_array($vars)) {
            if ($section == 'comment' && isset($vars['wall_user_id'])) {
                self::$urlSection['comment_urban'] = User::url($vars['wall_user_id']);
            }
        }

    }

    static function getUrlSection($section, $tag = true, $vars = array())
    {
        global $g;
        $url = '';
        self::prepareUrlSection($section, $vars);
        $templSection = $section . '_' . Common::getOption('set', 'template_options');
        if (isset(self::$urlSection[$templSection])) {
            $url = self::$urlSection[$templSection];
        } elseif (isset(self::$urlSection[$section])) {
            $url = self::$urlSection[$section];
        }
        //$url = isset(self::$urlSection[$section]) ? self::$urlSection[$section] : '';
        if($tag) {
            $url = '<a href="' . $g['path']['url_main'] . $url . '">';
        }

        return $url;
    }

    static function getTypePrfLang($type)
    {
        global $l;
        $prf = Common::getTmplName();
        if (isset($l['all']["{$type}_{$prf}"])) {
            $type = "{$type}_{$prf}";
            return $type;
        }

        $prf = Common::getOption('set', 'template_options');
        if (isset($l['all']["{$type}_{$prf}"])) {
            $type = "{$type}_{$prf}";
        }
        return $type;
    }

    static function wallItemTitleTemplate($typeSection, $gender = '')
    {
        global $l;
        if ($gender != '') {
            $gender =  '_' . mb_strtolower($gender, 'UTF-8');
        }
        $shareTemplate = '';
        if(self::isShareItem()) {
            $shareTemplate = 'share_';
        }
        //Redo for lCascade()
        $type = self::getTypePrfLang('wall_item_title_template_' . $shareTemplate . $typeSection . $gender);
        if (!isset($l['all'][$type])) {
            $type = self::getTypePrfLang('wall_item_title_template_' . $shareTemplate . $typeSection);
            if ($gender == '' && !isset($l['all'][$type])) {
                $typeByGender = $type . '_m';
                if(isset($l['all'][$typeByGender])) {
                    $type = $typeByGender;
                }
            }
        }

        $template = isset($l['all'][$type]) ? $l['all'][$type] : $type;
        return $template;
    }


    static function addTemplatesUsername($name, $template)
    {
        self::$templatesUsername[$name] = $template;
    }

    static function getTemplateUsername_OLD($name)
    {
        global $g;

        if(!isset(self::$templatesUsername[$name])) {
            $sql = 'SELECT user_id FROM user
                WHERE name = ' . to_sql($name, 'Text');
            $uid = DB::result($sql, 0, DB_MAX_INDEX, true);

            $vars = array(
                'name' => $name,
                'url_main' => $g['path']['url_main'],
                'url_profile' => User::url($uid),
                //'display_profile' => self::displayProfile($uid),
            );
            self::$templatesUsername[$name] = Common::replaceByVars(self::URL_PROFILE, $vars);
        }

        return self::$templatesUsername[$name];
    }

    static function getTemplateUsernameS_OLD($name)
    {
        global $g;

        if(!isset(self::$templatesUsernameS[$name])) {
            $sql = 'SELECT user_id FROM user
                WHERE name = ' . to_sql($name, 'Text');
            $uid = DB::result($sql, 0, DB_MAX_INDEX, true);

            $vars = array(
                'name' => $name,
                'url_main' => $g['path']['url_main'],
                'url_profile' => User::url($uid),
                //'display_profile' => self::displayProfile($uid),
            );
            self::$templatesUsernameS[$name] = Common::replaceByVars(self::URL_PROFILE_S, $vars);

        }
        return self::$templatesUsernameS[$name];
    }

    static function getTemplateUsername($name, $uid)
    {
        global $g;

        if(!isset(self::$templatesUsername[$name])) {
            $vars = array(
                'name' => $name,
                'url_main' => $g['path']['url_main'],
                'url_profile' => User::url($uid),
                //'display_profile' => self::displayProfile($uid),
            );
            self::$templatesUsername[$name] = Common::replaceByVars(self::URL_PROFILE, $vars);
        }

        return self::$templatesUsername[$name];
    }

    static function getTemplateUsernameS($name, $uid)
    {
        global $g;

        if(!isset(self::$templatesUsernameS[$name])) {
            $vars = array(
                'name' => $name,
                'url_main' => $g['path']['url_main'],
                'url_profile' => User::url($uid),
                //'display_profile' => self::displayProfile($uid),
            );
            self::$templatesUsernameS[$name] = Common::replaceByVars(self::URL_PROFILE_S, $vars);

        }
        return self::$templatesUsernameS[$name];
    }

    static function getTemplateUsernameLike($name, $uid)
    {
        global $g;

        if(!isset(self::$templatesUsernameLike[$name])) {
            $vars = array(
                'name' => $name,
                'url_main' => $g['path']['url_main'],
                'display_profile' => self::displayProfile($uid),
            );
            self::$templatesUsernameLike[$name] = Common::replaceByVars(self::URL_PROFILE_LIKE, $vars);

        }
        return self::$templatesUsernameLike[$name];
    }

    static function setDbIndex($dbIndex)
    {
        self::$dbIndex = intval($dbIndex);
    }

    static function getDbIndex()
    {
        return self::$dbIndex;
    }

    static function includePath()
    {
        return dirname(__FILE__) . '/../../';
    }

    static function currentDateTime()
    {
        return date('Y-m-d H:i:s');
    }

    static function text_to_html($text)
    {
        $text = Common::parseLinksSmile($text);
        $text = VideoHosts::filterFromDb($text, '<div>', '</div>', self::EMBED_VIDEO_WIDTH);
        $class = (Common::isMobile()) ? 'image_comment' : 'feed_img_photo_single';
        $text = OutsideImages::filter_to_html($text, '<div class="' . $class . '">', '</div>', 'lightbox');
        $text = nl2br(trim($text));
        return $text;
    }

    static function isAlreadyPost($params = '')
    {
        $send = get_param('send');
        if (!$send) {
            return false;
        }

        $sql = "SELECT id FROM wall
                 WHERE comment_user_id = " . to_sql(guid()) . "
                   AND section = 'comment'
                   AND item_id = 0
                   AND params = " . to_sql($params, 'Text') . '
                   AND send = ' . to_sql($send);
        $check = DB::result($sql, 0, self::getDbIndex());
        return $check;
    }

    static function isAlreadyPostWidthImage($uid = false)
    {
        $send = get_param('send');
        if (!$send) {
            return false;
        }

        if ($uid === false) {
            $uid = guser('user_id');
        }

        $sql = "SELECT id FROM wall
                 WHERE user_id = " . to_sql(Wall::getUid()) . "
                   AND section = 'pics'
                   AND params_section = 'timeline'
                   AND parent_user_id = " . to_sql($uid) . '
                   AND send = ' . to_sql($send);
        $check = DB::result($sql, 0, self::getDbIndex());
        return $check;
    }


    static function add($section, $item = 0, $uid = false, $params = '', $unique = false, $hideFromUser = 0, $access = 'public', $parent = 0, $paramsSection = '')
    {
        $tmplWallType = Common::getOptionTemplate('wall_type');
        if ($tmplWallType == 'edge') {
            $access = guser('wall_post_access');
            if (!$access) {
                $access = Common::getOption('wall_post_access_default', 'edge_wall_settings');
            }
        }

        if ($uid === false) {
            $uid = guser('user_id');
        }

        if ($parent === true) {
            $parent = guser('user_id');
        }

        // check if row is unique
        if ($unique) {
            $sql = 'SELECT id FROM wall
                WHERE user_id = ' . to_sql($uid) . '
                    AND section = ' . to_sql($section, 'Text') . '
                    AND item_id = ' . to_sql($item) . '
                    AND params_section = ' . to_sql($paramsSection, 'Text') . '
                    AND params = ' . to_sql($params, 'Text');
            $check = DB::result($sql, 0, self::getDbIndex());
            if ($check) {
                return false;
            }
        }
        $commenterUserId = 0;
        if(($section == 'comment' || $section == 'status')
            && ($params != 'item_birthday')) {
            $uid = self::getUid();
            $commenterUserId = guid();
        }

        if ($params == 'item_birthday') {
            $commenterUserId = $uid;
        }

        if ($paramsSection == 'timeline') {
            $commenterUserId = guser('user_id');
        }

        /*if($section == 'comment' && $uid !== guser('user_id')) {
            self::add_stats('comments');
        } elseif($section == 'share') {
            self::add_stats('shared_posts');
        } else {
            self::add_stats('wall_posts');
        }*/

        //'pics_comment','photo_comment',

        $hideFromUserSections = array(
            'vids_comment',
            'music_comment',
            'musician_comment',
            'event_comment',
            'event_comment_comment',
            'group_forum_post',
            'group_forum_post_comment',
            'group_wall_comment',
            'blog_comment',
            'forum_post',
        );

        if(in_array($section, $hideFromUserSections)) {
            $hideFromUser = guid();
        }

        $siteSection = self::getSiteSection();
        $siteSectionItemId = self::getSiteSectionItemId();

        if($section == 'vids_comment') {
            $siteSection = 'vids';
        }

        if($section == 'vids') {
            $siteSection = 'vids';
            $siteSectionItemId = $item;
            if(Common::isOptionActive('video_approval')){
                $params='0';
            }
        }

        if($section == 'event_member' || $section == 'event_photo' || $section == 'event_added') {
            $siteSection = 'event';
            $siteSectionItemId = $item;
        }

        if($section == 'forum_post' || $section == 'forum_thread') {
            $siteSection = 'forum';
        }

        if($section == 'blog_post') {
            $siteSection = 'blog';
            $siteSectionItemId = $item;
        }

        if($section == 'places_photo') {
            $siteSection = 'places';
            $siteSectionItemId = $item;
        }

        if($section == 'group_join') {
            $siteSection = 'group';
            $siteSectionItemId = $item;
        }

        if($section == 'musician' || $section == 'musician_photo') {
            $siteSection = 'musician';
            $siteSectionItemId = $item;
        }

        if($section == 'music' || $section == 'music_photo') {
            $siteSection = 'music';
            $siteSectionItemId = $item;
        }

        if($section == 'photo_comment') {
            $siteSection = 'photo';
        }

        if($section == 'pics_comment') {
            $siteSection = 'pics';
        }

        if($siteSection != '' && $siteSectionItemId != '') {
            Wall::addItemForUser($siteSectionItemId, $siteSection, $uid);
        }

        $sql = 'INSERT INTO wall
            SET user_id = ' . to_sql($uid, 'Number') . ',
                section = ' . to_sql($section, 'Text') . ',
                access = ' . to_sql($access, 'Text') . ',
                item_id = ' . to_sql($item, 'Number') . ',
                parent_user_id = ' . to_sql($parent, 'Number') . ',
                params_section = ' . to_sql($paramsSection, 'Text') . ',
                params = ' . to_sql($params, 'Text') . ',
                date = ' . to_sql(self::currentDateTime(), 'Text') . ',
                hide_from_user = ' . to_sql($hideFromUser, 'Number'). ',
                comment_user_id = ' . to_sql($commenterUserId, 'Number') . ',
                site_section = ' . to_sql($siteSection, 'Text') . ',
                site_section_item_id = ' . to_sql($siteSectionItemId, 'Number') . ',
                send = ' . to_sql(get_param('send', getRand()));
        DB::execute($sql);

        $id = DB::insert_id();
        if ($section == 'share' && $item) {
            self::updateItem($item, false, false, true);
        }

        if ($uid != guid()) {
            self::sendAlert('message', $id, guid());
        }
        User::updateActivity(Wall::$uid);


        return $id;
    }

    static function addGroupAccess($section, $access, $wallId = 0, $pid = 0)
    {
        $lastItem = 0;
        if ($wallId) {
            $where = '`user_id` = ' . to_sql(guid());
            $lastItem = DB::select('wall', $where, 'id DESC', 1);
        }
        if ($wallId && $lastItem && isset($lastItem[0])
              && $lastItem[0]['section'] == $section
                && $lastItem[0]['access'] == $access){
            $wallId = $lastItem[0]['id'];
            DB::update('wall', array('item_id' => 0), 'id = ' . to_sql($wallId));
        } else {
            $wallId = Wall::add($section, $pid, false, '', false, 0, $access, 0);
        }
        return $wallId;
    }

    static function addGroup($section)
    {
        $lastItem = DB::select('wall', '`user_id` = ' . to_sql(guid()), 'id DESC', 1);
        if ($lastItem && isset($lastItem[0]) && $lastItem[0]['section'] == $section ){
            $wallId = $lastItem[0]['id'];
        } else {
            $wallId = Wall::add($section);
        }
        return $wallId;
    }

    // add remove by params? for photos by date
    // song/musician - remove photo section by item enough
    // remove one item
    static function remove($section, $item, $uid = false, $id = null)
    {
        if ($id === null) {
            $info = self::getItemInfo($section, $item, $uid);
        } else {
            $info = self::getItemInfoId($id);
        }

        // photo_default = item_id and params are equal
        if($section == 'photo_default') {
            $sql = 'SELECT * FROM wall
                WHERE section = "photo_default"
                AND ( item_id = ' . to_sql($item, 'Number') . '
                    OR params = ' . to_sql($item, 'Number') . ')';
            $rows = DB::rows($sql);
            foreach($rows as $row) {
                self::removeById($row['id']);
                self::deleteItemForUserByItem($info['site_section_item_id'], $info['site_section'], $info['user_id']);
            }
        } elseif ($section == 'photo' || $info) {
            // remove comments from wall
            // remove changes of photo from wall
            self::removeById($info['id']);
            self::deleteItemForUserByItem($info['site_section_item_id'], $info['site_section'], $info['user_id']);
        }
    }

    static function removeByParams($section, $item, $params, $uid = false)
    {
        $info = self::getItemInfoByParams($section, $item, $params, $uid);

        // photo_default = item_id and params are equal
        // remove changes of photo from wall
        self::removeById($info['id']);
    }

    static function removeById($id)
    {
        $dbIndex = self::getDbIndex();

        $sql = 'DELETE FROM wall_likes
            WHERE wall_item_id = ' . to_sql($id, 'Number');
        DB::execute($sql);

        $sql = 'SELECT * FROM wall_comments
            WHERE wall_item_id = ' . to_sql($id, 'Number');
        $rows = DB::rows($sql, $dbIndex);
        if(Common::isValidArray($rows)) {
            foreach($rows as $row) {
                self::removeComment($row['id'], false);
            }
        }

        // only text
        //$sql = 'SELECT params FROM wall WHERE id = ' . to_sql($id);
        //$params = trim(DB::result($sql, 0, $dbIndex));
        $itemData = DB::one('wall', '`id` = ' . to_sql($id), '', '*', '', $dbIndex);
        if ($itemData) {
            $params = $itemData['params'];
            if($params) {
                OutsideImages::on_delete($params);
                self::deleteImage($id);
            }
            if ($itemData['section'] != 'share') {
                $sql = 'SELECT `id` FROM wall
                         WHERE section = "share"
                           AND item_id = ' . to_sql($id, 'Number');
                $shareItems = DB::rows($sql);
                foreach ($shareItems as $key => $item) {
                    $sql = 'SELECT * FROM wall_comments
                             WHERE wall_item_id = ' . to_sql($item['id'], 'Number');
                    $rows = DB::rows($sql, $dbIndex);
                    foreach($rows as $row) {
                        self::removeComment($row['id'], false);
                    }
                }
            }
        }

        $sql = 'DELETE FROM wall
                 WHERE id = ' . to_sql($id, 'Number') . '
                    OR (section = "share"
                    AND item_id = ' . to_sql($id, 'Number') . ')';
        DB::execute($sql);


        if ($itemData && $itemData['section'] == 'share' && $itemData['item_id']) {
            self::updateItem($itemData['item_id'], false, false, true);
        }
    }

    // remove from wall by uid
    static function removeByUid($uid, $index = 0)
    {
        // select all items
        $sql = 'SELECT `id`
                  FROM `wall`
                 WHERE `user_id` = ' . to_sql($uid, 'Number')
                . ' OR `comment_user_id` = '  . to_sql($uid, 'Number');
        $rows = DB::rows($sql, $index);

        if(Common::isValidArray($rows)) {
            foreach($rows as $row) {
                self::removeById($row['id']);
            }
        }

        // delete comments from user
        $sql = 'SELECT * FROM wall_comments
            WHERE user_id = ' . to_sql($uid, 'Number');
        $rows = DB::rows($sql, $index);
        if(Common::isValidArray($rows)) {
            foreach($rows as $row) {
                self::removeComment($row['id']);
            }
        }

        // delete likes from user
        $sql = 'SELECT * FROM wall_likes
            WHERE user_id = ' . to_sql($uid, 'Number');
        DB::query($sql, $index);
        $sql = 'DELETE FROM wall_likes
            WHERE user_id = ' . to_sql($uid, 'Number');
        DB::execute($sql);

        $ids = '0';

        while ($row = DB::fetch_row($index)) {
            $ids .= ',' . intval($row['wall_item_id']);
        }
        $sql = 'UPDATE wall AS w
            SET likes = (SELECT COUNT(*) FROM wall_likes
                WHERE wall_item_id = w.id)
            WHERE id IN(' . $ids . ')';
        DB::execute($sql);

        self::deleteItemForUserByUid($uid);
    }

    static function removeBySiteSection($section, $id)
    {
        $sql = 'SELECT * FROM wall
            WHERE site_section = ' . to_sql($section, 'Text') . '
                AND site_section_item_id = ' . to_sql($id, 'Number');

        $rows = DB::rows($sql, self::$dbIndex);

        if(Common::isValidArray($rows)) {
            foreach($rows as $row) {
                self::removeById($row['id']);
            }
        }

        self::deleteItemForUserByItemOnly($id, $section);
    }

    static function removeBySection($section, $id, $uid = 0)
    {
        $sql = 'SELECT * FROM wall
                 WHERE section = ' . to_sql($section, 'Text') . '
                   AND item_id = ' . to_sql($id, 'Number');
        if ($uid) {
            $sql .= ' AND user_id = ' . to_sql($uid);
        }
        $rows = DB::rows($sql, self::$dbIndex);

        if(Common::isValidArray($rows)) {
            foreach($rows as $row) {
                self::removeById($row['id']);
            }
        }
    }

    static function getItemInfoId($id, $index = 4)
    {
        $sql = 'SELECT * FROM `wall` WHERE `id` = ' . to_sql($id, 'Number');
        $info = DB::row($sql, $index);
        return $info;
    }

    static function getItemInfo($section, $item, $uid = false, $index = 4)
    {
        $where = '';
        if ($uid) {
            $where = ' AND user_id = ' . to_sql($uid, 'Number');
        }

        $sql = 'SELECT * FROM wall
            WHERE section = ' . to_sql($section, 'Text') . '
                AND item_id = ' . to_sql($item, 'Number') . $where;

        $info = DB::row($sql, $index);
        return $info;
    }

    static function getItemInfoByParams($section, $item, $params, $uid = false)
    {
        $where = '';
        if ($uid) {
            $where = ' AND user_id = ' . to_sql($uid, 'Number');
        }

        $sql = 'SELECT * FROM wall
            WHERE section = ' . to_sql($section, 'Text') . '
                AND params = ' . to_sql($params, 'Text') . '
                AND item_id = ' . to_sql($item, 'Number') . $where;
        $info = DB::row($sql, self::getDbIndex());
        return $info;
    }


    static function itemInfoPrepare($row)
    {
        global $g, $p;

        $vars = array();
        $vars['id'] = $row['id'];
        $vars['item_id'] = $row['item_id'];
        $vars['item_user_id'] = $row['item_user_id'];
        $vars['item_section'] = $row['section'];
        $itemSectionReal = $row['section_real'];
        if ($row['section'] == 'photo' && !$row['item_id']) {
            $itemSectionReal = 'photos';
        }
        $vars['item_section_real'] = $itemSectionReal;
        $vars['item_send'] = $row['send'];

        $vars['url_profile_link_param'] = 'ref=wall&ref_item=' . $row['id'];
        $refUid = $row['item_user_id'];
        $prfTitle = '';
        $isVisitorLoadTimeLine = self::isVisitorLoadPicsInTimeLine($row);
        if ($isVisitorLoadTimeLine) {
            $refUid = $row['comment_user_id'];
            $row['user_id'] = $row['comment_user_id'];
            $user = User::getInfoBasic($refUid);
            $vars['name_user_item'] = $row['name'];
            $row['name'] = $user['name'];
            $row['gender'] = $user['gender'];
            $row['age'] = $user['age'];
            $prfTitle = '_visitor';
        }
        if ($p != 'wall.php') {
            $vars['url_profile_link_param'] .= '&ref_uid=' . $refUid;
        }
        $vars['url_profile_link']= User::url($refUid);

        $vars['age'] = $row['age'];
        if(isset($row['item_name'])) {
            $vars['item_name'] = $row['item_name'];
            $vars['item_name_user_id'] = $row['item_name_user_id'];
            $vars['name'] = $row['name'];
            $vars['share_name'] = $row['name'];
            $vars['photo'] = $row['item_photo'];
            $vars['share_photo'] = User::getPhotoDefault($row['user_id'], 'r');
            $vars['time_ago'] = timeAgo($row['item_date'], 'now', 'string', 60, 'second');
            $vars['time_photo_date'] = toAttr(Common::dateFormat($row['item_date'], 'photo_date'));
        } else {
            $sizePhoto = 'r';
            if (Common::isOptionTemplateSet()) {
                $sizePhoto = 'm';
            }
            $vars['name'] = $row['name'];
            $vars['photo'] = User::getPhotoDefault($row['user_id'], $sizePhoto, false, $row['gender']);
            $vars['item_user_id'] = $row['user_id'];
            $vars['item_name'] = $row['name'];
            $vars['item_name_user_id'] = $row['user_id'];
            $vars['time_ago'] = timeAgo($row['date'], 'now', 'string', 60, 'second');
            $vars['time_photo_date'] = toAttr(Common::dateFormat($row['date'], 'photo_date'));
        }

        $vars['url_main'] = $g['path']['url_main'];

        $vars['wall_item_title_template'] = self::wallItemTitleTemplate($row['section'] . $prfTitle, $row['gender']);
        return $vars;
    }

    static function parseLikes(&$html, $id, $likes, $index = 2)
    {
        $uids = User::getFriendsList(guid());

        $wallLikeClassButton = '';
        $wallLikeClass = 'wall_like_hide';

        $iLikeIt = false;
        $listLikesUser = array();
        $listLikesUserInfo = array();
        $listLikesUserPhoto = array();
        if ($likes) {
            $cmd = get_param('cmd');
            if ($cmd == 'like' || $cmd == 'unlike' && $html->varExists('wall_last_action_like_update')) {
                $sql = 'SELECT `last_action_like` FROM `wall` WHERE id = ' . to_sql($id);
                $html->setvar('wall_last_action_like_update', DB::result($sql));
            }

            $wallLikeClass = '';

            $optionSetTemplate = Common::getOption('set', 'template_options');
            $templateParseLikes = Common::isOptionActiveTemplate('wall_parse_likes');//Edge
            if ($optionSetTemplate == 'urban' && !$templateParseLikes) {
                $sql = "SELECT u.user_id, u.name, u.gender, DATE_FORMAT(NOW(), '%Y') - DATE_FORMAT(u.birth, '%Y') - (DATE_FORMAT(NOW(), '00-%m-%d') < DATE_FORMAT(u.birth, '00-%m-%d')) AS age, u.name_seo
                          FROM wall_likes AS w
                          LEFT JOIN user AS u ON u.user_id = w.user_id
                         WHERE w.wall_item_id = " . to_sql($id, 'Number') . '
                         ORDER BY id DESC';
            } else {
                if ($templateParseLikes && Common::isMobile(false, true)) {
                    $limit = 3;
                    if($likes > $limit) {
                        $limit = 2;
                    } else {
                        $limit = $likes;
                    }
                } else {
                    $limit = 4;
                    if($likes > $limit) {
                        $limit = 3;
                    } else {
                        $limit = $likes;
                    }
                }
                $sql = 'SELECT u.user_id, u.name,
                IF(u.user_id = ' . to_sql(guid(), 'Number') . ', 2,
                    IF(u.user_id IN (' . to_sql($uids, 'Plain') . '), 1, 0)
                ) AS order_param, u.name_seo, u.gender FROM wall_likes AS w
                LEFT JOIN user AS u ON u.user_id = w.user_id
                WHERE w.wall_item_id = ' . to_sql($id, 'Number') . '
                ORDER BY order_param DESC, id DESC LIMIT ' . $limit;
            }

            DB::query($sql, $index);

            if ($html->varExists('wall_like_count')) {
                $html->setvar('wall_like_count', $likes - $limit);
            }

            $wallLikeDelimiter = '';
            $counter = 0;
            $uidsExclude = array();
            $userLike = false;

            if ($optionSetTemplate == 'urban' && !$templateParseLikes) {
                $i = 1;
                $blockUserLike = 'wall_like_user';
                $numLikes = DB::num_rows($index);
                while ($user = DB::fetch_row($index)) {
                    $listLikesUser[] = $user['user_id'];
                    if ($user['user_id'] == guid()) {
                        $iLikeIt = true;
                    }
                    $position = $i%2 == 0 ? 'left': 'right';
                    $positionClean = $i%2 == 0 ? 'right': 'left';
                    $html->clean("{$blockUserLike}_{$positionClean}");
                    $isParseMore = 0;
                    if ($i == 11 && $numLikes > 12) {
                        $isParseMore = 1;
                        $i++;
                        $html->parse("{$blockUserLike}_more", false);
                        $html->parse("{$blockUserLike}_{$position}_list", true);
                    }
                    $html->clean("{$blockUserLike}_more");
                    if ($isParseMore) {
                        $position = 'left';
                        $positionClean = 'right';
                    }
                    $html->setvar("{$blockUserLike}_id", $user['user_id']);
                    $html->setvar("{$blockUserLike}_profile_link", User::url($user['user_id'], $user));
                    $photo = User::getPhotoDefault($user['user_id'], 's', false, $user['gender']);
                    $html->setvar("{$blockUserLike}_photo", $photo);
                    $html->setvar("{$blockUserLike}_name", $user['name']);
                    $html->setvar("{$blockUserLike}_age", $user['age']);
                    $listLikesUserInfo[$user['user_id']]['photo'] = $photo;
                    $listLikesUserInfo[$user['user_id']]['name'] = $user['name'];
                    $listLikesUserInfo[$user['user_id']]['age'] = $user['age'];
                    $html->parse("{$blockUserLike}_{$position}", false);
                    $html->parse("{$blockUserLike}_{$position}_list", true);
                    $i++;
                }
                if ($numLikes > 12) {

                }
            } else {
                while ($user = DB::fetch_row($index)) {
                    $userLike = $user;
                    $uidsExclude[] = $user['user_id'];
                    $counter++;
                    if($user['name'] == guser('name')) {
                        if($likes > 1) {
                            $html->parse('wall_like_you', false);
                        }
                        $iLikeIt = true;
                        $wallLikeDelimiter = ', ';
                    } else {
                        if($counter == $likes && $likes > 1) {
                            $wallLikeDelimiter = ' ' . l('and') . ' ';
                        }

                        if($counter == 1) {
                            $wallLikeDelimiter = '';
                        }

                        $html->setvar('wall_like_delimiter', $wallLikeDelimiter);

                        if ($html->varExists('wall_like_user_url')) {
                            $html->setvar('wall_like_user_url', User::url($user['user_id']));
                        }
                        $html->setvar('wall_like_name', $user['name']);
                        $html->setvar('wall_like_display_profile', self::displayProfile($user['user_id']));

                        if($likes > 1) {
                            $html->parse('wall_like_user', true);
                        }

                        if($likes > 2) {
                            $wallLikeDelimiter = ', ';
                        }

                    }
                }
                if ($templateParseLikes) {
                    $listLikesUser = $uidsExclude;
                }
                if($likes == 1) {
                    if($iLikeIt) {
                        $wallLikeOne = l('wall_only_you_like');
                    } else {
                        $nameUrl = self::getTemplateUsernameLike($userLike['name'], $userLike['user_id']);
                        $userLikeGender = User::getInfoBasic($userLike['user_id'], 'gender');
                        if($userLikeGender == '') {
                            $userLikeGender = 'm';
                        }
                        $wallLikeOne = lSetVars('wall_only_one_person_likes' . '_' . mb_strtolower($userLikeGender, 'UTF-8'), array('name' => $nameUrl));
                    }

                    $html->setvar('wall_like_one', $wallLikeOne);
                    $html->parse('wall_like_one', false);
                } elseif($likes > $limit) {
                    #$html->setvar('uids_exclude', implode(',', $uidsExclude));

                    $wallLikesCount = $likes - $limit;

                    if ($optionSetTemplate == 'urban') {
                        $urlStart = Common::getOption('url_main', 'path') . Common::pageUrl('wall_liked', null, $id);
                        $urlStart = '<a href="' . $urlStart . '">';
                    } else {
                        $vars = array(
                            'url_main' => Common::getOption('url_main', 'path'),
                            'id' => $id,
                            'uids_exclude' => implode(',', $uidsExclude),
                        );
                        $urlStart = Common::replaceByVars(self::URL_LIKE_USERS_LIST, $vars);
                    }

                    $vars = array(
                        'count' => $wallLikesCount,
                        'url_start' => $urlStart,
                        'url_end' => '</a>',
                    );
                    $html->setvar('wall_and_more_people_like_this', lSetVars('wall_and_more_people_like_this', $vars));

                    $html->parse('wall_like_more', true);
                } elseif ($likes > 1) {
                    $html->parse('wall_like_names', true);
                }
            }
        }

        $wallLikeHidden = '';
        if($iLikeIt) {
            $wallLikeHidden = 'wall_like_hidden';
            $html->parse('link_unlike');
        } else {
            $html->parse('icon_like');
        }

        $html->setvar('wall_like_hidden', $wallLikeHidden);

        /* Urban */
        $btnLike = 'wall_item_like_btn';
        if ($html->blockExists("{$btnLike}_selected")) {
            $btnLikeTitle = toAttrL('like');
            if ($iLikeIt) {
                $btnLikeTitle = toAttrL('unlike');
                $html->parse("{$btnLike}_selected", false);
            }
            $html->setvar("{$btnLike}_title", $btnLikeTitle);
        }
        if ($listLikesUser) {
            $html->setvar('wall_like_user_info_list', json_encode($listLikesUserInfo));
            $html->setvar('wall_like_user_list', implode(',', $listLikesUser));
        } else {
            $html->setvar('wall_like_user_photo_list', '');
            $html->setvar('wall_like_user_list', '');
        }
        /* Urban */
        $html->parse('wall_module_like', false);

        $html->setvar('wall_like_class', $wallLikeClass);
        $html->setvar('wall_like_class_button', $wallLikeClassButton);
        $html->parse('wall_item_like', true);
        $html->setblockvar('wall_like_you', '');
        $html->setblockvar('wall_like', '');
        $html->setblockvar('wall_likes', '');

        $html->clean('wall_item_like_btn_selected');
        $html->clean('wall_like_user_left_list');
        $html->clean('wall_like_user_right_list');

        $html->setblockvar('wall_like_user', '');
        $html->setblockvar('link_unlike', '');
        $html->setblockvar('icon_like', '');
        $html->setblockvar('wall_like_one', '');
        $html->setblockvar('wall_like_names', '');
    }

    static function parseJs(&$html, $js)
    {
        $html->setvar('wall_js', $js);
    }


    static function prepareComment($comment, $isGallery = false)
    {
        $optionSetTemplate = Common::getTmplSet();
        VideoHosts::setEmbedUrlShow(false);

        $embedVideoCommentWidth = self::EMBED_VIDEO_COMMENT_WIDTH;
        $pretag = '<br>';
        $posttag = '';
        if ($optionSetTemplate == 'urban') {
            $embedVideoCommentWidth = 800;
			$pretag = '<div class="wall_video_one_post">';
			$posttag = '</div>';
            if ($isGallery) {
                $pretag = '<div class="gallery_video_one_post">';
            }
        }

        $comment = ltrim($comment);
        $comment = Common::parseLinksSmile($comment);

        $comment = wrapTextInConntentWithMedia($comment, '<div class="txt_comment">', '</div>');

        $comment = VideoHosts::filterFromDb($comment, $pretag, $posttag, $embedVideoCommentWidth);

        $comment = OutsideImages::filter_to_html($comment, '<div class="image_comment">', '</div>', 'timeline_photo_comment', '', false, 'comment_');

        VideoHosts::setEmbedUrlShow(false);

        if (stristr($comment, '{user:') !== false) {
            $user = grabs($comment, '{user:', '}');
            if (isset($user[0])) {
                $uid = $user[0];
                $userInfo = User::getInfoBasic($uid, false, DB_MAX_INDEX);
                $userUrl = User::url($uid, $userInfo);
                $userUrl = Common::getLinkHtml($userUrl) . $userInfo['name'] . '</a>';
                $comment = str_replace("{user:{$uid}}", $userUrl, $comment);
            }
        }

        $comment = nl2br($comment);

        return $comment;
    }


    static function parseComment(&$html, $comment, $block = 'comment')
    {
        global $g_user;

        if (!empty($comment)) {

            if ($block == 'comments_reply_item' && self::$commentReplyCustomClass == 'comment_attach_reply_one_add') {//Update wall - download instead of remote
                if (isset(self::$commentsReplyParse[$comment['id']])) {
                    return;
                }
            }

            self::markReadCommentAndLikeOne($comment);

            $commentText = self::prepareComment($comment['comment']);
            $html->setvar("{$block}_text", $commentText);

            $html->setvar("{$block}_user_id", $comment['user_id']);
            $html->setvar("{$block}_user_name", $comment['user_name']);
            $html->setvar("{$block}_user_photo", $comment['user_photo']);
            $html->setvar("{$block}_user_url", User::url($comment['user_id']));

            $vars = array(
                'id'              => $comment['id'],
                'parent_id'       => isset($comment['parent_id']) ? $comment['parent_id'] : 0,
                'send'            => $comment['send'],
                'date'            => timeAgo($comment['date'], 'now', 'string', 60, 'second'),
                'date_full'       => toAttr(Common::dateFormat($comment['date'], 'photo_date')),
                'display_profile' => $comment['display_profile'],
                'url_page_liked'  => Common::getOption('url_main', 'path') . Common::pageUrl('wall_liked_comment', null, $comment['id'])
            );
            if ($block == 'comments_reply_item') {
                $vars['custom_class'] = self::$commentReplyCustomClass;
            }
            $html->assign($block, $vars);

            $isParseCommentsLikes = Common::isOptionActiveTemplate('wall_parse_comments_likes');
            if ($isParseCommentsLikes) {
                $likeTitle = l('like');
                $likeTitleAlt = '';
                $likeValue = 1;
                if (isset($comment['like'])) {
                    $likeTitle = l('liked');
                    $likeTitleAlt = l('unlike');
                    $likeValue = 0;
                }
                $html->setvar("{$block}_like_title", $likeTitle);
                $html->setvar("{$block}_like_title_alt", $likeTitleAlt);
                $html->setvar("{$block}_like", $likeValue);

                $countLikes = 0;
                if (isset($comment['count_likes'])) {
                    $countLikes = $comment['count_likes'];
                }
                $html->subcond(!$countLikes, "{$block}_likes_hide");
                $html->setvar("{$block}_count_like", $countLikes);

                $countLikesUsers = '';
                if (isset($comment['count_likes_users'])) {
                    $countLikesUsers = $comment['count_likes_users'];
                }
                $html->setvar("{$block}_count_like_users", $countLikesUsers);
            }

            if (guid() == $comment['user_id']) {
				$html->parse("{$block}_delete", false);
            } else {
				$html->clean("{$block}_delete");
			}

            if ($block == 'comments_reply_item' && self::$commentReplyCustomClass == 'comment_attach_reply_one') {//Update wall
                self::$commentsReplyParse[$comment['id']] = 1;
            }
            $html->parse($block, true);
        }
    }


    static function prepareDataComment($comment)
    {
        $user = User::getInfoBasic($comment['user_id'], false, 2);
        if (!$user) {
            return false;
        }
        $commentInfo = array();
        $commentInfo['id'] = $comment['id'];
        $commentInfo['parent_id'] = $comment['parent_id'];
        $commentInfo['user_id'] = $comment['user_id'];
        $commentInfo['photo_user_id'] = 0;

        $commentInfo['comment'] = $comment['comment'];
        $commentInfo['date'] = $comment['date'];
        $commentInfo['display_profile'] = User::displayProfile();
        $commentInfo['user_name'] = $user['name'];
        $commentInfo['user_photo'] = User::getPhotoDefault($comment['user_id'], "r", false, $user['gender']);
        $commentInfo['user_photo_id'] = User::getPhotoDefault($comment['user_id'], "r", true);
        $commentInfo['count_likes'] = $comment['likes'];
        $commentInfo['count_likes_users'] = User::getTitleLikeUsersComment($comment['id'], $comment['likes'], 'wall');

        $commentInfo['send'] = $comment['send'];
        $commentInfo['is_new_like'] = $comment['is_new_like'];
        $commentInfo['is_new'] = $comment['is_new'];

        return $commentInfo;
    }


    static function parseRepliesComments(&$html, $id, $cid, $numberReplies, $alwaysView = false, $commentsLikes = null, $notifParseComments = false)
    {
        $cmd = get_param('cmd');
        $paramCid = get_param_int('cid');

        $blockItem = 'comments_reply_item';
        $blockReplyLoadWall = "{$blockItem}_load_wall";
        $html->clean($blockReplyLoadWall);
        $html->clean($blockItem);
        $block = 'comments_reply_list';

        $html->clean("{$block}_load");
        $html->clean("{$block}_load_number");
        $html->clean($block);

        if (!$numberReplies) {
            return false;
        }

        $html->setvar("{$block}_comments_number", $numberReplies);

        $numberVisibleCommentReplyList = self::getNumberShowCommentsReplies();
        if (!$numberVisibleCommentReplyList && !$alwaysView) {
            $html->setvar("{$blockReplyLoadWall}_id", $cid);
            $sql = "SELECT `id` FROM `wall_comments` WHERE `parent_id` = " . to_sql($cid) .
                   " ORDER BY id DESC LIMIT 1";
            $lastIdReply = DB::result($sql, 0, DB_MAX_INDEX);
            $html->setvar("{$blockReplyLoadWall}_last_id", $lastIdReply);
            $html->parse($blockReplyLoadWall, false);

            $vars = array(
                'view_number' => 0,
                'all_number' => $numberReplies
            );
            $html->setvar("{$block}_load_title", lSetVars('view_previous_replies_number_all', $vars));
            $html->setvar("{$block}_load_number", lSetVars('view_previous_replies_number', $vars));
            $html->parse("{$block}_load", false);
            return false;
        }

        if ($alwaysView) {
            $numberVisibleCommentReplyList = self::getNumberShowCommentsRepliesLoadMore();
        }

        $where = '';
        $lastId = get_param_int('last_id');
        $limit = $numberVisibleCommentReplyList;

        $limitParam = get_param_int('limit');
        if ($limitParam) {
            $limit = $limitParam;
        }

        if ($notifParseComments) {
            $limit = 0;
        }

        if (($cmd == 'comment' || $cmd == 'update')
                && self::$commentCustomClass != 'comment_attach'
                && self::$commentCustomClass != 'comment_attach_reply_add') {
            $where = ' AND `id` > ' . to_sql($lastId);
            $limit = 0;
        } elseif($cmd == 'comment_delete' && get_param_int('cid_parent')){
            $where = ' AND `id` < ' . to_sql($lastId);
            $limit = 1;
        } elseif ($cmd == 'comments_load') {
            $where = '';
            if ($lastId && $paramCid) {
                $where = ' AND `id` < ' . to_sql($lastId);
            }
        }

        $sqlLimit = '';
        $lastIdReply = 0;
        if ($limit) {
            if (self::$commentCustomClass != 'comment_attach_reply_add') {
                $limit = $limit + 1;

                $sql = "SELECT `id` FROM `wall_comments` WHERE `parent_id` = " . to_sql($cid) .
                       " ORDER BY id ASC LIMIT 1";
                $lastIdReply = DB::result($sql, 0, DB_MAX_INDEX);
            }

            $sqlLimit = ' LIMIT ' . to_sql($limit, 'Number');
        }

        $sql = "SELECT *
                  FROM `wall_comments`
                 WHERE `parent_id` = " . to_sql($cid) . $where .
               " ORDER BY id DESC " . $sqlLimit;
        $replies = DB::all($sql);

        if ($lastIdReply && $replies) {
            $isUnset = true;
            foreach ($replies as $key => $comment) {
                if ($comment['id'] == $lastIdReply) {
                    $isUnset = false;
                    break;
                }
            }
            if ($isUnset) {
                array_pop($replies);
            } else {
                $numberVisibleCommentReplyList++;
            }
        }

        if ($commentsLikes === null) {
            $commentsLikes = self::getAllLikesCommentsFromUser($id, $cid);
        }

        if ($replies) {
            $replies = array_reverse($replies);
            foreach ($replies as $key => $comment) {
                $commentInfoReply = self::prepareDataComment($comment);
                if (isset($commentsLikes[$comment['id']])) {
                    $commentInfoReply['like'] = 1;
                }
                self::parseComment($html, $commentInfoReply, 'comments_reply_item');
            }
            $html->parse($block, false);
        }

        if (!$notifParseComments && $numberReplies > $numberVisibleCommentReplyList) {
            $html->setvar("{$block}_load_title", l('view_previous_replies'));
            $vars = array(
                'view_number' => count($replies),
                'all_number' => $numberReplies
            );
            $html->setvar("{$block}_load_number", lSetVars('view_previous_replies_number', $vars));
            $html->parse("{$block}_load_number", false);
            $html->parse("{$block}_load", false);
        }
        return true;
    }

    static function getUrlLikedPage($media, $id){
        $urlAlias = $media ? $media : 'wall';
        return Common::getOption('url_main', 'path') . Common::pageUrl("{$urlAlias}_liked_comment", null, $id);
    }

    static function parseComments(&$html, $id, $index = 2, $start = 0, $limit = 3, $cid = 0, $where = '', $row = false)
    {
        $limit = intval($limit);//Fix for limit="" PHP 7.1
        $guid = guid();
		$optionSetTemplate = Common::getOption('set', 'template_options');
        $tmplWallType = Common::getOptionTemplate('wall_type');
        $isEdgeWall = $tmplWallType == 'edge';
		$cmd = get_param('cmd');

        $noParseComments = $optionSetTemplate == 'urban' && $cmd != 'comment' && $cmd != 'comments_load';
        if ($noParseComments && !$isEdgeWall) {
            return array();
        }

        if($start) {
			if ($optionSetTemplate == 'urban' && $cmd != 'comment') {
				$where .= ' AND c.id < ' . to_sql($start, 'Number');
			} else {
				$where .= ' AND c.id > ' . to_sql($start, 'Number');
			}
        }

        if($cid) {
            $where = ' AND c.id = ' . to_sql($cid, 'Number');
        }

        $rcid = get_param_int('reply_id');
        if ($rcid) {
            $where = ' AND c.id = ' . to_sql($rcid);
            $limit = 1;
        }

        if ($isEdgeWall) {
            $alwaysViewReplies = false;
            $where .= ' AND c.parent_id = 0';
            if (($cmd == 'comments_load' && $cid)
                 || ($cmd == 'comment' && $rcid)
                 || ($cmd == 'comment_delete' && get_param_int('cid_parent'))) {
                $alwaysViewReplies = true;
            }
        }

		$order = 'ASC';
		if ($optionSetTemplate == 'urban') {
			$order = 'DESC';
		}

		if ($html->varExists('last_comment_id')) {
			$sql = 'SELECT id
					  FROM wall_comments
					 WHERE wall_item_id = ' . to_sql($id, 'Number') . ' ORDER BY id ASC LIMIT 1';
			$html->setvar('last_comment_id', DB::result($sql));
		}
        // comments on item
        $sql = 'SELECT c.*, u.*, c.user_id AS comment_user_id,
                       w.user_id AS wall_user_id, w.comments_item, w.comments, w.last_action_like, w.last_action_comment
                  FROM wall_comments AS c
                  LEFT JOIN user AS u ON u.user_id = c.user_id
                  JOIN wall AS w ON w.id = c.wall_item_id
                 WHERE wall_item_id = ' . to_sql($id, 'Number') . $where . '
                 ORDER BY c.id ' . $order;

        $mediaSection = '';
        $commentsLikes = array();
        if ($isEdgeWall && $row['section_real'] != 'share') {
            if ($row === false) {
                $row = DB::row('SELECT * FROM `wall` WHERE `id` = ' . to_sql($id));
            }
            if ($row['section'] == 'vids') {
                $sql = "SELECT c.*, u.*, c.user_id AS comment_user_id, c.text AS comment, c.dt AS date,
                               w.user_id AS wall_user_id, w.comments_item, w.comments, w.last_action_like, w.last_action_comment
                              FROM `vids_comment` AS c
                              LEFT JOIN user AS u ON u.user_id = c.user_id
                              JOIN wall AS w ON w.id = " . to_sql($row['id']) . "
                             WHERE c.video_id = " . to_sql($row['item_id'])
                           . " AND c.parent_id = 0"
                               . $where
                         . " ORDER BY c.id " . $order;
                $mediaSection = 'video';
            }elseif ($row['section'] == 'photo' && $row['item_id']) {
                $sql = "SELECT c.*, u.*, c.user_id AS comment_user_id,
                               w.user_id AS wall_user_id, w.comments_item, w.comments, w.last_action_like, w.last_action_comment
                          FROM `photo_comments` AS c
                          LEFT JOIN user AS u ON u.user_id = c.user_id
                          JOIN wall AS w ON w.id = " . to_sql($row['id']) . "
                         WHERE c.photo_id = " . to_sql($row['item_id'])
                       . " AND c.parent_id = 0"
                       . " AND c.system = 0 " . $where
                     . " ORDER BY c.id " . $order;
                $mediaSection = 'photo';
            }
            if ($mediaSection) {
                $commentsLikes = CProfilePhoto::getAllLikesCommentsFromUser($mediaSection);
            }
        }

        $isParseCommentsLikes = Common::isOptionActiveTemplate('wall_parse_comments_likes');
        if ($isParseCommentsLikes && !$mediaSection) {
            $commentsLikes = self::getAllLikesCommentsFromUser($id);
        }

        if ($html->varExists('comment_guid_uid')) {
            $vars = array('uid'   => $guid,
                          'name'  => guser('name'),
                          'photo' => User::getPhotoDefault($guid, 'r'),
                          'url'   => User::url($guid)
            );
            $html->assign('comment_guid', $vars);
        }
        /* Edge */

        if ($limit) {
            $sql .=' LIMIT ' . $limit;
        }
        //print_r_pre($sql);
        //print_r_pre(DB::all($sql));

        //DB::query($sql, $index);
        $commentsAll = DB::all($sql, $index);
        if ($isEdgeWall && $cmd != 'comments_load' && $cmd != 'update') {
            krsort($commentsAll);
        }

        $indexLine = 0;
        $commentsCount = 0;
        $parsed = false;

        $html->setvar('id', $id);
        $commentViewed = 0;

        /* Event notification edge */
        $postItemId = get_param_int('item');
        $notifCommentId = get_param_int('ncid');
        $notifCommentParentId = get_param_int('npcid');
        $isNotifParentComment = $postItemId && $notifCommentId && $notifCommentParentId;
        /* Event notification edge */

        $result = array();
        $prfId = self::getPrfMediaId($mediaSection);
        //while ($comment = DB::fetch_row($index)) {
        $comment = NULL;
        foreach ($commentsAll as $key => $comment) {
            $parsed = true;
            if ($indexLine == 1) {
                $indexLine = 2;
            } else {
                $indexLine = 1;
            }
            $indexLine = 1;

            $html->setvar('wall_last_action_like', $comment['last_action_like']);
            $html->setvar('wall_last_action_comment', $comment['last_action_comment']);
            $html->setvar('wall_comments_count', self::getCountComments($comment));

			$commentsCount = intval(self::getCountComments($comment));


			VideoHosts::setEmbedUrlShow($optionSetTemplate != 'urban');

            //$commentText = nl2br($comment['comment']);

            if(Common::isMobile() || $optionSetTemplate == 'urban') {
                $comment['comment'] = ltrim($comment['comment']);
            }

            $comment['comment'] = Common::parseLinksSmile($comment['comment']);

            if ($optionSetTemplate == 'urban') {
                $comment['comment'] = wrapTextInConntentWithMedia($comment['comment'], '<div class="txt_comment">', '</div>');
            }
			$embedVideoCommentWidth = self::EMBED_VIDEO_COMMENT_WIDTH;
			$pretag = '<br>';
			$posttag = '';
			if ($optionSetTemplate == 'urban') {
				$embedVideoCommentWidth = 800;
				$pretag = '<div class="wall_video_one_post">';
				$posttag = '</div>';
			}

            $commentText = VideoHosts::filterFromDb($comment['comment'], $pretag, $posttag, $embedVideoCommentWidth);

            if ($isEdgeWall) {
                $commentText = OutsideImages::filter_to_html($commentText, '<div class="image_comment">', '</div>', 'timeline_photo_comment', '', false, 'comment_');
            }else{
                $commentText = OutsideImages::filter_to_html($commentText, '<div class="image_comment">', '</div>', 'lightbox');
                //$commentText = replaceSmile($commentText);
            }

            VideoHosts::setEmbedUrlShow(false);

            $commentText = nl2br($commentText);

            $vars = array(
                    'display_profile' => self::displayProfile($comment['user_id']),
                    'id'        => $comment['id'],
                    'id_prf'    => $comment['id'] . $prfId,
                    'send'      => $comment['send'],
                    'index'     => $indexLine,
                    'photo'     => User::getPhotoDefault($comment['user_id']),
                    'photo_r'   => User::getPhotoDefault($comment['user_id'], 'r'),
                    'url'       => User::url($comment['user_id']),
                    'user_id'   => $comment['user_id'],
                    'name'      => $comment['name'],
                    'text'      => $commentText,
                    'time'      => timeAgo($comment['date'], 'now', 'string', 60, 'second'),
                    'time_full' => toAttr(Common::dateFormat($comment['date'], 'photo_date')),
                    'url_page_liked'  => self::getUrlLikedPage($mediaSection, $comment['id']),
                    'custom_class'  => self::$commentCustomClass,
            );
            $html->assign('wall_item_comment', $vars);


            if($comment['wall_user_id'] == $guid || $comment['comment_user_id'] == $guid) {
                $html->parse('wall_comment_delete', false);
            } else {
                $html->clean('wall_comment_delete');
            }

            /* Edge */
            if ($isEdgeWall && ($cmd == 'comments_load' || $cmd == 'comment')) {
                $html->parse('wall_items_info_set', false);
            }

            if ($isEdgeWall) {
                if ($mediaSection) {
                    CProfilePhoto::parseRepliesComments($html, $comment['id'], $comment['replies'], $alwaysViewReplies, $commentsLikes, $mediaSection, true);
                } else {
                    self::markReadCommentAndLikeOne($comment);
                    //$isNotifParentComment
                    //var_dump_pre($alwaysViewReplies);
                    $notifParseComments = false;
                    if ($isNotifParentComment && $comment['id'] == $notifCommentParentId) {
                        $notifParseComments = true;
                    }
                    self::parseRepliesComments($html, $id, $comment['id'], $comment['replies'], $alwaysViewReplies, $commentsLikes, $notifParseComments);
                }
            } else {
                self::markReadCommentAndLikeOne($comment);
            }

            if ($isParseCommentsLikes) {
                $likeTitle = l('like');
                $likeTitleAlt = '';
                $likeValue = 1;
                if ($commentsLikes && isset($commentsLikes[$comment['id']])) {
                    $likeTitle = l('liked');
                    $likeTitleAlt = l('unlike');
                    $likeValue = 0;
                }
                $html->setvar('wall_item_comment_like_title', $likeTitle);
                $html->setvar('wall_item_comment_like_title_alt', $likeTitleAlt);
                $html->setvar('wall_item_comment_like', $likeValue);
                $countLikes = 0;
                if (isset($comment['likes'])) {
                    $countLikes = $comment['likes'];
                }
                $html->subcond(!$countLikes, 'wall_item_comment_likes_hide');
                $html->setvar('wall_item_comment_count_like', $countLikes);

                $countLikesUsers = User::getTitleLikeUsersComment($comment['id'], $comment['likes'], $mediaSection);
                $html->setvar('wall_item_comment_count_like_users', $countLikesUsers);
            }
            /* Edge */

            $commentViewed = $comment['id'];
            if (guid() && $commentViewed != 0) {
                $sql = 'SELECT `id`
                          FROM `wall_comments_viewed`
                         WHERE `user_id` = ' . to_sql(guid(), 'Number')
                       . ' AND `item_id` = ' . to_sql($id, 'Number')
                     . ' LIMIT 1';
                $viewed = DB::row($sql);
                if (!empty($viewed)) {
                    if ($commentViewed > $viewed['id']) {
                        $sql = 'UPDATE `wall_comments_viewed`
                                   SET `id` = ' . to_sql($commentViewed, 'Number') . '
                                 WHERE `user_id` = ' . to_sql(guid(), 'Number') . '
                                   AND `item_id` = ' . to_sql($id, 'Number') . '
                                 LIMIT 1';
                        DB::execute($sql);
                    }
                } else {
                    $sql = "INSERT INTO `wall_comments_viewed`
                                 VALUES (" . to_sql(guid(), 'Number') . ", "
                                           . to_sql($id, 'Number') . ", "
                                           . to_sql($commentViewed, 'Number') . ")";
                    DB::execute($sql);
                }
                $html->setvar('wall_item_comment_is_viewed', self::isCommentViewed($id, guid()));
            }

            $html->parse('wall_item_comment');
            $result[$comment['id']] = 1;
        }

        $blockFeedBottomFrm = 'wall_feed_comment_bottom_frm_show';
        if ($html->blockExists($blockFeedBottomFrm)) {
            $numberCommentsFrmShow = Common::getOptionTemplateInt('wall_number_comments_to_show_bottom_frm');
            if (!$numberCommentsFrmShow) {
                $numberCommentsFrmShow = 2;
            }
            if ($commentsCount > $numberCommentsFrmShow) {
                $html->parse($blockFeedBottomFrm, false);
            }
        }

        $block = 'wall_load_more_comments';
        if ($cid == 0 && (self::getCountComments($comment) > $limit || $start != 0) && $parsed) {
            $html->parse($block, false);
        }
        if (!$cmd && get_param_int('item')) {
            $parsed = false;
        }
        if ($start == 0 && $commentsCount > $limit && $parsed && $html->blockExists("{$block}_show")) {
            $commentsCount = $commentsCount - $limit;
            if ($commentsCount == 1) {
                $html->setvar("{$block}_title", l('load_more_comment_one'));
            } else {
                $html->setvar("{$block}_title", lSetVars('load_more_comments', array('count' => $commentsCount)));
            }

            $blockLoadMoreNumber = "{$block}_number";
            if ($html->blockExists($blockLoadMoreNumber)) {
                $html->setvar("{$blockLoadMoreNumber}_title", l('view_previous_comments'));
                $vars = array(
                    'view_number' => $limit,
                    'all_number' => $commentsCount
                );
                $html->setvar($blockLoadMoreNumber, lSetVars('view_previous_comments_number', $vars));
                $html->parse($blockLoadMoreNumber, false);
            }

            $font = self::isCommentViewed($id, guid());
             if ($font) {
               $html->parse("{$block}_new", false);
            } else {
               $html->setblockvar("{$block}_new", '');
            }
            $html->parse("{$block}_show", false);
        }

        $html->parse('wall_module_comment', false);

        if ($isEdgeWall && $cmd == 'comments_load') {
            $html->parse('wall_items', false);
        }

        return $result;
    }

    static function addInfoComment(&$html, &$vars, &$row)
    {
        //var_dump($vars);
        //die();
		$cmd = get_param('cmd');
        $optionSetTemplate = Common::getOption('set', 'template_options');
        $optionNameTemplate = Common::getTmplName();
        VideoHosts::setEmbedUrlShow($optionSetTemplate != 'urban');
        if ($row['params'] == 'joined the website') {
            $row['params'] = l('joined the website' . '_' . ($row['gender'] ? $row['gender'] : 'm'));
        }

        $comment = $row['params'];
        if ($row['params'] == 'item_birthday') {
            $comment = '';
        }
        $comment =  Common::parseLinksSmile($comment);
        $class = '';
        if ($optionSetTemplate == 'urban') {
            $comment = wrapTextInConntentWithMedia($comment);
            $class = ' class="wall_video_post"';
        }
        self::$maxMediaWidth = 0;
        $commentLengthBefore = strlen($comment);
        $comment = VideoHosts::filterFromDb($comment, "<div{$class}>", '</div>', self::EMBED_VIDEO_WIDTH);
        $commentLengthAfter = strlen($comment);

        if($commentLengthAfter != $commentLengthBefore) {
            self::$maxMediaWidth = self::EMBED_VIDEO_WIDTH;
            $vars['aux_comment_video'] = true;
        }

        $class = 'wall_image_post';
        $isCalcMaxWidth = true;
        if ($optionSetTemplate != 'urban') {
            $class = (Common::isMobile()) ? 'image_comment' : 'feed_img_photo_single';
            $isCalcMaxWidth = false;
        }
        if ($optionNameTemplate == 'edge') {
            $comment = OutsideImages::filter_to_html($comment, '<div class="' . $class . '">', '</div>', 'timeline_photo');
        } else {
            $comment = OutsideImages::filter_to_html($comment, '<div class="' . $class . '">', '</div>', 'lightbox', '_blank', $isCalcMaxWidth);
        }

        VideoHosts::setEmbedUrlShow(false);
        //??? the next line is kind of not necessary
        //$comment = self::filter_to_html($row['id'], $comment, '<div class="' . $class . '">', '</div>', 'lightbox', 'th');
        $vars['wall'] = $row['name'];
        $vars['display_profile'] = self::displayProfile($row['user_id']);
        if($row['user_id'] != $row['comment_user_id']) {
            $vars['name'] = User::getInfoBasic($row['comment_user_id'], 'name');
            $row['gender'] = User::getInfoBasic($row['comment_user_id'], 'gender');
            $vars['photo'] = User::getPhotoDefault($row['comment_user_id']);
            $vars['item_user_id'] = $row['comment_user_id'];
            $vars['url_profile_link'] = User::url($row['comment_user_id']);
            $vars['age'] = User::getInfoBasic($row['comment_user_id'], 'age');
        }
        $vars['wall_user_id'] = $row['user_id'];

        if(!isset($vars['share_name'])) {
            // if($vars['item_name'] != $vars['name']) {
                //echo "CHANGED {$vars['item_name']} > {$vars['name']}<br>";
                //var_dump_pre($vars);
                //die();
            //}

            $vars['item_name'] = $vars['name'];
            $vars['item_name_user_id'] = $vars['item_user_id'];
        }

        if(isset($row['item_photo'])) {
            $vars['photo'] = $row['item_photo'];

        }
        //var_dump($vars);

        $blockMaxWidth = 'max_media_width';
        if ($html->blockExists($blockMaxWidth)) {
            if (self::$maxMediaWidth) {
                $html->setvar($blockMaxWidth, self::$maxMediaWidth);
                $html->parse($blockMaxWidth, false);
            } else {
                $html->clean($blockMaxWidth);
            }
        }

        //$comment = replaceSmile($comment);
        $vars['wall_item_comment'] = nl2br($comment);
    }

    static function addInfoVidsComment(&$html, &$vars, $row)
    {
        $sql = 'SELECT * FROM vids_comment
            WHERE id = ' . to_sql($row['item_id']);
        $comment = DB::row($sql, 2);

        include_once(self::includePath() . '_include/current/video_hosts.php');
        include_once(self::includePath() . '_include/current/vids/tools.php');

        $video = CVidsTools::getVideoById($comment['video_id'], true);

        $html->assign('readonly', 'true');
        $html->assign('item_comments_rating_check', $video['rating_check']);

        $vars['item_title'] = $video['subject'];
        $vars['item_comment'] = trim($comment['text']);
        $vars['item_id'] = $video['id'];
        $vars['item_image'] = $video['video_type'] == 'site' ? $video['image'] : $video['image_b'];
        $vars['item_image_b'] =  $video['image_b'];
        $vars['item_video_type'] = $video['video_type'];
    }

    static function addInfoVids(&$html, &$vars, $row)
    {
        include_once(self::includePath() . '_include/current/video_hosts.php');
        include_once(self::includePath() . '_include/current/vids/tools.php');

        VideoHosts::setAutoplay(false);
        $video = CVidsTools::getVideoById($row['item_id'], true, 640, 360);

        $vars['item_title'] = $video['subject'];
        $vars['item_title_attr'] = toAttr($video['subject']);
        $vars['item_description'] = hard_trim($video['text'], 145);
        $vars['item_id'] = $video['id'];
        $vars['item_image'] = $video['video_type'] == 'site' ? $video['image'] : $video['image_b'];
        $vars['item_image_b'] = $video['image_b'];
        $vars['item_plays'] = $video['count_views'];
        $vars['item_comments'] = $video['count_comments'];
        $vars['item_video_type'] = $video['video_type'];

        $htmlCode = $video['html_code'];

        $vars['is_uploaded'] = intval($video['is_uploaded']);
        if ($vars['is_uploaded'] && Common::getOption('video_player_type') == 'player_custom') {
            $htmlCode = '<div class="player_custom">' . $htmlCode . '</div>';
        }

        $vars['item_html_code'] = $htmlCode;

        if (self::$typeWall == 'edge') {
            $wallPlayVideo = Common::getOption('wall_play_video', self::$tmplName . '_wall_settings');
            if ($wallPlayVideo == 'popup') {
                $vars['item_image_src'] = User::getVideoFile($video, 'src', '');
                $vars['item_html_code'] = '';
                $info = CProfileVideo::getVideosList('', 1, $video['user_id'], false, true, $video['id']);
                if ($info && isset($info['v_' . $video['id']])) {
                    $info = $info['v_' . $video['id']];
                    $vars['wall_vids_item_info'] = json_encode($info);
                }
            }
        }

        $vars['item_number_comments'] = lSetVars('number_comments_to_wall', array('number' => $vars['item_comments']));
        $vars['item_user_id'] = $row['user_id'];
    }

    static function addInfoMusic(&$html, &$vars, $row)
    {
        $sql = 'SELECT * FROM music_song
WHERE song_id = ' . to_sql($row['item_id']);
        $song = DB::row($sql, 2);

        $vars['song'] = $song['song_title'];
        $vars['song_about'] = trim($song['song_about']);

        if($vars['song_about'] != '') {
            $html->setvar('song_about', nl2br(Common::parseLinksSmile($vars['song_about'])));
            $html->parse('wall_song_about', false);
        }

        $sql = 'SELECT musician_name FROM music_musician
WHERE musician_id = ' . to_sql($song['musician_id']);
        $musician = DB::result($sql, 0, 2);

        $vars['musician_link_start'] = self::getUrlSection('musician');

        $vars['musician'] = $musician;
        $vars['musician_id'] = $song['musician_id'];

        require_once(self::includePath() . "_include/current/music/tools.php");

        $vars['song_player'] = CMusicTools::song_player(
        $song['song_id'], $song['song_length'], $row['item_id'], "BigClipPlayer.swf", 264, 26);

    }

    static function addInfoMusicPhoto(&$html, &$vars, $row)
    {
        $sql = 'SELECT * FROM music_song
WHERE song_id = ' . to_sql($row['item_id']);
        $song = DB::row($sql, 2);

        $vars['song'] = $song['song_title'];
        $sql = 'SELECT musician_name FROM music_musician
WHERE musician_id = ' . to_sql($song['musician_id']);
        $musician = DB::result($sql, 0, 2);

        $vars['musician_link_start'] = self::getUrlSection('musician');

        $vars['musician'] = $musician;
        $vars['musician_id'] = $song['musician_id'];

        $sql = 'SELECT * FROM music_song_image
WHERE song_id = ' . to_sql($row['item_id']) . '
AND created_at = ' . to_sql($row['params'], 'Text') . ' ORDER BY image_id DESC';
        $rows = DB::rows($sql, 2);
        $vars['photo_count'] = count($rows);
        $counter = 0;
        $photoLimit = (Common::isMobile()) ? self::$infoPhotoBigLimitMobile : self::$infoPhotoBigLimit;
        foreach ($rows as $image) {
            $html->setvar('music_photo_item_id', $image['image_id']);
            $html->parse('music_photo_item');
            $counter++;
            if($counter >= $photoLimit) {
                return;
            }
        }
    }

    static function addInfoMusicComment(&$html, &$vars, $row)
    {
        global $g;

        $sql = 'SELECT * FROM music_song_comment
WHERE comment_id = ' . to_sql($row['item_id']);
        $comment = DB::row($sql, 2);

        $sql = 'SELECT * FROM music_song
WHERE song_id = ' . to_sql($comment['song_id']);
        $song = DB::row($sql, 2);

        $vars['song_title'] = $song['song_title'];
        $vars['song_id'] = $song['song_id'];
        $sql = 'SELECT musician_name FROM music_musician
WHERE musician_id = ' . to_sql($song['musician_id']);
        $musician = DB::result($sql, 0, 2);

        $vars['musician_link_start'] = self::getUrlSection('musician');

        $vars['musician'] = $musician;
        $vars['musician_id'] = $song['musician_id'];


        $image = DB::row("SELECT * FROM music_song_image WHERE song_id=" . $song['song_id'] . " ORDER BY created_at ASC LIMIT 1");
        if ($image) {
            $imageB = $g['path']['url_files'] . "music_song_images/" . $image['image_id'] . "_th_b.jpg";
            $imageM = $g['path']['url_files'] . "music_song_images/" . $image['image_id'] . "_b.jpg";

            $html->setvar('image_thumbnail_b', $imageB);
            $html->setvar('image_thumbnail', $imageM);
            $html->parse('song_image', false);
        } else {
            $html->parse('song_no_image', false);
        }

        $vars['item_comment'] = trim($comment['comment_text']);



    }

    static function addInfoMusician(&$html, &$vars, $row)
    {
        global $g;

        $sql = 'SELECT * FROM music_musician
WHERE musician_id = ' . to_sql($row['item_id'], 'Number');
        $musician = DB::row($sql, 2);
        $vars['musician'] = $musician['musician_name'];
        $vars['musician_id'] = $row['item_id'];
        $vars['description'] = $musician['musician_about'];

        $image = DB::row("SELECT * FROM music_musician_image WHERE musician_id=" . to_sql($row['item_id'], 'Number') . " ORDER BY created_at ASC LIMIT 1");
        if ($image) {
            $imageB = $g['path']['url_files'] . "music_musician_images/" . $image['image_id'] . "_th_b.jpg";
            $imageM = $g['path']['url_files'] . "music_musician_images/" . $image['image_id'] . "_b.jpg";

            $html->setvar('image_thumbnail_b', $imageB);
            $html->setvar('image_thumbnail', $imageM);
            $html->parse('musician_image', false);
        } else {
            $html->parse('musician_no_image', false);
        }
    }

    static function addInfoMusicianPhoto(&$html, &$vars, $row)
    {
        $sql = 'SELECT * FROM music_musician
WHERE musician_id = ' . to_sql($row['item_id']);
        $musician = DB::row($sql, 2);
        $vars['musician'] = $musician['musician_name'];
        $vars['musician_id'] = $row['item_id'];
        $vars['description'] = $musician['musician_about'];

        $sql = 'SELECT * FROM music_musician_image
WHERE musician_id = ' . to_sql($row['item_id']) . '
AND created_at = ' . to_sql($row['params'], 'Text') . ' ORDER BY image_id DESC';
        $rows = DB::rows($sql, 2);
        $vars['photo_count'] = count($rows);
        $counter = 0;
        $photoLimit = (Common::isMobile()) ? self::$infoPhotoBigLimitMobile : self::$infoPhotoBigLimit;
        foreach ($rows as $image) {
            $html->setvar('musician_photo_item_id', $image['image_id']);
            $html->parse('musician_photo_item');
            $counter++;
            if($counter >= $photoLimit) {
                return;
            }
        }
    }

    static function addInfoMusicianComment(&$html, &$vars, $row)
    {
        global $g;

        $sql = 'SELECT * FROM music_musician_comment
WHERE comment_id = ' . to_sql($row['item_id']);
        $comment = DB::row($sql, 2);

        $sql = 'SELECT musician_name FROM music_musician
WHERE musician_id = ' . to_sql($comment['musician_id'], 'Number');
        $musician = DB::result($sql, 0, 2);
        $vars['musician'] = $musician;
        $vars['musician_id'] = $comment['musician_id'];

        $image = DB::row("SELECT * FROM music_musician_image WHERE musician_id=" . to_sql($comment['musician_id'], 'Number') . " ORDER BY created_at ASC LIMIT 1");
        if ($image) {
            $imageB = $g['path']['url_files'] . "music_musician_images/" . $image['image_id'] . "_th_b.jpg";
            $imageM = $g['path']['url_files'] . "music_musician_images/" . $image['image_id'] . "_b.jpg";

            $html->setvar('image_thumbnail_b', $imageB);
            $html->setvar('image_thumbnail', $imageM);
            $html->parse('musician_comment_image', false);
        } else {
            $html->parse('musician_comment_no_image', false);
        }

        $vars['item_comment'] = trim($comment['comment_text']);
    }

    static function addInfoEventAdded(&$html, &$vars, $row){
        self::addInfoEventMember($html, $vars, $row);
    }

    static function addInfoEventMember(&$html, &$vars, $row)
    {
        global $g;

        require_once(self::includePath() . "_include/current/events/tools.php");
        $event = CEventsTools::retrieve_event_by_id($row['item_id']);

        $event['event_description'] = hard_trim($event['event_description'], 185);
        if($event['event_address'] != '') {
            $event['city_title'] = $event['city_title'] . ',';
        }

        foreach ($event as $key => $value) {
            $vars[$key] = $value;
        }
        $vars['event_datetime'] = Common::dateFormat($event['event_datetime'], 'wall_event_datetime');



        $images = CEventsTools::event_images($event['event_id'], false);
        $html->setvar("image_thumbnail_b", $images["image_thumbnail_b"]);
        $html->setvar("image_file", $images["image_file"]);

        if (($images["image_file"] == $g['tmpl']['url_tmpl_main'] . "images/events/foto_clock_l.gif") || ($images["image_file"] == $g['tmpl']['url_tmpl_main'] . "images/events/foto_02_l.jpg")) {
            $html->parse("event_member_no_image");
        } else {
            $html->parse("event_member_image");
        }
    }

    static function addInfoEventComment(&$html, &$vars, $row)
    {
        global $g;
        require_once(self::includePath() . "_include/current/events/tools.php");

        $sql = 'SELECT *
                  FROM events_event_comment
                 WHERE comment_id = ' . $row['item_id'];
        $comment = DB::row($sql, 2);

        //CEventsTools::$videoWidth = self::EMBED_VIDEO_WIDTH;

        $event = CEventsTools::retrieve_event_by_id($comment['event_id']);

        $event['event_description'] = hard_trim($event['event_description'], 185);

        //$comment = VideoHosts::filterFromDb($comment['comment_text'], '<div>', '</div>', self::EMBED_VIDEO_WIDTH);
        //$class = (Common::isMobile()) ? 'image_comment' : 'feed_img_photo_single';
        //$vars['event_comment'] = OutsideImages::filter_to_html($comment, '<div class="' . $class . '">', '</div>', 'lightbox', 'orig', self::$outsideImageSizes);
        //$vars['event_comment'] = CEventsTools::filter_text_to_html($comment['comment_text']);
        $vars['event_comment'] = self::text_to_html($comment['comment_text']);
        foreach ($event as $key => $value) {
            $vars[$key] = $value;
        }
        $vars['event_datetime'] = Common::dateFormat($event['event_datetime'], 'wall_event_datetime');

        $images = CEventsTools::event_images($event['event_id'], false);
        $html->setvar("image_thumbnail_b", $images["image_thumbnail_b"]);
        $html->setvar("image_file", $images["image_file"]);

        if (($images["image_file"] == $g['tmpl']['url_tmpl_main'] . "images/events/foto_clock_l.gif") || ($images["image_file"] == $g['tmpl']['url_tmpl_main'] . "images/events/foto_02_l.jpg")) {
            $html->parse("event_comment_no_image");
        } else {
            $html->parse("event_comment_image");
        }
    }

    static function addInfoEventCommentComment(&$html, &$vars, $row)
    {
        global $g;

        require_once(self::includePath() . "_include/current/events/tools.php");

        $sql = 'SELECT cc.*, c.event_id FROM events_event_comment_comment AS cc
            JOIN events_event_comment AS c ON c.comment_id = cc.parent_comment_id
            WHERE cc.comment_id = ' . $row['item_id'];
        $comment = DB::row($sql, 2);

        $event = CEventsTools::retrieve_event_by_id($comment['event_id']);

        $event['event_description'] = hard_trim($event['event_description'], 185);

        //$comment = Common::parseLinksSmile($comment['comment_text']);
        //$comment = VideoHosts::filterFromDb($comment, '<div>', '</div>', self::EMBED_VIDEO_WIDTH);
        //$class = (Common::isMobile()) ? 'image_comment' : 'feed_img_photo_single';
        //$vars['event_comment'] = OutsideImages::filter_to_html($comment, '<div class="' . $class . '">', '</div>', 'lightbox', 'orig', self::$outsideImageSizes);
        //$vars['event_comment'] = CEventsTools::filter_text_to_html($comment['comment_text']);
        $vars['event_comment'] = self::text_to_html($comment['comment_text']);

        foreach ($event as $key => $value) {
            $vars[$key] = $value;
        }
        $vars['event_datetime'] = Common::dateFormat($event['event_datetime'], 'wall_event_datetime');

        $images = CEventsTools::event_images($event['event_id'], false);
        $html->setvar("image_thumbnail_b", $images["image_thumbnail_b"]);
        $html->setvar("image_file", $images["image_file"]);

        if (($images["image_file"] == $g['tmpl']['url_tmpl_main'] . "images/events/foto_clock_l.gif") || ($images["image_file"] == $g['tmpl']['url_tmpl_main'] . "images/events/foto_02_l.jpg")) {
            $html->parse("event_comment_no_image");
        } else {
            $html->parse("event_comment_image");
        }
    }

    static function addInfoEventPhoto(&$html, &$vars, $row)
    {
        global $g;

        require_once(self::includePath() . "_include/current/events/tools.php");
        $event = CEventsTools::retrieve_event_by_id($row['item_id']);

        $event['event_description'] = hard_trim($event['event_description'], 185);

        foreach ($event as $key => $value) {
            $vars[$key] = $value;
        }
        $vars['event_datetime'] = Common::dateFormat($event['event_datetime'], 'wall_event_datetime');

        $sql = 'SELECT * FROM events_event_image
WHERE event_id = ' . to_sql($row['item_id']) . '
AND created_at = ' . to_sql($row['params'], 'Text') . ' ORDER BY image_id DESC';
        $rows = DB::rows($sql, 2);
        $vars['photo_count'] = count($rows);
        $counter = 0;
        foreach ($rows as $image) {
            $html->setvar('event_photo_item_id', $image['image_id']);
            $html->parse('event_photo_item');
            $counter++;
            if($counter >= self::$infoPhotoBigLimit) {
                return;
            }
        }

        if($vars['photo_count'] == 1) {
            $imageUrlBig = $g['path']['url_files'] . 'events_event_images/' . $image['image_id'] . '_b.jpg';
            $html->setvar('wall_pics_width', self::calcImageWidth($imageUrlBig));
        }

    }

    static function addInfoPlacesReview(&$html, &$vars, $row)
    {
        $sql = 'SELECT * FROM places_review
WHERE id = ' . to_sql($row['item_id']);
        $review = DB::row($sql, 2);
        $place = DB::row('SELECT * FROM places_place WHERE id=' . to_sql($review['place_id'], 'Number') . ' LIMIT 1', 2);

        $vars['review_title'] = $review['title'];

        //$text = Common::linksToVideo($review['text']);
        //$text = Common::parseLinks($review['text']);

        $vars['review_text'] = trim(neat_trim($review['text'], 300));
        $vars['place_title'] = $place['name'];
        $vars['place_id'] = $place['id'];

        $image = DB::result("SELECT id FROM places_place_image WHERE place_id=" . to_sql($place['id'], 'Number') . " ORDER BY id ASC LIMIT 1", 0, 2);
        if ($image) {
            $html->setvar('place_image_id', $image);
            $html->parse('place_image');
        } else {
            $html->parse('place_no_image');
        }
    }

    static function addInfoPlacesPhoto(&$html, &$vars, $row)
    {
        $place = DB::row('SELECT * FROM places_place WHERE id=' . to_sql($row['item_id'], 'Number') . ' LIMIT 1', 2);
        $vars['place_title'] = $place['name'];
        $vars['place_id'] = $place['id'];

        $sql = 'SELECT * FROM places_place_image
WHERE place_id = ' . to_sql($row['item_id']) . '
AND created_at = ' . to_sql($row['params'], 'Text');
        $rows = DB::rows($sql, 2);
        $vars['photo_count'] = count($rows);
        foreach ($rows as $image) {
            $html->setvar('place_image_id', $image['id']);
            $html->parse('places_photo_item');
        }
    }

    static function addInfoGroupJoin(&$html, &$vars, $row)
    {
        global $g;

        require_once(self::includePath() . "_include/current/groups/tools.php");

        $title_length = 32;

        $group = CGroupsTools::retrieve_group_by_id($row['item_id']);

        $vars['group_id'] = $group['group_id'];
        $vars['group_category_id'] = $group['category_id'];
        $vars['group_title'] = he(strcut(to_html($group['group_title']), $title_length));
        $vars['group_category_title'] = to_html(l($group['category_title']));
        $vars['group_n_members'] = $group['group_n_members'];
        $vars['group_description'] = strcut(to_html($group['group_description']), 260);

        $images = CGroupsTools::group_images($group['group_id'], false);

        $html->setvar("image_thumbnail_b", $images["image_thumbnail_b"]);

        $html->setvar('image_file', $images["image_file"]);
        if ($images["image_file"] == $g['tmpl']['url_tmpl_main'] . "images/groups/foto_02_l.jpg") {
            $html->parse("group_no_image");
        } else {
            $html->parse("group_image");
        }
    }

    static function addInfoGroupWall(&$html, &$vars, $row)
    {
        global $g;

        $sql = 'SELECT * FROM groups_group_comment
                 WHERE comment_id = ' . $row['item_id'];
        $comment = DB::row($sql, 2);

        require_once(self::includePath() . "_include/current/groups/tools.php");

        $title_length = 32;

        $group = CGroupsTools::retrieve_group_by_id($comment['group_id']);

        CGroupsTools::$videoWidth = self::EMBED_VIDEO_WIDTH;

        $vars['group_id'] = $group['group_id'];
        $vars['group_category_id'] = $group['category_id'];
        $vars['group_title'] = he(strcut(to_html($group['group_title']), $title_length));
        //$vars['group_comment'] = CGroupsTools::filter_text_to_html($comment['comment_text']);
        $vars['group_comment'] = self::text_to_html($comment['comment_text']);
        $images = CGroupsTools::group_images($group['group_id'], false);

        $html->setvar("image_thumbnail_b", $images["image_thumbnail_b"]);

        $html->setvar('image_file', $images["image_file"]);
        if ($images["image_file"] == $g['tmpl']['url_tmpl_main'] . "images/groups/foto_02_l.jpg") {
            $html->parse("group_wall_no_image");
        } else {
            $html->parse("group_wall_image");
        }
    }

    static function addInfoGroupWallComment(&$html, &$vars, $row)
    {
        global $g;

        $sql = 'SELECT cc.*, c.group_id FROM groups_group_comment_comment AS cc
            JOIN groups_group_comment AS c ON c.comment_id = cc.parent_comment_id
            WHERE cc.comment_id = ' . $row['item_id'];
        $comment = DB::row($sql, 2);

        require_once(self::includePath() . "_include/current/groups/tools.php");

        $title_length = 32;

        $group = CGroupsTools::retrieve_group_by_id($comment['group_id']);

        $vars['group_id'] = $group['group_id'];
        $vars['group_category_id'] = $group['category_id'];
        $vars['group_title'] = he(strcut(to_html($group['group_title']), $title_length));

        //$comment = Common::parseLinksSmile($comment['comment_text']);
        //$comment = VideoHosts::filterFromDb($comment, '<div>', '</div>', self::EMBED_VIDEO_WIDTH);
        //$class = (Common::isMobile()) ? 'image_comment' : 'feed_img_photo_single';
        //$vars['group_comment'] = OutsideImages::filter_to_html($comment, '<div class="' . $class . '">', '</div>', 'lightbox', 'orig', self::$outsideImageSizes);
        $vars['group_comment'] = self::text_to_html($comment['comment_text']);
        $images = CGroupsTools::group_images($group['group_id'], false);

        $html->setvar("image_thumbnail_b", $images["image_thumbnail_b"]);

        $html->setvar('image_file', $images["image_file"]);
        if ($images["image_file"] == $g['tmpl']['url_tmpl_main'] . "images/groups/foto_02_l.jpg") {
            $html->parse("group_wall_no_image");
        } else {
            $html->parse("group_wall_image");
        }
    }

    static function addInfoGroupForumPost(&$html, &$vars, $row)
    {
        global $g;

        $sql = 'SELECT * FROM groups_forum_comment
WHERE comment_id = ' . $row['item_id'];
        $comment = DB::row($sql, 2);

        $sql = 'SELECT * FROM groups_forum
WHERE forum_id = ' . $comment['forum_id'];
        $forum = DB::row($sql, 2);

        $vars['group_link_start'] = self::getUrlSection('group_link');

        $comment['group_id'] = $forum['group_id'];

        require_once(self::includePath() . "_include/current/groups/tools.php");
        CGroupsTools::$videoWidth = self::EMBED_VIDEO_WIDTH;

        $title_length = 32;

        $group = CGroupsTools::retrieve_group_by_id($comment['group_id']);

        $vars['forum_id'] = $comment['forum_id'];
        $vars['group_id'] = $group['group_id'];
        $vars['group_category_id'] = $group['category_id'];
        $vars['group_title'] = he(strcut(to_html($group['group_title']), $title_length));
        //$vars['group_forum_comment'] = CGroupsTools::filter_text_to_html($comment['comment_text']);
        $vars['group_forum_comment'] = self::text_to_html($comment['comment_text']);
        $images = CGroupsTools::group_images($group['group_id'], false);

        $html->setvar("image_thumbnail_b", $images["image_thumbnail_b"]);

        $html->setvar('image_file', $images["image_file"]);
        if ($images["image_file"] == $g['tmpl']['url_tmpl_main'] . "images/groups/foto_02_l.jpg") {
            $html->parse("group_forum_no_image");
        } else {
            $html->parse("group_forum_image");
        }
    }

    static function addInfoGroupForumPostComment(&$html, &$vars, $row)
    {
        global $g;

        $sql = 'SELECT cc.*, c.forum_id FROM groups_forum_comment_comment AS cc
            JOIN groups_forum_comment AS c ON c.comment_id = cc.parent_comment_id
            WHERE cc.comment_id = ' . to_sql($row['item_id']);
        $comment = DB::row($sql, 2);

        if(!is_array($comment)) {
            return;
        }

        $sql = 'SELECT * FROM groups_forum
            WHERE forum_id = ' . to_sql($comment['forum_id']);
        $forum = DB::row($sql, 2);

        $vars['group_link_start'] = self::getUrlSection('group_link');

        $comment['group_id'] = $forum['group_id'];

        require_once(self::includePath() . "_include/current/groups/tools.php");

        $title_length = 32;

        $group = CGroupsTools::retrieve_group_by_id($comment['group_id']);

        $vars['forum_id'] = $comment['forum_id'];
        $vars['group_id'] = $group['group_id'];
        $vars['group_category_id'] = $group['category_id'];
        $vars['group_title'] = he(strcut(to_html($group['group_title']), $title_length));

        //$comment = Common::parseLinksSmile($comment['comment_text']);
        //$class = (Common::isMobile()) ? 'image_comment' : 'feed_img_photo_single';
        //$vars['group_forum_comment'] = OutsideImages::filter_to_html($comment, '<div class="' . $class . '">', '</div>', 'lightbox', 'orig', self::$outsideImageSizes);
        $vars['group_forum_comment'] = self::text_to_html($comment['comment_text']);
        $images = CGroupsTools::group_images($group['group_id'], false);

        $html->setvar("image_thumbnail_b", $images["image_thumbnail_b"]);

        $html->setvar('image_file', $images["image_file"]);
        if ($images["image_file"] == $g['tmpl']['url_tmpl_main'] . "images/groups/foto_02_l.jpg") {
            $html->parse("group_forum_no_image");
        } else {
            $html->parse("group_forum_image");
        }

    }

    static function addInfoBlogPost(&$html, &$vars, $row)
    {
        require_once(self::includePath() . "_include/current/blogs/tools.php");

        CBlogsTools::$videoWidth = self::EMBED_VIDEO_WIDTH;
        CBlogsTools::$parseSmile = true;
        CBlogsTools::setImagesLimit(1);
        $videoSiteTag = '<div class="blogs_video_player">';
        if (Common::getOption('video_player_type') == 'player_custom') {
            $videoSiteTag = '<div class="blogs_video_player_custom">';
        }
        VideoHosts::$videoSiteTagStart = $videoSiteTag;
        $post = CBlogsTools::getPostById($row['item_id']);
        //$post['text_short_readable'] = Common::parseLinksSmile($post['text_short_readable']);
        //echo '<pre>';
        //print_r($post);
        //echo '</pre>';
        //die();
        $html->assign('post', $post);
        $html->subcond(!$post['text_is_short'], 'post_short_link');

        if(isset($post['subject_real']) && trim($post['subject_real']) != '') {
            $html->parse('blog_subject', false);
        } else {
            $html->setblockvar('blog_subject', '');
        }

        $vars['blog_title'] = $post['subject'];
    }

    static function addInfoBlogComment(&$html, &$vars, $row)
    {
        $sql = 'SELECT c.*
            FROM blogs_comment AS c
            WHERE c.id = ' . to_sql($row['item_id'], 'Number');

        $info = DB::row($sql, 2);
        $vars['item_comment'] = $info['text'];
        $vars['post_id'] = $info['post_id'];

        require_once(self::includePath() . "_include/current/blogs/tools.php");
        CBlogsTools::setImagesLimit(1);
        $post = CBlogsTools::getPostById($info['post_id']);

        $sql = 'SELECT name FROM user
            WHERE user_id = ' . to_sql($info['user_id'], 'Number');
        $nameBlogOwner = DB::result($sql, 0, 2);

        $vars['blog_title'] = $post['subject'];
        $vars['name_blog_owner'] = $nameBlogOwner;
    }

    static function addInfoForumThread(&$html, &$vars, $row)
    {


        $sql = 'SELECT * FROM forum_topic
            WHERE id = ' . to_sql($row['item_id']);
        $message = DB::row($sql, 2);
        $vars['forum_topic_id'] = $message['id'];
        $vars['forum_subject'] = $message['title'];
        $vars['forum_text'] = CForum::make_smiley(CForumMessage::filter_text_to_html(neat_trim($message['message'], 300), true, '<div class="forum_video">','</div>'));
    }

    static function addInfoForumPost(&$html, &$vars, $row)
    {
        $sql = 'SELECT m.*, t.title AS thread_subject FROM forum_message AS m
            LEFT JOIN forum_topic AS t ON t.id = m.topic_id
            WHERE m.id = ' . to_sql($row['item_id']);
        $message = DB::row($sql, 2);

        $vars['forum_thread_subject'] = $message['thread_subject'];
        $vars['forum_subject'] = $message['title'];
        $vars['forum_text'] = CForum::make_smiley(CForumMessage::filter_text_to_html(neat_trim($message['message'], 300), true, '<div class="forum_video">','</div>'));
        $vars['topic_id'] = $message['topic_id'];

        $vars['thread_link_start'] = Common::replaceByVars(self::getUrlSection('forum_thread'), array('item_id' => $vars['topic_id']));
    }

    static function addInfoFriends(&$html, &$vars, $row)
    {
        global $l;

        if(false) {
            // select previous friends
            $sql = 'SELECT created_at FROM friends_requests
                WHERE user_id IN (' . to_sql($row['user_id'], 'Number') . ', ' . to_sql($row['item_id'], 'Number') . ')
                AND friend_id IN (' . to_sql($row['user_id'], 'Number') . ', ' . to_sql($row['item_id'], 'Number') . ')
                AND accepted=1
            ';
            // and friend id === last friend id

            $currentFriendDate = DB::result($sql, 0, 2);

            $sql = 'SELECT * FROM friends_requests
                WHERE (user_id = ' . to_sql($row['user_id'], 'Number') . '
                OR friend_id = ' . to_sql($row['user_id'], 'Number') . ')
                AND accepted = 1
                AND created_at <= ' . to_sql($currentFriendDate, 'Text') . '
                ORDER BY created_at DESC LIMIT 3';
        }

        $sql = 'SELECT * FROM friends_requests
        WHERE user_id IN (' . to_sql($row['user_id'], 'Number') . ', ' . to_sql($row['item_id'], 'Number') . ')
        AND friend_id IN (' . to_sql($row['user_id'], 'Number') . ', ' . to_sql($row['item_id'], 'Number') . ')
        AND accepted = 1';

        DB::query($sql, 2);

        $friends = array();

        while ($friend = DB::fetch_row(2)) {
            if ($friend['friend_id'] != $row['user_id']) {
                $friends[] = $friend['friend_id'];
            } else {
                $friends[] = $friend['user_id'];
            }
        }

        $wallFriendsDelimiter = '';

        $friendIndex = 1;
        $friendsAll = count($friends);

        foreach ($friends as $friend) {
            $sql = 'SELECT name FROM user
                     WHERE user_id = ' . to_sql($friend, 'Number');
            $name = DB::result($sql, 0, 2);
            $html->setvar('wall_friends_delimiter', $wallFriendsDelimiter);
            $html->setvar('friend_name', $name);

            $vars['display_profile'] = self::displayProfile($friend);
            $html->setvar('display_profile', $vars['display_profile']);

            if ($friendIndex > 0 && ($friendIndex < $friendsAll || $friendIndex == 1)) {
                $html->parse('wall_friends_friend');
            }
            if ($friendIndex > 1 && $friendIndex == $friendsAll) {
                $html->parse('wall_friends_last');
            }
            $wallFriendsDelimiter = isset($l['all']['wall_friends_delimiter']) ? $l['all']['wall_friends_delimiter'] : ', ';
            $html->setvar('friend_photo', User::getPhotoDefault($friend));

            $html->parse('wall_friends_friend_photo');

            $friendIndex++;
        }
    }


    static function addInfoPhoto(&$html, &$vars, $row)
    {
        $guid = guid();
        $optionTemplateName = Common::getOptionTemplate('name');

        $limit = 5;
        $order = '`photo_id` DESC';
        $where = ' AND `wall_id` = ' . to_sql($row['id']);
        $wherePrf = ' AND PH.wall_id = ' . to_sql($row['id']);
        if ($optionTemplateName == 'edge' && $row['section_real'] == 'share') {
            $wherePrf = ' AND `wall_id` = ' . to_sql($row['real_wall_id']);
        }

        if ($row['access'] == 'public' && $row['user_id'] != $guid && !User::isFriend($guid, $row['user_id'])) {
            $where .= " AND private = 'N' ";
            $wherePrf .= " AND PH.private = 'N' ";
            if ($optionTemplateName != 'edge') {
                User::setNoPhotoPprivateInOffset();
            }
        }
        if ($optionTemplateName == 'edge') {
            $where = $wherePrf;
            $order = 'PH.photo_id DESC';
            $limit = 6;
            $defaultDataFilter = CProfilePhoto::$isGetDataWithFilter;
            CProfilePhoto::$isGetDataWithFilter = false;
        }

        $rows = CProfilePhoto::preparePhotoList($row['user_id'], $order, $where, $limit, true);
        CProfilePhoto::clearPhotoList();

        if ($optionTemplateName == 'edge') {
            CProfilePhoto::$isGetDataWithFilter = $defaultDataFilter;
        }

        if ($rows) {
            $vars['photo_count'] = count($rows);

            if ($html->varExists('wall_photo_images_count')) {
                $html->setvar('wall_photo_images_count', $vars['photo_count']);
                if ($vars['photo_count'] == 6) {
                    $sql = "SELECT COUNT(PH.photo_id)
                              FROM `photo` AS PH
                             WHERE  PH.visible != 'P'  AND PH.user_id = " . to_sql($row['user_id']) . $where . ' ORDER BY ' .  $order;
                    $countPhotos = DB::result($sql, 0, DB_MAX_INDEX);
                    if ($countPhotos > 6) {
                        $vars['photo_count_all'] = $countPhotos;
                    }
                }
            }
            if ($optionTemplateName == 'edge') {
                $size = 'bm';
            } else {
                $size = $vars['photo_count'] == 1 ? 'b' : 'm';
            }
            $gender = mb_strtolower(User::getInfoBasic($row['user_id'], 'gender'), 'UTF-8');
            $i = 0;
            foreach ($rows as $image) {
                $i++;
                $html->setvar('wall_photo_user_gender', $gender);
                $html->setvar('wall_photo_access', $image['private'] == 'Y' ? 'private' : 'public');
                $html->setvar('wall_photo_info', json_encode($image));
                $html->setvar('wall_photo_id', $image['photo_id']);
                $html->setvar('wall_photo_user_id', $image['user_id']);
                $html->setvar('wall_photo_url', User::photoFileCheck($image, $size));
                $html->setvar('wall_photo_url_b', User::photoFileCheck($image, 'b'));
                $html->setvar('wall_photo_description', $image['description']);
                $html->parse('wall_photo_image');
            }
        } else {
            //Fix for old data
            $vars['no_parse_item'] = 1;
        }
        $vars['item_user_id'] = $row['user_id'];
    }

    static function addInfoPhotoComment(&$html, &$vars, $row)
    {
        $sql = 'SELECT * FROM photo_comments
                    WHERE id = ' . to_sql($row['item_id']);
        $comment = DB::row($sql, 2);

        $sql = 'SELECT user_id FROM photo
                    WHERE photo_id = ' . to_sql($comment['photo_id']);
        $uid = DB::result($sql, 0, 2);

        $vars['display_profile'] = self::displayProfile($uid);

        $sql = 'SELECT name FROM user WHERE user_id = ' . to_sql($uid, 'Number');
        $nameUploader = DB::result($sql, 0, 2);

        $vars['name_uploader'] = $nameUploader;
        $vars['item_comment'] = $comment['comment'];
        $vars['item_photo'] = User::getPhotoProfile($comment['photo_id'], 's');
        $vars['item_photo_b'] = User::getPhotoProfile($comment['photo_id'], 'b');
        $vars['item_photo_offset'] = User::photoOffset($uid, $comment['photo_id']);
    }

    static function addInfoPhotoDefault(&$html, &$vars, $row)
    {
        global $g;

        $vars['url_profile_photo_old'] = User::getPhotoProfile($row['params']);
        $vars['url_profile_photo_old_b'] = User::getPhotoProfile($row['params'], 'b', $row['gender']);
        $vars['url_profile_photo_new'] = User::getPhotoProfile($row['item_id']);
        $vars['url_profile_photo_new_b'] = User::getPhotoProfile($row['item_id'], 'b', $row['gender']);
        $vars['profile_photo_offset'] = User::photoOffset($row['user_id'], $row['item_id']);
        $vars['user_id'] = $row['user_id'];
        $imageUrlBig = $g['path']['dir_files'] . $vars['url_profile_photo_new_b'];
        $html->setvar('wall_photo_width', self::calcImageWidth($imageUrlBig, 240));
    }

    static function isVisitorLoadPicsInTimeLine($row)
    {
        return $row['section'] == 'pics' && $row['comment_user_id'] && $row['comment_user_id'] != $row['user_id'];
    }

    static function addInfoPics(&$html, &$vars, $row)
    {
        global $g;

        $sql = 'SELECT * FROM gallery_images
                 WHERE albumid = ' . to_sql($row['item_id']) . '
                   AND datetime = ' . to_sql($row['params'], 'Text');
        $rows = DB::rows($sql, 2);
        $vars['photo_count'] = count($rows);

        $i = 0;
        foreach ($rows as $image) {
            $sql = "SELECT i.*, a.folder, a.title as album, a.id as album_id, a.desc AS album_desc FROM (gallery_images AS i LEFT JOIN gallery_albums AS a ON i.albumid=a.id) WHERE i.id = " . to_sql($image['id'], 'Text');
            $image = DB::row($sql, 2);

            $urlFiles = $g['path']['url_files'];
            $imageUrl = $urlFiles . 'gallery/thumb/' . $image['user_id'] . '/' . $image['folder'] . '/' . $image['filename'];
            $imageUrl = $imageUrl . '?id=' . $image['id'];
            $imageUrlBig = $urlFiles . 'gallery/images/' . $image['user_id'] . '/' . $image['folder'] . '/' . $image['filename'];
            $imageFileBig = $g['path']['dir_files'] . 'gallery/images/' . $image['user_id'] . '/' . $image['folder'] . '/' . $image['filename'];
            $fileName = explode('.', $image['filename']);
            $imageUrlSrc = "{$urlFiles}gallery/images/{$image['user_id']}/{$image['folder']}/{$fileName[0]}_src.jpg";
            if (!file_exists($imageUrlSrc)) {
                $imageUrlSrc = $imageUrlBig;
            }
            $imageUrlBig = $imageUrlBig . '?id=' . $image['id'];
            $vars['album_id'] = $image['albumid'];
            if ($image['folder'] == 0 && $image['album'] == 'Timeline Photos') {
                $image['album'] = l('Timeline Photos');
            }
            $vars['album_title'] = $image['album'];

            $html->setvar('wall_image_id', $image['id']);
            if (trim($image['album_desc']) != ''
                    && ($vars['photo_count'] != 1 || (trim($image['desc']) == '' && $vars['photo_count'] == 1))) {
                $html->setvar('wall_album_desc', Common::parseLinksSmile($image['album_desc']));
                $html->parse('wall_album_desc', false);
            }
            $html->setvar('wall_pics_image', $imageUrl);
            $html->setvar('wall_pics_image_big', $imageUrlBig);
            if ($html->varExists('wall_pics_image_src')) {
                $html->setvar('wall_pics_image_src', $imageUrlSrc);
            }
            $html->setvar('image_id', $image['id']);
            $html->parse('wall_pics_image');
            $i++;
            if ($i == 10) break;
        }
        $vars['wall_section_url'] = Common::replaceByVars(self::getUrlSection($row['section'], false), $vars);
        $html->setvar('wall_section_url', $vars['wall_section_url']);

        if($vars['photo_count'] == 1) {
            if (trim($image['desc']) != '') {
                if ($html->varExists('wall_album_desc_orig')) {
                    $html->setvar('wall_album_desc_orig', $image['desc']);
                }
                $html->setvar('wall_album_desc', Common::parseLinksSmile($image['desc']));
                $html->parse('wall_album_desc', false);
            }
            $html->setvar('wall_pics_width', self::calcImageWidth($imageFileBig, false, $image['width']));
        }
    }

    static function addInfoPicsComment(&$html, &$vars, $row)
    {
        global $g;

        $sql = 'SELECT * FROM gallery_comments
                WHERE user_id = ' . to_sql($row['user_id']) . '
                AND id = ' . to_sql($row['item_id'], 'Text');
        $comment = DB::row($sql, 2);

        $sql = "SELECT i.*, a.folder, a.title as album, a.id as album_id FROM (gallery_images AS i LEFT JOIN gallery_albums AS a ON i.albumid=a.id) WHERE i.id = " . to_sql($comment['imageid'], 'Text');
        $image = DB::row($sql, 2);
        $vars['item_comment'] = trim($comment['comment']);
        $vars['image_url'] = $g['path']['url_files'] . 'gallery/thumb/' . $image['user_id'] . '/' . $image['folder'] . '/' . $image['filename'];
        $vars['image_url_big'] = $g['path']['url_files'] . 'gallery/images/' . $image['user_id'] . '/' . $image['folder'] . '/' . $image['filename'];
        $vars['image_id'] = $image['id'];

        $vars['name_uploader_link_start'] = self::getUrlSection('photo_comment');

        $sql = 'SELECT name FROM user
                 WHERE user_id = ' . to_sql($image['user_id'], 'Number');
        $vars['name_uploader'] = DB::result($sql, 0, 2);
        $vars['display_profile'] = self::displayProfile($image['user_id']);
    }

    static function addInfoShare(&$html, &$vars, $row)
    {

    }

    static function addInfo3dcity(&$html, &$vars, $row)
    {

    }

    static function addInfoFieldStatus(&$html, &$vars, $row)
    {
        $vars['status'] = l($row['params']);
    }

    static function addInfoInterests(&$html, &$vars, $row)
    {
        global $p;
        $changeMode = get_param('change_mode');
        $updateMode = get_param('cmd') == 'update';
        if ($p != 'wall.php' && !$changeMode && !$updateMode) {
            $isUpdate = 'no';
        } else {
            $isUpdate = intval($changeMode || !$updateMode);
        }

        $guidInterestsAll = array();
        if (guid() != $row['user_id']) {
            $guidInterests = User::getInterests(guid());
            foreach ($guidInterests as $item) {
                $guidInterestsAll[$item['id']] = $item;
                $guidInterestsAll[$item['id']]['main'] = 1;
            }
        }

        $html->setvar('is_update', $isUpdate);
        $block = 'wall_interests_item';
        $interests = User::getInterests($row['user_id'], '', 'DESC', $row['id']);
        $interestsAll = array();
        foreach ($interests as $interest) {
            $interestsAll[] = $interest['id'];
            $html->setvar("{$block}_id", $interest['id']);
            $html->setvar("{$block}_category", $interest['category']);
            $html->setvar("{$block}_title", $interest['interest']);

            if(isset($guidInterestsAll[$interest['id']])){
                $html->parse('main_interest');
            } else {
                $html->clean('main_interest');
            }

            $html->parse($block);
        }
        $vars["{$block}_list"] = implode(',', $interestsAll);
    }

    static function getChangeMode($isChangeModeWall = 0)
    {
        $modeWall = '';
        $templateMode = Common::getOptionTemplate('wall_mode');
        if ($templateMode !== null) {
            $modeWall = $templateMode;
        }elseif (Common::getOption('set', 'template_options') == 'urban') {
            if (Common::isOptionActive('only_friends_wall_posts')) {
                $modeWall = 'friends';
            } else {
                $modeWall = get_param('type_wall');
                if (!$modeWall) {
                    $modeWall = User::getInfoBasic(guid(), 'wall_mode');
                }
                if ($isChangeModeWall) {
                    User::update(array('wall_mode' => $modeWall));
                }
            }
        }
        return $modeWall;
    }

    static function getCountItems($uid = null)
    {
        $uidWall = self::getUid();
        if (!$uidWall) {
            if ($uid === null) {
                $uid = guid();
            }
            self::setUid($uid);
        }
        $html = null;
        $count = Wall::parseItems($html, false, false, false, true);
        self::setUid($uidWall);

        return $count;
    }

    /*
     * $isNumberPostsUser - number of posts on the wall
     **/
    static function parseItems(&$html, $id = false, $oneOnly = false, $newOnly = false, $isNumberPostsUser = false)
    {
        global $p;
        global $g;

        $paramId = $id;
        if (!$isNumberPostsUser) {
            require_once(self::includePath() . '_include/current/forum.php');
            CForumMessage::$videoWidth = self::EMBED_VIDEO_WIDTH;
        }

        self::checkSectionsHidden();

        $uid = self::getUid();
        $guid = guid();
        $cmd = get_param('cmd');
        $changeModeWall = intval(get_param('change_mode'));
        $optionTemplateSet = Common::getTmplSet();
        self::$tmplName = Common::getTmplName();
        $sectionsOnly = self::getSiteSectionsOnly();

        $modWall = self::getChangeMode($changeModeWall);
        $tmplWallType = Common::getOptionTemplate('wall_type');
        self::$typeWall = Common::getOptionTemplate('wall_type');

        $isWallInProfile = false;
        if ($optionTemplateSet == 'urban') {
            $isWallInProfile = get_param('is_profile_wall', null);
            if ($isWallInProfile === null) {
                $isWallInProfile = intval($p != 'wall.php');
            }
            if ($isNumberPostsUser) {
                $isWallInProfile = true;
            }
        }

        if (!$isNumberPostsUser) {
            $html->setvar('wall_user_id', $uid);
            $html->setvar('visitor_photo', User::getPhotoDefault(guid(), 'r', false, guser('gender')));
        }

        $uids = User::getFriendsList($uid, true);

        if ($optionTemplateSet != 'urban' && $guid && $uid != $guid) {
            // other member - show only his actions and actions of friends on his wall
            $uids = User::getFriendsListMutual($uid, guid(), true);
            #echo 'MUTUAL<br>';
        }

        $where = '';

        if ($id !== false) {
            $where = ' AND w.id < ' . intval($id);
        }

        if ($oneOnly !== false) {
            $where = ' AND w.id = ' . intval($oneOnly);
        }

        if($newOnly !== false) {
            $where = ' AND w.id > ' . intval($id);
        }

        if ($optionTemplateSet == 'urban' && !$isWallInProfile && self::$typeWall != 'edge') {
            if ($modWall == 'all') {
                $wallFilters = get_param('wall_filters', null);
                $userFilters = User::setGetParamsFilter('user_search_filters');
                $userFilters = json_encode($userFilters);
                $html->setvar('wall_filters', $userFilters);
                if ($wallFilters !== null && $wallFilters != $userFilters) {
                    $where = '';
                    $id = false;
                    $html->parse('change_condition', false);
                }
            } elseif ($changeModeWall){
                $where = '';
                $id = false;
                $html->parse('change_condition', false);
            }
        }

        // hide own item_comments from wall to any content - use hide from user option!!!!
        $hideCurrentUserPost = false;
        if ($guid && !self::isSingleItemMode() && $hideCurrentUserPost) {
            $where .= ' AND hide_from_user != ' . to_sql($guid, 'Number');
        }

        if ($optionTemplateSet == 'urban') {
            $whereInterests = '';
            if (self::$typeWall == 'edge') {
                $whereInterests = ' OR w.section = "share" ';
            } else {
                if (in_array('interests', $sectionsOnly)) {
                    $whereInterests = ' OR w.section = "interests" ';
                }
            }
            $where .= ' AND (w.section = "comment"
                            ' . $whereInterests . '
                             OR (w.section = "vids" AND w.params != "0")
                             OR (w.section = "photo" AND w.params != 0)
                             OR (w.section = "pics" AND w.params_section = "timeline"))';
        } elseif (!$guid) {
            $where .= ' AND w.section != "comment"';
        }
        $whereFriends = 'w.access = "public"';

        if ($guid) {
            $frd = User::getFriendsList(guid(), true);
            if (self::$typeWall == 'edge') {
                //if ($isWallInProfile) {
                    $whereFriends = '(w.access = "public"
                                  OR (w.access = "friends" AND ((w.comment_user_id = 0 AND w.user_id IN (' . $frd . ')) OR (w.comment_user_id != 0 AND w.comment_user_id IN (' . $frd . '))))
                                  OR (w.access = "private" AND ((w.comment_user_id = 0 AND w.user_id = ' . $guid . ') OR (w.comment_user_id != 0 AND w.comment_user_id = ' . $guid . '))))';
                /*} else {
                    $whereFriends = '(w.access = "public"
                              OR (w.access = "friends" AND w.user_id IN (' . $frd . '))
                              OR (w.access = "private" AND w.user_id = ' . $guid . ' AND w.comment_user_id = ' . $guid . ')
                              OR (w.access = "private" AND w.user_id = ' . $uid . ' AND w.comment_user_id = ' . $guid . ' ))';
                }*/


            } else {
                $whereFriends = '(w.access = "public"
                              OR (w.access = "friends" AND w.user_id IN (' . $frd . '))
                              OR (w.access = "private" AND w.parent_user_id = ' . $guid . '))';
            }
        }

        $fromAdd = '';
        $fromGroup = '';
        if ($optionTemplateSet == 'urban') {//Доступна только для авториз
            if ($isWallInProfile) {
                $whereFriends = ' AND ' . $whereFriends;
                if ($uid == $guid && self::$typeWall != 'edge') {
                    $whereFriends = '';
                }
                $where = ' w.user_id = ' . to_sql($uid, 'Number') . $whereFriends .  $where;
                //var_dump_pre($where, true);
            } elseif ($modWall == 'friends') {
                $where = "(w.user_id IN({$uids}) AND (w.comment_user_id IN({$uids}) OR w.comment_user_id = 0)) AND {$whereFriends}{$where}";
            } else {
                //User::setGetParamsFilter('user_search_filters', $userInfo);
                if (self::$typeWall == 'edge') {
                    $whereWallPrepare = array(
                        'from_add' =>  'LEFT JOIN userinfo AS i ON {table_name}.user_id=i.user_id LEFT JOIN user_block_list AS ubl1 ON (ubl1.user_to = {table_name}.user_id AND ubl1.user_from = ' . to_sql($guid, 'Number') . ') ' .
                                       'LEFT JOIN user_block_list AS ubl2 ON (ubl2.user_from = {table_name}.user_id AND ubl2.user_to = ' . to_sql($guid, 'Number') .')',
                        'where' =>   'AND ubl1.id IS NULL AND ubl2.id IS NULL',
                        'order' => '',
                        'from_group' => ''
                    );
                } else {
                    $whereWallPrepare = Common::searchWhere('wall_urban', '{table_name}', true);
                }

                if ($whereWallPrepare['from_add']) {
                    $fromAdd = str_replace('{table_name}', 'u', $whereWallPrepare['from_add']);
                    $fromAdd .= ' LEFT JOIN user AS ucom1 ON ucom1.user_id = w.comment_user_id';
                    $fromAdd .= ' LEFT JOIN user AS ucom2 ON w.comment_user_id = 0 AND ucom2.user_id = w.user_id';
                    $interest = get_param('interest');
                    if ($interest) {
                        $fromAdd .= " LEFT JOIN user_interests AS uintcom1 ON (ucom1.user_id = uintcom1.user_id AND uintcom1.interest = " . to_sql($interest) .')';
                        $fromAdd .= " LEFT JOIN user_interests AS uintcom2 ON (ucom2.user_id = uintcom2.user_id AND uintcom2.interest = " . to_sql($interest) .')';
                    }
                }
                $whereWallSql = '';
                if ($whereWallPrepare['where']) {
                    $whereWall = str_replace('{table_name}', 'u', $whereWallPrepare['where']);
                    $whereWallSql = " AND (u.user_id = " . to_sql($guid) . " OR (1=1 {$whereWall}))";
                    $whereWallWhoseComment1 = str_replace('{table_name}', 'ucom1', $whereWallPrepare['where']);
                    $whereWallWhoseComment2 = str_replace('{table_name}', 'ucom2', $whereWallPrepare['where']);
                    $whereWallSql .= " AND ((ucom1.user_id = " . to_sql($guid) . " OR (1=1 {$whereWallWhoseComment1}))";
                    $whereWallSql .= "  OR (ucom2.user_id = " . to_sql($guid) . " OR (1=1 {$whereWallWhoseComment2})))";
                }
                $fromGroup = ' GROUP BY w.id';
                /*if ($whereWall['from_group']) {
                    $fromGroup = str_replace('{table_name}', 'u', $whereWallPrepare['from_group']);
                }*/
                $where = $whereFriends . $where . $whereWallSql;
            }
        } else {
            $whereFriends = ' AND ' . $whereFriends;
            if ($uid != $guid) {
                $uidsForComments = '0,' . to_sql(guid(), 'Number') . ',' . $uids;
                $where .= ' AND comment_user_id IN (' . $uidsForComments . ') ';
                $uids = $uid;
                /*$where = ' ( w.user_id = ' . to_sql($uid, 'Number') . '
                            OR ( w.user_id = ' . to_sql(guid(), 'Number') . ' AND comment_user_id = ' . to_sql($uid, 'Number') . ' )
                            ) ' . $where;
                */
                $where = ' ( w.user_id = ' . to_sql($uid, 'Number') . '
                         OR comment_user_id = ' . to_sql($uid, 'Number')  .'
                         ) '  . $whereFriends .  $where;
            } else {
                $where = ' (w.user_id = ' . to_sql(guid(), 'Number') . ' OR fr1.user_id IS NOT NULL OR fr2.user_id IS NOT NULL OR fr3.user_id IS NOT NULL OR fr4.user_id IS NOT NULL) ' . $whereFriends . $where;
            }
        }

        /*
         * Add condition of items relations to viewer
         * LEFT JOIN wall_items_for_user AS wi ON (wi.user_id = guid() AND wi.item_id = w.site_section_item_id AND wi.section = w.site_section)
         * !!! Friends only items !!!
         * WHERE wi.item_id NOT NULL OR w.section IN ();
         *
         */
        if ($sectionsOnly) {
            $sectionsOnlyList = '';
            $delimiter = '';
            foreach($sectionsOnly as $sectionOnly) {
                $sectionsOnlyList .= $delimiter . to_sql($sectionOnly, 'Text');
                $delimiter = ',';
            }
            $where .= ' AND (w.section IN (' . $sectionsOnlyList . ')
                OR (w.section = "share" AND (SELECT id FROM wall
                    WHERE wall.id = w.item_id AND wall.section IN (' . $sectionsOnlyList . ')) IS NOT NULL )
                )';
        }

        $sectionsHidden = self::getSectionsHidden();
        //var_dump_pre($sectionsHidden);
        if ($sectionsHidden) {
            $sectionsHiddenList = to_sql('share', 'Text');
            $delimiter = ',';
            foreach($sectionsHidden as $sectionHidden) {
                $sectionsHiddenList .= $delimiter . to_sql($sectionHidden, 'Text');
            }
            $where .= ' AND (w.section NOT IN (' . $sectionsHiddenList . ')
                OR (w.section = "share" AND (SELECT id FROM wall
                    WHERE wall.id = w.item_id AND wall.section NOT IN (' . $sectionsHiddenList . ')) IS NOT NULL )
                )';
        }

        $sqlBase = "FROM wall AS w
                    LEFT JOIN user AS u ON u.user_id = w.user_id
                    {$fromAdd}
                   WHERE {$where} ";

        $sqlLastItem = $sqlBase;

        $limit = self::getPostsLoadCount();
        $limitSql = 'LIMIT 0,' . to_sql($limit, 'Number');
        $itemWall = get_param('wall_item');
        if ($itemWall) {
            $sqlFollowing = 'SELECT w.id ' .  $sqlBase . ' AND w.id <= ' . to_sql($itemWall) . " ORDER BY id DESC {$limitSql}";
            $followingId = DB::rows($sqlFollowing);
            if ($followingId) {
                $itemWall = array_pop($followingId);
                if (isset($itemWall['id'])) {
                    $sqlBase .= ' AND w.id >= ' . to_sql($itemWall['id']);
                    $limitSql = '';
                }
            }
        }
        $sqlBase .= $fromGroup;
        //$sqlLastItem .= $fromGroup;
        // it is for wall owner only
        if($uid == guid() && $optionTemplateSet != 'urban') {
            //Нужно разобрраться почему так сделано и почему тут секции не отключаются
            $allowSection = '"photo_comment", "pics_comment", "group_join", "places_review", "event_member", "event_added", "blog_post", "forum_thread", "music", "vids"';
            $sqlBase = 'FROM wall AS w
                JOIN user AS u ON u.user_id = w.user_id
                LEFT JOIN friends_requests AS fr1 ON fr1.user_id=' . to_sql(guid(), 'Number') . ' AND fr1.friend_id=' . to_sql(guid(), 'Number') . ' AND fr1.accepted = 1
                LEFT JOIN friends_requests AS fr2 ON fr2.user_id=' . to_sql(guid(), 'Number') . ' AND fr2.friend_id=w.user_id AND fr2.accepted = 1
                LEFT JOIN friends_requests AS fr3 ON fr3.user_id=w.user_id AND fr3.friend_id=' . to_sql(guid(), 'Number') . ' AND fr3.accepted = 1
                LEFT JOIN friends_requests AS fr4 ON fr4.user_id=w.user_id AND fr4.friend_id=w.user_id AND fr4.accepted = 1
                LEFT JOIN wall_items_for_user AS wi ON (wi.user_id = ' . to_sql(guid(), 'Number') . ' AND wi.item_id = w.site_section_item_id AND wi.section = w.site_section)
                WHERE ' . $where . '
                    AND (
                        w.user_id = ' . to_sql(guid(), 'Number') . '
                        OR (
                            (
                                w.section IN (' . $allowSection . ')
                                OR w.site_section = ""
                                OR (wi.item_id IS NOT NULL AND w.date >= wi.created_at)
                            )
                            AND (w.date >= fr1.created_at OR w.date >= fr2.created_at OR w.date >= fr3.created_at OR w.date >= fr4.created_at)
                        )
                    )';
            $sqlLastItem = $sqlBase;
        }

        //$sqlLastItem = 'SELECT w.id ' . $sqlLastItem . ' ORDER BY id ASC LIMIT 1';
        if($isWallInProfile) {
            $sqlLastItem = str_replace('LEFT JOIN user AS u ON u.user_id = w.user_id', '', $sqlLastItem);
        }

        $sqlNumberItems = 'SELECT COUNT(w.id) ' . $sqlLastItem;
        //print_r_pre($sqlLastItem);
        $sqlLastItem = 'SELECT MIN(w.id) ' . $sqlLastItem;
        $sqlInfo = "SELECT w.*, u.name, u.gender, DATE_FORMAT(NOW(), '%Y') - DATE_FORMAT(u.birth, '%Y') - (DATE_FORMAT(NOW(), '00-%m-%d') < DATE_FORMAT(u.birth, '00-%m-%d')) AS age "
                   . $sqlBase . ' ORDER BY id DESC ' .  $limitSql;

        //print_r_pre($sqlInfo, true);
        if ($isNumberPostsUser) {
            //print_r_pre($sqlNumberItems, true);
            $numberPostsWall = DB::result($sqlNumberItems, 0, 3);
            return $numberPostsWall;
        }

        $lastItemOnWall = DB::result($sqlLastItem, 0, 3);

        DB::query($sqlInfo, 3);

        //echo nl2br($sqlInfo);
        //exit();
        $wallItemClass = '';
        if ($id === false || $newOnly !== false) {
            $wallItemClass = 'first';
        }

        if(self::isSingleItemMode()) {
            $wallItemClass = '';
        }

        $titlesMultiPhoto = array(
            'wall_item_title_template_music_photo',
            'wall_item_title_template_musician_photo',
            'wall_item_title_template_event_photo',
            'wall_item_title_template_places_photo',
            'wall_item_title_template_pics',
            'wall_item_title_template_photo',
        );

        $firstPostId = '';

        $parsed = false;

        $isMobileWall = self::getIsMobile();

        $isShareAvailableInTemplate = (Common::getTmplSet() == 'old') || self::$typeWall == 'edge';

        while ($row = DB::fetch_row(3)) {

            if($firstPostId == '') {
                $firstPostId = $row['id'];
            }

            $html->setvar('id', $row['id']);

            if ($guid) {
                if($row['user_id'] == $guid || $row['comment_user_id'] == $guid) {
                    $html->parse('wall_item_delete', false);
                }

                $mainPost = ($row['user_id'] == $guid || $row['comment_user_id'] == $guid);
                if (self::$typeWall == 'edge') {
                    $friendPost = true;
                } else {
                    $friendPostUserId = User::isFriend($guid, $row['user_id']);
                    $friendPostCommentUserId = User::isFriend($guid, $row['comment_user_id']);
                    $friendPost = $friendPostUserId || $friendPostCommentUserId;
                }

                if ($mainPost || $friendPost) {
                    $numAction = 0;
                    if ($oneOnly === false) {
                        $numAction++;
                        $html->parse('direct_link_popup_post', false);
                    }
                    if (self::$typeWall != 'edge' && $friendPost) {
                        $numAction++;
                        $friendId = ($friendPostUserId) ? $row['user_id'] : $row['comment_user_id'];
                        $html->setvar('friend_id', $friendId);
                        $html->parse('unfriend_popup_post', false);
                    } else {
                        $html->setblockvar('unfriend_popup_post', '');
                    }
                    if ($guid == $row['user_id']
                        || ($row['section'] == 'comment' && $guid == $row['comment_user_id'])
                        || (self::isVisitorLoadPicsInTimeLine($row) && $row['comment_user_id'] == $guid)
                    ) {
                        //if (!$friendPost) {
                        $numAction++;
                        $html->parse('delete_popup_post', false);
                    } else {
                        $html->setblockvar('delete_popup_post', '');
                    }
                    if ($numAction > 0) {
                        $html->parse('wall_item_block_action', false);
                    }
                }
            }

            $html->setvar('wall_item_class', $wallItemClass);
            $wallItemClass = '';

            $row['section_real'] = $row['section'];

            $row['item_user_id'] = $row['user_id'];

            $row['item_name_user_id'] = $row['user_id'];

            $rowSource = $row;
            $row['real_wall_id'] = $row['id'];

            // SHARE - select main item info
            if($row['section'] == 'share') {
                self::setShareItem(true);

                $row['section_real'] = 'share';
                $row['item_name'] = $row['name'];
                $row['item_photo'] = User::getPhotoDefault($row['user_id'], 'r');
                $sql = "SELECT w.*, u.name, u.gender, DATE_FORMAT(NOW(), '%Y') - DATE_FORMAT(u.birth, '%Y') - (DATE_FORMAT(NOW(), '00-%m-%d') < DATE_FORMAT(u.birth, '00-%m-%d')) AS age
                          FROM wall AS w
                          JOIN user AS u ON u.user_id = w.user_id
                         WHERE w.id = " . to_sql($row['item_id'], 'Number');
                $row = DB::row($sql, 4);

                $row['item_user_id'] = $rowSource['user_id'];
                $row['item_name_user_id'] = $rowSource['item_name_user_id'];

                $row['real_wall_id'] = $row['id'];

                $row['id'] = $rowSource['id'];
                $row['section_real'] = 'share';
                $row['item_date'] = $rowSource['date'];
                $row['item_name'] = $rowSource['name'];
                $row['item_photo'] = User::getPhotoDefault($rowSource['user_id'], 'r');
                $row['gender'] = User::getInfoBasic($row['item_user_id'], 'gender');
                //echo '<pre>';
                //print_r($row);
                //echo '</pre>';

            } else {
                self::setShareItem(false);
            }

            $vars = Wall::itemInfoPrepare($row);

            $vars['wall_interests_item_list'] = '';
            $vars['wall_item_comment'] = '';

            $vars['tag_open'] = '<';
            $vars['tag_close'] = '>';
            $vars['tag_open_close'] = '</';
            $vars['tag_strong'] = '<strong>';
            $vars['tag_strong_close'] = '</strong>';


            if($row['section'] == 'field_status') {
                $vars['wall_item_title_template'] = self::wallItemTitleTemplate($row['section'], $row['gender']);
            }



            if ($row['section'] == 'status') {
                $row['section'] = 'comment';
            }

            $sectionPreparedName = str_replace(' ', '', ucwords(str_replace('_', ' ', $row['section'])));
            $addInfoBySection = 'addInfo' . $sectionPreparedName;

            //if($row['section'] == 'comment') {
            //    echo "addInfoBySection BEFORE > {$vars['item_name']} > {$vars['item_name_user_id']}<br>";
            //}

            self::$addInfoBySection($html, $vars, $row);

            //if($row['section'] == 'comment') {
            //    echo "addInfoBySection AFTER > {$vars['item_name']} > {$vars['item_name_user_id']}<br>";
            //}

            if(isset($row['item_photo'])) {
               $vars['photo'] = $row['item_photo'];
            }
            if($row['section'] == 'pics' && !self::isVisitorLoadPicsInTimeLine($row)) {
                $vars['wall_item_title_template'] = self::wallItemTitleTemplate($row['section'], $row['gender']);
            }

            if(isset($vars['photo_count']) && $vars['photo_count'] > 1 && in_array('wall_item_title_template_' . $row['section'], $titlesMultiPhoto)) {
                $titleTemplate = $row['section'] . 's';
                //if($row['section'] == 'pics') {
                    //$titleTemplate = $titleTemplate . '_' . strtolower($row['gender']);
                //}
                $vars['wall_item_title_template'] = self::wallItemTitleTemplate($titleTemplate, $row['gender']);
            }

            if( ($row['section'] == 'photo_comment' || $row['section'] == 'pics_comment')) {

                if($row['section'] == 'photo_comment') {
                    $vars['wall_item_title_template'] = self::wallItemTitleTemplate($row['section'] . '_other', $row['gender']);
                }

                if($row['name'] == $vars['name_uploader']) {
                    $vars['wall_item_title_template'] = self::wallItemTitleTemplate($row['section'], $row['gender']);
                } elseif(guser('name') == $vars['name_uploader']) {
                    $vars['wall_item_title_template'] = self::wallItemTitleTemplate($row['section'] . '_my', $row['gender']);
                }

            }

            if($row['section'] == 'blog_comment' && $vars['name_blog_owner'] == guser('name')) {
                 $vars['wall_item_title_template'] = self::wallItemTitleTemplate($row['section'] . '_my', $row['gender']);
            }

            // self comment on own wall
            if($row['section'] == 'comment' && $row['user_id'] != guid() && $row['comment_user_id'] == $row['user_id']) {
                 $vars['wall_item_title_template'] = self::wallItemTitleTemplate($row['section'], $row['gender']);
            }


            if ($row['section'] == 'comment') {
                if ($row['user_id'] != $row['comment_user_id']
                    && (($row['user_id'] != self::getUid() && $row['comment_user_id'] == self::getUid())
                        || ($row['user_id'] == self::getUid() && $row['user_id'] != guid())
                        || ($row['user_id'] != self::getUid() && $row['user_id'] != guid() && $row['comment_user_id'] != guid())
                            )) {
                    $vars['wall_item_title_template'] = self::wallItemTitleTemplate($row['section'] . '_wrote', $row['gender']);
                }
                if ($row['user_id'] == guid() && $row['comment_user_id'] == guid()) {
                    $vars['wall_item_title_template'] = self::wallItemTitleTemplate($row['section'] . '_my', $row['gender']);
                }
                if ($row['user_id'] == guid() && $row['comment_user_id'] != guid()) {
                    $vars['wall_item_title_template'] = self::wallItemTitleTemplate($row['section'] . '_wrote_my', $row['gender']);
                }
            }

            /*if($row['section'] == 'comment'
                    && ($row['user_id'] != self::getUid())&& ($row['comment_user_id'] == self::$uid)) {
                 $vars['wall_item_title_template'] = self::wallItemTitleTemplate($row['section'] . '_wrote', $row['gender']);
            }*/
            /*if($row['section'] == 'comment' && $row['user_id'] != $row['comment_user_id']
                    && (($row['user_id'] != self::getUid() && $row['comment_user_id'] == self::getUid())
                        || ($row['user_id'] == self::getUid() && $row['user_id'] != guid())
                        || ($row['user_id'] != self::getUid() && $row['user_id'] != guid() && $row['comment_user_id'] != guid())
                            )) {
                $vars['wall_item_title_template'] = self::wallItemTitleTemplate($row['section'] . '_wrote', $row['gender']);

            }*/

            /*if($row['section'] == 'comment' && $row['user_id'] == guid() && $row['comment_user_id'] == guid()) {
                $vars['wall_item_title_template'] = self::wallItemTitleTemplate($row['section'] . '_my', $row['gender']);
            }

            if($row['section'] == 'comment' && $row['user_id'] == guid() && $row['comment_user_id'] != guid()) {
                $vars['wall_item_title_template'] = self::wallItemTitleTemplate($row['section'] . '_wrote_my', $row['gender']);
            }*/

            if(isset($vars['aux_comment_video'])) {
                if($row['section'] == 'comment') {
                    if($row['user_id'] == guid() && $row['comment_user_id'] == guid()) {
                        $vars['wall_item_title_template'] = self::wallItemTitleTemplate($row['section'] . '_video_my', $row['gender']);
                    } else {
                         $vars['wall_item_title_template'] = self::wallItemTitleTemplate($row['section'] . '_video', $row['gender']);
                    }
                }
            }

            if($row['section'] == 'group_wall_comment') {
                 $vars['wall_item_title_template'] = self::wallItemTitleTemplate('group_wall', $row['gender']);
            }
            if($row['section'] == 'group_forum_post_comment') {
                 $vars['wall_item_title_template'] = self::wallItemTitleTemplate('group_forum_post', $row['gender']);
            }

            if($row['section'] == 'event_comment_comment') {
                 $vars['wall_item_title_template'] = self::wallItemTitleTemplate('event_comment', $row['gender']);
            }

            if($row['section'] == 'forum_thread') {
                 $vars['wall_item_title_template'] = self::wallItemTitleTemplate('forum_thread', $row['gender']);
            }

            if($row['section'] == 'group_join') {
                $groupUserId = DB::field('groups_group', 'user_id', '`group_id` = ' . to_sql($row['item_id'], 'Number'));
                if ($row['user_id'] == $groupUserId[0]) {
                    $vars['wall_item_title_template'] = self::wallItemTitleTemplate('group_created', $row['gender']);
                } else {
                    $vars['wall_item_title_template'] = self::wallItemTitleTemplate('group_join', $row['gender']);
                }
            }

            if($row['section'] == 'comment' && $row['params'] == 'item_birthday')  {
                if (self::$uid == $row['user_id'] && self::$uid == guid()) {
                    $title = 'birthday_current_users';
                } else {
                    $title = 'birthday_users';
                }
                $itemTitleTemplate = self::wallItemTitleTemplate($title, $row['gender']);
                if ($optionTemplateSet == 'urban') {
                    $vars['wall_item_comment'] = mb_ucfirst(str_replace('{profile}', '', $itemTitleTemplate));
                } else {
                    $vars['wall_item_title_template'] = $itemTitleTemplate;
                }
            }

            // $vars['name'] + $vars['item_user_id']
            // $vars['item_name'] + $vars['item_name_user_id']

            /*
            if($row['section'] == 'comment') {
                echo "{$row['section']} > {$vars['name']} > {$vars['item_name']} > {$vars['item_user_id']} > {$vars['item_name_user_id']}<br>";
                echo "1) {$vars['name']} > {$vars['item_user_id']}<br>";
                echo "2) {$vars['item_name']} > {$vars['item_name_user_id']}<br>";
            }
             */

            $uidProfile = $vars['item_user_id'];
            if ($vars['item_section_real'] == 'share' && isset($row['user_id'])) {
                $uidProfile = $row['user_id'];
            }
            //echo ':::::: ' . $vars['id'] . '/' . $vars['name'] . '/' . $uidProfile . '<br>';
            $vars['profile'] = self::getTemplateUsername($vars['name'], $uidProfile);
            $varsName = $vars['name'];
            if (self::isVisitorLoadPicsInTimeLine($row)) {
                $varsName = $vars['name_user_item'];
            }
            $uidProfileS = $vars['item_user_id'];
            if (isset($row['item_name'])) {
                $uidProfileS = $row['user_id'];
            }
            //echo '!!!!!!: ' . $varsName . '/' . $uidProfileS . '<br>';
            $vars['profile_s'] = self::getTemplateUsername($varsName, $uidProfileS);//self::getTemplateUsernameS($varsName, $uidProfileS);

            $vars['item_profile'] = self::getTemplateUsername($vars['item_name'], $vars['item_name_user_id']);

            $urlSection = 'url' . $sectionPreparedName;

#            $vars['display_profile'] = '';

            if($isMobileWall && $row['section'] != 'comment' && $row['section'] != 'photo_comment') {
                $vars['item_link_start'] = '';
                $vars['item_link_end'] = '';
                $vars['musician_link_start'] = '';
            } else {
                $vars['item_link_start'] = Common::replaceByVars(self::getUrlSection($row['section'], true, $vars), $vars);
                $vars['item_link_end'] = '</a>';
            }

            if ($optionTemplateSet == 'urban' && $row['section'] == 'vids') {
                $vars['item_image'] = $vars['item_image_b'];
                $vars['item_link_start'] = '<a href="#" onclick="onClickWallComments('.$row['item_id'].', '.$row['user_id'].', '.$row['id'].'); return false;">';
            }

            if (self::$typeWall == 'edge') {
                if ($row['section_real'] == 'share') {
                    $vars['wall_item_title'] = $vars['wall_item_title_template'];
                } elseif (isset($vars['photo_count']) && isset($vars['photo_count_all'])) {
                    $vars['wall_item_title'] = self::wallItemTitleTemplate('add_photos', $row['gender']);
                } else {
                    $vars['wall_item_title'] = '';
                }
                if ($vars['wall_item_title']) {
                    $vars['wall_item_title'] = Common::replaceByVars($vars['wall_item_title'], $vars);
                }
            } else {
                $vars['wall_item_title'] = Common::replaceByVars($vars['wall_item_title_template'], $vars);
            }

            $urlKeys = array('item_comment', 'review_text');
            $widthMedia = null;
            $itemCustomWidthSection = array('music_comment', 'vids_comment', 'musician_comment');
            foreach($urlKeys as $urlKey) {
                if(isset($vars[$urlKey])) {
                    if (in_array($row['section'], $itemCustomWidthSection)) {
                        $widthMedia = self::EMBED_VIDEO_COMMENT_WIDTH_CUSTOM;
                    }
                    if ($row['section'] == 'blog_comment') {
                        $widthMedia = self::EMBED_VIDEO_WIDTH;
                    }
                    $vars[$urlKey] = Common::textToMedia($vars[$urlKey], '_blank', '', $widthMedia);
                }
            }

            $vars['wall_section_url'] = Common::replaceByVars(self::getUrlSection($row['section'], false), $vars);

            $vars['display_profile'] = self::displayProfile($vars['item_user_id']);

//            var_dump($vars);
//            die();

            foreach ($vars as $key => $value) {
                $html->setvar($key, $value);
            }

            if (self::$typeWall == 'edge') {
                $html->subcond($vars['item_user_id'] != $guid, 'wall_item_open_im_link');
                $html->subcond($vars['wall_item_title'], 'wall_item_title', 'wall_item_name');
            }

            if ($optionTemplateSet == 'urban' && $row['section'] == 'vids' && $vars['is_uploaded']) {
                $html->parse('wall_vids_comments', false);
            }

            $id = $rowSource['id'];

            $shareNoPhoto = array(
                'group_wall',
                'group_wall_comment',
                'group_forum_post',
                'group_forum_post_comment',
                'places_review',
                'music',
                'vids',
                'status',
                'comment',
                'field_status',
                'pics',
                'forum_thread',
                'event_comment',
                'event_comment_comment',
            );

            if(in_array($row['section'], $shareNoPhoto) || strstr($row['section'], '_photo')) {
                //self::setShareItem(false);
            }

            if(self::isShareItem()) {
                //$html->parse('wall_shared_item_start', false);
                //$html->parse('wall_shared_item_end', false);
            }

            if ($row['section'] == 'field_status') {
                $row['section'] = 'comment';
            }
            if ($row['section'] == 'group_wall_comment') {
                $row['section'] = 'group_wall';
            }
            if ($row['section'] == 'group_forum_post_comment') {
                $row['section'] = 'group_forum_post';
            }
            if ($row['section'] == 'event_comment_comment') {
                $row['section'] = 'event_comment';
            }

            $photoSection = false;

            if(isset($vars['photo_count'])) {
                $blockSuffix = '_single';
                if($vars['photo_count'] > 1) {
                    $blockSuffix = '_images';
                }
                //var_dump_pre($blockSuffix);
                $photoSection = 'wall_' . $row['section'] . $blockSuffix;
                $html->parse($photoSection);
            }
            /* Vids */
            if (self::$typeWall == 'edge' && $row['section'] == 'vids') {
                $wallPlayVideo = Common::getOption('wall_play_video', self::$tmplName . '_wall_settings');
                if ($wallPlayVideo == 'popup') {
                    $html->parse('wall_vids_image', false);
                }
            }
            /* Vids */

            $html->parse('wall_' . $row['section'], false);

            if ($oneOnly !== false) {
                $html->setblockvar('wall_ico_post', '');
                $preloadCount = 0;
            } else {
                $html->parse('wall_ico_post', false);
                $preloadCount = self::getCommentsPreloadCount();
            }
            #if ($row['section'] != 'friends') {
            Wall::parseLikes($html, $id, $rowSource['likes']);
            Wall::parseComments($html, $id, 1, 0, $preloadCount, 0, '', $row);
            #}

            $html->setvar('real_wall_id', $row['real_wall_id']);

            if($isShareAvailableInTemplate) {
                if(self::isShareAble($row, $rowSource)) {
                    self::parseShareModule($html, $row, $rowSource);
                } else {
                    $html->setvar('wall_item_class_shared', '');
                }
            }

            $html->setvar('wall_last_action_like', $rowSource['last_action_like']);
            $html->setvar('wall_last_action_comment', $rowSource['last_action_comment']);

            $countComments = self::getCountComments($rowSource);
            if ($tmplWallType == 'edge') {
                $sourceSection = '';
                if (($rowSource['section'] == 'photo' && $rowSource['item_id']) || $rowSource['section'] == 'vids') {
                    $sourceSection = $rowSource['section'];
                }
                $html->setvar('wall_item_last_action_comment_like', $row['last_action_comment_like']);
                $html->setvar('wall_item_section', $sourceSection);
                $html->setvar('wall_item_access', $rowSource['access']);
            }
            $html->setvar('wall_comments_count', $countComments);

            if ($html->blockExists('wall_comments_count_title_hide')) {
                $lVar = 'wall_comments_count';
                if ($countComments == 1) {
                    $lVar = 'wall_comments_one_count';
                }
                $html->setvar('wall_comments_count_title', lSetVars($lVar, array('comments_count' => $countComments)));
                $html->subcond(!$countComments, 'wall_comments_count_title_hide');
            }

            if(self::isShareItem()) {
                $imUid = $rowSource['user_id'];
            } else {
                $imUid = $vars['item_user_id'];
            }

            $rowUserInfo = User::getInfoBasic($imUid);
            $rowUserInfo = User::freeAccessApply($rowUserInfo);

            Encounters::parseLikeToMeet($html, $rowUserInfo['user_id'], $rowUserInfo['is_photo_public']);
            User::parseImLink($html, $rowUserInfo['user_id'], $rowUserInfo['type'], $rowUserInfo['gold_days']);

            //Fix for old data for photo item
            if (!isset($vars['no_parse_item'])) {
                $html->parse('wall_items', true);
            }

            $blocksClean = array(
                'wall_' . $row['section'],
                'wall_like',
                'wall_like_user',
                'wall_like_more',
                'wall_item_like',
                'wall_item_comment',
                'song_image',
                'song_no_image',
                'music_photo_item',
                'musician_image',
                'musician_no_image',
                'musician_photo_item',
                'event_member_image',
                'event_member_no_image',
                'event_photo_item',
                'event_comment_image',
                'event_comment_no_image',
                'place_image',
                'place_no_image',
                'places_photo_item',
                'group_image',
                'group_no_image',
                'group_wall_image',
                'group_wall_no_image',
                'group_forum_no_image',
                'group_forum_image',
                'post_short_link',
                'wall_friends_friend',
                'wall_friends_last',
                'wall_friends_friend_photo',
                'wall_module_comment',
                'wall_module_like',
                'wall_module_share',
                'wall_module_access',
                'wall_module_access_public',
                'wall_module_access_friends',
                'wall_module_access_private',
                'wall_pics_image',
                'wall_photo_image',
                'wall_item_delete',
                'wall_comment_delete',
                'wall_load_more_comments',
                'wall_load_more_comments_show',
                'wall_load_more_comments_new',
                'wall_feed_comment_bottom_frm_show',
                'wall_items_info_set',
                'wall_shared_item_start',
                'wall_shared_item_end',
                'wall_song_about',
                'wall_album_desc',
                'wall_item_im',
                'wall_like_to_meet',
                'wall_interests_item',
                'wall_item_block_action',
                'wall_item_name',
                'wall_item_title',
                'wall_vids_comments',
                'wall_vids_image',
                'comments_reply_list',
                'comments_reply_item'
            );

            if($photoSection) {
                $blocksClean[] = $photoSection;
            }

            foreach ($blocksClean as $block) {
                $html->setblockvar($block, '');
            }

            $parsed = true;
        }

        $html->setvar('wall_first_post_id', $firstPostId);
        $html->setvar('wall_last_post_id', $id);

        //echo "{$lastItemOnWall} :: {$rowSource['id']}";

        $cmd = get_param('cmd', '');

        if($cmd == 'items_old') {
            if($parsed && $rowSource['id'] <= $lastItemOnWall) {
                $html->parse('no_more_items');
            }
            if(!$parsed) {
                $html->parse('no_more_items');
                $html->parse('wall_items_script');
            }
        } elseif($cmd != 'item') {
            if(!$parsed && $paramId === false) {
                CWallPage::$noItems = true;
                $html->parse('no_more_items');
                $html->parse('wall_items_script');
            }
        }

        if($parsed) {
            if($oneOnly === false && $newOnly === false) {
                $html->parse('wall_items_script_last_post_id');
            }
            if($paramId === false && $rowSource['id'] <= $lastItemOnWall) {
                if($cmd != 'item') {
                    $html->parse('no_more_items');
                }
            }
            $html->parse('wall_items_script');
        }

        if($parsed || ($newOnly === false) ) {
            $html->parse('wall_items_script_actions');
        }



    }

    static function cleanTags($text)
    {
        $pattern = '/{(.*)}/';
        $text = preg_replace($pattern, '', $text);
        return $text;
    }

    static function addLike($id, $uid = false)
    {
        if($uid === false) {
            $uid = guid();
        }

        $sql = 'INSERT IGNORE INTO wall_likes
            SET user_id = ' . to_sql($uid, 'Number') . ',
                wall_item_id = ' . to_sql($id, 'Number') . ',
                date = ' . to_sql(self::currentDateTime(), 'Text');
        DB::execute($sql);

        self::updateItem($id, true);

        $sql = 'SELECT COUNT(*) FROM wall_likes
                    WHERE wall_item_id = ' . to_sql($id, 'Number');
        $likes = DB::result($sql);

        self::sendAlert('like', $id, $uid);

        return $likes;
    }

    static function removeLike($id, $uid = false)
    {
        if($uid === false) {
            $uid = guid();
        }
        $sql = 'DELETE FROM wall_likes
            WHERE wall_item_id = ' . to_sql($id, 'Number') . '
                AND user_id = ' . to_sql($uid, 'Number');
        DB::execute($sql);

        self::updateItem($id, true);
    }

    static function countLikes($id)
    {
        $sql = 'SELECT likes FROM wall
            WHERE id = ' . to_sql($id, 'Number');
        return DB::result($sql);
    }

    static function updateLikeComment()
    {
        $uid = guid();
        $id = get_param_int('id');
        $cid = get_param_int('cid');
        $parentId = get_param_int('parent_id');
        $like = get_param_int('like');

        $date = self::currentDateTime();
        if ($like) {
            $commentUid = DB::field('wall_comments', 'user_id', '`id` = ' . to_sql($cid) . ' AND `wall_item_id` = ' . to_sql($id));
            if (!isset($commentUid[0])) {
                return false;
            }
            $commentUid = $commentUid[0];

            $isNew = intval($commentUid != $uid);

            $postUserId = DB::result('SELECT `user_id` FROM `wall` WHERE `id` = ' . to_sql($id));

            $sql = 'INSERT IGNORE INTO `wall_comments_likes`
                       SET `user_id` = ' . to_sql($uid) . ',
                           `cid` = ' . to_sql($cid) . ',
                           `parent_id` = ' . to_sql($parentId) . ',
                           `date` = ' . to_sql($date) . ',
                           `is_new` = ' . to_sql($isNew) . ',
                           `comment_user_id` = ' . to_sql($commentUid) . ',
                           `wall_item_user_id` = ' . to_sql($postUserId) . ',
                           `wall_item_id` = ' . to_sql($id);
            DB::execute($sql);
            $isNewLikes = 1;
        } else {
            $where = '`user_id` = '  . to_sql($uid) .
                ' AND `cid` = '   . to_sql($cid) .
                ' AND `wall_item_id` = '   . to_sql($id);
            DB::delete('wall_comments_likes', $where);
            $sql = 'SELECT COUNT(id)
                      FROM `wall_comments_likes`
                     WHERE `cid` = ' . to_sql($cid)
                 . ' LIMIT 1';
            $isNewLikes = DB::result($sql);
        }


        $countLikes = DB::count('wall_comments_likes', '`cid` = ' . to_sql($cid));
        $data = array('likes' => $countLikes,
                      'last_action_like' => $date,
                      'is_new_like' => $isNewLikes);
        DB::update('wall_comments', $data, '`id` = ' . to_sql($cid));

        DB::update('wall', array('last_action_comment_like' => $date), '`id` = ' . to_sql($id));

        //self::sendAlert('like', $id, $uid);

        return array('likes' => $countLikes, 'date' => $date, 'likes_users' => User::getTitleLikeUsersComment($cid, $countLikes, 'wall'));
    }


    static function getAllLikesCommentsFromUser($id, $parentId = 0)
    {
        $uid = guid();
        $where = '`user_id` = ' . to_sql($uid) . ' AND `wall_item_id` = ' . to_sql($id);
        if ($parentId) {
            $where .= ' AND `parent_id` = ' . to_sql($parentId);
        }
        $commentsLikes = DB::field('wall_comments_likes', 'cid', $where);
        return array_flip($commentsLikes);
    }

    static function addComment($id, $uid = false)
    {
        if($uid === false) {
            $uid = guid();
        }

        $cid = 0;

        $comment = trim(strip_tags(get_param('comment')));

        if($comment != '') {
            $comment = Common::newLinesLimit($comment, 2);

            #if(strstr($comment, "\n")) {
            #    $comment = "\n" . $comment;
            #}

            $comment = "\n" . $comment;

            $comment = OutsideImages::filter_to_db($comment);

            $comment = VideoHosts::textUrlToVideoCode($comment);
            $send = get_param('send');
            $parentId = get_param_int('reply_id');
            $postUserId = DB::result('SELECT `user_id` FROM `wall` WHERE `id` = ' . to_sql($id));

            $commentUserId = 0;
            if ($parentId) {
                $sql = "SELECT `user_id` FROM `wall_comments` WHERE `id` = " . to_sql($parentId);
                $commentUserId = DB::result($sql);
                $isNew = intval($commentUserId != $uid);
            } else {
                $isNew = intval($postUserId != $uid);
            }

            $sql = 'INSERT INTO wall_comments
                SET wall_item_id = ' . to_sql($id, 'Number') . ',
                    wall_item_user_id = ' . to_sql($postUserId, 'Number') . ',
                    is_new = ' . to_sql($isNew, 'Number') . ',
                    user_id = ' . to_sql($uid, 'Number') . ',
                    date = ' . to_sql(self::currentDateTime(), 'Text') . ',
                    comment = ' . to_sql($comment, 'Text') . ',
                    parent_user_id = ' . to_sql($commentUserId) . ',
                    parent_id = ' . to_sql($parentId) . ',
                    send = ' . to_sql($send);
            DB::execute($sql);

            $cid = DB::insert_id();

            if ($parentId) {
                self::updateCountCommentReplies($parentId);
            }

            $sql = 'SELECT `user_id` FROM `wall` WHERE `id` = ' . to_sql($id, 'Number');
            $fr_id = DB::result($sql);
            User::updateActivity($fr_id);

            self::updateItem($id, false, true);
            #self::add_stats('comments');
            self::sendAlert('comment', $id, $uid);
        }

        return $cid;
    }

    static function updateCountCommentReplies($cid)
    {
        $sql = 'SELECT COUNT(*)
                  FROM `wall_comments`
                 WHERE `parent_id` = ' . to_sql($cid);
        $countCommentsReplies = DB::result($sql);
        $sql = 'UPDATE `wall_comments` SET
                `replies` = ' . $countCommentsReplies . '
                WHERE `id` = ' . to_sql($cid);
        DB::execute($sql);
    }

    static function removeImages($section, $item, $params, $uid, $table, $fieldId, $fieldDate = 'created_at')
    {
        $sql = 'SELECT COUNT(*) FROM ' . to_sql($table, 'Plain') . '
            WHERE ' . to_sql($fieldDate, 'Plain') . ' = ' . to_sql($params, 'Text') . '
                AND ' . to_sql($fieldId, 'Plain') . ' = ' . to_sql($item, 'Number');
        $count = DB::result($sql, 0, self::getDbIndex());
        if($count == 0) {
            self::removeByParams($section, $item, $params, $uid);
        }
    }

    static function getItemUid($id)
    {
        $sql = 'SELECT user_id, comment_user_id FROM wall
            WHERE id = ' . to_sql($id, 'Number');
        return DB::row($sql);
    }

    static function commentInfo($id, $index = 0)
    {
        $sql = 'SELECT c.*, c.user_id AS comment_user_id,
            w.user_id AS wall_user_id
            FROM wall_comments AS c
            JOIN wall AS w ON w.id = c.wall_item_id
            WHERE c.id = ' . to_sql($id, 'Number');
        return DB::row($sql, $index);
    }

    static function removeComment($id, $checkOwner = true)
    {
        $sql = 'SELECT wall_item_id
                  FROM wall_comments
                 WHERE id = ' . to_sql($id, 'Number');
        $wid = DB::result($sql, 0, self::getDbIndex());

        $where = '';
        if($checkOwner) {
            $where = ' AND (c.user_id = ' . to_sql(guid(), 'Number') . '
                            OR (SELECT user_id FROM wall AS w
                                 WHERE w.id = c.wall_item_id) = ' . to_sql(guid(), 'Number') . '
                                )';
        }

        $whereComments = '(c.id = ' . to_sql($id, 'Number') . ' OR c.parent_id = ' . to_sql($id, 'Number') . ')';
        $sql = 'SELECT c.*
                  FROM wall_comments AS c
                 WHERE ' . $whereComments . $where;
        DB::query($sql, self::getDbIndex());

        $commentParentId = 0;
        while($row = DB::fetch_row(self::getDbIndex())) {
            OutsideImages::on_delete($row['comment']);
            $commentParentId = $row['parent_id'];
            DB::delete('wall_comments_likes', '`cid` = ' . to_sql($row['id']));
            if(!$commentParentId) {
                DB::delete('wall_comments_likes', '`parent_id` = ' . to_sql($row['id']));
            }
        }

        if($commentParentId) {
            DB::delete('wall_comments_likes', '`parent_id` = ' . to_sql($commentParentId));
        }

        // delete comments
        $sql = 'DELETE c.*
                  FROM wall_comments AS c
                 WHERE ' . $whereComments . $where;
        DB::execute($sql);

        $sql = 'DELETE FROM wall_comments_viewed
            WHERE item_id = ' . to_sql($wid) . '
                AND id = ' . to_sql($id);
        DB::execute($sql);

        $parentId = get_param_int('cid_parent', $commentParentId);
        if ($parentId) {
            self::updateCountCommentReplies($parentId);
        }

        self::updateItem($wid, false, true);
    }

    static function isItemExists($id)
    {
        $isExists = true;

        $sql = 'SELECT id FROM wall
            WHERE id = ' . to_sql($id, 'Number');
        if(DB::result($sql, self::getDbIndex()) != $id) {
            $isExists = false;
        }

        return $isExists;
    }

    static function isItemExistsComment($cid)
    {
        $isExists = true;

        $sql = 'SELECT `id` FROM wall_comments
                 WHERE `id` = ' . to_sql($cid);
        if(DB::result($sql, self::getDbIndex()) != $cid) {
            $isExists = false;
        }

        return $isExists;
    }

    static function updateItem($id, $likes = false, $comments = false, $shares = false)
    {
        if($likes !== false) {
            $likes = '(SELECT COUNT(*) FROM wall_likes AS l
                WHERE l.wall_item_id = w.id)';
            $likeLastAction = to_sql(date('Y-m-d H:i:s'), 'Text');
        } else {
            $likes = 'likes';
            $likeLastAction = 'last_action_like';
        }

        if($comments !== false) {
            $comments = '(SELECT COUNT(*) FROM wall_comments AS c
                           WHERE c.wall_item_id = w.id)';
            $commentsItem = '(SELECT COUNT(*) FROM wall_comments AS c
                               WHERE c.wall_item_id = w.id AND c.parent_id = 0)';
            $commentLastAction = to_sql(date('Y-m-d H:i:s'), 'Text');
        } else {
            $comments = 'comments';
            $commentsItem = 'comments_item';
            $commentLastAction = 'last_action_comment';
        }

        if($shares !== false) {
            $sharesLastAction = to_sql(date('Y-m-d H:i:s'), 'Text');
            $sharesCount = to_sql(DB::count('wall', '`section` = "share" AND `item_id` = ' . to_sql($id)));
        } else {
            $sharesLastAction = 'last_action_shares';
            $sharesCount = 'shares_count';
        }


        $sql = 'UPDATE wall AS w SET
                 likes = ' . $likes . ',
                 comments = ' . $comments . ',
                 comments_item = ' . $commentsItem . ',
                 last_action_like = ' . $likeLastAction . ',
                 last_action_comment = ' . $commentLastAction . ',
                 shares_count = ' . $sharesCount . ',
                 last_action_shares = ' . $sharesLastAction . '
                 WHERE id = ' . to_sql($id);
        DB::execute($sql);
    }

    static function getItemWallOneMedia($id, $section = 'photo')
    {
        $sql = 'SELECT `id` FROM `wall` WHERE `item_id` = ' . to_sql($id) . ' AND `section` = ' . to_sql($section);
        return DB::result($sql);
    }


    static function updateCountCommentsCustomItem($id, $type = 'photo')
    {
        $wallId = self::getItemWallOneMedia($id, $type);
        if (!$wallId) {
            return;
        }
        if ($type == 'photo') {
            $count = DB::count('photo_comments', '`photo_id` = ' . to_sql($id) . ' AND `system` = 0 AND `parent_id` = 0');
        } elseif ($type == 'vids') {
            $count = DB::count('vids_comment', '`video_id` = ' . to_sql($id) . ' AND `parent_id` = 0');
        }
        $data = array('comments_item' => $count,
                      'last_action_comment' => date('Y-m-d H:i:s')
                );
        DB::update('wall', $data, '`id` = ' . to_sql($wallId));
    }

    static function isActive()
    {
        return Common::isWallActive();
    }

    static function isProfileWall($display)
    {
        if (Common::getOptionTemplate('wall_type') == 'edge') {
            return false;
        }

        $wall = false;

        if(Common::getOption('home_page_mode') == 'social' && $display == 'profile') {
            $wall = true;
        }

        if(Common::getOption('home_page_mode') != 'dating' && $display == 'wall') {
            $wall = true;
        }

        if(!self::isActive()) {
            $wall = false;
        }

        return $wall;
    }

    // check if this alert type is active in profile settings
    // and active in site settings too

    static function sendAlert($type, $item, $senderId, $dbIndex = DB_MAX_INDEX)
    {
        $alertType = 'wall_alert_' . $type;

        if(!Common::isOptionActive('wall_like_comment_alert')) {
            return;
        }

        $receiverInfo = self::getItemUid($item);
        $itemUrl = str_replace('/' . MOBILE_VERSION_DIR . '/', '/', Common::urlSite()) . 'wall.php?uid=' . $receiverInfo['user_id'] . '&item=' . $item;

        $sender = User::getInfoBasic($senderId, false, $dbIndex);

        if($receiverInfo['user_id']) {
            $rid = $receiverInfo['user_id'];
            self::sendAlertMail($alertType, $sender, $rid, $itemUrl, $dbIndex, $receiverInfo['user_id'], $item);
        }
        if($receiverInfo['comment_user_id'] && $receiverInfo['comment_user_id'] != $receiverInfo['user_id']) {
            $rid = $receiverInfo['comment_user_id'];
            self::sendAlertMail($alertType, $sender, $rid, $itemUrl, $dbIndex, $receiverInfo['user_id'], $item);
        }
    }

    static function sendAlertMail($alertType, $sender, $receiverUid, $itemUrl, $dbIndex, $uid = '', $item = '')
    {
        if (!Common::isEnabledAutoMail($alertType)) {
            return;
        }

        if($receiverUid == $sender['user_id'] || $receiverUid == 0) {
            return;
        }

        $receiver = User::getInfoBasic($receiverUid, false, $dbIndex);
        if(isset($receiver['wall_like_comment_alert']) && $receiver['wall_like_comment_alert'] == 2) {
            return;
        }

        $vars = array(
            'title' => Common::getOption('title', 'main'),
            'name' => $receiver['name'],
            'name_sender' => $sender['name'],
            'item_link' => $itemUrl,
            'uid' => $uid,
            'item' => $item
        );
        Common::sendAutomail($receiver['lang'], $receiver['mail'], $alertType, $vars);
    }

    static function addItemForUser($itemId, $section, $uid = false, $date = false)
    {
        if($uid === false) {
            $uid = guid();
        }
        if($date === false) {
            $date = 'NOW()';
        } else {
            $date = to_sql($date, 'Text');
        }
        if($uid) {
            $sql = 'INSERT IGNORE INTO wall_items_for_user
                SET user_id = ' . to_sql($uid, 'Number') . ',
                    item_id = ' . to_sql($itemId, 'Number') . ',
                    section = ' . to_sql($section, 'Text') . ',
                    created_at = ' . $date;
            DB::execute($sql);
        }
    }

    static function deleteItemForUserByUid($uid)
    {
        $sql = 'DELETE FROM ' . self::getTableWallItemsForUser() . '
            WHERE user_id = ' . to_sql($uid, 'Number');
        DB::execute($sql);
    }

    static function deleteItemForUserByItemOnly($item, $section)
    {
        $sql = 'DELETE FROM ' . self::getTableWallItemsForUser() . '
            WHERE item_id = ' . to_sql($item, 'Number') . '
                AND section = ' . to_sql($section, 'Text');
        DB::execute($sql);
    }

    static function deleteItemForUserByItem($item, $section, $uid)
    {
        $delete = true;

        $method = 'deleteItemForUser' . ucfirst($section);

        if(method_exists('Wall', $method)) {
            $delete = self::$method($item, $uid);
        }

        if($delete) {
            $sql = 'DELETE FROM ' . self::getTableWallItemsForUser() . '
                WHERE item_id = ' . to_sql($item, 'Number') . '
                    AND section = ' . to_sql($section, 'Text') . '
                    AND user_id = ' . to_sql($uid, 'Number');
            DB::execute($sql);
        }
    }

    static function deleteItemForUserVids($item, $uid, $dbIndex = DB_MAX_INDEX)
    {
        // no comments
        // no rating
        $sql = 'SELECT video_id FROM vids_rate
            WHERE video_id = ' . to_sql($item, 'Number') . '
                AND user_id = ' . to_sql($uid, 'Number');
        $rated = DB::result($sql, 0, $dbIndex);

        #echo $sql;
        #var_dump($rated);

        if($rated) {
            return false;
        }

        $sql = 'SELECT COUNT(*) FROM vids_comment
            WHERE video_id = ' . to_sql($item, 'Number') . '
                AND user_id = ' . to_sql($uid, 'Number');
        $count = DB::result($sql, 0, $dbIndex);

        return $count;
    }

    static function deleteItemForUserEvent($item, $uid, $dbIndex = DB_MAX_INDEX)
    {
        // owner
        // comment
        // subcomment
        // photo
        // member

        $sql = 'SELECT user_id FROM events_event
            WHERE event_id = ' . to_sql($item, 'Number');
        $eventUid = DB::result($sql, 0, $dbIndex);

        if($eventUid == $uid) {
            return false;
        }

        $sql = 'SELECT guest_id FROM events_event_guest
            WHERE event_id = ' . to_sql($item, 'Number') . '
                AND user_id = ' . to_sql($uid, 'Number');
        $guest = DB::result($sql, 0, $dbIndex);

        if($guest) {
            return false;
        }

        $sql = 'SELECT COUNT(*) FROM events_event_image
            WHERE event_id = ' . to_sql($item, 'Number') . '
                AND user_id = ' . to_sql($uid, 'Number');
        $images = DB::result($sql, 0, $dbIndex);

        if($images) {
            return false;
        }

        $sql = 'SELECT COUNT(*) FROM events_event_comment
            WHERE event_id = ' . to_sql($item, 'Number') . '
                AND user_id = ' . to_sql($uid, 'Number');
        $comments = DB::result($sql, 0, $dbIndex);

        if($comments) {
            return false;
        }

        $sql = 'SELECT COUNT(*) FROM events_event_comment_comment AS cc
            JOIN events_event_comment AS c ON c.comment_id = cc.parent_comment_id
            WHERE c.event_id = ' . to_sql($item, 'Number') . '
                AND cc.user_id = ' . to_sql($uid, 'Number');
        $subComments = DB::result($sql, 0, $dbIndex);

        if($subComments) {
            return false;
        }

        return true;
    }

    static function deleteItemForUserForum($item, $uid, $dbIndex = DB_MAX_INDEX)
    {
        // comments
        // thread
        $sql = 'SELECT id FROM forum_topic
            WHERE id = ' . to_sql($item, 'Number') . '
                AND user_id = ' . to_sql($uid, 'Number');
        $topicUid = DB::result($sql, 0, $dbIndex);

        if($topicUid) {
            return false;
        }

        $sql = 'SELECT COUNT(*) FROM forum_message
            WHERE topic_id = ' . to_sql($item, 'Number') . '
                AND user_id = ' . to_sql($uid, 'Number');
        $count = DB::result($sql, 0, $dbIndex);

        if($count) {
            return false;
        }

        return true;
    }

    static function deleteItemForUserBlog($item, $uid, $dbIndex = DB_MAX_INDEX)
    {
        // comment
        // owner
        $sql = 'SELECT id FROM blogs_post
            WHERE id = ' . to_sql($item, 'Number') . '
                AND user_id = ' . to_sql($uid, 'Number');
        $isOwner = DB::result($sql, 0, $dbIndex);

        if($isOwner) {
            return false;
        }

        $sql = 'SELECT COUNT(*) FROM blogs_comment
            WHERE post_id = ' . to_sql($item, 'Number') . '
                AND user_id = ' . to_sql($uid, 'Number');
        $count = DB::result($sql, 0, $dbIndex);

        if($count) {
            return false;
        }

        return true;
    }

    static function deleteItemForUserPlaces($item, $uid, $dbIndex = DB_MAX_INDEX)
    {
        $sql = 'SELECT id FROM places_place
            WHERE id = ' . to_sql($item, 'Number') . '
                AND user_id = ' . to_sql($uid, 'Number');
        $isOwner = DB::result($sql, 0, $dbIndex);

        if($isOwner) {
            return false;
        }

        // rating
        $sql = 'SELECT COUNT(*) FROM places_place_vote
            WHERE place_id = ' . to_sql($item, 'Number') . '
                AND user_id = ' . to_sql($uid, 'Number');
        $count = DB::result($sql, 0, $dbIndex);

        if($count) {
            return false;
        }

        // review
        $sql = 'SELECT COUNT(*) FROM places_review
            WHERE place_id = ' . to_sql($item, 'Number') . '
                AND user_id = ' . to_sql($uid, 'Number');
        $count = DB::result($sql, 0, $dbIndex);

        if($count) {
            return false;
        }

        // photo
        $sql = 'SELECT COUNT(*) FROM places_place_image
            WHERE place_id = ' . to_sql($item, 'Number') . '
                AND user_id = ' . to_sql($uid, 'Number');
        $count = DB::result($sql, 0, $dbIndex);

        if($count) {
            return false;
        }

        return true;
    }

    static function deleteItemForUserMusician($item, $uid, $dbIndex = DB_MAX_INDEX)
    {
        $sql = 'SELECT musician_id FROM music_musician
            WHERE musician_id = ' . to_sql($item, 'Number') . '
                AND user_id = ' . to_sql($uid, 'Number');
        $isOwner = DB::result($sql, 0, $dbIndex);

        if($isOwner) {
            return false;
        }

        // comment
        $sql = 'SELECT COUNT(*) FROM music_musician_comment
            WHERE musician_id = ' . to_sql($item, 'Number') . '
                AND user_id = ' . to_sql($uid, 'Number');
        $count = DB::result($sql, 0, $dbIndex);

        if($count) {
            return false;
        }

        // photo
        $sql = 'SELECT COUNT(*) FROM music_musician_image
            WHERE musician_id = ' . to_sql($item, 'Number') . '
                AND user_id = ' . to_sql($uid, 'Number');
        $count = DB::result($sql, 0, $dbIndex);

        if($count) {
            return false;
        }

        return true;
    }

    static function deleteItemForUserMusic($item, $uid, $dbIndex = DB_MAX_INDEX)
    {
        $sql = 'SELECT song_id FROM music_song
            WHERE song_id = ' . to_sql($item, 'Number') . '
                AND user_id = ' . to_sql($uid, 'Number');
        $isOwner = DB::result($sql, 0, $dbIndex);

        if($isOwner) {
            return false;
        }

        // rating
        $sql = 'SELECT COUNT(*) FROM music_song_vote
            WHERE song_id = ' . to_sql($item, 'Number') . '
                AND user_id = ' . to_sql($uid, 'Number');
        $count = DB::result($sql, 0, $dbIndex);

        if($count) {
            return false;
        }

        // comment
        $sql = 'SELECT COUNT(*) FROM music_song_comment
            WHERE song_id = ' . to_sql($item, 'Number') . '
                AND user_id = ' . to_sql($uid, 'Number');
        $count = DB::result($sql, 0, $dbIndex);

        if($count) {
            return false;
        }

        // photo
        $sql = 'SELECT COUNT(*) FROM music_song_image
            WHERE song_id = ' . to_sql($item, 'Number') . '
                AND user_id = ' . to_sql($uid, 'Number');
        $count = DB::result($sql, 0, $dbIndex);

        if($count) {
            return false;
        }

        return true;
    }

    static function deleteItemForUserPics($item, $uid, $dbIndex = DB_MAX_INDEX)
    {
        $sql = 'SELECT user_id FROM gallery_images
            WHERE id = ' . to_sql($item, 'Number') . '
                AND user_id = ' . to_sql($uid, 'Number');
        $isOwner = DB::result($sql, 0, $dbIndex);

        if($isOwner) {
            return false;
        }

        // comment
        $sql = 'SELECT COUNT(*) FROM gallery_comments
            WHERE imageid = ' . to_sql($item, 'Number') . '
                AND user_id = ' . to_sql($uid, 'Number');
        $count = DB::result($sql, 0, $dbIndex);

        if($count) {
            return false;
        }

        return true;
    }

    static function isShared($item, $dbIndex = DB_MAX_INDEX)
    {
        $sql = 'SELECT id FROM wall
            WHERE item_id = ' . to_sql($item, 'Number') . '
                AND user_id = ' . to_sql(guid(), 'Number'). '
                AND section = "share"';

        $sql = 'SELECT id FROM wall
            WHERE (item_id = ' . to_sql($item, 'Number') . '
                AND user_id = ' . to_sql(guid(), 'Number'). '
                AND section = "share") OR (id = ' . to_sql($item, 'Number') . '
                AND user_id = ' . to_sql(guid(), 'Number'). '
                AND section != "share")';


        return DB::result($sql, 0, $dbIndex);
    }

    static function calcMaxImageWidth($file, $limit = false)
    {
        $width = self::calcImageWidth($file, $limit);
        if ($width > self::$maxMediaWidth) {
            self::$maxMediaWidth = $width;
        }
    }

    static function calcImageWidth($file, $limit = false, $width = 0)
    {
        if($width || file_exists($file)) {
            if(!$width) {
                $imageSize = getimagesize($file);
                $width = $imageSize[0];
            }
            $widthLimit = self::EMBED_VIDEO_WIDTH;

            if(Common::isMobile()) {
                $widthLimit = self::IMAGE_WIDTH_MOBILE;
            }

            if($limit) {
                $widthLimit = $limit;
            }

            if($width > $widthLimit) {
                $width = $widthLimit;
            }
        }
        return $width;
    }

    static function isShareAble($row, $rowSource)
    {
        $sectionsNoShare = array(
            '3dcity',
            'friends',
            'field_status',
            'group_join',
            'photo_default',
            'pics_comment',
            'photo_comment',
        );

        $isShareAble = true;
        $isParse = false;
        if (self::$typeWall != 'edge') {
            $isParse = $rowSource['user_id'] == guid() || $row['user_id'] == guid() || $row['comment_user_id'] == guid();
        }
        if ($isParse || in_array($row['section'], $sectionsNoShare)) {
            $isShareAble = false;
        }
        if ($rowSource['section'] == 'share') {
            $isShareAble = true;
        }

        return $isShareAble;
    }

    static function parseShareModule(&$html, $row, $rowSource)
    {
        $showShareModule = true;
        $checkItemId = $rowSource['item_id'];
        if($rowSource['section'] != 'share') {
            $checkItemId = $row['id'];
        }

        if (self::$typeWall == 'edge') {
            $guid = guid();
            $html->setvar('wall_module_share_user_id', $guid);
            if ($rowSource['section'] == 'share') {
                $html->setvar('wall_item_shared_id', $checkItemId);
                $html->setvar('wall_item_shares_count', 0);
                $html->setvar('wall_last_action_shares', '');
                $html->clean('wall_module_share_count');
                return;
            }
            $html->setvar('wall_item_shared_id', '');

            $noParseModuleShare = $rowSource['user_id'] == $guid || $row['user_id'] == $guid
                                  || $row['comment_user_id'] == $guid || $row['params'] == 'item_birthday';
            if ($noParseModuleShare) {
                $html->clean('wall_module_share');
                if ($row['comment_user_id'] == $guid || $row['comment_user_id'] == 0) {
                    $html->parse('wall_module_access_' . $row['access'], false);
                    $html->parse('wall_module_access', false);
                }
            } else {
                $moduleClass = 'share';
                $moduleTitle = l('share');
                if (self::isShared($checkItemId)) {
                    //echo $row['id'] . '';
                    $moduleClass = 'unshare';
                    $moduleTitle = l('unshare');
                }
                $html->setvar('wall_module_share_class', $moduleClass);
                $html->setvar('wall_module_share_title', $moduleTitle);
                $html->parse('wall_module_share', false);
                $html->clean('wall_module_access', false);
            }

            $html->setvar('wall_item_shares_url_page', Common::getOption('url_main', 'path') . Common::pageUrl('wall_shared', null, $checkItemId));
            $html->setvar('wall_item_shares_count', intval($row['shares_count']));
            $html->setvar('wall_last_action_shares', $row['last_action_shares']);
            $html->setvar('wall_shares_count_title', lSetVars('wall_shares_count', array('shares_count' => $row['shares_count'])));
            $html->subcond(!$row['shares_count'], 'wall_item_shares_count_hide');
            $html->parse('wall_module_share_count', false);

            return;
        }

        if(guid() != 0 && self::isShared($checkItemId)) {
            $showShareModule = false;
        }

        // it it is my item - not share
        if($showShareModule) {
            $classModuleShareHide = '';
            $classModuleUnshareHide = 'hide';
        } else {
            $classModuleShareHide = 'hide';
            $classModuleUnshareHide = '';
        }

        $classModuleUnshareHide = 'hide';

        $html->setvar('class_module_share_hide', $classModuleShareHide);
        $html->setvar('class_module_unshare_hide', $classModuleUnshareHide);
        if($row['params'] != 'item_birthday') {
            $html->parse('wall_module_share');
        }

        $classWallShared = '';
        if($rowSource['section'] == 'share') {
            $classWallShared = 'wall_shared_' . $checkItemId;
        }

        $html->setvar('wall_item_class_shared', $classWallShared);
    }

    static function displayProfile($uid)
    {
        if(Wall::getUid() == $uid) {
            $display = User::displayProfile();
        } else {
            $display = 'profile';//User::displayWall();
        }

        return $display;
    }

    static function ajaxPage()
    {
        global $g;

        $cmd = get_param('cmd');

        //$dir = Common::getOption('tmpl_loaded_dir', 'tmpl');
        //$pageTemplate = $dir . 'wall_ajax.html';
        $pageTemplate = getPageCustomTemplate('wall_ajax.html', 'wall_ajax');
        if ($cmd == 'items_old' || $cmd == 'update' || $cmd == 'item') {
            //$pageTemplate = '_wall_items.html';
            $pageTemplate = getPageCustomTemplate('_wall_items.html', 'wall_items');
        }
        if ($cmd == 'comments_load' && Common::getOptionTemplate('wall_load_comments')) {
            $pageTemplate = getPageCustomTemplate('wall_ajax.html', 'wall_load_comments');
        }


        // \_include\current\common.php 983
        $page = new CWallAjax('', $pageTemplate);

        if ($cmd == 'update') {
            $pageTemplate = getPageCustomTemplate('wall_ajax.html', 'wall_ajax');
            $module = new CWallAjaxUpdate('wall_ajax', $pageTemplate);//Common::getOption('tmpl_loaded_dir', 'tmpl') . 'wall_ajax.html'
            $module->isWallAjaxUpdateInstance = true;
            $page->add($module);
        }

        return $page;
    }

    static function UpdateAccessPics($id, $access = 'public')
    {
        global $g_user;

        $sql = "SELECT `id`
                  FROM `gallery_images`
                 WHERE `albumid` = " . to_sql($id, 'Number')
               . " AND `user_id` = " . to_sql($g_user['user_id'], 'Number');
        $sqlImage = implode(',', array_map(function($a) {return $a[0];}, DB::rows($sql)));

        $sqlFriends = '';

        if ($access == 'friends') {
           $sql = "UPDATE `wall`
                      SET `access` = 'private'
                    WHERE `section` = 'pics_comment'
                      AND `site_section_item_id` IN (" . $sqlImage . ")";
           DB::execute($sql);
           $sqlFriends = ' AND `user_id` IN (' . User::friendsList(guid(), true) . ')';
        }

        $sql = "UPDATE `wall`
                   SET `access` = " . to_sql($access, 'Text') . "
                 WHERE (     `section` = 'pics'
                         AND `item_id` = " . to_sql($id, 'Number') . ")
                    OR (     `section` = 'pics_comment'
                         AND `site_section_item_id` IN (" . $sqlImage . ")
                          " . $sqlFriends . ")";
		DB::execute($sql);
    }

    static function UpdateAccessPhoto($id, $access = 'public')
    {
        $sql = 'SELECT `user_id`
                  FROM `photo`
                 WHERE `photo_id` = ' . to_sql($id, 'Number') .
                 " AND `user_id` = " . to_sql(guid(), 'Number');
        $userId = DB::result($sql);
        if ($userId) {
            $sqlFriends = '';
            if ($access == 'friends') {
                $sql = "UPDATE `wall` SET `access` = 'private'
                         WHERE `section` = 'photo_comment'
                           AND `site_section_item_id` =" . to_sql($id, 'Number');
                DB::execute($sql);
                $sqlFriends = ' AND `user_id` IN (' . User::friendsList(guid(), true) . ')';
            }

            $sql = "UPDATE `wall`
                       SET `access` = " . to_sql($access, 'Text') . "
                     WHERE  (    `section` = 'photo_default'
                             AND `item_id` = " . to_sql($id, 'Number') . ")
                            OR
                            (     `section` = 'photo_comment'
                              AND `site_section_item_id` =" . to_sql($id, 'Number')
                        . $sqlFriends . ")";
            DB::execute($sql);


            $photoItemWall = DB::result('SELECT `wall_id` FROM `photo` WHERE `photo_id` = ' . to_sql($id));
            if ($photoItemWall) {
                $countPhotoToItemWall = DB::count('photo', '`visible` = "Y" AND `private` = "N" AND `wall_id` = ' . to_sql($photoItemWall));
                $access = 'friends';
                if ($countPhotoToItemWall) {
                    $access = 'public';
                }
                $sql = "UPDATE `wall` SET `access` = " . to_sql($access) . "
                         WHERE `section` = 'photo'
                           AND `id` =" . to_sql($photoItemWall, 'Number');
                DB::execute($sql);
            }
        }
    }

    static function updateAccessItemById($id, $section = 'vids', $access = 'public')
    {
        $sql = 'SELECT `id`
                  FROM `wall`
                 WHERE `item_id` = ' . to_sql($id, 'Number') .
                 " AND `section` = " . to_sql($section);
                 " AND `user_id` = " . to_sql(guid(), 'Number');
        $wallId = DB::result($sql);
        if ($wallId) {
            $sql = "UPDATE `wall` SET `access` = " . to_sql($access) .
                   " WHERE `id` =" . to_sql($wallId, 'Number');
            DB::execute($sql);
        }
    }

    static function isOnlySeeFriends($uid, $isOnlyFriendsWallPosts = null)
    {
        if ($isOnlyFriendsWallPosts === null) {
            $isOnlyFriendsWallPosts = Common::isOptionActive('only_friends_wall_posts');
        }
        if ($isOnlyFriendsWallPosts) {
            if ($uid == guid() || User::isFriend ($uid, guid())) {
                return true;
            } else {
                return false;
            }
        } else {
            return true;
        }

    }

    static function isOnlyPostFriends($uid, $isOnlyFriendsWallPosts = null, $useCache = true)
    {
        if ($uid == guid()) {
            return true;
        }

        if (Common::isOptionActiveTemplate('wall_friend_allow_except_posting')) {
            global $p;
            $cmd = get_param('cmd');
            if ($p == 'wall_ajax.php' && $cmd != 'item') {
                return true;
            }
        }

        if ($isOnlyFriendsWallPosts === null) {
            $isOnlyFriendsWallPosts = Common::isOptionActive('only_friends_wall_posts');
        }

        if ($isOnlyFriendsWallPosts && self::isOnlySeeFriends($isOnlyFriendsWallPosts)) {
            return true;
        }

        $wallOnlyPost = User::getInfoBasic($uid, 'wall_only_post');
        if (!$isOnlyFriendsWallPosts
                && (($wallOnlyPost == 1 && ($uid == guid() || User::isFriend($uid, guid(), DB_MAX_INDEX, $useCache)))
                    || $wallOnlyPost == 2)
            ) {
            return true;
        }
        return false;
    }

    static function add_stats($type) {
        global $g_user;
        // Изменён тип поля на date wall_stat.date был varchar поменял date('d.m.Y.') на date('Y-m-d')
        $sql = 'SELECT COUNT(*) FROM wall_stats WHERE user_id=' . to_sql(guid(), 'Nubmer') . '
            AND  date = ' . to_sql(date('Y-m-d'),'Text');
        $result = DB::result($sql);
        if ($result < 1) {

            DB::execute('INSERT INTO wall_stats
            SET user_id = ' . to_sql(guid(), 'Number') . ',
                ' . $type . '=1,
                date = ' . to_sql(date('Y-m-d'),'Text')
            );
        } else {
            DB::execute('UPDATE wall_stats SET  ' . $type . '= ' . $type . '+1
                WHERE user_id = ' . to_sql(guid(), "Nubmer") .
                    'AND date = ' . to_sql(date('Y-m-d'),'Text')
            );
        }
    }

    static function isCommentViewed($wid, $uid)
    {
        $sql = 'SELECT `id`
                  FROM `wall_comments_viewed`
                 WHERE `item_id` = ' . to_sql($wid, 'Number') . '
                   AND `user_id` = ' . to_sql($uid, 'Number') . '
                 LIMIT 1';
        $commentViewed = DB::result($sql);

        if ($commentViewed != 0) {
            $sql = 'SELECT COUNT(`id`)
                      FROM `wall_comments`
                     WHERE `wall_item_id` = ' . to_sql($wid, 'Number') . '
                       AND `user_id` != ' . to_sql($uid, 'Number') . '
                       AND `id` > ' . to_sql($commentViewed, 'Number');
            $isComment = (DB::result($sql) > 0) ? 1 : 0;
        } else {
            $isComment = 0;
        }

        return $isComment;
    }

    static public function filter_to_html($id, $text, $start_tag, $end_tag, $class, $target = '_blank')
    {
        global $g;

        if (mb_strpos($text, '{wall_img}', 0, 'UTF-8') !== false) {
            $file_prefix = $g['path']['url_files'] . 'wall/' . $id;
            $image_orig = $file_prefix . '_orig.jpg';
            $image_th = $file_prefix . '_'  . $thumbnail_postfix . '.jpg';
            $tagHtml = '';
            if (file_exists($image_orig) && file_exists($image_th)) {
                $tagHtml = $start_tag . '<a target="' . $target . '" class="' . $class . '" href="' . $image_orig . '"><img id="outside_img_' . $id . '" src="' . $image_th . '" alt=""/></a>' . $end_tag;
            }
            $text = str_replace('{wall_img}', $tagHtml, $text);
        }

        return $text;
    }

    static private function deleteImage($id, $thumbnail_postfix = "th")
    {
        global $g;
        $file_prefix = $g['path']['dir_files'] . 'wall/' . $id;
        $image_orig = $file_prefix . '_orig.jpg';
        $image_th = $file_prefix . '_'  . $thumbnail_postfix . '.jpg';
        if (file_exists($image_th)) {
            Common::saveFileSize($image_th, false);
            @unlink($image_th);
        }
        if (file_exists($image_orig)) {
            Common::saveFileSize($image_orig, false);
            @unlink($image_orig);
        }
    }

    static public function uploadImage($id, $image_sizes)
    {
        global $g;
        global $g_user;

    	$temp_file = $g['path']['dir_files'] . 'temp/tmp_wall_' . $g_user['user_id'] . '.jpg';
        $failed = false;
        if (file_exists($temp_file))
        {
        	$file_prefix = $g['path']['dir_files'] . 'wall/' . $id;

        	foreach($image_sizes as $image_size)
            {
            	$im = new Image();
	            if ($im->loadImage($temp_file)) {
                    $flag = true;
                    if (!$image_size['allow_smaller'] ||
                        ($im->getWidth() > $image_size['width'] &&
                        $im->getHeight() > $image_size['height']))
                    {
                        if ($flag) {
                            $imWidth = $im->getWidth();
                            if($imWidth > $image_size['width']) {
                                $imWidth = $image_size['width'];
                            }
                            $im->resizeWH($imWidth, $image_size['height']);
                        } else {
                             $im->resizeCroppedMiddle($image_size['width'], $image_size['height']);
                        }
                    } elseif ($im->getWidth() > $image_size['width']) {
                        $im->resizeW($image_size['width']);
                    } elseif ($im->getHeight() > $image_size['height']) {
                        $im->resizeH($image_size['height']);
                    } else {
                    	copy($temp_file, $file_prefix . '_' . $image_size['file_postfix'] . '.jpg');
                        Common::saveFileSize($file_prefix . '_' . $image_size['file_postfix'] . '.jpg');
                    	break;
                    }

	                $im->saveImage($file_prefix . '_' . $image_size['file_postfix'] . '.jpg', $g['image']['quality']);
                    Common::saveFileSize($file_prefix . '_' . $image_size['file_postfix'] . '.jpg');
	            } else {
	                $failed = true;
	                break;
	            }
            }

            if (!$failed) {
	            //original
	            $im = new Image();
	            if ($im->loadImage($temp_file)) {
	                $im->saveImage($file_prefix . '_orig.jpg', $g['image']['quality_orig']);//80
                    Common::saveFileSize($file_prefix . '_orig.jpg');
	            } else {
	            	$failed = true;
	            }
            }
            @unlink($temp_file);
        }
        return $failed;
    }

    static public function getTempFileUploadImage()
    {
        return Common::getOption('dir_files', 'path') . 'temp/tmp_wall_' . guid() . '.jpg';
    }


    static function getCountComments($data)
    {
        $tmplWallType = Common::getOptionTemplate('wall_type');
        $countComments = $data['comments'];
        if ($tmplWallType == 'edge') {
            $countComments = $data['comments_item'];
        }
        return $countComments;
    }

    static function getPrfMediaId($type, $isWall = true)
    {
        if (!$isWall) {
            return '';
        }
        $prfId = '';
        if ($type == 'video' || $type == 'vids') {
            $prfId = '_v';
        } elseif ($type == 'photo') {
            $prfId = '_p';
        }
        return $prfId;
    }

    static function addPrfMediaId($id, $prf)
    {
        if(mb_strpos($id, '_p', 0, 'UTF-8') === false && mb_strpos($id, '_v', 0, 'UTF-8') === false){
            return $id . $prf;
        }
        return $id;
    }

    static function getNumberShowCommentsReplies()
    {
        $optionTemplateName = Common::getTmplName();
        $numberComments = 3;
        $numberCommentsTemplate = Common::getOption('wall_show_comments_replies', "{$optionTemplateName}_wall_settings");
        if ($numberCommentsTemplate !== null) {
            $numberComments = intval($numberCommentsTemplate);
        }
        return $numberComments;
    }

    static function getNumberShowCommentsRepliesLoadMore()
    {
        $optionTemplateName = Common::getTmplName();
        $numberComments = self::getNumberShowCommentsReplies();
        $numberCommentsTemplate = Common::getOption('wall_show_comments_replies_load', "{$optionTemplateName}_wall_settings");
        if ($numberCommentsTemplate !== null) {
            $numberCommentsTemplate = intval($numberCommentsTemplate);
            if (!$numberCommentsTemplate) {
                $numberCommentsTemplate = 1;
            }
            $numberComments = $numberCommentsTemplate;
        }

        return $numberComments;
    }

    static function changeAccessItem()
    {
        $id = get_param_int('id');
        $access = get_param('access', 'public');
        if ($id) {
            $guid = guid();
            $info = self::getItemInfoId($id);
            if ($info) {
                $wallUid = get_param_int('wall_uid');
                if ($info['user_id'] != $guid && $info['comment_user_id'] != $guid) {
                    return false;
                }
                if ($access != 'public') {
                    $sql = 'SELECT * FROM wall
                             WHERE section = "share"
                               AND item_id = ' . to_sql($id, 'Number');
                    $shareItems = DB::rows($sql);
                    foreach ($shareItems as $key => $item) {
                        if ($access == 'private') {
                            //Delete share post
                            self::removeById($item['id']);
                        } else {
                            //If not friends then delete
                            if (!User::isFriend($guid, $item['user_id'])) {
                                self::removeById($item['id']);
                            }
                        }
                    }
                }
                $sql = "UPDATE `wall` SET `access` = " . to_sql($access) .
                       " WHERE `id` =" . to_sql($id, 'Number');
                DB::execute($sql);

                User::update(array('wall_post_access' => $access));
                return true;
            }
        }
        return false;
    }

    static function markReadCommentLikeOne($cid)
    {
        $guid = guid();

        $where = '`is_new` = 1'
               . ' AND `cid` = ' . to_sql($cid)
               . ' AND `comment_user_id` = ' . to_sql($guid);
        DB::update('wall_comments_likes', array('is_new' => 0), $where);

        $where = '`is_new_like` = 1'
               . ' AND `id` = ' . to_sql($cid)
               . ' AND `user_id` = ' . to_sql($guid);
        DB::update('wall_comments', array('is_new_like' => 0), $where);
    }

    static function markReadCommentOne($cid)
    {
        $guid = guid();

        $where = '`is_new` = 1'
               . ' AND `id` = ' . to_sql($cid);
        DB::update('wall_comments', array('is_new' => 0), $where);
    }

    static function markReadCommentAndLikeOne($comment){
        if ($comment['is_new_like']) {
            self::markReadCommentLikeOne($comment['id']);
        }
        if ($comment['is_new']) {
            self::markReadCommentOne($comment['id']);
        }
    }

}