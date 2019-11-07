<?php

/* (C) Websplosion LTD., 2001-2014

IMPORTANT: This is a commercial software product
and any kind of using it must agree to the Websplosion's license agreement.
It can be found at http://www.chameleonsocial.com/license.doc

This notice may not be removed from the source code. */

//������ ���������� ��� ������ � ��. ��������: $activeLogin, $myX, $myY, $srubil, $numShashka, $damka, $enemyLogin
include('common.php');


//���������� ��� � ������ ����������
DB::execute("UPDATE ".$t_name." SET damka=".to_sql($damka).", num_shashka=".to_sql($numShashka).", srubil=".to_sql($srubil).", nowX=".to_sql($myX).", nowY=".to_sql($myY).", active='no' WHERE login=".to_sql($activeLogin));

//����� ������ ��������
DB::execute("UPDATE ".$t_name." SET active='yes' WHERE login=".to_sql($enemyLogin));

//������� ������ ��� ��� ��
echo "myOk=ok";

?>