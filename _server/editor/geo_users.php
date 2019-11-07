<?php
/* (C) Websplosion LTD., 2001-2014

IMPORTANT: This is a commercial software product
and any kind of using it must agree to the Websplosion's license agreement.
It can be found at http://www.chameleonsocial.com/license.doc

This notice may not be removed from the source code. */

$g['to_root'] = "../../";
$g['no_headers'] = true;
include($g['to_root'] . "_include/core/main_start.php");

header("Content-Type: text/xml; charset=UTF-8");
header('Cache-Control: no-cache, must-revalidate');

$google_zoom_levels = array(
    156367.87,
    78183.93,
    39091.97,
    19545.98,
    9772.99,
    4886.50,
    2443.25,
    1221.62,
    610.81,
    305.41,
    152.70,
    76.35,
    38.18,
    19.09,
    9.54,
    4.77,
    2.39,
    1.19,
    0.60,
);

$url_absolute = "http://".str_replace("//", "/", str_replace("_server/editor", "", str_replace("//", "/", str_replace("\\", "", $_SERVER['HTTP_HOST'] . dirname($_SERVER['PHP_SELF']) . "/"))));

$requestKey = get_param('requestKey');
$minLatitude = floatval(urldecode(get_param('maxLatitude')));
$maxLatitude = floatval(urldecode(get_param('minLatitude')));
$minLongitude = floatval(urldecode(get_param('minLongitude')));
$maxLongitude = floatval(urldecode(get_param('maxLongitude')));
$scale = get_param('scale');

$first_level_horizontal_n_cells = 9;
$first_level_vertical_n_cells = 5;

$cell_width = (360 / $first_level_horizontal_n_cells) * ($google_zoom_levels[15 - $scale] / $google_zoom_levels[0]);
$cell_height = (180 / $first_level_vertical_n_cells) * ($google_zoom_levels[15 - $scale] / $google_zoom_levels[0]);

function strcut_xxx($str, $max_length)
{
    if(strlen($str) > $max_length)
        return substr($str, 0, $max_length).'...';

    return $str;
}

function geo_users_get_coords($cell_x, $cell_y)
{
    global $cell_width;
    global $cell_height;

    $coords = array();

	$sql = "SELECT u.*, YEAR(FROM_DAYS(TO_DAYS('" . date('Y-m-d H:i:s') . "')-TO_DAYS(birth))) AS age, g.lat, g.long, (g.lat+g.long) as h
        FROM user AS u LEFT JOIN geo_city AS g ON u.city_id=g.city_id
        WHERE u.city_id>0 AND g.lat>=" . floor(10000000 * ($cell_y * $cell_height - 90)) . " AND g.lat<=" . (floor(10000000 * (($cell_y + 1) * $cell_height - 90)) - 1) . "
          AND g.long>=" . floor(10000000 * ($cell_x * $cell_width - 180)) . " AND g.long<=" . (floor(10000000 * (($cell_x + 1) * $cell_width - 180)) - 1) . "
        GROUP BY h
        LIMIT 1";

	#print $sql;

    DB::query($sql , 1);

    while ($coord = DB::fetch_row(1)) {
        $coords[] = $coord;
    }

    return $coords;
}

//echo $cell_width . ' ' . $cell_height;

$cell_min_x = floor((180 + $minLongitude) / $cell_width);
$cell_max_x = ceil((180 + $maxLongitude) / $cell_width);
$cell_min_y = floor((90 + $minLatitude) / $cell_height);
$cell_max_y = ceil((90 + $maxLatitude) / $cell_height);

//echo $cell_min_x . ' ' . $cell_max_x . ' ' . $cell_min_y . ' ' . $cell_max_y;

$cell_x_n_max = ceil(360 / $cell_width);
$cell_y_n_max = ceil(180 / $cell_height);

$coords_array = array();

$cell_y = $cell_min_y;
while($cell_y != $cell_max_y)
{
    $cell_x = $cell_min_x;
    while($cell_x != $cell_max_x)
    {
        $coords_array[] = geo_users_get_coords($cell_x, $cell_y);

        if($cell_x == $cell_x_n_max)
            $cell_x = 0;
        else
            ++$cell_x;
    }

    if($cell_y == $cell_y_n_max)
        $cell_y = 0;
    else
        ++$cell_y;
}

$e = "<?xml version=\"1.0\" encoding=\"utf-8\"?>";
$e .= "<map>";
$e .= "<requestKey>" . $requestKey . "</requestKey>";
$e .= "<userlist>";

foreach($coords_array as $coords)
{
    foreach($coords as $coord)
    {

        $adress = trim(($coord['country'] != '' ? $coord['country'] . ', ' :  '')
                . ($coord['state'] != '' ? $coord['state'] . ', ' :  '')
                . ($coord['city'] != '' ? $coord['city'] . ', ' :  ''), ', ');

        // default user photo
		$photo_path = $url_absolute . $g['dir_files'] . User::getPhotoDefault($coord['user_id'],"r");


        DB::query("SELECT headline, essay FROM userinfo WHERE user_id=" . $coord['user_id'] . "", 2);
        $coordinfo = DB::fetch_row(2);

        $latitude = ($coord['lat'] / 10000000);
        $longitude = ($coord['long'] / 10000000);

        $e .= "<user>";
        $e .= "<id>" . $coord['user_id'] . "</id>";
        $e .= "<latitude>" . $latitude . "</latitude>";
        $e .= "<longitude>" . $longitude . "</longitude>";
        $e .= "<name>" . $coord['name'] . "</name>";
        $e .= "<comment>" . strcut($coordinfo['essay'], 200) . "</comment>";
        $e .= "<url><![CDATA[" . $url_absolute . 'search_results.php?display=profile&name=' . $coord['name'] . "]]></url>";
        $e .= "<img><![CDATA[" . $photo_path . "]]></img>";
        $e .= "<adress>" . strcut($coordinfo['headline'], 64) . "</adress>";
        $e .= "</user>";
    }
}

$e .= "</userlist>";
$e .= "</map>";

echo $e;

include($g['to_root'] . "_include/core/main_close.php");
