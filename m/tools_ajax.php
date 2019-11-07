<?php
/* (C) Websplosion LTD., 2001-2014

IMPORTANT: This is a commercial software product
and any kind of using it must agree to the Websplosion's license agreement.
It can be found at http://www.chameleonsocial.com/license.doc

This notice may not be removed from the source code. */

include('./_include/core/pony_start.php');

$cmd = get_param('cmd');
$tmplName = Common::getOption('name', 'template_options');
$dirTmpl = $g['tmpl']['dir_tmpl_mobile'];
$display = get_param('display');
$guid = guid();
$isAuth = $guid ? true : false;
$responseData = null;
$responsePage = null;
if($cmd == 'location') {
    $param  = get_param('param');
    $method = 'list' . get_param('method');
    echo Common::$method($param, -1);
    //listStates($country, $selected);
    //listCities($state, $selected);
}elseif(in_array($cmd, array('states', 'cities'))) {
    $id = get_param('select_id');
    $method = 'list' . $cmd;
    $responseData['list'] = Common::$method($id);
}elseif ($cmd == 'send_request_private_access') {
    $responseData = CIm::sendRequestPrivateAccess();
}elseif ($cmd == 'activated_spotlight') {
    $responseData = Spotlight::mobileActivated();
}elseif ($cmd == 'check_add_spotlight') {
    $responseData = Spotlight::mobileCheckAdd();
} elseif ($cmd == 'get_data_photos_gallery') {
    $uid = get_param('uid', guid());
    $listTmpl = array(
        'main' => "{$dirTmpl}_pp_photo_gallery.html",
        'comments' => "{$dirTmpl}_photo_gallery_items.html"
    );
    $responsePage = new CUsersProfile(null, $listTmpl);
    $responsePage->m_sql_where = 'u.user_id=' . to_sql($uid);
} elseif ($cmd == 'get_data_videos_gallery') {
    $uid = get_param('uid', guid());
    $listTmpl = array(
        'main' => "{$dirTmpl}_pp_video_gallery.html",
        'comments' => "{$dirTmpl}_photo_gallery_items.html"
    );
    include_once('../_include/current/vids/tools.php');
    //CProfilePhoto::setVideoAddView(true);
    $responsePage = new CUsersProfile(null, $listTmpl);
    $responsePage->m_sql_where = 'u.user_id=' . to_sql($uid);
} elseif($cmd=='ads_visible'){
    $responseData = false;
    if ($isAuth) {
        $pos = get_param('pos');
        $status = intval(get_param('status'));
        if ($status && !User::accessCheckFeatureSuperPowers('kill_the_ads')) {
            $responseData = 'upgrade';
        }  else {
            $ads = json_decode($g_user['hide_ads'], true);
            if (!$ads) {
                $ads = array();
            }
            $ads[$tmplName] = $status;
            $data = json_encode($ads);
            DB::update('user', array('hide_ads' => $data), '`user_id` = ' . to_sql($guid));
            $g_user['hide_ads'] = $data;
            if (!$status) {
                class CBannerPage extends CHtmlBlock {
                    public $posBanner = '';
                    function parseBlock(&$html) {
                        if ($this->posBanner) {
                            CBanner::getBlock($html, $this->posBanner, '_user');
                        }
                        parent::parseBlock($html);
                    }
                }
                $page = new CBannerPage('', "{$dirTmpl}_banner_item.html");
                $page->posBanner = $pos;
                $responseData = getParsePageAjax($page);
            }else{
                $responseData = true;
            }
        }
    }
}

if (isset($responsePage)) {
    echo getResponsePageAjaxAuth($responsePage);
}

if (isset($responseData)) {
    die(getResponseDataAjaxByAuth($responseData));
}

DB::close();