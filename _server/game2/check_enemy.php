<?php
/* (C) Websplosion LTD., 2001-2014

IMPORTANT: This is a commercial software product
and any kind of using it must agree to the Websplosion's license agreement.
It can be found at http://www.chameleonsocial.com/license.doc

This notice may not be removed from the source code. */
//�������� ���������� $myEnemy (����� ���������) � $myLogin (����� ������)
include('common.php');


DB::query("SELECT * FROM ".$t_name." WHERE login =".to_sql($myEnemy));
$yes = DB::fetch_row();
//��� ����� ��� ��� ���� (������ ���� ���������� � ����� ��� ������)
$enemy_pole=$yes['massiv'];
$enemy_time=$yes['time_in'];
//� ������ ������ ����� ����� ������
DB::query("SELECT * FROM ".$t_name." WHERE login =".to_sql($myLogin));
$yes = DB::fetch_row();
//��� ����� ��� ��� ���� (����� ��� ������)
$my_time=$yes['time_in'];
//���� �������� ��� �������� ��� ������� (������ �� ������), �� ������� ����� ������ ����� � ������ �������� (��� ���) ���� ��� ������
if ($enemy_pole<>null) {
	if ($enemy_time>=$my_time) {
		DB::execute("UPDATE ".$t_name." SET active='yes' WHERE login=".to_sql($myEnemy));
		DB::execute("UPDATE ".$t_name." SET active='no' WHERE login=".to_sql($myLogin));
		echo "enemyMasPole=".$enemy_pole."&whoActive=enemy";
	} else {
		DB::execute("UPDATE ".$t_name." SET active='no' WHERE login=".to_sql($myEnemy));
		DB::execute("UPDATE ".$t_name." SET active='yes' WHERE login=".to_sql($myLogin));
		echo "enemyMasPole=".$enemy_pole."&whoActive=hero";
	}
} else {
echo "enemyMasPole=null";
}

?>