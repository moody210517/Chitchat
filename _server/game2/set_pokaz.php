<?php

/* (C) Websplosion LTD., 2001-2014

IMPORTANT: This is a commercial software product
and any kind of using it must agree to the Websplosion's license agreement.
It can be found at http://www.chameleonsocial.com/license.doc

This notice may not be removed from the source code. */

//������ ���������� ��� ���� ������ ��� ���������� � ��. �������� ����������: $activeLogin
include('common.php');

DB::execute("UPDATE ".$t_name." SET pokazal='y' WHERE login=".to_sql($activeLogin));

//�����
echo "myOk=ok";

?>