<?php
include('../../../_include/core/main_start.php');
include('hash.php');

$urlVideo = get_param('id');
if (!$urlVideo) {
    //Клиентcкая часть не должена пропустить пустое но чтоб наверняка, если пустой параметр и дальше чтоб не дёргаться
    //set_video_error
}
preg_match('/(?:^|\/|v=)([\w\-]{11,11})(?:\?|&|#|$)/', $urlVideo, $urlBgVideoCode);
$isVideoCodeError = false;
if (!isset($urlBgVideoCode[1])) {
    $isVideoCodeError = true;
} else {
    $code = array($urlBgVideoCode[1]);
    $url='http://www.youtube.com/oembed?url=youtu.be/' . $urlBgVideoCode[1];
    $oembed_text=@file_get_contents($url);
    if ($oembed_data=json_decode($oembed_text, true)) {
        $ratio = 1.778;
        $width = 0;
        $height = 0;
        if (isset($oembed_data['width'])) {
            $width = $oembed_data['width'];
        }
        if (isset($oembed_data['height'])) {
            $height = $oembed_data['height'];
        }
        if ($width && $height) {
            $ratio = round($oembed_data['width']/$oembed_data['height'], 3);
        }
        $code['code'] = $urlVideo;
        $code['ratio'] = $ratio;
        $code['width'] = $width;
        $code['height'] = $height;
    } else {
        $isVideoCodeError = true;
    }
}
if ($isVideoCodeError) {
    //The video has been removed or disallowed to be played
    //нужно вернуть мне что видео нельзя воспроисзвести какой нить set_video_error
} else {
    //Может придётся в базу схранять наверное
    //вернуть после запуска видео типа set_video_play чтоб я убрал плашку
}

$videoDefaultImages = array('hqdefault.jpg', 'maxresdefault.jpg');//'mqdefault.jpg', 'sddefault.jpg'
$pathImg = 'http://i.ytimg.com/vi/' . $code[0] . '/';
$urlDefaultImage = '';
foreach ($videoDefaultImages as $value) {
    $urlImage = $pathImg . $value;
    $file_headers = @get_headers($urlImage);
    if (mb_strpos($file_headers[0], 'Not Found', 0, 'UTF-8') === false) {
        $urlDefaultImage = $urlImage;
        break;
    }
}
//$urlDefaultImage заставка для видео если есть

$row_info = file_get_contents('http://www.youtube.com/get_video_info?html5=1&video_id=' . $code[0]);
$info = explode('&', $row_info);

if(strpos($_SERVER['HTTP_USER_AGENT'], 'Firefox')!==false){
	$format = 'webm';
}
else {
	$format='mp4';
}

foreach ($info as $value) {
	if(strpos($value, 'adaptive_fmts')!==false) {
		$fmts_info = explode('&', urldecode($value));
		//print_r($size_info);
		$data = [];


		foreach ($fmts_info as $value) {
			if(strpos($value, 'size=')===0) {
				if(!isset($data['size'])) {
					$data['size'] = explode('x', str_replace('size=', '', $value));
				}


			}

			if(strpos($value, 'url=')===0) {
				if(!isset($data['url']) && strpos($value, 'mime%3Dvideo%252F'.$format)!==false) {
					$data['url'] = str_replace('url=', '', $value);
					$data['video_hash']=get_hash(urldecode(urldecode($data['url'])));
					//file_put_contents('video', urldecode($data['url']));
				}

				if(!isset($data['audio']) && strpos($value, 'mime%3Daudio%252F'.$format)!==false) {
					$data['audio'] = str_replace('url=', '', $value);
					$data['audio_hash'] = get_hash(urldecode(urldecode($data['audio'])));
					//file_put_contents('audio', urldecode(urldecode($data['audio'])));
				}


			}
		}
		echo json_encode($data);
		break;
	}
}

include('../../../_include/core/main_close.php');
