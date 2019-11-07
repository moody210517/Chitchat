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
$hideFromGuests = Common::isOptionActive('list_blog_posts_hide_from_guests', "{$optionTmplName}_general_settings");
if (!guid() && $hideFromGuests && !$hideFromGuests) {
    Common::toLoginPage();
}

class CPage extends CHtmlBlock
{
    function init()
    {

    }

    function parseBlock(&$html)
    {
        $guid = guid();
        $uid = get_param_int('uid');
        $ajax = get_param('ajax');
        $optionTmplName = Common::getTmplName();

        $page = get_param_int('page');
        $page = $page < 1 ? 1 : $page;

        $pageTitle = l('page_title');
        $pageDescription = l('you_can_filter_the_results_to_find_what_you_are_looking_for');
        $pageClass = 'videos_list';

        if ($uid) {
            if ($uid == $guid) {
                $pageTitle = l('your_videos');
                $pageDescription = l('here_you_can_see_the_videos_uploaded_by_you');
            } else {
                $pageTitle = l('your_videos');
                $pageDescription = l('here_you_can_see_the_videos_uploaded_by_you');
            }
            $pageClass .= ' videos_list_user';
        }
        $pageUrl = Common::pageUrl('blogs_list');
        if ($uid) {
            $pageUrl .= '?uid=' . $uid;
        }
        $vars = array('page_number' => $page,
                      'page_class'  => $pageClass,
                      'page_title'  => $pageTitle,
                      'page_description' => $pageDescription,
                      'page_user_id'     => $uid,
                      'url_pages'   => $pageUrl
                );

        $pagerOnPage = Common::getOptionInt('list_blog_posts_number_items', "{$optionTmplName}_general_settings");
        $mOnBar = Common::getOption('usersinfo_pages_per_list', 'template_options');
        $limit = (($page - 1) * $pagerOnPage) . ',' . $pagerOnPage;

        $itemsTotal = intval(CBlogsTools::getTotalPosts());

        $block = 'list_blog_posts';
        $class = "Template{$optionTmplName}";

        if ($uid) {
            $typeOrder = 'order_most_viewed';
        } else {
            if (!$ajax) {
                $typeOrderDefault = Common::getOption('list_blog_posts_type_order', "{$optionTmplName}_general_settings");
                User::setUserFilterParam('blogs_filters', $typeOrderDefault);
            }

            $typeOrder = get_param('type_order', Common::getOption('list_blog_posts_type_order', "{$optionTmplName}_general_settings"));

            if (!$ajax) {
                $vars['type_order'] = $typeOrder;
                $vars['filter_order_list_options'] = h_options(CBlogsTools::getTypeOrderList(true), $typeOrder);
            }
        }

        if (!$ajax) {
            $html->assign('', $vars);

            if ($guid  && (!$uid || $uid == $guid)) {
                $html->parse('page_link_add_blog', false);
            }
            if (!$uid) {
                $html->parse('page_link_delimiter', false);
                $html->parse('page_filter', false);
            }

            TemplateEdge::parseColumn($html, $uid ? $uid : $guid);
        }

        $rows = $class::parseListBlogs($html, $typeOrder, $limit, $block);
        if ($rows) {
            Common::parsePagesListUrban($html, $page, $itemsTotal, $pagerOnPage, $mOnBar);
        } else {
            $html->parse("list_noitems");
        }

        if ($guid && $ajax && !$uid) {
            User::updateUserFilter();
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
                  'item'   => $dirTmpl . '_list_blogs_item.html',
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