<?php

/* (C) Websplosion LTD., 2001-2014

  IMPORTANT: This is a commercial software product
  and any kind of using it must agree to the Websplosion's license agreement.
  It can be found at http://www.chameleonsocial.com/license.doc

  This notice may not be removed from the source code. */

function send_mail($to_mail, $from_mail, $subject, $message, $name = NULL)
{
    global $g;

    static $emailQueue = null;

    if ($name === NULL) {
        $name = Common::getOption('title', 'main');
    }

    if(EmailQueue::isActive() && EmailQueue::isAddModeActive()){
        if(!$emailQueue) {
            $emailQueue = new EmailQueue();
        }
        $emailQueue->add(array(
            'from' => $from_mail,
            'name' => trim($name),
            'to' => $to_mail,
            'subject' => $subject,
            'message' => $message,
            'added_at' => date('Y-m-d H:i:s'),
        ));

        $emailQueue->logger('Email add', "$from_mail - $to_mail");

        return;
    }

    if($name != '') {
        $name = "\"$name\" ";
    }

    $headers = "";
    $headers .= "From: " . $name . "<" . $from_mail . ">" . "\n";
    $headers .= "Reply-To: " . "<" . $from_mail . ">" . "\n";
    $headers .= "Return-Path: " . "<" . $from_mail . ">" . "\n";
    $headers .= "Message-ID: <" . time() . "-" . $from_mail . ">" . "\n";
    $headers .= "X-Mailer: PHP v" . phpversion() . "\n";
    $headers .= 'Date: ' . date("r") . "\n";
    //$headers .= 'Sender-IP: ' . $_SERVER["REMOTE_ADDR"] . "\r\n";
    $headers .= 'MIME-Version: 1.0' . "\n";
    $headers .= "Content-Type: text/html; charset=utf-8" . "\n";
    $headers .= "Content-Transfer-Encoding: 8bit" . "\n";

    $to = trim(preg_replace("/[\r\n]/", "", $to_mail));

    // FIX bare LF
	$message = preg_replace('#(?<!\r)\n#', "\r\n", $message);

    if (file_exists(dirname(__FILE__) . '/../lic-cham-1.0-dating.txt')) {
        $filename = $g['path']['dir_files'] . 'temp/' . microtime(true) . '_' . md5($to) . '.html';
        $data = "TO: $to<br>SUBJECT: $subject<br>TEXT:<br>$message";
        file_put_contents($filename, $data);
        return;
    }

    if (Smtp::isActive()) {
        send_mail_smtp($to_mail, $from_mail, $subject, $message, $name);
        return;
    }

    if ($subject != '') {
        $subject = '=?utf-8?b?' . base64_encode(trim(str_replace(array("\r", "\n"), "", $subject))) . "?=";
    }

    $sf = ini_get('sendmail_from');
    ini_set('sendmail_from', "<" . $from_mail . ">");

    if (!mail($to, $subject, $message, $headers)) {
        // disabled for demo
        trigger_error('send_mail(): Can\'t send mail via mail() function');
    }
    ini_set('sendmail_from', $sf);
}

function send_mail_smtp($to_mail, $from_mail, $subject, $message, $name = NULL)
{
    global $g;

    //include_once Smtp::configPath();

    $toName = null;
    $toMail = $to_mail;

    $pattern = '/(.*)<(.*)>/';
    preg_match($pattern, $to_mail, $matches);

    if(isset($matches[1]) && trim($matches[1])) {
        $toName = trim($matches[1]);
    }
    if(isset($matches[2])) {
        $toMail = trim($matches[2]);
    }

    $smtp = new Smtp($g['smtp']['server'], $g['smtp']['user'], $g['smtp']['password'], $g['smtp']['port']);

    $fromMail = (strpos($g['smtp']['user'], '@') !== false) ? $g['smtp']['user'] : $from_mail;

    $smtp->setFrom($fromMail, $name);
    $smtp->setTo($toMail, $toName);
    $smtp->setSubject($subject);
    $smtp->setMessage($message);
    if (!$smtp->send()) {
        trigger_error('send_mail(): Can\'t send mail via SMTP');
    }

    return;
}
