<?php
/* (C) Websplosion LTD., 2001-2014

IMPORTANT: This is a commercial software product
and any kind of using it must agree to the Websplosion's license agreement.
It can be found at http://www.chameleonsocial.com/license.doc

This notice may not be removed from the source code. */

$area = "login";
include("./_include/core/pony_start.php");

$display = get_param('display');

$optionTmplName = Common::getOption('name', 'template_options');

if (($display == 'want_to_meet_you' || $display == 'who_likes_you')
    && !User::accessCheckFeatureSuperPowers('encounters')) {
    redirect('upgrade.php');
}

MutualAttractions::setViewedNewItems();

class CMutual extends CUsers
{
    function onItem(&$html, $row, $i, $last) {
        global $g;
        global $g_user;

        $display = get_param('display');
        if ($html->varExists('from_page')) {
            $html->setvar('from_page', $display ? 'want_to_meet_you' : 'matches');
        }

        if ($row['enc_new'] == 'Y') {
            DB::update('encounters', array('new' => 'N'), '`id` = ' . to_sql($row['enc_id']));
        }

        parent::onItem($html, $row, $i, $last);
        $html->parse('users_list_item_url_matches', false);
    }

	function parseBlock(&$html)
	{
        $isAjaxRequest = get_param('ajax', 0);

        if ($html->varExists('offset_real')) {
            $html->setvar('offset_real', max(1, intval($this->m_offset)));
        }

        if (Common::isOptionActive('free_site') && $html->blockExists('class_indent')) {
            $html->parse('class_indent');
        }

        if (!$isAjaxRequest) {
            $display = get_param('display');
            $optionTmplName = Common::getOption('name', 'template_options');

            $html->setvar('param_display', $display);
            $html->parse('set_param_display', false);

            /*if ($html->blockExists('users_list_loader')) {
                $html->parse('users_list_loader', false);
            }
            $cookiePrf = $display == 'want_to_meet_you' ? 'mutual_meet' : 'mutual_match';
            if ($html->blockExists('users_list_scroll') && get_param('back_offset_' . $cookiePrf)) {
                $html->parse('users_list_scroll', false);
            }*/
            if ($html->varExists('on_page')) {
                $html->setvar('on_page', $this->m_on_page);
                $html->parse('users_list_on_page', false);
            }
            if ($html->varExists('found_title')) {
                $html->setvar('found_title', l('found'));
            }
            if ($html->varExists('found_info')) {
                $keyTitle = 'found_info';
                $foundInfo = lCascade(l($keyTitle), array($keyTitle . '_' . $optionTmplName));
                if ($display == 'want_to_meet_you' || $display == 'who_likes_you') {
                    $foundInfo = l('found_info_want_to_meet_you');
                } elseif ($display == 'whom_you_like') {
                    $foundInfo = l('found_info_whom_you_like');
                }
                $html->setvar('found_info', $foundInfo);
            }
            if ($html->varExists('found_no_one')) {
                $html->setvar('found_no_one', l('found_no_one'));
            }
        }
		parent::parseBlock($html);
	}
}

$isAjaxRequest = get_param('ajax', 0);

$tmpl = 'search_results.html';
if ($isAjaxRequest) {
    $tmpl = 'search_results_ajax.html';
}


class CPage extends CHtmlBlock
{
	function parseBlock(&$html)
	{
        $optionTmplName = Common::getOption('name', 'template_options');
        $display = get_param('display');
        if ($optionTmplName == 'impact_mobile') {
            $urlPage = Common::pageUrl('mutual_likes');
            if (!in_array($display, array('who_likes_you', 'whom_you_like'))) {
                $display = '';
            } else {
                $urlPage = Common::pageUrl($display);
            }
            $html->setvar('page_param_display', $display);
            $html->setvar('url_page_history', $urlPage);
        }
        if ($html->blockExists('block_target')) {
            $html->parse('block_target_main', false);
            $html->parse('block_target', false);
        }
		parent::parseBlock($html);
	}
}

$page = new CPage("", $g['tmpl']['dir_tmpl_mobile'] . $tmpl);

if (!$isAjaxRequest) {
    $header = new CHeader("header", $g['tmpl']['dir_tmpl_mobile'] . "_header.html");
    $page->add($header);
    $tmplFooter = $g['tmpl']['dir_tmpl_mobile'] . "_footer.html";
    if (Common::isOptionActive('is_allow_empty_footer', 'template_options')) {
        $tmplFooter = $g['tmpl']['dir_tmpl_mobile'] . "_footer_empty.html";
    }
    $footer = new CFooter("footer", $tmplFooter);
    $page->add($footer);
}

$list = new CMutual('users_list', $g['tmpl']['dir_tmpl_mobile'] . '_list_users_info.html');

$onPage = getMobileOnPageSearch();
$list->m_on_page = get_param('on_page', $onPage);
$cookiePrf = $display == 'want_to_meet_you' ? 'mutual_meet' : 'mutual_match';
if ($optionTmplName == 'impact_mobile') {
    $cookiePrf = 'mutual_likes';
    if ($display) {
        $cookiePrf = $display;
    }
}
$list->m_offset = get_param('offset', (int)get_cookie('back_offset_' . $cookiePrf, 1));
$list->m_chk = $onPage;

$guidSql = to_sql(guid(), 'Number');

$list->m_sql_where = 'enc.id IS NOT NULL';

if ($display == 'who_likes_you') {
    $from_add = "LEFT JOIN encounters AS enc
                      ON
                        ((enc.from_reply IN('Y','M') AND enc.user_to = " . $guidSql . " AND u.user_id = enc.user_from)
                      OR (enc.to_reply IN('Y','M') AND enc.user_from = " . $guidSql . " AND u.user_id = enc.user_to))";

    $from_add = "JOIN
        (SELECT * FROM
            (
                (SELECT *, user_to AS uid FROM `encounters` AS enc WHERE enc.user_from = $guidSql AND enc.to_reply IN('Y','M'))
                UNION
                (SELECT *, user_from AS uid FROM `encounters` AS enc WHERE enc.user_to = $guidSql AND enc.from_reply IN('Y','M'))
            ) AS E
        ) AS enc ON enc.uid = u.user_id
    ";

} elseif ($display == 'whom_you_like') {
    $from_add = "LEFT JOIN encounters AS enc
                      ON
                        ((enc.user_from = " . $guidSql . " AND enc.from_reply IN('Y','M') AND u.user_id = enc.user_to)
                      OR (enc.user_to = " . $guidSql . " AND enc.to_reply IN('Y','M') AND u.user_id = enc.user_from))";
    $from_add = "JOIN
        (SELECT * FROM
            (
                (SELECT *, user_to AS uid FROM `encounters` AS enc WHERE enc.user_from = $guidSql AND enc.from_reply IN('Y','M'))
                UNION
                (SELECT *, user_from AS uid FROM `encounters` AS enc WHERE enc.user_to = $guidSql AND enc.to_reply IN('Y','M'))
            ) AS E
        ) AS enc ON enc.uid = u.user_id
    ";
}elseif ($display == 'want_to_meet_you') {
    $from_add = 'LEFT JOIN encounters AS enc
                    ON enc.user_to = ' . $guidSql . " AND u.user_id = user_from
                       AND enc.from_reply != 'N' AND enc.to_reply = 'P'";

} else {
    $from_add = 'LEFT JOIN encounters AS enc
                    ON ((enc.user_from = ' . $guidSql . ' AND u.user_id = enc.user_to)
                        OR
                        (enc.user_to = ' . $guidSql . " AND u.user_id = user_from))
                        AND enc.from_reply != 'N' AND enc.to_reply NOT IN('P','N')";

    $from_add = "JOIN
        (SELECT * FROM
            (
                (SELECT *, user_to AS uid FROM `encounters` AS enc WHERE enc.user_from = $guidSql AND enc.from_reply != 'N' AND enc.to_reply NOT IN('P','N'))
                UNION
                (SELECT *, user_from AS uid FROM `encounters` AS enc WHERE enc.user_to = $guidSql AND enc.from_reply != 'N' AND enc.to_reply NOT IN('P','N'))
            ) AS E
        ) AS enc ON enc.uid = u.user_id
    ";
}

$list->m_sql_from_add = $from_add;
$list->m_sql_where = 'enc.id IS NOT NULL';
$list->m_sql_order = 'enc.id DESC';

$list->fieldsFromAdd = ', enc.new as enc_new, enc.id as enc_id';
$list->m_offset_real = true;
//$list->m_debug = "Y";
$page->add($list);

if (!$isAjaxRequest) {
    if (Common::isParseModule('user_menu')) {
        $user_menu = new CUserMenu("user_menu", $g['tmpl']['dir_tmpl_mobile'] . "_user_menu.html");
        $header->add($user_menu);
    }
    if (Common::isParseModule('people_nearby_spotlight')) {
        $spotlight = new Spotlight('spotlight', $g['tmpl']['dir_tmpl_mobile'] . '_spotlight.html');
        $spotlight->update = false;
        $page->add($spotlight);
    }
}

loadPageContentAjax($page);

include("./_include/core/main_close.php");