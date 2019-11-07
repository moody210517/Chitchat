<?php
/* (C) Websplosion LTD., 2001-2014

IMPORTANT: This is a commercial software product
and any kind of using it must agree to the Websplosion's license agreement.
It can be found at http://www.chameleonsocial.com/license.doc

This notice may not be removed from the source code. */

$area = "login";
include("./_include/core/pony_start.php");


$g['to_head'][] = '<link rel="stylesheet" href="'.$g['tmpl']['url_tmpl_mobile'].'css/home.css" type="text/css" media="all"/>';

class CPhoto extends CHtmlBlock
{
	var $user_id;
	var $sMessage = "";

	function action()
	{
	}

	function parseBlock(&$html)
	{
		global $g;
		global $g_user;

		$html->setvar('name', DB::result("SELECT name FROM user WHERE user_id=".to_sql($this->user_id, 'Number')));
		$html->setvar('profile_user_id', $this->user_id);

        $where = '';
        if ($this->user_id != guid() && Common::isOptionActive('photo_approval')) {
            $where = " AND p.visible = 'Y'";
        }

        $sql = 'SELECT p.*, u.gender FROM photo AS p
                    JOIN user AS u ON u.user_id = p.user_id
                WHERE p.user_id = ' . to_sql($this->user_id, 'Number')
                    . ' ' . CProfilePhoto::wherePhotoIsVisible('p')
                    . $where . "
                ORDER BY p.photo_id ASC";

		DB::query($sql);

        $num_photos = DB::num_rows();

		if (($num_photos + 1) % 2 == 0) {
            $num_photos++;
        } elseif($num_photos > 3) {
            //$num_photos += 2;
        }

        if($num_photos < 4) {
            $num_photos = 4;
        }

		for ($i = 1; $i <= $num_photos; $i++)
		{
			$html->setvar("numer", $i);
			$html->setvar("photo_index", $i);

			if ($row = DB::fetch_row())
			{
				$html->setvar("photo_id", $row['photo_id']);
				$html->setvar("user_id", "photo/" . $row['user_id']);
				$html->setvar("photo_name", $row['photo_name']);
				$html->setvar("description", nl2br($row['description']));
				$html->setvar('photo', User::getPhotoFile($row, 's', $row['gender']));
				$html->setvar('photo_b', User::getPhotoFile($row, 'b', $row['gender']));

				$html->setvar("visible", ($row['visible'] == "N" and $g['options']['photo_approval'] == "Y") ? "(pending audit)" : "");

				if (($i + 1) % 2 == 0) {
				$html->parse("photo_odd", true);
				}
				else $html->setblockvar("photo_odd", "");

				if ($i % 2 == 0) {
					$html->parse("photo_even", true);
				}
				else $html->setblockvar("photo_even", "");

				$html->parse("photo_item", true);

			}
			else
			{
				$html->setvar("photo_id", "");
				$html->setvar("user_id", "");
				$html->setvar("photo_name", "");
				$html->setvar("description", "");

				$html->setvar("visible", "");

				$html->setvar("orientation", $g_user['orientation']);

				if (($i + 1) % 2 == 0) $html->parse("nophoto_odd", true);
				else $html->setblockvar("nophoto_odd", "");

				if ($i % 2 == 0) $html->parse("nophoto_even", true);
				else $html->setblockvar("nophoto_even", "");

				$html->parse("nophoto_item", true);

			}

		}

		//$html->parse("photo_edit", true);

		parent::parseBlock($html);
	}
}

g_user_full();
$user_id = get_param('user_id', $g_user['user_id']);
$page = new CPhoto("", $g['tmpl']['dir_tmpl_mobile'] . "profile_view_photos.html");
$page->user_id = $user_id;
$header = new CHeader("header", $g['tmpl']['dir_tmpl_mobile'] . "_header.html");
$page->add($header);
$footer = new CFooter("footer", $g['tmpl']['dir_tmpl_mobile'] . "_footer.html");
$page->add($footer);

$user_menu = new CUserMenu("user_menu", $g['tmpl']['dir_tmpl_mobile'] . "_user_menu.html");
$page->add($user_menu);

include("./_include/core/main_close.php");

?>