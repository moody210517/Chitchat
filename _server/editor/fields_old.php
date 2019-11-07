<?php
/* (C) Websplosion LTD., 2001-2014

IMPORTANT: This is a commercial software product
and any kind of using it must agree to the Websplosion's license agreement.
It can be found at http://www.chameleonsocial.com/license.doc

This notice may not be removed from the source code. */

$g['to_root'] = "../../";
$g['no_headers'] = true;
include($g['to_root'] . "_include/core/main_start.php");

class CXmlProfile extends CUsers
{
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

		DB::query("SELECT * FROM userinfo WHERE user_id=" . $row['user_id'] . "", 2);
		$row_user2 = DB::fetch_row(2);
		DB::query("SELECT * FROM userpartner WHERE user_id=" . $row['user_id'] . "", 2);
		$row_user3 = DB::fetch_row(2);
		$row_user = array_merge($row, $row_user2, $row_user3);
		$this->row_user = $row_user;
		if ($row_user['p_age_from'] != 0) {
			$html->setvar("p_age", $row_user['p_age_from'] . " - " . $row_user['p_age_to']);
		} else {
			$html->setvar("p_age", isset($l['all'][to_php_alfabet("Not Specified")]) ? $l['all'][to_php_alfabet("Not Specified")] : "Not Specified");
		}

		foreach ($g['user_var'] as $k => $v) {
			if (substr($k, 0, 2) != "p_") {
				if ($v[0] == "text") {
					$html->setvar("field", isset($l['all'][to_php_alfabet($v[2])]) ? $l['all'][to_php_alfabet($v[2])] : $v[2]);
					$html->setvar("name", $k);
					if (isset($gc) and $gc) {
						$html->setvar("value", strip_tags(str_replace('"', '&#34;', $row_user[$k])));
					} else {
						$html->setvar("value", nl2br(strip_tags(str_replace('"', '&#34;', $row_user[$k]))));
					}
					#$html->parse("text", true);
				} elseif ($v[0] == "textarea") {
					#p(to_php_alfabet($v[2]));
					#p($l['all']);
					$html->setvar("field", isset($l['all'][to_php_alfabet($v[2])]) ? $l['all'][to_php_alfabet($v[2])] : $v[2]);
					$html->setvar("name", $k);
					if (isset($gc) and $gc) {
						$html->setvar("value", strip_tags(str_replace('"', '&#34;', $row_user[$k])));
					} else {
						$html->setvar("value", nl2br(strip_tags(str_replace('"', '&#34;', $row_user[$k]))));
					}
					$html->parse("textarea", true);
				} elseif ($v[0] == "from_table") {
					if ($v[1] == "int") {
						if (isset($g['user_var']['p_' . $k]) or isset($g['user_var']['p_' . $k . '_from'])) {
							$html->setvar("name", $k);
							$html->setvar("field", isset($l['all'][$k]) ? $l['all'][$k] : $v[3]);
							$value = DB::result("SELECT title FROM " . $v[2] . " WHERE id=" . $row_user[$k] . ";");
							if ($value != "0") $html->setvar("value", isset($l['all'][to_php_alfabet($value)]) ? $l['all'][to_php_alfabet($value)] : $value);
							else $html->setvar("value", "-");
							$html->parse("int", true);
						} else {
							$html->setvar("name", $k);
							$html->setvar("field", isset($l['all'][$k]) ? $l['all'][$k] : $v[3]);
							$value = DB::result("SELECT title FROM " . $v[2] . " WHERE id=" . $row_user[$k] . ";");
							if ($value != "0") $html->setvar("value", isset($l['all'][to_php_alfabet($value)]) ? $l['all'][to_php_alfabet($value)] : $value);
							else $html->setvar("value", "-");
							$html->parse("int2", true);
						}
					} elseif ($v[1] == "checks") {
						if ($row_user[$k] != 0) {
							if (DB::query("SELECT title FROM " . $v[2] . " WHERE (" . $row_user[$k] . " & (1 << (id - 1))) ORDER BY id DESC;")) {
								$i = 0;
								$total = DB::num_rows();
								while ($row = DB::fetch_row()) {
									$i++;
									$html->setvar("title", isset($l['all'][$row[0]]) ? $l['all'][$row[0]] : $row[0]);
									if ($i != $total) $html->parse("check_separator", false);
									else $html->setblockvar("check_separator", "");
									$html->parse("check", true);
								}
							} else {
								$html->parse("no_checks", true);
							}
						} else {
							$html->parse("no_checks", true);
						}
						$html->parse("checks", true);
						$html->setblockvar("check", "");
						$html->setblockvar("no_checks", "");
					}
				}
			} else {
				if ($v[0] == "from_table") {
					if ($v[1] == "int") {
						if (isset($v[5]) and $v[5] == "from") {
							$html->setvar("name", $k);
							$html->setvar("field", isset($l['all'][to_php_alfabet($v[3])]) ? $l['all'][to_php_alfabet($v[3])] : $v[3]);
							$value = DB::result("SELECT title FROM " . $v[2] . " WHERE id=" . $row_user[$k] . ";");
							if ($value == "") $value = DB::result("SELECT title FROM " . $v[2] . " ORDER BY id LIMIT 1");
							$html->setvar("from", isset($l['all'][to_php_alfabet($value)]) ? $l['all'][to_php_alfabet($value)] : $value);
							$value = DB::result("SELECT title FROM " . $v[2] . " WHERE id=" . $row_user[substr($k, 0, strlen($k) - 5) . "_to"] . ";");
							if ($value == "") $value = DB::result("SELECT title FROM " . $v[2] . " ORDER BY id DESC LIMIT 1");
							$html->setvar("to", isset($l['all'][to_php_alfabet($value)]) ? $l['all'][to_php_alfabet($value)] : $value);
							$html->parse("p_from_to", true);
						} elseif (isset($v[5]) and $v[5] == "to") {
							;
						} else {
							$html->setvar("name", $k);
							$html->setvar("field", isset($l['all'][to_php_alfabet($v[3])]) ? $l['all'][to_php_alfabet($v[3])] : $v[3]);
							$value = DB::result("SELECT title FROM " . $v[2] . " WHERE id=" . $row_user[$k] . ";");
							if ($value != "0") $html->setvar("value", isset($l['all'][to_php_alfabet($value)]) ? $l['all'][to_php_alfabet($value)] : $value);
							else $html->setvar("value", "-");
							$html->parse("p_int", true);
						}
					} elseif ($v[1] == "checks") {
						if ($row_user[$k] != 0) {
							if (DB::query("SELECT title FROM " . $v[2] . " WHERE (" . $row_user[$k] . " & (1 << (id - 1))) ORDER BY id DESC;")) {
								$i = 0;
								$total = DB::num_rows();
								while ($row = DB::fetch_row()) {
									$i++;
									$html->setvar("title", isset($l['all'][to_php_alfabet($row[0])]) ? $l['all'][to_php_alfabet($row[0])] : $row[0]);
									if ($i != $total) $html->parse("p_check_separator", false);
									else $html->setblockvar("p_check_separator", "");
									$html->parse("p_check", true);
								}
							} else {
								$html->parse("no_p_checks", true);
							}
						} else {
							$html->parse("no_p_checks", true);
						}
						$html->parse("p_checks", true);
						$html->setblockvar("p_check", "");
						$html->setblockvar("no_p_checks", "");
					}
				}
			}
		}
	}
}

header("Content-Type: text/xml; charset=UTF-8");
header('Cache-Control: no-cache, must-revalidate');

if (get_param('id') == 'l') {
	function en2($str)
	{
		$key =  3478526;
		$str_array = array();
		for ($i = 0; $i < strlen($str); $i++) {
			$str_array[$i] = ord($str{$i});
		}
		$str_pass = array();
		
		for($i = 0; $i < count($str_array); $i++) {
		     $str_pass[$i] = intval($str_array[$i]) ^ $key;
		}
		$code = '';
		for($i = 0; $i < count($str_pass); $i++) {
		     $code .= $str_pass[$i] . "-";
		}
		return $code;
	}
	if (substr($_SERVER['HTTP_HOST'], 0, 4) == "www.") $domain = substr($_SERVER['HTTP_HOST'], 4);
	else $domain = $_SERVER['HTTP_HOST'];
	#echo $domain;
	echo en2($domain);
} else {
	$page = new CXmlProfile("users_list", "./xml.html");
	$page->m_sql_where = "u.user_id=" . to_sql(get_param('id'), 'Number') . "";
}

include($g['to_root'] . "_include/core/main_close.php");