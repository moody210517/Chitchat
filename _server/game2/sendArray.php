<?php

/* (C) Websplosion LTD., 2001-2014

IMPORTANT: This is a commercial software product
and any kind of using it must agree to the Websplosion's license agreement.
It can be found at http://www.chameleonsocial.com/license.doc

This notice may not be removed from the source code. */

//�������� $massiv - ��� ������ (������ ������ ��������������� � ������) � $activeLogin
include('common.php');
$now_time=time();

DB::execute("UPDATE ".$t_name." SET time_in='".$now_time."', massiv=".to_sql($massiv)." WHERE login=".to_sql($activeLogin));
//������� ��
echo "isOk='ok'";

?>