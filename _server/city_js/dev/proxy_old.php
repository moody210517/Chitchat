<?php
include('../../../_include/core/main_start.php');
set_time_limit(3600);
//ini_set('implicit_flush', true);
//ob_implicit_flush(true);
//ini_set('memory_limit','1024M');
include('hash.php');

$url = urldecode(get_param('url'));

$hash = get_param('hash');
if($hash != get_hash($url)) {
	//file_put_contents('debug', 'bad_hash: '.$url);
	exit();
}

function get_headers_info($url) {
    $r = get_headers($url);
    $headers = array();
    foreach($r as $header) {
        $header = trim($header);
        if ($header) {
            if (strpos($header, 'Content-Length:') === 0) {
                //$headers[] = $header;
            }
            if (strpos($header, 'Content-Type:') === 0) {
                $headers[] = $header;
                //break;
            }
        }
    }
    return $headers;
}
$fileHeaders = get_headers_info($url);

//file_put_contents('debug', $_SERVER['HTTP_RANGE']);

//ob_start();
if (isset($_SERVER['HTTP_RANGE'])) {
	$opts['http']['header'] ="Range: ".$_SERVER['HTTP_RANGE'];
}

//$opts['http']['method'] = "HEAD";

//$conh = stream_context_create($opts);

$opts['http']['method'] = "GET";

//file_put_contents('debug', $_SERVER['HTTP_RANGE']);

//file_put_contents('debug', $http_response_header);

//$out[] = file_get_contents($url, false, $conh);

//$out[] = $http_response_header;

//ob_end_clean();

//$fileHeaders[] = 'Cache-Control: must-revalidate, post-check=0, pre-check=0';
//$fileHeaders[] = 'Pragma: no-cache';
array_map('header', $fileHeaders);

$cong = stream_context_create($opts);

readfile($url, false, $cong);

//@ob_flush();
//flush();

include('../../../_include/core/main_close.php');
