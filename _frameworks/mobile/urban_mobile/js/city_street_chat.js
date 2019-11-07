var CCityStreetChat = function(isAllowed) {

    var $this=this;

    this.dur=300;
    this.langParts = {};
	this.isAllowed = isAllowed*1;
    this.isDemoUser = 0;

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

    this.invite = function(){
        if(!checkLoginStatus())return;
		if(!$this.isAllowed){
            window.location.href=url_main+'upgrade.php';
            return;
        }
        var uid=userTo;
        $this.showLoadrBtn();
        $.post(url_server+'?cmd=city_street_chat_invite',{user_id:uid},function(res){
            $this.hideLoadrBtn();
            var data=checkDataAjax(res);
            if(data){
                if (data===true) {
                    var msg=$this.langParts.invitation_sent+'<br>'+$this.langParts.please_wait_for;
                    setTimeout(function(){showAlert(msg,'.st-content','blue')},220);
                }else if (data=='upgrade') {//you can remove
                    window.location.href=url_main+'upgrade.php';
                }else{
                    setTimeout(function(){showAlert(data, 0, 0, 0, 1)},220);
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
                var fnTalk=function(){$this.start(data)},
                    fnReject=function(){$this.reject(data.user_id)};
                    title += '<br>' + $this.langParts.chat_nowe;
                setTimeout(function(){showConfirm(title, $this.langParts.ok, $this.langParts.cancel, fnTalk, 'blue', 0, fnReject)},220);
            }else if(data.action=='reject'){
                setTimeout(function(){showAlert($this.langParts.refused,0,'blue')},220)
            }else if(data.action=='start'){
                $this.toCity(data.url);
            }else{return false}
        }catch(e){return false}
    }

    this.reject = function(uid){
        hideConfirm();
        $.post(url_server+'?cmd=city_street_chat_reject',{user_id:uid},function(res){
            if(checkDataAjax(res)){}
        })
    }

    this.start = function(data){
        hideConfirm();
        if(!$this.isAllowed){
            window.location.href=url_main+'upgrade.php';
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
        hideConfirm();
        window.location.href=url;
    }

    $(function(){
        $this.$inviteBtn=$('#invite_streetchat');
    })

    return this;
}