<?php
/* (C) Websplosion LTD., 2001-2014

IMPORTANT: This is a commercial software product
and any kind of using it must agree to the Websplosion's license agreement.
It can be found at http://www.chameleonsocial.com/license.doc

This notice may not be removed from the source code. */
//� ������ �� ������ �������� ����������: $enemyLogin (����� ���������), $myLogin (����� ������). ������ ����� ������ $_POST
include('common.php');
$ok=1;


DB::query("SELECT * FROM $t_name WHERE login =".to_sql($_POST['enemyLogin']));
$num=DB::num_rows();

//var_dump($yes);
//echo "c1=".count($yes)."&z=".$query."&";
if ($num==1) {
	//��� ���������� ������ ��� ����
        DB::query("SELECT * FROM $t_name WHERE login =".to_sql($_POST['enemyLogin']));
	$yes=DB::fetch_row();
	$enemy_time=$yes['time_in'];
	$inGame=$yes['ingame'];
	if ($inGame=="yes") {
		DB::execute("UPDATE $t_name SET ingame='no' WHERE login=".to_sql($_POST['enemyLogin']));
	}
} else {
	$inGame="no";
}
DB::query("SELECT * FROM $t_name WHERE login =".to_sql($_POST['myLogin']));
$num=DB::num_rows();

//echo "c2=".count($yes)."&";
if ($num==1) {
        DB::query("SELECT * FROM $t_name WHERE login =".to_sql($_POST['myLogin']));
	$yes=DB::fetch_row();
	$mytime=$yes['time_in'];
} else {
	$ok=0;
}
if ($mytime<$enemy_time) {
	$isWhite=1;
} else {
	$isWhite=0;
}
//��� ��� ����� ��� ������. �������� ������� � �������� �� ������!
echo "isOK=".$ok."&isWhite=".$isWhite."&ingame=".$inGame."&t1=".$mytime."&t2=".$enemy_time;
?>