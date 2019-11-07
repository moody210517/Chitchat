var CJoin = function(cmd) {

    var $this = this;

    this.cmd = cmd;
    this.isAjax = true;
    this.langParts = {};
    this.ind = 0;

    this.$loaderSpinner;

    /* Log in */
    this.loginInit = function(){
        $this.$frmLogin = $('#form_login');
        $this.$frmLoginInput = $('input', $this.$FrmLogin);
        $this.$frmLoginName = $('#form_login_user');
        $this.$frmLoginSubmit = $('#form_log_in_submit');

        $this.$frmLoginInput.keydown(function(e){
            if (e.keyCode == 13) {
                $this.$frmLogin.submit();
                return false;
            }
        });

        $this.$frmLoginSubmit.click(function(){
            $this.$frmLogin.submit();
            return false;
        });

        $this.$frmLogin.submit(function(){
            if(!$this.isAjax)return false;

            var $terms=$('#terms');
            if($terms[0] && !$terms.prop('checked')){
                showTipTop($terms, $this.langParts['please_agree_to_the_terms'],1,$terms.parent('.bl'),'+67');
                return false;
            }

            $this.$frmLoginName.val($.trim($this.$frmLoginName.val()));
            $this.ind=+new Date;
            $this.$frmLoginSubmit.html(getLoaderCl($this.ind));
            this.ajax.value=1;
            $this.frmSubmit($this.$frmLogin, $this.$frmLoginInput, $this.loginFrmResponse);
            this.ajax.value=0;
            $this.$frmLoginInput.prop('disabled', true);
            return false;
        });

        $this.$frmLoginInput.on('change propertychange input',function(){
            resetTipTopError($(this));
        }).focus(function(){
            resetTipTopError($(this));
        }).blur(function(){
            resetTipTopError($(this));
        })
    }

    this.loginFrmResponse = function(data){
        var data = getDataAjax(data);
        $this.isAjax = true;
        $this.$frmLoginInput.prop('disabled', false);
        if (data){
            if(data.substring(0, 11) == '#js:logged:') {
                tools.redirect(data.substring(11));
                return false;
            }
            if(data.substring(0, 10) == '#js:error:') {
                $this.$frmLoginSubmit.html($this.langParts['log_in']);
                var el=$('#form_login_user').focus();
                $('#form_login_pass').addClass('wrong');
                showTipTop(el, data.substring(10),1,el.parent('.bl'));
                $this.$frmLoginSubmit.html($this.langParts['log_in']);
                return false;
            }
            tools.redirect('index.php');
        } else {
            $this.$frmLoginSubmit.html($this.langParts['log_in']);
        }
    }
    /* Log in */

    /* Forgot password */
    this.forgotInit = function(){
        $this.$frmForgot = $('#form_forgot_password');
        $this.$frmForgotMail = $('#form_forgot_password_mail');
        $this.$frmForgotSubmit = $('#form_forgot_password_submit');

        $this.$frmForgotMail.keydown(function(e){
            if (e.keyCode == 13) {
                $this.$frmForgotSubmit.click();
                return false;
            }
        });

        $this.$frmForgotSubmit.click(function(){
            if ($this.validateEmail($this.$frmForgotMail, $this.langParts.incorrect_email)) {
                $this.$frmForgot.submit();
            }
            return false;
        });

        $this.$frmForgot.submit(function(){
            if(!$this.isAjax)return false;
            $this.ind=+new Date;
            $this.$frmForgotSubmit.html(getLoaderCl($this.ind));
            $this.frmSubmit($this.$frmForgot, $this.$frmForgotMail, $this.forgotFrmResponse);
            $this.$frmForgotMail.prop('disabled', true);
            return false;
        });

        $this.$frmForgotMail.on('change propertychange input',function(){
            resetTipTopError($(this));
        }).focus(function(){
            resetTipTopError($(this));
        }).blur(function(){
            resetTipTopError($(this));
        })
    }

    this.forgotFrmResponse = function(data){
        var data = getDataAjax(data);
        $this.isAjax = true;
        $this.$frmForgotMail.prop('disabled', false);
        if (data){
            var $email= $('#form_forgot_password_mail');
            if(data == 'forgot_send') {
                showAlert($this.langParts.password_sent,'.wrapper','blue');
                setTimeout(function(){
                    tools.redirect(url_main + 'join.php?cmd=please_login');
                },2000)
            } else if(data == 'link_send') {
                showAlert($this.langParts.link_sent,'.wrapper','blue');
                setTimeout(function(){
                    tools.redirect(url_main + 'index.php');
                },2000)
            } else {
                $this.$frmForgotSubmit.html($this.langParts['resend_password']);
                showTipTop($email,data,1,$email.closest('.bl'));
            }
        }else{
            $this.$frmForgotSubmit.html($this.langParts['resend_password']);
            tools.showServerError('.wrapper');
        }
    }
    /* Forgot password */

    this.validateEmail = function($email, msg, box){
        var val = $.trim($email.val());
        if (!checkEmail(val)) {
            showTipTop($email,msg,1,$email.closest('.bl'));
            $this.isAjax = false;
        } else {
            $this.isAjax = true;
            resetTipTopError($email)
        }
        return $this.isAjax;
    }

    this.frmSubmit = function(frm, btnSubmit, fnResponse){
        if ($this.isAjax) {
            $this.isAjax = false;
            frm.ajaxSubmit({success: fnResponse});
            btnSubmit.prop('disabled', true);
        }
        return false;
    }

    $(function(){
        $this.$loaderSpinner = $('.loader');
        if ($this.cmd == 'login') {
            $this.loginInit();
        } else if ($this.cmd == 'forgot_password') {
            $this.forgotInit();
        }

        $('body').on('click', function(e){
            var target = $(e.target);
            if (!target.is('.inp')) {
                $('.custom_tooltip').stop().fadeOut();
            }
        });
    })

    return this;
}