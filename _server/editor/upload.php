<?php
/* (C) Websplosion LTD., 2001-2014

IMPORTANT: This is a commercial software product
and any kind of using it must agree to the Websplosion's license agreement.
It can be found at http://www.chameleonsocial.com/license.doc

This notice may not be removed from the source code. */

$g['to_root'] = dirname(__FILE__) . '/../../';
include_once($g['to_root'] . '_include/core/main_start.php');

$name = 'Filedata';

if (isset($_FILES[$name]['name']) and $_FILES[$name]['name']) {

	$uploadDir = Common::getOption('dir_files', 'path') . 'editor/';
	$newName = date('Ymd_His') . '_' . rand(0, 100000) . '_' . substr(md5(basename($_FILES[$name]['name'])), 0, 10);

	$uploadFile = $uploadDir . $newName;
    $img_sz = getimagesize($_FILES[$name]['tmp_name']);
    if (!is_array($img_sz)) {
        die('ERROR');
    }

	$im = new Image();

	if ($im->loadImage($_FILES[$name]['tmp_name'])) {
		$im->saveImage($uploadFile . '.jpg', $g['image']['quality']);
		@chmod($uploadFile . '.jpg', 0644);
                $im->loadImage($_FILES[$name]['tmp_name']);
                $im->saveImage($uploadFile . '_src.jpg', 100);
                @chmod($uploadFile . '_src.jpg', 0644);
                Common::saveFileSize(array($uploadFile . '.jpg', $uploadFile . '_src.jpg'));
	}

	echo '/../../../../' . $g['dir_files'] . 'editor/' . $newName . '.jpg';
}

include_once($g['to_root'] . '_include/core/main_close.php');
