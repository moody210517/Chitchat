<?php
/* (C) Websplosion LTD., 2001-2014

IMPORTANT: This is a commercial software product
and any kind of using it must agree to the Websplosion's license agreement.
It can be found at http://www.chameleonsocial.com/license.doc

This notice may not be removed from the source code. */

include("../_include/core/administration_start.php");

class CForm extends CHtmlBlock
{

	var $message = "";
	var $login = "";

	function action()
	{
		global $g_options;
        global $p;
        global $g_user;

		$photo = get_param_array("do");
		$redirect = false;

		foreach ($photo as $k => $v){

            Moderator::setNotificationTypePhoto();

			if ($v == 'add' || $v == 'access') {
				/*DB::execute("UPDATE photo SET visible='Y' WHERE photo_id=" . ((int) $k) . "");
				DB::query("SELECT * FROM photo WHERE photo_id=" . ((int) $k) . "", 2);
				if ($row = DB::fetch_row(2)) {
                    $g_user['user_id'] = $row['user_id'];
					DB::execute("UPDATE user SET is_photo='Y' WHERE user_id=" . $row['user_id'] . "");
                    User::setAvailabilityPublicPhoto($row['user_id']);
				}
                $wallId = DB::result('SELECT `wall_id` FROM `photo` WHERE photo_id = ' . to_sql($k, 'Number'));
                if ($wallId) {
                    DB::update('wall', array('params' => 1), '`id` = ' . to_sql($wallId));
                }
                if ($v == 'access') {
                    CProfilePhoto::setPhotoPrivate($k);
                }*/
                User::photoApproval($k, $v);
				$redirect = true;
                Moderator::sendNotificationApproved();
			} elseif ($v == 'del') {
				DB::query("SELECT * FROM photo WHERE photo_id=" . ((int) $k) . "", 2);
				if ($row = DB::fetch_row(2)) {
                    Moderator::prepareNotificationInfo($row['user_id'], $row);
					deletephoto($row['user_id'], $row['photo_id']);
				}
				$redirect = true;
                Moderator::sendNotificationDeclined();
			}
		}


		if($redirect) redirect($p."?action=saved");

	}

	function parseBlock(&$html)
	{
		global $g_options;

		$html->setvar("message", $this->message);

		$table = get_param("t", "tips");
		$html->setvar("table", $table);

        $html->setvar('photo_height', Common::getOption('medium_y', 'image'));
        $noPrivatePhoto = Common::isOptionActiveTemplate('no_private_photos');

		DB::query("SELECT * FROM photo WHERE " . CProfilePhoto::moderatorVisibleFilter() . " ORDER BY photo_id LIMIT 20");
		$num=DB::num_rows();
		while ($row = DB::fetch_row())
		{
			$row['user_name'] = DB::result("SELECT name FROM user WHERE user_id=" . $row['user_id'] . "", 0, 2);
			foreach ($row as $k => $v)
			{
				$html->setvar($k, $v);
			}

            $html->setvar('photo_m', User::photoFileCheck($row, 'm'));
            $html->setvar('photo_b', User::photoFileCheck($row, 'b'));

            if (!$noPrivatePhoto) {
                if ($row['private'] == 'Y'){
                    $html->setvar('private', l('Private'));
                } else {
                    $html->setvar('private', l('Public'));
                }
                $html->parse('photo_status', false);
                $html->setvar("photo_access", l($row['private']=='N'?'make_private':'make_public'));
                $html->parse('photo_access', false);
            }

			$html->parse("photo", true);
		}
		if($num==0){
			$html->parse("msg",true);
		} else {
			$html->parse("photos",true);
		}
		parent::parseBlock($html);
	}
}

$page = new CForm("main", $g['tmpl']['dir_tmpl_administration'] . "users_photo.html");
$header = new CAdminHeader("header", $g['tmpl']['dir_tmpl_administration'] . "_header.html");
$page->add($header);
$footer = new CAdminFooter("footer", $g['tmpl']['dir_tmpl_administration'] . "_footer.html");
$page->add($footer);

include("../_include/core/administration_close.php");