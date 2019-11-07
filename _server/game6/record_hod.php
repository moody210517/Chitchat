<?php
/* (C) Websplosion LTD., 2001-2014

IMPORTANT: This is a commercial software product
and any kind of using it must agree to the Websplosion's license agreement.
It can be found at http://www.chameleonsocial.com/license.doc

This notice may not be removed from the source code. */
//������ ���������� ��� ������ � ��. ��������: $hodData, $loginHod, $enemyHod
include('common.php');


//���������� ��� � ������ ����������
$query="UPDATE $t_name SET hod_data=".to_sql($_POST['hodData']).", active='no' WHERE login=".to_sql($_POST['loginHod']);
DB::execute($query);
//������ ��������
$query="UPDATE $t_name SET active='yes' WHERE login=".to_sql($_POST['enemyHod']);
DB::execute($query);
//������� ������ ��� ��� ��
echo "isOK=1";

?>