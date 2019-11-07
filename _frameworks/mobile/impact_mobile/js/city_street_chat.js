var CCityStreetChat = function() {

    var $this=this;

    this.invite = function($link){
        if($link.find('.css_loader')[0])return;
        $link.addLoader();
        if(!userAllowedFeature['3d_city']){
            uploadPageUpgrade($link);
            return;
        }
        $.post(url_server+'?cmd=city_street_chat_invite',{user_id:requestUserId},function(res){
            var data=checkDataAjax(res);
            if(data){
                if(data=='upgrade') {
                    uploadPageMember([],urlPagesSite.upgrade);
                }else{
                    $link.removeLoader();
                    clProfile.toggleMoreMenu(true);
                    showAlert(data===true ? l('invitation_sent') : data);
                }
            }else{
                $link.removeLoader();
                serverError();
            }
        })
    }

    this.request = function(data){
        try{
            if(data.action=='request'){
                var fnTalk=function(){$this.start(data)},
                    fnReject=function(){$this.reject(data.user_id)};
                showConfirmUserPhoto(data,l('street_chat_from_user_impact_mobile'), fnTalk, fnReject);
            }else if(data.action=='reject'){
                showAlert(l('refused_street_chat'));
            }else if(data.action=='start'){
                redirectUrl(data.url);
            }else{return false}
        }catch(e){return false}
    }

    this.reject = function(uid){
        $.post(url_server+'?cmd=city_street_chat_reject',{user_id:uid},function(res){
            if(checkDataAjax(res)){}
        })
    }

    this.start = function(data){
        if(!userAllowedFeature['3d_city']){
            uploadPageMember([],urlPagesSite.upgrade);
            return;
        }
        $.post(url_server+'?cmd=city_street_chat_start',{user_id:data.user_id, data:data.data},function(res){
            var data=checkDataAjax(res);
            if(data){
                redirectUrl(data.url);
            }
        })
    }


    $(function(){

    })

    return this;
}