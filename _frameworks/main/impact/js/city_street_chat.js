var CCityStreetChat = function() {

    var $this=this;

    this.dur=300;
    this.langParts = {};
    this.isDemoUser = 0;

    this.invite = function(uid){
        if(!checkLoginStatus())return;
		if(!userAllowedFeature['3d_city']){
            redirectToUpgrade();
            return;
        }
        $.post(url_server+'?cmd=city_street_chat_invite',{user_id:uid},function(res){
            var data=checkDataAjax(res);
            if(data){
                if(data=='upgrade') {
                    redirectToUpgrade();
                }else{
                    var msg,title;
                    if(data===true){
                        msg=siteLangParts.please_wait_for;
                        title=siteLangParts.invitation_sent;
                    } else {
                        msg=data;
                        title=ALERT_HTML_ALERT;
                    }
                    alertCustom(msg, true, title, false, 'street_chat')
                }
            }else{
                alertServerError(true)
            }
        })
    }

    this.request = function(data){
        try{
            console.log('REQUEST STREET CHAT',data);
            closeAlert();
            if(data.action=='request'){
                confirmCustomWithProfile(data,
                function(){$this.start(data)},
                function(){$this.reject(data.user_id)},
                $this.langParts.start_chat, siteLangParts.start, siteLangParts.decline);

            }else if(data.action=='reject'){
                alertCustom('',true,siteLangParts.invitation_declined, false, 'street_chat', siteLangParts.close_window);
            }else if(data.action=='start'){
                $this.toCity(data.url);
            }else{return false}
        }catch(e){return false}
    }

    this.reject = function(uid){
        closeAlert();
        $.post(url_server+'?cmd=city_street_chat_reject',{user_id:uid},function(res){
            if(checkDataAjax(res)){}
        })
    }

    this.start = function(data){
        closeAlert();
        if(!userAllowedFeature['3d_city']){
            redirectToUpgrade();
            return;
        }
        var uid=data.user_id;
        $.post(url_server+'?cmd=city_street_chat_start',{user_id:uid, data:data.data},function(res){
            var data=checkDataAjax(res);
            if(data){
                $this.toCity(data.url);
            }
        })
    }

    this.isLoadCity = function(){
        return typeof city == 'object' && city.isSceneLoaded;
    }

    this.toCity = function(url){
        closeAlert();
        //if (!$this.isLoadCity()) {
            redirectUrl(url);
        //}
    }

    $(function(){
    })

    return this;
}