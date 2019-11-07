<?php
/* (C) Websplosion LTD., 2001-2014

IMPORTANT: This is a commercial software product
and any kind of using it must agree to the Websplosion's license agreement.
It can be found at http://www.chameleonsocial.com/license.doc

This notice may not be removed from the source code. */

$g['to_root'] = "../../";
include($g['to_root'] . "_include/core/main_start.php");

$action = get_param('action');
$uid = get_param('uid');
if($action == 'xml') {
    echo User::getUserEditorXml($uid);
} else {
    if(guid()) {
        $xmlPrev = User::getUserEditorXml(guid());
        $xmlNext = get_param('xmldata');

        $pattern = '/\<obj type=\"background\"(.*)\/\>/';

        preg_match_all($pattern, $xmlNext, $matches);
        if (isset($matches[0])) {

            $backgrounds = implode("\n", $matches[0]);

            foreach ($matches[0] as $bg) {
                $xmlNext = str_replace($bg, '', $xmlNext);
            }

            $xmlNext = str_replace('</objects>', $backgrounds . "\n</objects>", $xmlNext);
        }

        User::updateUserEditorXml(guid(), $xmlNext);

        User::flashProfileFilesDelete($xmlPrev, $xmlNext);
    }
}

include($g['to_root'] . "_include/core/main_close.php");