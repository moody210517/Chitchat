var CCityStreetChat = function(isAllowed) {

    var $this=this;

    this.dur=300;
    this.langParts = {};
	this.isAllowed = isAllowed*1;
    this.isDemoUser = 0;

    this.invite = function(uid){
        if(!checkLoginStatus())return;
		if(!$this.isAllowed){
            redirectUrl(url_main+'upgrade.php');
            return;
        }
        confirmHtmlClose();
        if(!$this.isDemoUser)alertLoaderHtml();
        $.post(url_server+'?cmd=city_street_chat_invite',{user_id:uid},function(res){
            var data=checkDataAjax(res);
            if(data){
                if (data===true) {
                    if($this.isDemoUser)alertLoaderHtml();
                    updateAlertLoaderHtml($this.langParts.please_wait_for,$this.langParts.invitation_sent);
                }else if (data=='upgrade') {//you can remove
                    redirectUrl(url_main+'upgrade.php');
                }else{
                    if($this.isDemoUser)alertLoaderHtml();
                    updateAlertLoaderHtml(data,$this.langParts.attention);
                }
            }else{
                if($this.isDemoUser)alertLoaderHtml();
                updateAlertLoaderHtml(siteLangParts.server_error_try_again,$this.langParts.attention);
            }
        })
    }

    this.request = function(data){
        try{
            console.log('REQUEST STREET CHAT',data);
            confirmHtmlClose();
            if(data.action=='request'){
                var title=$this.langParts.chat_from_user.replace(/{name}/,data.user_name)
                                                        .replace(/{user_id}/,data.user_id);
                confirmHandler($this.langParts.chat_nowe,
                               function(){$this.start(data)},
                               function(){$this.reject(data.user_id)},
                               title);
                $('.page_shadow_confirm').off('click');
            }else if(data.action=='reject'){
                alertCustom($this.langParts.refused,true,$this.langParts.attention);
            }else if(data.action=='start'){
                $this.toCity(data.url);
            }else{return false}
        }catch(e){return false}
    }

    this.reject = function(uid){
        confirmHtmlClose();
        $.post(url_server+'?cmd=city_street_chat_reject',{user_id:uid},function(res){
            if(checkDataAjax(res)){}
        })
    }

    this.start = function(data){
        confirmHtmlClose();
        if(!$this.isAllowed){
            redirectUrl(url_main+'upgrade.php');
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
        confirmHtmlClose();
        //if (!$this.isLoadCity()) {
            redirectUrl(url);
        //}
    }

    $(function(){
    })

    return this;
}