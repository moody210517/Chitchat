<?
/* (C) Websplosion LTD., 2001-2014

IMPORTANT: This is a commercial software product
and any kind of using it must agree to the Websplosion's license agreement.
It can be found at http://www.chameleonsocial.com/license.doc

This notice may not be removed from the source code. */

//Error_Reporting(E_ALL & ~E_NOTICE);
$xml_param = "<?xml version=\"1.0\" encoding=\"utf-8\"?>";
$xml_param .= "<events>";
$xml_param .= "  <day number=\"01\">";
$xml_param .= "    <event event_hours=\"11\" event_minutes=\"00\">";
$xml_param .= "      <nameh><![CDATA[событие 1]]></nameh>";
$xml_param .= "      <name><![CDATA[событие 1]]></name>";
$xml_param .= "      <title><![CDATA[это первое событие на этот день, просто событие]]></title>";
$xml_param .= "    </event>";
$xml_param .= "    <event event_hours=\"12\" event_minutes=\"00\">";
$xml_param .= "      <nameh><![CDATA[событие 2]]></nameh>";
$xml_param .= "      <name><![CDATA[событие 2]]></name>";
$xml_param .= "      <title><![CDATA[это второе событие на этот день, такое событие - подумать только! А сегодня уже наступило!]]></title>";
$xml_param .= "    </event>";
$xml_param .= "  </day>";
$xml_param .= "  <day number=\"07\">";
$xml_param .= "    <event event_hours=\"11\" event_minutes=\"00\">";
$xml_param .= "      <nameh><![CDATA[событие 1]]></nameh>";
$xml_param .= "      <name><![CDATA[событие 1]]></name>";
$xml_param .= "      <title><![CDATA[это первое событие на этот день, просто событие]]></title>";
$xml_param .= "    </event>";
$xml_param .= "    <event event_hours=\"12\" event_minutes=\"00\">";
$xml_param .= "      <nameh><![CDATA[событие 2]]></nameh>";
$xml_param .= "      <name><![CDATA[событие 2]]></name>";
$xml_param .= "      <title><![CDATA[это второе событие на этот день, такое событие - подумать только! А сегодня уже наступило!]]></title>";
$xml_param .= "    </event>";
$xml_param .= "  </day>";
$xml_param .= "  <day number=\"21\">";
$xml_param .= "    <event event_hours=\"11\" event_minutes=\"00\">";
$xml_param .= "      <nameh><![CDATA[событие 1]]></nameh>";
$xml_param .= "      <name><![CDATA[событие 1]]></name>";
$xml_param .= "      <title><![CDATA[это первое событие на этот день, просто событие]]></title>";
$xml_param .= "    </event>";
$xml_param .= "    <event event_hours=\"12\" event_minutes=\"00\">";
$xml_param .= "      <nameh><![CDATA[событие 2]]></nameh>";
$xml_param .= "      <name><![CDATA[событие 2]]></name>";
$xml_param .= "      <title><![CDATA[это второе событие на этот день, такое событие - подумать только! А сегодня уже наступило!это второе событие на этот день, такое событие - подумать только! А сегодня уже наступило!это второе событие на этот день, такое событие - подумать только! А сегодня уже наступило!это второе событие на этот день, такое событие - подумать только! А сегодня уже наступило!это второе событие на этот день, такое событие - подумать только! А сегодня уже наступило! А сегодня уже наступило!это второе событие на этот день, такое событие - подумать только! А сегодня уже наступило!это второе событие на этот день, такое событие - подумать только! А сегодня уже наступило!это второе событие на этот день, такое событие - подумать только! А сегодня уже наступило!это второе событие на этот день, такое событие - подумать только! А сегодня уже наступило!]]></title>";
$xml_param .= "    </event>";
$xml_param .= "  </day>";
$xml_param .= "</events>";

echo $xml_param;

?>