<?php
/* (C) Websplosion LTD., 2001-2014

IMPORTANT: This is a commercial software product
and any kind of using it must agree to the Websplosion's license agreement.
It can be found at http://www.chameleonsocial.com/license.doc

This notice may not be removed from the source code. */


//этот скрипт вызывается из флешки каждые х секунд и возвращает сообщения, комнаты, список юзеров.
//скрипт получает переменные: lastIDSend (id последнего полученного сообщения), userLogin (логин юзера) и nowRoom
//сначала проверяем на бан и таймаут
include('empty.php');
//3. выбираем из БД из таблицы messages все сообщения, id которых больше чем lastIDSend и записываем последовательно в переменную (сортировка по времени), плюс берем настройки сообщений у юзеров (цвет)
//берем время
$now_time=time();

$updateLoginTimeout = 20;
$onlineStatusTimeout = $updateLoginTimeout * 3;

Flashchat::updateVisit();

// Fix - exclude my messages
$whereNotMine = '';
if(!isset($isFirst) || $isFirst !== true) {
    $whereNotMine = ' AND (`status` = "system" OR user_id != ' . to_sql(guid()) . ') ';
}

DB::query("SELECT * FROM ".$msg_table." WHERE room=".to_sql($nowRoom)." AND id>".to_sql($lastIDSend). $whereNotMine . " ORDER BY time;",4);

//цикл
$msgs="msgs=";
$statusText="&status=";
$colors="&colors=";

#$listName = 'name=';
#$listTime = 'time=';
#$texts = 'text=';
#$delimiter = '';
$isAll = (isset($isFirst)) ? true : false;
$listName = array();
$listTime = array();
$listText = array();
$delimiter = '*-*';

while(list($id,$time,$status,$msgtext,$user,$room,$user_id)=DB::fetch_row(4))  {
if ($user_id<>$userId || $isAll == true) {
    $formatTime=strftime("<b>[%H.%M %d.%m.%y]</b>",$time);

    $msgtext = Flashchat::translateSystemMessage($msgtext);

    $msgs = $msgs.$formatTime." <b>".$user."</b>: ".urlencode($msgtext)." *-*";
    $statusText=$statusText.$status."*-*";

    $listName[] = $user;
    $listTime[] = $time;
    $listText[] = urlencode($msgtext);

     if ($status=="system") {
          $new_query=DB::query("SELECT * FROM ".$users_table." WHERE user_id = " . $userId, 5);
          $new_yes=DB::fetch_row(5);
          $colors=$colors.$new_yes[5]."*-*";
     } else {
          DB::query("SELECT * FROM ".$users_table." WHERE login=".to_sql($user),5);
          $new_yes=DB::fetch_row(5);
          $colors=$colors.$new_yes[2]."*-*";
     }
$lastIDSend=$id;



}
}
//$ff=fopen("1.txt","w");
//fwrite($ff,$lastIDSend);
if ($msgs=="msgs=") {
	$msgs="msgs=empty";
} else {
	$len=strlen($msgs);
	$msgs=substr($msgs,0,$len-3);
	$len=strlen($statusText);
	$statusText=substr($statusText,0,$len-3);
	$len=strlen($colors);
	$colors=substr($colors,0,$len-3);

}
if (Flashchat::getUpdateUsersList()) {
    $updateList="&updateList=yes";
}

//4. time записываем в time_out данного юзера.
//$query="UPDATE ".$users_table." SET time_out='".$now_time."' WHERE login='".$userLogin."'";
//$result=mysql_query($query);
//5. выбираем из БД все комнаты с названиями => в переменную
DB::query("SELECT * FROM " . $rooms_table . " WHERE `status` = 1 ORDER BY `position`", 4);

$roooms="&nowRooms=";
$i=0;

$p = 'flashchat.php';

while(list($id,$name)=DB::fetch_row(4))  {
	$roooms = $roooms. urlencode(l($name)) ."*-*";
	$i++;
}
$len=strlen($roooms);
$roooms=substr($roooms,0,$len-3);
$msgs=$msgs.$roooms."&kolvoRooms=".$i . $name . $time . $text;
//6. выбираем из БД имена всех юзеров по комнатам.
$sql = 'SELECT login, room, status, gender FROM ' . $users_table . '
    WHERE time_out > ' . to_sql($now_time - $onlineStatusTimeout);
DB::query($sql,4);

$names="&names=";
$userRoom="&userRoom=";
$genders="&genders=";
while(list($login,$room,$status,$gender)=DB::fetch_row(4))  {
	if ($status==0) {
		$names=$names.$login."*-*";
		$userRoom=$userRoom.$room."*-*";
		$genders=$genders.$gender."*-*";
	}
}
if ($names=="&names=") {
	$names="&names=";
	$userRoom="&userRoom=";
} else {
	$len=strlen($names);
	$names=substr($names,0,$len-3);
	$len=strlen($userRoom);
	$userRoom=substr($userRoom,0,$len-3);
	$len=strlen($genders);
	$genders=substr($genders,0,$len-3);
}
$msgs=$msgs.$names.$userRoom;
//определяем в какой комнате щас юзер
DB::query("SELECT * FROM ".$users_table." WHERE user_id = " . $userId, 4);
$yes=DB::fetch_row(4);
$nowRoom="&nowRoom=".$yes[6];
//7. выводим в echo всю эту хрень.
if ($enterTime<>"" and isset($enterTime)) {
	$enterTime="&enterTime=".$enterTime;
	$genders=$genders.$enterTime;
}
echo $msgs.$statusText.$colors.$nowRoom."&error=".$error."&lastIDSend=".$lastIDSend.$updateList.$genders . '&msg_name=' . implode($delimiter, $listName) . '&msg_time=' . implode($delimiter, $listTime) . '&msg_text=' . implode($delimiter, $listText);