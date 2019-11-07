var /* Update Settings */
    profileSettingsData={},
    $btnProfileSaveSettings,
    $frmProfileSettingsInput,
    $thisBtnSave=[],
    /* Update Settings */
    /* Delete profile */
    $btnProfileDelete,
    $passDelete,
    $cmdProfileDelete,
    isErrorDeleteProfile,
    isSubmitDeleteProfile,
    /* Delete profile */
    /* Update email */
    $btnUpdateMail,
    $updateMailPass,
    $updateMailNewEmail,
    isErrorUpdateMail,
    isSubmitUpdateMail,
    /* Update email */
    /* Update password */
    $btnUpdatePass,
    $newPass,
    $verPass,
    $oldPass,
    isSubmitUpdatePass,
    isErrorUpdatePass;
    /* Update password */

function initProfileSettings(){
    $('.niceRadio','#settings_box').each(function(){
        $(this).prettyCheckable({customClass:'niceRadio'})
    });

    $('.info_link > span', '#settings_box').click(function(){
        $(this).data('clLoader','loader_settings_to_upgrade').addLoader();
        uploadPageUpgrade()
    })
    $(function(){
        /* Update Settings */
        profileSettingsData={};
        $thisBtnSave=[];
        $btnProfileSaveSettings=$('.btn_profile_settings');
        $frmProfileSettingsInput=$('input:radio, select','.profile_settings').on('change',setDisabledSettingsSave);
        setSettingsInfo();

        $btnProfileSaveSettings.click(function(){
            $thisBtnSave=$(this).addLoader();
            disabledProfileSettingsFrm(true);
            var data=getDataProfileSettings();
            data['ajax'] = 1;
            data['cmd'] = 'update';
            $.post(url_main+'profile_settings.php',data,function(res){
                var data=checkDataAjax(res);
                if(data!==false){
                    var msg=false,redirect=false;
                    if(profileSettingsData.set_language_mobile!=$("select[name='set_language']",'.profile_settings').val()){
                        msg=data;
                        redirect=true;
                    }
                    setSettingsInfo();
                    showAllertSettingsSave(msg,redirect);
                } else {
                    $thisBtnSave.removeLoader();
                    disabledProfileSettingsFrm();
                    $btnProfileSaveSettings.prop('disabled',false);
                    serverError();
                }
            })
        })
        /* Update Settings */

        /* Update password */
        isSubmitUpdatePass=false;
        isErrorUpdatePass=false;
        $newPass=$('#new_password');
        $verPass=$('#verify_new_password');
        $oldPass=$('#old_password');

        $btnUpdatePass=$('.btn_profile_password').click(function(){
            if(isSubmitUpdatePass) return false;
            isErrorUpdatePass=true;
            var old_pass=$oldPass,old_val=old_pass.val(),
                new_val=$newPass.val(),ver_val=$verPass.val();
            $btnUpdatePass.prop('disabled',true);
            if(new_val.length!=ver_val.length){
                showErrorSettings($verPass.focus(),l('passwords_not_same'))
            }else if(old_val==new_val) {
                showErrorSettings($newPass.focus(),l('old_and_new_passwords_are_the_same'))
            }else{
                isSubmitUpdatePass=true;
                var data={ajax:1,cmd:'update_password',new_password:new_val,verify_new_password:ver_val,old_password:old_val};
                $btnUpdatePass.addLoader();
                disabledProfileSettingsFrm(true);
                $.post(url_main+'profile_settings.php',data,
                function(res){
                    var data=checkDataAjax(res),isError=false;
                    isSubmitUpdatePass=false;
                    if(data!==false){
                        var $data=$(data),
                            oldPass=$data.filter('.old_password_error'),
                            newPass=$data.filter('.new_password_error'),
                            verPass=$data.filter('.ver_password_error');
                            if(oldPass[0]){
                                showErrorSettings($oldPass.focus(), oldPass.text());
                                isError=true;
                            }
                            if(newPass[0]){
                                if(!isError)$newPass.focus();
                                showErrorSettings($newPass, newPass.text(),!isError)
                                isError=true;
                            }
                            if(verPass[0]){
                                if(!isError)$verPass.focus();
                                showErrorSettings($verPass, verPass.text(),!isError);
                                isError=true;
                            }
                            if (isError) {
                                $btnUpdatePass.removeLoader();
                                disabledProfileSettingsFrm();
                                return false;
                            }
                            if(data==''){
                                showAllertSettingsSave();
                            }else{
                                $btnUpdatePass.removeLoader();
                                disabledProfileSettingsFrm();
                                serverError();
                            }
                    }else{
                        $btnUpdatePass.removeLoader();
                        disabledProfileSettingsFrm();
                        serverError();
                    }
                })
            }
            return false;
        });

        $('input', '.profile_settings_password').on('change propertychange input', function(e){
            var $el=$(this),val=this.value,lng=val.length,isError=false;
            if(~val.indexOf("'")<0){
                showErrorSettings($el.focus(),l('invalid_password_contain'))
            }else if(isErrorUpdatePass&&(lng<minCahrPass||lng>maxCahrPass)) {
                showErrorSettings($el.focus(),lMinMaxLenPass)
            }else if(isErrorUpdatePass){
                if (this.name=='new_password') {
                    if(this.value!=$verPass.val()){
                        showErrorSettings($el.focus(),l('passwords_not_same'))
                        isError=true;
                    }else{
                        resetError($el);
                        resetError($verPass);
                    }
                    if (!isError) {
                        if (this.value==$oldPass.val()) {
                            showErrorSettings($el.focus(),l('old_and_new_passwords_are_the_same'));
                        }else{
                            resetError($el);
                            resetError($oldPass);
                        }
                    }
                }else if(this.name=='old_password') {
                    if (this.value==$newPass.val()) {
                        showErrorSettings($el.focus(),l('old_and_new_passwords_are_the_same'));
                    }else{
                        resetError($el);
                        resetError($newPass);
                    }
                }else if(this.name=='verify_new_password') {
                    if (this.value!=$newPass.val()) {
                        showErrorSettings($el.focus(),l('passwords_not_same'));
                        isError=true;
                    }else{
                        resetError($el);
                        resetError($newPass);
                    }
                    if (!isError) {
                        if (this.value!=$oldPass.val()) {
                            resetError($el);
                            resetError($oldPass);
                        }
                    }
                }
            }else{
                resetError($el)
            }
            setDisabledUpdatePassSave()
        }).focus(function(){
            showErrorWrongEl($(this));
        }).blur(function(){
            hideError($(this));
        })
        /* Update password */

        /* Update email */
        isErrorUpdateMail=false;
        isSubmitUpdateMail=false;
        $btnUpdateMail=$('.btn_profile_email').click(function(){
            if(isSubmitUpdateMail) return false;
            isErrorUpdateMail=true;

            var valMail=$.trim($updateMailNewEmail.val()),isError=false;
            if(!checkEmail(valMail)){
                showErrorSettings($updateMailNewEmail.focus(),l('incorrect_email'));
                isError=true;
            }
            var valPass=$updateMailPass.val(),lng=valPass.length;
            if(lng<minCahrPass||lng>maxCahrPass) {
                if(!isError)$updateMailPass.focus()
                showErrorSettings($updateMailPass,lMinMaxLenPass,!isError);
                isError=true;
            }
            if(isError){
                $btnUpdateMail.prop('disabled',true);
                return false;
            }
            isSubmitUpdateMail=true;
            var data={ajax:1,cmd:'update_email',new_email:valMail,password:valPass};
            $btnUpdateMail.addLoader();
            disabledProfileSettingsFrm(true);
            $.post(url_main+'profile_settings.php',data,
                function(res){
                    isSubmitUpdateMail=false;
                    var data=checkDataAjax(res),isError=false;
                    if(data!==false){
                        var $data=$(data),
                            passError=$data.filter('.password_error'),
                            newEmailError=$data.filter('.new_email_error');
                        if(newEmailError[0]){
                            showErrorSettings($updateMailNewEmail.focus(),newEmailError.text());
                            isError=true;
                        }
                        if(passError[0]){
                            if(!isError)$updateMailPass.focus()
                            showErrorSettings($updateMailPass,passError.text(),!isError);
                            isError=true;
                        }
                        if (isError) {
                            disabledProfileSettingsFrm();
                            $btnUpdateMail.removeLoader();
                            return false;
                        }
                        if(data=='update'){
                            showAllertSettingsSave();
                        }else{
                            disabledProfileSettingsFrm();
                            $btnUpdateMail.removeLoader();
                            serverError();
                        }
                    }else{
                        disabledProfileSettingsFrm();
                        $btnUpdateMail.removeLoader();
                        serverError();
                    }
            })
            return false;
        })

        $updateMailNewEmail=$('#new_email').on('change propertychange input', function(e){
            var val=this.value;
            if(checkEmail(val)){
                resetError($updateMailNewEmail);
            }else if(isErrorUpdateMail){
                showErrorSettings($updateMailNewEmail,l('incorrect_email'))
            }
            setDisabledUpdateMailSave();
        }).focus(function(){
            showErrorWrongEl($updateMailNewEmail);
        }).blur(function(){
            hideError($updateMailNewEmail);
        })

        $updateMailPass=$('#password_email').on('change propertychange input', function(e){
            var val=this.value,lng=val.length;
            if(~val.indexOf("'")<0){
                showErrorSettings($updateMailPass,l('invalid_password_contain'))
            } else if(isErrorUpdateMail&&(lng<minCahrPass||lng>maxCahrPass)) {
                showErrorSettings($updateMailPass,lMinMaxLenPass)
            } else {
                resetError($updateMailPass);
            }
            setDisabledUpdateMailSave();
        }).focus(function(){
            showErrorWrongEl($updateMailPass);
        }).blur(function(){
            hideError($updateMailPass);
        })
        /* Update email */

        /* Delete profile */
        isErrorDeleteProfile=false;
        isSubmitDeleteProfile=false;
        $cmdProfileDelete=$('#cmd_profile_delete');
        $passDelete=$('#password_delete').on('change propertychange input', function(e){
            var val=this.value,lng=val.length;
            if(~val.indexOf("'")<0){
                showErrorSettings($passDelete,l('invalid_password_contain'))
            }else if(isErrorDeleteProfile&&(lng<minCahrPass||lng>maxCahrPass)) {
                showErrorSettings($passDelete,lMinMaxLenPass)
            } else {
                resetError($passDelete);
            }
            setDisabledProfileDelete();
        }).focus(function(){
            showErrorWrongEl($passDelete);
        }).blur(function(){
            hideError($passDelete);
        }).keydown(function(e){
            if(e.keyCode==13) {
                $btnProfileDelete.click();
                $btnProfileDelete.prop('disabled',true);
                return false;
            }
        })
        $btnProfileDelete=$('.btn_profile_delete').click(function(){
            if(isSubmitDeleteProfile)return;
            var cmd=$cmdProfileDelete.val(),data={ajax:1};
            isErrorDeleteProfile=true;
            if(cmd=='check_password'){
                var val=$passDelete.val(),lng=val.length;
                if(lng<minCahrPass||lng>maxCahrPass) {
                    showErrorSettings($passDelete.focus(),lMinMaxLenPass);
                    setDisabledProfileDelete();
                    return false;
                }
            }
            data.password=$passDelete.val();
            data.cmd=cmd;
            isSubmitDeleteProfile=true;
            $btnProfileDelete.addLoader();
            disabledProfileSettingsFrm(true);
            $.post(url_main+'profile_settings.php',data,
                function(res){
                    var data=checkDataAjax(res);
                    if(data!==false){
                        var $data=$(data);
                        if($data.is('error')){
                            $btnProfileDelete.removeLoader();
                            disabledProfileSettingsFrm();
                            showErrorSettings($passDelete.focus(),$data.text());
                        }else if(data=='check'){
                            $passDelete.prop('disabled',true);
                            showConfirm(l('the_profile_will_be_deleted_forever'), function(){
                                $cmdProfileDelete.val('profile_delete');
                                $btnProfileDelete.click();
                            })
                        }else if(data=='delete'){
                            goToLogOut()
                        }else if(data=='demo') {;
                        }
                    }else{
                        $btnProfileDelete.removeLoader();
                        disabledProfileSettingsFrm();
                        $btnProfileDelete.prop('disabled',false);
                        serverError();
                    }
                    isSubmitDeleteProfile=false;
            })
            return false;
        })
        /* Delete profile */
    })
}

function showAllertSettingsSave(msg, redirect){
    msg=msg||l('changes_saved');
    redirect=redirect||false;
    showConfirm(msg, function(){
        if (redirect) {//change language
            redirectUrl(urlPagesSite.profile_view);
        } else {
            getPage(false,urlPagesSite.profile_view,false)
        }
    }, false, false, false, true, false, true, 'fa-thumbs-up')
}

function showErrorSettings(el,msg,vis){
    showError(el,msg,vis,'#settings_box')
}

function disabledProfileSettingsFrm(is){
    is=is||false;
    $('.save_settings','#settings_box').prop('disabled',true);
    $('input, select','#settings_box').prop('disabled',is);
}

/* Update Settings */
function setSettingsInfo(){
    $('input:radio:checked, select','.profile_settings').each(function(){
        profileSettingsData[this.name]=this.value;
    })
}

function isModifiedSettingsInfo(){
    var is=0;
    $('input:radio:checked, select','.profile_settings').each(function(){
        is|=(this.value!=profileSettingsData[this.name])
    })
    return is;
}

function setDisabledSettingsSave() {
    $btnProfileSaveSettings.prop('disabled',!isModifiedSettingsInfo());
}

function getDataProfileSettings(){
    var data={};
    $('input:radio:checked, select','.profile_settings').each(function(){
           data[this.name]=this.value;
    })
    return data;
}
/* Update Settings */
/* Delete profile */
function setDisabledProfileDelete(){
    var is=$passDelete.val()==''||$passDelete.is('.wrong');
    $btnProfileDelete.prop('disabled',is);
}
/* Delete profile */
/* Update email */
function setDisabledUpdateMailSave(){
    var is=0;
    $('input', '.profile_settings_email').each(function(){
        var val=this.value;
        if(this.name=='new_email')val=$.trim(val);
        is|=(val==''||$(this).is('.wrong'));
    })
    $btnUpdateMail.prop('disabled',is);
}
/* Update email */
/* Update password */
function setDisabledUpdatePassSave(){
    var is=0;
    $('input', '.profile_settings_password').each(function(){
        is|=(this.value==''||$(this).is('.wrong'));
    })
    $btnUpdatePass.prop('disabled',is);
}
/* Update password */