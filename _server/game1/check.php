<?php

/* (C) Websplosion LTD., 2001-2014

IMPORTANT: This is a commercial software product
and any kind of using it must agree to the Websplosion's license agreement.
It can be found at http://www.chameleonsocial.com/license.doc

This notice may not be removed from the source code. */

//� ������ �� ������ �������� ����������: $enemyLogin (����� ���������), $myLogin (����� ������). ������ ����� ������ $_POST
include('common.php');



DB::query("SELECT * FROM users WHERE login =".to_sql($enemyLogin));

$yes=DB::fetch_row();
//��� ���������� ������ ��� ����
$enemy_time=$yes['time_in'];
$inGame=$yes['ingame'];
if ($inGame=="yes") {
DB::execute("UPDATE users SET ingame='no' WHERE login=".to_sql($enemyLogin));

}
DB::query("SELECT * FROM users WHERE login =".to_sql($myLogin));
$yes=DB::fetch_row();

$mytime=$yes['time_in'];
//��� ��� ����� ��� ������. �������� ������� � �������� �� ������!
echo "timeEnemy=".$enemy_time."&ingame=".$inGame."&timeMy=".$mytime;
?>