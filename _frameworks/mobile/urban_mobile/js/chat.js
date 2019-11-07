var CChat = function(type, isAllowed, isAppPurchase) {

    var $this=this;

    this.dur=300;
    this.type=type;
    this.langParts = {};
	this.isAllowed = isAllowed*1;
    this.price = 0;
    this.url_server = url_main + 'update_server_ajax.php';

    this.showLoadrBtn = function(){
        if($this.$inviteBtn[0]){
            $('img',$this.$inviteBtn).hide();
            getLoaderCl('loader_media_chat','loader_btn').appendTo($this.$inviteBtn)
        }
    }

    this.hideLoadrBtn = function(){
        if($this.$inviteBtn[0]){
            $('#loader_media_chat').remove();
            $('img',$this.$inviteBtn).show();
        }
    }

    this.checkInvite = function(){
        if(!checkLoginStatus())return;
        if(!$this.isAllowed){window.location.href=url_main+'upgrade.php';return;}
        var uid=userTo;
        if($this.price>0){
            $this.showLoadrBtn();
            $.post($this.url_server+'?cmd=get_available_credits',{}, function(res){
                $this.hideLoadrBtn();
                var data=checkDataAjax(res);
                if (data){
                    var balance=data*1;
                    if(balance<$this.price){
                        var msg=$this.langParts.you_have_no_enough_credits;
                        if(!isAppPurchase){
                            msg += '<br>'+$this.langParts.buy_credits;
                            showAlert(msg, 0, 0, 0, 1);
                        }else{
                            showConfirm(msg, $this.langParts.btn_buy_credits, $this.langParts.cancel, function(){window.location.href='upgrade.php?action=refill_credits'}, 'blue');
                        }
                    } else {
                        var msg=$this.langParts.service_costs.replace('{credit}',balance).replace('{price}',$this.price);
                        showConfirm(msg, $this.langParts.ok, $this.langParts.cancel, function(){$this.invite(uid)}, 'blue');
                    }
                }
            })
        } else {
            $this.showLoadrBtn();
            $this.invite(uid);
        }
    }

    this.invite = function(uid){
        hideConfirm();
        $.post($this.url_server+'?cmd=chat_invite',{type:$this.type,user_id:uid,device:(deviceWebsite.mobile()*1)},function(res){
            $this.hideLoadrBtn();
            var data=checkDataAjax(res);
            if(data){
                if(data=='demo_user') {
                    $this.startTalk(uid, 1);
                }else if(data===true){
                    var msg=$this.langParts.invitation_sent+'<br>'+$this.langParts.please_wait_for;
                    setTimeout(function(){showAlert(msg,'.st-content','blue')},220)
                }else if (data=='upgrade') {
                    window.location.href=url_main+'upgrade.php';
                }else{
                    setTimeout(function(){showAlert(data, 0, 0, 0, 1)},220)
                }
            }else{
                setTimeout(function(){showAlert(siteLangParts.server_error_try_again, 0, 0, 0, 1)},220);
            }
        })
    }

    this.request = function(data){
        try{
            hideConfirm();
            if(data.action=='request'){
                var title=$this.langParts.chat_from_user.replace(/{name}/,data.user_name)
                                                        .replace(/{user_id}/,data.user_id);
                var fnTalk=function(){$this.talk(data)},
                    fnReject=function(){$this.reject(data.user_id)};
                var support=supportWebrtc();
                if(support=='ssl'){
                    title += '<br>' + $this.langParts.no_webrtc_ssl;
                    setTimeout(function(){showConfirm(title, $this.langParts.ok, $this.langParts.reject, false, 'blue', 0, fnReject)},220);
                } else if(support){
                    title += '<br>' + $this.langParts.chat_nowe;
                    setTimeout(function(){showConfirm(title, $this.langParts.ok, $this.langParts.cancel, fnTalk, 'blue', 0, fnReject)},220);
                }else{
                    title += '<br>' + $this.langParts.no_webrtc_support;
                    setTimeout(function(){showConfirm(title, $this.langParts.ok, $this.langParts.reject, false, 'blue', 0, fnReject)},220);
                }
            }else if(data.action=='reject'){
                setTimeout(function(){showAlert($this.langParts.refused,0,'blue')},220)
            }else if(data.action=='start_talk'){
                var uid = data.user_id;
                if($this.price>0){
                    $.post($this.url_server,{cmd:'chat_paid',type:$this.type},function(res){
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
        hideConfirm();
        $.post($this.url_server,{cmd:'chat_reject',type:$this.type,user_id:uid},function(res){
            if(checkDataAjax(res)){}
        });
    }

    this.talk = function(data){
        hideConfirm();
        if(data.request_uri){
            window.location.href=url_main+'upgrade.php?request_uri='+data.request_uri;
            return;
        }
        var uid=data.user_id;
        $.post($this.url_server,{cmd:'chat_talk',type:$this.type,user_id:uid},function(res){
            if(checkDataAjax(res)){
                $this.startTalk(uid);
            }
        });
    }

    this.startTalk = function(uid, demo){
        //hideConfirm();
        var param='';
        if(demo){
            param='&demo=1';
        }
        window.location.href=url_main+$this.type+'chat.php?id='+uid+param;
    }

    $(function(){
        $this.$inviteBtn=$('#invite_'+$this.type+'chat');
    })

    return this;
}