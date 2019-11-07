<?php

/* (C) Websplosion LTD., 2001-2014

  IMPORTANT: This is a commercial software product
  and any kind of using it must agree to the Websplosion's license agreement.
  It can be found at http://www.chameleonsocial.com/license.doc

  This notice may not be removed from the source code. */

include("./_include/core/main_start.php");

Common::authRequiredExit();

require_once("./_include/current/events/tools.php");

function do_action() {
    global $g_user;

    $cmd = get_param('cmd');
    $event_id = intval(get_param('event_id'));

    if ($event_id) {
        if ($cmd == "add") {
            CEventsTools::create_event_guest($event_id, intval(get_param('n_friends')));
            Wall::add('event_member', $event_id);
            echo 'ok';
            die();
        } elseif ($cmd == "remove") {
            CEventsTools::delete_event_guest($event_id);
            Wall::remove('event_member', $event_id);
            echo 'ok';
            die();
        }
    }
}

do_action();

include("./_include/core/main_close.php");
?>