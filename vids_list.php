<?php
/* (C) Websplosion LTD., 2001-2014

IMPORTANT: This is a commercial software product
and any kind of using it must agree to the Websplosion's license agreement.
It can be found at http://www.chameleonsocial.com/license.doc

This notice may not be removed from the source code. */

include('./_include/core/main_start.php');
include('./_include/current/blogs/tools.php');

$optionTmplName = Common::getTmplName();
if ($optionTmplName != 'edge') {
    Common::toHomePage();
}

$isAjaxRequest = get_param('ajax');
$hideFromGuests = Common::isOptionActive('list_videos_hide_from_guests', "{$optionTmplName}_general_settings");
if (!guid() && !$isAjaxRequest) {
    $uid = User::getParamUid(0);
    if ($hideFromGuests || $uid) {
        Common::toLoginPage();
    }
}

class CPage extends CHtmlBlock
{
    function init()
    {

    }

    function parseBlock(&$html)
    {
        $guid = guid();
        $uid = User::getParamUid(0);

        $ajax = get_param('ajax');
        $optionTmplName = Common::getTmplName();

        $page = get_param_int('page');
        $page = $page < 1 ? 1 : $page;

        $pageTitle = l('page_title');
        $pageDescription = '';
        $pageClass = 'videos_list';

        $filter = 'videos_filters';
        if ($uid) {
            if ($uid == $guid) {
                $pageTitle = l('your_videos');
            } else {
                $name = User::getInfoBasic($uid, 'name');
                $name = User::nameShort($name);
                $pageTitle = lSetVars('page_title_someones', array('name' => $name));
                $pageDescription = l('here_you_can_browse_the_users_videos');
            }
            $pageClass .= ' videos_list_user';
        }
        $pageUrl = Common::pageUrl('vids_list');
        if ($uid) {
            $pageUrl = Common::pageUrl('user_vids_list', $uid);
        }
        $vars = array('page_number' => $page,
                      'page_class'  => $pageClass,
                      'page_title'  => $pageTitle,
                      'page_description' => $pageDescription,
                      'page_user_id'     => $uid,
                      'page_guid' => $guid,
                      'url_pages' => $pageUrl,
                      'page_type' => 'videos',
                      'page_filter' => intval(!$uid)
                );

        $pagerOnPage = Common::getOptionInt('list_videos_number_items', "{$optionTmplName}_general_settings");
        $mOnBar = Common::getOption('usersinfo_pages_per_list', 'template_options');
        $limit = (($page - 1) * $pagerOnPage) . ',' . $pagerOnPage;

        $block = 'list_video';
        $class = "Template{$optionTmplName}";

        $typeOrderDefault = Common::getOption('list_videos_type_order', "{$optionTmplName}_general_settings");

        if (!$ajax && !$uid) {
            $tagId = get_param_int('tag');
            $tagInfo = CProfileVideo::getTagInfo($tagId);
            if ($tagInfo) {
                $_GET['tags'] = $tagInfo['tag'];
                User::updateUserFilter($filter, array('tags'));
            }
            User::setUserFilterParam($filter, $typeOrderDefault);
            if (get_param_int('only_friends')) {
                $html->setvar('only_friends', 1);
                $html->parse('module_search_only_friends', false);
            }
        }

        CProfileVideo::$isGetDataWithFilter = true;
        $itemsTotal = CProfileVideo::getTotalVideos($uid);
        CProfileVideo::$isGetDataWithFilter = false;

        $typeOrder = get_param('type_order', $typeOrderDefault);

        if (!$ajax) {
            $vars['tags'] = get_param('tags');
            $vars['search_query'] = get_param('search_query');
            $vars['type_order'] = $typeOrder;
            $vars['filter_order_list_options'] = h_options(CProfileVideo::getTypeOrderVideosList(true), $typeOrder);

            $html->assign('', $vars);

            if ($guid) {
                if (!$uid || $uid == $guid) {
                    $html->parse('page_link_video_upload', false);
                    if (!$uid) {
                        $html->parse('page_link_my_video', false);
                    }
                }
                $html->parse('page_filter_only_friends', false);
            }
            if (!$uid) {
                if ($guid) {
                    $html->parse('page_link_delimiter', false);
                }
                $html->parse('page_search_query', false);
                $html->parse('page_filter_no_result', false);
                $html->parse('page_filter', false);
            }

            if (!$uid || $uid == $guid) {
                $html->parse('wrap_head_links', false);
            }
            TemplateEdge::parseColumn($html, $uid ? $uid : $guid);
        } else {
            $html->setvar('num_total', $itemsTotal);
        }

        CProfileVideo::$isGetDataWithFilter = true;
        $rows = $class::parseListVideos($html, $typeOrder, $limit, $block);
        CProfileVideo::$isGetDataWithFilter = false;
        if ($rows) {
            Common::parsePagesListUrban($html, $page, $itemsTotal, $pagerOnPage, $mOnBar, $pageUrl);
        } else {
            $html->parse("list_noitems");
        }

        if ($guid && $ajax && !$uid) {
            User::updateUserFilter($filter);
        }
        parent::parseBlock($html);
    }
}

$uid = get_param_int('uid');
$dirTmpl = $g['tmpl']['dir_tmpl_main'];
$tmplList = array('main'   => $dirTmpl . 'page_list.html',
                  'list'   => $dirTmpl . '_list_page_info.html',
                  'filter' => $dirTmpl . '_list_page_filter.html',
                  'items'  => $dirTmpl . '_list_page_items.html',
                  'item'   => $dirTmpl . '_list_vids_item.html',
                  'pages'  => $dirTmpl . '_list_page_pages.html');
if ($uid) {
   unset($tmplList['filter']);
}
if ($isAjaxRequest) {
    $tmplList['main'] = $dirTmpl . 'search_results_ajax.html';
    unset($tmplList['filter']);
} elseif (TemplateEdge::isTemplateColums()) {
    $tmplList['list'] = $dirTmpl . '_list_page_info_columns.html';
    $tmplList['profile_column_left'] = $dirTmpl . '_profile_column_left.html';
    $tmplList['profile_column_right'] = $dirTmpl . '_profile_column_right.html';
}

$page = new CPage("", $tmplList);

if($isAjaxRequest) {
    getResponsePageAjaxByAuthStop($page, $hideFromGuests ? guid() : 1);
}

$header = new CHeader("header", $g['tmpl']['dir_tmpl_main'] . "_header.html");
$page->add($header);
$footer = new CFooter("footer", $g['tmpl']['dir_tmpl_main'] . "_footer.html");
$page->add($footer);

include('./_include/core/main_close.php');