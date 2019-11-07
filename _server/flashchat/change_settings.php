<?php
/* (C) Websplosion LTD., 2001-2014

IMPORTANT: This is a commercial software product
and any kind of using it must agree to the Websplosion's license agreement.
It can be found at http://www.chameleonsocial.com/license.doc

This notice may not be removed from the source code. */

//этот скрипт изменяет в базе юзеров настройки цветов. тут доступна переменная userLogin, newMessColor, newSysColor и переменные БД.
include('common.php');

DB::execute("UPDATE ".$users_table." SET mess_color='".$newMessColor."', sys_color='".$newSysColor."' WHERE user_id=" . $userId);
