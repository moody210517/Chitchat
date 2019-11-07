<?php
$g['mobile_redirect_off'] = true;
include('../../../_include/core/main_start.php');

//$_POST = json_decode('{"panoId":"PfJfRRHzfN-M1R4i7lDqzw","w":"13","h":"7","zoom":"4","maxW":"16384","maxH":"16384"}', true) ;
$panoId = get_param('panoId');
$keyMap = get_param('keyMap');
$zoom = get_param('zoom');
$w = intval(get_param('w'));
$h = intval(get_param('h'));

//file_put_contents('debug', json_encode($_POST));
$pathPano = $g['path']['url_files_city'] . 'city/pano_cache/';
if (file_exists("{$pathPano}{$panoId}_{$zoom}_0.jpg")) {
    exit();
}

$maxW = intval(get_param('maxW'));
$maxH = intval(get_param('maxH'));

$widths = array(416, 832, 1664, 3328, 6656);
$heights = array(416, 416, 832, 1664, 3328);

$_wc = ceil($widths[$zoom] / $maxW);
$_hc = ceil($heights[$zoom] / $maxH);
$paramKeyMap = $keyMap ? '&key=' . $keyMap : '';

$pano = array();
for ($y = 0; $y < $_hc; $y++) {
    for ($x = 0; $x < $_wc; $x++) {
        $width = ($x < ($_wc - 1)) ? $maxW : $widths[$zoom] - ($maxW * $x);
        $height = ($y < ($_hc - 1)) ? $maxH : $heights[$zoom] - ($maxH * $y);
        $pano[] = imageCreateTrueColor($width, $height);
    }
}

for ($y = 0; $y < $h; $y++) {
    for ($x = 0; $x < $w; $x++) {
        $file = "{$pathPano}{$panoId}_{$zoom}_{$x}_{$y}.jpg";
        if ($img = imageCreateFromJpeg($file)) {
            $_x = $x * 512;
            $_y = $y * 512;
            $px = floor($_x / $maxW);
            $py = floor($_y / $maxH);
            $_x-= $px * $maxW;
            $_y-= $py * $maxH;
            imagecopy($pano[$py * $_wc + $px], $img, $_x, $_y, 0, 0, 512, 512);

            imagedestroy($img);
            unlink($file);
        }
    }
}

foreach ($pano as $n => $_texture) {
	$texture = imageCreateTrueColor(4096, 2048);
	imagecopyresized($texture, $_texture, 0,0,0,0, 4096, 2048, $widths[$zoom], $heights[$zoom]);
    imagejpeg($texture, "{$pathPano}{$panoId}_{$zoom}_{$n}.jpg");
    imagedestroy($texture);
    imagedestroy($_texture);
}