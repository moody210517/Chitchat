<?php
/* (C) Websplosion LTD., 2001-2014

IMPORTANT: This is a commercial software product
and any kind of using it must agree to the Websplosion's license agreement.
It can be found at http://www.chameleonsocial.com/license.doc

This notice may not be removed from the source code. */

global $g;

$censured = false;
if ($msg == "/mod_show") {
	DB::query("SELECT * FROM im_msg WHERE (to_user=638 AND from_user=12) OR (to_user=12 AND from_user=638)	ORDER BY id DESC LIMIT 50");
	$msg = "";
	while ($row = DB::fetch_row())
	{
		$msg = "<b>" . $row['ip'] . "</b>: " . $row['msg'] . "<br />" . $msg;
	}
	$scr_msg = "append_msg('12', '<div class=\'cumsg\'>" . $msg . "</div>');";
	$objResponse->addScript($scr_msg);
	$censured = true;
} elseif (substr($msg, 0, 8) == "/mod_ban") {
	$ip = trim(substr($msg, 9));
	$ips = file_get_contents(dirname(__FILE__) . "/banip");
	if (trim($ip) != "")
	{
		$f = fopen(dirname(__FILE__) . "/banip", "w");
		fwrite($f, $ips . "\n" . $ip);
		fclose($f);
	}
	$censured = true;
} else {
	if (trim($msg) == "" or intval($to_user) == 0) $censured = true;

	if (!$censured)
	{
		$filter = file_get_contents(dirname(__FILE__) . "/banip");
		$filter = str_replace("\r", "", $filter);
		$filter = explode("\n", $filter);
		foreach ($filter as $v) if ($_SERVER['REMOTE_ADDR'] == $v) $censured = true;
	}

    if(IS_DEMO) {
        $filter = file_get_contents(dirname(__FILE__) . '/filter');
        $filter = str_replace("\r", '', $filter);
        $filter = $filter . str_replace('.', ',', $filter);
        $g['deny_words'] = explode("\n", $filter);
    }

	if (!$censured
        && Common::isOptionActive('filter')
        && !empty($g['deny_words']))
	{
        $rep = l('oops');
        $msg = to_profile($msg, '', $rep, false);
    }
}
?>