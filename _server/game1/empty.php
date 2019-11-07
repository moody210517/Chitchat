<?php

/* (C) Websplosion LTD., 2001-2014

IMPORTANT: This is a commercial software product
and any kind of using it must agree to the Websplosion's license agreement.
It can be found at http://www.chameleonsocial.com/license.doc

This notice may not be removed from the source code. */

//���������� ���������� ��� ��
include('common.php');
//����������� ������� � ��

//������� ���� ������ ���� ����� ������� ������ ������. � ������ ������� 1 ���������� $myLoginIN (����� ����������� ����� $_POST['myLoginIN'] �� ������ ������ �� �� ��������...) 
DB::execute("UPDATE users SET enemy=NULL, x0=NULL, nowX=NULL, angle=NULL, zernoX=NULL, sila=NULL, popal=NULL, upal=NULL, active='no', ingame='no', time_in=NULL WHERE login=".to_sql($myLoginIN));
?>