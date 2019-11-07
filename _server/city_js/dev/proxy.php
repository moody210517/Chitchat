<?php
if(file_exists('../../../_include/core/main_start.php')) {
    include('../../../_include/core/main_start.php');
}
else {
    function get_param($param){
        return $_GET[$param];
    }
}
include('hash.php');
set_time_limit(3600);

$url = urldecode(get_param('url'));
$hash = get_param('hash');
if ($hash != get_hash($url)) {
	//file_put_contents('debug', 'bad_hash: '.$url);
	//exit();
}

function getHeadersInfo($url) {
    $r = get_headers($url);
    $headers = array();
    foreach($r as $header) {
        $header = trim($header);
        if ($header) {
            if (strpos($header, 'Content-Length:') === 0
                || strpos($header, 'Content-Type:') === 0) {
                $headers[] = $header;
            }
        }
    }
    return $headers;
}
$headers = getHeadersInfo($url);
//file_put_contents('debug', $headers);

if (isset($_SERVER['HTTP_RANGE'])) {
	$opts['http']['header'] = "Range: " . $_SERVER['HTTP_RANGE'];
}
$opts['http']['method'] = 'GET';
$cong = stream_context_create($opts);


array_map('header', $headers);

if (mb_strpos($_SERVER['HTTP_USER_AGENT'], 'MSIE', 0, 'UTF-8') !== true){
    header('Expires: 0');
    header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
    header("Content-Transfer-Encoding: binary");
    header('Pragma: public');
} else {
    header("Content-Transfer-Encoding: binary");
    header('Expires: 0');
    header('Pragma: no-cache');
}

readfile($url, false, $cong);

if(file_exists('../../../_include/core/main_close.php')) {
    include('../../../_include/core/main_close.php');
}

