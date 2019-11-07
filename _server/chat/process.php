<?php
/* (C) Websplosion LTD., 2001-2014

IMPORTANT: This is a commercial software product
and any kind of using it must agree to the Websplosion's license agreement.
It can be found at http://www.chameleonsocial.com/license.doc

This notice may not be removed from the source code. */

$area = 'login';
$g['to_root'] = "../../";
include($g['to_root'] . "_include/core/main_start.php");
include("./chat_lib.php");

$mode = get_param("mode", "");

header("Content-type: text/xml; charset=UTF-8");
header('Cache-Control: no-cache, must-revalidate');

$g_chairs_max = 12;
$g_bubble_max = 5;
$g_avatar_max = 15;
$g_suborder = 0;
$g_lastline = '';
$g_sec_old = 10;
$g_sec_idle =2*60;
$g_enter='entered_room';

$nick = $g_user['name'];
$avatar = $g_user['avatar'];
$line = get_param("line", "");
//$room_tag = get_param("room_tag", "sport_center"); #romantic_bar, lovely_battlefield, swimming_pool
$room_tag = get_param("room_tag", getDefaultRooms());
$mode = stripslashes($mode);
//$nick = stripslashes($nick);
//$line = stripslashes($line);
$room_tag = stripslashes($room_tag);

$mode = str_replace("'", "''", $mode);
//$avatar = str_replace("'", "''", $avatar);
$line = str_replace("'", "''", $line);
$room_tag = str_replace("'", "''", $room_tag);

echo '<' . '?xml version="1.0" encoding="UTF-8" ?' . '>';
echo '<chat>';

//$room = getRoomFromTag($room_tag);
$room = $room_tag;

removeDead();
removeIdle($room);
//if (time()%$g_sec_idle<10)
//removeOldLines();

if ($room != 0)
{
	switch ($mode)
	{
		case 'enter':
			handleEnter($nick, $room);
			break;

		case 'update':
			handleUpdate($nick, $line, $room);
			break;
	}
}
/*else
{
	echo '<status success="0">'. $room .'This room does not exist.</status>';
}*/

echo '</chat>';


function getRoomFromTag($room_tag)
{
	global $db;

	$room = 0;
	$query = "SELECT id, name FROM chat_room WHERE tag = '" . $room_tag . "' LIMIT 1";
	$rows = DB::query($query);
	while ($c = DB::fetch_row())
	{
		$room = $c['id'];
	}

	return $room;
}
function removeOldLines()
{
	global $g_sec_idle;
	global $db;
	$past = getDateOffset( $g_sec_idle + 2 );
	$query = "SET @i:=(SELECT id FROM chat_line ORDER BY id DESC LIMIT 5,1); DELETE FROM chat_line WHERE id < @i";
	DB::execute($query);
}
function getDateOffset($secondsOff = 0)
{
	return date( "Y-m-d H:i:s", strtotime( getIsoDate() ) - $secondsOff );
}
function removeDead()
{
	global $db;
	global $g_sec_old;
	global $g_sec_idle;
	global $nick;
	$datenow = getIsoDate();
	$query = "SELECT nick, room, lastbreath, joined, avatar FROM chat_chair ORDER BY position";
	$rows = DB::query($query);
	while ($c = DB::fetch_row()) {
		if ($nick!=$c['nick']) {
			$secondsDiff = getSecondsDiff($c['lastbreath'], $datenow);
			if ($secondsDiff > $g_sec_idle){
				if ($c['lastbreath']==$c['joined']) killNick($c['nick'], $c['room']);
			} elseif ($secondsDiff > $g_sec_old) {
				DB::execute("UPDATE chat_chair SET avatar='100' WHERE nick = '{$c['nick']}' AND room = '{$c['room']}'");
			}
		}
	}
}
function removeIdle($room)
{
	global $g_chairs_max;
	global $avatar;
	global $g_sec_idle;
	global $g_lastline;
	global $db;
	$didRemove = false;

	$datenow = getIsoDate();
	$query = "SELECT lastbreath, nick FROM chat_chair WHERE room = '$room' " .
			"ORDER BY lastbreath DESC LIMIT $g_chairs_max";

	DB::query($query);
	while ($c = DB::fetch_row())
	{
		$secondsDiff = getSecondsDiff($c['lastbreath'], $datenow);
		if ($secondsDiff > $g_sec_idle) killNick($c['nick'], $room);
	}

	return $didRemove;
}
function killNick($nick, $room)
{
	global $db;
	DB::execute("DELETE FROM chat_chair WHERE nick = '$nick' AND room = '$room'");
	DB::execute("DELETE FROM chat_line WHERE nick = '$nick' AND room = '$room'");
}
function getSecondsDiff($datetime1, $datetime2)
{
	$sec1 = strtotime($datetime1);
	$sec2 = strtotime($datetime2);
	return abs($sec1 - $sec2);
}
function handleEnter($nick, $room)
{

	if (sitChair($nick, $room)) {
		echo '<status success="1">OK</status>';
	} else {
		echo '<status success="0">This room is already full</status>';
	}
}
function getFreeChair($nick, $room) {
	global $db;
	$arr_order = array(6, 7, 5, 8, 4, 9, 3, 10, 2, 11, 1, 12);
	foreach ($arr_order as $o)
	{
		$query = "SELECT nick FROM chat_chair WHERE position = '$o' AND room = '$room'";
		$rows = DB::query($query);
		if (DB::num_rows() == 0) return $o;
	}
	return 0;
}
function sitChair($nick, $room) {
	global $g_enter;
	global $avatar;
	global $db;
	$query = "SELECT position FROM chat_chair WHERE nick = '$nick' AND room = '$room'";
	$pos = DB::result($query);
	if ($pos) {
		DB::execute("UPDATE chat_chair SET avatar='$avatar' WHERE nick = '$nick' AND room = '$room'");
		handleUpdate($nick, '', $room);
		return $pos;
	}
	$pos=getFreeChair($nick, $room);
	$datenow = getIsoDate();
	$query = "DELETE FROM chat_chair WHERE nick = '$nick' AND position = '0'";
	DB::execute($query);
	$query = "INSERT INTO chat_chair (position, joined, avatar, nick, lastbreath, room)" .
			"VALUES ('$pos', '$datenow', '$avatar', '$nick', '$datenow', '$room')";
	DB::execute($query);
	handleUpdate($nick, $g_enter, $room);
	return $pos;
}
function handleUpdate($nick, $line, $room)
{
	global $db;
	global $g_chairs_max;
	global $g_bubble_max;
	global $g_sec_idle;
	global $g_lastline;
	global $g_enter;
	global $avatar;
    global $p;

	$query = "UPDATE chat_chair SET lastbreath='".getIsoDate()."', avatar='$avatar' WHERE nick='$nick' AND room='$room'";
	DB::execute($query);

	if ($line != '')
	{
		if ($line != $g_lastline || $line == '!ask' || $line == '!hint' || $line == '!answer')
		{
			addLine($nick, strip_tags($line), $room);
		}
	}

	$avatars = array();
	$arr_taken = array();
	$arr_nickpos = array();
	for ($i = 1; $i <= $g_chairs_max; $i++)
	{
		$arr_taken[$i] = false;
	}

	$joined = '';
	$query = "SELECT position, joined, avatar, nick FROM chat_chair " .
			"WHERE room = '$room' ORDER BY position ASC";
	$rows = DB::query($query);
	while ($c = DB::fetch_row()) {
		$avatars[$c['nick']]=$c['avatar'];
		$sYou = '';
		if ($c['nick'] == $nick)
		{
			$joined = $c['joined'];
			$sYou = '';
		}
		$arr_taken[$c['position']] = true;
		$arr_nickpos[$c['nick']] = $c['position'];
		echo '<chair position="' . $c['position'] . '" avatar="' . $c['avatar'] . '" nick="' . misc_toAttribute($c['nick']) . $sYou . '" />';
	}
	for ($i = 1; $i <= $g_chairs_max; $i++)
	{
		if (!$arr_taken[$i])
		{
			echo '<chair position="' . $i . '" avatar="0" nick="" />';
		}
	}

	$arr_taken_bubble = array();
	// for ($i = 1; $i <= $g_bubble_max; $i++)
	// {
		// $arr_taken_bubble[$i] = false;
	// }

	$query = "SELECT nick, line, timesaid, id FROM chat_line " .
			"WHERE room = '$room' " .// AND timesaid >= '$joined'
			"ORDER BY id DESC LIMIT $g_bubble_max";
	$rows = DB::query($query);
	$bubbleCount = 0; $response="";
	while ($c = DB::fetch_row())
	{
		$bubbleN = ($g_bubble_max - $bubbleCount++);
		$line=misc_toXml($c['line']);
		if ($c['line']!=$g_enter || getSecondsDiff($c['timesaid'], getIsoDate())<$g_sec_idle)
 $arr_taken_bubble[$c['nick']] = true;
		$nickPos = isset($arr_nickpos[$c['nick']]) ? $arr_nickpos[$c['nick']] : 0;
		$response = "
<chatline position=\"".misc_toAttribute($nickPos)."\" bubble=\"$bubbleN\" time=\"{$c['id']}\"
 nick=\"".misc_toAttribute($c['nick'])."\">$line</chatline>".$response;
		//$avatars[$c['nick']]++;
	}
	foreach ($avatars as $ni=>$av) {
		if ($av==100&&!isset($arr_taken_bubble[$ni])) killNick($ni, $room);
	}

	// for ($i = 1; $i <= $g_bubble_max; $i++)
	// {
		// if (!$arr_taken_bubble[$i])
		// {
			// $response.="\n<chatline position=\"0\" bubble=\"$i\" nick=\"\" />";
		// }
	// }
	echo $response;
}
function addLine($nick, $line, $room)
{
	global $g_suborder;
	global $db;

	$g_suborder++;
	$query = 'INSERT INTO chat_line (nick, line, timesaid, room, suborder) ' .
			 'VALUES (' . to_sql($nick) . ', ' .
                          to_sql($line) . ', ' .
                          to_sql(getIsoDate()) . ', ' .
                          to_sql($room, 'Number') . ', ' .
                          to_sql($g_suborder, 'Number') . ')';
	DB::execute($query);
}
function instr($haystack, $needle)
{
	return !( strpos($haystack, $needle) === false );
}


include($g['to_root'] . "_include/core/main_close.php");
die();
