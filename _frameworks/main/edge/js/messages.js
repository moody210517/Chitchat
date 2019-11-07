var CMessages = function(guid, guidPhoto, imHistoryMessages) {

    var $this=this;

    this.guid = guid;
    this.guidPhoto = guidPhoto;
    this.imHistoryMessages = imHistoryMessages*1;
    this.$pp=[];
    this.userTo=0;
    this.lastEnteredMessage='';
    this.dur=300;
    this.isInitLoad=false;
    this.imH = 0;
    this.eventState = {}

    this.userCache = {};

    this.setData = function(data){
        for (var key in data) {
           $this[key] = data[key];
        }
    }

    this.isCityPage = function(){
        return typeof isPageCity != 'undefined' && isPageCity;
    }

    this.show = function(uid,$el){
        closeNavbarMenuCollapse(function(){
            $this.showPrepare(uid,$el);
        })
    }

    this.showPrepare = function(uid,$el){
        if(notPageLoad())return;
        uid=uid||0;
        $el=$el||[];
        if(!uid&&$el[0]&&$el.is('.disabled')){
            return;
        }
        //if($this.$pp.is('.animated'))return;
        if($this.$pp.is('.to_show')){
            $this.closePopup();
            return;
        }

        $this.$ppLoader=[];
        $this.$ppContentLoader=[];
        $this.clear();

        $this.$ppChat.append($this.$ppLoader=createLoader('pp_messages_loader',false));
        var $body=$('body');

        setPushStateHistory('im');
        $this.$pp.addClass('animated').one('hidden.bs.modal',function(){
            checkOpenModal();
            //$this.$pp.addClass('to_hide');
            //$this.clear();
            //$body.removeClass('message_open');
        }).one('hide.bs.modal',function(){
            //History windows
            $body.removeClass('message_open');
            $this.$pp.oneTransEndM(function(){
                $this.$pp.removeClass('to_show');
                $this.$pp.removeClass('animated');
                $this.clear();
            })
            if ($this.isCityPage()) {
                city.notResizeWindow = false;
                if (typeof cityInterface == 'object' && typeof cityInterface.resizeWindow == 'function') {
                    cityInterface.resizeWindow();
                }
            }
            $this.setGlobalMessagesCount();
        }).one('shown.bs.modal',function(){
            //console.log('shown.bs.modal');
        }).one('show.bs.modal',function(){
            $this.setHeightIm('');
            if(!isMobile()){
                var imH=$this.getHeightIm();
                $this.setHeightIm(imH);
            }
            if ($this.isCityPage()) {
                city.notResizeWindow = true;
            }
            $this.$pp.addClass('to_show');
            $body.addClass('message_open');
            $this.open(uid);
        }).oneTransEndM(function(){
            $this.$pp.removeClass('animated')
        }).removeClass('to_hide').modal('show');
    }

    this.open = function(uid){
        $this.actionOpenIm=false;
        $this.isSearchContact=false;
        $this.isShowOnlyOnline=false;
        //return;
        var data={user_id:uid,is_mode_fb:isFbModeTitle};
        var fnOpen=function(){
            debugLog('IM open', data);
            $ajax(url_ajax+'?cmd=pp_messages', data, fnSuccess, fnError);
        },
        fnSuccess=function(res){
            if(!$this.$pp.is('.to_show'))return;
            var data=checkDataAjax(res);
            if(data!==false){
                //if(!imH)$this.endResizeIm();
                //$this.imH=imH;
                var $data=$(data);
                $this.$ppSidepanel.html($data.filter('.sidepanel').html()).removeClass('empty');
                $this.$ppContent.html($data.filter('.content').html());
                var online=$.cookie('edge_im_show_only_online'),
                    fnHideLoader=function(){
                        $this.hideLoader($this.initControls);
                    };
                if(online && online=='true'){
                    setTimeout(function(){
                        $this.showOnlyOnline(true);
                        setTimeout(fnHideLoader,250)
                    },1)
                }else{
                    fnHideLoader();
                }
            }else{
                $this.closePopup();
                alertServerError();
            }
        },
        fnError=function(){
            if(!$this.$pp.is('.to_show'))return;
            fnOpen();
        };
        fnOpen();
    }

    this.clear = function(){
        $this.$ppLoader[0]&&$this.$ppLoader.remove();
        $this.$ppChatContent.removeClass('to_show');
        $this.$ppSidepanel.empty();
        $this.$ppContent.empty();
        $this.deleteDataChats();
    }

    this.closePopup = function(){
        if(!$jq('body').is('.message_open'))return;
        $this.isInitLoad=false;
        if(!backStateHistory()){
            $this.close();
        }
    }

    this.close = function(){
        $this.isInitLoad=false;
        $this.$pp.addClass('animated')
        $this.$ppSidepanel.addClass('empty');
        $this.$pp.modal('hide');
        $this.userTo=0;
        $.post(url_ajax,{cmd:'delete_empty_im'});

        return false;
    }

    this.hideLoader = function(call){
        $this.$ppLoader.oneTransEnd(function(){
            $(this).remove();
        }).delay(10).toggleClass('hidden',0);
        $this.$ppChatContent.delay(50).oneTransEnd(function(){
            if(typeof call=='function')call();
        }).toggleClass('to_show',0);
    }

    this.isVisible = function(){
        return ($this.isInitLoad && $this.$pp[0] && $this.$pp.is('.to_show') && !$this.$ppSidepanel.is('.empty')) ? true : false;
    }

    this.isOpened = function(){
        return $this.$pp[0] && $this.$pp.is('.to_show') ? true : false;
    }

    this.setUserCacheData = function(uid,data){
        users_list[uid]=data.online*1;
        if (!$this.userCache[uid]) {
            $this.userCache[uid]={};
        }
        for (var key in data) {
           $this.userCache[uid][key] = data[key];
        }
        $this.userCache[uid]['contact'] = $('#pp_message_user_'+uid);
        $this.userCache[uid]['preview_msg'] = $('#pp_message_user_preview_msg_'+uid);
    }

    this.initUserChat = function(uid){
        if (isMobile()) {
            var pl=$('#im_viewport_'+uid).scroll(function(){
                if(!$(this).scrollTop())$this.uploadingMsg(uid);

                //$('[data-tooltip-data="true"].init_data').tooltip('hide');
            });
        } else {
            var sb=$('#pp_message_list_message_'+uid).tinyscrollbar({wheelSpeed:30,thumbSize:45})
                    .on('move',function(){
                    if($this.userCache[uid]['pl'].contentPosition==0){
                        $this.uploadingMsg(uid)
                    }
            }),
            pl=sb.data('plugin_tinyscrollbar');
        }
        if (!$this.userCache[uid]) {
            $this.userCache[uid]={};
        }
        $this.userCache[uid]['pl']=pl;
        $this.userCache[uid]['trans'] = $('.im_trans_'+uid);
        $this.userCache[uid]['content'] = $('#pp_messages_user_title_info_'+uid+',#pp_message_list_message_'+uid);
        $this.userCache[uid]['list_msg'] = $('#im_overview_'+uid);
        $this.initUserChatListMsg(uid);
    }

    this.deleteDataOneChat = function(uid){
        delete $this.userCache[uid];
        delete users_list[uid];
    }

    this.deleteDataChats = function(){
        for (var uid in $this.userCache) {
            $this.deleteDataOneChat(uid);
        }
    }

    this.initUserChatListMsg = function(uid,posY){
        uid=uid||$this.userTo;
        if(!uid)return;
        $this.setAnimateUserChat(uid,true)
        $this.reInitToScroll($this.userCache[uid]['pl'],posY)
        setZeroTimeout(function(){
            $this.setAnimateUserChat(uid)
        })//10
    }

    this.setAnimateUserChat = function(uid, remove){
        if(!isMobile())$this.userCache[uid]['trans'][remove?'removeClass':'addClass']('animate')
    }

    this.ppMsgMaxH=0;
    this.initLoad = function(){
        debugLog('IM initLoad - ' + $this.userTo, $this.userCache);
        if($this.isVisChats()){
            $this.$ppMsg.val($this.lastEnteredMessage);
        }else{
            $this.lastEnteredMessage=0;
        }
        $this.$ppSearch.keydown(doOnEnter(function(){$this.searchContact()}));

        $this.ppMsgMaxH=parseInt($this.$ppMsg.css('maxHeight'), 10);
        $this.$ppMsg.autosize({isSetScrollHeight:false,callback:$this.prepareListMsg,callbackResize:$this.prepareListMsg}).keydown(doOnEnter($this.send))
        .on('input propertychange', function(){
            status_writing[$this.userTo] = parseInt(new Date()/1000);
            $this.lastEnteredMessage=trim(this.value);
        })/*.focus(function(){
            setTimeout(function(){scrollToEl($this.$ppMsg)},1000);
        });*/

        $this.$ppSend.click($this.send);
        //$this.initControls();
        $this.showSplashNoChats();
        $this.$ppUserMoreMenu.click(function(){
            if($this.isContentLoader())return;
            $this.prepareMoreMenu();
            if($this.$ppUserMoreMenuBl.is('.in')){
                $this.$ppUserMoreMenuBl.collapse('hide');
            }else{
                $this.$ppUserMoreMenuBl.collapse('show');
            }
        })
        if($this.userCache[$this.userTo]!==undefined && $this.userCache[$this.userTo].list_msg){
            $this.prepareMoreMenu();
        }
        $this.initTooltipData();
        $this.isInitLoad=true;

        $this.setGlobalMessagesCount();
    }

    this.setGlobalMessagesCount = function(){
        imMessagesCount=$('#message_notification_link').find('.count').data('counter')*1;
    }

    this.ppMsgH=0;
    this.prepareListMsg = function(ta,ta,posY){
        $this.ppMsgH=ta;
        var taD=ta;
        if(taD>$this.ppMsgMaxH)taD=$this.ppMsgMaxH;
        var h=$this.$ppUserChatContent.height()-(taD+$this.$ppUserChatInfo.height());
        $this.$ppListMsg.css({height:h+'px'});
        $this.$ppSend.css({height:ta+'px'});
        $this.initUserChatListMsg(0,posY);
    }

    this.showSplashNoChats = function(){
        if($this.isVisChats()){
            $this.$ppUserMenu.show();
            $this.$ppSplashNoChats.removeClass('to_show');
        } else {
            $this.$ppUserMenu.hide();
            $this.$ppSplashNoChats.addClass('to_show');
        }
    }

    this.sendMsgControlsDisabled = function(disabled){
        $this.$ppMsg.prop('disabled',disabled||false);
        $this.$ppSend.prop('disabled',disabled||false);
    }

    this.initControls = function(){
        var disabled=$this.isVisChats()?false:true;
        $this.sendMsgControlsDisabled(disabled);
        var $contactAll=$('.contact', $this.$ppListContact);
        if($contactAll[0]){
            $this.$ppSearch.prop('disabled',false);
            $this.$ppBtnOnline.prop('disabled',false);
            if (!$contactAll.filter(':visible')[0]) {
                if(!$this.isSearchContact){
                    $this.$ppSearch.prop('disabled',true);
                }
                if (!$this.isShowOnlyOnline) {
                    $this.$ppBtnOnline.prop('disabled',true);
                }
            }
        } else {
            $this.$ppSearch.prop('disabled',true);
            $this.$ppBtnOnline.prop('disabled',true);
        }
    }

    this.isSearchContact=false;
    this.searchContact = function(empty){
        if($this.actionOpenIm)return;
        empty=empty||0;
        var search=$this.getNameSearch(),$contact,$activeIm=[];

        if(!$this.isSearchContact && !search && !empty){
            return;
        }
        var clOnline=$this.getClOnline();
        if (!search||empty) {
            $this.isSearchContact=false;
            $('li', $this.$ppListContact).removeClass('search');
            $contact=$('li'+clOnline, $this.$ppListContact);
            $this.changeActiveFirstChat($contact);
            return;
        }
        $this.isSearchContact=true;
        $('.pp_message_name', $this.$ppListContact).each(function(){
            var $el=$(this),s=$this.isNameSearch(this),
                $contact=$el.closest('.contact');
            if(s){
                if(!$activeIm[0]){
                    $activeIm=$contact;
                    $this.changeActiveFirstChat($contact,true);
                }
                $contact.addClass('search');
                var isShow=true;
                if(clOnline&&!$contact.is(clOnline)){
                    isShow=false;
                }
                $contact[isShow?'show':'hide']();
            }else{
                $contact.removeClass('search').hide();
            }
            $this.initControls();
        })
        if (!$this.isVisChats()) {
            $this.hideUserContent();
        }
    }

    this.showOnlyOnline = function(online, notBtnActive){
        if($this.actionOpenIm)return;
        notBtnActive=notBtnActive||0;
        $this.isShowOnlyOnline=online;
        $.cookie('edge_im_show_only_online', online);
        var clSearch=$this.getClSearch(), $visible;

        if(!notBtnActive)$('#pp_messages_show_all, #pp_messages_show_online').toggleClass('active');
        if(online){
            $('.contact'+clSearch+':not(.online)', $this.$ppListContact).hide();
            $visible=$('.contact'+clSearch+'.online', $this.$ppListContact).show();
        }else{
            $visible=$('.contact'+clSearch, $this.$ppListContact).show();
        }
        console.log('%cIM: ShowOnlyOnline', 'background: #73afda', online);
        //console.log('ShowOnlyOnline', online, !notBtnActive);
        $this.changeActiveFirstChat($visible);
    }

    this.getClOnline = function(){
        return $this.isShowOnlyOnline?'.online ':'';
    }

    this.getClSearch = function(){
        return $this.isSearchContact?'.search':''
    }

    this.getNameSearch = function(){
        var name=trim($this.$ppSearch[0].value);
        $this.$ppSearch.val(name);
        return name.toLowerCase();
    }

    this.isNameSearch = function(el){
        return ~el.innerText.toLowerCase().indexOf($this.getNameSearch())
    }

    this.disabledActiveChat = function(){
        $('li.active', $this.$ppListContact).removeClass('active');
    }

    this.isVisChats = function(){
        return $this.getChats()[0];
    }

    this.getChats = function(){
        return $('.contact:visible', $this.$ppListContact);
    }

    this.getChatsFirst = function(){
        return $this.getChats().first()
    }

    this.setActiveFirstChat = function($firstIm){
        $this.disabledActiveChat();
        $firstIm.css('transition','none').addClass('first active');
        $firstIm.click();
        setTimeout(function(){$firstIm.removeAttr('style')},1);
    }

    this.changeActiveFirstChat = function($contact,noTrans){
        noTrans=noTrans||0;
        if(!$contact[0]){
            $this.hideUserContent();
            return;
        }
        var $active=$contact.filter('.active'),
            visActive=$active[0] && $active.is(':visible'),
            $activeIm=$active[0] ? $active : $contact.first();

        //console.log('ChangeActiveFirstChat',$active.is(':visible'));//,$active
        $this.disabledActiveChat();
        if(!visActive){
            $this.showContentLoader();
        }
        if(noTrans)$activeIm.css('transition','none');
        $this.changeIm($activeIm.addClass('first active').data('uid'));
        $contact.show();
        setZeroTimeout(function(){$activeIm.removeAttr('style')});
    }

    this.hideUserContent = function(call){
        $this.userTo=0;
        $this.$ppContentUser.oneTransEnd(function(){
            if(typeof call=='function')call()
        }).addClass('to_hide');
        $this.initControls();
    }

    this.showPic = function(url,uid){
        onLoadImgToShow(url,[],function(){
            $('.pp_message_profile_pic_'+uid+'.to_hide').removeClass('to_hide')
        })
    }

    this.showOriginalMessage = function($el){
        $el.hide().next('.original_message').show();
    }

    this.durMoveChat=300;
    this.moveImToFirst = function(uid,onlyMove){
        var $li=$this.userCache[uid]['contact'];
        if($li.is(':animated'))return;
        var $chatFirst=$('.contact', $this.$ppListContact);
        onlyMove=onlyMove||0;
        if($li[0]==$('.contact.active', $chatFirst)[0]||$li.is('.first')){
            $li.prependTo($this.$ppListContact).removeClass('first');
            return;
        }
        if($li[0]==$chatFirst[0]){
            if(!onlyMove){
                $this.disabledActiveChat();
                $li.addClass('active');
            }
            return;
        }
        if($this.$ppListContactBl[0].scrollTop){
            if(isVisiblePage){
                $this.$ppListContactBl.scrollTo(0, $this.dur*1.5, {axis:'y', queue:false, easing:'easeInOutCubic'});
            } else {
                $this.$ppListContactBl[0].scrollTop=0;
            }
        }
        var isHidden=$li.isHidden();
        if(onlyMove){
            console.log('%cIM: MoveImToFirst ONLYMOVE UPDATE SERVER', 'background: #73afda');
            //console.log('MoveImToFirst ONLYMOVE UPDATE SERVER');
            var $el=$this.$ppListContact, fnTo='prependTo';
            if ($chatFirst[0]) {
                if ($chatFirst[1]&&$li[0]==$chatFirst[1]) {
                    return;
                }
                $el=$chatFirst.eq(0);
                fnTo='insertAfter';
            }
            if(isHidden){
                console.log('%cIM: MoveImToFirst ONLYMOVE UPDATE SERVER HIDDEN', 'background: #73afda');
                $li[fnTo]($el);
            }else{
                console.log('%cIM: MoveImToFirst ONLYMOVE UPDATE SERVER VISIBLE', 'background: #73afda');
                $li.slideUp($this.durMoveChat, function(){
                    $li[fnTo]($el).slideDown($this.durMoveChat)
                })
            }
        }else{
            if(isHidden){
                console.log('%cIM: MoveImToFirst HIDDEN', 'background: #73afda');
                $this.disabledActiveChat();
                $li.show()
                $li.prependTo($this.$ppListContact);
                $li.addClass('active');
                $this.initControls();
            } else {
                console.log('%cIM: MoveImToFirst ACTIVE', 'background: #73afda');
                $li.slideUp($this.durMoveChat, function(){
                    $this.disabledActiveChat();
                    $li.prependTo($this.$ppListContact).addClass('active').slideDown($this.durMoveChat,$this.initControls)
                })
            }
        }
    }

    this.actionOpenIm=false;
    this.selUserTitleInfo='.pp_message_user_title_info';
    this.selUserListMsg='.pp_message_user_list_message';
    this.responseOpenIm = function(uid){
        $this.userTo=uid;
        $this.moveImToFirst(uid);
        $this.hideContentLoader();
        $($this.selUserTitleInfo,$this.$ppUserTitleInfo).hide();
        $($this.selUserListMsg,$this.$ppListMsg).hide();
        $this.sendMsgControlsDisabled();
    }

    this.showContentIm = function(uid){
        $this.$ppContentUser.oneTransEnd(function(){
            $this.actionOpenIm=false;
        }).removeClass('to_hide');
        $this.userCache[uid]['contact'].removeClass('first');
        setZeroTimeout($this.initControls);
        $this.prepareMoreMenu();
    }

    this.showContentLoader = function(){
        if (!$this.$ppContentLoader[0]) {
            $this.$ppContent.append($this.$ppContentLoader=createLoader('pp_messages_loader',false));//.addClass('box')
        } else {
            $this.$ppContentLoader.removeClass('hidden')
        }
        $this.sendMsgControlsDisabled(true);
    }

    this.hideContentLoader = function(){
        $this.$ppContentLoader[0]&&$this.$ppContentLoader.addClass('hidden');
    }

    this.isContentLoader = function(){
        return $this.$ppContentLoader[0]&&!$this.$ppContentLoader.is('.hidden');
    }

    this.openOneIm = function(uid){
        //console.log('OPEN NEW IM', uid);
        $.post(url_ajax+'?cmd=pp_messages',{user_id:uid,is_mode_fb:'true',upload_im:1,upload_im_new:1},function(res){
            if(!$this.isVisible())return;
            var data=checkDataAjax(res);
            if(data!==false){
                var $data=$(trim(data));
                var $contactAll=$('li.contact', $this.$ppListContact),
                    $contact=$data.filter('li.contact').hide(),
                    $userInfo=$data.filter($this.selUserTitleInfo).hide().prependTo($this.$ppUserTitleInfo),
                    $listMsg=$data.filter($this.selUserListMsg).hide().prependTo($this.$ppListMsg),
                    clOnilne=$this.getClOnline(),
                    clSearch=$this.getClSearch(),
                    isShow=true;
                if(clOnilne&&!$contact.is(clOnilne)){
                    isShow=false;
                }
                if(clSearch){
                    if($this.isNameSearch($('.pp_message_name', $contact)[0])){
                        $contact.addClass('search')
                    }else{
                        isShow=false;
                    }
                }
                debugLog('IM: openOneIm', $contact[0].id);
                if ($('#'+$contact[0].id)[0]) {
                    debugLog('IM: openOneIm No Open', $contact[0].id);
                    return;
                }
                if($contactAll[0]){
                    if(isShow){
                        if(!$contactAll.filter(':visible')[0]){
                            $this.changeActiveFirstChat($contact.insertBefore($contactAll.first()),true);
                        }else{
                            $contact.removeClass('active').insertBefore($contactAll.first()).aSlideDown({dur:$this.durMoveChat});
                        }
                    }else{
                        $contact.removeClass('active').insertBefore($contactAll.first())
                    }
                }else{
                    $this.userTo=uid;
                    $contact.prependTo($this.$ppListContact).aSlideDown({dur:dur,complete:$this.initControls});
                    if($this.$ppSplashNoChats.is('.to_show')){
                        var dur=400;
                        $this.$ppSplashNoChats.oneTransEnd(function(){
                            $this.$ppUserMenu.fadeIn(dur);
                            $userInfo.fadeIn(dur);
                            $listMsg.fadeIn(dur);
                        }).removeClass('to_show');
                    }else{
                        $this.$ppUserMenu.show();
                        $userInfo.show();
                        $listMsg.show();
                    }
                }

            }
        })
    }

    this.changeIm = function(uid){
        $this.$ppMsg.val('').trigger('autosize');
        $this.$ppListMsg.removeAttr('style');
        $this.$ppSend.removeAttr('style');
        if ($this.userCache[uid]['content']) {
            $.post(url_server+'?cmd=activate_im',{user_current:uid,is_mode_fb:isFbModeTitle},function(res){
                var data=checkDataAjax(res);
                if(data!==false){
                    clCounters.updateNewMsg(data);
                }
            });
            $this.responseOpenIm(uid);
            $this.userCache[uid]['content'].show();
            $this.userCache[uid]['list_msg'].find('.pp_message_msg_item.to_show').removeClass('to_show');
            $this.initUserChatListMsg(uid);
            $this.showContentIm(uid);
        } else {
            $.post(url_ajax+'?cmd=pp_messages',{user_id:uid,is_mode_fb:isFbModeTitle, upload_im:1},function(res){
                if(!$this.isVisible())return;
                var data=checkDataAjax(res);
                if(data!==false){
                    $this.removePreviewNewMsg(uid);
                    var $data=$(trim(data));
                    $data.filter('.update_script_chat').appendTo('#update_server');
                    $this.responseOpenIm(uid);
                    $data.filter($this.selUserTitleInfo).prependTo($this.$ppUserTitleInfo);
                    $data.filter($this.selUserListMsg).prependTo($this.$ppListMsg);
                    $this.showContentIm(uid);
                }else{
                    $this.$ppContentLoader.addClass('hidden');
                    $this.actionOpenIm=false;
                    $this.showContentIm(uid);
                    $this.sendMsgControlsDisabled();
                    alertServerError(true);
                }
            })
        }
    }

    this.openIm = function(uid){
        uid *=1;
        if (uid==$this.userTo||$this.actionOpenIm) return;
        $this.actionOpenIm=true;

        $this.showContentLoader();
        if ($this.$ppContentUser.is('.to_hide')) {
            $this.changeIm(uid);
        }else{
            $this.$ppContentUser.oneTransEnd(function(){
                $this.changeIm(uid)
            }).addClass('to_hide');
        }
    }

    this.reInitToScroll = function(pl,posY,call,noAnimate){
        posY=defaultFunctionParamValue(posY, 'bottom');
        noAnimate=noAnimate||false;
        if(posY===false)return;
        if(typeof call!='function')call=function(){};
        if(isMobile()) {
            if(posY=='relative')return;
            var t=600;
            if(posY=='bottom'){
                posY=noAnimate?pl[0].scrollHeight:'max';
            }
            if (noAnimate) {
                pl.stop();
                pl[0].scrollTop = posY;
                return;
            }
            pl.scrollTo(posY, t, {axis:'y', interrupt:true, easing:'easeOutExpo', onAfter:call});
        } else {
            /*if(posY=='bottom'&&((pl.contentSize-pl.trackSize)<=20)){
                posY=0;
            }*/
            pl.update(posY,call);
        }
    }

    this.getTemplateMsg = function(send, msg, msgOrig){
        //data-msg="{message_notif}"
        return  $('<div id="pp_message_msg_'+send+'" data-msg="'+(he(msgOrig))+'" data-send="'+send+'" data-id="0" data-to-user-id="'+$this.userTo+'" data-msg-user-id="'+$this.guid+'" class="pp_message_msg_item to_show replies">'+
                    '<button class="pp_message_profile_pic pp_message_profile_pic_'+$this.guid+'" onclick="redirectUrl('+urlPagesSite.profile_view+');" style="background-image: url('+urlFiles+$this.guidPhoto+')"></button>'+
                    '<div data-tooltip-data="true" title="'+l('just_now')+'" class="msg to_send"><span>'+msg+'</span>'+
                    '<div id="msg_read_" data-mid="" class="icon_check_msg to_hide"></div>'+
                    '</div>'+
                  '</div>');
    }

    this.prepareMsg = function(uid,$msg){
        var $list=$this.userCache[uid]['list_msg'],
            $lastMsg=$list.find('.pp_message_msg_item:not(.write)').last(),fn='appendTo',cont=$list;
        if($lastMsg[0]){
            if($lastMsg.data('msgUserId')==$msg.data('msgUserId')){
                if($msg.is('.write')){
                    $msg.find('.pp_message_profile_pic').hide();
                }else{
                    $msg.find('.pp_message_profile_pic').remove();
                }
            }
            cont=$lastMsg;
            fn='insertAfter';
        }
        var $lastMsgWr=$list.find('.pp_message_msg_item').last();
        if($lastMsgWr[0]&&$lastMsgWr.is('.write')){
            var is=$lastMsgWr.data('msgUserId')==$msg.data('msgUserId');
            $lastMsgWr.find('.pp_message_profile_pic')[is?'fadeOut':'fadeIn'](300);
            if (!$lastMsg[0]) {
                fn='insertBefore';
                cont=$lastMsgWr;
            }
        }
        return {msg:$msg, cont:cont, fn:fn};
    }

    /*this.showMsgOne = function($msg,t,call,notReInitScroll){
        var uid=$this.userTo;
        var data=$this.prepareMsg(uid,$msg);
        $msg = data.msg;
        notReInitScroll=notReInitScroll||0;
        $this.userCache[uid]['list_msg'].removeClass('animate');
        var scrollPl=$this.userCache[$this.userTo]['pl'];
        $msg.addClass('animate_sent').hide()[data.fn](data.cont)
            .slideDown({duration:t||250,
                        step:function(){
                            if(!notReInitScroll)$this.reInitToScroll(scrollPl)
                        },
                        complete:function(){
                            if(!notReInitScroll)$this.reInitToScroll(scrollPl)
                            if(typeof call=='function')call();
                            $msg.removeClass('animate_sent');
                            if(!$this.userCache[uid]['list_msg'].find('.animate_sent')[0]){
                               $this.userCache[uid]['list_msg'].addClass('animate');
                            }
                        }})
	}*/

    this.setNewMsg = function($msg,uid){
        var $prev=$this.userCache[uid]['preview_msg'].addClass('to_new');
        if ($this.userTo == uid) {
            $msg.addClass('to_new').delay(2000).removeClass('to_new',0);
            setTimeout(function(){
                $prev.is('.to_new')&&!$prev.is(':animated')&&$prev.removeClass('to_new');
            },2000)
        } else {
            $msg.addClass('to_new');
        }
    }

    this.removeNewMsg = function(uid){
        $this.userCache[uid]['preview_msg'].removeClass('to_new');
        $('.to_new',$this.userCache[uid]['list_msg']).removeClass('to_new');
    }

    this.removePreviewNewMsg = function(uid){
        $this.userCache[uid]['preview_msg'].removeClass('to_new');
    }

    this.showMsgBouncein = function($msg,fnTo,$cont,scrollToY,call,notReInitScroll,update){
        var uid=$msg.data('toUserId'), $listMsg=[], scrollPl=$this.userCache[uid]['pl'];
        notReInitScroll=notReInitScroll||0;
        $cont=$cont||$this.userCache[uid]['list_msg'];
        update=update||false;

        if (fnTo) {
            $listMsg=$this.userCache[uid]['list_msg'].removeClass('animate');
        } else {
            var data=$this.prepareMsg(uid,$msg);
            fnTo=data.fn;
            $cont=data.cont;
            $msg = data.msg;
        }

        if (($cont.is(':hidden')||$this.$ppContentUser.is('.to_hide'))
             &&!$cont.is('.pp_messages_upload_msg_loader')) {
            $msg.removeClass('to_show')[fnTo]($cont);
            if (update&&false) {
                if ($msg.is('.sent')) {
                    var $list=$this.userCache[uid]['list_msg'];
                    $this.setNewMsg($msg,uid);
                    $list.off('mouseover').one('mouseover',function(){
                        $this.removeNewMsg(uid);
                        $cont.removeClass('to_new');
                    });
                } else {
                    $this.removePreviewNewMsg(uid);
                }
            }
            if(typeof call=='function')call();
            return;
        }
        $msg.oneAnimationEnd(function(){
            $msg.removeAttr('style');
            if(typeof call=='function')call();
            if(!notReInitScroll){
                if(typeof scrollToY == 'function'){
                    scrollToY()
                } else {
                    $this.reInitToScroll(scrollPl,scrollToY);
                }
            }
            $listMsg[0]&&$listMsg.addClass('animate');
        })[fnTo]($cont);
        setTimeout(function(){
            if(!notReInitScroll){
                if(typeof scrollToY == 'function'){
                    scrollToY()
                } else {
                    $this.reInitToScroll(scrollPl,scrollToY);
                }
            }
            $this.initTooltipData($msg);
        },10);
    }

    this.send = function(){
        var msg=trim($this.$ppMsg.val());

		if(!msg){
            $this.$ppMsg.val('').trigger('autosize').focus();
            return false;
        }

        if($this.$ppNewMsgLink.is('.disabled'))$this.$ppNewMsgLink.removeClass('disabled');

        $this.lastEnteredMessage='';
        var msgHtml=strToHtml(msg),
            send= +new Date,
            $msg=$this.getTemplateMsg(send, msgHtml, strToHtml(msg, true)),
            $node=$msg.find('.msg > span');

        $this.$ppMsg.val('').trigger('autosize',function(){
            $this.showMsgBouncein($msg)
        }).focus();

        $this.updateMsgPreview($msg);

        msg=emojiToHtml(msg);

        $this.prepareMoreMenu();
        var uid=$this.userTo;
        debugLog('IM: SEND msg',[uid,msg],'#d0e8cd');

        var fnSend=function(retry){
            retry=retry||0;
            $.ajax({url:url_ajax+'?cmd=send_message',
                type:'POST',
                data:{user_to:uid,msg:msg,send:send,to_delete:0,retry:retry},
                timeout: globalTimeoutAjax,
                //cache: false,
                success: function(res){
                    if(!$this.isVisible())return;
                    var data=checkDataAjax(res);
                    if(data!==false){
                        if(data=='redirect'){
                            redirectUrl(data['url'])
                        }else{
                            data=$(trim(data));
                            if(!data[0]){
                                debugLog('IM: SEND msg ERROR NO DATA',data,'#d0e8cd');
                                return;
                            }
                            debugLog('IM: SEND msg RESPONSE',true,'#d0e8cd');
                            var $msgRes=data.find('.pp_message_msg_item'),
                                mid=$msgRes.data('id'),sendId=$msgRes.data('send');
                            //if(!$('#pp_message_msg_'+mid)[0]&&!$('#pp_message_msg_'+sendId)[0]){
                            $msg.attr({'id':'pp_message_msg_'+mid,'data-id':mid}).data('id',mid);
                            $msg.find('.icon_check_msg').data('mid', mid).attr({'id':'msg_read_'+mid,'data-mid':mid})
                            var txt=$msgRes.find('.msg > span').html();
                            if(txt!=$node.html()){
                                $node.html(txt);
                                if (!$msgRes.find('.smile, a')[0]) {
                                    $msg.data('msg', $msgRes.data('msg'));
                                }
                                $this.reInitToScroll($this.userCache[$this.userTo]['pl']);
                            }
                            $msg.find('.msg').removeClass('to_send');
                            //}
                        }
                    } else {
                        debugLog('IM: SEND msg error OR msg already sent',data,'#d0e8cd');
                        //$this.deleteMsg($msg, uid);
                    }
                },
                error: function(xhr, textStatus, errorThrown){
                    if(!$this.isVisible())return;
                    globalRetryAjaxTimeout(xhr, textStatus, errorThrown, function(){
                        debugLog('IM: retry send msg',true,'#d0e8cd');
                        fnSend(1);
                    })
                    //$this.deleteMsg($msg, uid);
                },
            })
        }
        fnSend();

		return false;
    }

    this.uploadingMsg = function(uid){
        if($this.userCache[uid]==undefined)return;

        var firstMid=$this.userCache[uid]['first_msg_id'];
        if(!firstMid||$this.userCache[uid]['ajax_upload_msg']||$('#pp_message_msg_'+firstMid)[0]) return;
        $this.userCache[uid]['ajax_upload_msg']=true;
        //console.log('UPLOAD MSG', uid);
        var $listBox=$this.userCache[uid]['list_msg'];
        if($this.userCache[uid]['loader']){
            $this.userCache[uid]['loader'].show();
        }else{
            $this.userCache[uid]['loader']=createLoader('pp_messages_upload_msg_loader',false).prependTo($listBox);
        }
        $this.reInitToScroll($this.userCache[uid]['pl'], 0);

        $this.userCache[uid]['limit_start']+=$this.imHistoryMessages;

        var url=url_ajax+'?cmd=uploading_msg',
        dataRes={user_id:uid, limit_start:$this.userCache[uid]['limit_start']},
        fnStopLoad=function(){
            if ($this.userTo!=uid) {
                $this.userCache[uid]['loader'].aSlideUp({dur:200});
                $this.userCache[uid]['ajax_upload_msg']=false;
                $this.userCache[uid]['limit_start']-=$this.imHistoryMessages;
                return true;
            }
            return false;
        },
        fnSuccess=function(res){
            var data=checkDataAjax(res);
            if(data!==false){
                if (fnStopLoad())return;
                var $data=$(trim(data)), $listMsg=$data.find('.pp_message_msg_item');
                if($('#pp_message_msg_'+firstMid,$listMsg)[0]||!$listMsg[0]){
                    $this.userCache[uid]['first_msg_id']=0;
                }
                var fnComplete=function(){
                    $this.showUploadingMsg(uid,$listMsg);
                },
                loaderParam={
                    step:function(){$this.reInitToScroll($this.userCache[uid]['pl'], 0)},
                    complete:fnComplete,
                    duration:300
                };
                $this.userCache[uid]['loader'].aSlideUp({complete:fnComplete,param:loaderParam});
            }else{
                fnStopLoad();
                alertServerError();
            }
        },
        fnError=function(){
            if(!fnStopLoad())fnLoad();
        },
        fnLoad=function(){
            debugLog('IM uploadingMsg', dataRes);
            $ajax(url, dataRes, fnSuccess, fnError);
        };
        fnLoad();

        /*$.post(url_ajax+'?cmd=uploading_msg',dataRes, function(res){

            var data=checkDataAjax(res);
            if(data!==false){
                if ($this.userTo==uid) {
                    $this.userCache[uid]['loader'].aSlideUp({dur:200});
                    $this.userCache[uid]['ajax_upload_msg']=false;
                    return;
                }
                //console.log(data);
                var $data=$(trim(data)), $listMsg=$data.find('.pp_message_msg_item');
                if($('#pp_message_msg_'+firstMid,$listMsg)[0]||!$listMsg[0]){
                    $this.userCache[uid]['first_msg_id']=0;
                }
                var fnComplete=function(){
                    $this.showUploadingMsg(uid,$listMsg);
                },
                loaderParam={
                    step:function(){$this.reInitToScroll($this.userCache[uid]['pl'], 0)},
                    complete:fnComplete,
                    duration:300
                };
                $this.userCache[uid]['loader'].aSlideUp({complete:fnComplete,param:loaderParam});
            }else{
                $this.userCache[uid]['loader'].aSlideUp({dur:200});
                alertServerError();
                $this.userCache[uid]['ajax_upload_msg']=false;
            }
        })*/
    }

    this.showUploadingMsg = function(uid,$listMsg){
        if(!$listMsg[0]){
            $this.userCache[uid]['ajax_upload_msg']=false;
            return;
        }
        var $listUser=$this.userCache[uid]['list_msg'],
            $msg, mid, t=1000, i=$listMsg.length-1, mUid, m=0,
            $firstMsg=$('.pp_message_msg_item:first',$this.userCache[uid]['list_msg']),
            $firstPhoto=$firstMsg.find('.pp_message_profile_pic'),
            $elH=[], posY,
            fnReintScroll=function(is){
                is=is||false;
                posY=$firstMsg.position().top;
                if(is&&$elH[0]){
                    $elH.each(function(){
                        posY=posY-$(this).outerHeight(true);
                    })
                }
                /*if (posY>=$this.userCache[uid]['pl'].contentSize-$this.userCache[uid]['pl'].viewportSize) {
                    posY='bottom';
                }*/
                //(pl,posY,call,noAnimate)
                $this.reInitToScroll($this.userCache[uid]['pl'], posY, false, !is);
            };

        $listUser.removeClass('animate');
        (function fu(){
            if(i<0){
                if ($listMsg[0]) {
                    $listMsg.insertAfter($this.userCache[uid]['loader']);
                    fnReintScroll();
                    setZeroTimeout(function(){
                        if (isMobile()) {
                            $this.userCache[uid]['ajax_upload_msg']=false;
                        } else {
                            $listUser.oneTransEnd(function(){
                                $listUser.toggleClass('animate_1 animate');
                                $this.userCache[uid]['ajax_upload_msg']=false;
                            },'top').addClass('animate_1');
                        }
                        fnReintScroll(true)
                        $this.initTooltipData($listMsg);
                    })
                } else {
                    fnReintScroll();
                    !isMobile() && $listUser.addClass('animate');
                    $this.userCache[uid]['ajax_upload_msg']=false;
                }
                return false;
            }

            $msg=$listMsg.eq(i);
            mUid=$msg.data('msgUserId');
            if($firstPhoto[0] && mUid==$firstMsg.data('msgUserId')){
                $firstPhoto.oneTransEnd(function(){
                    $(this).remove()
                },'opacity').css({opacity:0});
            }
            $firstPhoto=[];
            //$msg.addClass(mUid==$this.guid?'to_show_upload':'to_show_upload left');
            mid=$msg.data('id');
            if($('#pp_message_msg_'+mid,$this.$messagesBox)[0]){
                $msg.remove()
            } else {
                if(++m<4)$elH=m==1?$msg:$elH.add($msg);
            }
            i--; fu();
            /*if(!$('#pp_message_msg_'+mid,$this.$messagesBox)[0]){
                $msg.insertAfter($this.userCache[uid]['loader']);
                fnReintScroll();
                /*$this.showMsgBouncein($msg.css({animationDuration:(t*=.7)+'ms'}),
                                      'insertAfter',
                                      $this.userCache[uid]['loader'],
                                      fnReintScroll,
                                      function(){i--; fu();});*/
            /*} else{
                i--; fu();
            }*/
        })()
    }

    this.setLastId = function(mid){
        mid=mid*1;
        console.log('SET LAST ID', mid, (mid^0)!==mid, last_id>=mid);
        if((mid^0)!==mid||last_id>=mid)return;
        console.log('SET LAST ID :', mid);
        last_id=mid;
    }

    this.updateMsgPreviewToMoveFirst = function(uid,$msg){
        console.log('%cIM: updateMsgPreviewToMoveFirst', 'background: #73afda', $this.userTo, uid);
        $this.moveImToFirst(uid,true);
        if ($msg.is('.sent')) {//$this.userTo!=uid&&
            $this.setNewMsg($msg,uid);
        } else {
            $this.removePreviewNewMsg(uid);
        }
        $this.updateMsgPreview($msg);
    }

    /* Update preview msg */
    this.updateMsgPreview = function($msg){
        var data=$msg.data(),
            toUid=data['toUserId'];

        if(!$this.userCache[toUid])return;
        var mUid=data['msgUserId'],
            msg=strToHtml(data['msg'].toString(), true),
            //msg=$msg.find('.msg > span').html(),
            $preview=$this.userCache[toUid]['preview_msg'],
            $youMsg=$preview.find('.you_message'),
            isHidden=$preview.isHidden(),
            $cont;

        if ($preview.is(':empty')) {
            $preview.hide();
        }
        if($youMsg[0] && $this.guid==mUid){
            $cont=$youMsg;
        } else {
            $cont=$preview;
            if($this.guid==mUid){
                msg=l('you_message').replace(/{message}/, msg);
            }
        }
        if(isHidden){
            $cont.html(msg).removeClass('to_hide');
        }else{
            $cont.stop().fadeOut(200,function(){
                $cont.html(msg).stop().fadeIn(200);
            })
        }
        if($preview.is(':hidden')){
            $preview.aSlideDown({dur:250});
        }
    }
    /* Update preview msg */

    this.notifNewMsg = function(){
        debugLog('IM: Notif Sound',mobileAppLoaded && !getGUserOption('sound'),'#d0e8cd');
        if(mobileAppLoaded && !getGUserOption('sound'))return;
        playSound();
    }

    this.notifFromNoVisibilityPage = function(){
        if($this.isVisible())return;
        $this.notifNewMsg();
    }

    this.updateServer = function($data){
        debugLog('IM: server update',$data[0]?true:false,'#d0e8cd');
        if(!$data[0])return;

        var $listMsg=$data.find('.pp_message_msg_item'),
            fnUpdateScriptAfter=function(){
                $data.find('script.script_update_after').appendTo('#update_server');
            };

        $data.find('script.script_update_before').appendTo('#update_server');
        if(!$listMsg[0]){
            fnUpdateScriptAfter();
            return;
        }
        debugLog('IM: server update ITEMS',$listMsg[0].length*1,'#d0e8cd');
        var toUserId, msgUserId, d=225, j=0;
        (function fu(){
            var $item=$listMsg.eq(j);
            if(!$item[0]){
                fnUpdateScriptAfter();
                return;
            }

            toUserId=$item.data('toUserId');
            msgUserId=$item.data('msgUserId');

            $this.setLastId($item.data('id'));
            if(!$('#'+$item[0].id)[0] && !$('#pp_message_msg_'+$item.data('send'))[0]){
                if ($this.userCache[toUserId]) {
                    $this.updateMsgPreviewToMoveFirst(toUserId,$item);
                    if ($this.userCache[toUserId]['list_msg']){
                        var $wr=$this.userCache[toUserId]['list_msg'].find('.pp_message_msg_item.writing');
                        if($wr[0]){
                            $this.deleteMsg($wr, toUserId, function(){
                                $this.showMsgBouncein($item.addClass('to_show '),false,false,'bottom',function(){
                                    j++; fu();
                                },0,true)
                            })
                        } else{
                            $this.showMsgBouncein($item.addClass('to_show '),false,false,'bottom',function(){
                                j++; fu();
                            },0,true)
                        }
                    } else {
                        j++; fu();
                    }
                } else {
                    $this.openOneIm(toUserId);
                }
            }else{
                j++; fu();
            }
        })();
    }

    this.updateOnlineUsers = function(usersStatus){
        //console.log('ONLINE IM ONE',usersStatus);
        var l=Object.keys(usersStatus).length,i=1;
        for (var uid in usersStatus) {
            users_list[uid]=usersStatus[uid];
            $this.setOnlineUser(uid, usersStatus[uid]);
            if(l==i && $this.isShowOnlyOnline){
                $this.showOnlyOnline(true,true);
            }
            i++;
        }
    }

    this.setOnlineUser = function(uid, status){
        var $contact=$this.userCache[uid]['contact'];
        if(!$contact[0])return;
        $contact[status?'addClass':'removeClass']('online');
    }

    this.getReadMsgFromIm = function(){
        var getReadMsgFromIm={};
        for (var uid in $this.userCache) {
            if($this.userCache[uid]['list_msg']&&$this.userCache[uid]['list_msg'][0]
                &&$this.userCache[uid]['list_msg'].find('.icon_check_msg.to_hide')[0]){
                getReadMsgFromIm[uid]=1;
            }
        }
        return JSON.stringify(getReadMsgFromIm);
    }

    this.showReadMsg = function(list){
        //console.log('SET READ MSG:', list);
        for (var uid in list) {
            if($this.userCache[uid]&&$this.userCache[uid]['list_msg']&&$this.userCache[uid]['list_msg'][0]){
                var id=list[uid]*1;
                if($('#msg_read_'+id).is('.to_hide')){
                    $this.userCache[uid]['list_msg'].find('.icon_check_msg.to_hide').each(function(){
                        var $el=$(this);
                        if($el.data('mid')<=id)$el.removeClass('to_hide');
                    })
                }
            }
        }
    }

    this.prepareMoreMenu = function($msg){
        var uid=$this.userTo;
        $msg=defaultFunctionParamValue($msg,$('.pp_message_msg_item', $this.userCache[uid].list_msg));
        $this.$ppLinkClearChat[$msg[0]?'show':'hide']();
        if(!$this.$ppUserMoreMenuOneLink){
            $this.$ppUserMoreMenuLi[$msg[0]?'show':'hide']();
        }
    }

    this.confirmCloseChat = function(){
        $this.closeMoreMenu();
        confirmCustom(l('message_close_conversation'), function(){$this.clearChat(1)});
    }

    this.confirmClearChat = function(){
        $this.closeMoreMenu();
        confirmCustom(l('message_clear_conversation'), function(){$this.clearChat(0)});
    }

    this.clearChat = function(onlyCloseIm){
        var uid=$this.userTo,
            firstMid=$this.userCache[uid]['first_msg_id'];
        $this.userCache[uid]['first_msg_id']=0;
        onlyCloseIm=onlyCloseIm||0;

        $this.showContentLoader();
        $this.prepareMoreMenu(false);

        $.post(url_ajax+'?cmd=clear_history_messages',{user_id:uid,get_count_msg_all:1,only_close_im:onlyCloseIm},function(res){
            $this.hideContentLoader();
            $this.sendMsgControlsDisabled();
            var data=checkDataAjax(res);
            if(data!==false){
                clCounters.update(data);
                if(onlyCloseIm){
                    $this.blockUserResponse(uid);
                } else {
                    $this.userCache[uid]['list_msg'].html('');
                    var msg='';//l('you_message').replace(/{message}/, l('no_messages_yet'));
                    $this.userCache[uid]['preview_msg'].aSlideUp({dur:250,complete:function(){$(this).html(msg)}});
                }
            }else{
                alertServerError(true);
                $this.userCache[uid]['first_msg_id']=firstMid;
            }
        })
        return false;
    }

    this.closeMoreMenu = function(){
        if($this.$ppUserMoreMenuBl && $this.$ppUserMoreMenuBl.is('.in'))$this.$ppUserMoreMenuBl.collapse('hide');
    }

    this.confirmBlockUser = function(){
        $this.closeMoreMenu();
        confirmCustom(l('do_you_want_to_block_the_user'), function(){
            var uid=$this.userTo;
            $this.showContentLoader();
            clProfile.blockUser(false,uid,'block_visitor_user',function(){$this.blockUserResponse(uid)});
        });
    }

    this.blockUserResponse = function(uid){
        $this.hideContentLoader();
        var $contact=$this.userCache[uid]['contact'],
            $firstIm=$contact.next('.contact:visible');
        $contact.aSlideUp({dur:$this.durMoveChat, complete:function(){
            $contact.remove();
            $this.userCache[uid]['list_msg'].remove();
            $this.deleteDataOneChat();
            $this.initControls();
        }})
        if($firstIm[0]){
            $this.setActiveFirstChat($firstIm);
        }else{
            $this.$ppNewMsgLink.addClass('disabled');
            $this.hideUserContent($this.close);
        }
    }

    this.redirectToProfile = function(e,url){
        if($(e.target).closest('#pp_messages_contacts').width()<59)return;
        redirectUrl(url);
    }

    this.getOnlineUser = function(uid){
        var $contact=$this.userCache[uid]['contact'];
        if(!$contact[0])return false;
        return $contact.is('.online');
    }

    this.inviteVideoChat = function($link){
        clVideoChat.checkInvite($link.data('uid', $this.userTo), $this.getOnlineUser($this.userTo));
    }

    this.inviteAudioChat = function($link){
        clAudioChat.checkInvite($link.data('uid', $this.userTo), $this.getOnlineUser($this.userTo));
    }

    this.inviteStreetChat = function($link){
        clCityStreetChat.invite($link.data('uid', $this.userTo));
    }


    this.updateWritingUsers = function(writingUsers){
        debugLog('IM updateWritingUsers', writingUsers);
        for (var uid in writingUsers) {
            if(uid==$this.userTo){
                var $listMsg=$('#pp_message_list_message_'+uid),
                    $contact=$('#pp_message_user_'+uid);
                if ($listMsg[0] && $contact[0] && !$listMsg.find('.writing')[0]) {
                    var $html='<div id="pp_message_msg_writing_'+uid+'" data-id="pp_message_msg_writing_'+uid+'" data-to-user-id="'+uid+'" data-msg-user-id="'+uid+'" class="pp_message_msg_item sent writing">'+
                                    '<div class="msg">'+
                                        '<div class="load_dot">'+
                                            '<div class="line"></div>'+
                                            '<div class="line"></div>'+
                                            '<div class="line"></div>'+
                                        '</div>'+
                                   '</div>'+
                            '</div>';
                    $html=$($html).prepend($contact.find('button').clone().addClass('pp_message_profile_pic pp_message_profile_pic_'+uid));
                    $this.showMsgBouncein($html);
                }
                break;
            }
        }
    }

    this.deleteMsg = function($msg, uid, call){
        var $listMsg=$('#pp_message_list_message_'+uid).removeClass('animate');
        var scrollPl=$this.userCache[uid]['pl'];

        var $cont=$msg.addClass('animate_sent').css('bottom',0).find('.msg'),
            h=Math.round($cont.height()/2)+1;

        $msg.animate({
                        //marginBottom: '-'+(h*2+15)+'px'
                        height:'toggle',
                        opacity: .25,
                        marginBottom: '-15px'
                        },
                        {duration:$this.dur,
                        step:function(){
                            $this.reInitToScroll(scrollPl,'relative');
                        },
                        complete:function(){
                            $msg.remove();
                            $this.reInitToScroll(scrollPl,'relative');
                            if(typeof call=='function')call();
                            $msg.removeClass('animate_sent');
                            if(!$listMsg.find('.animate_sent')[0]){
                                $listMsg.addClass('animate');
                            }
                        }})
    }

    this.deleteWritingUsers = function(deleteWritingUsers){
        debugLog('IM deleteWritingUsers', deleteWritingUsers);
        for (var uid in deleteWritingUsers) {
            var $listMsg=$('#pp_message_list_message_'+uid),
                $wr=$listMsg.find('.pp_message_msg_item.writing');
            if($wr[0]){
                if(uid!=$this.userTo){
                    $wr.remove();
                } else {
                    $this.deleteMsg($wr, uid);
                }
            }
        }
    }

    this.initTooltipData = function($context){
        $context=$context||'#pp_message_list_message';
        $('[data-tooltip-data="true"]:not(.init_data)').each(function(){
            var $el=$(this).addClass('init_data');
            var placement='right';
            if($el.closest('.replies')[0]){
                placement='left';
            }
            if (isMobileSite) {
                /*$el.tooltip({trigger:'manual',placement:'top'})//,container:$el.closest('.viewport')
                .click(function(){
                    $el.tooltip('show');
                    clearTimeout($el.data('action'));
                    $el.data('action',setTimeout(function(){
                        $el.tooltip('hide');
                    },1000))
                })*/
            } else {
                $el.tooltip({viewport:'',container:'#pp_messages_chat_content',placement:placement,delay:{'show':500}})
                .click(function(){
                    $el.tooltip('hide')
                })
            }
        })
    }

    this.setHeightIm = function(height){
        if(height===0)return;
        $this.$ppChat.css({height:height,maxHeight:height});
    }

    this.endResizeIm = function(e){
        e&&e.preventDefault();
        $doc.off('mouseup touchend', $this.endResizeIm)
            .off('mousemove touchmove', $this.resizingIm);
        $.cookie('edge_height_im', $this.$ppChat.height());
    }

    this.resizingIm = function(e){
        if(!$this.$ppChat[0])return;
        var mouse={},height;
            mouse.x = (e.clientX || e.pageX || e.originalEvent.touches[0].clientX) + $win.scrollLeft();
            mouse.y = (e.clientY || e.pageY || e.originalEvent.touches[0].clientY) + $win.scrollTop();

        height = $this.eventState.container_height - $this.eventState.mouse_y + mouse.y;
        var hd=$this.getDHeight();
        if (height > 300 && height < hd) {
            $this.setHeightIm(height);
            $this.imH=height;
            $this.prepareListMsg($this.ppMsgH,$this.ppMsgH,'relative');
        }
    }

    this.saveEventState = function(e){
        if(!$this.$ppChat[0])return;
        $this.eventState.container_height = $this.$ppChat.height();
        $this.eventState.mouse_x = (e.clientX || e.pageX || e.originalEvent.touches[0].clientX) + $win.scrollLeft();
        $this.eventState.mouse_y = (e.clientY || e.pageY || e.originalEvent.touches[0].clientY) + $win.scrollTop();
        if(typeof e.originalEvent.touches !== 'undefined'){
            $this.eventState.touches = [];
            $.each(e.originalEvent.touches, function(i, ob){
                $this.eventState.touches[i] = {};
                $this.eventState.touches[i].clientX = 0+ob.clientX;
                $this.eventState.touches[i].clientY = 0+ob.clientY;
            });
        }
        $this.eventState.evnt = e;
    };

    this.getDHeight = function(){
        var hw=$win[0].innerHeight;
        return hw - 50 - .03*hw;
    }
    this.getHeightIm = function(){
        var height=$.cookie('edge_height_im')*1,
            hd=$this.getDHeight();
        if (height < 300 || height > hd) {
            height = hd;
        }
        return height;
    }

    $(function(){

        $this.$pp            = $jq('#pp_messages');
        $this.$ppChat        = $jq('#pp_messages_chat');
        $this.$ppChatContent = $jq('#pp_messages_chat_content');
        $this.$ppChatFoot    = $jq('#pp_messages_chat_foot');
        $this.$ppSidepanel   = $jq('#pp_messages_sidepanel');
        $this.$ppContent     = $jq('#pp_messages_content');
        $this.$ppNewMsgLink  = $('.new_message_link');

        $jq('body').on('click', function(e){
            var $targ=$(e.target);
            if($targ.is('.chat_wrap') || $targ.is('.navbar-default') || $targ.is('.navbar-header')){
                $this.closePopup();
            } else if($targ.is('.chat')||$targ.closest('.chat')[0]){
                if (!$targ.is('.more')&&!$targ.closest('.more')[0]) {
                    $this.closeMoreMenu();
                }
                return;
            }
        })

        //pp_message_user_list_message
        $('body').on('mouseover', '.pp_message_user_list_message', function(e){
            var $el=$(this),$target=$(e.target),
                uid=$el.data('uid');
            if($this.userCache[uid]
               &&$this.userCache[uid]['list_msg'][0]
               &&($('.to_new',$this.userCache[uid]['list_msg'])[0]
                    ||$this.userCache[uid]['preview_msg'].is('.to_new'))){
                $this.removeNewMsg(uid);
            }
        })

        $this.$ppChatFoot.on('touchstart mousedown', function(e){
            if($this.$ppChatFoot.is(':hidden'))return;
            e.preventDefault();
            e.stopPropagation();
            $this.saveEventState(e);
            $doc.on('mousemove touchmove', $this.resizingIm)
                .on('mouseup touchend', $this.endResizeIm);
        })


        /*$win.on('resize',function(){
            if($this.isVisible()&&$this.userTo){
                $('#pp_message_list_message, #pp_message_list_message .scrollbarY, #pp_message_list_message .scrollbarY .track').removeAttr('style');
                setTimeout(function(){
                    $this.reInitToScroll($this.userCache[$this.userTo]['pl']);
                },1)
            }
        })*/
    })

    return this;
}