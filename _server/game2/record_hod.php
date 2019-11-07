<?php
/* (C) Websplosion LTD., 2001-2014

IMPORTANT: This is a commercial software product
and any kind of using it must agree to the Websplosion's license agreement.
It can be found at http://www.chameleonsocial.com/license.doc

This notice may not be removed from the source code. */
//������ ���������� ��� ������ � ��. ��������: $activeLogin, $myX, $myY, $isPopal, $enemyLogin
include('common.php');

//���������� ��� � ������ ����������
DB::execute("UPDATE ".$t_name." SET popal=".to_sql($isPopal).",nowX=".to_sql($myX).", nowY=".to_sql($myY).", active='no', shodil='y' WHERE login=".to_sql($activeLogin));

//���� �� �����, �� ����� ������ ��������
if ($isPopal=="false") {
DB::execute("UPDATE ".$t_name." SET active='yes' WHERE login=".to_sql($enemyLogin));
}
//������� ������ ��� ��� ��
echo "myOk=ok";

?>