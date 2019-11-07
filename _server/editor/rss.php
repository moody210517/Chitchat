<?php
/* (C) Websplosion LTD., 2001-2014

IMPORTANT: This is a commercial software product
and any kind of using it must agree to the Websplosion's license agreement.
It can be found at http://www.chameleonsocial.com/license.doc

This notice may not be removed from the source code. */

error_reporting(2048);

require_once('RssLoader.php');

$address = $_REQUEST['address'];

$rss_loader = new RssLoader();

$rss = $rss_loader->load($address);

header("Content-Type: text/xml; charset=UTF-8");
header('Cache-Control: no-cache, must-revalidate');
echo $rss;