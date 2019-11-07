<?php
/* (C) Websplosion LTD., 2001-2014

IMPORTANT: This is a commercial software product
and any kind of using it must agree to the Websplosion's license agreement.
It can be found at http://www.chameleonsocial.com/license.doc

This notice may not be removed from the source code. */
//�������� ���������� ������ ���� $myEnemy (����� ���������)
include('common.php');

$ok=1;

DB::query("SELECT * FROM $t_name WHERE login =".to_sql($_POST['myEnemy']));
$num=DB::num_rows();
if ($num==1) {
        DB::query("SELECT * FROM $t_name WHERE login =".to_sql($_POST['myEnemy']));
	$yes=DB::fetch_row();
	//��� ����� ��� ��� ����
	$enemy_active=$yes['active'];
	$enemy_hod=$yes['hod_data'];
} else {
	$ok=0;
}
//��� �����
echo "enemyActive=".$enemy_active."&hod=".$enemy_hod."&isOK=".$ok;
?>