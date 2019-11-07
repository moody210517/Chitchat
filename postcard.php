<?php
/* (C) Websplosion LTD., 2001-2014

IMPORTANT: This is a commercial software product
and any kind of using it must agree to the Websplosion's license agreement.
It can be found at http://www.chameleonsocial.com/license.doc

This notice may not be removed from the source code. */

$area = "login";
include("./_include/core/main_start.php");

payment_check('mail_compose');

class CPage extends CHtmlBlock
{
    function action() {
        $cmd = get_param('cmd');
        if($cmd == 'lang') {
            $game = get_param('game',false);
            
            header('Content-Type: text/xml; charset=UTF-8');
            header('Cache-Control: no-cache, must-revalidate');

            $words = array(
                'loading',
                'none',
                'Please_enter_your_text_here',
                'upload_on_the_server',
                'background',
                'object',
                'sound',
                'Choose_background',
                'Choose_object',
                'Sound',
                'Upload_background',
                'Text',
                'Preview',
                'Send',
            );
            $lang = '<lang>';
            foreach($words as $wordKey) {
                $lang .= "<word name='$wordKey'>" . l($wordKey,false,$game) . '</word>';
            }
            $lang .= '</lang>';

            echo $lang;
            die();
        }
    }
    function parseBlock(&$html)
	{
        $receiver = intval(get_param('user_id'));
        if(User::isBlocked('mail', $receiver, guid())) {
            $user =   User::getInfoBasic($receiver);
            redirect('mail_compose.php?cmd=sent&name='.$user['name']);
        }
		#$html->setvar('uid', $receiver);
        $html->setvar('flash_postcard', User::flashPostcard($receiver));
		parent::parseBlock($html);
	}
}

$page = new CPage("", $g['tmpl']['dir_tmpl_main'] . "postcard.html");
$header = new CHeader("header", $g['tmpl']['dir_tmpl_main'] . "_header.html");
$page->add($header);
$footer = new CFooter("footer", $g['tmpl']['dir_tmpl_main'] . "_footer.html");
$page->add($footer);

include("./_include/core/main_close.php");

?>