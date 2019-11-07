<?php
/* (C) Websplosion LTD., 2001-2014

IMPORTANT: This is a commercial software product
and any kind of using it must agree to the Websplosion's license agreement.
It can be found at http://www.chameleonsocial.com/license.doc

This notice may not be removed from the source code. */

$area = "login";
include("./_include/core/pony_start.php");

$action = get_param('action');
if (Common::isOptionActive('free_site') && !get_param('ajax')
    //|| (!Common::isAvailableFeaturesSuperPowersMobile() && $action != 'refill_credits')
    || (!Common::isOptionActive('credits_enabled') && $action == 'refill_credits')) {
    redirect(Common::getHomePage());
}

class CGold extends CHtmlBlock {

    function action() {
        global $g_user;

        $cmd = get_param('cmd');

        if ($cmd == 'upgrade') {
            $system = get_param('system');
            $item = get_param('item', 1);
            $service = get_param('service');
            $typeService = get_param('type');
            $guid = guid();

            $optionTmplTypePaymentPlan = Common::getOption('type_payment_plan', 'template_options');
            $isImpact = $optionTmplTypePaymentPlan == 'impact';

            $isAjaxRequest = get_param('ajax');
            $responseData = 'before_error';
            $isAllowPaidService = get_param('allow_paid_service');
            if ($isImpact && $isAjaxRequest && ($isAllowPaidService || IS_DEMO)) {
                $responseData = false;
                if ($service) {
                    $serviceCredits = Pay::getServicePrice($service, 'credits');
                }
                if ($isAllowPaidService) {
                    $userCredits = User::getInfoBasic($guid, 'credits', 0, false);
                    $payment = $userCredits - $serviceCredits;
                    if ($payment >= 0) {
                        if ($service == 'search') {
                            $popularity = User::getMaxPopularityInCity($g_user['city_id'], true);
                            if (!$popularity) {
                                $popularity = 1;
                            }
                            $data = array('popularity' => $popularity,
                                          'credits' =>  $payment,
                                          'date_search' => date('Y-m-d H:i:s'));
                            User::update($data);
                        }
                        $responseData = array('type' => 'payment_success',
                                              'data' => lSetVars('credits_left', array('credit' => $payment)));
                    } else {
                        $responseData = array('type' => 'service_not_paid');
                    }
                } else {
                    $typeFeatures = Pay::upgradeUser($guid, $item, false);
                    if ($service) {
                        $userCredits = User::getInfoBasic($guid, 'credits', 0, false);
                        if ($userCredits < $serviceCredits) {
                            $responseData = array('type' => 'refill');
                        } else {
                            $responseData = array('type' => '',
                                                  'data' => lSetVarsCascade('you_have_credits', array('credit' => $userCredits)));
                        }
                    } else {
                        $vars = array('data' => User::getWhatDateActiveSuperPowers());
                        $responseData = array('type' => '',
                                              'data' => lSetVars('superpowers_active_till', $vars));
                    }
                    $responseData['type_features'] = $typeFeatures;
                }
                die(getResponseDataAjaxByAuth($responseData));
            }


            $urlPay = '../_pay/' . $system . '/before.php';
            //$requestUri = base64_encode(Pay::getUrl());
            if (file_exists($urlPay)) {
                $sql = "SELECT `type` FROM `payment_plan` WHERE `item` = " . to_sql($item);
                $type = DB::result($sql);

                $setResponseSes = false;
                $requestUri = get_param('request_uri');
                if (!$requestUri) {
                    $setResponseSes = true;
                    $url = Common::urlSite() . ($type == 'credits' ? 'upgrade.php?action=refill_credits' : Common::pageUrl('upgrade'));
                    if ($service) {
                        if ($isImpact) {
                            $url .= '&service=' . $service . '&request_uid=' . get_param('request_uid');
                        } else {
                            if ($service == 'gift') {
                                $url = Common::urlSite() . 'gifts_send.php?user_id=' . get_param('user_to');
                            }
                        }
                    }
                    $requestUri = $url;
                } elseif ($service) {
                    if ($service == 'spotlight') {
                        $url = base64_decode($requestUri);
                    }
                    $requestUri = $url;
                }

                $urlRedirect = $urlPay . '?item=' . $item . '&request_uri=' . base64_encode($requestUri);
                if ($isImpact && $typeService) {
                    $urlRedirect .= '&type=' . $typeService;
                }

                if ($isAjaxRequest) {
                    $responseData = false;
                    if (IS_DEMO) {
                        Pay::upgradeUser(guid(), $item, $setResponseSes);
                        $responseData = $requestUri;
                    } else {
                        $responseData = $urlRedirect;
                    }
                }
            }
            if ($isAjaxRequest) {
                die(getResponseDataAjaxByAuth($responseData));
            }
        }
    }

    function parseBlock(&$html) {
        global $g;
        global $g_user;
        global $pay;

        $cmd = get_param('cmd');
        $action = get_param('action');
        $service = get_param('service');
        $requestUid = get_param('request_uid');

        if ($cmd == 'payment_error') {
            $html->parse('payment_error');
        }

        if ($html->varExists('url_page_profile_upgrade')) {
            if ($action) {
                $urlPage = Common::pageUrl('refill_credits');
                if ($service && in_array($service, array('search', 'video_chat', 'audio_chat', 'message'))) {
                    if ($service == 'search') {
                        $urlPage = Common::pageUrl('profile_boost');
                    } else {
                        $urlPage .= (parse_url($urlPage, PHP_URL_QUERY) ? '&' : '?')  . 'service=' . $service . '&request_uid=' . $requestUid;
                    }
                }
            } else {
                $urlPage = Common::pageUrl('upgrade');
            }
            $html->setvar('url_page_profile_upgrade', $urlPage);
        }
        $typePaymentPlan = Common::getOption('type_payment_plan', 'template_options');
        $isProfileBoostImpact = $typePaymentPlan == 'impact' && $action == 'refill_credits' && $service == 'search';
        $btnActionTitle = '';
        $isSuperPowers = User::isSuperPowers();
        $actionCredits = array('refill_credits','payment_services');
        $isInAppPurchaseEnabled = Common::isInAppPurchaseEnabled();
        $isPaymentModuleParse = false;
        $blockPayment = 'payment_module';
        $blockPaymentInfo = "{$blockPayment}_info";
        if ($html->blockExists($blockPayment)
            && ((!$isSuperPowers && $action == '')
                ||in_array($action, $actionCredits))) {
            $paymentModuleTitle = l('choose_a_package');
            $price = null;
            if ($action == 'payment_services') {
                $type = get_param('type');
                $giftId = get_param('gift_id');
                if ($type == 'gift' && $giftId) {
                    $price = DB::result('SELECT `credits` FROM `gifts` WHERE `id` = ' . to_sql($giftId));
                } elseif($type == 'spotlight'){
                    $price = Pay::getServicePrice('spotlight','credits');
                }
                $html->setvar('service', $type);
                $html->setvar('user_to', get_param('user_to'));
                $html->setvar('request_uri', get_param('request_uri'));
                $paymentModuleTitle = lSetVars('the_service_costs_credits', array('credits' => $price));
            } else {
                $html->setvar('request_uri', base64_decode(get_param('request_uri')));
            }
            $html->setvar("{$blockPaymentInfo}_head", $paymentModuleTitle);
            $isActionCredits = in_array($action, $actionCredits);
            if ($isInAppPurchaseEnabled) {
                $btnActionTitle = l('upgrade_now');
                $planItems=Pay::parsePaymentPlan($html, $isActionCredits ? 'credits' : 'membership', $price);
                Pay::parsePaymentSystem($html,$planItems);
                $isPaymentModuleParse = true;
            } else {
                if ($typePaymentPlan != 'impact' || !$isProfileBoostImpact) {
                    $textInfo = $isActionCredits ?  l('buy_credits') : l('upgrade_text');
                    $html->setvar("{$blockPaymentInfo}_text", $textInfo);
                    $html->parse($blockPaymentInfo);
                }else if($isProfileBoostImpact){
                    $isPaymentModuleParse = true;
                }
            }
        } elseif ($html->blockExists($blockPaymentInfo) && $isSuperPowers && $action == '') {
            $html->setvar("{$blockPaymentInfo}_head", l('superpowers_active'));
            $vars = array('data' => User::getWhatDateActiveSuperPowers());
            $html->setvar("{$blockPaymentInfo}_text", lSetVars('superpowers_active_till', $vars));
            $html->parse($blockPaymentInfo);
        }

        $isParseResponseRefill = true;
        $btnActionDecor = 'pink';
        if (!$action) {
            $typePaymentFeatures = Common::getOption('type_payment_features', 'template_options');
            $typePaymentFeatures = '%' . $typePaymentFeatures . '%';
            $features = DB::select('payment_features', '`type` LIKE ' . to_sql($typePaymentFeatures) . ' AND `status` = 1');
            foreach ($features as $key => $item) {
                if ($item['alias'] == '3d_city' && !Common::isModuleCityActive()) {
                    continue;
                }
                if ($item['alias'] == 'videochat' && !Common::isOptionActive('videochat')) {
                    continue;
                }
                if ($item['alias'] == 'audiochat' && !Common::isOptionActive('audiochat')) {
                    continue;
                }
                $html->parse("feature_{$item['alias']}", false);
            }
            if ($html->blockExists('superpowers_info')) {
                $html->parse('superpowers_info');
            }
        } elseif($action == 'refill_credits') {
            if ($typePaymentPlan == 'impact') {
                $html->setvar('request_uid', $requestUid);
                $html->setvar('service', $service);
                if (!$service) {
                    $btnActionTitle = l('refill');
                    $html->parse('payment_module_refill');
                } else {
                    $credits = Pay::getServicePrice($service, 'credits');
                    $html->setvar('service_costs', lSetVars('this_service_costs_credits_boost', array('credit' => $credits)));
                    $lCredits = lSetVarsCascade('you_have_credits', array('credit' => $g_user['credits']));
                    $html->setvar('you_have_credits', $lCredits);
                    if ($g_user['credits'] < $credits) {
                        $btnActionTitle = l('refill');
                        $html->parse("service_info_hide_{$service}", true);
                        if ($service == 'message') {
                            $html->parse("refill_info_hide_credit_add");
                        }
                        if (!$isInAppPurchaseEnabled && $isProfileBoostImpact) {
                            $isPaymentModuleParse = false;
                            $html->setvar("{$blockPaymentInfo}_text", l('buy_credits'));
                            $html->parse($blockPaymentInfo);
                        }
                    } else {
                        $isParseResponseRefill = false;
                        $html->setvar('allow_paid_service', 1);
                        $btnActionTitle = l('go');
                        $html->parse("service_info_{$service}");
                        if ($service == 'message') {
                            if (get_session('response_refill_credits')) {
                                $html->parse("refill_info_hide_{$service}");
                            } else {
                                $html->parse("refill_info_hide_credit_add");
                            }
                            $html->parse("service_info_hide_{$service}");
                        } else {
                            $html->parse("refill_info_hide_{$service}");
                        }
                        $html->parse($blockPayment . '_hide');

                        $html->setvar('costs', $credits);
                        $html->setvar('balans', $g_user['credits']);
                        $btnActionDecor = 'blue';
                    }
                    $html->parse("payment_module_{$service}");
                }
            }
        }


        if ($html->varExists('btn_action') && $btnActionTitle) {
            $html->setvar('btn_action', $btnActionTitle);
        }
        if ($isPaymentModuleParse) {
            $btnActionCl = "btn_action_{$btnActionDecor}";
            if ($html->blockExists($btnActionCl)) {
                $html->parse($btnActionCl, false);
            }
            $html->parse($blockPayment);
        }

        $block = 'response_refill_credits';
        if ($html->blockExists($block) && get_session($block)) {
            delses($block);
            if($isParseResponseRefill){
                $html->parse($block, false);
            }
        }

        parent::parseBlock($html);
    }
}

if (Common::isOptionActive('page_upgrade_allowed', 'template_options')) {
    $page = new CGold("", $g['tmpl']['dir_tmpl_mobile'] . "upgrade.html");
} else {
    $page = new CHtmlBlock("", $g['tmpl']['dir_tmpl_mobile'] . "upgrade.html");
}
$header = new CHeader("header", $g['tmpl']['dir_tmpl_mobile'] . "_header.html");
$page->add($header);
$footer = new CFooter("footer", $g['tmpl']['dir_tmpl_mobile'] . "_footer.html");
$page->add($footer);

if (Common::getOption('set', 'template_options') == 'urban') {
    if (!intval(get_param('type')) && Common::isParseModule('user_menu')) {
        $user_menu = new CUserMenu("user_menu", $g['tmpl']['dir_tmpl_mobile'] . "_user_menu.html");
        $header->add($user_menu);
    }
} else {
    $user_menu = new CUserMenu("user_menu", $g['tmpl']['dir_tmpl_mobile'] . "_user_menu.html");
    $user_menu->active = 'mail';
    $page->add($user_menu);
}

loadPageContentAjax($page);

include("./_include/core/main_close.php");