<?php
/* (C) Websplosion LTD., 2001-2014

IMPORTANT: This is a commercial software product
and any kind of using it must agree to the Websplosion's license agreement.
It can be found at http://www.chameleonsocial.com/license.doc

This notice may not be removed from the source code. */

//этот скрипт принимает данные из флешки. Входящие: userLogin, newRoom
//он меняет комнату
//сначала проверяем на бан и таймаут
include('empty.php');

$newRoom = get_param('newRoom');

//берем время
$now_time=time();
//Записываем в БД все это
//определяем комнату в которой щас
DB::query("SELECT room FROM ".$users_table." WHERE user_id=" . $userId);

$yes=DB::fetch_row();
$room_number=$yes['room'];
//определяем название комнаты
$room_name= Flashchat::roomName($room_number);
$message=to_sql("left the room ".$room_name, 'Plain');
DB::execute("INSERT INTO ".$msg_table." (id,time,status,msgtext,user,room,user_id) VALUES ('','".$now_time."','system','".$message."','".$userLogin."','".$room_number."',{$userId});");

DB::query("SELECT id FROM ".$msg_table." WHERE time='".$now_time."' AND status='system' AND msgtext='".$message."' AND user_id=" . $userId . " AND room='".$room_number."';",2);

$yes=DB::fetch_row(2);
$id=$yes[0];

//определяем название комнаты в которую заходим
$room_name= Flashchat::roomName($newRoom);
$message=to_sql("joined the room ".$room_name, 'Plain');
DB::execute("INSERT INTO ".$msg_table." (id,time,status,msgtext,user,room,user_id) VALUES ('','".$now_time."','system','".$message."','".$userLogin."','".$newRoom."',{$userId});");
//записываем время
DB::execute("UPDATE ".$users_table." SET room='".$newRoom."' WHERE user_id=" . $userId);
DB::execute("UPDATE ".$users_table." SET time_out='".$now_time."' WHERE user_id=" . $userId);

$enterTime=$now_time;
$lastIDSend=$id-1;
echo "updateList=yes&lastIDSend=".$lastIDSend."&enterTime=".$enterTime;