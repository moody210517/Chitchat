var CUpgrade = function(requestUri) {

    var $this=this;

    this.requestUri=requestUri;
    this.langParts={};

    this.isAction=false;

    this.initChoiceSystem = function(boost){
        boost=boost?'_boost':'';
        var dur=250;
        $('.frame', '#switch_paymant'+boost).on('mousedown touchstart', function(e){
            var $el=$(this), id=$el.data('payment'),
                $vis=$('.cont_pp_profile_upgraded_item'+boost+':visible');
            if(id==$vis[0].id)return;
            $vis.stop().fadeOut(dur,function(){
                $vis.removeClass('show');
                $('#'+id).stop().fadeIn(dur);
            })
            $jq('#switch_paymant_arrow'+boost).css({top:($el.parent('.item')[0].offsetTop+12)});
        })
    }

    this.initReady = function(){
        $('.upgrade_radio_styled').each(function(){$(this).prettyCheckable({customClass: 'niceRadio'})})
        $('.upgrade_radio_styled:checked').change();

        $('.upgrade_package .items .item').each(function() {
            $(this).click(function() {
                $('.upgrade_package .items .item').removeClass('selected').find('a').removeClass('checked');
                $(this).addClass('selected').find('a').addClass('checked');
            })
        })

        $this.initChoiceSystem();

        $jq('#pp_payment').modalPopup({css:{zIndex:1001},shCss:{}, wrCss:{}, wrClass:'wrapper_custom', shClass:'pp_shadow_white'});

        $('.pp_wrapper').on('click', function(e){
            if(this==e.target&&!$this.isAction)$this.closePopupPaymentSystem();
        })
    }

    this.showPopupPaymentSystem = function(boost){
        boost=boost?'_boost':'';
        var prf=boost?'Boost':'';
        var item=$this['selectedPaymentPlanData'+prf]['item'],id='';
        $('.cont_pp_profile_upgraded_item'+boost).hide().each(function(){
            if($this['availablePaymentSystemToPlan'+prf][item].indexOf(this.id)===-1){
                $('#payment_'+this.id).hide();
            }else{
                if(!id){
                    $('#'+this.id).show();
                    id=this.id;
                }
                $('#payment_'+this.id).show();
            }
        })
        if(id){
            setTimeout(function(){
                var top=$('#payment_'+id, '#switch_paymant'+boost).first()[0].offsetTop+12,
                    topArrow=parseInt($jq('#switch_paymant_arrow'+boost).css('top'));
                if(top!=topArrow){
                    $jq('#switch_paymant_arrow'+boost).oneTransEnd(function(){
                        $(this).css('transition','all .5s');
                    }).css({top:top,transition:'all .01s'})
                }
            },10)
        }
        $('#pp_payment_plan_name'+boost).html($this['selectedPaymentPlanData'+prf].name);
        $('#pp_payment_total_price'+boost).html($this['selectedPaymentPlanData'+prf].total_price);
        if (boost) {
            var $pp=openPopupList['#pp_boost_ajax']['el'];
            $pp.find('.cont_boost_system').show().delay(5).removeClass('to_hide',0);
        } else {
            $jq('#pp_payment').open();
        }
    }

    this.closePopupPaymentSystem = function(){
        $jq('#pp_payment').close();
    }

    this.selectedPaymentPlanData={};
    this.selectedPaymentPlanDataBoost={};
    this.selectedPaymentPlan = function(item, name, totalPrice, boost){
        boost=boost?'Boost':'';
        $this['selectedPaymentPlanData'+boost]={item:item,name:name,total_price:totalPrice};
    }

    this.availablePaymentSystemToPlan={};
    this.availablePaymentSystemToPlanBoost={};
    this.setAvailablePaymentSystemToPlan = function(item, data, boost){
        boost=boost?'Boost':'';
        $this['availablePaymentSystemToPlan'+boost][item]=data;
    }

    this.showErrorProfileUpgrade = function(boost){
        boost=boost?'_boost':'';
        $this.isAction=true;
        $('#switch_paymant'+boost).addClass('to_hide');
        $('#profile_upgraded_system'+boost).oneTransEnd(function(){
            $('#profile_upgraded_system'+boost).hide();
            $('#profile_upgraded_error'+boost).fadeIn(250);
        }).addClass('to_hide');
    }

    this.profileUpgrade = function(requestUri){
        var system=$('.cont_pp_profile_upgraded_item:visible')[0].id;
        $.ajax({type: 'POST',
                url: url_main+'upgrade.php?cmd=save&ajax=1',
                data: {item:$this.selectedPaymentPlanData.item,
                       system:system,
                       request_uri:requestUri},
                beforeSend: function(){
                    $jq('#pp_payment_proceed').prop('disabled', true).html(getLoader('btn_payment_proceed'));
                },
                error: $this.showErrorProfileUpgrade,
                success: function(data){
                    $this.isAction=true;
                    var data=checkDataAjax(data);
                    if(data){
                        if(data=='before_error'){
                            $this.showErrorProfileUpgrade();
                        }else if(data.type){
                            if(data.type=='demo'){
                                if (requestUri) {
                                    redirectUrl(url_main+requestUri);
                                    return;
                                }
                                $jq('#switch_paymant').addClass('to_hide');
                                $jq('#profile_upgraded_system').oneTransEnd(function(){
                                    $jq('#profile_upgraded_system').hide();
                                    $jq('#profile_upgraded_sucess').fadeIn(250);
                                }).addClass('to_hide');
                            }else{
                                redirectUrl(url_main+data.url)
                            }
                        }
                    }else{
                        $this.showErrorProfileUpgrade();
                    }
                }
        });
    }

    /* Boost */
    this.initIncreasePopularityPlan = function(){
        $('.boost_radio_styled').each(function(){$(this).prettyCheckable({customClass: 'niceRadio'})})
        $('.boost_radio_styled:checked').change();

        $('.boost_profile .items .item').each(function() {
            $(this).click(function() {
                $('.boost_profile .items .item').removeClass('selected').find('a').removeClass('checked');
                $(this).addClass('selected').find('a').addClass('checked');
            })
        })

        $this.initChoiceSystem(true);
    }

    this.checkRequestPopularity = function(data,action){
        action=action||'';
        data=checkDataAjax(data);
        if (data===false) {
            alertServerError();
            return false;
        }

        if(action=='payment'||action=='refill'){
            return typeof data.type!='undefined'?data:$(trim(data));
        //} else if(action=='refill' && data.type=='demo') {
            //console.log();
           // $this.changeBalance($this.langParts.credit_balance.replace(/_boost/, data.type));
            //return data;
        }else{
            var $data=$(trim(data));
            if (!$data.is('.increase_payment')){
                alertServerError();
                return false;
            }
            return $data;
        }
    }

    this.changeBalance = function(balance){
        if(balance){
            $jq('#credits_balans_header').html(balance);
        }
    }

    this.incPopularityPay = function(action, type, btn){
        action=action||'';
        type=type||'';
        var isMedia=type=='video_chat'||type=='audio_chat';
        if (action=='payment_service'&&isMedia) {
            btn.prop('disabled', true).html(getLoader('loader_boost_btn',false,true));
            if (type=='video_chat') {
                videoChat.invite(requestUserId);
            }else{
                audioChat.invite(requestUserId);
            }
            return;
        }
        var item='',system='';
        if(action!='payment_service'){
            item=$this.selectedPaymentPlanDataBoost.item;
            var $system=$('.cont_pp_profile_upgraded_item_boost:visible');
            if($system[0]){
                system=$system[0].id.replace(/_boost/, '');
            }
        }
        var nameBtn=action!='payment_service'?$this.langParts.proceed:$this.langParts.go;
        btn.prop('disabled', true).html(getLoader('loader_boost_btn',false,true));
        $.ajax({type: 'POST',
                url: url_main+'increase_popularity.php',
                data: {ajax:1,action:action,item:item,system:system,type:type,request_uri:$this.requestUri},
                beforeSend: function(){
                    btn.prop('disabled',true).html(getLoader('loader_boost_btn',false,true));
                },
                error: function(){
                    btn.prop('disabled',false).html(nameBtn);
                },
                success: function(data){
                    var $data=$this.checkRequestPopularity(data,action);
                    if(!$data){
                        btn.prop('disabled',false).html(nameBtn);
                        return;
                    }
                    var isError=false;
                    if((action!='payment_service') && !$data[0]){
                        if($data.type=='url_system'){
                            redirectUrl(url_main+$data.url);
                        } else {
                            isError=true;
                        }
                    }else{
                        var $cont=$data.find('.pp_cont_payment_success'),
                            $pp=openPopupList['#pp_boost_ajax']['el'];
                        if($cont[0]){
                            $this.changeBalance($cont.data('balance'));
                            if (action=='payment'||action=='refill') {
                                if (isMedia) {//Demo
                                    closePopupUpdate('#pp_boost_ajax');
                                    setTimeout(function(){$this.requestIncreasePopularity('pp_payment',type)},300);
                                    return;
                                }
                                $pp.find('.cont_boost_system').oneTransEnd(function(){
                                    $pp.addClass('pp_boost_ajax pp_boost');
                                    $pp.html($cont.html());
                                    $pp.find('.cont').delay(1).fadeTo(200,1)
                                }).addClass('to_hide');
                            }else{
                                $pp.find('.cont').fadeTo(200,0,function(){
                                    $pp.html($cont.html());
                                    $pp.find('.cont').delay(1).fadeTo(200,1)
                                })
                            }
                        }else{
                            isError=true;
                        }
                    }
                    if (isError) {
                        if (action=='payment') {
                            $this.showErrorProfileUpgrade(true);
                        }else{
                            alertServerError();
                        }
                    }
                }
        });
    }

    this.requestIncreasePopularity = function(cmd,type){
        if(Profile.notAccessToSite())return false;
        openPopupUpdate('#pp_boost_ajax');
        //return;
        cmd=cmd||'pp_payment';
        type=type||'search';
        var action='payment';
        if(cmd=='pp_refill'){
            action='refill';
            type='refill';
        }
        $.post(url_main+'increase_popularity.php?cmd='+cmd,{ajax:1,type:type,action:action,id:0,credits:''},function(data){
            var $data=$this.checkRequestPopularity(data);
            if(!$data)return;
            var $pp=openPopupList['#pp_boost_ajax']['el'];
            if(!$pp.is(':visible'))return;
            var $cont=$data.find('.pp_cont_have'),type='';
            if(!$cont[0]){
                $cont=$data.find('.pp_cont_plan');
                if($cont[0])type='plan';
            }
            if(!$cont[0]){
                alertServerError();
                return;
            }
            $pp.find('.cont').oneTransEnd(function(){
                if (type=='plan') {
                    $pp.html($cont.html()).addClass('pp_boost_profile');
                    $data.find('.cont_boost_system').appendTo($pp);
                }else{
                    $pp.html($cont.html()).addClass('pp_boost');
                }
                $pp.find('.cont:not(.cont_boost_system)').oneTransEnd(function(){
                    /*if(type!='plan'){
                        $pp.css('background', '#ff6d85')
                    }*/
                }).delay(10).removeClass('to_hide',0);
                $pp.delay(10).removeClass('no_border',0);
            }).addClass('to_hide');
        })
    }

    this.showPopupPaymentSystemBoost = function(){
        var $pp=openPopupList['#pp_boost_ajax']['el'];
        $pp.find('.cont_boost_plan').oneTransEnd(function(){
            $(this).hide();
            $pp.removeAttr('class').addClass('pp_upgraded pp_cont');
            $this.showPopupPaymentSystem(true);
        }).addClass('to_hide');
    }
    /* Boost */

    $(function(){
        if(activePage=='upgrade.php'){
            $this.initReady();
        }
        $('body').on('click', '.pp_wrapper', function(e){
            var target=$(e.target);
            if(target.is('.pp_wrapper')){
                if (openPopupList['#pp_boost_ajax']
                    &&openPopupList['#pp_boost_ajax']['el'].is(':visible')){
                    if(openPopupList['#pp_boost_ajax']['close'])return;
                    var $pp=openPopupList['#pp_boost_ajax']['el'],
                        $ss=$pp.find('.cont_boost_system');
                    if ($ss[0]&&$ss.is(':visible')&&!$('#profile_upgraded_error_boost').is(':visible')) {
                        openPopupList['#pp_boost_ajax']['close']=1;
                        $ss.oneTransEnd(function(){
                            $(this).hide();
                            $pp.addClass('pp_boost_ajax pp_boost_profile')
                               .find('.cont_boost_plan').show().delay(5).oneTransEnd(function(){
                                   openPopupList['#pp_boost_ajax']['close']=0;
                               }).removeClass('to_hide',0);
                        }).addClass('to_hide')
                    }else{
                        closePopupUpdate('#pp_boost_ajax');
                    }
                }
            }
        }).on('click', '.credits_balans', function(e){
            $this.requestIncreasePopularity('pp_refill');
            return false;
        })
    })
    return this;
}