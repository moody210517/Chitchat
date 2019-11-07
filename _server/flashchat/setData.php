<?php
//этот скрипт принимает данные из флешки. Входящие: userLogin, lastIDSend , message и status (статус сообщения - 'system' или 'mess'),nowRoom
//сначала проверяем на бан и таймаут
include('empty.php');
//берем время
$now_time=time();
//Записываем в БД все это



DB::execute("INSERT INTO ".$msg_table." (id,time,status,msgtext,user,room,user_id) VALUES ('','".$now_time."','".$status."','".strip_tags($message)."','".$userLogin."','".$nowRoom."',$userId);");

//$query="SELECT id FROM ".$msg_table." WHERE time='".$now_time."' AND status='".$status."' AND msgtext='".$message."' AND user='".$userLogin."';";
//$result=mysql_query($query);
//$yes=mysql_fetch_row($result);
//$lastIDSend=$yes['id'];
//записываем время
DB::execute("UPDATE ".$users_table." SET time_out='".$now_time."' WHERE user_id=" . $userId);

//выполняем getData.php
//$lastIDSend=$lastIDSend-1;
//include('getData.php');
echo "isOK=ok";