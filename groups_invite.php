<?php

/* (C) Websplosion LTD., 2001-2014

  IMPORTANT: This is a commercial software product
  and any kind of using it must agree to the Websplosion's license agreement.
  It can be found at http://www.chameleonsocial.com/license.doc

  This notice may not be removed from the source code. */
include("./_include/core/main_start.php");
require_once(__DIR__ . '/_include/current/groups/tools.php');

$key = get_param("key");
$gid = get_param("group_id");
$cmd = get_param("cmd");

if ($cmd == 'join' && $gid && $key) {
    $sql = 'SELECT * FROM groups_invite
        WHERE group_id = ' . to_sql($gid) . '
            AND invite_key = ' . to_sql($key);
    $invite = DB::row($sql);

    if ($invite) {
        if($invite['user_id'] == 0) {
            if (!guid()) {
                set_session('group_key', $key);
                set_session('group_id', $gid);
                redirect('join.php');
            }
        } else {
            do_action($invite['user_id']);
        }
    } else {
        redirect("groups_group_show.php?group_id=$gid");
    }
}

function do_action($uid = null)
{
    if(!$uid) {
        redirect('join.php');
    } else {
        global $g_user;
        $g_user['user_id'] = $uid;
    }

    $cmd = get_param('cmd');

    if ($cmd == 'join' && User::isExistsByUid($uid)) {
        $group_id = get_param('group_id');
        $group = CGroupsTools::retrieve_group_by_id($group_id);
        if ($group) {
            $key = get_param('key');
            if ($key) {

                $sql = 'SELECT * FROM groups_invite
                    WHERE group_id = ' . to_sql($group['group_id']) . '
                        AND invite_key = ' . to_sql($key);

                $groups_invite = DB::row($sql);

                if ($groups_invite) {
                    CGroupsTools::create_group_member($group['group_id']);
                    $sql = 'DELETE FROM groups_invite
                        WHERE group_id = ' . to_sql($group['group_id']) . '
                            AND ( invite_key = ' . to_sql($key) . '
                                OR
                                user_id = ' . to_sql(guid()) . '
                            )';
                    DB::execute($sql);
                    redirect('groups_group_show.php?group_id=' . $group['group_id']);
                }
            }
        }
    }
    redirect('groups.php');
}

do_action(guid());

include("./_include/core/main_close.php");