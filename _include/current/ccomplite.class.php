<?php

/* (C) Websplosion LTD., 2001-2014

  IMPORTANT: This is a commercial software product
  and any kind of using it must agree to the Websplosion's license agreement.
  It can be found at http://www.chameleonsocial.com/license.doc

  This notice may not be removed from the source code. */

class CComplite extends UserFields {

    function parseBlock(&$html)
    {
        global $g;
        global $p;
        global $g_user;
        CBanner::getBlock($html, 'right_column');
        $complite =   User::profileComplite();
        $html->setvar('profile_complite_percent',$complite['completed']);
        $html->setvar('profile_empty_percent',100 - $complite['completed']);
        $html->setvar('basic',$complite['basic']);
        $html->setvar('personalc',$complite['personalc']);
        $html->setvar('partnerc',$complite['partnerc']);
        $html->setvar('profile_complite_percent',$complite['completed']);
        $html->setvar('your_profile_is_level_completed', lSetVars('your_profile_is_level_completed', array('level' => $complite['completed'])));
        if (Common::isOptionActive('partner_settings', 'options') || Common::isOptionActive('personal_settings', 'options')) {
            if (Common::isOptionActive('partner_settings', 'options')) {
                $html->parse('yes_partner');
            }
            if (Common::isOptionActive('personal_settings', 'options')) {
                $html->parse('yes_personal');
            }

            $html->parse('yes_settings');
        }
        if($p == 'home.php') {
            $html->parse('profile_completion_on');
        } else {
            $html->parse('profile_completion_off');
        }
        parent::parseBlock($html);
    }

}