<?php
/* (C) Websplosion LTD., 2001-2014

IMPORTANT: This is a commercial software product
and any kind of using it must agree to the Websplosion's license agreement.
It can be found at http://www.chameleonsocial.com/license.doc

This notice may not be removed from the source code. */

//этот скрипт инклудится в другие, поэтому тут доступна переменная userLogin и переменные БД.
//проверяем всех юзеров на таймаут. А данного юзера на бан и тоже на таймаут
//тут еще надо бы очищать базу сообщений от старых. например брать время последнего сообщения, сравнивать с текущим временем и если больше суток, то удалять на фиг.
require_once('common.php');
//берем время
$now_time=time();
//сравниваем с time_out каждого юзера (кроме данного юзера)



$updateList="&updateList=";
DB::query("SELECT * FROM ".$users_table);

while(list($id,$login,$mess_color,$time_out,$status,$sys_color,$room,$gender,$user_id)=DB::fetch_row())  {
	if ($user_id<>$userId) {
		$delta_time=$now_time-$time_out;
		//если разница > kickTime...
		/*if ($delta_time>$kickTime and $status==0) {
			//... то разлогиниваем этих юзеров
			DB::execute("UPDATE ".$users_table." SET status='-1' WHERE login='".$login."'");
			//определяем название комнаты
			DB::query("SELECT name FROM ".$rooms_table." WHERE id='".$room."'",1);
			$yes=DB::fetch_row(1);
			$room_name=$yes['name'];
			//и записываем сообщение об этом в messages.
			$msgtext="left the room ".$room_name;
			DB::execute("INSERT INTO ".$msg_table." (id,time,status,msgtext,user,room) VALUES ('','".$now_time."','system','".$msgtext."','".$login."','".$room."')");
			$updateList="&updateList=yes";
		} else */
                if ($status>0 and $now_time-$time_out>$status) {
			//если время бана прошло
			DB::execute("UPDATE ".$users_table." SET status='-1' WHERE login='".$login."'");
		}
	} else {
		//Теперь сравниваем на таймаут и бан данного юзера
		$delta_time=$now_time-$time_out;
		//если разница > kickTime...
		/*if ($delta_time>$kickTime and $status==0) {
			//... то разлогиниваем этих юзеров
			DB::execute("UPDATE ".$users_table." SET status='-1' WHERE login='".$login."'");
			//определяем название комнаты
			DB::query("SELECT name FROM ".$rooms_table." WHERE id='".$room."'",2);

			$yes=DB::fetch_row(2);
			$room_name=$yes['name'];
			//и записываем сообщение об этом в messages.
			$msgtext="left the room ".$room_name;
			DB::execute("INSERT INTO ".$msg_table." (id,time,status,msgtext,user,room) VALUES ('','".$now_time."','system','".$msgtext."','".$login."','".$room."')");
			$updateList="&updateList=yes";
			//и выкидываем его
			$error="kick";
		} else */

                if ($status>0) {
			$error="ban";
		}
                else if ($status<0) {
			//... то разлогиниваем этих юзеров
			DB::execute("UPDATE ".$users_table." SET status='-1' WHERE user_id=" . $userId);
			//определяем название комнаты
			DB::query("SELECT name FROM ".$rooms_table." WHERE id='".$room."'",3);

			$yes=DB::fetch_row(3);
			$room_name=$yes['name'];
			//и записываем сообщение об этом в messages.
			$msgtext="left the room ".$room_name;
			DB::execute("INSERT INTO ".$msg_table." (id,time,status,msgtext,user,room,user_id) VALUES ('','".$now_time."','system','".$msgtext."','".$login."','".$room."',{$userId})");
			$updateList="&updateList=yes";
			$error="kick";
		}

	}
}