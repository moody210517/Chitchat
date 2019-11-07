var CJoin = function() {
    var $this = this;

    this.isAjax = false;

    this.initForgot = function(message,redirect){
        $(function(){
            $this.initForgotPage(message,redirect)
        })
    }

    this.initForgotPage = function(message){
        console.info('%cInit page Forgot','background: #fcffd6');
        $this.isAjax=false;
        if(message!=''){
            showConfirm(message, function(){
                redirectUrl(urlPagesSite.index);
            }, false, l('ok'), '', true,true);
        }

        $this.$frmForgot = $('#form_forgot_password');
        $this.$frmForgotMail = $('#form_forgot_password_mail');
        $this.$frmForgotSubmit = $('#form_forgot_password_submit');

        $this.$frmForgotMail.keydown(function(e){
            if (e.keyCode == 13) {
                $this.$frmForgotSubmit.click();
                return false;
            }
        });

        $this.$frmForgot.submit(function(){
            if($this.isAjax)return false;
            if(!$this.validateEmailPass()){
                return false;
            }
            $this.isAjax=true;
            $this.$frmForgotSubmit.addLoader().prop('disabled', true);
            $this.$frmForgot.ajaxSubmit({success: $this.forgotFrmResponse});
            $this.$frmForgotMail.prop('disabled', true);
            return false;
        });

        $this.$frmForgotMail.on('change propertychange input',function(){
            resetError($(this));
        }).focus(function(){
            resetError($(this));
        }).blur(function(){
            resetError($(this));
        })
    }

    this.forgotFrmResponse = function(data){
        var data = getDataAjax(data);
        $this.isAjax=false;
        $this.$frmForgotSubmit.removeLoader();
        if (data){
            if(data == 'link_send') {
                showConfirmToPage(l('the_link_for_changing_password_has_been_sent'), urlPagesSite.index)
            } else {
                $this.$frmForgotMail.prop('disabled', false);
                showError($this.$frmForgotMail.focus(),data);
                $this.$frmForgotSubmit.prop('disabled', false);
            }
        }else{
            serverError();
            $this.$frmForgotMail.prop('disabled', false);
            $this.$frmForgotSubmit.prop('disabled', false);
        }
    }

    this.validateEmailPass = function(){
        var val=$.trim($this.$frmForgotMail.val()),is=false;
        if (!checkEmail(val)) {
            showError($this.$frmForgotMail.focus(),l('this_email_address_is_not_correct'));
        } else {
            resetError($this.$frmForgotMail);
            is=true;
        }
        return is;
    }

    /* JOIN */
    this.initJoin = function(){
        $(function(){
            $this.initJoinPage()
        })
    }

    this.initJoinPage = function(){
        $this.$formBox=$('#form_box');
        $this.isAjax=false;
        $this.$agree=$('#agree');
        $this.dataFrm={};
        $this.isErrorRegister=false;

        $this.initLocation();
        $this.initBirthday();
        $this.initEmail();
        $this.initPass();
        $this.initName();
        $this.initAll();

        $this.$btnSubmit=$('#form_register_submit').click($this.submitJoin)
    }

    this.initLocation = function(){
        $this.$selectLocation=$('.location',$this.$formBox);
        $this.$locationLabel=$('#country_box').find('label > span');
        $this.$country=$('#country');
        $this.$state=$('#state');
        $this.$city=$('#city');

        var $loader;
        $('#country, #state').change(function(){
            var cmd = $(this).data('location');
            $.ajax({type: 'POST',
                    url: url_page,
                    data: {cmd:cmd,
                           ajax:1,
                           select_id:this.value},
                    beforeSend: function(){
                        $this.$selectLocation.prop('disabled',true);
                        $loader=getLoader('loader_register',false,true,true).appendTo($this.$locationLabel);
                    },
                    success: function(res){
                        var data=getDataAjax(res);
                        if (data) {
                            var option='<option value="0">'+l('choose_a_city')+'</option>';
                            if (cmd == 'states') {
                                $this.$state.html('<option value="0">'+l('choose_a_state')+'</option>' + data.list);
                                $this.$city.html(option);
                            } else {
                                $this.$city.html(option + data.list);
                            }
                        }
                        $this.$selectLocation.prop('disabled',false);
                    },
                    complete: function(){
                       $loader.remove();
                    }
            })
        })

        $this.$country.on('change', function(e){
            resetError($this.$state);
            resetError($this.$city);
        })

        $this.$state.on('change', function(e){
            if($this.isErrorRegister){
                var val=this.value*1;
                if(val){
                    resetError($this.$state);
                }else{
                    $this.showError($this.$state,l('state_is_required'))
                }
            }
        }).focus(function(){
            showErrorWrongEl($this.$state)
        }).blur(function(){
            hideError($this.$state)
        })

        $this.$city.on('change', function(e){
            if($this.isErrorRegister){
                var val=this.value*1;
                if(val){
                    resetError($this.$city);
                }else{
                    $this.showError($this.$city,l('state_is_required'))
                }
            }
        }).focus(function(){
            showErrorWrongEl($this.$city)
        }).blur(function(){
            hideError($this.$city)
        })
    }

    /* Birthday */
    this.initBirthday = function(){
        $this.$birthday=$('.s_birthday',$this.$formBox);
        $this.$day=$('#day');
        $this.$frmBirthday=$('#form_birthday');

        $this.$birthday.change(function(){
            if(this.id!='day'){
                var firstValue=false;
                if(isIos){
                    firstValue=l('please_choose_empty');
                    if(!firstValue)firstValue=' ';
                }
                updateDay(this.id,'frm_date','year','month','day',false,firstValue);
            }
            $this.validateBirthday();
        }).focus(function(){
            showErrorWrongEl($this.$frmBirthday)
        }).blur(function(){
            hideError($this.$frmBirthday)
        })
    }

    this.validateBirthday = function(show){
        var isError=false,show=defaultFunctionParamValue(show,1);
        if($this.birthDateToAge()){
            $this.resetErrorBirthday();
            isError=true;
        }else{
            $this.showErrorBirthday(show);
        }
        return isError;
    }

    this.birthDateToAge = function() {
        var birth=new Date($('#year').val(), $('#month').val()-1, $('#day').val()),
            now = new Date(),
            age = now.getFullYear() - birth.getFullYear();
            age = now.setFullYear(1972) < birth.setFullYear(1972) ? age - 1 : age;
        return age>=minAge;
    }

    this.showErrorBirthday = function(show){
        var show=defaultFunctionParamValue(show,1);
        $this.$birthday.addClass('wrong');
        $this.showError($this.$frmBirthday,l('incorrect_date'),show,$this.$frmBirthday,'+5');
    }

    this.resetErrorBirthday = function(){
        $this.$birthday.removeClass('wrong');
        resetError($this.$frmBirthday);
    }
    /* Birthday */
    /* Email */
    this.initEmail = function(){
        $this.$email=$('#email').on('change propertychange input', function(e){
            $this.isErrorRegister&&$this.validateEmail();
        }).focus(function(){
            showErrorWrongEl($this.$email);
        }).blur(function(){
            hideError($this.$email)
        })
    }

    this.validateEmail = function(show){
        var val=$.trim($this.$email.val()),isError=false;
        if(!checkEmail(val)){
            $this.showError($this.$email,l('incorrect_email'),show)
        }else{
            isError=true;
            resetError($this.$email)
        }
        return isError;
    }
    /* Email */
    /* Password */
    this.initPass = function(){
        $this.$pass=$('#password').on('change propertychange input', function(e){
            $this.isErrorRegister&&$this.validatePass();
        }).focus(function(){
            showErrorWrongEl($this.$pass);
        }).blur(function(){
            hideError($this.$pass)
        })
    }

    this.validatePass = function(show){
        var show=defaultFunctionParamValue(show,1),v=$this.$pass.val(),ln=$.trim(v).length,isError=false;
        if(ln<minCahrPass||ln>maxCahrPass){
            $this.showError($this.$pass,lMaxMinLengthPassword,show)
        }else if(~v.indexOf("'")<0) {
            $this.showError($this.$pass,l('invalid_password_contain'),show)
        }else{
            isError=true;
            resetError($this.$pass)
        }
        return isError;
    }
    /* Password */
    /* Name */
    this.initName = function(){
        $this.$name=$('#user_name').on('change propertychange input', function(){
            $this.isErrorRegister&&$this.validateName();
        }).focus(function(){
            $this.initScrollToEl($this.$name);
            showErrorWrongEl($this.$name);
        }).blur(function(){
            hideError($this.$name)
        })
        //setTimeout(function(){$this.isSendRegister=true},500);
    }

    this.validateName = function(show){
        var show=defaultFunctionParamValue(show,1),v=$this.$name.val(),ln=$.trim(v).length,isError=false;
        if (/[#&'"\/\\<]/.test(v)){
            $this.showError($this.$name,l('invalid_username'),show)
        } else if (ln<minCahrName||ln>maxCahrName) {
            $this.showError($this.$name,lMaxMinLengthUsername,show)
        } else {
            isError=true;
            resetError($this.$name);
        }
        return isError;
    }
    /* Name */
    /* All */
    this.initAll = function(){
        $this.$orientation=$('#orientation').on('change', function(e){
            if($this.isErrorRegister){
                var val=this.value*1;
                if(val){
                    resetError($this.$orientation);
                }else{
                    $this.showError($this.$orientation,l('orientation_is_required'))
                }
            }
        }).focus(function(){
            showErrorWrongEl($this.$orientation)
        }).blur(function(){
            hideError($this.$orientation)
        })
        if (isRecaptcha) {
            $this.$recaptchaBl=$('#recaptcha_bl');
            $this.$recaptcha=$('#recaptcha');
            $win.on('resize orientationchange', $this.prepareReCaptcha).resize();
            $('#main_wrap').on('click',function(e){
                var $el=$(e.target);
                if($el.is('#tip_recaptcha')||$el.closest('#tip_recaptcha')[0]||$el.is('#form_register_submit')){
                }else resetError($this.$recaptcha)
            })
        } else {
            $this.$captcha = $('#captcha').on('change propertychange input', function(){
                resetError($this.$captcha);
            }).focus(function(){
                $this.initScrollToEl($this.$captcha);
                showErrorWrongEl($this.$captcha);
            }).blur(function(){
                hideError($this.$captcha)
            })
        }

        $this.$agree=$('#agree').on('change', function(){
            var el=$(this);
            if (el.prop('checked')){
                resetError($this.$agree);
            } else {
                $this.showError($this.$agree,l('please_agree_to_the_terms'))
            }
        }).focus(function(){
            showErrorWrongEl($this.$agree);
        })

        $('#main_wrap').on('click',function(e){
            var $el=$(e.target);
            if($el.is('#tip_agree')||$el.closest('#tip_agree')[0]
                ||$el.closest('.custom_checkbox.no_hide')[0]||$el.is('#form_register_submit')){
            }else resetError($this.$agree)
        })
    }
    /* All */

    this.submitJoin = function(){
        if($this.isAjax)return false;
        $this.isErrorRegister=true;

        var $focus,
        notError=$this.validateEmail(false);
        if(!notError)$focus=$this.$email;
        if(!$this.validatePass(false)&&notError){
            notError=false;
            $focus=$this.$pass;
        }
        if(!$this.validateName(false)&&notError){
            notError=false;
            $focus=$this.$name;
        }
        if (!isIos) {
            if(!$this.validateBirthday(false)&&notError){
                notError=false;
                $focus=$this.$day;
            }
            var isEmpty=$this.$orientation.val()==0;
            if(isEmpty){
                $this.showError($this.$orientation,l('orientation_is_required'),false)
            }
            if(isEmpty&&notError){
                notError=false;
                $focus=$this.$orientation;
            }
            isEmpty=$this.$state.val()==0;
            if(isEmpty){
                $this.showError($this.$state,l('state_is_required'),false);
            }
            if(isEmpty&&notError){
                notError=false;
                $focus=$this.$state;
            }
            isEmpty=$this.$city.val()==0;
            if(isEmpty){
                $this.showError($this.$city,l('city_is_required'),false)
            }
            if(isEmpty&&notError){
                notError=false;
                $focus=$this.$city;
            }
        }

        if(isRecaptcha){
            responseRecaptcha=grecaptcha.getResponse(recaptchaWd);
            if(responseRecaptcha==''){
                showError($this.$recaptcha,l('incorrect_captcha'));
                notError=false;
                $focus=[];
            }else{
                $this.dataFrm['recaptcha']=responseRecaptcha;
            }
        } else {
            isEmpty=$.trim($this.$captcha.val())=='';
            if(isEmpty){
                $this.showError($this.$captcha,l('incorrect_captcha'),false)
                if(notError){
                    notError=false;
                    $focus=$this.$captcha;
                }
            }
        }

        var isTerms=$this.$agree.prop('checked');
        if(!isTerms){
            $this.showError($this.$agree,l('please_agree_to_the_terms'),false)
            if(notError){
                notError=false;
                $focus=$this.$agree.change();
            }
        }

        if (!notError) {
            $focus[0]&&$focus.focus();
            return false;
        }

        $('input.inp, input.ajax, select',$this.$formBox).each(function(){
            $this.dataFrm[$(this).attr('name')]=$(this).val();
        })

        $this.isAjax=true;
        $this.$btnSubmit.addLoader().prop('disabled',true);
        var $fields=$('input.inp, select',$this.$formBox).prop('disabled',true);
        $this.dataFrm['geo_position']=geoPoint;

        $.post(url_page, $this.dataFrm,
            function(data){
                $this.isAjax=false;

                var data=getDataAjax(data),fnError=function(){
                    serverError();
                    $fields.prop('disabled',false);
                    $this.$btnSubmit.removeLoader().prop('disabled',false);
                };
                if (data===false){
                    fnError();
                    return;
                }
                var res=$(data).filter('.redirect');
                if(res[0]){
                    uploadHomePage(res.text(),fnError);
                    return;
                }
                $this.$btnSubmit.removeLoader();
                res=$(data).filter('.wait_approval');
                if(res[0]){
                    showConfirm(l('no_confirmation_account'), function(){
                        goToPage($('.pp_btn_ok_bl:visible').data('url',urlPagesSite.login));
                    }, false, l('ok'), '', true,true);
                }else{
                    $this.$btnSubmit.prop('disabled',false);
                    $fields.prop('disabled',false);

                    if(isRecaptcha){
                        grecaptcha.reset(recaptchaWd);
                    }else{
                        $('#img_join_captcha').click();
                        $this.$captcha.val('');
                    }
                    var dataBlocks = {'.mail' : $this.$email,
                                      '.password' : $this.$pass,
                                      '.name' : $this.$name,
                                      '.birthday' : $this.$day,
                                      '.captcha' : $this.$captcha,
                                      '.recaptcha' : $('#recaptcha_box'),
                    };
                    $this.showErrorFromData(data, dataBlocks);
                }
        })
        return false;
    }

    this.showErrorFromData = function(data, dataBlocks){
        var dataBlock = '',notError=true,$focus;
        for(var dataBlocksKey in dataBlocks) {
            dataBlock = $(data).filter(dataBlocksKey);
            if(dataBlock.length) {
                var el=dataBlocks[dataBlocksKey];
                $this.showError(el,dataBlock.text(),false);
                if(notError){
                    $focus=el;
                    notError=false;
                }
                if(dataBlocksKey=='.birthday'){
                    $this.$birthday.addClass('wrong');
                }
            }
        }
        if(!notError)$focus.focus();
    }

    this.refreshCaptcha = function(){
        $jq('#img_join_captcha').attr('src', '../_server/securimage/securimage_show_custom.php?site_part_mobile=1&sid=' + Math.random());
        return false;
    }

    this.prepareReCaptcha = function(){
        if($this.$recaptcha==undefined)return;
        var $renderC=$this.$recaptcha.children('div');
        if(!$renderC[0])return;
        $this.$recaptcha.removeAttr('style');
        var wb=$this.$recaptchaBl.width(),wr=$renderC.width(),
            sc=parseFloat(wb/wr).toFixed(3);
        if(sc>1.1)sc=1.1;
        $this.$recaptcha.css({transform:'scale('+sc+')', transformOrigin:'0 0'});
        $this.$recaptchaBl.addClass('to_show');
    }

    this.showError = function(el,msg,vis,wr,d){
        showError(el,msg,vis,false,wr,d)//$this.$formBox
    }

    this.initScrollToEl = function($el){
        $win.one(getEventOrientation(),function(){
            var top=$el.closest('.bl').offset().top+$('#main').scrollTop()-$('#main')[0].offsetHeight+94;
            $('#main').stop().animate({scrollTop:top},300,'easeInOutCubic')
        })
    }
    /* JOIN */

    $(function(){

    })

    return this;
}