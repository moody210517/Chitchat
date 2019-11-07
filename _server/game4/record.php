<?php
/* (C) Websplosion LTD., 2001-2014

IMPORTANT: This is a commercial software product
and any kind of using it must agree to the Websplosion's license agreement.
It can be found at http://www.chameleonsocial.com/license.doc

This notice may not be removed from the source code. */
//������ ���������� ����������� ����� � ��. �������� ����������: $enemyLogin � $myLogin
include('common.php');
//���������� �����
$now_time=time();


//������� 
DB::execute("UPDATE ".$t_name." SET enemy=NULL, active='no', ingame='no', time_in=NULL, hod_data='empty' WHERE (login=".to_sql($_POST['myLogin'])." AND hod_data!='empty') OR (login=".to_sql($_POST['enemyLogin'])." AND hod_data!='empty')");

//������� ���� �� ���� � ��
DB::query("SELECT 'login' FROM $t_name WHERE login=".to_sql($_POST['myLogin']));

$num=DB::num_rows();
if ($num==0) {
	DB::execute("INSERT INTO $t_name ( id , login , enemy , ingame , time_in , active , hod_data, now_hod) VALUES ('', ".to_sql($_POST['myLogin']).", ".to_sql($_POST['enemyLogin'])." , 'yes', '".$now_time."' , 'no', 'empty', 'login')");
} else {
	DB::execute("UPDATE $t_name SET hod_data='empty', time_in='".$now_time."', enemy=".to_sql($_POST['enemyLogin']).", ingame='yes', active='no' WHERE login=".to_sql($_POST['myLogin']));
}

//�����
echo "isOK=1&t=".$now_time;

?>