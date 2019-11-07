var CContact = function() {

    var $this=this;

    this.langParts={};

    this.isAction=false;

    this.isChanges = function(){
        var is=true;
        $('.contact_info').each(function(){
            if ($.trim(this.value)){is=is&&true
            }else{is=is&&false}
        })
        if (isRecaptcha) {
            is=is&&(grecaptcha.getResponse(recaptchaWd)!='')
        }
        return is;
    }

    this.sendMsg = function(disabled){
        disabled=disabled||false;
        if($this.isAction)return;
        var val=$.trim($jq('#contact_msg').val());
        $this.isAction=true;
        if(disabled){
            $jq('.contact_info').prop('disabled', true);
            $jq('#contact_send').prop('disabled', true).html(getLoader());
        }

        var data={comment:val};
        if(!ajax_login_status){
            data={comment:val,
                  email:$.trim($jq('#contact_email').val()),
                  username:$.trim($jq('#contact_username').val())
            }
        }
        $.post(url_main+'contact.php?cmd=send&ajax=1',data,function(res){
            $this.isAction=false;
            $jq('.contact_info').val('');
            if(!ajax_login_status){
                if(isRecaptcha){
                    grecaptcha.reset(recaptchaWd);
                }else{
                    $('.contact_captcha_reload').click();
                }
            }
            $jq('#contact_send').html($this.langParts.send);
            $jq('.contact_info').prop('disabled', false);
            var data=getDataAjax(res, 'data');
            if(data!==false){
                alertSuccess($this.langParts.message_sent,false)
            }else{
                alertServerError();
            }
        })
    }

    this.send = function(){
        if($this.isAction)return;
        if (!ajax_login_status) {
            if(!checkEmail($jq('#contact_email').val())){
                $this.showError('contact_email',$this.langParts.incorrect_email);
                $jq('#contact_email').focus();
                return false;
            }
            if(!isRecaptcha){
                captcha=$.trim($jq('#captcha_input').val());
            }
            $this.isAction=true;
            $jq('.contact_info').prop('disabled', true);
            $jq('#contact_send').prop('disabled', true).html(getLoader());
            $.post(url_main+'contact.php?cmd=check_captcha',{captcha:captcha},function(res){
                $this.isAction=false;
                var data=getDataAjax(res, 'data');
                if(data===false){
                    $jq('.contact_info').prop('disabled', false);
                    if(isRecaptcha){
                        grecaptcha.reset(recaptchaWd);
                    }else{
                        $jq('#captcha_input').val('');
                        $('.contact_captcha_reload').click();
                    }
                    $jq('#contact_send').html($this.langParts.send);
                    $this.showError('contact_captcha');
                }else{
                    $this.sendMsg();
                }
            })
            return false;
        }
        $this.sendMsg(true);
    }

    this.showError = function(name,msg){
        if(msg){
            $jq('#'+name+'_error').html(msg);
        }
        $jq('#'+name+'_error').removeClass('to_hide');
        $jq('#contact_send').prop('disabled',true);
    }

    this.hideError = function(name){
        $jq('#'+name+'_error').addClass('to_hide');
    }

    this.setDisabledSubmit = function(){
        if (!$this.isChanges()) {
            $jq('#contact_send').prop('disabled',true);
        }else{
            $jq('#contact_send').prop('disabled',false);
        }
    }

    $(function(){
        $('.contact_info').on('change propertychange input', function(){
            if(this.name=='email'){
                $this.hideError('contact_email');
            }else if (this.name=='captcha') {
                $this.hideError('contact_captcha');
            }
            $this.setDisabledSubmit();
        })
    })

    return this;
}