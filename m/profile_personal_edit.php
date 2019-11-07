<?php
/* (C) Websplosion LTD., 2001-2014

IMPORTANT: This is a commercial software product
and any kind of using it must agree to the Websplosion's license agreement.
It can be found at http://www.chameleonsocial.com/license.doc

This notice may not be removed from the source code. */

$area = 'login';
include('./_include/core/pony_start.php');

class CProfilePersonal extends UserFields
{
	function action()
	{
        global $g_user;

        $responseData = false;
        $isResponseAjax = get_param('ajax');
        $cmd = get_param('cmd');
        if ($isResponseAjax && $cmd == 'update') {
            if ($g_user['user_id']) {
                $uid = $g_user['user_id'];
                $this->updateLookingFor($uid);
                $this->updateTextsApproval('texts');
                $this->updateInfo($uid, 'update_personal_urban');
                //$this->updateInfo($uid, 'update_admin_urban');

                $city = get_param('city');
                $state = get_param('state');
                $country = get_param('country');

                $data = array('country' => Common::getLocationTitle('country', $country),
                              'state' => Common::getLocationTitle('state', $state),
                              'city' => Common::getLocationTitle('city', $city),
                              'country_id' => $country,
                              'state_id' => $state,
                              'city_id' => $city);

                User::update($data, $uid);
                User::updateFilterLocationChangingUserLocation();
                CProfileEditMain::UpdateBasicInfo('field_urban_mobile');
                $responseData = true;
            }
            die(getResponseDataAjaxByAuth($responseData));
        }

	}
	function parseBlock(&$html)
	{
		global $g;
		global $g_user;

        if (guid()) {
            $cmd = get_param('cmd');
            if ($cmd=='edit_field'){
                $fieldName=get_param('field_name');
                if($fieldName!=''){
                    $html->setvar('name_field_on_start', $fieldName);
                    $html->parse('edit_field_on_start');
                }
            }
        }

        $html->setvar('users_age', Common::getOption('users_age'));

        $formatDateMonths = 'F';
        $optionFormatDateMonths = Common::getOption('format_date_months_join', 'template_options');
        if ($optionFormatDateMonths) {
            $formatDateMonths = $optionFormatDateMonths;
        }
        $this->parseDate($html, '', '', '', '', '', '', $formatDateMonths);
        $this->parseOrientationForAction($html);

        parent::parseBlock($html);
	}
}

$page = new CProfilePersonal('', $g['tmpl']['dir_tmpl_mobile'] . 'profile_personal_edit.html', false, false, false, 'personal_edit_urban_mobile', guid());
$page->formatValue = 'entities';
$header = new CHeader('header', $g['tmpl']['dir_tmpl_mobile'] . '_header.html');
$page->add($header);

if (Common::getOption('set', 'template_options') == 'urban') {
    $user_menu = new CUserMenu("user_menu", $g['tmpl']['dir_tmpl_mobile'] . "_user_menu.html");
    $header->add($user_menu);
}

$footer = new CFooter('footer', $g['tmpl']['dir_tmpl_mobile'] . '_footer.html');
$page->add($footer);

include("./_include/core/main_close.php");