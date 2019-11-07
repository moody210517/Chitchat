var CChat = function(type) {

    var $this=this;

    this.type=type;
    this.typeKey=type+'chat';

    this.checkInvite = function($link, onlineUser){
        if($link.is('.disabled')) return;
        if($link.data('tooltip'))$link.blur();

        if(false && !userAllowedFeature[$this.typeKey]){
            redirectToUpgrade();
            return;
        }

        var uid=$link.data('uid');
        onlineUser=onlineUser||clProfile.getRealStatusOnline();
        if(!onlineUser){
            alertCustom(l('the_user_is_offline_now_please_try_later'));
            clProfile.hideMoreMenu();
            return;
        }

        if(!checkSupportWebrtc('video')){
            return;
        }

        addChildrenLoader($link.addClass('disabled'));

        var price=chatsPrice[$this.type];
        if(price>0&&false){
            $.post(url_server+'?cmd=get_available_credits',{}, function(res){
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
                    alertServerError();
                }
                removeChildrenLoader($link.removeClass('disabled'));
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
                    clProfile.hideMoreMenu();
                    removeChildrenLoader($link.removeClass('disabled'));
                }
                if (data=='upgrade') {
                    redirectToUpgrade();
                }else if(data===true){
                    alertCustom(l('please_wait_for_user'),l('invitation_sent'));
                }else{
                    alertCustom(data);
                }
            }else{
                removeChildrenLoader($link.removeClass('disabled'));
                alertServerError();
            }
        })
    }

    this.request = function(data){
        try{
            if(data.action=='request'){
                var fnTalk=function($link){
                        $link.addChildrenLoader();
                        $this.talk(data)
                    },
                    fnReject=function(){
                        $this.reject(data.user_id);
                    };
                var support=supportWebrtc();
                if(support=='ssl'){
                    showNotifMediaChat($this.type,data,fnReject,'',l('your_browser_needs_ssl_certificate_to_run_video_chat'),l('alert_html_ok'),true);
                } else if(support){
                    showNotifMediaChat($this.type,data,fnTalk,fnReject);
                }else{
                    showNotifMediaChat($this.type,data,fnReject,'',l($this.type+'_chat_from_user_no_webrtc_support'),l('alert_html_ok'),true);
                }
            }else if(data.action=='reject'){
                alertCustom(l('refused_'+$this.type+'chat'));
            }else if(data.action=='start_talk'){
                var uid = data.user_id;
                var price=chatsPrice[$this.type];
                if(price>0&&false){
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
        resetHashMedia($this.type);
        $.post(url_server+'?cmd=chat_reject',{type:$this.type,user_id:uid},function(res){
            if(checkDataAjax(res)){}
        });
    }

    this.talk = function(data){
        resetHashMedia($this.type);
        if(data.request_uri&&false){
            redirectToUpgrade('request_uri='+data.request_uri);
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
        resetHashMedia($this.type);
        redirectUrl(urlMain+$this.type+'chat.php?id='+uid);
    }

    $(function(){

    })

    return this;
}