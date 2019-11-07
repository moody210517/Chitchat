<?php
/* (C) Websplosion LTD., 2001-2014

IMPORTANT: This is a commercial software product
and any kind of using it must agree to the Websplosion's license agreement.
It can be found at http://www.chameleonsocial.com/license.doc

This notice may not be removed from the source code. */

$area = 'login';
$g['to_root'] = '../../';
include("../../_include/core/main_start.php");

$id = intval(get_param('uid'));

if(isset($_GET['uid'])) {
    unset($_GET['uid']);
}

$_GET['t'] = Common::filterProfileText($_GET['t']);

$text = implode('|', $_GET);

if ($id > 0) {

	$block = User::isBlocked('mail', $id, guid());
	if ($id != 0 and $block == 0) {
            $lang = User::getInfoBasic($id, 'lang');
            $uLang = loadLanguageSite($lang);

        DB::execute("
			INSERT INTO mail_msg (user_id, user_from, user_to, folder, subject, text, date_sent, new, type, receiver_read)
			VALUES(
			" . $g_user['user_id'] . ",
			" . $g_user['user_id'] . ",
			" . to_sql($id, "Number") . ",
			" . 3 . ",
			" . to_sql(l('you_have_postcard')) . ",
			" . to_sql($text) . ",
			" . time() . ",
			'N',
			'postcard',
                        'N')
		");
        $idMailFrom = DB::insert_id();
        DB::execute("
			INSERT INTO mail_msg (user_id, user_from, user_to, folder, subject, text, date_sent, type, receiver_read, sent_id)
			VALUES(
			" . to_sql($id, "Number") . ",
			" . $g_user['user_id'] . ",
			" . to_sql($id, "Number") . ",
			" . 1 . ",
			" . to_sql(l('you_have_postcard', $uLang)) . ",
			" . to_sql($text) . ",
			" . time() . ",
			'postcard',
                        'N',
                        " . to_sql($idMailFrom, 'Number') . ")
		");
        $idMailTo = DB::insert_id();
        User::updateActivity($id);
		DB::execute("UPDATE user SET new_mails=new_mails+1 WHERE user_id=" . to_sql($id, "Number") . "");

        CStatsTools::count('postcards_sent');

        if (Common::isEnabledAutoMail('mail_message')) {
            DB::query("SELECT * FROM user WHERE user_id='" . $id . "'");
            if ($row = DB::fetch_row()) {
                if ($row['set_email_mail'] != "2") {
                    $textMail = (Common::isOptionActive('mail_message_alert')) ? l('you_have_postcard', $uLang) : '';
                    $vars = array('title' => $g['main']['title'],
                                  'name'  => $g_user['name'],
                                  'text'  => $textMail,
                                  'mid' => $idMailTo
                            );
                    Common::sendAutomail($row['lang'], $row['mail'], 'mail_message', $vars);

                }
            }
        }
	}
}

redirect('../../postcard_send.php');