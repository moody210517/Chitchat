<?php

/* (C) Websplosion LTD., 2001-2014

  IMPORTANT: This is a commercial software product
  and any kind of using it must agree to the Websplosion's license agreement.
  It can be found at http://www.chameleonsocial.com/license.doc

  This notice may not be removed from the source code. */

include("../_include/core/administration_start.php");

class CAdminMailMass extends CHtmlList {

    var $message_send = '';
    var $table = 'massmail';
    var $tableAlias = 'm';
    var $fields = array(
        'id',
        'subject',
        'text',
        'for',
        'languages',
        'date',
        'status',
    );
    var $m_sql_order = 'id DESC';

    function action()
    {
        global $g;

        $cmd = get_param('cmd', '');
        $lang = get_param_array('language');

        if ($cmd == 'send') {
            $whereLang = '';
            if (count($lang) > 0) {
                $whereLangParts = array();
                foreach ($lang as $language => $value) {
                    if($lang == 'default') {
                        $whereLangParts[] = "''";
                    }
                    $whereLangParts[] = to_sql($language);
                }
                $whereLangValue = implode(',', $whereLangParts);
                if ($whereLangValue != '') {
                    $whereLang = ' AND lang IN (' . $whereLangValue . ')';
                }
            }

            $subject = get_param('subject', '');
            $text = get_param('text', '');
            $to = trim(get_param('to', ''));

            $toPartners = get_param('partners', '');
            $toUsers = get_param('users', '');
            $toOther = get_param('other', '');

            if ($to != '') {
                if(Common::validateEmail($to)) {
                    send_mail($to, $g['main']['info_mail'], $subject, $text);
                    $this->message_send = l('sent');
                } else {
                    $this->message_send = l('Specific email is incorrect');
                }
            } elseif($whereLang == '') {
                $this->message_send = l('Please choose languages');
            } else {

                if($toPartners == '1' || $toUsers == '1' || $toOther == '1') {

                    $send_partners = 0;
                    if(!$toUsers && !$toOther) {
                        $send_partners = 1;
                    }

                    $row = array(
                        'subject' => $subject,
                        'text' => $text,
                        'users' => $toUsers,
                        'other' => $toOther,
                        'partners' => $toPartners,
                        'languages' => $whereLangValue,
                        'date' => time(),
                    );

                    DB::insert($this->getTable(), $row);

        			$this->message_send = l('Mail is added.');

                }
            }
        }

        $id = get_param('id');
        $where = 'id = ' . to_sql($id);

        if ($cmd == 'delete') {
            DB::delete($this->getTable(), $where);
        }
        if ($cmd == 'start') {
            DB::update($this->getTable(), array('status' => 0), $where);
        }
        if ($cmd == 'stop') {
            DB::update($this->getTable(), array('status' => 1), $where);
        }

        if($cmd == 'update') {
            $items = new CAdminConfig('config_fields', '');
            $items->setModule('massmail');
            $items->action();
        }
    }

    function parseBlock(&$html)
    {
        global $g;
        global $p;
        $html->setvar("message_send", $this->message_send);
        $html->setvar("to", get_param("to", ""));

        $cmd = get_param('cmd');
        $id = get_param('id');

        $massmail = null;

        if($cmd == 'view') {
            $sql = 'SELECT * FROM ' . $this->getTable() . ' WHERE id = ' . to_sql($id);
            $massmail = DB::row($sql);
        }

        $html->setvar("massmail_subject", htmlspecialchars(get_param('subject', $massmail['subject'])));
        $html->setvar("massmail_text", get_param("text", $massmail['text']));

        $lang = get_param_array('language');

        $langs = Common::listLangs();

        if ($langs) {
            foreach ($langs as $file => $title) {
                $html->setvar('language_value', $file);
                $html->setvar('language_title', $title);

                $languageChecked = '';

                if (isset($lang[$file]) && $lang[$file] == 1) {
                    $languageChecked = 'checked';
                }

                $html->setvar('language_checked', $languageChecked);
                $html->parse('language');
            }
        }

        $lang = Common::getOption('administration', 'lang_value');
        $langTinymceUrl =  $g['tmpl']['url_tmpl_administration'] . "js/tinymce/langs/{$lang}.js";
        if (!file_exists($langTinymceUrl)) {
            $lang = 'default';
        }
        $html->setvar('lang_vw', $lang);

        parent::parseBlock($html);
    }

	function onItem(&$html, $row, $i, $last)
	{
		$this->m_field['date'][1] = date('Y-m-d H:i:s', $row['date']);

        $forItems = array();

        $forItemsList = array('users', 'other', 'partners');
        foreach($forItemsList as $value) {
            if($row[$value]) {
                $forItems[] = l($value);
            }
        }

        $languagesItems = explode(',' , $row['languages']);
        foreach($languagesItems as $key => $value) {
            $value = trim($value, "'");
            if($value == 'default') {
                $value = 'language_default';
            }
            $languagesItems[$key] = l($value);
        }

        $this->m_field['for'][1] = implode(', ', $forItems);
        $this->m_field['languages'][1] = implode(', ', $languagesItems);

		$html->setvar('id', $row['id']);

		if($row['status']==0) {
			$status = l('sending');
			$html->parse('stop', false);
			$html->setblockvar('start', '');
		}
		if($row['status']==1) {
			$status = l('stop');
			$html->parse('start', false);
			$html->setblockvar('stop', '');
		}
		if($row['status']==2) {
			$status = l('sent');
			$html->parse('start', false);
			$html->setblockvar('stop', '');
		}

		$this->m_field['status'][1] = $status;

        if ($i % 2 == 0) {
            $html->setvar("class", 'color');
            $html->setvar("decl", '_l');
            $html->setvar("decr", '_r');
        } else {
            $html->setvar("class", '');
            $html->setvar("decl", '');
            $html->setvar("decr", '');
        }

	}

}

$page = new CAdminMailMass("massmail", $g['tmpl']['dir_tmpl_administration'] . "massmail.html");

$items = new CAdminConfig("config_fields", $g['tmpl']['dir_tmpl_administration'] . "_config.html");
$items->setModule('massmail');
$page->add($items);

$header = new CAdminHeader("header", $g['tmpl']['dir_tmpl_administration'] . "_header.html");
$page->add($header);
$footer = new CAdminFooter("footer", $g['tmpl']['dir_tmpl_administration'] . "_footer.html");
$page->add($footer);

include("../_include/core/administration_close.php");