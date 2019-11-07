var profileSettingsData={};
$(function () {
    var $boxProfileSettings=$('#box_profile_settings'),
        $frmProfileSettings=$('#frm_profile_settings',$boxProfileSettings),
        isSaveEditSettings=false;

    $('.styler_settings',$boxProfileSettings).styler({
        singleSelectzIndex: '2',
		selectAutoWidth : false,
        selectAppearsNativeToIOS: false,
        selectAnimation: true
    });

    function alertChangesSettingsSaved(reload,$btnSave){
        var fn = function(){
            $btnSave=$btnSave||[];
            if (reload||0) {
                redirectUrl(url_main+urlPageProfile)
            }else{
                resetProfileSettingsFrm();
                alertSuccess(siteLangPartsSettings.changesSaved, false, ALERT_HTML_SUCCESS, false, {left:'0px', top:'0px', margin:'25px 22px 25px 0px'});
                setTimeout(closeAlert,2000);
            }
            $btnSave[0]&&$btnSave.html(siteLangPartsSettings.save);
        }
        Profile.closePopupEditorDelay('pp_profile_settings_editor', function(){fn($btnSave)})
    }

    function resetProfileSettingsFrm(){
        $('input[type="text"],input[type="password"]',$boxProfileSettings).val('');
        var errors={
            '#password_email':$btnUpdateMail,
            '#new_email':$btnUpdateMail,
            '#old_password':$btnUpdatePass,
            '#new_password':$btnUpdatePass,
            '#verify_new_password':$btnUpdatePass,
            '#password_delete':$btnProfileDelete
        }
        for(var key in errors) {
            hideErrorFrm(key, errors[key])
        }
        $jq('.save_settings',$boxProfileSettings).prop('disabled',true);
        isErrorUpdateMail=false;
        isErrorUpdatePass=false;
        isErrorDeleteProfile=false;
        isSubmitDeleteProfile=false;
        $cmdProfileDelete.val('check_password');
        if(!isUpdateProfileSettings){
            $('input:radio, select',$frmProfileSettings).each(function(){
                if(this.type=='select-one'){
                    $(this).val(profileSettingsData[this.name]).trigger('refresh')
                }else if(this.type=='radio') {
                    $('#radio_'+this.name+'_'+profileSettingsData[this.name]).click();
                }
            })
        }
        isUpdateProfileSettings=false;
    }

    function disabledProfileSettingsFrm(is){
        is=is||false;
        $jq('.save_settings',$boxProfileSettings).prop('disabled',true);
        $jq('input:radio, select',$boxProfileSettings).prop('disabled',is).trigger('refresh');
        $jq('input',$boxProfileSettings).prop('disabled',is);
    }

    window.disabledProfileSettingsFrm = disabledProfileSettingsFrm;

    /* Update settings */
    var $btnProfileSaveSettings=$('.save_profile_settings ',$frmProfileSettings),
        isUpdateProfileSettings=false;
    function setSettingsInfo(){
        $('input:radio:checked, select',$frmProfileSettings).each(function(){
            profileSettingsData[this.name]=this.value;
        })
    }
    setSettingsInfo();
    function isModifiedSettingsInfo(){
        var is=0;
        $('input:radio:checked, select',$frmProfileSettings).each(function(){
            is|=(this.value!=profileSettingsData[this.name])
        })
        return is;
    }

    function checkModifiedSettingsInfo() {
        if(isSaveEditSettings){
            return false
        }else{
            return $jq('.save_settings',$boxProfileSettings).not(':disabled')[0]
        }
    }

    $('input:radio, select',$frmProfileSettings).on('change',setDisabledSettingsSave);

    function setDisabledSettingsSave() {
        $btnProfileSaveSettings.prop('disabled',!isModifiedSettingsInfo());
    }

    var $thisBtnSave=[];
    $btnProfileSaveSettings.click(function(){
        $thisBtnSave=$(this);
    })

    $frmProfileSettings.submit(function(){
        //Profile.hideMyPresence = this.set_hide_my_presence.value*1;//&&&&&&&&&
        isUpdateProfileSettings=false;
        if (!isModifiedSettingsInfo()||this.ajax.value==1) return false;
        isSaveEditSettings=true;
        this.ajax.value=1;
        $thisBtnSave.html(getLoader());
        $(this).ajaxSubmit({success:profile_settings_response});
        disabledProfileSettingsFrm(true);
        return false;
    })

    function profile_settings_response(res){
        if(checkDataAjax(res)!==false){
            if(profileSettingsData.set_language!=$("select[name='set_language']",$frmProfileSettings).val()){
                alertChangesSettingsSaved(true);
            } else {
                isUpdateProfileSettings=true;
                setSettingsInfo();
                alertChangesSettingsSaved(false,$thisBtnSave);
            }
        } else {
            $thisBtnSave.html(siteLangPartsSettings.save);
            disabledProfileSettingsFrm();
        }
        $('input.ajax',$frmProfileSettings).val(0);
        isSaveEditSettings=false;
    }
    /* Update settings */
    /* Update email */
    var $btnUpdateMail=$('#btn_update_mail', '#fields_6'),
        $ajaxEmail=$('#ajax_email', '#fields_6'),
        $updateMailInput=$('input.inp, input.ajax', '#fields_6'),
        isErrorUpdateMail=false;

    $('#password_email').on('change propertychange input', function(e){
        var val=this.value,l=val.length;
        if(~val.indexOf("'")<0){
            showErrorFrm('#password_email', siteLangPartsSettings.invalidPassContain, $btnUpdateMail);
        } else if(isErrorUpdateMail&&(l<stPassLenMin||l>stPassLenMax)) {
            showErrorFrm('#password_email', siteLangPartsSettings.minMaxLenPass, $btnUpdateMail);
        } else {
            hideErrorFrm('#password_email', $btnUpdateMail);
        }
        setDisabledUpdateMailSave();
    })

    $('#new_email').on('change propertychange input', function(e){
        var val=this.value;
        if(checkEmail(val)){
            hideErrorFrm('#new_email', $btnUpdateMail);
        }else if(isErrorUpdateMail){
            showErrorFrm('#new_email', siteLangPartsSettings.incorrectEmail, $btnUpdateMail);
        }
        setDisabledUpdateMailSave();
    })

    var dataAjaxEmail={};
    $btnUpdateMail.click(function(){
        //$btnUpdateMail.prop('disabled',true);
        if ($ajaxEmail.val()==1) return false;
        isErrorUpdateMail=false;
        //$('#password_email').change();
        //isErrorUpdateMail=false;
        var l=$('#password_email').val().length;
        if(l<stPassLenMin||l>stPassLenMax) {
            showErrorFrm('#password_email', siteLangPartsSettings.minMaxLenPass, $btnUpdateMail);
            isErrorUpdateMail=true;
        }
        if(!checkEmail($.trim($('#new_email').val()))){
            showErrorFrm('#new_email', siteLangPartsSettings.incorrectEmail, $btnUpdateMail);
            isErrorUpdateMail=true;
        }
        if(isErrorUpdateMail) return false;
        $ajaxEmail.val(1);
        $updateMailInput.each(function(){
            dataAjaxEmail[$(this).attr('name')]=$(this).val();
        })
        $btnUpdateMail.html(getLoader());
        disabledProfileSettingsFrm(true);
        isSaveEditSettings=true;
        $.post(url_main+'profile_settings.php',dataAjaxEmail,
            function(res){
                var data=checkDataAjax(res),isError=false;
                if(data!==false){
                    var $data=$(data),
                        passError=$data.filter('.password_error'),
                        newEmailError=$data.filter('.email_new_error');
                    if(passError[0]){
                        showErrorFrm('#password_email', passError.text(), $btnUpdateMail);
                    }
                    if(newEmailError[0]){
                        showErrorFrm('#new_email', newEmailError.text(), $btnUpdateMail);
                    }
                    if(data==''){
                        $('input.inp','#fields_6').val('');
                        alertChangesSettingsSaved(false,$btnUpdateMail);
                    } else {
                        isError=true;
                        isErrorUpdateMail=true;
                    }
                }else{
                    isError=true;
                }
                if (isError) {
                    $btnUpdateMail.html(siteLangPartsSettings.save);
                    disabledProfileSettingsFrm();
                }
                $ajaxEmail.val(0);
                isSaveEditSettings=false;
        })
        return false;
    })

    function setDisabledUpdateMailSave(){
        var is=0;
        $('input.inp', '#fields_6').each(function(){
            var val=this.value;
            if($(this).is('.mail'))val=$.trim(val);
            is|=(val==''||$(this).is('.wrong'));
        })
        $btnUpdateMail.prop('disabled',is);
    }
    /* Update email */
    /* Update password */
    var $btnUpdatePass=$('#save_password', '#fields_5'),
        update_pass_input=$('input.password, input.ajax', '#fields_5'),
        $passInput=$('input.password', '#fields_5'),
        $newPass=$('#new_password', '#fields_5'),
        $verPass=$('#verify_new_password', '#fields_5'),
        $ajaxPass=$('#ajax_pass', '#fields_5'),
        isErrorUpdatePass=false,
        dataAjaxPass={};

    $passInput.on('change propertychange input', function(e){
        var val=this.value,l=val.length;
        var id='#'+this.name;
        if(~val.indexOf("'")<0){
            showErrorFrm(id, siteLangPartsSettings.invalidPassContain, $btnUpdatePass)
        } else if(isErrorUpdatePass&&(l<stPassLenMin||l>stPassLenMax)) {
            showErrorFrm(id, siteLangPartsSettings.minMaxLenPass, $btnUpdatePass)
        }else if(isErrorUpdatePass&&this.name=='verify_new_password'&&this.value!=$newPass.val()){
            showErrorFrm('#verify_new_password', siteLangPartsSettings.passwordsNotSame, $btnUpdatePass)
        }else if(isErrorUpdatePass&&this.name=='new_password'){
            if (this.value==$('#old_password').val()) {
                showErrorFrm('#new_password', siteLangPartsSettings.oldPasswordsNotSame, $btnUpdatePass)
            }else{
                hideErrorFrm(id, $btnUpdatePass)
            }
            if (this.value==$verPass.val()) {
                hideErrorFrm('#verify_new_password', $btnUpdatePass)
            }else{
                showErrorFrm('#verify_new_password', siteLangPartsSettings.passwordsNotSame, $btnUpdatePass)
            }
            $(this).focus();
        }else{
            hideErrorFrm(id, $btnUpdatePass)
        }
        setDisabledUpdatePassSave()
    })

    function setDisabledUpdatePassSave(){
        var is=0;
        $passInput.each(function(){
            is|=(this.value==''||$(this).is('.wrong'));
        })
        $btnUpdatePass.prop('disabled',is);
    }

    $btnUpdatePass.click(function(){
        isErrorUpdatePass=false;
        var old_pass=$('#old_password'),old_val=old_pass.val(),
            new_val=$newPass.val(),ver_val=$verPass.val();
        if(new_val.length!=ver_val.length){
            isErrorUpdatePass=true;
            showErrorFrm('#verify_new_password', siteLangPartsSettings.passwordsNotSame, $btnUpdatePass)
        }else if(old_val==new_val) {
            isErrorUpdatePass=true;
            showErrorFrm('#new_password', siteLangPartsSettings.oldPasswordsNotSame, $btnUpdatePass)
        }else{
            if($ajaxPass.val()==1)return false;
            $ajaxPass.val(1);
            update_pass_input.each(function(){
                dataAjaxPass[$(this).attr('name')]=$(this).val();
            })
            $btnUpdatePass.html(getLoader());
            disabledProfileSettingsFrm(true);
            isSaveEditSettings=true;
            $.post(url_main+'profile_settings.php',dataAjaxPass,
                function(res){
                    var data=checkDataAjax(res),isError=false;
                    if(data!==false){
                        var $data=$(data),
                            oldPass=$data.filter('.old_password_error'),
                            newPass=$data.filter('.new_password_error'),
                            verPass=$data.filter('.ver_password_error');
                            if(verPass[0])
                                showErrorFrm('#verify_new_password', verPass.text(), $btnUpdatePass);
                            if(newPass[0])
                                showErrorFrm('#new_password', newPass.text(), $btnUpdatePass)
                            if(oldPass[0])
                                showErrorFrm('#old_password', oldPass.text(), $btnUpdatePass);
                            if(data==''){
                                $passInput.val('');
                                alertChangesSettingsSaved(false,$btnUpdatePass);
                            }else{
                                isErrorUpdatePass=true;
                                isError=true;
                            }
                    }else{
                        isError=true
                    }
                    if(isError){
                        $btnUpdatePass.html(siteLangPartsSettings.save);
                        disabledProfileSettingsFrm();
                    }
                    $ajaxPass.val(0);
                    isSaveEditSettings=false;
            })
        }
        return false;
    })
    /* Update password */
    /* Profile delete */
    var $frmProfileDelete=$('#fields_7'),
        $btnProfileDelete=$('#btn_profile_delete',$frmProfileDelete),
        $cmdProfileDelete=$('#cmd_profile_delete',$frmProfileDelete),
        isErrorDeleteProfile=false,
        isSubmitDeleteProfile=false,
        dataAjaxDeleteProfile={};

    var $passwordDelete=$('#password_delete',$frmProfileDelete)
        .on('change propertychange input', function(e){
        var val=this.value,l=val.length;
        if(~val.indexOf("'")<0){
            showErrorFrm('#password_delete', siteLangPartsSettings.invalidPassContain, $btnProfileDelete)
        }else if(isErrorDeleteProfile&&(l<stPassLenMin||l>stPassLenMax)) {
            showErrorFrm('#password_delete', siteLangPartsSettings.minMaxLenPass, $btnProfileDelete)
        } else {
            hideErrorFrm('#password_delete', $btnProfileDelete)
        }
        setDisabledProfileDeleteSave();
    }).keydown(function(e){
        if(e.keyCode==13) {
            $btnProfileDelete.click();
            $btnProfileDelete.prop('disabled',true);
            return false;
        }
    })

    function setDisabledProfileDeleteSave(){
        var is=$passwordDelete.val()==''||$passwordDelete.is('.wrong');
        $btnProfileDelete.prop('disabled',is);
    }

    $btnProfileDelete.click(function(){
        if(isSubmitDeleteProfile)return;
        var cmd=$cmdProfileDelete.val();

        if(cmd=='check_password'){
            var val=$passwordDelete.val(),l=val.length;
            isErrorDeleteProfile=true;
            if(l<stPassLenMin||l>stPassLenMax) {
                showErrorFrm('#password_delete', siteLangPartsSettings.minMaxLenPass, $btnProfileDelete);
                return false;
            }
            dataAjaxDeleteProfile={ajax:1,password:val};
        }
        dataAjaxDeleteProfile.cmd=cmd;
        isSubmitDeleteProfile=true;
        $passwordDelete.val('');
        $btnProfileDelete.html(getLoader());
        disabledProfileSettingsFrm(true);
        isSaveEditSettings=true;
        $.post(url_main+'profile_settings.php',dataAjaxDeleteProfile,
                function(res){
                    $passwordDelete.prop('disabled',false);
                    var data=checkDataAjax(res);
                    if(data!==false){
                        var $data=$(data);
                        if($data.is('error')){
                            showErrorFrm('#password_delete', $data.text(), $btnProfileDelete);
                        }else if(data=='check'){
                            $passwordDelete.prop('disabled',true);
                            isErrorDeleteProfile=false;
                            confirmCustom(siteLangPartsSettings.profileWillDeletedForever, function(){
                                $cmdProfileDelete.val('profile_delete');
                                $btnProfileDelete.html(getLoader()).click().prop('disabled',true);
                                closeAlert();
                            },function(){
                                $passwordDelete.prop('disabled',false).focus();
                                closeAlert();
                            },ALERT_HTML_ARE_YOU_SURE)
                        }else if(data=='delete'){
                            redirectUrl(url_main+'index.php');
                        }else if(data=='demo') {
                            Profile.closePopupEditor('pp_profile_settings_editor');
                        }
                    }
                    $cmdProfileDelete.val('check_password');
                    isSubmitDeleteProfile=false;
                    $btnProfileDelete.html(siteLangPartsSettings.save);
                    disabledProfileSettingsFrm();
                    isSaveEditSettings=false;
            })
        return false;
    })
    /* Profile delete */
    $('.icon_close', '#pp_profile_settings_editor').on('click',function(e){
        if(checkModifiedSettingsInfo()){
            if(isSaveEditSettings){
                Profile.closePopupEditor('pp_profile_settings_editor');
            }else{
                confirmCustom(l('are_you_sure'), function(){
                    Profile.closePopupEditor('pp_profile_settings_editor',resetProfileSettingsFrm);
                }, l('close_window'));
            }
        }else{
            Profile.closePopupEditor('pp_profile_settings_editor',resetProfileSettingsFrm);
        }
        return false;
    })
    /*$('.pp_body').on('click',function(e){
        if(e.target==this
           &&$('#pp_profile_settings_editor:visible')[0]){
            Profile.closePopupEditor('pp_profile_settings_editor',resetProfileSettingsFrm);
        }
    })*/
    $('body').on('click', '.info_link > span', function(e){
        redirectToUpgrade();
    })

    Profile.initClosePpEditorButton($jq('#pp_profile_settings_editor'));
})