<?php
/* (C) Websplosion LTD., 2001-2014

IMPORTANT: This is a commercial software product
and any kind of using it must agree to the Websplosion's license agreement.
It can be found at http://www.chameleonsocial.com/license.doc

This notice may not be removed from the source code. */

//этот скрипт берет history.
//скрипт получает переменные: userLogin, nowRoom и enterTime (время захода юзера в чат или в комнату)
//сначала проверяем на бан и таймаут
include('common.php');
//3. выбираем из БД из таблицы messages все сообщения, time которых больше чем enterTime и записываем последовательно в переменную (сортировка по времени).
//берем время
$now_time=time();
DB::query("SELECT * FROM ".$msg_table." WHERE room='".$nowRoom."' AND time>=".$enterTime." ORDER BY time;");

//цикл
$msgs="msgs=";
while(list($id,$time,$status,$msgtext,$user)=DB::fetch_row())  {
	$formatTime=strftime("<b>[%H.%M</b> <b>%d.%m.%y]</b>",$time);
	$msgs = $msgs.$formatTime." <b>".$user."</b>: ".$msgtext." *-*";
}
if ($msgs=="msgs=") {
	$msgs="msgs=empty";
} else {
	$len=strlen($msgs);
	$msgs=strip_tags(substr($msgs,0,$len-3));

};
echo $msgs;