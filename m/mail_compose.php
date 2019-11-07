<?php
/* (C) Websplosion LTD., 2001-2014

IMPORTANT: This is a commercial software product
and any kind of using it must agree to the Websplosion's license agreement.
It can be found at http://www.chameleonsocial.com/license.doc

This notice may not be removed from the source code. */

$area = "login";
include("./_include/core/pony_start.php");
if(!Common::isOptionActive('mail')) {
    redirect(Common::toHomePage());
}
payment_check('mail_compose');

$id = get_param("user_id", '');
if($id)
	$g['to_head'][] = '<link rel="stylesheet" href="'.$g['tmpl']['url_tmpl_mobile'].'css/home.css" type="text/css" media="all"/>';
else
	$g['to_head'][] = '<link rel="stylesheet" href="'.$g['tmpl']['url_tmpl_mobile'].'css/mail.css" type="text/css" media="all"/>';

class CProfile extends CHtmlBlock
{
	var $m_on_page = 20;
	var $message = "";
	var $id;
	var $subject;
	var $text;
	var $type = 'plain';
	function action()
	{
		global $g_user;
		global $g;
		global $l;

		$cmd = get_param("cmd", "");
		if ($cmd == "reply")
		{
			$msg = (int) get_param("msg", "");
			$sql = "
				SELECT u.user_id AS user_from, u2.user_id AS user_to,
				m.id, m.subject, m.text, m.type AS mtype
				FROM ((mail_msg AS m LEFT JOIN user AS u ON u.user_id=m.user_from)
				LEFT JOIN user AS u2 ON u2.user_id=m.user_to)
				WHERE m.id=" . $msg . " AND m.user_id=" . $g_user['user_id'] . "
			";
			DB::query($sql);
			if ($row = DB::fetch_row())
			{
				$this->id = $row['user_from'] != $g_user['user_id'] ? $row['user_from'] : $row['user_to'];
				$this->subject = mail_chain($row['subject']);
				$text = str_replace("\n", "\n> ", $row['text']);
                $text = str_replace("\n> >","\n>>",$text);
				if ($row['mtype'] == 'plain' or $row['mtype'] == '') $this->text = "\n\n\n> " . $text;
				else $this->text = "";
			}
		}
		if ($cmd == "forward")
		{
			$msg = (int) get_param("msg", "");
			$sql = "
				SELECT u.user_id AS user_from, u2.user_id AS user_to,
				m.id, m.subject, m.text, m.type AS mtype
				FROM ((mail_msg AS m LEFT JOIN user AS u ON u.user_id=m.user_from)
				LEFT JOIN user AS u2 ON u2.user_id=m.user_to)
				WHERE m.id=" . $msg . " AND m.user_id=" . $g_user['user_id'] . "
			";
			DB::query($sql);
			if ($row = DB::fetch_row())
			{
				$this->subject = mail_chain($row['subject'], 'Fw');
				if ($row['mtype'] == 'plain' or $row['mtype'] == '') {
                    $text = str_replace("\n", "\n> ", $row['text']);
                    $text = str_replace("\n> >","\n>>",$text);
					$this->text = "> " .$text;
				} else {
					$this->text = urlencode($row['text']);
					$this->type = 'postcard';
				}
			}
		}
		if ($cmd == "sent")
		{
			$name = get_param("name", "");
			$subject = Common::filterProfileText(strip_tags(get_param('subject')));
			$text = Common::filterProfileText(get_param('text'));
            $text = trim(strip_tags($text));

			if($name != "")
				$this->id = DB::result("SELECT user_id FROM user WHERE name=" . to_sql($name, "Text") . " AND user_id != " . to_sql($g_user['user_id'], "Text"));
            if (trim($subject) == '') {
                    $subject = l('No subject');
            }
			if ($name != "" and $subject != "" and $text != "")
			{

				$id = $this->id;
                $textHash = md5(mb_strtolower($text, 'UTF-8'));
                if (User::isBanMails($textHash) || User::isBanMailsIp()) {
                    redirect('ban_mails.php');
                }
				$block = User::isBlocked('mail', $id, guid());

				if ($id != 0 and $block == 0)
				{
					$idMailFrom = 0;
                    $sqlInto = '';
                    $sqlValue = '';
                    if (get_param('type') != 'postcard') {
                        $sqlInto = ', text_hash';
                        $sqlValue = ', ' . to_sql($textHash);
                    }
					if (get_param("save", "1") == "1")
					{
						DB::execute("
							INSERT INTO mail_msg (user_id, user_from, user_to, folder, subject, text, date_sent, new, type, receiver_read, text_hash)
							VALUES(
							" . $g_user['user_id'] . ",
							" . $g_user['user_id'] . ",
							" . to_sql($id, "Number") . ",
							" . 3 . ",
							" . to_sql($subject, 'Text') . ",
							" . to_sql($text, "Text") . ",
							" . time() . ",
							'N',
							" . to_sql(get_param('type')) . ",
                            'N',
                            " . to_sql($textHash) . ")
						");
                        $idMailFrom = DB::insert_id();
					}

                    DB::execute("
					INSERT INTO mail_msg (user_id, user_from, user_to, folder, subject, text, date_sent, type, receiver_read, sent_id, text_hash)
						VALUES(
						" . to_sql($id, "Number") . ",
						" . $g_user['user_id'] . ",
						" . to_sql($id, "Number") . ",
						" . 1 . ",
						" . to_sql($subject, 'Text') . ",
						" . to_sql($text, "Text") . ",
						" . time() . ",
						" . to_sql(get_param('type')) . ",
                        'N',
                        " . to_sql($idMailFrom, 'Number') . ",
                        " . to_sql($textHash) . ")
					");
                    $idMailTo = DB::insert_id();
					DB::execute("UPDATE user SET new_mails=new_mails+1 WHERE user_id=" . to_sql($id, "Number") . "");
                    CStatsTools::count('mail_messages_sent');
                    User::updateActivity($id);

                    if (Common::isEnabledAutoMail('mail_message')) {
                        DB::query('SELECT * FROM user WHERE user_id = ' . to_sql($id, 'Number'));
                        if ($row = DB::fetch_row())
                        {
                            if ($row['set_email_mail'] != '2')
                            {
                                $textMail = (Common::isOptionActive('mail_message_alert')) ? $text : '';
                                $vars = array('title' => $g['main']['title'],
                                              'name' => $g_user['name'],
                                              'text' => $textMail,
                                              'mid' => $idMailTo);
                                Common::sendAutomail($row['lang'], $row['mail'], 'mail_message', $vars);
                            }
                        }
                    }
                    $mode = (get_param("mode", "") == '') ? '' : '&mode=profile';
                    redirect('mail_sent_profile.php?user_id=' . $id . $mode);
				}
				elseif ($block > 0)
				{
					redirect('profile_view_you_blocked.php?user_id='.$id);
				}
				else
				{
					if (isset($l['mail_compose.php'][to_php_alfabet("Incorrect Username")])) {
						$this->message = $l['mail_compose.php'][to_php_alfabet("Incorrect Username")];
					} else {
						$this->message = "Incorrect Username";
					}
					$this->message .= "\\n";
				}
			}
			else
			{
				if (isset($l['mail_compose.php'][to_php_alfabet("Please fill in all the fields!")])) {
					$this->message = $l['mail_compose.php'][to_php_alfabet("Please fill in all the fields!")];
				} else {
					$this->message = "Please fill in all the fields!";
				}
				$this->message .= "\\n";
			}
		}
	}
	function parseBlock(&$html)
	{
		global $g_user;

		if ($this->message)
		{
			$html->setvar("error_message", $this->message);
			$html->parse("error", true);
		}

		$html->setvar("name", get_param('name'));
        $html->setvar("subject", he(Common::filterProfileText(strip_tags(get_param("subject", $this->subject)))));
		$html->setvar("text", $this->text);

		if (DB::query("SELECT u.name FROM users_favorite AS f LEFT JOIN user AS u ON u.user_id=f.user_to WHERE f.user_from=" . $g_user['user_id'] . ""))
		{
			$i = 0;
			$num_columns = 3;
			$total_checks = DB::num_rows();
			$in_column = ceil(($total_checks) / $num_columns);

			while ($row = DB::fetch_row())
			{
				$i++;

				$html->setvar("fname", $row['name']);

				if ($i % $in_column == 0 and $i != 0 and $num_columns != 1)
				{
					$html->parse("favorite_column", false);
				}
				else
				{
					$html->setblockvar("favorite_column", "");
				}

				$html->parse("favorite", true);
			}
			DB::free_result();
		}

		if (isset($this->id))
		{
			$id = $this->id;
		}
		else
		{
			$ids = get_param_array("user_id");
			$id = isset($ids[0]) ? $ids[0] : 0;
		}

		DB::query("SELECT user_id, name FROM user WHERE user_id=" . to_sql($id, "Number") . " ");

		$form_url = '';
		$compose_mode = get_param("mode", '');

		if($compose_mode != '')
			$form_url .= 'mode=' . $compose_mode;


		if ($row = DB::fetch_row())
		{
			$html->setvar("name", $row['name']);
			$html->setvar("recipient_id", $row['user_id']);
			$html->parse("add_id", true);

			if($form_url != '')
				$form_url .= '&';
			$form_url .= 'user_id='.$row['user_id'];
		}
		else
		{
			$html->parse("add_name", true);
		}

		if($form_url != '')
		{
			$html->setvar("form_url", '&'.$form_url);
		}

		$to = isset($_SERVER['HTTP_REFERER']) ? $_SERVER['HTTP_REFERER'] : "mail.php";
		$html->setvar("page_from", get_param("page_from", $to));

		if ($this->type == 'plain')  $html->parse("plain", true);
		else  $html->parse("postcard", true);

		$id = get_param("user_id", '');
		if($id)
			$html->parse('send_to_user_id', true);
		else
		{
			if(DB::result("SELECT count(id) FROM friends WHERE user_id = " . to_sql($g_user['user_id'], 'Number')))
				$html->parse('select_from_friends', false);
			else
				$html->parse('no_select_from_friends', false);

			$html->parse('send_to_user_name', true);
		}

		parent::parseBlock($html);
	}
}
g_user_full();

$page = new CProfile("", $g['tmpl']['dir_tmpl_mobile'] . "mail_compose.html");
$header = new CHeader("header", $g['tmpl']['dir_tmpl_mobile'] . "_header.html");
$page->add($header);
$footer = new CFooter("footer", $g['tmpl']['dir_tmpl_mobile'] . "_footer.html");
$page->add($footer);

$type = get_param("display", "profile");
if ($type == "info") $list = new CUsersInfo("users_list", $g['tmpl']['dir_tmpl_mobile'] . "_list_users_info.html");
elseif ($type == "gallery") $list = new CUsersGallery("users_list", $g['tmpl']['dir_tmpl_mobile'] . "_list_users_gallery.html");
elseif ($type == "list") $list = new CUsersList("users_list", $g['tmpl']['dir_tmpl_mobile'] . "_list_users_list.html");
elseif ($type == "profile") $list = new CUsersProfile("users_list", $g['tmpl']['dir_tmpl_mobile'] . "_profile.html");
elseif ($type == "photo") $list = new CHtmlUsersPhoto("users_list", $g['tmpl']['dir_tmpl_mobile'] . "_photo.html");
else redirect("users_online.php");

$user_id = get_param('user_id');

if($user_id && User::isBlocked('mail', $user_id, guid()))
{
	redirect('profile_view_you_blocked.php?user_id='.$user_id);
}

$list->m_sql_where = "u.user_id=" . to_sql($user_id, 'Number') . "";
$list->m_is_me = ($user_id == $g_user['user_id']) ? true : false;
$page->add($list);

include("./_include/current/profile_view_menu.php");
$profile_view_menu = new CProfileViewMenu("profile_view_menu", $g['tmpl']['dir_tmpl_mobile'] . "_profile_view_menu.html");
$profile_view_menu->user_id = $user_id;
$page->add($profile_view_menu);

$user_menu = new CUserMenu("user_menu", $g['tmpl']['dir_tmpl_mobile'] . "_user_menu.html");
$user_menu->setActive('mail');
$page->add($user_menu);

include("./_include/core/main_close.php");

?>
