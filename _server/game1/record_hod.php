<?php

/* (C) Websplosion LTD., 2001-2014

IMPORTANT: This is a commercial software product
and any kind of using it must agree to the Websplosion's license agreement.
It can be found at http://www.chameleonsocial.com/license.doc

This notice may not be removed from the source code. */

//������ ���������� ��� ������ � ��. ��������: $x0Hod, $nowXHod, $nowZernoX, $angleHod, $silaHod, $popalHod, $upalHod, $loginHod, $enemyHod
include('common.php');


//���������� ��� � ������ ����������
DB::execute("UPDATE users SET x0=".to_sql($x0Hod).", nowX=".to_sql($nowXHod).", zernoX=".to_sql($nowZernoX).", angle=".to_sql($angleHod).", sila=".to_sql($silaHod).", popal=".to_sql($popalHod).", upal=".to_sql($upalHod).", active='no' WHERE login=".to_sql($loginHod));
//������ ��������
DB::execute("UPDATE users SET active='yes' WHERE login=".to_sql($enemyHod));

//������� ������ ��� ��� ��
echo "myOk=ok";

?>