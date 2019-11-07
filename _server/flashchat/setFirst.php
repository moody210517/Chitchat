<?php
/* (C) Websplosion LTD., 2001-2014

IMPORTANT: This is a commercial software product
and any kind of using it must agree to the Websplosion's license agreement.
It can be found at http://www.chameleonsocial.com/license.doc

This notice may not be removed from the source code. */

//этот скрипт принимает данные из флешки при первом заходе. Входящие: userLogin
//берем время
$now_time= time();
include('common.php');

//Записываем в БД все это
DB::query("SELECT * FROM ".$users_table." WHERE user_id = " . $userId);

$defaultLimitMsg = Flashchat::getDefaultLimitMsg();
if (DB::num_rows()==0) {
	$log .= print_r($_POST, 1);
	$log .= print_r($_GET, 1);
	$log .=  'SELECT * FROM user WHERE user_id=' . $userId;
	DB::query('SELECT * FROM user WHERE user_id=' . $userId, 1);
	$u = DB::fetch_row(1);
    //если юзера вообще нет в БД (щас он просто создается, а вообще надо брать из общей БД и добавлять)
    Flashchat::joined();
    //DB::execute("INSERT INTO ".$users_table." (id,login,mess_color,time_out,status,sys_color,room,gender) VALUES (NULL, '".$userLogin."','','".$now_time."','0','','1','" . strtolower($u['gender']) . "');");

     ##$log .= $query;
    //file_put_contents(dirname(__FILE__) . '/log.txt', $log);

     //определяем название комнаты
     $room_name= Flashchat::roomName(1);
     $msgtext = to_sql("joined the room ".$room_name, 'Plain');
     DB::execute("INSERT INTO ".$msg_table." (id,time,status,msgtext,user,room,user_id) VALUES ('','".$now_time."','system','".$msgtext."','".$userLogin."',1,$userId);");

     DB::query("SELECT COUNT(id)
                 FROM " . $msg_table,3);
     $count = DB::fetch_row(3);
     $offset = 0;
     if ($count[0] > $defaultLimitMsg) {
         DB::query("SELECT `id`
                     FROM " . $msg_table
                . " ORDER BY `id` desc LIMIT " . to_sql($defaultLimitMsg, 'Plain') . ", 1",4);
     } else {
         DB::query("SELECT `id`
                     FROM " . $msg_table
                . " LIMIT 1",4);
         if ($count[0] >= 1)
                $offset = 1;
     }

     //$query="SELECT id FROM ".$msg_table." WHERE time='".$now_time."' AND status='system' AND msgtext='".$msgtext."' AND user='".$userLogin."';";
     $yes = DB::fetch_row(4);
     $lastIDSend = $yes[0] - $offset;
} else {
     $yes= DB::fetch_row();
     $delta_time=$now_time-$yes['time_out'];

	DB::query('SELECT * FROM user WHERE user_id = ' . $userId, 1);
	$u=DB::fetch_row(1);

     if ($yes['status']>0) {
          //у юзера бан
          $delta_time=$now_time-$yes['time_out'];
          if ($delta_time>$yes['status']) {
               //время бана прошло
               DB::execute("UPDATE ".$users_table." SET time_out='".$now_time."', status='0', room='1', gender='" . strtolower($u['gender']) . "' WHERE user_id = " . $userId);

               //определяем название комнаты
               $room_name= Flashchat::roomName(1);
               $msgtext = to_sql("joined the room ".$room_name, 'Plain');
               DB::execute("INSERT INTO ".$msg_table." (id,time,status,msgtext,user,room,user_id) VALUES ('','".$now_time."','system','".$msgtext."','".$userLogin."',1,{$userId});");

               DB::query("SELECT COUNT(id)
                           FROM " . $msg_table,3);
               $count = DB::fetch_row(3);
               $offset = 0;

               if ($count[0] > $defaultLimitMsg) {
                    $query = "SELECT `id`
                                FROM " . $msg_table
                           . " ORDER BY `id` desc LIMIT " . to_sql($defaultLimitMsg, 'Plain') . ", 1";
               } else {
                    $query = "SELECT `id`
                                FROM " . $msg_table
                           . " LIMIT 1";
                    if ($count[0] >= 1)
                        $offset = 1;
               }

               //$query="SELECT id FROM ".$msg_table." WHERE time='".$now_time."' AND status='system' AND msgtext='".$msgtext."' AND user='".$userLogin."';";
               DB::query($query,4);
               DB::fetch_row(4);
               $lastIDSend = $yes[0] - $offset;
          } else {
               $error="ban";
                         }
     } else if ($yes['status']==-1 or $yes['status']==0) {
          //его нет в чате, значит заходим
          DB::execute("UPDATE ".$users_table." SET time_out='".$now_time."', status='0', room='1', gender='" . strtolower($u['gender']) . "' WHERE user_id = " . $userId);

          //определяем название комнаты
          $room_name= Flashchat::roomName(1);
          $msgtext = to_sql("joined the room ".$room_name, 'Plain');
          DB::execute("INSERT INTO ".$msg_table." (id,time,status,msgtext,user,room,user_id) VALUES ('','".$now_time."','system','".$msgtext."','".$userLogin."',1,{$userId});");

          DB::query("SELECT COUNT(id)
                      FROM " . $msg_table,3);
          $count = DB::fetch_row(3);
          $offset = 0;

          if ($count[0] > $defaultLimitMsg) {
              $query = "SELECT `id`
                          FROM " . $msg_table
                     . " ORDER BY `id` desc LIMIT " . to_sql($defaultLimitMsg, 'Plain') . ", 1";
          } else {
              $query = "SELECT `id`
                          FROM " . $msg_table
                     . " LIMIT 1";
              if ($count[0] >= 1)
                $offset = 1;
          }

          //$query="SELECT id FROM ".$msg_table." WHERE time='".$now_time."' AND status='system' AND msgtext='".$msgtext."' AND user='".$userLogin."';";
          $result = DB::query($query,4);
          $yes = DB::fetch_row(4);
          $lastIDSend = $yes[0] - $offset;
     }
}
//это чтобы увидеть сообщение о своем же входе
//$lastIDSend = $lastIDSend-1;
$isFirst = true;
$nowRoom = 1;
$enterTime=$now_time;
//выполняем getData.php
include('getData.php');