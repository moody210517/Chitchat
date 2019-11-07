<?php

class Linkedin
{
    private static $instance;
    private static $nameSocial='linkedin';

    /* private methods */

    private function getUrlAuth()
    {/*
        $params = $this->getParamsAuth();
        set_session(self::$nameSocial.'_client_id',$params['client_id']);
        set_session(self::$nameSocial.'_client_secret',$params['client_secret']);
*/
      return 'social_login.php?module='.self::$nameSocial;
    }

    private function getUrlToken()
    {
        return  '';
    }

    public function getParamsAuth()
    {
        $client_id = Common::getOption(self::$nameSocial.'_appid');
        $client_secret = Common::getOption(self::$nameSocial.'_secret');

        $params = array(
            'response_type' => 'code',
            'client_id'     => $client_id,
            'client_secret' => $client_secret,
        );
        return $params;
    }

    public function getUserInfo($code)
    {
        $result = false;
        $userInfo=false;

        $userInfo=get_session(self::$nameSocial.'_user_info',false);

    return $userInfo;

    }

    public static function getInstance()
    {
        global $g;
        if (isset($g['options'][self::$nameSocial.'_appid'])
            && isset($g['options'][self::$nameSocial.'_secret'])
            && $g['options'][self::$nameSocial.'_appid'] != ''
            && $g['options'][self::$nameSocial.'_secret'] != ''
        ) {

            if(self::$instance === null){
                // Create our Application instance (replace this with your appId and secret)
                self::$instance = new self(array(
                    'appId' => $g['options'][self::$nameSocial.'_appid'],
                    'secret' => $g['options'][self::$nameSocial.'_secret'],
                    'cookie' => true,
                ));

            }

            return  self::$instance;
        } else {
            return false;
        }
    }

    public function parse()
    {

    }

    public function getUserId()
    {
        $userInfo = get_session(self::$nameSocial.'_user_info');

        if(isset($userInfo['id'])){
            return $userInfo['id'];
        } else {
            return false;
        }
    }

    public function loginRedirectUrl()
    {
        $url = '';
        $url = $this->getUrlAuth();
        return $url;
    }

    public function setJoinInfo()
    {
        global $g;


        $me = get_session(self::$nameSocial.'_user_info');

        set_session(self::$nameSocial.'_id', 0);
        set_session(self::$nameSocial.'_photo', false);
        set_session('social_id', 0);
        set_session('social_photo', false);

        // check if already registered
        if ($me) {

            if (isset($me['emailAddress'])) {
                if (get_param('email') == '') {
                    $_GET['email'] = $me['emailAddress'];
                    $_GET['verify_email'] = $me['emailAddress'];
                }
            }

            if(!isset($me['firstName'])){
                $me['firstName']='';
            }

            if(!isset($me['lastName'])){
                $me['lastName']='';
            }

            if (isset($me['firstName'])) {
                if (get_param('join_handle') == '') {
                    $_GET['join_handle'] = implode(' ',array($me['firstName'],$me['lastName']));
                }
            }


            set_session(self::$nameSocial.'_id', $me['id']);
            set_session('social_id', $me['id']);
            set_session('social_type', self::$nameSocial);
            // set picture if exists
            if(isset($me['pictureUrls']['values'][0])) {
                set_session('social_photo', $me['pictureUrls']['values'][0]);
            }

        }
    }


    static function getLikeButtonScript()
    {

        return '';

    }

    static function getLikeButtonHtml()
    {
        return '';
    }

    
    public function oAuthApi()
    {
        $nameSocial=self::$nameSocial;
        $params=$this->getParamsAuth();
     
        require(dirname(__FILE__).'/../../_include/current/oauth/http.php');
        require(dirname(__FILE__).'/../../_include/current/oauth/oauth_client.php');
     
        $currentUrl = Social::getCallbackUrl($nameSocial);
        
        $client = new oauth_client_class;
        $client->server = 'LinkedIn';
        $client->debug = false;
        $client->debug_http = true;
        $client->scope = 'r_basicprofile r_emailaddress w_share';

        $client->redirect_uri = $currentUrl;
        $client->offline = true;
        $client->client_id = $params['client_id'];
        $application_line = __LINE__;
        $client->client_secret = $params['client_secret'];

        if(($success = $client->Initialize()))
        { 
            if(($success = $client->Process()))
            {
                $success = $client->CallAPI(
                    'https://api.linkedin.com/v1/people/~:(id,first-name,last-name,headline,picture-urls::(original),email-address,date-of-birth)', 
                    'GET', array(
                        'format'=>'json'
                    ), array('FailOnAccessError'=>true), $user);
            }        
            $success = $client->Finalize($success);
            
            
        }

        if($client->exit){
        exit;
        }    
        
        if($success)
        {
            $userInfo = (array)$user;
            if(isset($userInfo['pictureUrls'])){
                $userInfo['pictureUrls']=(array)($userInfo['pictureUrls']);
            }     
            set_session($nameSocial.'_user_info', $userInfo);
            redirect('join_facebook.php?cmd=ln_login');         /*******************/
        } else {
            $message = HtmlSpecialChars($client->error);
            Social::logError($message);
            redirect('join.php');
        }
        
        

        
    }    
}