var mobileAppLoaded = false;
var appCurrentImUserId = false;
var appCityListUser = {};
var appCityLastMsgId = 0;
var isWebglDetect=true;

/* Path */
var url_main = '{url_main}';
var url_ajax = '../ajax.php';
var url_ajax_mobile = '{url_main}tools_ajax.php';
var url_files = '{url_files}';
var url_tmpl_mobile = '{url_tmpl_mobile}';
var url_tmpl_mobile_images = '{url_tmpl_mobile}images/';
var urlCity = '{url_city}';
var url_server = '{url_main}update_server_ajax.php';

/* lib.js */
var ALERT_HTML_ERROR        = '{j_alert_html_title_error}';
var ALERT_HTML_OK           = '{j_alert_html_ok}';
var ALERT_HTML_ALERT        = '{j_alert_html_alert}';
var ALERT_HTML_CANCEL       = '{j_cancel}';
var ALERT_HTML_ARE_YOU_SURE = '{j_are_you_sure}';
var ALERT_HTML_SUCCESS      = '{j_alert_success}';
var ALERT_HTML_BTN_DONE     = '{j_alert_btn_done}';
var ALERT_HTML_OOOPS        = '{j_ooops_seems_no_one_is_here}';