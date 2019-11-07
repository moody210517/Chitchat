<?php
/* (C) Websplosion LTD., 2001-2014

IMPORTANT: This is a commercial software product
and any kind of using it must agree to the Websplosion's license agreement.
It can be found at http://www.chameleonsocial.com/license.doc

This notice may not be removed from the source code. */

ini_set("upload_max_filesize", "20M");
ini_set("post_max_size", "20M");

if (isset($_FILES['Filedata']['name']) and strtolower(pathinfo($_FILES['Filedata']['name'], PATHINFO_EXTENSION)) === 'mp3') {
	$uploadDir = dirname(__FILE__) . "/sound/";
	$uploadFile = $uploadDir . basename($_FILES['Filedata']['name']);
    move_uploaded_file($_FILES['Filedata']['tmp_name'], $uploadFile);
} else {
    die('ERROR');
}

$file_data = "music.xml";
$data_elements = file($file_data);
$new_data = "";

for ($i=0; $i<count($data_elements); $i++){
	if ($i < count($data_elements) - 1) {
		$new_data .= $data_elements[$i];
	} else {
		$new_data .= " <obj name_=\"" . $_FILES['Filedata']['name'] . "\" src=\"_server/editor/sound/"
                   . $_FILES['Filedata']['name'] . "\" />\r\n";
	}

}
$new_data .= $data_elements[count($data_elements)-1];

$f=fopen($file_data, "w");
fwrite($f, $new_data);
fclose($f);
