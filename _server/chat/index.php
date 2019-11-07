<?php
/* (C) Websplosion LTD., 2001-2014

IMPORTANT: This is a commercial software product
and any kind of using it must agree to the Websplosion's license agreement.
It can be found at http://www.chameleonsocial.com/license.doc

This notice may not be removed from the source code. */

$g['to_root'] = '../../';
$g['path']['url_main'] = '../../';
include($g['to_root'] . "_include/core/main_start.php");
include("./chat_lib.php");

payment_check('3d_chat');

$mode = get_param('mode', '');

if ($g_user['user_id'] == 0) exit;

User::setAvatar();

//$room = get_param("room_tag", "sport_center");
$default = getDefaultRooms();
$room = get_param('room_tag', $default);

//$rooms = array("sport_center","green_airship","lovely_battlefield","swimming_pool","romantic_bar","sunny_coliseum","crowded_casino","parliament","talk_show");

global $p;
$p = 'chat.php';
$urlBg = Common::getOption('url_files', 'path') . '3dchat/';
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
	<meta http-equiv="Content-Type" content="text/html; CHARSET=UTF-8" />
	<title><?php echo l('menu_chat'); ?></title>
	<link rel="stylesheet" href="./default.css<?php echo $g['site_cache']["cache_version_param"];?>" type="text/css" media="screen" />
	<?php
	if(Common::isOptionActive('3d_chat_custom_css', 'template_options')) {
	?>
	<link rel="stylesheet" href="<?php echo Common::getOption('url_tmpl_main', 'tmpl') ?>css/3dchat.css<?php echo $g['site_cache']["cache_version_param"];?>" type="text/css" media="screen" />
	<?php
	}
	?>
	<script type="text/javascript" src="../jquery/jquery-last.js<?php echo $g['site_cache']["cache_version_param"];?>"></script>
</head>
<body topmargin="0" bottommargin="0">
<?php if (empty($default)) echo '<div style="text-align: center; line-height: 426px;">' . l('This room does not exist') . '</div>';?>
<div class="wrap" <?php if (empty($default)) echo 'style="display:none;"';?>>
	<img class="bg" galleryimg=no src="<?php echo $urlBg . $room; ?>.jpg" onload="$(this).fadeTo(500, 1)">
	<div class="bg"> </div>
	<div id="debug" style="z-index: 999; display: none;"></div>

	<input type="hidden" id="nickchoice" value="<?php echo $g_user['name'] ?>" />

	<img class="avatar" id="avatar1" src="" />
	<img class="avatar" id="avatar2" src="" />
	<img class="avatar" id="avatar3" src="" />
	<img class="avatar" id="avatar4" src="" />
	<img class="avatar" id="avatar5" src="" />
	<img class="avatar" id="avatar6" src="" />
	<img class="avatar" id="avatar7" src="" />
	<img class="avatar" id="avatar8" src="" />
	<img class="avatar" id="avatar9" src="" />
	<img class="avatar" id="avatar10" src="" />
	<img class="avatar" id="avatar11" src="" />
	<img class="avatar" id="avatar12" src="" />
	<img class="avatar" id="avatar13" src="" />

	<div class="nick" id="nick1">&nbsp;</div>
	<div class="nick" id="nick2">&nbsp;</div>
	<div class="nick" id="nick3">&nbsp;</div>
	<div class="nick" id="nick4">&nbsp;</div>
	<div class="nick" id="nick5">&nbsp;</div>
	<div class="nick" id="nick6">&nbsp;</div>
	<div class="nick" id="nick7">&nbsp;</div>
	<div class="nick" id="nick8">&nbsp;</div>
	<div class="nick" id="nick9">&nbsp;</div>
	<div class="nick" id="nick10">&nbsp;</div>
	<div class="nick" id="nick11">&nbsp;</div>
	<div class="nick" id="nick12">&nbsp;</div>

	<div class="chatform" id="chatform">
		<div>
		 <input type="text"  maxlength="110" class="chatinput" id="chatinput" onkeypress="checkKey(event)" style="background-image: url(./image/string.gif); width: 741px; font-weight: bold; text-align: center" placeholder="<?php echo l('type_here_and_press_enter_to_send_messages'); ?>" />
		</div>
	</div>
	<div class="bubbles"></div>
</div>
<div id="menu" <?php if (empty($default)) echo 'style="display:none;"';?>>
	<img id="logo" src=image/switch.gif width=106 height=15>
	<img style='display:inline' alt='Switch Room >' src='image/chat-next.png' onclick='goTo("next")'>
	<img style='display:inline; transform:scale(-1, 1); -webkit-transform:scale(-1, 1); filter: flipH()' alt='< Switch Room' src='image/chat-next.png' onclick='goTo("prev")'>
<?php
/*foreach ($rooms as $tag) {
	echo "<a href='?mode=$mode&room_tag=$tag' onclick='return chRoom(\"$tag\")' class='$tag'>" . l($tag) . "</a>\n";
}*/
$roomsAll = DB::select('chat_room', '`status` = 1', 'position');
$rooms = array();
foreach ($roomsAll as $rm) {
    echo "<a href='?mode={$mode}&room_tag={$rm['id']}' onclick='return chRoom(\"{$rm['id']}\")' class='room_{$rm['id']}'>" . l($rm['name']) . "</a>\n";
    $rooms[] = $rm['id'];
}
/*$room_index = array_search($room,$rooms);

if($room_index>7) $room_index = 0;
else $room_index++;*/
?>
	<img id="new" alt="<?php echo l('open_in_new_window');?>" src="image/chat-window.png" onclick="chat_window('../../<?php echo Common::getHomePage(); ?>');"
title="<?php echo l('open_in_new_window');?>">
        <a href="../../<?php echo Common::getHomePage(); ?>" target="_parent"><img id="close" alt="<?php echo l('close_3d_chat');?>" src="image/chat-close.png"
title="<?php echo l('close_3d_chat');?>"></a>
<br /><br />
<span style="font-size:9px; font-weight:normal; "></span>
</div>

<br><br>
<span style="font-size:9px; font-weight:normal; "></span>
</div>

<img <?php if (empty($default)) echo 'style="display:none;"';?>  src=image/logo.gif width=172 height=61 style="position: absolute; left:0px; top: 0px;">

<div id="visitors" style="color: #fde905; position: absolute; left:50px; top: 55px; font-size: 11px; font-weight: bold; z-index:100"></div>
<div id="visitors2" style="color: #ba3b27; position: absolute; left:51px; top: 56px; font-size: 11px; font-weight: bold; z-index:99"></div>

<script type="text/javascript">
var g_room_tag='<?php echo $room; ?>',
    urlBg = '<?php echo $urlBg; ?>',
    rooms = <?php echo json_encode($rooms); ?>,
    l_entered_room = '<?php echo l('entered_room');?>';

if (window.parent==this) {
    $('#new').hide();
    $('#close').click(function(){window.close()});
}
</script>
<script type="text/javascript" src="./dynamic.js<?php echo $g['site_cache']["cache_version_param"] ?>"></script>
</body>
</html>
<?php
$p = 'index.php';
include($g['to_root'] . "_include/core/main_close.php");

