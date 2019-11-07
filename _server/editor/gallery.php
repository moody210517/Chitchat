<?php
/* (C) Websplosion LTD., 2001-2014

IMPORTANT: This is a commercial software product
and any kind of using it must agree to the Websplosion's license agreement.
It can be found at http://www.chameleonsocial.com/license.doc

This notice may not be removed from the source code. */

$g['to_root'] = "../../";
$g['no_headers'] = true;
include($g['to_root'] . "_include/core/main_start.php");

header("Content-Type: text/xml; charset=UTF-8");
header('Cache-Control: no-cache, must-revalidate');

class XlmGallery extends CHtmlBlock
{
            function parseBlock(&$html)
            {
                        global $g;
                        DB::query("SELECT i.*, a.folder FROM gallery_images AS i INNER JOIN gallery_albums AS a ON i.user_id=a.user_id AND i.albumid=a.id WHERE i.user_id=" . intval(get_param('id')) . "");
                        $ims = array();
                        while($row = DB::fetch_row()) {
                        			if (!in_array($row['filename'], $ims) and file_exists($g['path']['dir_files'] . 'gallery/images/' . $row['user_id'] . '/' . $row['folder'] . '/' . $row['filename'] . '') and file_exists($g['path']['dir_files'] . 'gallery/thumb/' . $row['user_id'] . '/' . $row['folder'] . '/' . $row['filename'] . '')) {
                        						foreach ($row as $k => $v) {
                        									$html->setvar($k, $v);
                        						}
			                                    $html->parse("item", true);
									}
                        			$ims[] = $row['filename'];
                        }
						parent::parseBlock($html);
            }
}
$page = new XlmGallery("", "./xml_gallery.html");

include($g['to_root'] . "_include/core/main_close.php");