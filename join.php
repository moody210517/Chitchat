<?php

/* (C) Websplosion LTD., 2001-2014

IMPORTANT: This is a commercial software product
and any kind of using it must agree to the Websplosion's license agreement.
It can be found at http://www.chameleonsocial.com/license.doc

This notice may not be removed from the source code. */

$area = "public";
include("./_include/core/main_start.php");

$demoSite = get_param('demo_site');
if($demoSite
    && (Common::getOption('tmpl_loaded', 'tmpl') == 'mixer'
        || Common::getTmplSet() == 'urban')) {
    redirect('index.php');
}

$template = 'join.html';

$cmd = get_param('cmd', '');
if(($cmd == 'login' || $cmd == 'please_login')
    && Common::getOption('login_page_template', 'template_options')) {
    $template = Common::getOption('login_page_template', 'template_options');
}
if(($cmd == 'register'  || $cmd == '' || $cmd == 'wait_approval')
    && Common::getOption('register_page_template', 'template_options')) {
    $template = Common::getOption('register_page_template', 'template_options');
    $g['page_mode'] = 'for_join_page';
}

if (get_session('ref_login_link') == '') {

    $refererFromSite = Common::refererFromSite();

    if(strpos($refererFromSite, 'join_facebook.php') === false) {
        set_session('ref_login_link', $refererFromSite);
    }
}

$ajax = get_param('ajax');
if($ajax) {
    if ($cmd == 'register') {
        $page = new CJoinForm('join', null);
        $page->init();
        echo $page->responseData;
    } else {
        $page = new CJoinPage('', '', '', '', true);
        $page->action(false);
        echo $page->message;
    }
    die();
}

Common::mainPageSetRandomImage();

$page = new CJoinPage("", preparePageTemplate($template));
$header = new CHeader("header", $g['tmpl']['dir_tmpl_main'] . "_header.html");
$page->add($header);
$footer = new CFooter("footer", $g['tmpl']['dir_tmpl_main'] . "_footer.html");
$page->add($footer);

$register = new CJoinForm("join", null);
$page->add($register);

include("./_include/core/main_close.php");