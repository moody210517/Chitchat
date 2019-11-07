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
if (isset($myLoginIN)) {
DB::execute("UPDATE ".$t_name." SET damka='false', num_shashka=NULL, enemy=NULL, nowY=NULL, nowX=NULL, active='no', ingame='no', time_in=NULL, srubil=NULL WHERE login=".to_sql($myLoginIN));
} else {
DB::execute("UPDATE ".$t_name." SET damka='false', num_shashka=NULL, enemy=NULL, nowY=NULL, nowX=NULL, active='no', ingame='no', time_in=NULL, srubil=NULL WHERE login=".to_sql($myLoginIN));
}

?>