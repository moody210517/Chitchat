$(function(){
    var $formBox = $('#form_box'),
        isAjax = true,
        $agree=$('#agree'),
        dataFrm = {},
        isErrorRegister = false;

    $('.bl_settings').on('click', function(e){
        var target=$(e.target);
        if (target.is('.form_birthday')||target.is('.var_sel')) {
            hideCustomTip();
        }
    });

    /* Change Location */
    var $selectLocation=$('.location',$formBox),
        $country=$('#country'), $state=$('#state'), $city=$('#city');

    $('#country, #state').change(function(){
            var cmd = $(this).data('location');
            $.ajax({type: 'POST',
                    url: url_page,
                    data: {cmd:cmd,
                           ajax:1,
                           select_id:this.value},
                    beforeSend: function(){
                        $selectLocation.prop('disabled',true);
                        $('#country_box').append(getLoaderCl('loader_register','loader_register',1));
                    },
                    success: function(res){
                        var data=getDataAjax(res);
                        if (data) {
                            var option='<option value="0">'+langParts['choose_a_city']+'</option>';
                            if (cmd == 'states') {
                                $state.html('<option value="0">'+langParts['choose_a_state']+'</option>' + data.list).prop('disabled',false);
                                $city.html(option).prop('disabled',false);
                            } else {
                                $state.prop('disabled',false);
                                $city.html(option + data.list).prop('disabled',false);
                            }
                        }
                        $country.prop('disabled',false);
                    },
                    complete: function(){
                        hideLoaderCl('loader_register');
                    }
            });
    });
    $country.click(function(){
        removeTipTopErrorVisible();
    })

    $state.click(function(){
        showErrorCondition($state);
    })

    $city.click(function(){
        showErrorCondition($city);

    })
    /* Change Location */

    /* Birthday */
    var $birthday=$('.birthday',$formBox),
        $day=$('#day');

    $birthday.click(function(){
        showErrorCondition($day);
    }).change(function(){
        if(this.id!='day'){
            var firstValue=false;
            if(isIos){
                firstValue=langParts.please_choose_empty;
                if(!firstValue)firstValue=' ';
            }
            updateDay(this.id,'frm_date','year','month','day',false,firstValue);
        }
        validateBirthday();
    })

    function validateBirthday(show){
        var isError=false,show=defaultFunctionParamValue(show,1);
        if(birthDateToAge()){
            setBirthdayWrong(0);
            isError=true;
        }else{
            setBirthdayWrong(1);
            setTimeout(function(){showErrorBirthday(show)},100);
        }
        return isError;
    }

    function birthDateToAge() {
        var birth=new Date($('#year').val(), $('#month').val()-1, $('#day').val()),
            now = new Date(),
            age = now.getFullYear() - birth.getFullYear();
            age = now.setFullYear(1972) < birth.setFullYear(1972) ? age - 1 : age;
        return age>=minAge;
    }

    function setBirthdayWrong(set){
        if(set){$birthday.addClass('wrong')
        }else{$birthday.removeClass('wrong')}
    }

    function showErrorBirthday(show){
        var show=defaultFunctionParamValue(show,1);
        showTipTop($day,langParts['incorrect_date'],show,$day.parent('.bl'),'+65');
    }
    /* Birthday */

    /* orientation */
    var $orientation=$('#orientation').on('change', function(e){
        resetTipTopError($(this));
    }).focus(function(){
        showErrorCondition($(this));
    }).blur(function(){
        resetTipTopError($(this));
    })
    /* orientation */

    /* Email */
    var $email=$('#email').on('change propertychange input', function(e){
        resetTipTopError($(this));
    }).focus(function(){
        showErrorCondition($(this));
    }).blur(function(){
        resetTipTopError($(this));
    })

    function validateEmail(){
        var val=$.trim($email.val()),isError=false;
        if(!checkEmail(val)){
            showTipTop($email,langParts['incorrect_email'],1,$email.closest('.bl'));
        }else{
            isError=true;
            resetTipTopError($email);
        }
        return isError;
    }
    /* Email */

    /* Pass */
    var $pass=$('#password').on('change propertychange input', function(e){
        resetTipTopError($(this));
    }).focus(function(){
        showErrorCondition($(this));
    }).blur(function(){
        resetTipTopError($(this));
    })

    function validatePass(show){
        var show=defaultFunctionParamValue(show,1),v=$pass.val(),l=$.trim(v).length,isError=false;
        if(l<minCahrPass||l>maxCahrPass){
            showTipTop($pass,langParts['max_min_length_password'],show,$pass.closest('.bl'));
        }else if(~v.indexOf("'")<0) {
            showTipTop($pass,langParts['invalid_password_contain'],show,$pass.closest('.bl'));
        }else{
            isError=true;
            resetTipTopError($pass);
        }
        return isError;
    }
    /* Pass */

    /* Name */
    var $name=$('#user_name').on('change propertychange input', function(){
        resetTipTopError($(this));
    }).focus(function(){
        showErrorCondition($(this));
    }).blur(function(){
        resetTipTopError($(this));
    })

    function validateName(show){
        var show=defaultFunctionParamValue(show,1),v=$name.val(),l=$.trim(v).length,isError=false;
        if (/[#&'"\/\\<]/.test(v)){
            showTipTop($name,langParts['invalid_username'],show,$name.closest('.bl'));
        } else if (l<minCahrName||l>maxCahrName) {
            showTipTop($name,langParts['max_min_length_username'],show,$name.closest('.bl'));
        } else {
            isError=true;
            resetTipTopError($name);
        }
        return isError;
    }
    /* Name */

    /* Captcha */
    if (!isRecaptcha) {
        var $captcha = $('#captcha').on('change propertychange input', function(){
            resetTipTopError($(this));
        }).focus(function(){
            showErrorCondition($(this));
        }).blur(function(){
            resetTipTopError($(this));
        })
    }
    /* Captcha */

    /* Re-Captcha */
    if (isRecaptcha) {
        var $recaptcha=$('#recaptcha');
    }
    /* Re-Captcha */

    var $agree=$('#agree').on('change', function(){
        removeTipTopErrorVisible();
        var el=$(this);
        if (el.prop('checked')){
            resetTipTopError(el)
        } else {
            showTipTop(el,langParts['please_agree_to_the_terms'],1,el.closest('.bl'));
            setTimeout(function(){$('#tip_agree').css('left','84px')},1);
        }
    })

    /* Submit */
    var $btnSubmit=$('#form_register_submit').click(function(){
        hideCustomTip(1);
        if(!isAjax)return false;
        isErrorRegister=true;

        var notError=validateEmail(),el;
        notError&=validatePass(notError);
        notError&=validateName(notError);

        if (!isIos) {
            notError&=validateBirthday(notError);
            var isEmpty=$state.val()==0;
            if(isEmpty){
                showTipTop($state,langParts['state_is_required'],notError,$state.parent('.bl'));
                $state.addClass('wrong');
            }
            notError&=!isEmpty;

            isEmpty=$city.val()==0;
            if(isEmpty){
                showTipTop($city,langParts['city_is_required'],notError,$city.parent('.bl'));
                $city.addClass('wrong');
            }
            notError&=!isEmpty;

            isEmpty=$orientation.val()==0;
            if(isEmpty){
                showTipTop($orientation,langParts['orientation_is_required'],notError,$orientation.parent('.bl'));
                $orientation.addClass('wrong');
            }
            notError&=!isEmpty;
        }

        if(!isRecaptcha){
            isEmpty=$.trim($captcha.val())=='';
            if(isEmpty){
                showTipTop($captcha,langParts['incorrect_captcha'],notError,$captcha.parent('.bl'));
            }
            notError&=!isEmpty;
        }

        if(isRecaptcha){
            responseRecaptcha=grecaptcha.getResponse(recaptchaWd);
            if(responseRecaptcha==''){
                showTipTop($recaptcha,langParts['incorrect_captcha'],notError,$recaptcha.closest('.bl'));
                setTimeout(function(){$('#tip_recaptcha').css('left','84px')},1);
                return false;
            }
            dataFrm['recaptcha']=responseRecaptcha;
        }

        var isTerms=$agree.prop('checked');
        if(!isTerms){
            showTipTop($agree,langParts['please_agree_to_the_terms'],notError,$agree.closest('.bl'));
            setTimeout(function(){$('#tip_agree').css('left','84px')},1);
        }
        notError&=isTerms;

        if (!notError) {
            $('body,html').animate({scrollTop: 0},400);
            return false;
        }

        $('input.inp, input.ajax, select',$formBox).each(function(){
            dataFrm[$(this).attr('name')]=$(this).val();
        })

        isAjax=false;

        $btnSubmit.html(getLoaderCl('register_loader'));
        var $fields=$('input.inp, select',$formBox).prop('disabled',true);

        $.post(url_page, dataFrm,
               function(data){
                    isAjax=true;
                    $fields.prop('disabled',false);

                    var data = getDataAjax(data);
                    if (data===false){
                        tools.showServerError();
                        $btnSubmit.html(langParts['register']);
                        return;
                    }
                    var res=$(data).filter('.redirect');
                    if(res[0]){
                        tools.redirect(res.text());
                        return;
                    }
                    $btnSubmit.html(langParts['register']);

                    res=$(data).filter('.wait_approval');
                    if(res[0]){
                        showAlert(langParts['no_confirmation_account']);
						$('.st-content-inner').on('mousedown touchstart',function(){
							setTimeout(function(){
								window.location.href=url_main+'join.php?cmd=please_login';
							},150)
						})
                    }else{
                        if(isRecaptcha){
                            grecaptcha.reset(recaptchaWd);
                        }else{
                            $('#img_join_captcha').click();
                            $captcha.val('');
                        }
                        var dataBlocks = {'.mail' : $email,
                                          '.password' : $pass,
                                          '.name' : $name,
                                          '.birthday' : $day,
                                          '.captcha' : $('#captcha'),
                                          '.recaptcha' : $('#recaptcha_box'),
                        };
                        showTipFromData(data, dataBlocks);
                    }
        })

        return false;
    })

    function showTipFromData(data, dataBlocks){
        var dataBlock = '',notError=true;
        for(dataBlocksKey in dataBlocks) {
            dataBlock = $(data).filter(dataBlocksKey);
            if(dataBlock.length) {
                var el=dataBlocks[dataBlocksKey];
                showTipTop(el,dataBlock.text(),notError,el.parent('.bl'));
                notError&=false;
                if(dataBlocksKey=='.birthday'){
                    $birthday.addClass('wrong');
                }
            }
        }
    }
    /* Submit */
    function showErrorCondition(el){
        if($('#tip_'+el[0].id+':visible')[0]){
            resetTipTopError(el);
        }else{
            removeTipTopErrorVisible();
            showTipTopError(el);
        }
    }
})


function refreshCaptcha(){
    $('#img_join_captcha').attr('src', '../_server/securimage/securimage_show_custom.php?sid=' + Math.random());
    return false;
}