<?php

/* (C) Websplosion LTD., 2001-2014

IMPORTANT: This is a commercial software product
and any kind of using it must agree to the Websplosion's license agreement.
It can be found at http://www.chameleonsocial.com/license.doc

This notice may not be removed from the source code. */

include("../_include/core/administration_start.php");

class CityWholeWorld extends CHtmlBlock
{

	function parseBlock(&$html)
	{

        parent::parseBlock($html);
	}
}

$page = new CityWholeWorld('', $g['tmpl']['dir_tmpl_administration'] . 'city_whole_world.html');

$items = new CAdminConfig('config_fields', $g['tmpl']['dir_tmpl_administration'] . '_config.html');
$items->setModule('3d_city_whole_world');
$items->setSort('position');
$page->add($items);

$header = new CAdminHeader('header', $g['tmpl']['dir_tmpl_administration'] . '_header.html');
$page->add($header);
$footer = new CAdminFooter('footer', $g['tmpl']['dir_tmpl_administration'] . '_footer.html');
$page->add($footer);

$page->add(new CAdminPageMenuCity());

include("../_include/core/administration_close.php");