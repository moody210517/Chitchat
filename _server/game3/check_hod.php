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
$enemy_active=$yes['active'];
$enemy_nowX=$yes['nowX'];
$enemy_nowY=$yes['nowY'];
$enemy_srubil=$yes['srubil'];
$numShashka=$yes['num_shashka'];
$damka=$yes['damka'];
if ($enemy_active=="no") {
	echo "meActive=true&xHod=".$enemy_nowX."&yHod=".$enemy_nowY."&srubil=".$enemy_srubil."&numShashka=".$numShashka."&isDamka=".$damka;
} else {
	echo "meActive=false";
}

?>