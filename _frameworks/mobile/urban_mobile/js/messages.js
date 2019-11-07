var CMessages = function(guid, imHistoryMessages) {

    var $this=this;

    this.guid = guid;
    this.imHistoryMessages = imHistoryMessages*1;
    this.messagesCache = {};
    this.newMailFromUsers = {};
    this.blink,
    this.langParts = {};
    this.dur = 400;
    this.uidHistoryClear = 0;
    this.isShowSettings = false;
    this.wait = 4000;
    this.isAjax = {access:0, more_msg:0, send:0};
    $this.stop=0;

    this.init = function(){
        $this.$wnd = $(window);
        $this.$stContent = $('.st-content-inner');
        $this.updateServer = $('#update_server');

        $this.messagesBox = $('#messages_box');
        $this.numberNewMessagesBox = $('.number_new_messages');
        $this.userMenuNewMessages = $('#user_menu_counter_messages');
        $this.$counterEventsUserMenu=$('#counter_events')
        $this.messageSettings = $('#message_settings');
        $this.isShowSettings=false;
        $this.$messageText = $('#message_text');
        if(isOneChat=='one_chat'){
            $this.notMoreMsg();
            $this.$loaderBox=$('#loader_box_msg');
            $this.$btnSend = $('#message_send');
            $this.$profilePic = $('#one_chat_profile_pic');
            $this.btnImg=$this.$btnSend.find('img').clone();
        }else{
            isOneChat='general_chat';
            $this.$loaderGeneral=$('#loader_general');
            $this.$noOneFound = $('.no_one_found');
            $this.$noOneFoundBlock = $('.no_one_found, .no_one_found span');
        }
    }

    this.initOneChat = function(user_to, limit_start, url_photo, first_msg_id){
        appCurrentImUserId=user_to;
        messages.usersCacheAdd(user_to);
        userTo=user_to;
        limitStart=limit_start*1;
        isOneChat='one_chat';
        $this.firstMsgId = first_msg_id*1;
        $this.$htmlMsgBlock=$('<div class="item">'+
                                '<div class="bl">'+
                                    '<div class="pic">'+
                                        '<a class="im_open to_profile" href="#"><img class="im_photo_user" src="'+url_files+url_photo+'" alt="" /></a>'+
                                    '</div>'+
                                    '<div class="message">'+
                                    '<div class="msg im_msg_box"></div>'+
                                    '</div><div class="cl"></div>'+
                                '</div></div>');
    }

    this.prepareMsgBeforeShow = function($block){
        var $block=$block||$('.messages_msg', $this.messagesBox);
        $block.css({maxWidth:($this.$wnd.width()-(isOneChat=='general_chat'?102:140))+'px'});//160
        $this.setBannerParam();
    }

    this.prepareOneMsgBeforeShow = function($msg){
        $this.prepareMsgBeforeShow($msg.find('.messages_msg'));
    }

    this.setData = function(data){
        for (var key in data) {
           $this[key] = data[key];
        }
    }

    this.setLastId = function(lastId){
        last_id=lastId*1;
    }

    this.setLastMid = function(mid){
        mid=mid*1;
        if((mid^0)!==mid||last_id>=mid)return;
        last_id=mid;
        console.log('SET LAST ID', last_id);
    }

    this.setLimitStart = function(start,stop_more,limitLoad){
        limitLoad=(limitLoad*1)||0;
        if(!limitLoad)limitStart=start*1;
        $this.stop=stop_more*1;
        console.log('SET LIMIT GENERAL limit:',limitLoad,' limitStart:',limitStart,' stop:',$this.stop);
    }

    this.usersCacheAdd = function(uid, status){
        //console.log('USER ADD', uid, status);
        users_list[uid]=status*1;
	}

    this.usersCacheRemove = function(uid){
        delete users_list[uid];
    }

    this.inUserCache = function(uid){
        return uid in users_list;
    }

    this.messagesCacheAdd = function(uid, mid, isSp) {
		if (!$this.messagesCache[uid]) {$this.messagesCache[uid]={}}
		//if ($this.messagesCache[uid][mid]) return;
		$this.messagesCache[uid][mid] = isSp*1;

	}

    this.messagesCacheRemoveByMid = function(uid, mid) {
		if (!$this.messagesCache[uid][mid]) return;
		delete $this.messagesCache[uid][mid];
	}

	this.messagesCacheRemoveByUid = function(uid) {
        if (!this.messagesCache[uid]) return;
		delete $this.messagesCache[uid];
	}

    this.notMoreMsg = function(mid) {
        var mid=mid||$this.firstMsgId;
        if($('#msg_'+mid)[0]){
            $this.firstMsgId=0;
        }
	}

    /* Upgrade Menu TO -> profile.js*/
    this.setNumberMessages = function(counter, lastNewMessageUserId, lastNewMessageText){
        counter=counter*1;
        if($this.$counterEventsUserMenu[0]){
            $this.$counterEventsUserMenu.fadeTo($this.dur,counter?1:0);
        }
        if(!counter)counter='';

		var imMessagesCountCurrent = imMessagesCount;
		imMessagesCount = counter;

		//mobileAppLoaded = true;
		if(counter && mobileAppLoaded) {
			if(counter > imMessagesCountCurrent) {
				//console.log(counter, lastNewMessageUserId);
				if(lastNewMessageUserId) {
					mobileAppNotification(lastNewMessageUserId, lastNewMessageText);
				}
				//console.log('push');
			}
		}

        if($this.numberNewMessagesBox[0]){
            if(activePage!='messages.php'){
                if(counter){$this.numberNewMessagesBox.find('span').text(counter).end().fadeIn($this.dur)
                }else{$this.numberNewMessagesBox.fadeOut($this.dur)}
            }else{
                $this.numberNewMessagesBox.find('span').text(counter);
            }
        }
        if($this.userMenuNewMessages[0]){
            $this.userMenuNewMessages.text(counter);
        }
    }
    /* Upgrade Menu TO -> profile.js*/

    /* GENERAL CHATS */
    this.setStatusNewMessagesFromUsers = function(msgFromUsers){
        if($this.isShowSettings)return;
        var $newMail;
        for (var uid in msgFromUsers) {
            $newMail=$('#new_mail_'+uid);
            if($newMail[0]){
                var n=Boolean(msgFromUsers[uid]*1);
                if(n!=$newMail.is('.show'))$newMail[n?'addClass':'removeClass']('show',0);
            }
        }
    }

    this.ajaxUpdateGeneralChat=0;
    this.removeOneUserGeneralChat = function(uid,dur){
        var $im=$('#im_'+uid);
        //console.log('REMOVE GENERAL IM', uid);
        if ($im[0]) {
            $im.slideUp(dur||($this.dur*.5),function(){
                $im.remove();
                $this.prepareMsgBeforeShow();
            })
            $this.messagesCacheRemoveByUid(uid);
            $this.usersCacheRemove(uid);
        }
    }

    this.removeUsersGeneralChat = function(users){
        for (var uid in users) {
            $this.removeOneUserGeneralChat(uid);
        }
    }

    this.setOrderUsersGeneralChat = function(users){
        for (var uid in users) {
            //console.log('SET or', uid,users[uid]);
            $('#im_'+uid).attr('data-check-order',users[uid]).data('checkOrder',users[uid]);
        }
    }

    this.checkOrderUsersGeneralChat = function(users){
        var $chats=$('.to_one_chat[data-check-order!=""]');
        if (!$chats[0]) {
            $this.isAjax['more_msg']=0;
            $this.ajaxUpdateGeneralChat=0;
            return;
        }
        var t=200,i=0;
        (function fu(){
            var $item=$chats.eq(i);
            if (!$item[0]){
                $this.isAjax['more_msg']=0;
                $this.ajaxUpdateGeneralChat=0;
                return;
            }
            var o=$item.data('checkOrder'),ro=$item.index('.to_one_chat');
            $item.attr('data-check-order','').data('checkOrder','');
            //if(ro)ro--;
            //console.log('CHECK ORDER',$item[0].id,o,ro);
            if(o!=ro){
                t*=.9;
                if(!o){
                    var $eQ0=$('.to_one_chat').eq(0);
                    if ($eQ0[0]&&$item[0].id!=$eQ0[0].id) {
                        $item.slideUp(t,function(){
                            $this.prepareOneMsgBeforeShow($item);
                            $item.prependTo($this.messagesBox).stop().slideDown(t,function(){
                                i++; fu();
                            })
                        })
                    }else{
                        i++; fu();
                    }
                }else{
                    o--;
                    var $eQo=$('.to_one_chat').eq(o);
                    if($eQo[0]&&$item[0].id!=$eQo[0].id){
                        $item.slideUp(t,function(){
                            $this.prepareOneMsgBeforeShow($item);
                            $item.insertAfter($eQo).stop().slideDown(t,function(){
                                i++; fu();
                            })
                        })
                    }else{
                        i++; fu();
                    }
                }
            }else{
                i++; fu();
            }
        })()
    }

    this.update = function(data){
        //console.log('SERVER UPDATE GENERAL',last_id);
        var $html=$(data);
        $html.filter('script').appendTo('#update_server');
        if(activePage != 'messages.php')return;
        if($this.ajaxUpdateGeneralChat||$this.isShowSettings||$this.isAjax.more_msg)return;
        //console.log('SERVER UPDATE GENERAL IM');
        $this.isAjax.more_msg=1;
        $this.ajaxUpdateGeneralChat=1;
        $html.filter('.script').find('script').appendTo('#update_server');
        setTimeout(function(){
            var $chats = $html.filter('.to_one_chat').hide();
            if ($chats[0]) {
                var t=200,i=0;
                (function fu(){
                    var $item=$chats.eq(i);
                    if (!$item[0]){
                        $this.checkOrderUsersGeneralChat();
                        return;
                    }
                    var $im=$('#'+$item[0].id);
                    if(!$im[0]){
                        var order=$item.data('order');
                        t*=.9;
                        var $itemMsg=$item.find('.im_msg_one'),
                            itemMsgId=$itemMsg.data('id');
                        //if(itemMsgId>last_id)last_id=itemMsgId;
                        $this.setLastMid(itemMsgId);
                        $this.prepareOneMsgBeforeShow($itemMsg);
                        if(!order){
                            $item.hide().prependTo($this.messagesBox).slideDown(t,function(){
                                i++; fu();
                            })
                        }else{
                            order--;
                            $item.hide().insertAfter($('.to_one_chat').eq(order)).slideDown(t,function(){
                                i++; fu();
                            })
                        }
                        $this.hideLinkNoOneFound();
                        $this.showBtnSettings();
                    }else{
                        //console.log('YESSSSSSSS', $im[0], $im.find('.im_msg_one')[0].id, $item.find('.im_msg_one')[0].id);
                        var $itemMsg=$item.find('.im_msg_one'), $imMsg=$im.find('.im_msg_one'),itemMsgId=$itemMsg.data('id');
                        if (itemMsgId>$imMsg.data('id')) {
                            $this.messagesCacheRemoveByMid($im.data('userId'),$imMsg.data('id'));
                            //if(itemMsgId!='block')last_id=itemMsgId;
                            $this.setLastMid(itemMsgId);
                            $imMsg.slideUp($this.dur,function(){
                                $(this).remove();
                                $this.prepareOneMsgBeforeShow($itemMsg);
                                $itemMsg.hide().prependTo($im.find('.msg'))
                                    .slideDown($this.dur,function(){
                                    i++; fu();
                                })
                            })
                        }else{
                           i++; fu();
                        }
                    }
                })()
            }else{
                $this.checkOrderUsersGeneralChat();
                $this.showLinkNoOneFound();
                $this.hideBtnSettings();
            }
        },400)
    }

    this.updateHistoryGeneral = function(data){
        var $data=$('<div>'+data+'</div>');
        var $ims=$data.find('.to_one_chat');
        $data.find('script').appendTo('#update_server');
        if(!$ims[0])return;
        var i=0;
        (function fu(){
            var $item=$ims.eq(i);
            if($item[0]){
                var uid=$item.data('userId'),
                    $existsIm=$('#im_'+uid);
                if(!$existsIm[0]){
					//$this.usersCacheAdd(uid);
                    $this.prepareOneMsgBeforeShow($item);
                    if($this.isShowSettings){
                        $('a.im_open', $item).hide();
                        $('a.im_delete', $item).show();
                    }
                    $item.hide().appendTo($this.messagesBox).slideDown($this.dur*.6,function(){
                        $this.showBtnSettings();
                    })
                    i++; fu();
                }
            }
        })();
    }

    this.uploadingHistoryGeneral = function(limit){
        limit=limit||0;
        console.log('UPLOAD HISTORY GENERAL stop:', $this.stop, ' limit:', limit);
        var isMoreMsg=$this.isAjax['more_msg'];
        if(limit)isMoreMsg=0;
        if(isMoreMsg||$this.stop)return;
        $this.$loaderGeneral.slideDown($this.dur*.5);
        if(limit){
            start=limitStart+$this.imHistoryMessages-limit;
        } else {
            limitStart+=$this.imHistoryMessages;
            start=limitStart;
        }
        $this.isAjax['more_msg']=true;
        $.post(url_main+'messages.php',{ajax:1, user_id:userTo, limit_start:start, limit:limit}, function(res){
            $this.$loaderGeneral.slideUp($this.dur*.5);
            var data=checkDataAjax(res);
            if(data!==false){
                var data=$.trim(data);
                if(data===''){$this.stop=1;return}
                $this.updateHistoryGeneral(data);
            }else{
                tools.showServerError();
            }
			$this.isAjax['more_msg']=false;
        })
    }

    /* Online status users */
    this.updateOnlineUsers = function(usersStatus){
        for (var uid in usersStatus) {
            users_list[uid]=usersStatus[uid];
            $('#im_user_status_'+uid).fadeTo(400,usersStatus[uid]);
        }
    }
    /* Online status users */

    this.setReadMsgs = function(listMsg){
        //console.log('SET READ MSGS', listMsg);
        for (var uid in listMsg) {
            //console.log('SSSSSS', uid);
            $('#msg_read_'+listMsg[uid]+'.hide').removeClass('hide');
        }
    }
    /* GENERAL CHATS */

    /* One chat*/
    this.updateOneChat = function(data){
        var $html=$(data), $listMsg=$html.filter('div.im_msg_one');
        $html.filter('script').appendTo('#update_server');
        $this.showMsg($listMsg);
    }

    this.showMsg = function($listMsg, noUpdateLstId){
        var $msg, $block, $appendBlock, $listMsgBlock,
            lastMsgUid, msgUid, msgId, isShowMsg, t=$this.dur,i=0;
        noUpdateLstId=noUpdateLstId||false;
        //if($listMsg.eq(0)[0]){
            //$this.$profilePic.slideUp(300);
        //}
        (function fu(){
            var item=$listMsg.eq(i);
            item.slideUp(t*=.7, function(){
                var isAppend=0;
                $msg=$(this);
                msgId=$msg.data('id');

                $msg.find('script').remove();
                //if(msgId!='block')last_id=msgId;
                if(!noUpdateLstId)$this.setLastMid(msgId);
                $listMsgBlock=$('.im_msg_box:not(.im_msg_box_writing)','#messages_box');
                msgUid=$msg.data('msgUserId');
                isShowMsg=false;
                if (!$listMsgBlock[0]) {
                    $block=$this.$htmlMsgBlock.clone();
                    if(msgUid==$this.guid){
                        $block.find('img').remove();
                    }
                    $msg=$block.find('.im_msg_box').append($msg).end();
                    $appendBlock=$this.messagesBox;
                    isAppend=1;
                    isShowMsg=true;
                }else if(!$listMsgBlock.find('#msg_'+msgId)[0]){
                    $appendBlock=$listMsgBlock.last();
                    if(msgUid!=$this.guid){
                        lastMsgUid=$appendBlock.find('.im_msg_one').last().data('msgUserId');
                        if(lastMsgUid==$this.guid){
                            $block=$this.$htmlMsgBlock.clone();
                            $msg=$block.find('.im_msg_box').append($msg).end();
                            $appendBlock=$this.messagesBox;
                            isAppend=1;
                        }
                    }
                    isShowMsg=true;
                }
                if(isShowMsg){
                    var is=1,$wrBlock=$('.item_writing',$this.messagesBox);
                    if(isAppend&&$wrBlock[0]){$msg.hide().insertBefore($wrBlock)
                    }else{$msg.hide().appendTo($appendBlock)}

                    $msg.slideDown({step:function(){
                                        $this.$stContent.scrollTop($this.$stContent[0].scrollHeight);
                                        if(is){$this.prepareOneMsgBeforeShow($msg); is=0;}
                                    },
                                    complete:function(){i++; fu();},
                                    duration:t
                                });
                    if(msgUid!=$this.guid) $this.deleteWritingUserAfterMsg(t*.9);
                }else{i++; fu();}
            })
        })()
    }

    this.send = function(msg){
        if (typeof msg!='string') msg=0;
        var msg=msg||$.trim($this.$messageText.val());
        $this.$messageText.val('').focus();
        if(msg!==''){
            if(!$this.isAjax['send'])$this.$btnSend.html(getLoaderCl('loader_send'));
            $this.isAjax['send']++;
            msg=emojiToHtml(msg);
            $.post(url_main+'messages.php',{cmd:'send_message',display:'one_chat',ajax:1,user_to:userTo,msg:msg,to_delete:0},
                function(res){
                    var data=checkDataAjax(res);
                    if(data!==false){
                        if(data=='redirect'){window.location.href='messages.php'
                        }else{
                            data=$($.trim(data));
                            data.filter('script').appendTo('#update_server');
                            $this.showMsg(data, true);
                        }
                    }
                    $this.isAjax['send']--;
                    if(!$this.isAjax['send'])$this.$btnSend.html($this.langParts['btn_perform_action']).prepend($this.btnImg);
            });
        };
		return false;
    }

    this.setWritingOneChat = function(){
        status_writing = parseInt(new Date()/1000);
    }

    /* Prints a message+ */
    this.updateWritingUser = function(){
        if($('.is_writing',$this.messagesBox)[0])return;
        var $msg=$('<div class="item item_writing">'+
                   '<div class="bl"><div class="pic"></div><div class="message">'+
                   '<div class="msg im_msg_box im_msg_box_writing"><div class="is_writing">'+
                   '<div class="left left_writing">'+
                   '<img id="img_writing" src="' + url_tmpl_mobile_images + 'is_writing.png">'+
                   '</div><div class="cl"></div></div></div>'+
                   '</div><div class="cl"></div></div></div>');
        var $lastMsg=$('.im_msg_one:last', $this.messagesBox);
        if(!$lastMsg[0]||$lastMsg.data('msgUserId')==$this.guid){
            $msg.find('.pic').remove();
            $msg.find('img').css({marginLeft:'4px'});
        }
        $msg.hide().appendTo($this.messagesBox).slideDown(300,function(){
            $this.blink = setInterval(function(){$('#img_writing').animate({opacity: 'toggle'}, 600)}, 600);
        });
    }

    this.deleteWritingUser = function(){
        var $wrBlock=$('.is_writing',$this.messagesBox).closest('.item');
        if($wrBlock[0]){
            $wrBlock.stop().slideUp(300,function(){
                $wrBlock.remove();
                clearInterval($this.blink);
            });
        }
    }

    this.deleteWritingUserAfterMsg = function(dur){
        var $wrBlock=$('.is_writing',$this.messagesBox).closest('.item');
        if($wrBlock[0]){
            $wrBlock.hide(dur,function(){
                $wrBlock.remove();
                clearInterval($this.blink);
            });
        }
    }
    /* Prints a message+ */

    this.setReadMsg = function(mid){
        //console.log('SET READ MSG', mid);
        var $mark=$('#msg_read_'+mid+'.hide');
        if ($mark[0]) {
            $('[data-msg-user-id='+siteGuid+'].im_msg_one .msg_read.hide').each(function(){
                var $el=$(this),id=$el.closest('.im_msg_one').data('id');
                console.log('SET',id);
                if(id<=mid)$el.removeClass('hide');
            })
        }
    }

    /* Uploading */
    function ready(){if ($this.isAjax['more_msg']) {clearTimeout($this.isAjax['more_msg']); $this.isAjax['more_msg']=0}};
    this.uploadingMsg = function(){
        if ($this.isAjax['more_msg']||!$this.firstMsgId||$this.stop) return;
        $this.$loaderBox.slideDown($this.dur*.5);
        limitStart+=$this.imHistoryMessages;
        $this.isAjax['more_msg']=setTimeout(ready, $this.wait);
        $.post(url_main+'messages.php',{ajax:1, display:'one_chat', user_id:userTo, limit_start:limitStart}, function(res){
            $this.$loaderBox.slideUp($this.dur*.5);
            var data=checkDataAjax(res);
            if(data!==false){
                var data=$.trim(data);
                if(data===''){$this.stop=1;return}//$this.firstMsgId=0;
                var $html=$(data), $listMsg=$html.find('div.im_msg_one');
                $html.find('script').appendTo('#update_server');
                $this.showUploadingMsg($listMsg);
            }else{
                tools.showServerError();
            }
            ready();
        });
    }

    this.showUploadingMsg = function($listMsg){
        var $msg, $block, $appendBlock, $listMsgBlock,
            firstMsgUid, firstId, msgUid, msgId, t=$this.dur,i=$listMsg.length-1;

        firstId = $this.firstMsgId;
        if($listMsg.filter('#msg_'+$this.firstMsgId)[0]){
            $this.firstMsgId=0;
        }
        (function fu(){
            if(i<0)return false;
            var item=$listMsg.eq(i);
            item.slideUp(t*=.7, function(){
                $msg=$(this);
                msgId=$msg.data('id');

                $msg.find('script').remove();

                $listMsgBlock=$('.im_msg_box:not(.im_msg_box_writing)','#messages_box');
                msgUid=$msg.data('msgUserId');
                if(!$listMsgBlock.find('#msg_'+msgId)[0]){
                    $appendBlock=$listMsgBlock.first();
                    if(msgUid!=$this.guid){
                        firstMsgUid=$appendBlock.find('.im_msg_one').first().data('msgUserId');
                        if(firstMsgUid==$this.guid){
                            $block=$this.$htmlMsgBlock.clone();
                            $block.find('.pic > a').attr('data-user-id',msgUid).data('userId',msgUid);
                            $msg=$block.find('.im_msg_box').append($msg).end();
                            $appendBlock=$this.messagesBox;
                            //$appendBlock=false;
                        }
                    }else{
                        $block=$this.$htmlMsgBlock.clone();
                        $block.find('.pic > a').remove();
                        $msg=$block.find('.im_msg_box').append($msg).end();
                        //$appendBlock=false;
                        $appendBlock=$this.messagesBox;
                    }
                    //if($appendBlock===false){$msg.hide().insertAfter($this.$loaderBox)
                    //}else{$msg.hide().prependTo($appendBlock)}
                    var is=1;
                    $msg.hide().prependTo($appendBlock).slideDown({
                                    step:function(){
                                        $this.$stContent.scrollTop(1);
                                        if(is){$this.prepareOneMsgBeforeShow($msg);is=0;}
                                    },
                                    complete:function(){
                                        i--; fu();
                                        if($this.$profilePic.not(':visible')[0]
                                           &&$('.im_msg_box:not(.im_msg_box_writing)',$this.messagesBox).find('#msg_'+firstId)[0]){
                                            $this.$profilePic.css({height:'0px'}).show().animate({height:'89px'},t)
                                        }
                                    },
                                    duration:t
                                });
                }else{
                    i--; fu();
                }
            })
        })()
    }

    /* Uploading */

    /* No One Found */
    this.hideLinkNoOneFound = function(dur){
        if($('.to_one_chat:first', $this.messagesBox)[0]&&$this.$noOneFound.is('.to_show')){
            $this.$noOneFound.removeClass('to_show').hide();
            $this.setBannerParam();
        }
    }

    this.showLinkNoOneFound = function(){
        if(!$('.to_one_chat:first', $this.messagesBox)[0]&&!$this.$noOneFound.is('.to_show')){
            $('.footer_mobile_messages, .footer_mobile_paid_messages').stop().fadeOut(200);
            $this.$noOneFound.addClass('to_show').fadeTo(0,0).css({display:'table'}).delay(200).fadeTo(400,1,function(){
                $this.messagesBox.removeAttr('style');
                $this.setBannerParam();
            })
        }
    }

    this.setBannerParam = function(){
        var $banner=$('.footer_mobile_messages, .footer_mobile_paid_messages');
        if($banner[0]){
            if(!$('.to_one_chat:first', $this.messagesBox)[0]){
                var b=$this.$noOneFound.height()/2,
                    hd=$this.$noOneFound.find('div').height()/2;
                $banner.css({top: (b+hd)+'px', marginBottom: hd+'px'}).fadeIn(400);
            }else{
                $('.bl_message_one').height($win.height()-$banner.height()-100);
                $banner.removeAttr('style').stop().fadeIn(400);
            }
        }
    }
    /* No One Found */

    /* Setting - clearing history */
    this.hideBtnSettings = function(dur){
        if($this.messageSettings.is(':visible') && !$('.to_one_chat:first', $this.messagesBox)[0]){
            var dur=dur||$this.dur*.5;
            $this.isShowSettings=false;
            $this.messageSettings.removeClass('active').fadeOut(dur);
        }
    }

    this.showBtnSettings = function(){
        if($this.messageSettings.is(':visible'))return;
        $this.messageSettings.fadeIn($this.dur*.5);
    }

    this.showSettings = function(){
        if(!$('.to_one_chat', $this.messagesBox)[0])return;
        $('.frame_pic', $this.messagesBox).hide();
        if($this.isShowSettings){
            $this.messageSettings.removeClass('active');
            $('img.im_delete_empty').hide();
            $('a.im_delete', $this.messagesBox).stop().fadeOut($this.dur,function(){
                $this.isShowSettings=false;
                $('a.im_open', $this.messagesBox).stop().fadeIn($this.dur);
                $this.setStatusNewMessagesFromUsers($this.newMailFromUsers);
            });
        }else{
            $this.isShowSettings=true;
            $this.messageSettings.addClass('active');
            $('a.icon_new_mail').each(function(){
                var el=$(this);
                $this.newMailFromUsers[$(this).data('userId')]=el.is('.show');
                el.removeClass('show');
            })
            $('a.im_open', $this.messagesBox).stop().fadeOut($this.dur,function(){
                $('a.im_delete', $this.messagesBox).stop().fadeIn($this.dur);
            });
        }
    }

    this.confirmHistoryClear = function(el,uid){
        if(!el.is(':visible'))return;
        $this.uidHistoryClear=uid;
        el.next('.frame_pic').show();
        showConfirm($this.langParts.really_delete_all_messages, $this.langParts.delete, $this.langParts.cancel, $this.historyClear, 'red', '#st-container', $this.historyClearCancel);
    }

    this.historyClearCancel = function(){
        $('.frame_pic', $this.messagesBox).hide();
    }

    this.historyClear = function(){
        $('.frame_pic', $this.messagesBox).hide();
        var uid=$this.uidHistoryClear,
            ind=+new Date,
            $im=$('#im_'+uid, $this.messagesBox);
        $im.find('a.im_delete').hide().end()
           .find('img.im_delete_empty').show().end()
           .find('.im_user_photo').append(getLoaderCl(ind,'loader_messages'));
        $.post(url_main+'messages.php', {ajax:1, cmd:'clear_history_messages', user_id:uid}, function(res){
               var data=checkDataAjax(res);
               if(data){
                    delete $this.messagesCache[uid];
                    $this.usersCacheRemove(uid);
                    $im.slideUp($this.dur,function(){
                        $(this).remove();
                        $this.hideBtnSettings();
                        $this.showLinkNoOneFound();
                        //limitStart--;
                        $this.uploadingHistoryGeneral(1);
                        //if($('.to_one_chat', $this.messagesBox).length<7){

                        //}
                        console.log('DELETE',$('.to_one_chat', $this.messagesBox).length);
                    })
               }else{
                    hideLoaderCl(ind);
                    $im.find('img.im_delete_empty').hide().end().find('a.im_delete').show();
                    tools.showServerError();
               }
        });
    }
    /* Setting - clearing history */

    /* Remove not existing messages and IM - NOT USED */
    this.checkExistenceMessages = function(existingMsg){//not used
        console.log('EXTENCE Messages', existingMsg);
        var existingMsg = jQuery.parseJSON(existingMsg);
        if (!existingMsg) {
            for (var uid in $this.messagesCache) {
                delete $this.messagesCache[uid];
                $this.usersCacheRemove(uid);
                $('#im_'+uid, '#messages_box').slideUp($this.dur,function(){
                    $(this).remove();
                    $this.hideBtnSettings();
                    $this.showLinkNoOneFound();
                });
            }
        }else{
            for (var uid in $this.messagesCache) {
                for (var mid in $this.messagesCache[uid]) {
                    if($.type(existingMsg[mid])!=='number'){
                        delete $this.messagesCache[uid][mid];
                        if ($.isEmptyObject($this.messagesCache[uid])) {
                            delete $this.messagesCache[uid];
                            $this.usersCacheRemove(uid);
                            $('#im_'+uid, '#messages_box').slideUp($this.dur,function(){
                                $(this).remove();
                                $this.hideBtnSettings();
                                $this.showLinkNoOneFound();
                            });
                        }else{
                            $('#msg_'+mid, '#messages_box').slideUp($this.dur,function(){
                                $(this).remove();
                            });
                        }
                    }
                }
            }
        }
    }

    this.checkExistenceMessagesOneChat = function(existingMsg){//Not used - DISABLED
        var existingMsg = jQuery.parseJSON(existingMsg),$msg,$block,numberMsg;
        for (var mid in $this.messagesCache[userTo]) {
            if($.type(existingMsg[mid])!=='number'){
                delete $this.messagesCache[userTo][mid];
                if(mid.indexOf('system')==-1){
                    $msg=$('#msg_'+mid, '#messages_box');
                    $block=$msg.closest('.item'),
                    numberMsg=$block.find('.im_msg_one:not(:animated)').length;
                    if (numberMsg==1) {
                        $block.slideUp($this.dur,function(){
                            $(this).remove();
                            //if ($.isEmptyObject($this.messagesCache[userTo])){
                                //$this.$profilePic.slideDown(300);
                            //}
                        })
                    }else{
                        $msg.slideUp($this.dur,function(){
                            $(this).remove();
                            //if ($.isEmptyObject($this.messagesCache[userTo])){
                                //$this.$profilePic.slideDown(300);
                            //}
                        })
                    }
                }
            }
        }
    }
    /* Remove not existing messages and IM */

    /* Grand Access */
    this.replaceMsgPhotoGrantAccess = function($el,msg){
        $el.data('msgUserId',$this.guid).data('toUserId',userTo);

        var $item=$el.closest('.item'),
            $itemPrev=$item.prevAll('.item:not(.item_writing)').eq(0),
            $itemNext=$item.nextAll('.item:not(.item_writing)').eq(0),
            $listMsgs=$item.find('.im_msg_one');


        if(isOneChat=='general_chat'){
            $item.slideUp($this.dur,function(){
                $el.find('.messages_msg').addClass('right').html(msg);
                $item.prependTo('#messages_box').slideDown($this.dur);
            })
            return;
        }

        // One in block
        if($listMsgs.length==1){
            $item.slideUp($this.dur,function(){
                $this.replaceMsgAccess($el,msg);
                if($itemPrev[0]){
                    $el.hide().appendTo($itemPrev.find('.im_msg_box')).slideDown($this.dur,function(){
                        $item.remove();
                    });
                }else{
                    $item.find('.pic > a').remove().end().slideDown($this.dur);
                }
            })
        // No one in the block and the first
        }else if($el.index()==0){
            $el.slideUp($this.dur,function(){
                $this.replaceMsgAccess($el,msg);
                if($itemPrev[0]){
                    $el.appendTo($itemPrev.find('.im_msg_box')).slideDown($this.dur);
                }else{
                    $this.$htmlMsgBlock.clone().hide()
                         .find('.pic > a').remove().end()
                         .find('.im_msg_box').append($el.show()).end()
                         .insertBefore($item).slideDown($this.dur)
                }
            })
        // No one in the block and the last
        }else if(!$el.nextAll('.im_msg_one')[0]){
            $el.slideUp($this.dur,function(){
                $this.replaceMsgAccess($el,msg);
                if($itemNext[0]){
                    $el.prependTo($itemNext.find('.im_msg_box')).slideDown($this.dur);
                }else{
                    $this.$htmlMsgBlock.clone().hide()
                         .find('.pic > a').remove().end()
                         .find('.im_msg_box').append($el.show()).end()
                         .insertAfter($item).slideDown($this.dur)
                }
            })
        // If more than one block in the middle and
        }else{
            $el.slideUp($this.dur,function(){
                $this.replaceMsgAccess($el,msg);
                $el.slideDown($this.dur);
            });
        }
    }

    this.replaceMsgAccess = function($el,msg){
        $el.find('.time_left').removeClass('time_left').addClass('time_right');
        $el.find('.messages_msg').addClass('right').html(msg);
    }
    /* Grand Access */

    this.showOriginalMessage = function(e){
        var el=$(e);
        el.next('.original_message').show('slow');
        el.hide();
    }

    $(function(){
        $this.init();
        if(activePage != 'messages.php')return;
        $('body').on('click', '.to_one_chat, .im_user_photo, .to_profile, .photo_grant_access, .photo_deny_access, .one_chat_to_profile_user', function(e){
            var el=$(this);
            if (el.is('.to_one_chat')) {
                if($this.isShowSettings)return false;
                var userTo=$(this).data('userId');
                if($this.guid==userTo)return false;
                $('a.im_open').css({opacity:'1'});
                $('#loader_to_user').remove();
                el.find('a.im_open').css({opacity:'.6', transition:'opacity .6s'}).end()
                  .find('div.im_user_photo').append(getLoaderCl('loader_to_user','loader_m'));
                tools.redirect(url_main+'messages.php?display=one_chat&user_id='+userTo);
                return false;
            }

            if (el.is('.im_user_photo')&&el.find('.im_delete:visible')[0]) {
                $this.confirmHistoryClear(el.find('.im_delete'),el.data('userId'));
            }

            if (el.is('.to_profile')) {
                tools.redirect(url_main+'profile_view.php?user_id='+$(this).data('userId'));
                return false;
            }

            /* Grand Access */
            if(el.is('.photo_grant_access') || el.is('.photo_deny_access')){
                if($this.isAjax['access'])return;
                var type='request_approved',
                    msg=$this.langParts['you_granted_access'];
                if (el.is('.photo_deny_access')) {
                    type='request_declined';
                    msg=$this.langParts['sorry_albums_today'];
                }
                var block=el.closest('.im_msg_one'),mid=block.data('id'),uid=el.data('userId');
                $this.isAjax['access']=1;
                $.post(url_main+'tools_ajax.php',{cmd:'send_request_private_access',type:type,user_to:uid,mid:mid},
                    function(res){
                         if(checkDataAjax(res)){
                            $this.replaceMsgPhotoGrantAccess(block,msg)
                        }
                        $this.isAjax['access']=0;
                })
                return false;
            }
            /* Grand Access */
            if(el.is('.one_chat_to_profile_user')){
                el.parent('div').append(getLoaderCl('loader_to_profile', 'loader_to_profile'));
                tools.redirect(this.href);
                return false;
            }

        })

        var $wnd=$(window);
        if (isOneChat=='one_chat') {
            $this.$messageText.keydown(function(e){
                if (e.which == 13){
                    $this.send();
                    return false;
                }
            }).on('input propertychange', $this.setWritingOneChat);

            var $contentMain=$('.main');
            $wnd.on('resize orientationchange',function(){
                if(!$('.st-menu-open')[0]){
                    $this.$stContent.scrollTop($this.$stContent[0].scrollHeight+80)
                }
                $contentMain.css({height:'100%'}).css({height:'+=1'});
            });

            $this.$stContent.scroll(function(e){
                if (!$this.$stContent.scrollTop()){
                    $this.uploadingMsg();
                }
            })
        } else {
            $this.$stContent.scroll(function(e){
                if (this.clientHeight+this.scrollTop>$this.messagesBox.height()+10){
                   $this.uploadingHistoryGeneral();
                }
            })
            $this.$stContent[0].scrollTop=0;
        }

        $wnd.on('resize orientationchange',function(){
            $this.prepareMsgBeforeShow();
        }).resize();

    })
    return this;
}
