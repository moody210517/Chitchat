<?php
/* (C) Websplosion LTD., 2001-2014

IMPORTANT: This is a commercial software product
and any kind of using it must agree to the Websplosion's license agreement.
It can be found at http://www.chameleonsocial.com/license.doc

This notice may not be removed from the source code. */

$g['to_root'] = "../../";
$g['no_headers'] = true;
include($g['to_root'] . "_include/core/main_start.php");
include($g['path']['dir_main'] . "_include/current/music/tools.php");

header("Content-Type: text/xml; charset=UTF-8");
header('Cache-Control: no-cache, must-revalidate');

class XlmMusic extends CHtmlBlock
{
    function parseBlock(&$html)
    {
        global $g;
        $html->setvar('url_absolute', "http://".str_replace("//", "/", str_replace("_server/editor", "", str_replace("//", "/", str_replace("\\", "", $_SERVER['HTTP_HOST'] . dirname($_SERVER['PHP_SELF']) . "/")))));


        $sql_base = CMusicTools::songs_by_user_sql_base(ipar('id'), null);
        $songs = CMusicTools::retrieve_from_sql_base($sql_base, 50, 0);
        $html->items("audio", $songs);
        parent::parseBlock($html);
    }
}
$page = new XlmMusic("", "./xml_music.html");

include($g['to_root'] . "_include/core/main_close.php");
