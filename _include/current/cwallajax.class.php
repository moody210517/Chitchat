<?php

/* (C) Websplosion LTD., 2001-2014

  IMPORTANT: This is a commercial software product
  and any kind of using it must agree to the Websplosion's license agreement.
  It can be found at http://www.chameleonsocial.com/license.doc

  This notice may not be removed from the source code. */

class CWallAjax extends CHtmlBlock {

    public $isWallAjaxUpdateInstance = false;

    function parseBlock(&$html)
    {
        $cmd = get_param('cmd');
        $id = get_param('id');
        $uid = get_param('wall_uid', guid());
        $tmplWallType = Common::getOptionTemplate('wall_type');
        $isWallEdge = $tmplWallType == 'edge';
        $guid = guid();
        $section = get_param('section');

        Wall::setUid($uid);

        $this->isAuthOnly($cmd);

        if ($cmd == 'unfriend') {
            $friend_id = get_param('friend_id');
            User::friendDelete($guid, $friend_id);
            die(get_json_encode('ok'));
        }

        if ($cmd == 'like') {
            $this->stopOnNotExists($id);
            $html->setvar('id', $id);
            Wall::parseLikes($html, $id, Wall::addLike($id));
        }

        if ($cmd == 'unlike') {
            $this->stopOnNotExists($id);
            $html->setvar('id', $id);
            Wall::removeLike($id);
            $likes = Wall::countLikes($id);
            if ($likes) {
                Wall::parseLikes($html, $id, $likes);
            }
        }

        if ($cmd == 'like_comment') {
            $this->stopOnNotExists($id);
            $cid = get_param_int('cid');
            if ($section == 'photo' || $section == 'vids') {
                $type = $section == 'vids' ? 'video' : 'photo';
                $this->stopOnNotExistsCommentGallery($cid, $type);
                $countLikes = CProfilePhoto::updateLikeComment($type);
            } else {
                $this->stopOnNotExistsComment($cid);
                $countLikes = Wall::updateLikeComment();
            }
            die(get_json_encode($countLikes));
        }

        if ($cmd == 'comment') {
            if (User::isBlocked('wall', $uid, guid())) {
                die(get_json_encode('you_are_blocked'));
            }
            $this->stopOnNotExists($id);

            if ($isWallEdge) {
                $cid = 0;
                if ($section == 'photo' || $section == 'vids') {
                    $commentInfo = CProfilePhoto::addComment(true);
                    if (isset($commentInfo['id'])) {
                        $cid = $commentInfo['id'];
                    }
                } else{
                    $cid = Wall::addComment($id);
                }
                $_GET['last_insert_comment'] = $cid;//For replies comment
                if (!$cid) {
                    die(get_json_encode('server_error'));
                }
            } else {
                Wall::addComment($id);
            }

            $start = get_param_int('last_id');
            Wall::parseComments($html, $id, 1, $start, 0);
        }

        if ($cmd == 'comments_load') {
            $this->stopOnNotExists($id);
            $start = get_param_int('last_id');
            $cid = 0;
            if ($isWallEdge) {
                $cid = get_param_int('cid');
                if ($cid) {//Reply
                    $start = 0;
                }
            }
            Wall::parseComments($html, $id, 1, $start, Wall::getCommentsLoadCount(), $cid);
        }

        /*if ($cmd == 'comment_viewed') {
            echo Wall::isCommentViewed($id, guid());
        }*/

        // item or comment owner can delete comment
        if ($cmd == 'comment_delete') {
            //$this->stopOnNotExists($id);
            $cid = get_param_int('cid');
            $start = get_param_int('last_id');
            if ($isWallEdge) {
                $cidRarent = get_param_int('cid_parent');
                $cidPrf = $cidRarent;
                $section = get_param('section');
                $prf = Wall::getPrfMediaId($section);
                $listComments = get_param('list_comments');
                if (is_string($listComments)) {
                    $listComments = json_decode($listComments, true);
                } else {
                    $listComments = array();
                }
                if ($section == 'photo') {
                    $pid = get_param_int('param');
                    CProfilePhoto::deleteComment($cid, $pid);
                    $cidPrf .= '_p';
                } elseif ($section == 'vids') {
                    include_once('./_include/current/vids/tools.php');
                    CVidsTools::deleteCommentVideoByAjax($cid);
                    $cidPrf .= '_v';
                } else {
                    $commentInfo = Wall::commentInfo($cid);
                    if ($guid == $commentInfo['comment_user_id'] || $guid == $commentInfo['wall_user_id']) {
                        Wall::removeComment($cid);
                    }
                }
                $rcid = 0;
                if ($cidRarent) {
                    $rcid = $cid;
                    $cid = $cidRarent;
                    $limit = Wall::getNumberShowCommentsReplies();
                    $count = 0;
                    if (isset($listComments[$cidPrf])) {
                        $count = count($listComments[$cidPrf]);
                        if ($count) {
                            $count--;
                        }
                    }
                    if ($limit > $count) {
                        Wall::parseComments($html, $id, 1, 0, 0, $cid);
                    }
                } else {
                    $limit = Wall::getCommentsPreloadCount();
                    $count = 0;
                    if (isset($listComments[$id])) {
                        $count = count($listComments[$id]);
                        if ($count) {
                            $count--;
                        }
                    }
                    if ($limit > $count) {
                        Wall::parseComments($html, $id, 1, $start, 1);
                    }
                }
                $js = "<script>clWall.commentDeleteFromPage('{$id}','" . $cid . $prf . "','" . $rcid . $prf . "')</script>";
                Wall::parseJs($html, $js);
            } else {
                $commentInfo = Wall::commentInfo($cid);
                if ($guid == $commentInfo['comment_user_id'] || $guid == $commentInfo['wall_user_id']) {
                    Wall::removeComment($cid);
                    $js = '<script>Wall.commentDeleteFromPage('.$id.', '.$cid.')</script>';
                    Wall::parseJs($html, $js);
                    Wall::parseComments($html, $id, 1, $start, 1);
                }
            }
        }

        $isRetryPost = false;
        if ($cmd == 'item') {
            //sleep(5);
            $comment = trim(strip_tags(get_param('comment')));
            $imageUpload = get_param('image_upload', false);

            if (get_param_int('retry')) {
                if ($imageUpload == 'true') {
                    $isRetryPost = Wall::isAlreadyPostWidthImage();
                } else {
                    $isRetryPost = Wall::isAlreadyPost($comment);
                }
            }

            if ($isRetryPost){
                $cmd = 'update';
            } else {
                if (User::isBlocked('wall', $uid, guid())) {
                    die(get_json_encode('you_are_blocked'));
                }

                if ($imageUpload == 'true') {
                    Gallery::uploadWall($comment);
                    $cmd = 'update';
                } elseif ($comment != '') {
                    $comment = Common::newLinesLimit($comment, 2);
                    $comment = OutsideImages::filter_to_db($comment);
                    $comment = VideoHosts::textUrlToVideoCode($comment);
                    //if ($imageUpload == 'true') {
                        //$comment .= '{wall_img}';
                    //}
                    $id = intval(Wall::add('comment', 0, guid(), $comment));
                    //if ($imageUpload == 'true') {
                        //Wall::uploadImage($id, Wall::$outsideImageSizes);
                    //}
                    $cmd = 'update';
                    //} //elseif($imageUpload == 'true'){
                    //$comment = '{wall_img}';
                    //$id = intval(Wall::add('comment', 0, guid(), $comment));
                    //Wall::uploadImage($id, Wall::$outsideImageSizes);
                    //$cmd='update';
                } else {
                    die(get_json_encode('empty comment'));
                }
            }

        }

        if ($cmd == 'items_old') {
            Wall::parseItems($html, $id);
        }

        if ($cmd == 'update' && !$this->isWallAjaxUpdateInstance) {
            // load new items
            if ($isRetryPost) {
               Wall::parseItems($html, false, $isRetryPost, false);
            } else {
                $lastItemId = get_param('last_item_id');
                Wall::parseItems($html, $lastItemId, false, true);
            }

            if ($html->blockExists('update_counter_posts_add_item')) {
                $count = Wall::getCountItems();
                $html->setvar('counter_posts', $count);
                $html->parse('update_counter_posts_add_item', false);
            }
        }

        if ($cmd == 'item_delete') {
            if (guid() && in_array(guid(), Wall::getItemUid($id))) {
                Wall::removeById($id);
                die(get_json_encode('deleted'));
            }
        }

        if ($cmd == 'share') {
            $this->stopOnNotExists($id);
            Wall::add('share', $id);
            //echo 'shared';
            die(get_json_encode('shared'));
        }

        if ($cmd == 'unshare') {
            $this->stopOnNotExists($id);
            Wall::removeBySection('share', $id, $guid);
            //echo 'unshared';
            die(get_json_encode('unshared'));
        }
        if ($cmd == 'like_to_meet') {
            $uid = get_param('uid');
            if (guid() && $uid) {
                $reply = get_param('reply', 'Y');
                if ($reply == 'Y'){
                    MutualAttractions::setWantToMeet($uid, $reply);
                } else {
                    MutualAttractions::unlike($uid);
                }
                die(get_json_encode('like_to_meet'));
            }
        }

        if ($cmd == 'update_access') {
            $this->stopOnNotExists($id);
            if(Wall::changeAccessItem() === false){
                die(get_json_encode('server_error'));
            } else {
                die(get_json_encode('update_access'));
            }
        }

        parent::parseBlock($html);
    }

    function stopOnNotExists($id)
    {
        if (!Wall::isItemExists($id)) {
            die(get_json_encode('not exists'));
        }
    }

    function stopOnNotExistsComment($cid)
    {
        if (!Wall::isItemExistsComment($cid)) {
            die(get_json_encode('not exists comment'));
        }
    }

    function stopOnNotExistsCommentGallery($cid, $type)
    {
        if (!CProfilePhoto::isExistsComment($cid, $type)) {
            die(get_json_encode('not exists comment'));
        }
    }

    function isAuthOnly($action)
    {
        $actions = array(
            'item',
            'like',
            'unlike',
            'comment',
            'item_delete',
            'comment_delete',
            'share',
            'like_comment',
            'update_access'
        );

        if (guid() == 0 && in_array($action, $actions)) {
            die(get_json_encode('please_login'));
        }
    }

}