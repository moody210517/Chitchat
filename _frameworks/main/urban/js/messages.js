var CMessages = function(guid, gname, request_user_id, url_tmpl_main, imHistoryMessages, notifLifetime, notifPosition) {

    var $this=this;

    this.guid = guid;
    this.gname = gname;
    this.requestUid = request_user_id;
    this.urlTmplMain = url_tmpl_main;
    this.imHistoryMessages = imHistoryMessages*1;
    this.notifLifetime = notifLifetime*1;
    this.notifPosition = notifPosition;
    this.userTo = 0;
    this.next_search = 0;
    this.number_blocked_users = 0;
    this.counter_all = 0;
    this.counter_msg = {};
    this.isOpenMessages = false;
    this.isEnter = false;
    this.langParts = {};
    this.url_ajax;
    this.url_main;
    this.url_tmpl_main;
    this.dur = 400;
    this.durShowNewIm = 250;
    this.isDeleteAction=false;
    this.userCache = {};
    this.messagesCache = {};

    this.setData = function(data){
        for (var key in data) {
           $this[key] = data[key];
           //console.log(key, $this[key]);
        }
    }

    this.imH;
    this.open = function(uid){
		if (paidAccesMode == 'access_paying' && !isCurUserSuperPowers) {
			alertCustom($this.langParts.to_update_profile,true,ALERT_HTML_ALERT);
			return;
		}
        $this.preloader.hide();
        var imH=getHeightIm();//$.cookie('height_im')*1;
        if (imH) $('#pp_message_update > .cont').css({height:imH+112});
        if (!$this.el) $this.el=$('#pp_message').modalPopup({
			css:{}, shCss: {visibility:'hidden'},
			wrCss:{zIndex:1000, transition:'opacity .23s linear', opacity:0, background: 'rgba(0,0,0,.3)', willChange: 'opacity'}
		});
        $('.message_tab', $this.el.open()).css({left:$('.show_messages').offset().left});
		$this.el.data('popup').stop().delay(20).css({opacity:1});
        $.post(url_ajax+'?cmd=pp_messages',{user_id:uid,is_mode_fb:isFbModeTitle},function(res){
            if ($this.isOpenMessages){
                var data=checkDataAjax(res);
                if(data!==false){
                    var $data=$('<div>'+data+'</div>');
                    if(imH)$data.find('.name_chat .dialog').height(imH);
                    $('.head>*', $data).appendTo('#pp_message .head').fadeTo(0,1);
                    $('.cont>*', $data).appendTo('#pp_message .cont').fadeTo(0,1);
					$('#pp_message .cont').delay(200).height('auto').delay(400).removeClass('preloader', 1);
                    //isVisibleMessages=true;
                    if(!imH)endResizeIm();
                    $this.imH=imH;
                }else{
                    alertCustom($this.langParts.server_error_try_again,true,ALERT_HTML_ALERT);
                    $('#pp_message_cont').html('');
                }
            }
        })
    }

    this.show = function(uid, isWall){
        if (!ajax_login_status) {
			window.location.href=url_main+urlPageLogin;
			return;
		}
        if (activePage == 'email_not_confirmed.php') {
            alertCustom($this.langParts.your_account_is_temporarily_blocked,true,ALERT_HTML_ALERT);
            return;
        }
        $this.hideAllNotifMsg();
        var fn=function(){
            $this.isOpenMessages=true;
            $this.open(uid);
        }
        var $tab=$('#pp_message_tab'),
            $wall=$('#wall_content'),
            d=500,top=$win.scrollTop();
        if((isWall||0) && $wall[0] && $wall.is(':visible')){
            $tab[top?'hide':'show']();
            fn();
            return;
        }
        $tab.show();
        if(top){
            if(top<200){d=250
            }else if(top<500){d=500
            }else{d=700}
            $('html, body').animate({scrollTop:0},d);
            setTimeout(fn,d);
        }else{fn()};
        //if (uid) {fn()}
        //else {$.scrollTo(0, 150, {onAfter: fn})}
        return false;
    }

    $(window).resize(function(){
        $('.message_tab', $this.el).css({left:$('.show_messages').offset().left});
    })

    this.setUserCacheData = function(uid,online,data){
        users_list[uid]=online*1;
        if (!$this.userCache[uid]) {
            $this.userCache[uid]={};
        }
        for (var key in data) {
           $this.userCache[uid][key] = data[key];
        }
    }

    this.setUserCache = function(uid, key, value) {
        if (!$this.userCache[uid]) {$this.userCache[uid]={}}
        $this.userCache[uid][key] = value;
    }

    this.userCacheRemove = function(uid){
        delete $this.userCache[uid];
        delete users_list[uid];
    }

    this.messagesCacheAdd = function(uid, mid) {
		if (!$this.messagesCache[uid]) {$this.messagesCache[uid]={}}
		if ($this.messagesCache[uid][mid]) return;
		$this.messagesCache[uid][mid] = mid;
	}

    this.messagesCacheRemoveByMid = function(uid, mid) {
		if (!this.messagesCache[uid][mid]) return;
		delete this.messagesCache[uid][mid];
	}

	this.messagesCacheRemoveByUid = function(uid) {
		delete $this.messagesCache[uid];
	}

    /* Prints a message+ */
    this.updateWritingUsers = function(writingUsers){
        for (var uid in writingUsers) {
            if(uid==$this.userTo){
                var $listMsg=$('#pp_message_list_message_'+uid);
                if (!$listMsg.find('.wr')[0]) {
                    var dirTmpl = dirTmplMain.substr(1, dirTmplMain.length-1),
                    img=$("<img style='margin-top:4px;' class='wr' src='" + dirTmpl + "images/is_writing.png'>");
                    $listMsg.find('.pp_message_msg_user_'+uid).last().find('.msg_check').after(img);
                    blink[uid]=setInterval(function(){img.animate({opacity: 'toggle'}, 600)}, 600);
                }
                break;
            }
        }
    }

    this.deleteWritingUsers = function(deleteWritingUsers){
        for (var uid in deleteWritingUsers) {
            $('#pp_message_list_message_'+uid).children('.pp_message_msg_user_'+uid)
            .find('.wr').fadeOut($this.dur, function(){
                clearInterval(blink[uid]);
                $(this).remove();
            });
        }
    }
    /* Prints a message+ */

    this.send_input = function(){
        status_writing[$this.userTo] = parseInt(new Date()/1000);
    }

    this.reset_send = function(e){
        if(isKeyPressed(e,13)==true&&$this.isEnter==true)$this.isEnter=false;
    }

    this.send = function(msg,uid,to_delete){//not used param!!!
        if (typeof msg!='string') msg=uid=0;
        var msg=msg||$.trim(pp_message_message.val()),
            uid=uid||$this.userTo,
            to_delete=to_delete||0;
        if(msg!==''||to_delete){
            $.post(url_ajax+'?cmd=send_message',{user_to:uid,msg:msg,to_delete:to_delete},
                function(res){
                    var data=checkDataAjax(res);
                    if(data!==false){
                        if(typeof data['redirect']!='undefined'){
                            window.location.href=data['url']
                        }else{
                            data=$($.trim(data));
                            data.filter('script').appendTo('#update_server');
                            var $msg=data.filter('.item');
                            if($msg[0]){
                                var mid=$msg.data('msgId'),
                                    $list=$('#pp_message_list_message_'+uid, pp_message);
                                if (!$('#pp_message_msg_'+mid)[0]&&$list[0]) {
                                    //$this.setLastId(mid);
                                    $msg.hide().appendTo($list).slideDown({step:function(){$list.scrollTop($list[0].scrollHeight)}});
                                }
                            }
                        }
                    }
            })
        };
		if (!to_delete) pp_message_message.val('').trigger('autosize').focus();
		return false;
    }

    this.checkExistenceMessages = function(existingMsg){//Not used - DISABLED
        var existingMsg = jQuery.parseJSON(existingMsg);
        for (var uid in $this.messagesCache) {
            for (var mid in $this.messagesCache[uid]) {
                if($.type(existingMsg[mid])!=='number'){
                    delete $this.messagesCache[uid][mid];
                    if(mid.indexOf('system')==-1){
                        $('#pp_message_msg_'+mid).slideUp($this.dur,function(){
                            $(this).remove();
                        })
                    }
                }
            }
        }
    }

    this.moveImToFirst = function(uid,d){
        var $im=$('#pp_im_open_user_'+uid);
        if(!$im||$im.index()==0)return;
        $im.oneTransEnd(function(){
            pp_message_im_list.animate({scrollTop:0},350)
            $im.prependTo('#pp_message_list_user_open_im').delay(d||50).removeClass('to_hide',0);
        }).addClass('to_hide',0);
    }

    this.setLastId = function(mid){
        mid=mid*1;
        if((mid^0)!==mid||last_id>=mid)return;
        last_id=mid;
        console.log('SET LAST ID', last_id);
    }

    this.show_message = function(user_id, msg_id, update, muid, isSpecialDelivery){//"update" can be removed
        var $userIm=$('[data-im-user-to-id = '+user_id+']'),
            list=$('#pp_message_list_message_'+user_id, pp_message),
            sel_msg='#pp_message_msg_'+msg_id;
        if(update*1)$this.setLastId(msg_id);//??? retry last_id

        isSpecialDelivery *=1;
        var fnMoveToFirst=function(){
            var isMy=muid==$this.guid;
            if(isMy||isSpecialDelivery){
                $this.moveImToFirst(user_id);
            }
        }
        if($userIm[0]&&!list[0]){
            $this.set_counter(user_id,1,1);
            fnMoveToFirst();
        }else if(!$userIm[0]&&!list[0]){
            if(user_id in users_list)return false;
            users_list[user_id]=1;
            $(sel_msg,'#update_server').remove();
            $.post(url_ajax+'?cmd=pp_messages',{user_id:user_id,user_current:$this.userTo,show_im:1,is_mode_fb:isFbModeTitle}, function(res){
                var data=checkDataAjax(res);
                if(data!==false){
                    var sUserIm='#pp_im_open_user_'+user_id,
                        sUserListMsg='#pp_message_list_message_'+user_id;
                    data=$(trim(data));
                    var $userIm=data.filter(sUserIm),
                        $userInfo=data.filter('#pp_message_user_to_pic_'+user_id+', #pp_message_user_to_info_'+user_id).hide(),
                        $userListMsg=data.filter(sUserListMsg).hide(),
                        $visIm=$('[id ^=pp_message_list_message_]:visible',pp_message),
                        fn=function(){
                            if(!$visIm[0]){
                                $this.set_im(user_id,true)
                            }else if(muid!=$this.guid){
                                $this.set_counter(user_id,$userListMsg.find('.item').length)
                            }
                        };
                    if(!$visIm[0]&&!$('#pp_message_user_to_info_'+user_id)[0]){
                        pp_message_action.before($userInfo).delay(800).fadeIn(400);
                    }
                    if(!$visIm[0]&&!$(sUserListMsg, pp_message)[0]) {
                        pp_message_frm.before($userListMsg);
                    }
                    if(!$(sUserIm, pp_message)[0]){
                        if(!$visIm[0]){
                            $userIm.find('.count_two').hide().text('0');
                            $userIm.find('.color').addClass('first_selected');
                            $('[data-im-user-to-id="'+$this.userTo+'"] > .color',pp_message_im_open).removeClass('first_selected');
                        }
                        $userIm.css({height:'46px',display:'none'})
                               [isSpecialDelivery?'prependTo':'appendTo']('#pp_message_list_user_open_im').slideDown($this.durShowNewIm,fn)
                    }
                    $('#pp_message_message').prop('disabled', false);
                }else{
                    delete users_list[user_id];
                }
            });
            return false;
        } else if(list[0]&&!list.children(sel_msg)[0]){
            var msg=$(sel_msg).hide(),title=msg.find('.tit').removeClass('blue green'),
                notMy=muid!=$this.guid;
            if(notMy){//"update*1" can be removed//update*1&&
                msg.css({background: 'rgba(256,256,0,0.3)', transition: 'background 1s'});
                list.mouseover(function hideNew(){
                    setTimeout("$('[id ^=pp_message_msg_]:visible').css('background', '')", 10);
                    $(this).off('mouseover', hideNew)
                });
                $this.set_counter(user_id,1,1);
            }
            title.addClass((notMy)?'green':'blue');//update*1&&
            msg.appendTo(list).stop().slideDown({step:function(){list.scrollTop(list[0].scrollHeight)}});
            fnMoveToFirst();
        } else {
            $(sel_msg,'#update_server').remove();
        }
    }

    this.showOriginalMessage = function(e){
        var el=$(e);
        el.parent().next('.pp_message_original_text').show('slow');
        el.hide();
    }

    // Data sets for the window
    this.dialog_scroll = function(user_id, dur){
        var dur=dur||1,user_id=user_id||$this.userTo;
        $('#pp_message_list_message_'+user_id).scrollTo('100%',dur);
    }

    this.dialogScroll = function(uid){
        var uid=uid||$this.userTo,
            list=$('#pp_message_list_message_'+uid);
        if(list[0])list.scrollTop(list[0].scrollHeight);
    }

    this.disabled_frm_post = function(){
        var dis, pp_body=pp_message.closest('.pp_body'), top=pp_body.scrollTop();
            pp_message_action=$('#pp_message_action');
        if($('[data-im-user-to-id]:visible')[0]&&$this.userTo!=$this.guid){
            pp_message_action.show();
            dis=false;
        }else{
            pp_message_action.hide();
            dis=true;
        }
        $('#pp_message_frm *').prop('disabled',dis);
		pp_message_message[dis?'blur':'focus']();
		pp_body.scrollTop(top);
    }

    this.durCounter=350;
    this.set_counter = function(user_id, delta_all, delta){
        var delta_all=delta_all||0,delta=delta||0,count,
            pp_message_count_all=$('#pp_message_count_all'),
            pp_count_msg=$('#pp_message_count_new_'+user_id),
            count_im=pp_count_msg.text()*1,
            count_all=pp_message_count_all.text()*1;
        if(user_id==$this.userTo){
            count=count_all-count_im;
            pp_count_msg.stop().fadeOut($this.durCounter,function(){$(this).text('0')});
        }else{
            count=count_all+delta_all*1;
            count_im=count_im+delta*1;
            pp_count_msg.text(count_im);
            if(count_im>0){
                if(!pp_count_msg.is(':visible')){
                    pp_count_msg.css('display','none').stop().fadeIn($this.durCounter);
                }
            }
        }
        $this.set_counter_all(count);
    }

    this.set_counter_all = function(count,isSound){
        var pageC=$('#messages_counter'),pageCv=$('#messages_counter_value'),
            pageCval=pageCv.text()*1,ppC=$('#pp_message_count_all'),isSound=isSound||false;
        count=count*1;
        if(count>0){
            if(isSound&&pageCval!=count){$this.playSound()}
            ppC.text(count);
            pageCv.text(count);
            pageC.stop().fadeIn($this.durCounter);
        }else{
            ppC.text('');
            pageC.stop().hide(1,function(){pageCv.text('')});
        }
    }

    this.hide_list_msg = function(is){
        $('.pp_message_user_info', pp_message).hide();
        pp_message_action.hide();
        if(is){$('#im_list_msg_empty', pp_message).show();}
        else{$('#im_list_msg_empty_info', pp_message).show()}
        $('#pp_message_frm *').prop('disabled',true).blur();
    }

    this.set_im = function(id, noFirstIm, isRemoveIm, moveToFirst){
        var uidPrev=$this.userTo;
        $ppMessageCont.removeClass('preloader', 1);
        isRemoveIm=isRemoveIm||false;
        $this.userTo=id;
        $this.next_search=0;
        $this.preloader.height(pp_message.height()).show();
        $ppMessageNameChat.addClass('show_loader');
        if (!(noFirstIm||0)){
            var sColor = '#pp_im_open_user_'+uidPrev+' > .color, #pp_im_open_user_'+id+' > .color';
            if (isRemoveIm) {
                sColor = '#pp_im_open_user_'+id+' > .color';
            }
            $(sColor).oneTransEnd(function(){
                if(moveToFirst&&$(this).closest('.pp_im_open_user')[0].id=='pp_im_open_user_'+id){
                    $this.moveImToFirst(id,1);
                }
            }).toggleClass('first_selected',0);
        }

        var $userInfoPrev;
        var $listMsg=$('#pp_message_list_message_'+$this.userTo),
            fnShowPart=function(){
                $this.set_counter(id);
                $userInfoPrev.css('display','none').removeClass('to_hide');
                isRemoveIm&&$this.user_im_remove(uidPrev);
                if($this.imH)$listMsg.height($this.imH);
                $listMsg.show(0,function(){
                    $listMsg.scrollTop($listMsg[0].scrollHeight-1);
                }).oneTransEnd(function(){
                    $ppMessageNameChat.removeClass('show_loader',1);
                    $this.preloader.hide();
                    $listMsg.css('opacity',1).removeClass('to_show');//.removeAttr('style');
                }).addClass('to_show');

                //return;
                $('#pp_message_user_to_pic_'+id+', #pp_message_user_to_info_'+id).css('opacity',0)
                .show().oneTransEnd(function(){
                    $(this).removeAttr('style').removeClass('to_show');
                }).addClass('to_show')

                $('#pp_message_action').show();
                $('#pp_message_frm').children('input').prop('disabled',false);
                $('#pp_message_message').focus();

                $.post(url_server+'?cmd=activate_im',{user_current:id,is_mode_fb:isFbModeTitle});

                $this.isVisibleActionBlock();
                $this.disabled_frm_post();
            };

        if ($listMsg[0]) {
            $listMsg.css('opacity',0);
            $userInfoPrev=$('.pp_message_user_info:visible', pp_message);
            if($userInfoPrev.eq(2)[0]){
                $userInfoPrev.eq(2).oneTransEnd(fnShowPart);
            }else if($userInfoPrev.eq(0)[0]){
                $userInfoPrev.eq(0).oneTransEnd(fnShowPart);
            }else{
                fnShowPart();
            }
            $userInfoPrev.addClass('to_hide');
        } else {
            $userInfoPrev=$('.pp_message_user_info:visible', pp_message).addClass('to_hide');
            $.post(url_ajax+'?cmd=pp_messages',{user_id:id,is_mode_fb:isFbModeTitle, upload_im:1},function(res){
                if(!$this.isOpenMessages)return;
                var data=checkDataAjax(res);
                if(data!==false){
                    var $data=$(trim(data));
                    if($this.imH)$data.find('.name_chat .dialog').height($this.imH);
                    $('#pp_message_user_to_pic_'+id+', #pp_message_user_to_info_'+id, $data)
                    .hide().prependTo(pp_message_chat_info);
                    $listMsg=$('#pp_message_list_message_'+id, $data).css('opacity',0).hide().insertAfter(pp_message_chat_info);
                    setTimeout(function(){
                        $this.search();
                        fnShowPart()
                    },100);
                }else{
                    !isRemoveIm&&$this.set_im(uidPrev)
                    alertCustom($this.langParts.server_error_try_again,true,ALERT_HTML_ALERT);
                }
            })
        }
    }

    this.user_im_remove = function(user_id){
        setTimeout(function(){
            $('[data-im-user-to-id="'+user_id+'"]').remove();
            $('#pp_message_user_to_info_'+user_id).remove();
            $('#pp_message_user_to_pic_'+user_id).remove();
            $('#pp_message_list_message_'+user_id).remove();
            $this.messagesCacheRemoveByUid(user_id);
            $this.userCacheRemove(user_id);
        },10);
    }

    /* DELETE */
    this.select_open = function(){
        if($('[data-im-user-to-id]:visible',pp_message_im_open)[0]){
            $this.isDeleteAction=true;
            //pp_message_im_list.animate({scrollTop:0}, 200);
			$('.pp_message .name').css('bottom', 0);
            $('.pp_message .name .frm_search_name').addClass('hidden');
            $('.pp_message .name .radio, #pp_message_delete_im').removeClass('hidden');
        }
    }

    this.select_all = function(){
        pp_message_im_open.find('.niceRadio > a').addClass('checked');
        $('.delete_im',pp_message_im_open).prop('checked', true);
        $this.set_count_delete();
    }

    this.select_none = function(){
        pp_message_im_open.find('.niceRadio > a').removeClass('checked');
        $('.delete_im',pp_message_im_open).prop('checked', false);
        $this.frm_delete_hide();
        $this.isDeleteAction=false;
    }

    this.set_count_delete = function(){
        var count=$('.delete_im:checked',pp_message_im_open).length,
            title=$this.langParts.delete_counter,dis=true;
        if(count>0){
            dis=false;
            title=$this.langParts.delete_counter+' ('+count+')';
        }
        pp_message_delete_im_btn.prop('disabled',dis).val(title);
    }

    this.frm_delete_hide = function(){
		//pp_message_im_list.animate({scrollTop:0}, 200);
		$('.pp_message .name .frm_search_name').removeClass('hidden');
		$('.pp_message .name .radio, #pp_message_delete_im').addClass('hidden');
        pp_message_delete_im_btn.val($this.langParts.delete_counter);
        $('.delete_im',pp_message_im_open).prop('checked', false);
        $this.set_count_delete();
    }

    this.confirmDeleteSelectedIm = function(){
        alertHtmlArea = '.column_main';
        confirmCustom($this.langParts.clear_conversation, $this.deleteSelectedIm);
    }

    this.deleteSelectedIm = function(){
        confirmHtmlClose();
        var delete_im={},replace=0,
            deleteIm=$('.delete_im:checked',pp_message_im_open).closest('.item');
        deleteIm.each(function(){
            delete_im[$(this).data('imUserToId')]=1;
        });
        replace=$('.delete_im:not(:checked)',pp_message_im_open).closest('.item').eq(0).data('imUserToId');
        pp_message_delete_im_btn.prop('disabled',true);
        $.post(url_ajax,{cmd:'delete_users_im',delete_im:delete_im},
            function(res){
                $this.isDeleteAction=false;
                pp_message_delete_im_btn.prop('disabled',false);
                if(checkDataAjax(res)!==false){
                    for (var uid in delete_im) {
                        $this.messagesCacheRemoveByUid(uid);
                    }
                    var t=200,i=0;
                    (function fu(){
                        var item=deleteIm.eq(i),id=item.data('imUserToId');
                        item.slideUp(t*=.9, function(){
                            if(id==$this.userTo){
                                if(replace){
                                    if($('[data-im-user-to-id="'+replace+'"]:visible', pp_message_im_open)[0]){
                                        $this.set_im(replace,false,true)
                                    }else{
                                        $('[data-im-user-to-id="'+replace+'"] > .color', pp_message_im_open).toggleClass('first_selected');
                                        $this.userTo=replace;
                                        $this.hide_list_msg(true);
                                    }
                                }else{$this.hide_list_msg(false)}
                            }else{
                                $this.user_im_remove(id);
                            }
                            delete delete_im[id];
                            $this.userCacheRemove(id);
                            //delete users_list[id];
                            i++; fu();
                        })
                    })()
                    $this.frm_delete_hide();
                    pp_message_im_list.scrollTop(0);
                }
        });
    }
    /* DELETE */

    /* Online status users+ */
    this.getOneUserOnline = function(userId){
        for (var uid in users_list) {
            if (uid != userId && users_list[uid]) {
                return uid;
            }
        }
        return 0;
    }

    this.updateOnlineUsers = function(usersStatus){
        for (var uid in usersStatus) {
            users_list[uid]=usersStatus[uid];
            $this.setOnlineUser(uid, usersStatus[uid]);
        }
    }

    this.setOnlineUser = function(uid, status){
        $('#pp_im_open_user_online_'+uid).toggleClass('online offline');
        var isModeStatus=$('[data-im-status].btn_msg.active',pp_message).data('imStatus');
        if(!isModeStatus){
            var user=$('#pp_im_open_user_'+uid),uidOnline=$this.getOneUserOnline(uid);
            if(status){
                user.slideDown(250);
                if(!uidOnline){$this.set_im(uid)}
            }else{
                user.slideUp(250,function(){
                    if(uidOnline){
                        $this.set_im(uidOnline)
                    }else{
                        $this.hide_list_msg(true)
                    }
                })
            }
        }
    }
    /* Online status users+ */

    /* ON LINE */
    this.statusViewIm=1;
    this.status_display = function(status){
        if($('#status_view_im_'+status).is('.active'))return;
        $this.statusViewImt=status;
        var is=true,node=$.trim(pp_message_search_inp.val()),
            fn=function(el){
                var onLine=$('.online', pp_message_im_open).closest('.item'),
                    idCur=onLine.data('imUserToId'),msgCur,id=el.data('imUserToId');
                if(node){
                    onLine.each(function(){
                        idCur=$(this).data('imUserToId'),
                        msgCur=$('#pp_message_list_message_'+idCur, pp_message).find('.backlight');
                        if(msgCur[0]){return false}else{idCur=0}
                    });
                }
                if(status&&!onLine[0]){
                    $this.set_im(id,($this.userTo==id));//,true
                    is=false;
                }else if(!status){
                    //var id=el.data('imUserToId');
                    if($('#pp_message_user_to_info_'+id+':visible')[0]){
                        //var id=onLine.data('imUserToId');
                        if(idCur&&onLine[0]&&idCur!=$this.userTo){$this.set_im(idCur)}
                        else{$this.hide_list_msg(true)}
                        is=false;
                    }
                }
            };
        var t=250,i=0,offLine=$('.offline', pp_message_im_open).closest('.item'),
            isSearch=true,node=$.trim(pp_message_search_inp.val());
        (function fu(){
            var item=offLine.eq(i);
            if(item[0]){
                if(status){
                    if(node){
                        var msg=$('#pp_message_list_message_'+item.data('imUserToId'), pp_message).find('.backlight');
                        isSearch=(msg[0])?true:false;
                    }
                    if(isSearch){item.slideDown(t*=.9, function(){if(is)fn(item); i++; fu();})}
                    else{i++; fu();}
                }else{
                    item.slideUp(t*=.9, function(){if(is)fn(item); i++; fu();})
                }
            }
        })()

        $('#pp_message_list_user').scrollTop(0);
        $ppMessageStatusViewIm.addClass('fast').removeClass('active').delay(190).removeClass('fast', 1);
        $('#status_view_im_'+status).addClass('active');
    }
    /* ON LINE */

    /* SOUND */
    this.setOptionSound = function(){
        $.post(url_ajax,{cmd:'set_im_sound'},
            function(res){
                if(checkDataAjax(res)!==false)
                    $('#pp_message_sound').toggleClass('off changing').delay(1).removeClass('changing', 1);
        });
    }

    this.playSound = function(){
        playSound();
        /*soundManager.setup({url: $this.url_main+'_server/js/sound/',
                    onready: function() {
                              var mySound = soundManager.createSound({
                                  id: 'aSound',
                                  url: $this.url_main+'_server/im_new/sounds/pop_sound_chat.mp3'
                              });
                              mySound.play();
                    }
        });*/
    }
    /* SOUND */

    /* ACTION */
    this.confirmblockUser = function(){
        $this.showActionBlock(1);
        alertHtmlArea = '.column_main';
        confirmCustom(ALERT_HTML_ARE_YOU_SURE, $this.blockUser);
    }

    this.blockUser = function(){
        confirmHtmlClose();
        var uid=$this.userTo;
        $.post(url_ajax,{cmd:'block_user',user_id:uid},function(res){
            if(checkDataAjax(res)!==false){
                if($this.requestUid==uid){
                    alertCustomRedirect(url_main+'search_results.php',$this.langParts.user_has_been_blocked,ALERT_HTML_SUCCESS)
                }
                $this.number_blocked_users++;
                $('#narrow_blocked_count').text($this.number_blocked_users);//user_block_list_count
                var userInfo=$('#pp_im_open_user_'+uid, pp_message_im_open),
                    setUser=$('.pp_im_open_user:visible:not([id=pp_im_open_user_'+uid+'])', pp_message_im_open).first();
                userInfo.slideUp($this.durShowNewIm*.8,function(){
                    if(!setUser[0]){
                        setUser=$('.pp_im_open_user:not([id=pp_im_open_user_'+uid+'])', pp_message_im_open).first();
                        if(setUser[0]){
                            $this.userTo=setUser.data('imUserToId');
                            $('#pp_im_open_user_'+$this.userTo+' > .color', pp_message_im_open).toggleClass('first_selected');
                        }
                        $this.hide_list_msg(setUser[0]);
                        $this.user_im_remove(uid);
                    }
                })
                if(setUser[0]){
                    setTimeout(function(){$this.set_im(setUser.data('imUserToId'),false,true)},100)
                }
            }
        })
        return false;
    }

    this.videoChatInvite = function(){
        var nameTo=$("#pp_message_user_to_info_"+$this.userTo+" .title a").text();
        videoChatInvite($this.userTo,nameTo);
    }

    this.audioChatInvite = function(){
        var nameTo=$("#pp_message_user_to_info_"+$this.userTo+" .title a").text();
        audioChatInvite($this.userTo,nameTo);
    }

    this.streetChatInvite = function(){
        cityStreetChat.invite($this.userTo);
    }

    this.clearHistoryMessages = function(){
        confirmHtmlClose();
        var uid=$this.userTo,firstMid=$this.userCache[uid]['first_msg_id'];
        $this.userCache[uid]['first_msg_id']=0;
        $.post(url_ajax,{cmd:'clear_history_messages',user_id:uid},function(res){
            if(checkDataAjax(res)!==false){
                $this.messagesCacheRemoveByUid(uid);
                $('#pp_message_list_message_'+uid).html('');
            }else{
                $this.userCache[uid]['first_msg_id']=firstMid;
                //Error
            }
        })
        return false;
    }

    this.confirmClearHistoryMessages = function(){
        $this.showActionBlock(1);
        alertHtmlArea = '.column_main';
        confirmCustom(ALERT_HTML_ARE_YOU_SURE, $this.clearHistoryMessages);
    }

    this.showActionBlock = function(dur) {
        var dur=dur||300;
        if (!$('#pp_message_action_item:visible')[0]){
            if($('#pp_message_list_message_'+$this.userTo).find('.item')[0]){
                pp_message_action_clear.show();
                pp_message_action_block.removeClass('arrow');
            }else{
                pp_message_action_clear.hide();
                pp_message_action_block.addClass('arrow');
            }
        }
        var w=$('#pp_message_action_item').width();
        pp_message_action_item.css({left:'-'+(w+12)+'px'}).stop().animate({height:'toggle'},dur);
    }

    this.isVisibleActionBlock = function() {
        if ($('#pp_message_action_item:visible')[0]){
            $this.showActionBlock(1)
        }
    }

    /* ACTION */

    /* SEARCH */
    this.search_up = function(e){
        if(isKeyPressed(e,13)){
            $this.search_scroll();
            return false;
        }else{$this.search()}
    }

    this.search = function(){
        $this.next_search=0;
        var search_im={},
            node=$.trim(pp_message_search_inp.val()),
            search_area=$('.pp_message_node, .gift_msg_decor_txt', pp_message);
        search_area.unhighlight({className:'backlight'});
        if(node){
            search_area.highlight(node,{className: 'backlight'});
        };
        return;
        /*var t=250,i=0,list=$('[id ^= pp_message_list_message_]', pp_message),isCurOnline=false;
        (function fu(){
            var item=list.eq(i),id=item.data('imListMsg'),
                im=$('[data-im-user-to-id="'+id+'"]', pp_message_im_open),
                isModeStatus=$('[data-im-status].btn_msg.active',pp_message).data('imStatus'),
                is=(isModeStatus||(!isModeStatus&&im.find('.online').length));

            if((item.find('.backlight')[0]||!node)&&is){
                var curOnline=$('[data-im-user-to-id="'+$this.userTo+'"]', pp_message_im_open).find('.online'),
                    setVisisble=!curOnline[0]&&!isCurOnline&&!isModeStatus;
                if(setVisisble){
                    $('[data-im-user-to-id="'+$this.userTo+'"] > .color', pp_message_im_open).removeClass('first_selected');
                    im.find('.color').addClass('first_selected');
                }
                im.slideDown(t*=.9, function(){
                    i++; fu();
                    if((id==$this.userTo&&!$('[id = pp_message_list_message_'+id+']:visible', pp_message)[0])
                        ||setVisisble){
                        $this.set_im(id,true);
                        isCurOnline=true;
                    }
                })
            }else{
                im.slideUp(t*=.9, function(){
                    i++; fu();
                    if(id==$this.userTo){
                        var set=$('[id != pp_message_list_message_'+id+']', pp_message).find('.backlight').eq(0),
                            setId=set.closest('.dialog').data('imListMsg'),
                            isSet=(isModeStatus||(!isModeStatus&&$('[data-im-user-to-id="'+setId+'"]', pp_message_im_open).find('.online').length));
                        if(setId&&isSet){$this.set_im(setId)}//&&is
                        else{$this.hide_list_msg(true)}
                    }

                })
            }
        })()
        setTimeout('pp_message_search_inp.focus();',400);*/
    }

    this.search_scroll = function(){
        var list=$('[id ^= pp_message_list_message_]:visible', pp_message),
            backlight=list.find('.backlight');
        if(backlight[$this.next_search]){
            list.scrollTo(backlight[$this.next_search]);
            $this.next_search++;
        }else if(backlight[0]){
            $this.next_search=1;
            list.scrollTo(backlight[0]);
        }else{
            $this.next_search=0;
        }
    }
    /* SEARCH */

    this.is_read_msg = function(mid){
        var $mark=$('#pp_message_msg_check_'+mid+':hidden');
        if ($mark[0]) {
            $('.msg_check[data-msg-uid='+$this.guid+']:hidden', $mark.closest('.list_msg_with_user')).each(function(){
                var id=$(this).data('mid');
                if(id<=mid)$('#pp_message_msg_check_'+id).fadeIn($this.dur);
            })
        }
    }

    this.replaceMsgPhotoGrantAccess = function(el,msg){
        el.slideUp($this.dur,function(){
            var l='<a href="./search_results.php?display=profile&uid='+$this.guid+'">'+$this.gname+'</a>';
            el.find('.tit').toggleClass('green blue').children('a').html(l);
            el.find('.pp_message_node').html(msg);
            var list=$('#pp_message_list_message_'+$this.userTo);
            el.slideDown({step:function(){list.scrollTop(list[0].scrollHeight)},duration:$this.dur});
        });
    }

    this.wait = 4000;
    //function ready(uid){if ($this.userCache[uid]['ajax_more_msg']) {clearTimeout($this.userCache[uid]['ajax_more_msg']); $this.userCache[uid]['ajax_more_msg']=0}};
    this.uploadingMsg = function($el){
        var uid=$el.data('imListMsg');
        if($this.userCache[uid]==undefined)return;
        var firstMid=$this.userCache[uid]['first_msg_id'];
        if($this.userCache[uid]['ajax_more_msg']||!firstMid||$('#pp_message_msg_'+firstMid)[0]) return;
        $this.userCache[uid]['ajax_more_msg']=true;
        var $listBox=$('#pp_message_list_message_'+uid), idLoader=+new Date+'_loader_msg',$loader;

        if(!$('.loader_msg')[0]){
            $loader=$('<div class="loader_msg" id="'+idLoader+'"><img src="'+$this.urlTmplMain+'/images/loader_msg.gif"/></div>');
            $listBox.prepend($loader.slideDown($this.dur*.5));
        }
        $this.userCache[uid]['limit_start']+=$this.imHistoryMessages;
        //$this.userCache[uid]['ajax_more_msg']=setTimeout(function(){ready(uid)}, $this.wait);
        $.post(url_ajax+'?cmd=uploading_msg',{user_id:uid, limit_start:$this.userCache[uid]['limit_start']}, function(res){
            $loader=$('.loader_msg');
            if($loader[0])$loader.slideUp($this.dur*.5,function(){$(this).remove()});
            var data=checkDataAjax(res);
            if(data!==false){
                var $data=$(trim(data));
                $data.find('script').appendTo('#update_server');
                var $listAllMsg=$data.filter('.list_msg_with_user'),
                    $listMsg=$listAllMsg.find('.item'),
                    firstId=$this.userCache[uid]['first_msg_id'],
                    msgId, t=$this.dur, i=$listMsg.length-1, $msg;

                if($('#pp_message_msg_'+firstId,$listAllMsg)[0]||!$listMsg.length){
                    $this.userCache[uid]['ajax_more_msg']=false;
                    $this.userCache[uid]['first_msg_id']=0;
                }

                (function fu(){
                    if(i<0){
                        $this.userCache[uid]['ajax_more_msg']=false;
                        return false;
                    }
                    var $msg=$listMsg.eq(i);
                    if($msg[0]){
                        msgId=this.id;
                        if(!$('#'+msgId)[0]){
                            var title=$msg.find('.tit').removeClass('blue green');
                            title.addClass($msg.data('msgUid')!=$this.guid?'green':'blue');
                            $msg.hide().prependTo($listBox).stop()
                                .slideDown({
                                    duration:t*=.7,
                                    step:function(){$listBox.scrollTop(0)},
                                    complete:function(){i--; fu();}
                                })
                        }else{
                            i--; fu();
                        }
                    }
                })()
            }else{
                //Server error
            }
            $this.userCache[uid]['ajax_more_msg']=false;
            //ready(uid);
        });
    }

    this.hideAllNotifMsg = function(){
        $('.notifications:visible:not(.remove)').addClass('remove').css({opacity:0, transition:'all .5s'})
                                                .oneTransEnd(function(){$(this).remove()})
    }

    this.hideNotifMsg = function($bl){
        var $vis=$('.notifications:visible:not(.remove)');
        if($bl!==undefined){
            if($bl.is('.remove'))return;
            var css={opacity:0, height:'0px', marginBottom:'0px', marginTop:'0px', transition:'all .7s'};
            if($vis.first()[0]==$bl[0]){
                css={opacity:0};
            }
            $bl.addClass('remove').css(css).oneTransEnd(function(){$(this).remove()})
        }else if($vis[0]&&$vis.length>2){
            $vis.eq(0).addClass('remove').css({opacity:0}).oneTransEnd(function(){$(this).remove()})//, height:'0px'
        }
    }

    this.showNotifMsg = function(data, t, isInfo){
        var id = 'notif_new_msg'+data['id'],
            avatar = data['photo'],
            title = data['title'],
            msg = data['text'];
        isInfo=isInfo||0;
        if($('#'+id)[0])return;

        if(!$('#notifications_box')[0]){
            var pos=9;
            if($this.notifPosition=='right'){
               var $main=$('.main')[0];
               pos +=$main.offsetWidth-$main.clientWidth;
            }
            $('<div id="notifications_box"></div>').css($this.notifPosition,pos).appendTo('body');
        }

        $this.hideNotifMsg();
        var $notifCl=$('#notifications_tmpl').clone();
        $notifCl.attr('id', id);
        $notifCl.find('.title').html(title);
        var $text=$notifCl.find('.text').html(msg);
        var $link=$notifCl.find('.title > a'),
            uid=$notifCl.find('.text > div').data('uid');
        $notifCl.find('.avatar').data({url:$link[0].href,uid:uid});

        $notifCl.find('.notifications_show_msg').data('uid', uid);

        if(!isInfo&&~$link[0].href.indexOf('#null')){
            $link.click(function(){
                $this.show(uid);
                return false;
            })
        }
        if(isInfo){
            $text.removeClass('notifications_show_msg');
            var $linkText=$text.find('a');
            if($linkText[0]){
                $text.click(function(){
                    location.href=$linkText[0].href;
                })
            }
        }
        $notifCl.find('img').attr('src',avatar);
        $notifCl.appendTo('#notifications_box');
        setTimeout(function(){
            $('#'+id).css({opacity:1, height:'100px', marginBottom:'15px', marginTop:'-4px'})//, marginBottom:'10px'
        },10);
        setTimeout(function(){$this.hideNotifMsg($('#'+id));},($this.notifLifetime+t)*1000);
    }

    this.showNotifAllMsg = function(listMsg, isInfo){
        if (activePage == 'city.php' && isSiteOptionActive('message_notifications_not_show_when_3d_city')) {//isFullScreen()
            return;
        }

        var i=0,j=0,l=listMsg.length;
        if(l)lastNewMsgId=listMsg[l-1]['id'];
        (function fu(){
            if(listMsg[i]!==undefined){
                if(i>=(l-3)){
                    $this.showNotifMsg(listMsg[i], ++j, isInfo);
                }
                i++; fu();
            }
        })()
    }

    $(function(){

        $this.preloader=$('#pp_message_preloader');

        $('body').on('click', '.show_messages, #pp_message_list_user_open_im > .item, #pp_message_close, .photo_grant_access, .photo_deny_access, .pp_body, .pp_message_user_info, .name_chat_info, .notifications_show_msg', function(e){
            var el=$(this),target=$(e.target);

            var isNotif=target.is('.notifications_show_msg');
            if (isNotif||target.closest('.notifications_show_msg')[0]){
                var uid=isNotif ? el.children('div').data('uid') : el.data('uid');
                Messages.show(uid,1);
                return false;
            }

            if (target.is('a#pp_message_action_current')){
                $this.showActionBlock();
                return false;
            }

            if(el.is('#pp_message_list_user_open_im > .item')){
                var uid=el.data('imUserToId');
                if (!$this.isDeleteAction&&uid!=$this.userTo){
                    $this.set_im(uid, false, false, true);
                } else if(!target.is('.niceRadio > a')&&$this.isDeleteAction){
                    el.find('.niceRadio > a').click();
                }
                return false;
            }

            if(el.is('#pp_message_close')){
                for(var uid in users_list){
                    $this.userCacheRemove(uid)
                    //delete users_list[uid]
                };
                $.post(url_ajax,{cmd:'delete_empty_im'});
				$this.el.data('popup').fadeTo(0,0);
                setTimeout(function(){
					$this.el.close(0);
                    $('.cont, .head', '#pp_message').html('').addClass('preloader');
                },420);
				$this.isOpenMessages=false;
                isVisibleMessages=false;
                return false;
            }
            /* Hide Delete */

            if(el.is('.pp_message_user_info') || el.is('.name_chat_info')){
                if ($('#pp_message_delete_im:visible')[0]){$this.select_none()}
            }
            /* Hide Delete */
            /* Grand Access */
            if(el.is('.photo_grant_access')){
                var btn=$(this);
                if(btn.hasClass('ajax'))return;
                var msg=btn.closest('.item'),mid=msg.data('msgId');
                btn.addClass('ajax');
                $.post(url_ajax,{cmd:'send_request_private_access',type:'request_approved',user_to:btn.data('userId'),mid:mid},
                function(res){
                    if(checkDataAjax(res)){
                        updateCounterTitle('#narrow_private_photo_count');//my_friends_count
                        $this.replaceMsgPhotoGrantAccess(msg,$this.langParts.you_granted_access);
                    }
                    btn.removeClass('ajax');
                })
                return false;
            }
            if(el.is('.photo_deny_access')){
                var btn=$(this);
                if(btn.hasClass('ajax'))return;
                var msg=btn.closest('.item'),mid=msg.data('msgId'),uid=$this.userTo;
                btn.addClass('ajax');
                $.post(url_ajax,{cmd:'send_request_private_access',type:'request_declined',user_to:btn.data('userId'),mid:mid},
                function(res){
                    if(checkDataAjax(res)){
                        $this.replaceMsgPhotoGrantAccess(msg,$this.langParts.sorry_albums_today);
                    }
                    btn.removeClass('ajax');
                })
                return false;
            }
            /* Grand Access */
            if(el.is('.pp_body')){
                if (e.target==this && $('#pp_message_close:visible')[0]) $('#pp_message_close').click();
            }
        })

        $('body').on('mouseenter mouseleave', '#pp_message_action, #pp_message_list_user_open_im > .item, .notifications_show_msg', function(e){
            var el=$(this)
            //if(el.is('#pp_message_action')){$this.showActionBlock()};
            if(el.is('#pp_message_list_user_open_im > .item')){
                //$(this).find('.color').toggleClass('selected');
                //$(this).find('.nik > a').toggleClass('selected');
            }
            if(el.is('.notifications_show_msg')){
                var color=e.type=='mouseenter'?'#ff5f23':'#6796dd';
                el.children('div').css({color:color});
            }
        })
        // wheel
        $('body').on('wheel', 'div.list_msg_with_user:visible', function(e){
            var el=$(this);
            if(el.is('.list_msg_with_user')&&!el.scrollTop()){
                $this.uploadingMsg($(this))
            }
        })
		Messages

    })

    return this;

}