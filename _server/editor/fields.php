<?php

/* (C) Websplosion LTD., 2001-2014

IMPORTANT: This is a commercial software product
and any kind of using it must agree to the Websplosion's license agreement.
It can be found at http://www.chameleonsocial.com/license.doc

This notice may not be removed from the source code. */

$g['to_root'] = "../../";
$g['no_headers'] = true;
include($g['to_root'] . "_include/core/main_start.php");
/*class CXmlProfile extends CUsers {

    var $m_on_page = 1;
    var $m_view = 1;
    var $row_user = array();

    function init()
    {
        parent::init();
        global $g;
        global $g_user;

        $this->m_sql_count = "SELECT COUNT(u.user_id) FROM user AS u " . $this->m_sql_from_add . "";
        $this->m_sql = "
			SELECT u.*, YEAR(FROM_DAYS(TO_DAYS('" . date('Y-m-d H:i:s') . "')-TO_DAYS(birth))) AS age,
			u.state AS state_title, u.country AS country_title, u.city AS city_title,
			IF(u.city_id=" . $g_user['city_id'] . ", 1, 0) +
			IF(u.state_id=" . $g_user['state_id'] . ", 1, 0) +
			IF(u.country_id=" . $g_user['country_id'] . ", 1, 0) AS near

			FROM user AS u
			" . $this->m_sql_from_add . "
		";

        $this->m_field['user_id'] = array("user_id", null);
        $this->m_field['name'] = array("name", null);
        $this->m_field['age'] = array("age", null);
        $this->m_field['relation'] = array("relation", null);
        $this->m_field['last_visit'] = array("last_visit", null);
        $this->m_field['city_title'] = array("city", null);
        $this->m_field['state_title'] = array("state", null);
        $this->m_field['country_title'] = array("country", null);
        $this->m_field_default = $this->m_field;
    }

    function htmlToText($html)
    {
        $text = str_replace('"', '&#034;', strip_tags($html));
        return $text;
    }

    function onItem(&$html, $row, $i, $last)
    {
        global $g;
        global $gm;
        global $gc;
        global $p;
        global $l;
        global $g_info;
        global $g_user;

        parent::onItem($html, $row, $i, $last);

        $row_user = User::getInfoFull($row['user_id'], 2);
        $this->row_user = $row_user;
        
        foreach ($g['user_var'] as $k => $v) {
            if (substr($k, 0, 2) != 'p_') {

                if ($v[0] == 'text' || $v[0] == 'textarea') {

                    $html->setvar('field', $this->htmlToText(isset($l['all'][to_php_alfabet($v[2])]) ? $l['all'][to_php_alfabet($v[2])] : $v[2]));
                    $html->setvar('value', $this->htmlToText($row_user[$k]));
                    $html->parse($v[0], true);

                } elseif ($v[0] == 'from_table') {

                    if ($v[1] == 'int') {

                        if (isset($g['user_var']['p_' . $k]) or isset($g['user_var']['p_' . $k . '_from'])) {
                            $block = 'int';
                        } else {
                            $block = 'int2';
                        }

                        $html->setvar('field', $this->htmlToText(isset($l['all'][$k]) ? $l['all'][$k] : $v[3]));
                        $value = DB::result("SELECT title FROM " . $v[2] . " WHERE id=" . $row_user[$k] . ";");

                        $fieldValue = '-';
                        if ($value != '0') {
                            $fieldValue = isset($l['all'][to_php_alfabet($value)]) ? $l['all'][to_php_alfabet($value)] : $value;
                        }

                        $html->setvar('value', $this->htmlToText($fieldValue));

                        $html->parse($block, true);

                    }
                }
            }
        }
        $html->parse('fields_text', false);
    }

}*/

header("Content-Type: text/xml; charset=UTF-8");
header('Cache-Control: no-cache, must-revalidate');

if (get_param('id') == 'l') {

    function en2($str)
    {
        $key = 3478526;
        $str_array = array();
        for ($i = 0; $i < strlen($str); $i++) {
            $str_array[$i] = ord($str{$i});
        }
        $str_pass = array();

        for ($i = 0; $i < count($str_array); $i++) {
            $str_pass[$i] = intval($str_array[$i]) ^ $key;
        }
        $code = '';
        for ($i = 0; $i < count($str_pass); $i++) {
            $code .= $str_pass[$i] . "-";
        }
        return $code;
    }

    if (substr($_SERVER['HTTP_HOST'], 0, 4) == "www.")
        $domain = substr($_SERVER['HTTP_HOST'], 4);
    else
        $domain = $_SERVER['HTTP_HOST'];
    #echo $domain;
    echo en2($domain);
} else {
    //$page = new CXmlProfile("users_list", "./xml.html");
    //$page->m_sql_where = "u.user_id=" . to_sql(get_param('id'), 'Number') . "";

    $page = new UserFields('users_list', './xml.html', false, false, false, 'profile_html');
    $page->formatValue = 'text';
    $page->setUser(get_param('id'));
}

include($g['to_root'] . "_include/core/main_close.php");