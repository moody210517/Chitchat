<?php
/* (C) Websplosion LTD., 2001-2014

IMPORTANT: This is a commercial software product
and any kind of using it must agree to the Websplosion's license agreement.
It can be found at http://www.chameleonsocial.com/license.doc

This notice may not be removed from the source code. */

$area = "public";
if(isset($_GET['login'])){
    unset($area);
}

include("./_include/core/pony_start.php");

if(guid()){
    User::logoutWoRedirect();
    redirect($_SERVER['REQUEST_URI']);
}
$area = "public";


$g['to_head'][] = '<link rel="stylesheet" href="'.$g['tmpl']['url_tmpl_mobile'].'css/main.css" type="text/css" media="all"/>';
$g['options']['no_user_menu'] = 'Y';

$responseAjax = get_param('ajax');
if($responseAjax) {
    $page = new CForgot('forget', null);
    $page->action(false);
    $responseData = $page->message;
    die(get_json_encode($responseData));
}

$page = new CForgot("", $g['tmpl']['dir_tmpl_mobile'] . "forgot_password.html");
$page->parseBanner = true;

$header = new CHeader("header", $g['tmpl']['dir_tmpl_mobile'] . "_header.html");
$page->add($header);
$footer = new CFooter("footer", $g['tmpl']['dir_tmpl_mobile'] . "_footer.html");
$page->add($footer);

loadPageContentAjax($page);

include("./_include/core/main_close.php");