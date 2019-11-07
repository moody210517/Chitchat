<?php
$g['mobile_redirect_off'] = true;
include('../../../_include/core/main_start.php');
//$panoId = urlencode(get_param('panoId'));

//file_put_contents('debug', get_param('panoId'));
$panoId = get_param('panoId');
$keyMap = get_param('keyMap');

//$x = intval(get_param('x'));
$y = intval(get_param('y'));
$w = intval(get_param('w'));
$zoom = get_param('zoom');

$pathPano = $g['path']['url_files_city'] . 'city/pano_cache/';

if (file_exists("{$pathPano}{$panoId}_{$zoom}_0.jpg") ) {
    exit();
}

$paramKeyMap = $keyMap ? '&key=' . $keyMap : '';
for ($x = 0; $x < $w; $x++) {
    $file = "{$pathPano}{$panoId}_{$zoom}_{$x}_{$y}.jpg";
    if(file_exists($file) && getimagesize($file)) {
        continue;
    }
    $url = 'https://maps.google.com/cbk?output=tile&panoid=' . $panoId . '&zoom=' . $zoom . '&x=' . $x . '&y=' . $y . $paramKeyMap;
    for ($n = 0; $n < 3; $n++) {

        $result = urlGetContents($url, 'POST');
        /*if (extension_loaded('curl')) {
            $ch = curl_init($url);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
            curl_setopt($ch, CURLOPT_HEADER, 0);
            curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
            curl_setopt($ch, CURLOPT_ENCODING, "");
            curl_setopt($ch, CURLOPT_USERAGENT, $_SERVER['HTTP_USER_AGENT']);
            curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 120);
            curl_setopt($ch, CURLOPT_TIMEOUT, 120);
            curl_setopt($ch, CURLOPT_MAXREDIRS, 10);
            curl_setopt($ch, CURLOPT_REFERER, $_SERVER['HTTP_REFERER']);
            $result = curl_exec($ch);
            curl_close($ch);
        } else {
            $options = array('http' => array('timeout' => $timeout,), 'ssl' => array('verify_peer' => false,),);
            $options['http']['method'] = 'POST';
            $options['http']['header'] = 'Content-type: application/x-www-form-urlencoded';
            $options['http']['content'] = http_build_query($params);
            $context = stream_context_create($options);
            $result = file_get_contents($url, false, $context);
        }*/

        file_put_contents($file, $result);
        if (getimagesize($file)) {
            break;
        } else {
        	usleep(50000);
        }
    }
}