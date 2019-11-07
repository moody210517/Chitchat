<?php
/* (C) Websplosion LTD., 2001-2014

IMPORTANT: This is a commercial software product
and any kind of using it must agree to the Websplosion's license agreement.
It can be found at http://www.chameleonsocial.com/license.doc

This notice may not be removed from the source code. */

$g['template_options'] = array(
    'set' => 'urban',
    'name' => 'edge_mobile',
    'main_template' => array('edge'),
    'logo_mobile' => 'N',
    'template_edit_settings' => 'Y'
);

Common::setOptionRuntime('N', 'mobile_enabled');
Common::setOptionRuntime('N', 'mobile_redirect');
Common::setOptionRuntime('N', 'mobile_site_on_tablet');