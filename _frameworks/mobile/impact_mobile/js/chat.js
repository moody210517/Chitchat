var CChat = function(type) {

    var $this=this;

    this.type=type;
    this.typeKey=type+'chat';

    this.checkInvite = function($link){
        if($link.find('.css_loader')[0])return;
        if(!userAllowedFeature[$this.typeKey]){
            $link.addLoader();
            uploadPageUpgrade($link);
            return;
        }
        if(!requestUserOnline){
            clProfile.toggleMoreMenu(true);
            showAlert(l('the_user_is_offline_now_please_try_later'));
            return;
        }
        $link.addLoader();
        var uid=requestUserId,price=chatsPrice[$this.type];
        if(price>0){
            $.post(url_server+'?cmd=get_available_credits',{}, function(res){
                $link.removeLoader();
                var data=checkDataAjax(res);
                if (data){
                    var balance=data*1;
                    clProfile.toggleMoreMenu(true);
                    if(balance<price){
                        var msg=l('you_have_no_enough_credits');
                        if(!isInAppPurchaseEnabled){
                            msg += '<br>'+l('buy_credits');
                            showAlert(msg)
                        }else{
                            showConfirm(msg,
                                        function(){
                                            var url=urlPagesSite.refill_credits+'?service='+$this.type+'_chat'
                                                +'&request_uid='+requestUserId;
                                            goToPage($('.pp_btn_ok_bl:visible').data('url',url));
                                        },false,
                                        l('btn_buy_credits'), l('cancel'))
                        }
                    } else {
                        var msg=l('this_service_costs_credits').replace('{credit}',balance).replace('{price}',price);
                        showConfirm(msg, function(){
                            var $btn=$('.pp_btn_ok_bl:visible').addLoader();
                            $this.invite(uid,$btn);
                        })
                    }
                }else{
                    serverError()
                }
            })
        } else {
            $this.invite(uid,$link)
        }
    }

    this.invite = function(uid,$link){
        $.post(url_server+'?cmd=chat_invite',{type:$this.type,user_id:uid},function(res){
            var data=checkDataAjax(res);
            if(data){
                if (data!='upgrade') {
                    clProfile.toggleMoreMenu(true);
                    $link.removeLoader();
                }
                if (data=='upgrade') {
                    uploadPageUpgrade($link);
                }else if(data===true){
                    showAlertAppearDelayClose(l('invitation_sent_please_wait_for_user'),2000);
                }else{
                    showAlert(data);
                }
            }else{
                $link.removeLoader();
                serverError();
            }
        })
    }

    this.inviteFromPaidService = function(uid,$link){
        $.post(url_server+'?cmd=chat_invite',{type:$this.type,user_id:uid},function(res){
            var data=checkDataAjax(res);
            $link.removeLoader();
            if(data){
                if(data===true){
                    showConfirm(l('invitation_sent_please_wait_for_user'), function(){
                        goToPage($('.pp_btn_ok_bl:visible').data('url',urlPagesSite.profile_view+'?user_id='+uid));
                    },false,l('go'),'',true,true);
                    //showAlertExecFnClose(l('invitation_sent_please_wait_for_user'),function(){
                       // goToPage($link.data('url',urlPagesSite.profile_view+'?user_id='+uid)[0]);
                    //})
                }else{
                    $link.prop('disabled',false);
                    showAlert(data);
                }
            }else{
                $link.prop('disabled',false);
                serverError();
            }
        })
    }

    this.request = function(data){
        try{
            if(data.action=='request'){
                var fnTalk=function($link){
                        $link.addLoader();
                        $this.talk(data)
                    },
                    fnReject=function(){$this.reject(data.user_id)};
                var support=supportWebrtc();
                if(support=='ssl'){
                    showConfirmUserPhoto(data,l('your_browser_needs_ssl_certificate_to_run_video_chat'),fnReject,fnReject,false,false,true);
                } else if(support){
                    showConfirmUserPhoto(data,l($this.type+'_chat_from_user_impact_mobile'),fnTalk,fnReject);
                }else{
                    showConfirmUserPhoto(data,l($this.type+'_chat_from_user_no_webrtc_support'),fnReject,fnReject,false,false,true);
                }
            }else if(data.action=='reject'){
                showAlert(l('refused_'+$this.type+'chat'));
            }else if(data.action=='start_talk'){
                var uid = data.user_id;
                var price=chatsPrice[$this.type];
                if(price>0){
                    $.post(url_server,{cmd:'chat_paid',type:$this.type},function(res){
                        var data=checkDataAjax(res);
                        if(data && data>=0){
                            $this.startTalk(uid);
                        }
                    })
                } else {
                    $this.startTalk(uid);
                }

            }else{return false}
        }catch(e){return false}
    }

    this.reject = function(uid){
        closeAlert();
        $.post(url_server+'?cmd=chat_reject',{type:$this.type,user_id:uid},function(res){
            if(checkDataAjax(res)){}
        });
    }

    this.talk = function(data){
        if(data.request_uri){
            uploadPageUpgrade([],'?request_uri='+data.request_uri);
            return;
        }
        var uid=data.user_id;
        $.post(url_server+'?cmd=chat_talk',{type:$this.type,user_id:uid},function(res){
            if(checkDataAjax(res)){
                $this.startTalk(uid)
            }
        })
    }

    this.startTalk = function(uid){
        uploadPageMember(false,url_main+$this.type+'chat.php?id='+uid);
    }

    $(function(){

    })

    return this;
}