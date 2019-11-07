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

DB::execute("UPDATE users SET time_in=".to_sql($now_time).", enemy=".to_sql($enemyLogin).", ingame='yes' WHERE login=".to_sql($myLogin)."");

//���������� ��� ������

DB::query("SELECT * FROM users WHERE login =".to_sql($myLogin));
$yes = DB::fetch_row();
$myGender=$yes['gender'];

//���������� ��� ���������

DB::query("SELECT * FROM users WHERE login =".to_sql($enemyLogin),1);

$yes=DB::fetch_row(1);
$enemyGender=$yes['gender'];

//�����
echo "mygender=".$myGender."&enemygender=".$enemyGender;

?>