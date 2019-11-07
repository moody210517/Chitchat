<?php
/* (C) Websplosion LTD., 2001-2014

IMPORTANT: This is a commercial software product
and any kind of using it must agree to the Websplosion's license agreement.
It can be found at http://www.chameleonsocial.com/license.doc

This notice may not be removed from the source code. */

$area = "login";
include("./_include/core/pony_start.php");


$g['to_head'][] = '<link rel="stylesheet" href="'.$g['tmpl']['url_tmpl_mobile'].'css/profile.css" type="text/css" media="all"/>';

class CPhoto extends CHtmlBlock
{
	var $message = "";

	function action()
	{
		global $g;
		global $l;
		global $g_user;

		$cmd = get_param('cmd', '');
        $photo_id = get_param('id', 0);

		if ($cmd == "submit"){
			$this->message = "";

			/*if ($photo_id)
				$photo_exist = DB::result("SELECT photo_id FROM photo WHERE user_id=" . $g_user['user_id'] . " AND photo_id=" . to_sql($photo_id) ." ORDER BY photo_id;");
			else
				$photo_exist = false;*/
            $photo_exist = false;
			$photo_name = get_param("photo_name", "");
			$description = get_param("description", "");
			$photo_url = get_param("photo_url", "");

			$photo_file_exists = true;
			if ($photo_url && $photo_url != l('file_url') && $photo_url != '')
			{
			    $re = '~^
		            (https?|ftp)://                           # http or https or ftp
				    (
		                ([a-z0-9\-]+\.)+[a-z]{2,6}            # a domain name
				          |                                   #  or
		                \d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}    # a IP address
				      )
				    (:[0-9]+)?                                # a port (optional)
				    (/?|/\S+)                                 # a /, nothing or a / with something
			    $~ix';
				if (!preg_match($re, $photo_url))
				{
					$photo_url = '';
					if (!$photo_exist)
						$this->message .= "Photo Url Incorrect.\\n";
				}
			} elseif (!$photo_id) {
                $validation_result = validatephoto("photo_file");
                $photo_file_exists = $validation_result ? false : true;
                if (!$photo_exist) {
                    $this->message .= str_replace('<br>', "\\n",$validation_result);
                }
			}

			if ($this->message == "")
			{
				if ($photo_id)//($photo_exist)
				{
					DB::execute("UPDATE `photo`
                                    SET `photo_name` = " . to_sql($photo_name) . ",
                                        `description` = " . to_sql($description) . "
                                  WHERE `photo_id` = " . to_sql($photo_id, "Number") . "
                                    AND `user_id` = " . $g_user['user_id'] . ";"
					);
					//updatephoto($g_user['user_id'], $photo_id, $photo_url);
				} else {
					uploadphoto($g_user['user_id'], $photo_name, $description, 0, '', $photo_url);
				}
				redirect('profile_photo.php?t=' . time());
			}
		}

		if ($cmd == "main"){
			User::photoToDefault($photo_id);
			redirect('profile_photo.php');
		}

        if($cmd == 'private' || $cmd == 'public') {
            CProfilePhoto::setPhotoPrivate($photo_id);
            redirect('profile_photo.php');
        }

		if ($cmd == "delete"){
            if ($photo_id)	{
                CProfilePhoto::deletePhoto($photo_id);
			}
			$this->message = "Photo deleted.\\n";
		}

	}

	function parseBlock(&$html)
	{
		global $g;
		global $g_user;
		global $l;

		$cmd = get_param("cmd", "");

		if ($this->message)
		{
			$html->setvar("photo_error_message", $this->message);
			$html->parse("photo_error", true);
		}

		$photo_id = get_param("id", 0);
		if ($photo_id)
		{
			DB::query("SELECT * FROM photo WHERE user_id=" . $g_user['user_id'] . " ORDER BY photo_id ;");
			$founded = false;

			$photo_n = 1;

			while($row = DB::fetch_row())
			{
				if($row['photo_id'] == $photo_id)
				{
					$html->setvar("photo_id", $row['photo_id']);
					$html->setvar("photo_n", $photo_n);
					$html->setvar("user_id", "photo/" . $row['user_id']);
					$html->setvar("photo_name", $row['photo_name']);
					$html->setvar("description", $row['description']);

					$html->setvar("visible", ($row['visible'] == "N" and $g['options']['photo_approval'] == "Y") ? "(pending audit)" : "");

					$html->parse("photo_item", true);
					$html->parse('upload_name', true);

					$founded = true;
				}

				$photo_n++;
			}

			if(!$founded)
				$photo_id = 0;
		}
		else
		{
            $html->setvar("photo_id", "0");
		}

		if(!$photo_id)
		{
			DB::query("SELECT photo_id FROM photo WHERE user_id=" . $g_user['user_id'] . " ORDER BY photo_id ;");
			$photo_id = DB::num_rows() + 1;

			$html->setvar("photo_n", $photo_id);
			//$html->setvar("user_id", "photo/" . $row['user_id']);


			$photo_name = get_param("photo_name", "");
			$description = get_param("description", "");
			$photo_url = get_param("photo_url", "");
			$html->setvar("photo_name", $photo_name ? $photo_name : l('photo_title'));
			$html->setvar("description", $description ? $description : l('description'));
			$html->setvar("photo_url", $photo_url ? $photo_url : l('file_url'));

			$html->parse("new_photo_item", true);
			$html->parse('new_upload_name', true);
            $html->parse("upload_from_file", true);
            $html->setvar('max_size', str_replace('{size}', Common::getOption('photo_size'), l('Max size')));
            $html->parse('file_upload_fields');
		}

		parent::parseBlock($html);
	}
}

g_user_full();
$page = new CPhoto("", $g['tmpl']['dir_tmpl_mobile'] . "profile_photo_edit.html");
$header = new CHeader("header", $g['tmpl']['dir_tmpl_mobile'] . "_header.html");
$page->add($header);
$footer = new CFooter("footer", $g['tmpl']['dir_tmpl_mobile'] . "_footer.html");
$page->add($footer);

include("./_include/current/profile_menu.php");
$profile_menu = new CProfileMenu("profile_menu", $g['tmpl']['dir_tmpl_mobile'] . "_profile_menu.html");
$profile_menu->setActive('photos');
$page->add($profile_menu);

$user_menu = new CUserMenu("user_menu", $g['tmpl']['dir_tmpl_mobile'] . "_user_menu.html");
$user_menu->setActive('photos');
$page->add($user_menu);

include("./_include/core/main_close.php");

?>
