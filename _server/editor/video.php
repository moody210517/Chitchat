<?php
/* (C) Websplosion LTD., 2001-2014

IMPORTANT: This is a commercial software product
and any kind of using it must agree to the Websplosion's license agreement.
It can be found at http://www.chameleonsocial.com/license.doc

This notice may not be removed from the source code. */

$g['to_root'] = "../../";
$g['no_headers'] = true;
include($g['to_root'] . "_include/core/main_start.php");
include($g['path']['dir_main'] . "_include/current/vids/includes.php");

header("Content-Type: text/xml; charset=UTF-8");
header('Cache-Control: no-cache, must-revalidate');

class XlmVideo extends CHtmlBlock
{
    function parseBlock(&$html)
        {
        global $g;
        $html->setvar('url_absolute', "http://".str_replace("//", "/", str_replace("_server/editor", "", str_replace("//", "/", str_replace("\\", "", $_SERVER['HTTP_HOST'] . dirname($_SERVER['PHP_SELF']) . "/")))));
        $html->items("video", CVidsTools::getVideosByUserSite(ipar('id'), '0,50'));
        parent::parseBlock($html);
    }
}
$page = new XlmVideo("", "./xml_video.html");

include($g['to_root'] . "_include/core/main_close.php");
