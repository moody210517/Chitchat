<?php
/* (C) Websplosion LTD., 2001-2014

IMPORTANT: This is a commercial software product
and any kind of using it must agree to the Websplosion's license agreement.
It can be found at http://www.chameleonsocial.com/license.doc

This notice may not be removed from the source code. */

if (!Common::isOptionActive('blogs')) {
    redirect(Common::toHomePage());
}

if(!isset($checkBlogsPaymentOff)) {
    payment_check('blogs_read');
}

require_once dirname(__FILE__) . '/includes.php';

function blogs_render_page() {
    global $page;
    global $g;
    $curPage = curpage();
    if($curPage == 'index') {
        $curPage = 'blogs';
    }

    $page = new CPage("", $g['tmpl']['dir_tmpl_main'] . $curPage . ".html");
    $header = new CHeader("header", $g['tmpl']['dir_tmpl_main'] . "_header.html");
    $page->add($header);
    $footer = new CFooter("footer", $g['tmpl']['dir_tmpl_main'] . "_footer.html");
    $page->add($footer);
    $bheader = new CBlogsHeader("blogs_header", $g['tmpl']['dir_tmpl_main'] . "_blogs_header.html");
    $page->add($bheader);
    $bside = new CBlogsSide("blogs_side", $g['tmpl']['dir_tmpl_main'] . "_blogs_side.html");
    $page->add($bside);
    $bfooter = new CBlogsFooter("blogs_footer", $g['tmpl']['dir_tmpl_main'] . "_blogs_footer.html");
    $page->add($bfooter);
}
