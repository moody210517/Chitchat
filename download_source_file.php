<?php
/* (C) Websplosion LTD., 2001-2014

IMPORTANT: This is a commercial software product
and any kind of using it must agree to the Websplosion's license agreement.
It can be found at http://www.chameleonsocial.com/license.doc

This notice may not be removed from the source code. */

$g['mobile_redirect_off'] = true;
$g['no_headers'] = true;
include('./_include/core/main_start.php');

$guid = guid();
$cmd = get_param('cmd');
$id = get_param_int('id');

if($cmd == 'photo' && $id && $guid) {

    $isFileExists = false;

    $fileInfo = DB::select('photo', '`user_id` = ' . to_sql($guid) . ' AND `photo_id` = ' . to_sql($id));

    if($fileInfo) {

        $fileTypes = array(
            'src',
            'b',
        );

        foreach($fileTypes as $fileType) {

            $fileName = $guid . '_' . $id . '_' . $fileType . '.jpg';
            $filePath = Common::getOption('dir_files', 'path') . 'photo/' . $fileName;

            if(!file_exists($filePath)) {
                continue;
            }

            $isFileExists = true;

            header('Content-Type: image/jpeg');
            //header('Content-disposition: attachment; filename="' . $fileName . '"');
            header('Content-Length: ' . filesize($filePath));
            readfile($filePath);
            break;
        }

    }

    if(!$isFileExists) {
        pageNotFound();
    }
}

include("./_include/core/main_close.php");