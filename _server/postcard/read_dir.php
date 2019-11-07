<?php
/* (C) Websplosion LTD., 2001-2014

IMPORTANT: This is a commercial software product
and any kind of using it must agree to the Websplosion's license agreement.
It can be found at http://www.chameleonsocial.com/license.doc

This notice may not be removed from the source code. */

include 'conf.php';

$dir 	= "bg";
$dir2 	= "pers";
$dir3 	= "sounds";
$bgs = "";
$pers = "pers=";
$def_bgs="bg0.jpg|bg1.jpg|bg2.jpg|bg3.jpg|bg4.jpg|bg5.jpg|bg7.jpg|bg8.jpg|bg9.jpg|bg10.jpg|bg11.jpg|bg12.jpg";
$sounds="sounds=";

if (is_dir($dir2)) {
    if ($dh = opendir($dir2)) {
        while (($file = readdir($dh)) !== false)  if ($file!="." && $file!=".." && $file!=".svn") if ($file!="index.html")  $pers=$pers.$file."|";
        closedir($dh);
    }
}
$pers = substr($pers, 0, -1);

if (is_dir($dir3)) {
    if ($dh = opendir($dir3))  {
        while (($file = readdir($dh)) !== false)  if ($file!="." && $file!="..") if ($file!="index.html")  $sounds=$sounds.$file."|";
        closedir($dh);
    }
}
$sounds = substr($sounds, 0, -1);

print "<table>\n";
//$user_id = to_sql(isset($_POST['_flash']) ? $_POST['_flash'] : '', 'Plain');
//$link = mysql_connect($host,$user,$pass);
//mysql_select_db($dbname);
//
//$query = "SELECT `backgrounds` FROM `users_flash` WHERE `user_id`=".$user_id;
//if ($result = mysql_query($query)) {
//	while ($line = mysql_fetch_array($result, MYSQL_ASSOC)) foreach ($line as $col_value) print "&bgs=".$def_bgs.$col_value."&";
//	mysql_free_result($result);	
//} else {
	print "&bgs=".$def_bgs."&";
//}
//mysql_close($link);

print $pers."&pers_dir=".$dir2."&bgs_dir=".$dir."&snd_dir=".$dir3."&".$sounds; 

