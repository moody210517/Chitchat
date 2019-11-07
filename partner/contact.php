<?php

/* (C) Websplosion LTD., 2001-2014

  IMPORTANT: This is a commercial software product
  and any kind of using it must agree to the Websplosion's license agreement.
  It can be found at http://www.chameleonsocial.com/license.doc

  This notice may not be removed from the source code. */

include("../_include/core/partner_start.php");

class CPartnerContact extends CHtmlBlock {

    var $message;

    function action() {
        global $g;
        $cmd = get_param('cmd');

        if ($cmd == 'send') {

            $mail = get_param("email");
            $this->message = "";

            if (!Common::validateEmail($mail)) {
                $this->message .= l('The E-mail incorrect. Please choose another.'). '<br />';
            }

            $name = strip_tags(get_param('username'));
            $contact_name = strip_tags(get_param('contact_name'));
            $phone = strip_tags(get_param('phone'));
            $company_name = strip_tags(get_param('name'));
            $comment = strip_tags(get_param('comment'));

            $alredySent = DB::result("SELECT `id` FROM `contact_partner` WHERE `comment` = " . to_sql($comment));
            if ($alredySent) {
                $this->message .= l('This message alredy was sent.') . '<br />';
            }

            if (Common::isOptionActive('recaptcha_enabled')) {
                require_once('_server/securimage/initRecaptcha.php');
                $secretKey = Common::getOption('recaptcha_secret_key');
                $recaptcha = new \ReCaptcha\ReCaptcha($secretKey);
                $recaptchaResponse = get_param('recaptcha');//g-recaptcha-response
                $resp = $recaptcha->verify($recaptchaResponse, $_SERVER['REMOTE_ADDR']);
                //var_dump($resp);
                if (!$resp->isSuccess()){
                    $this->message .=  l('incorrect_captcha') . '<br />';
                }
            } else {
                $captcha = get_param('captcha');
                if (!Securimage::check($captcha)) {
                    $this->message .=  l('incorrect_captcha') . '<br />';
                }
            }

            if ($this->message == '') {
                DB::execute("
                    INSERT INTO contact_partner
                    (name, company, real_name, phone, mail, comment)
                    VALUES(
                    " . to_sql($name) . ",
                    " . to_sql($company_name) . ",
                    " . to_sql($contact_name) . ",
                    " . to_sql($phone) . ",
                    " . to_sql($mail) . ",
                    " . to_sql($comment) . "
                    )
                ");
                if (Common::isEnabledAutoMail('partner_contact')) {
                    $vars = array(
                        'title' => $g['main']['title'] . ' ' . $name,
                        'name' => $name,
                        'contact_name' => $contact_name,
                        'company_name' => $company_name,
                        'from' => $mail,
                        'phone' => $phone,
                        'comment' => $comment,
                    );
                    Common::sendAutomail(Common::getOption('administration', 'lang_value'), $g['main']['info_mail'], 'partner_contact', $vars);
                }
                $this->message .= l('Your message has been sent.'). '<br />';
            }
        }
    }

    function parseBlock(&$html) {
        $html->setvar("contact_message", $this->message);
        Common::parseCaptcha($html);
        parent::parseBlock($html);
    }

}

$page = new CPartnerContact("", $g['tmpl']['dir_tmpl_partner'] . "contact.html");
$header = new CPartnerHeader("header", $g['tmpl']['dir_tmpl_partner'] . "_header.html");
$page->add($header);
$footer = new CPartnerFooter("footer", $g['tmpl']['dir_tmpl_partner'] . "_footer.html");
$page->add($footer);

$banner_top = new CbannerP("banner_top", $g['tmpl']['dir_tmpl_partner'] . "_banner.html");
$page->add($banner_top);

include("../_include/core/partner_close.php");
?>