<?php

/* (C) Websplosion LTD., 2001-2014

  IMPORTANT: This is a commercial software product
  and any kind of using it must agree to the Websplosion's license agreement.
  It can be found at http://www.chameleonsocial.com/license.doc

  This notice may not be removed from the source code. */

$area = "login";
include("./_include/core/main_start.php");
require_once("./_include/current/vids/includes.php");

Moderator::checkAccess();

class CHon extends CHtmlBlock
{

    var $message_send = '';

    function action()
    {
        global $p;
        global $g;
        global $g_user;

        $redirect = false;
        $cmd = get_param('section', Moderator::checkAccess());

		if ($cmd == 'profiles') {
			$approvalUserId = get_param('user_approval', 0);
			$delUserId = get_param('user_delete', 0);
			if ($delUserId) {
				if (Common::isEnabledAutoMail('admin_delete')) {
                    DB::query('SELECT * FROM user WHERE user_id = ' . to_sql($delUserId, 'Number'));
                    $row = DB::fetch_row();
                    $vars = array(
                        'title' => $g['main']['title'],
                    );
                    Common::sendAutomail($row['lang'], $row['mail'], 'admin_delete', $vars);
                }
				delete_user($delUserId);
				redirect($p . '?section=' . $cmd);
			} elseif ($approvalUserId) {
				$data = array('active' => 1, 'hide_time' => 0);
				DB::update('user', $data, '`user_id` = ' . to_sql($approvalUserId, 'Number'));
				if (Common::isEnabledAutoMail('profile_approved')) {
                    DB::query('SELECT * FROM `user` WHERE `user_id` = ' . to_sql($approvalUserId, 'Number'));
                    $row = DB::fetch_row();
                    $vars = array('title' => $g['main']['title'],
                                  'name' => $row['name'],
                                  'password' => $row['password'],
                    );
                    Common::sendAutomail($row['lang'], $row['mail'], 'profile_approved', $vars);
                }
				redirect($p . '?section=' . $cmd);
			}
		}

        $do = get_param_array('do');
        $data_texts = array();
        DB::query("SHOW COLUMNS FROM texts");
        while ($row = DB::fetch_row()) {
            if (($row[0] != 'id') or ( $row[0] != 'user_id')) {
                $data_texts[$row[0]] = get_param_array($row[0]);
            }
        }
        #print_r($data_texts);
        foreach ($do as $k => $v) {
            $k = ((int) $k);

            if ($v == 'add' || $v == 'access') {

                if ($cmd == 'photo') {

                    Moderator::setNotificationTypePhoto();

                    /*$sql = 'UPDATE photo SET visible="Y"
                        WHERE photo_id = ' . $k;
                    DB::execute($sql);

                    $sql = 'SELECT * FROM photo
                        WHERE photo_id = ' . $k;
                    DB::query($sql, 2);

                    if ($row = DB::fetch_row(2)) {
                        $g_user['user_id'] = $row['user_id'];
                        $sql = 'UPDATE user
                            SET last_visit = last_visit,
                            is_photo = "Y"
                            WHERE user_id = ' . $row['user_id'];
                        DB::execute($sql);
                    }
                    if ($v == 'access') {
                        CProfilePhoto::setPhotoPrivate($k);
                    }*/
                    User::photoApproval($k, $v);
                }

                if ($cmd == 'vids_video') {

                    Moderator::setNotificationTypeVideo();

                    $sql = 'UPDATE vids_video SET active=1
                        WHERE id = ' . $k;
                    DB::execute($sql);
/*
                    $sql = 'SELECT * FROM vids_video
                        WHERE id = ' . $k;
                    DB::query($sql, 2);
                    if ($row = DB::fetch_row(2)) {
                        $sql = 'UPDATE user
                            SET last_visit = last_visit
                            WHERE user_id = ' . $row['user_id'];
                        DB::execute($sql);
                    }
 *
 */
                    DB::update('wall', array('params' => ""), '`item_id` = ' . to_sql((int) $k).' AND section="vids"');

                    $sql = 'SELECT * FROM vids_video WHERE id = ' . to_sql($k);
                    $videoInfo = DB::row($sql);

                    if(isset($videoInfo['user_id'])) {
                        Moderator::prepareNotificationInfo($videoInfo['user_id'], $videoInfo);
                    }

                }

                if ($cmd == 'texts') {

                    Moderator::setNotificationTypeText();

                    DB::query("SELECT * FROM texts WHERE id=" . ((int) $k) . "");
                    if ($row = DB::fetch_row()) {

                        $sql = "";
                        foreach ($row as $k2 => $v2) {
                            if (isset($g['user_var'][$k2]) and ( $k2 != "id" and $k2 != "user_id" and ! is_int($k2) and $g['user_var'][$k2]['status'] == 'active')) {
                                if (isset($data_texts[$k2][$k])) {
                                    $sql .= " " . $k2 . "=" . to_sql($data_texts[$k2][$k], "Text") . ", ";
                                } else {
                                    $sql .= " " . $k2 . "=" . to_sql($v2, "Text") . ", ";
                                }
                            }
                        }
                        if ($sql != '') {
                            $sql = substr($sql, 0, (strlen($sql) - 2));
                            DB::execute("UPDATE userinfo SET " . $sql . " WHERE user_id=" . $row['user_id'] . "");

                            Moderator::prepareNotificationInfo($row['user_id']);
                        }
                    }
                    DB::execute("DELETE FROM texts WHERE id=" . ((int) $k) . "");
                }

                Moderator::sendNotificationApproved();

                $redirect = true;
            }

            if ($v == "del") {

                if ($cmd == 'texts') {

                    Moderator::setNotificationTypeText();
                    $sql = 'SELECT user_id FROM texts WHERE id = ' . to_sql($k);
                    $row = DB::row($sql);
                    if(isset($row['user_id'])) {
                        Moderator::prepareNotificationInfo($row['user_id']);
                    }

                    $sql = 'DELETE FROM texts
                        WHERE id = ' . $k;
                    DB::execute($sql);
                }

                if ($cmd == 'vids_video') {

                    Moderator::setNotificationTypeVideo();

                    $sql = 'SELECT * FROM vids_video WHERE id = ' . $k;
                    DB::query($sql, 2);
                    if ($row = DB::fetch_row(2)) {
                        CVidsTools::delVideoById($row['id'],true);
                        Moderator::prepareNotificationInfo($row['user_id'], $row);
                    }
                }

                if ($cmd == 'photo') {

                    Moderator::setNotificationTypePhoto();

                    $sql = 'SELECT * FROM photo WHERE photo_id = ' . $k;
                    DB::query($sql, 2);
                    if ($row = DB::fetch_row(2)) {
                        Moderator::prepareNotificationInfo($row['user_id'], $row);
                        deletephoto($row['user_id'], $row['photo_id']);
                    }
                    $sql = 'DELETE FROM photo WHERE photo_id = ' . $k;
                    DB::execute($sql);
                }

                Moderator::sendNotificationDeclined();

                $redirect = true;
            }
        }

        if ($redirect) {
            redirect($p . '?section=' . $cmd);
        }
    }

    function parseBlock(&$html)
    {
        Moderator::buttonsParse($html);

        $html->parse('members', false);

        parent::parseBlock($html);
    }

}

class Cgroups extends CHtmlList
{

    var $dir = 'groups';

    function init() {
        parent::init();

        $cmd = to_sql(get_param('section', Moderator::checkAccess()), 'Plain');

        if ($cmd == "photo") {
            $this->m_field['description'] = array("description", null);
            $this->m_field['user_id'] = array("user_id", null);
            $this->m_field['photo_id'] = array("photo_id", null);
            $this->m_field['photo_name'] = array("photo_name", null);

            $this->m_sql_where = CProfilePhoto::moderatorVisibleFilter();
            $this->m_sql_order = "photo_id desc";
        } elseif ($cmd == "vids_video") {
            $this->m_field['subject'] = array("subject", null);
            $this->m_field['user_id'] = array("user_id", null);
            $this->m_field['id'] = array("id", null);
            $this->m_field['text'] = array("text", null);

            $this->m_sql_where = "c.active=3";
            $this->m_sql_order = "id desc";
        } elseif ($cmd == "texts") {
            $this->m_field['id'] = array("id", null);
            $this->m_field['user_id'] = array("user_id", null);

            $this->m_sql_order = "id desc";
        }
		$this->m_on_page = 10;

		if ($cmd == "profiles") {
			$this->m_on_page = 20;

			$this->m_sql_count = "SELECT COUNT(u.user_id) FROM user AS u ";
			$this->m_sql = "
			SELECT u.user_id, u.mail, u.type, u.orientation, u.password, u.gold_days, u.name, (DATE_FORMAT(NOW(), '%Y') - DATE_FORMAT(birth, '%Y') - (DATE_FORMAT(NOW(), '00-%m-%d') < DATE_FORMAT(birth, '00-%m-%d'))
            ) AS age, u.last_visit,
			u.is_photo,
			u.city_id, u.state_id, u.country_id, u.last_ip, u.register
			FROM user AS u";

			$this->m_field['user_id'] = array("user_id", null);
			$this->m_field['name'] = array("name", null);
			$this->m_field['age'] = array("age", null);
			$this->m_field['last_visit'] = array("last_visit", null);
			$this->m_field['mail'] = array("mail", null);
			$this->m_field['type'] = array("type", null);
			$this->m_field['gold_days'] = array("gold_days", null);
			$this->m_field['password'] = array("password", null);
			$this->m_field['orientation'] = array("orientation", null);
			$this->m_field['last_ip'] = array("last_ip", null);
			$this->m_field['register'] = array("register", null);
			$this->m_sql_where = " `active` = 0";
			$this->m_sql_order = "user_id";
		} else {
			$sql = "SELECT c.* FROM $cmd AS c
					  LEFT JOIN user AS u ON u.user_id = c.user_id";
			$sqlCount = "SELECT count(*) FROM $cmd AS c
						   LEFT JOIN user AS u ON u.user_id = c.user_id";

			$this->m_sql = $sql;
			$this->m_sql_count = $sqlCount;
		}

        //$this->m_debug = "Y";
    }

    function onItem(&$html, $row, $i, $last)
    {
        global $g;

        $cmd = get_param('section', Moderator::checkAccess());
        if ($cmd == "profiles") {
			$this->m_field['orientation'][1] = DB::result("SELECT title FROM const_orientation WHERE id=" . $row['orientation'] . "", 0, 2);
			if ($this->m_field['orientation'][1] == "") {
				$this->m_field['orientation'][1] = l("Invalid orientation");
			} else {
				$this->m_field['orientation'][1] = l($this->m_field['orientation'][1]);
			}
			if (Common::getOption('set', 'template_options') != 'urban') {
				if ($row['type'] == 'membership') {
					$this->m_field['type'][1] = l('platinum');
				} else {
					$this->m_field['type'][1] = l($row['type']);
				}
			} else {
				if ($row['type'] != 'none'){
					if ($row['gold_days'] > 0){
						$this->m_field['type'][1] = l('Super Powers!');
					} else {
						$this->m_field['type'][1] = l('none');
					}
				} else {
					$this->m_field['type'][1] = l($row['type']);
				}
			}
			$this->m_field['name'][1] = hard_trim($row['name'], 10);
			if ($i % 2 == 0) {
				$html->setvar("class", 'color');
			} else {
				$html->setvar("class", '');
			}

			$html->setvar('profile_url', User::url($row['user_id'], null, array('moderator_view_profile' => 1)));

		}
        #$html->parse($cmd, false);
        $html->parse("file", false);
    }

	function onPostParse(&$html)
	{
		$cmd = get_param('section', Moderator::checkAccess());
		if ($cmd == 'profiles') {
			$html->parse('profiles', false);
		}
		parent::onPostParse($html);
	}

    function parseBlock(&$html)
    {
        global $g;

        $tmplName = Common::getTmplName();
		$cmd = get_param('section', Moderator::checkAccess());

        $html->setvar('cmd', $cmd);
        $html->setvar('page_title', l('top_moderator'));

        if ($cmd == 'texts') {
            DB::query("SELECT * FROM texts ORDER BY id DESC LIMIT 20", 2);
            $num = DB::num_rows(2);
            while ($row = DB::fetch_row(2)) {
                $html->setvar('id', $row['id']);
                $html->setvar('user_id', $row['user_id']);
                $html->setvar('user_name', User::getInfoBasic($row['user_id'], 'name'));
                $html->setvar('user_profile_link', User::url($row['user_id']));
                foreach ($row as $k => $v) {
                    if ($k != "id" and $k != "user_id" and ! is_int($k) && !empty($v)) {
                        $html->setvar("field", $k);
                        $html->setvar("field_title", ucfirst($k));
                        $html->setvar("value", he($v));
                        if (!isset($g['user_var'][$k][0])) {
                        } elseif ($g['user_var'][$k][0] == "text") {
                            $html->setvar("name_input", $k);
                            $html->setvar("field_title", $g['user_var'][$k][2]);
                            $html->parse("text");
                        } elseif ($g['user_var'][$k][0] == "textarea") {
                            $html->setvar("name_input", $k);
                            $html->setvar("field_title", $g['user_var'][$k][2]);
                            $html->parse("textarea");
                        }
                    }
                }
                $html->parse('texts', true);
                $html->clean('textarea');
                $html->clean('text');
            }
            if($num) {
                $html->parse('text_section');
            }else{
                $html->parse('text_section_noitems');
            }
            $html->parse('sections');

		}elseif ($cmd == 'vids_video') {
            DB::query('SELECT * FROM `vids_video` WHERE `active` = 3 ORDER BY id LIMIT 20', 2);
            $num = DB::num_rows(2);
            VideoHosts::setAutoplay(false);
            if ($tmplName == 'edge') {
                $g['options']['video_player_type'] = 'player_native';
            }
            while ($row = DB::fetch_row(2)) {
                $row['user_name'] = User::getInfoBasic($row['user_id'], 'name');
                $row['user_profile_link'] = User::url($row['user_id']);
                foreach ($row as $k => $v) {
                    $html->setvar($k, $v);
                }
                if ($row['private'] == '1') {
                    $html->setvar('private', l('Private'));
                } else {
                    $html->setvar('private', l('Public'));
                }

                $video = CVidsTools::getVideoById($row['id'], true);
                if (!isset($video) or !is_array($video)) {
                    continue;
                }
                $html->setvar('video_html_code', $video['html_code']);
                $html->setvar('user_name', $row['user_name']);
                $html->setvar('video_id', $row['id']);
                $html->setvar('description', $row['subject']);

                $html->parse("video", true);
            }
            if($num) {
                $html->parse('vids_video');
            }else{
                $html->parse('vids_video_noitems');
            }
            $html->parse('sections');
		} elseif ($cmd == "photo") {
            $noPrivatePhoto = Common::isOptionActiveTemplate('no_private_photos');
            DB::query("SELECT * FROM photo WHERE " . CProfilePhoto::moderatorVisibleFilter() . " ORDER BY photo_id LIMIT 20", 2);
            $num = DB::num_rows(2);
            while ($row = DB::fetch_row(2)) {
                $row['user_name'] = User::getInfoBasic($row['user_id'], 'name');
                $row['user_profile_link']=User::url($row['user_id']);
                foreach ($row as $k => $v) {
                    $html->setvar($k, $v);
                }

                if (!$noPrivatePhoto) {
                    if ($row['private'] == 'Y') {
                        $html->setvar('private', l('Private'));
                    } else {
                        $html->setvar('private', l('Public'));
                    }
                    $html->parse('photo_status', false);
                    $html->setvar("photo_access", l($row['private']=='N'?'make_private':'make_public'));
                    $html->parse('photo_access', false);
                }
                $html->setvar("photo_file", $row['user_id'] . "_" . $row['photo_id']);
                $html->parse("photo", true);
            }
            if($num) {
                $html->parse('photos');
            }else{
                $html->parse('photos_noitems');
            }
            $html->parse('sections');
        }

        TemplateEdge::parseColumn($html);

        parent::parseBlock($html);
    }

}

$page = new CHon("", getPageCustomTemplate('moderator.html', 'moderator_template'));
$header = new CHeader("header", $g['tmpl']['dir_tmpl_main'] . "_header.html");
$page->add($header);

if (Common::getOption('set', 'template_options') !== 'urban') {
    $search = new CSearch("search", $g['tmpl']['dir_tmpl_main'] . "_search.html");
    $page->add($search);
} else {
    if (Common::isParseModule('profile_colum_narrow')){
        if (guid()) {
            $column_narrow = new CProfileNarowBox('profile_column_narrow', $g['tmpl']['dir_tmpl_main'] . '_profile_column_narrow.html');
            $page->add($column_narrow);
        } else {
            $loginForm = new CLoginForm('login_form', $g['tmpl']['dir_tmpl_main'] . '_login_form.html');
            $page->add($loginForm);
        }
    }
}
$footer = new CFooter("footer", $g['tmpl']['dir_tmpl_main'] . "_footer.html");
$page->add($footer);

$group_list = new Cgroups("group_list", null);
$page->add($group_list);

include("./_include/core/main_close.php");
