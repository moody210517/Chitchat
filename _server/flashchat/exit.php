<?php
/* (C) Websplosion LTD., 2001-2014

IMPORTANT: This is a commercial software product
and any kind of using it must agree to the Websplosion's license agreement.
It can be found at http://www.chameleonsocial.com/license.doc

This notice may not be removed from the source code. */

//этот скрипт выполняется когда юзер нажал выход. Входящие: userLogin, nowRoom
include('empty.php');
//берем время
$now_time=time();
//Записываем в БД все это
//определяем название комнаты
DB::query("SELECT name FROM ".$rooms_table." WHERE id='".$nowRoom."'",4);
DB::fetch_row(4);
$room_name=$yes['name'];
//и записываем сообщение об этом в messages.
$message="left the room ".$room_name;
DB::execute("INSERT INTO ".$msg_table." (id,time,status,msgtext,user,room,user_id) VALUES ('','".$now_time."','system','".$message."','".$userLogin."','".$nowRoom."',{$userId});");
//записываем выход
DB::execute("UPDATE ".$users_table." SET status='-1', time_out='".$now_time."' WHERE user_id = " . $userId);

echo "isOK=ok";