var CChat = function(type) {

    var $this=this;

    this.dur=300;
    this.type=type;
    this.langParts = {};
    this.typeKey=type+'chat';
    this.price = 0;
    this.isDemoUser = 0;

    this.requestSend=false;
    this.invite = function(uid){
        if(!checkLoginStatus())return;
		if(!userAllowedFeature[$this.typeKey]){
            redirectToUpgrade();
            return;
        }
        $.post(url_server,{cmd:'chat_invite',type:$this.type,user_id:uid},function(res){
            var data=checkDataAjax(res);
            if(data){
                $('.pp_wrapper').click();
                if (data===true) {
                    $this.ppMenuExpand();
                    alertCustom(siteLangParts.please_wait_for, true, siteLangParts.invitation_sent,false,$this.type)
                }else if (data=='upgrade') {
                    redirectToUpgrade()
                }else{
                    $this.ppMenuExpand();
                    alertCustom(data, true, siteLangParts.attention)
                }
            }else{
                alertServerError();
            }
        })
    }

    this.request = function(data){
        try{
            if(data.action=='request'){
                confirmCustomWithProfile(data,
                function(){$this.talk(data)},
                function(){$this.reject(data.user_id)},
                $this.langParts.start_chat, siteLangParts.start, siteLangParts.decline);
            }else if(data.action=='reject'){
                alertCustom('', true, siteLangParts.invitation_declined, false, $this.type, siteLangParts.close_window);
            }else if(data.action=='start_talk'){
                var uid=data.user_id,url=data.url;
                if($this.price>0){
                    closeAlert();
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
        closeAlert();
        $.post(url_server,{cmd:'chat_reject',type:$this.type,user_id:uid},function(res){
            if(checkDataAjax(res)){}
        });
    }

    this.talk = function(data){
        closeAlert();
        if(data.request_uri){
            redirectToUpgrade('request_uri='+data.request_uri);
            return;
        }
        var uid=data.user_id;
        $.post(url_server,{cmd:'chat_talk',type:$this.type,user_id:uid},function(res){
            if(checkDataAjax(res)){
                $this.startTalk(uid);
            }
        })
    }

    this.startTalk = function(uid){
        closeAlert();
        redirectUrl(url_main+$this.type+'chat.php?id='+uid);
    }

    this.ppHeight=0;
    this.getHeightMenu = function(){
        if(!$this.ppHeight)$this.ppHeight=$this.$pp.find('.pp_media_chat').height()+25;
        return $this.ppHeight;
    }

    this.ppMenuExpand = function(h,$el){
        $el=$el||$this.$pp;
        h=h||0;
        $el.stop().animate({height:(h?$this.getHeightMenu():0)+'px'},300,function(){
            $el[h?'addClass':'removeClass']('open');
        })
    }

    this.menuOpen = function(){
        $this.closeMenuAll();
        clearTimeout($this.$pp.data('action'));
        $this.ppMenuExpand(!$this.$pp.is('.open'));
    }

    this.menuHover = function(e){
        var $targ=$(e.target);
        if($targ.closest('.'+$this.type+'_chat_menu')[0]){
            clearTimeout($this.$pp.data('action'));
        }
        if($targ.is('.pp_info')||$targ.closest('.pp_info')[0]){
            $this.$pp.addClass('open');
        }
    }

    this.menuClose = function(d){
        if(!$this.$pp[0])return;
        $this.$pp.data('action',setTimeout(function(){
            $this.$pp.is('.open')&&$this.ppMenuExpand();
        },d||1000))
    }

    this.closeMenuAll = function(){
        var sel=$this.type=='video'?'audio':'video',$pp=$jq('#pp_'+sel+'_chat');
        if($pp[0]){
            clearTimeout($pp.data('action'));
            $this.ppMenuExpand(false, $pp);
        }
        var $ppMenuMore=$jq('#profile_menu_more_options_items');
        if($ppMenuMore[0]){
            clearTimeout($ppMenuMore.data('action'));
            $this.ppMenuExpand(false, $ppMenuMore);
        }
    }

    $(function(){
        var cl='.'+$this.type+'_chat_menu';
        $this.$menuBtn=$jq(cl);
        $this.$pp=$jq('#pp_'+$this.type+'_chat');
        $this.ppConfirm=$jq('#pp_'+$this.type+'_chat_confirm');
        $this.$menuBtn.on('mouseleave',function(){$this.menuClose()})
             .on('mouseenter',$this.menuHover);
        $this.$menuBtn.find('span').click(function(){$this.menuOpen(); return false;});
        $this.$pp.find('.media_chat_cancel').click(function(){$this.ppMenuExpand(); return false;});
        $doc.on('click', function(e){
            var $el=$(e.target);
            if(!$el.is(cl)&&!$el.closest(cl)[0]){
                $this.menuClose(1);
            }
        });
    })

    return this;
}