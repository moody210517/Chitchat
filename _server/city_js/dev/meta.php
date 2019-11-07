<?php
$urlMainStart = '../../../_include/core/main_start.php';
$formats = array('mp4' => array(37,22,18), 'webm' => array(45,44,43));
$urlSite = '';
if(file_exists($urlMainStart)) {
    include($urlMainStart);
    $urlSite = Common::urlSiteSubfolders();
    $option = 'loc_' . get_param('location') . '_quality';
    $quality = Common::getOption($option, '3d_city_video');
    $formatsAll = array('hd1080' => array(0, 37, 45),
                        'hd720' => array(1, 22, 44),
                        'large' => array(1, 22, 44),
                        'medium' => array(2, 18, 43));
    $default = $formatsAll[$quality];
    $i = 1;
    foreach ($formats as $type => $tags) {
        unset($formats[$type][$default[0]]);
        array_unshift($formats[$type], $default[$i++]);
    }
} else {
    function get_param($pn, $dpv = '') {
        $pv = '';
        if (isset($_POST[$pn])) {
            $pv = $_POST[$pn];
        } elseif (isset($_GET[$pn])) {
            $pv = $_GET[$pn];
        } else {
            $pv = $dpv;
        }
        return $pv;
    }

    function url_file_exists(&$url){
        $exists = false;
        if($url) {
            $headers = get_headers($url);
            if(isset($headers[0])) {
                if(stristr($headers[0], '200 OK')) {
                    $exists = true;
                } elseif(stristr($headers[0], '302')) {
                    $len = 9;
                    foreach($headers as $header) {
                        if(strtolower(substr($header, 0, $len)) == 'location:') {
                            $url = trim(substr($header, $len));
                            $exists = true;
                            break;
                        }
                    }
                }
            }
        }
        return $exists;
    }

    function checkCodeYouTubeVideoToDownload($urlVideo, $format, $urlencode = false, $links = null, $formats = null, $urlSite = '') {
    $data = array();
    $errorResponse = array('error_code' => 0, 'reason' => '');
    preg_match('/(?:^|\/|v=)([\w\-]{11,11})(?:\?|&|#|$)/', $urlVideo, $сode);
    if (isset($code[1])) {
        $code = $code[1];
        if ($formats === null) {
            $formats = array('mp4' => array(37,22,18), 'webm' => array(45,44,43));
        }
        if ($links === null) {
            $links = @urlGetContents('http://www.youtube.com/get_video_info?video_id=' . $code . '&el=detailpage');
        }
        if ($links === false) {
            return $errorResponse;
        }
        parse_str($links, $info);
        if ($info['status'] != 'fail') {
            if (isset($info['url_encoded_fmt_stream_map'])) {
                $prepareVideo = explode(',', $info['url_encoded_fmt_stream_map']);
                foreach ($prepareVideo as $video) {
                    parse_str($video, $params);
                    $videoInfo[$params['itag']] = $params;
                }
                foreach ($formats[$format] as $value) {
                    if (isset($videoInfo[$value]) && url_file_exists($videoInfo[$value]['url'])) {
                        $data = $videoInfo[$value];
                        if ($urlencode) {
                            $data['url'] = urlencode($data['url']);
                        }
                        unset($data['fallback_host']);
                        unset($data['itag']);
                        unset($data['quality']);
                        unset($data['s']);
                        break;
                    }
                }
                if ($data) {
                    $data['video_hash'] = '1';
                } else {
                    $data = $errorResponse;
                }
            }
        } else {
            if (isset($info['errorcode'])) {
                $errorResponse['error_code'] = $info['errorcode'];
            }
            if (isset($info['reason'])) {
                $errorResponse['reason'] = $info['reason'];
            }
            $data = $errorResponse;
        }
    }  else {
        $data = $errorResponse;
        $code = explode('site_video:', $urlVideo);
        if (isset($code[1])) {
            global $g;
            $urlVideo = Common::urlSiteSubfolders() . $g['dir_files'] . "/video/{$сode[1]}.mp4";
            if(url_file_exists($urlVideo)){
                $data = array('url' => $urlVideo,
                              'video_hash' => 'site_video',
                              'type' => 'video/mp4; codecs="avc1.64001F, mp4a.40.2"');
            }
        }
    }
    return $data;
    }
}
include('hash.php');

$urlVideo = get_param('id');
$format = 'mp4';
/*$ua = $_SERVER['HTTP_USER_AGENT'];
$isFirefox = mb_stripos($ua, 'Firefox', 0, 'UTF-8') !== false;
$isOpera = mb_stripos($ua, 'Opera', 0, 'UTF-8') !== false
           || (mb_stripos($ua, 'Chrome', 0, 'UTF-8') !== false && mb_stripos($ua, 'OPR', 0, 'UTF-8') !== false);
if ($isFirefox || $isOpera){
    $format = 'webm';
}*/

$response = checkCodeYouTubeVideoToDownload($urlVideo, $format, true, null, $formats);
echo json_encode($response);

$urlMainClose = '../../../_include/core/main_close.php';
if(file_exists($urlMainClose)) {
    include($urlMainClose);
}
