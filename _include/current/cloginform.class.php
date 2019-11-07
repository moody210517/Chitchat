<?php
class CLoginForm extends CHtmlBlock
{

    var $message = '';

    function action()
    {
        global $g;
        global $l;

        $cmd = get_param('cmd', '');
        $ajax = get_param('ajax');
        if ($cmd == 'login') {

            /*$loginField = 'name';
            if (Common::isOptionActive('login_by_mail', 'template_options')) {
                $loginField = 'mail';
            }*/

            $login = get_param('user', '');
            $password = get_param('password', '');
            if (!$login || !$password) {
                $this->message = lAjax('Wrong password or log in information');
            } else {
                $sql = 'SELECT `user_id`, `active`, `ban_global` FROM user
                         WHERE (name = ' . to_sql($login, 'Text') . ' OR mail = ' . to_sql($login, 'Text') . ')
                           AND (password = ' . to_sql($password, 'Text') . ' OR password = ' . to_sql(md5($password), 'Text') . ')';
                $user = DB::row($sql);
                $id = 0;
                $userApproval = 0;
                $userBan = 0;

                if ($user != false) {
                    $id = $user['user_id'];
                    $userApproval = $user['active'];
                    $userBan = $user['ban_global'];
                }
                if ($id == 0) {
                    $this->message = lAjax('Wrong password or log in information');
                } else {
                    if (Common::isOptionActive('manual_user_approval') && !$userApproval) {
                        $this->message = lAjax('no_confirmation_account');
                    }
                    if($userBan==1){
                        $this->message = lAjax('account_has_been_banned');
                    }
                }

                if ($this->message == '') {
                    $this->message = '#js:logged:' . Common::getHomePage();
                    set_session('user_id', $id);
                    set_session('user_id_verify', $id);
                    if (get_param('remember')) {
                        $name = User::getInfoBasic($id, 'name');
                        set_cookie('c_user', $name, -1);
                        set_cookie('c_password', $password, -1);
                    } else {
                        set_cookie('c_user', '', -1);
                        set_cookie('c_password', '', -1);
                    }

                    User::updateLastVisit($id);
                    CStatsTools::count('logins', $id);
                }
            }
        }
    }

	function parseBlock(&$html)
	{
        Social::parse($html);

        CBanner::getBlock($html, 'right_column');

        if(IS_DEMO) {
            $html->setvar('login_user', demoLogin());
            $html->setvar('login_password', '1234567');
            $html->parse('demo');
        }

		parent::parseBlock($html);
	}
}