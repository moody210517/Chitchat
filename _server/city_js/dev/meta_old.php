<?php
include('hash.php');
$row_info = file_get_contents('http://www.youtube.com/get_video_info?html5=1&video_id='.$_GET['id']);
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
?>
