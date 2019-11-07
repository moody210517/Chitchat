<?php
$g['mobile_redirect_off'] = true;
include('../../../_include/core/main_start.php');

class CCityIndex extends CHtmlBlock
{
    function parseBlock(&$html)
    {
        $urlFiles = Common::getOption('url_files_city', 'path');
        $html->setvar('path_pano', $urlFiles . 'city/pano_cache/');

        $keyMap = CityMap::getKeyMap();
        $html->setvar('google_maps_api_key', $keyMap);
        $html->setvar('param_google_maps_api_key', $keyMap ? "?key={$keyMap}" : '');

        parent::parseBlock($html);
    }
}

$page = new CCityIndex('', 'index.html');

include('../../../_include/core/main_close.php');