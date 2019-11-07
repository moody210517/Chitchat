function upgradeInit(){
$(function(){
    var durFrmUpgrade=500,
        $paymentItems=$jq('#payment_items'),
        $paymentSystems=$jq("#payment_system"),
        $typeService=$jq('#type_service'),
        $allowPaidService=$jq('#allow_paid_service'),
        $requestUid=$jq('#request_uid'),
        listPaymentSystem=$paymentSystems.html();
    $('.hide_for_'+$paymentItems.val(),$paymentSystems).remove();

    $paymentItems.change(function(){
        var s=$paymentSystems.val();
        $paymentSystems.html(listPaymentSystem);
        $('.hide_for_'+$paymentItems.val(),$paymentSystems).remove();
        $("#payment_system [value='"+s+"']").prop('selected', true);
    })

    var $btnActionUpgrade=$('#btn_action_upgrade').on('click',function(){
        $(this).prop('disabled',true).addLoader();
        if (paydMediaService())return false;
        $('#frm_upgrade').ajaxSubmit({success:upgradePayment});
        return false;
    });

    function isMediaService(type){
        return in_array(type, ['video_chat', 'audio_chat', 'message']);
    }

    function paydMediaService(){
        var type=$typeService.val(), isAllowPayd=$allowPaidService.val(), uid=$requestUid.val();
        if (isMediaService(type) && isAllowPayd) {
            if (type == 'video_chat') {
                videoChat.inviteFromPaidService(uid,$btnActionUpgrade);
            } else if(type == 'audio_chat'){
                audioChat.inviteFromPaidService(uid,$btnActionUpgrade);
            } else {
                goToPage($btnActionUpgrade.data('url',urlPagesSite.messages+'?display=one_chat&user_id='+uid));
            }
            return true;
        }
        return false;
    }

    function upgradePayment(data){
        data=checkDataAjax(data);
        if (data && data!='before_error'){
            var type=$typeService.val();
            var cmd=data.type;
            if (IS_DEMO || data.type) {
                if (type || data.type_features == 'credits') {
                    if (cmd == 'refill' || (data.type_features == 'credits' && !type)) {
                        showAlert(l('your_balance_is_refilled'));
                        $btnActionUpgrade.removeLoader().prop('disabled',false);
                    } else if (cmd == 'payment_success') {
                        $jq('.pl_service').slideUp(durFrmUpgrade,function(){
                            $jq('.pl_service > p').html('');
                            $jq('#pl_service_info_last').html(data.data)
                            $jq('#pl_service_info').html(l('success_payment_search'))
                            $jq('.pl_service').delay(50).slideDown(durFrmUpgrade);
                        })
                        $btnActionUpgrade.text(l('enjoy_the_fame')).removeLoader()
                        .prop('disabled',false).off('click').click(function(){
                            goToPage($btnActionUpgrade.data('url',urlPagesSite.search_results)[0]);
                            $btnActionUpgrade.prop('disabled',true);
                            return false;
                        })
                    } else if (cmd == 'service_not_paid') {
                        $allowPaidService.val('');
                        scrollMainTo(function(){
                            $jq('.pl_service').slideUp(durFrmUpgrade*.7,function(){
                                var isFn=false;
                                $jq('.pl_refill, #frm_upgrade_plan').delay(50).slideDown(durFrmUpgrade,function(){
                                    if(isFn)return;isFn=true;
                                    $btnActionUpgrade.toggleClass('pink lblue').text(l('refill'))
                                                     .removeLoader().prop('disabled',false);
                                })
                            })
                            $jq('#block_page_boost_profile').toggleClass('profile_boosted');
                        })
                    } else {
                        $allowPaidService.val(1);
                        $jq('#pl_service_info').html(data.data);
                        scrollMainTo(function(){
                            if (type == 'message') {
                                $jq('.pl_refill').slideUp(durFrmUpgrade);
                                $jq('#frm_upgrade_plan').slideUp(durFrmUpgrade,function(){
                                    $btnActionUpgrade.toggleClass('pink lblue').text(l('go'))
                                                     .removeLoader().prop('disabled',false);
                                    $btnActionUpgrade.off('click').click(function(){
                                        $btnActionUpgrade.addLoader().prop('disabled',true);
                                        goToPage($btnActionUpgrade.data('url',urlPagesSite.messages+'?display=one_chat&user_id='+$requestUid.val()));
                                        return false;
                                    })
                                })
                                $('.pl_refill_credit_add').slideDown(durFrmUpgrade);
                            } else {
                            var isFn=false;
                                $jq('.pl_refill').slideUp(durFrmUpgrade*.7,function(){
                                    $jq('.pl_service').delay(50).slideDown(durFrmUpgrade,function(){
                                    if(isFn)return;isFn=true;
                                    $btnActionUpgrade.toggleClass('pink lblue').text(l('go'))
                                                     .removeLoader().prop('disabled',false);
                                    if (type == 'video_chat' || type == 'audio_chat' || type == 'message') {
                                        $btnActionUpgrade.off('click').click(function(){
                                            $btnActionUpgrade.addLoader().prop('disabled',true);
                                            if (type == 'video_chat') {
                                                videoChat.inviteFromPaidService($requestUid.val(),$btnActionUpgrade);
                                            } else if(type == 'audio_chat'){
                                                audioChat.inviteFromPaidService($requestUid.val(),$btnActionUpgrade);
                                            } else {
                                                goToPage($btnActionUpgrade.data('url',urlPagesSite.messages+'?display=one_chat&user_id='+$requestUid.val()));
                                            }
                                            return false;
                                        })
                                    }
                                    })
                                    $jq('#frm_upgrade_plan').delay(50).slideUp(durFrmUpgrade);
                                })
                            }
                            $jq('#block_page_boost_profile').toggleClass('profile_boosted');
                        })
                    }
                }else{
                    $jq('#frm_upgrade').slideUp(durFrmUpgrade,function(){
                        showConfirm(l('profile_upgraded'), function(){
                            goToPage($('.pp_btn_ok_bl:visible').data('url',urlPagesSite.profile_view));
                        }, false, l('ok'), '', true,true);
                        $('<div class="bl_choose top"><p>'+data.data+'</p></div>').hide()
                        .insertAfter($jq('#bl_payment_system')).delay(50).slideDown(durFrmUpgrade*.5);
                    })
                }
            }else{
                redirectUrl(data)
            }
        }else{
            $btnActionUpgrade.prop('disabled',false).removeLoader();
            showConfirm(l('there_was_an_error'), function(){
                setTimeout(clCommon.openContact,300);
            }, false, l('contact_us'), '', true);
        }
    }
})
}