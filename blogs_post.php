<?php
/* (C) Websplosion LTD., 2001-2014

IMPORTANT: This is a commercial software product
and any kind of using it must agree to the Websplosion's license agreement.
It can be found at http://www.chameleonsocial.com/license.doc

This notice may not be removed from the source code. */

include('./_include/core/main_start.php');
include('./_include/current/blogs/start.php');

class CPage extends CHtmlBlock
{
    public $post = null;
    public $user = null;
    public $to_comment = 0;
    function init()
    {
        if (intval(param('id')) > 0) {
            if  (!User::isNarrowBox('blogs')) {
                CBlogsTools::$thumbnail_postfix = 'o';
            }
            $this->post = CBlogsTools::getPostById(param('id'));

            if (!is_array($this->post)) {
                redirect('blogs.php');
            } else {
                $this->user = user($this->post['user_id']);
                CBlogsTools::viewPostByIdAndUserId($this->post['id'], $this->post['user_id']);
            }
        } else {
            redirect('blogs.php');
        }

        global $g;
        $g['main']['title'] = htmlspecialchars($this->post['subject_req'], ENT_QUOTES, 'UTF-8');
        $g['main']['description'] = htmlspecialchars($this->post['text_short'], ENT_QUOTES, 'UTF-8');
    }
	function action()
	{
		if (CBlogsTools::filterCommentText(param('text')) != '') {
            $this->to_comment = CBlogsTools::insertCommentByPostId($this->post['id']);
		}
		if (intval(param('del')) > 0) {
            CBlogsTools::delCommentById(intval(param('del')));
		}
	}
	function parseBlock(&$html)
	{
        if (Common::getOption('video_player_type') == 'player_custom' && grabs($this->post['text'], '{site:', '}')) {
            $html->parse('player_custom', false);
        }
        $html->assign('post', $this->post);
        $html->assign('blogger', $this->user);
        $html->assign('blogger_photo', urphoto($this->user['user_id']));

        $html->items('post_comment', CBlogsTools::getCommentsByPostId($this->post['id']), '', 'is_my');

        if (guid() == $this->post['user_id']) {
            $html->parse('post_edit');
        }

        if ($this->to_comment > 0) {
            $html->assign('to_comment', $this->to_comment);
            $html->parse('to_comment');
        }

        $state = User::isNarrowBox('blogs');
        if  ($state) {
           $html->setvar('hide_narrow_box', 'block');
           $html->setvar('show_narrow_box', 'none');
        } else {
           CBlogsTools::$thumbnail_postfix = 'o';
           $html->setvar('hide_narrow_box', 'none');
           $html->setvar('show_narrow_box', 'block');
        }

        parent::parseBlock($html);
    }
}

blogs_render_page();
include('./_include/core/main_close.php');
