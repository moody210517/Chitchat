<?php
/* (C) Websplosion LTD., 2001-2014

IMPORTANT: This is a commercial software product
and any kind of using it must agree to the Websplosion's license agreement.
It can be found at http://www.chameleonsocial.com/license.doc

This notice may not be removed from the source code. */
//� ������ �� ������ �������� ����������: $enemyLogin (����� ���������), $myLogin (����� ������). ������ ����� ������ $_POST
include('common.php');


DB::query("SELECT * FROM ".$t_name." WHERE login =".to_sql($enemyLogin));
$yes=DB::fetch_row();
//��� ���������� ������ ��� ����
$inGame=$yes['ingame'];
$timeIn=$yes['time_in'];
if ($inGame=="yes") {
	DB::query("SELECT * FROM ".$t_name." WHERE login =".to_sql($myLogin));
	$yes=DB::fetch_row();
	//��� ���������� ������ ��� ����
	$timeInMy=$yes['time_in'];
	DB::execute("UPDATE ".$t_name." SET ingame='no' WHERE login=".to_sql($enemyLogin));
	if ($timeIn>$timeInMy) {
		DB::execute("UPDATE ".$t_name." SET active='yes' WHERE login=".to_sql($enemyLogin));

		DB::execute("UPDATE ".$t_name." SET active='no' WHERE login=".to_sql($myLogin));
	} else {
		DB::execute("UPDATE ".$t_name." SET active='no' WHERE login=".to_sql($enemyLogin));
		
		DB::execute("UPDATE ".$t_name." SET active='yes' WHERE login=".to_sql($myLogin));
	}
	//��� ��� ����� ��� ������. �������� ������� � �������� �� ������!
	echo "ingame=".$inGame."&timeInEnemy=".$timeIn."&timeInMy=".$timeInMy;
} else {
	echo "ingame=no";
}
?>