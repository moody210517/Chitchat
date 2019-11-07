<?php

/* (C) Websplosion LTD., 2001-2014

IMPORTANT: This is a commercial software product
and any kind of using it must agree to the Websplosion's license agreement.
It can be found at http://www.chameleonsocial.com/license.doc

This notice may not be removed from the source code. */

//�������� ���������� ������ ���� $myEnemy (����� ���������)
include('common.php');



DB::query("SELECT * FROM users WHERE login =".to_sql($myEnemy));

$yes=DB::fetch_row();
//��� ����� ��� ��� ����
$enemy_active=$yes['active'];
$enemy_x0=$yes['x0'];
$enemy_nowX=$yes['nowX'];
$enemy_angle=$yes['angle'];
$enemy_sila=$yes['sila'];
$enemy_popal=$yes['popal'];
$enemy_upal=$yes['upal'];
$enemy_zernoX=$yes['zernoX'];
$enemy_time=$yes['time_in'];
//��� �� ������:)
if ($enemy_time==null) $enemy_time="fuck";
//��� �����
echo "enemyActive=".$enemy_active."&x0Hod=".$enemy_x0."&nowXHod=".$enemy_nowX."&angleHod=".$enemy_angle."&silaHod=".$enemy_sila."&popalHod=".$enemy_popal."&upalHod=".$enemy_upal."&zernoX=".$enemy_zernoX."&isOver=".$enemy_time;
?>