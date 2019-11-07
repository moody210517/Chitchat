<?php
/* (C) Websplosion LTD., 2001-2014

IMPORTANT: This is a commercial software product
and any kind of using it must agree to the Websplosion's license agreement.
It can be found at http://www.chameleonsocial.com/license.doc

This notice may not be removed from the source code. */
//�������� ����������  $myEnemy (����� ���������)
include('common.php');


DB::query("SELECT * FROM ".$t_name." WHERE login =".to_sql($myEnemy));
$yes = DB::fetch_row();
//��� ����� ��� ��� ����
$enemy_active=$yes['active'];
$enemy_nowX=$yes['nowX'];
$enemy_nowY=$yes['nowY'];
$enemy_popal=$yes['popal'];
$enemy_time=$yes['time_in'];
$enemy_shodil=$yes['shodil'];
//��� �� ������:)
if ($enemy_time==null) $enemy_time="fuck";
if ($enemy_shodil=="y") {
	DB::execute("UPDATE ".$t_name." SET shodil='n' WHERE login=".to_sql($myEnemy));
	echo "shodil=true&enemyActive=".$enemy_active."&xHod=".$enemy_nowX."&yHod=".$enemy_nowY."&popalHod=".$enemy_popal."&isOver=".$enemy_time;
} else {
	echo "shodil=false";
}

?>