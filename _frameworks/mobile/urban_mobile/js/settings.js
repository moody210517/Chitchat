$(function(){
    var dur=300,
        $settingsBox=$('#settings_box'),
        $menuBox=$('#settings_menu'),
        $headerSettings=$('#header_settings'),
        $btnSubmit=$('#perform_action_profile_settings'),
        $st_email=$('#st_email'),
        responseData=null,
        isErrorUpdateMail=false,
        isErrorProfileDelete=false,
        isErrorUpdatePass=false,
        isSendAjax=1,
        settings={};

    $('.niceRadio',$settingsBox).each(
        function(){$(this).prettyCheckable({customClass:'niceRadio'})
    });
    $('#st_notification, #st_invisible').delay(100).fadeTo(100,1);

    $('.btn_play_header').click(function(){
        /*if(!isSendAjax)return false;*/
        if(!$menuBox.is(':visible')){
            /*hideCustomTip(1);
            $btnSubmit.html(langParts['save']);
            $('.frm:visible',$settingsBox).fadeOut(dur,function(){
                $menuBox.fadeIn(dur);
                $headerSettings.text(langParts['header_settings'])
            })
            $btnSubmit.fadeTo(dur,0);*/
            tools.redirect(url_main+'profile_settings.php')
            return false;
        };
    })

    $('.choose_settings', $settingsBox).click(function(){
        $(this).append(getLoaderCl('loader_settings', 'loader_to_settings'));
        tools.redirect(this.href);
        return false;
    })

    /* Update password */
    $('#st_old_password, #st_new_password, #st_verify_new_password').on('change propertychange input', function(e){
        resetTipTopError($(this));
    }).focus(function(){
        showTipTopErrorCondition($(this));
    }).blur(function(){
        resetTipTopError($(this));
    })

    function getDataUpdatePassword(){
        hideCustomTip(1);
        responseData=true;
        var $oldPass=$('#st_old_password'),oldVal=$oldPass.val(),lOld=oldVal.length,
            $newPass=$('#st_new_password'),newVal=$newPass.val(),lNew=newVal.length,
            $verPass=$('#st_verify_new_password'),verVal=$verPass.val(),lVer=verVal.length;

        if(lOld<minCahrPass||lOld>maxCahrPass){
            $oldPass.focus();
            showTipTop($oldPass,langParts['max_min_length_password'],1,$oldPass.closest('.bl'));
            responseData=false;
        }else if (~oldVal.indexOf("'")<0) {
            $oldPass.focus();
            showTipTop($oldPass,langParts['invalid_password_contain'],1,$oldPass.closest('.bl'));
            responseData=false;
        }

        if(lNew<minCahrPass||lNew>maxCahrPass){
            if(responseData){$newPass.focus()}
            showTipTop($newPass,langParts['max_min_length_password'],responseData,$newPass.closest('.bl'));
            responseData=false;
        }else if (~newVal.indexOf("'")<0) {
            if(responseData){$newPass.focus()}
            showTipTop($newPass,langParts['invalid_password_contain'],responseData,$newPass.closest('.bl'));
            responseData=false;
        }

        if(lVer<minCahrPass||lVer>maxCahrPass){
            if(responseData){$verPass.focus()}
            showTipTop($verPass,langParts['max_min_length_password'],responseData,$verPass.closest('.bl'));
            responseData=false;
        }else if (~verVal.indexOf("'")<0) {
            if(responseData){$verPass.focus()}
            showTipTop($verPass,langParts['invalid_password_contain'],responseData,$verPass.closest('.bl'));
            responseData=false;
        }

        if (responseData) {
            if(newVal.length!=verVal.length||newVal!=verVal){
                responseData=false;
                $verPass.focus();
                showTipTop($verPass,langParts['passwords_not_same'],1,$verPass.closest('.bl'));
            }else if(oldVal==newVal) {
                $newPass.focus();
                showTipTop($newPass,langParts['old_and_new_passwords_are_same'],1,$newPass.closest('.bl'));
                responseData=false;
            }
        }
        if(responseData){
            responseData={old_password:oldVal,new_password:newVal,verify_new_password:verVal};
        }
        return responseData;
    }

    function passUpdate(data){
        hideCustomTip(1);
        isSendAjax=0;
        var input=$('#st_old_password,#st_new_password,#st_verify_new_password').prop('disabled',true);
        $.post(url_main+'profile_settings.php',data,function(res){

            var data=checkDataAjax(res);
            if(data!==false){
                var $data=$($.trim(data)),
                    oldPass=$data.filter('.old_password_error'),
                    newPass=$data.filter('.new_password_error'),
                    verPass=$data.filter('.ver_password_error'),
                    $oldPass=$('#st_old_password'),
                    $newPass=$('#st_new_password'),
                    $verPass=$('#st_verify_new_password');
                if(oldPass[0]){
                    $oldPass.focus();
                    showTipTop($oldPass,oldPass.text(),1,$oldPass.closest('.bl'));
                }
                if(newPass[0]){
                    if(!oldPass[0])$newPass.focus();
                    showTipTop($newPass,newPass.text(),!oldPass[0],$newPass.closest('.bl'));
                }
                if(verPass[0]){
                    if(!newPass[0]&&!oldPass[0])$verPass.focus();
                    showTipTop($verPass,verPass.text(),!newPass[0]&&!oldPass[0],$verPass.closest('.bl'));
                }
                if(data==''){
                    tools.redirect(url_page);
                    //input.val('');
                    //savedAlert();
                }else{
                    input.prop('disabled',false);
                    $btnSubmit.html(langParts['save']);
                }
            }else{
                input.prop('disabled',false);
                $btnSubmit.html(langParts['save']);
                tools.showServerError();
            }

            isSendAjax=1;
        });
    }
    /* Update password */

    /* Email */
    var $mailEmail=$('#st_email_new_email').on('change propertychange input', function(e){
        resetTipTopError($(this));
    }).focus(function(){
        showTipTopErrorCondition($(this));
    }).blur(function(){
        resetTipTopError($(this));
    })

    var $mailPass=$('#st_email_pass').on('change propertychange input', function(e){
        resetTipTopError($(this));
    }).focus(function(){
        showTipTopErrorCondition($(this));
    }).blur(function(){
        resetTipTopError($(this));
    })

    function getDataUpdateEmail(){
        hideCustomTip(1);
        responseData=true;
        var mailV=$.trim($mailEmail.val());
        if(!checkEmail(mailV)){
            $mailEmail.focus();
            showTipTop($mailEmail,langParts['incorrect_email'],1,$mailEmail.closest('.bl'));
            responseData=false;
        };
        var passV=$mailPass.val(),
            l=passV.length;
        if(l<minCahrPass||l>maxCahrPass){
            if(responseData){$mailPass.focus()}
            showTipTop($mailPass,langParts['max_min_length_password'],0,$mailPass.closest('.bl'));
            responseData=false;
        }else if (~passV.indexOf("'")<0) {
            if(responseData){$mailPass.focus()}
            showTipTop($mailPass,langParts['invalid_password_contain'],0,$mailPass.closest('.bl'));
            responseData=false;
        }
        if(responseData){
            responseData={new_email:mailV,password:passV};
        }
        return responseData;
    }

    function emailUpdate(data){
        hideCustomTip(1);
        isSendAjax=0;
        $('input',$st_email).prop('disabled',true);
        $.post(url_main+'profile_settings.php',data,function(res){
            var data=checkDataAjax(res);
            if(data!==false){
                var $data=$($.trim(data)),
                    passError=$data.filter('.password_error'),
                    newEmailError=$data.filter('.new_email_error');
                if(newEmailError[0]){
                    $mailEmail.focus();
                    showTipTop($mailEmail,newEmailError.text(),1,$mailEmail.closest('.bl'));
                }
                if(passError[0]){
                    if(!newEmailError[0])$mailPass.focus();
                    showTipTop($mailPass,passError.text(),!newEmailError[0],$mailPass.closest('.bl'));
                }
                if(data=='update'){
                    tools.redirect(url_page);
                    //savedAlert();
                    //$('input', $st_email).val('').removeClass('wrong');
                }else{
                    $btnSubmit.html(langParts['save']);
                    $('input',$st_email).prop('disabled',false);
                }
            }else{
                $btnSubmit.html(langParts['save']);
                $('input',$st_email).prop('disabled',false);
                tools.showServerError();
            }
            isSendAjax=1;
        });
    }
    /* Email */

    /* Profile delete */
    var $deletePass=$('#st_delete_pass').on('change propertychange input', function(e){
        resetTipTopError($(this));
    }).focus(function(){
        showTipTopErrorCondition($(this));
    }).blur(function(){
        resetTipTopError($(this));
    })

    function checkPassword(data){
        hideCustomTip(1);
        isSendAjax=0;
        $deletePass.prop('disabled',true);
        if(data['cmd']=='profile_delete')$btnSubmit.html(getLoaderCl(+new Date));
        $.post(url_main+'profile_settings.php',data,function(res){
            $deletePass.prop('disabled',false);
            var data=checkDataAjax(res);
            if(data!==false){
                var $data=$($.trim(data));
                if($data.is('error')){
                    //$deletePass.focus();
                    showTipTop($deletePass,$data.text(),1,$deletePass.closest('.bl'));
                }else if(data=='check'){
                    showConfirm(langParts['profile_deleted_forever'], langParts['delete'], langParts['cancel'], profielDelete);
                }else if(data=='delete'){
                    tools.redirect(url_main+'index.php');
                }else if (data=='demo') {
                    $deletePass.val('');
                }
            }else{tools.showServerError()}
            $btnSubmit.html(langParts['save']);
            isSendAjax=1;
        });
    }

    function profielDelete(){
        var data={};
        data['cmd']='profile_delete';
        data['password']=$deletePass.val();
        data['ajax']=1;
        checkPassword(data);
    }
    /* Profile delete */

    /* Update Settings */
    /*function setSettingsInfo(){
        $('input:radio:checked, select',$settingsBox).each(function(){
            settings[this.name]=this.value;
        })
    }

    setSettingsInfo();

    function isModifiedSettingsInfo(){
        var is=0;
        $('input:radio:checked, select',$settingsBox).each(function(){
            is|=(this.value!=settings[this.name])
        })
        return is;
    }*/

    function getDataSettings(){
        var data={};
        $('input:radio:checked, select',$settingsBox).each(function(){
            data[this.name]=this.value;
        })
        return data;
    }

    function updateSettings(data){
        $('input:radio, select',$settingsBox).prop('disabled',true);
        isSendAjax=0;
        $.post(url_main+'profile_settings.php',data,function(res){
            var data=checkDataAjax(res);
            if(data!==false){
                tools.redirect(url_page);
                /*if(settings.set_language!=$("select[name='set_language']",$settingsBox).val()){
                    tools.redirect(url_page);
                } else {
                    savedAlert();
                    setSettingsInfo();
                }*/
            }else{
                tools.showServerError();
                $('input:radio, select',$settingsBox).prop('disabled',false);
                $btnSubmit.html(langParts['save']);
                isSendAjax=1;
            }
        });
    }
    /* Update Settings */

    $btnSubmit.click(function(){
        if(!isSendAjax)return;
        var frm=$('.frm:visible',$settingsBox);
        if(!frm[0]){return false}
        var cmd=frm.data('cmd'),data;
        if (cmd=='update') {
            //if(!isModifiedSettingsInfo())return false;
            data=getDataSettings();
        }else if(cmd=='update_email'){
            isErrorUpdateMail=true;
            data=getDataUpdateEmail();
        }else if(cmd=='update_password'){
            isErrorUpdatePass=true;
            data=getDataUpdatePassword();
        }else if(cmd=='check_password'){
            isErrorProfileDelete=true;
            data={password:$deletePass.val()};
        }

        if(typeof data == 'object' && !$.isEmptyObject(data)){
            data['cmd']=cmd;
            data['ajax']=1;
            $btnSubmit.html(getLoaderCl(+new Date));
            //return false;
            if (cmd=='update') {
                updateSettings(data);
            }else if(cmd=='update_email'){
                emailUpdate(data);
            }else if(cmd=='update_password'){
                passUpdate(data);
            }else if(cmd=='check_password'){
                checkPassword(data);
            }
        }
        return false;
    })

    function savedAlert(){
        showAlert(langParts['changes_saved'],'#st-container','blue');
    }
})