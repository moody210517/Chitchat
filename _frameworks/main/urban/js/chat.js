var CChat = function(type, isAllowed) {

    var $this=this;

    this.dur=300;
    this.type=type;
    this.langParts = {};
	this.isAllowed = isAllowed*1;
    this.price = 0;
    this.isDemoUser = 0;

    this.invite = function(uid,name){
		if(!$this.isAllowed){
            window.location.href=url_main+'upgrade.php';
            return;
        }
        confirmHtmlClose();
        if(!$this.isDemoUser)alertLoaderHtml();
        $.post(url_server,{cmd:'chat_invite',type:$this.type,user_id:uid},function(res){
            var data=checkDataAjax(res);
            if(data){
                if(data=='demo_user') {
                    $this.startTalk(uid, 1);
                }else if (data===true) {
                    if($this.isDemoUser)alertLoaderHtml();
                    updateAlertLoaderHtml($this.langParts.please_wait_for,$this.langParts.invitation_sent);
                }else if (data=='upgrade') {
                    window.location.href=url_main+'upgrade.php';
                }else{
                    if($this.isDemoUser)alertLoaderHtml();
                    updateAlertLoaderHtml(data,$this.langParts.attention);
                }
            }else{
                if($this.isDemoUser)alertLoaderHtml();
                updateAlertLoaderHtml(siteLangParts.server_error_try_again,$this.langParts.attention);
            }
        });
    }

    this.request = function(data){
        try{
            confirmHtmlClose();
            if(data.action=='request'){
                var title=$this.langParts.chat_from_user.replace(/{name}/,data.user_name)
                                                        .replace(/{user_id}/,data.user_id);
                confirmHandler($this.langParts.chat_nowe,
                               function(){$this.talk(data)},
                               function(){$this.reject(data.user_id)},
                               title);
                $('.page_shadow_confirm').off('click');
            }else if(data.action=='reject'){
                alertCustom($this.langParts.refused,true,$this.langParts.attention);
            }else if(data.action=='start_talk'){
                var uid = data.user_id;
                var startTalkFlag=true;
                if($this.price>0){
                    confirmHtmlClose();
                    alertLoaderHtml();
                    $.post(url_server,{cmd:'chat_paid',type:$this.type},function(res){
                        var data=checkDataAjax(res);
                        if(data){
                            if (data>=0) {
                                $this.startTalk(uid);
                            }
                        }
                    });
                } else {
                    $this.startTalk(data.user_id);
                }

            }else{return false}
        }catch(e){return false}
    }

    this.reject = function(uid){
        confirmHtmlClose();
        $.post(url_server,{cmd:'chat_reject',type:$this.type,user_id:uid},function(res){
            if(checkDataAjax(res)){}
        });
    }

    this.talk = function(data){
        confirmHtmlClose();
        if(data.request_uri){
            window.location.href=url_main+'upgrade.php?request_uri='+data.request_uri;
            return;
        }
        var uid=data.user_id;
        $.post(url_server,{cmd:'chat_talk',type:$this.type,user_id:uid},function(res){
            if(checkDataAjax(res)){
                $this.startTalk(uid);
            }
        });
    }

    this.startTalk = function(uid,demo){
        confirmHtmlClose();
        var param='';
        if(demo){
            param='&demo=1';
        }
        window.location.href=url_main+$this.type+'chat.php?id='+uid+param;
    }

    /*this.removeVisibleAlert = function(){
        var pp=$('.pp_alert:visible');
        if(pp[0]){pp.hide().remove()}
    }*/

    $(function(){

    })

    return this;
}