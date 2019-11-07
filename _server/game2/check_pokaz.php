<?php
/* (C) Websplosion LTD., 2001-2014

IMPORTANT: This is a commercial software product
and any kind of using it must agree to the Websplosion's license agreement.
It can be found at http://www.chameleonsocial.com/license.doc

This notice may not be removed from the source code. */
//�������� ����������  $myEnemy (����� ���������)
include('common.php');



DB::query("SELECT * FROM ".$t_name." WHERE login =".to_sql($myEnemy));
$yes=DB::fetch_row();
//��� ����� ��� ��� ����
$enemy_pokaz=$yes['pokazal'];

if ($enemy_pokaz=="y") {
	DB::execute("UPDATE ".$t_name." SET pokazal='n' WHERE login=".to_sql($myEnemy));
	echo "pokaz=y";
} else {
	echo "pokaz=n";
}

?>