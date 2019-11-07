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
    this.isClearIm={};

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
        console.log('USER ADD', uid, status);
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
		$this.messagesCache[uid][mid] = isSp*1;
	}

    this.messagesCacheRemoveByMid = function(uid, mid) {
		if ($this.messagesCache[uid]==undefined
            ||$this.messagesCache[uid][mid]==undefined) return;
		delete $this.messagesCache[uid][mid];
	}

	this.messagesCacheRemoveByUid = function(uid) {
        if (!$this.messagesCache[uid]) return;
		delete $this.messagesCache[uid];
	}

    this.init = function(){
        $(function(){
            $('body').on('click', '.message_list .data, .to_one_chat, .im_user_photo, .to_profile, .photo_grant_access, .photo_deny_access, .one_chat_to_profile_user', function(e){
            var $el=el=$(this);
			if ($el.is('.data')) {
				if($('.delete', $el).is(':visible')){
                    var uid=$el.data('uid');
					$this.isClearIm[uid]=true;
					confirmCustom($this.langParts.really_delete_all_messages,
					function(){$this.historyClear($el)},
					function(){
						$this.isClearIm[uid]=false;
						$this.switchAction(false,$el,true);
					})
				}
				return false;
			}

            /* Grand Access */
            if($el.is('.photo_grant_access') || $el.is('.photo_deny_access')){
				if($this.isAjax['access'])return false;
				$this.isAjax['access']=1;
                var type='request_approved',
                    msg=l('private_photo_you_granted_access');
                if ($el.is('.photo_deny_access')) {
                    type='request_declined';
                    msg=l('private_photo_request_declined');
                }
                var $block=$el.closest('.im_msg_one'),mid=$block.data('id'),uid=$el.data('userId');
                if (isOneChat=='one_chat') {
                    var $msg=$jq('#template_msg').clone();
                    $msg.attr({'id':$block[0].id,
                               'data-msg-user-id':$this.guid,
                               'data-to-user-id':$block.data('msgUserId'),
                               'data-id':$block.data('id'),'data-send':$block.data('send')})
                        .data({dataMsgUserId:$this.guid,
                               dataToUserId:$block.data('msgUserId'),
                               id:$block.data('id'),
                               send:$block.data('send')});
                    $msg.find('.info').html(msg);
                    $msg.find('.date_msg').html($block.find('.date_msg').html()).fadeTo(1,1);
                    $block.slideUp($this.dur,function(){
                        $this.showMsgOne($msg,$this.dur,false,'insertBefore',$block);
                        $block.remove();
                    });
                }else{
                    $block.slideUp($this.dur,function(){
                        $block.html(msg).slideDown($this.dur);
                    })
                }
                $.post(url_main+'ajax.php',{cmd:'send_request_private_access',type:type,user_to:uid,mid:mid},
                    function(res){
                        if(checkDataAjax(res)){
                            //$this.replaceMsgPhotoGrantAccess(mid,msg)
                        }
                        $this.isAjax['access']=0;
                })
                return false;
            }
            /* Grand Access */
            }).on('mouseenter mouseleave', '.message_list .data, .message_list .info', function(e){
                var $el=$(this);
                if($el.is('.data')||$el.is('.info')){
                    if($this.isClearIm[$el.data('uid')])return false;
                    if($el.is('.info')){
                        $el=$el.next('.data');
                    }
                    $this.switchAction(e.type=='mouseenter',$el);
                }
            })
        })
    }

    this.toOneChat = function(e, url){
        var $el=$(e.target);
        if($el.is('.photo_grant_access')||$el.is('.photo_deny_access'))return false;
        redirectUrl(url);
    }

    /* ONE CHAT */
    this.notMoreMsg = function(mid) {
        var mid=mid||$this.firstMsgId;
        if($('#msg_'+mid)[0]){
            $this.firstMsgId=0;
        }
	}

    this.initOneChat = function(user_to, limit_start, is_one_chat, url_photo, first_msg_id){
        userTo=user_to;
        limitStart=limit_start*1;
        isOneChat=is_one_chat;
        $this.firstMsgId=first_msg_id*1;
        $this.stop=0;

        $(function(){
            $this.init();

            $this.scrollBox=$jq('.scrollbarY');
            $this.scrollBox.tinyscrollbar({wheelSpeed:35,thumbSize:45});
            $this.scrollBoxThumb=$jq('#scrollbarY_thumb');
            $this.scrollBoxPl=$this.scrollBox.data('plugin_tinyscrollbar');
            $this.scrollBox.on('move',function(){
                if(!$this.scrollBoxPl.contentPosition){
                    $this.uploadingMsg();
                }
            })
            $this.prepareViewOneChat();
            $win.on('resize', $this.prepareViewOneChat);
            //$this.scrollBoxThumbAnimate();

			$this.notMoreMsg();

            $jq('#msg_text')
			.keydown(doOnEnter($this.send))
			.on('input propertychange', $this.setWritingOneChat)
            .autosize({isSetScrollHeight:false,callback:$this.prepareViewOneChat}).focus();
            $jq('#bl_cont').css('opacity',1);
            $jq('#bl_overview').addClass('animate');
        })
    }

    this.scrollBoxThumbAnimate = function(){
        setTimeout(function(){
            $this.scrollBoxThumb.addClass('animate');
        },5);
    }

    this.prepareViewOneChat = function(transH){
        if (!$jq('.message_field_chat')[0])return;
        var d=$jq('.message_field_chat')[0].offsetHeight+16+$jq('#bl_cont').offset().top+$jq('.main').scrollTop();
        var hw=$jq('.main').innerHeight(),h=hw-d, hwd=hw-43;
        if(h<300){
            h=300;
            $jq('.column_main').css({minHeight:hwd,maxHeight:''});
            $jq('.message_field_chat').css({marginBottom:-12});
            //hwd=543;
        }else{
            $jq('.column_main').css({minHeight:hwd,maxHeight:hwd});
            $jq('.message_field_chat').css({marginBottom:''});
        }
        var fnEnd=function(){
            $this.scrollBoxThumb.removeClass('animate')
            $this.reInitToScrollPanelChat();
            $this.scrollBoxThumbAnimate();
        }
        if(transH===true){
            $jq('#bl_viewport').stop().animate({height:h},
                {duration:350, step:fnEnd, complete:fnEnd})
        }else{
            $jq('#bl_viewport').stop().height(h);
            fnEnd();
        }
    }

	function ready(){if ($this.isAjax['more_msg']) {clearTimeout($this.isAjax['more_msg']); $this.isAjax['more_msg']=0}};
    this.uploadingMsg = function(){
        if ($this.isAjax['more_msg']||!$this.firstMsgId||$this.stop) return;
        $jq('#more_load_cont_im').slideDown(100);
        limitStart+=$this.imHistoryMessages;
        $this.isAjax['more_msg']=true;//setTimeout(ready, $this.wait)
        $.post(url_main+'messages.php',{ajax:1, display:'one_chat', user_id:userTo, limit_start:limitStart}, function(res){
            $jq('#more_load_cont_im').slideUp(100);
            var data=checkDataAjax(res);
            if(data!==false){
                var data=$.trim(data);
                if(data===''){$this.stop=1;return}
				$this.updateOneChat(data,1);
            }else{
                alertServerError();
            }
            $this.isAjax['more_msg']=false;
			//ready();
        });
    }

	this.updateOneChat = function(data,isLoadMore){
        var $html=data;
        if(isLoadMore){
            $html=$(data);
        }
        var $listMsg=$html.find('div.im_msg_one');
        if (isLoadMore) {
            $listMsg=$html.filter('div.im_msg_one');
        }
        $html.find('script').appendTo('#update_server');
		if($listMsg[0]){
			if(!(isLoadMore||0)){
				$this.showMsgUpdate($listMsg);
			}else{
                $this.showMsgHistory($listMsg);
			}
		}
    }

    this.showMsgUpdate = function($listMsg){
        var msgId, t=350, i=0;
        (function fu(){
            var item=$listMsg.eq(i);
			if(!item[0])return;
			msgId=item.data('id');
			i++;
            //if(msgId!='block')$this.setLastId(msgId);
            $this.setLastMid(msgId);
			if($('#msg_'+msgId)[0]||$('#msg_'+item.data('send'))[0]){
				fu();
				return;
			}
			item.find('script').remove();
			$this.showMsgOne(item,t*=.9,fu);
        })()
    }

	this.showMsgHistory = function($listMsg){
        var msgId,t=200,i=$listMsg.length-1;
        (function fu(){
            var item=$listMsg.eq(i);
            msgId=item.data('id');
            if(msgId==$this.firstMsgId){
                $this.stop=1;
            }
			if(!item[0]||i<0)return;
			i--;
            if(!$('#msg_'+msgId)[0]&&!$('#msg_'+item.data('send'))[0]){
                $this.showMsgOne(item,t*=.9,false,'insertAfter',$jq('#msg_profile_pic'),1);
            }
            fu();
        })()
    }

    this.showMsgOne = function($msg,t,call,fnTo,cont,scrollToY){
		!userAllowedFeature['message_read_receipts']&&$msg.find('.upgrade_msg').show();
        fnTo=fnTo||'appendTo';
        if(fnTo=='appendTo'){
            $jq('#bl_overview').removeClass('animate');
            $msg.addClass('sent');
        }
		$msg.css({opacity:0, display:'none', overflow:'hidden'})[fnTo||'appendTo'](cont||$jq('#chat_cont'))
		.animate({opacity:1,height:'toggle'},
                 {duration:t||450,
				  specialEasing: {
					opacity: 'linear',
					//height: 'easeOutQuart'
				  },
                  step:function(h,fn){
                        $this.reInitToScrollPanelChat(scrollToY||0);
                  },
                  complete:function(){
                        $this.reInitToScrollPanelChat(scrollToY||0);
						if(typeof call=='function')call();
                        if($jq('#msg_profile_pic').not(':visible')[0]&&$('#msg_'+$this.firstMsgId)[0]){
                            $jq('#msg_profile_pic').slideDown({
                                duration:t,
                                step:function(){
                                    $this.reInitToScrollPanelChat(1);
                                },
                                complete:function(){
                                    $this.reInitToScrollPanelChat(1);
                                }
                            });
                            //$jq('#msg_profile_pic').slideDown(t,function(){
                                //$this.reInitToScrollPanelChat(1);
                           // })
                        }
                        $msg.removeClass('sent');
                        if(fnTo=='appendTo'&&!$jq('#bl_overview').find('.im_msg_one.sent')[0]){
                            $jq('#bl_overview').addClass('animate');
                        }
                  }
        })
	}

    this.send = function(){
		var text=$.trim($jq('#msg_text').val());
        $jq('#msg_text').val('').trigger('autosize');
		if(!text)return false;
		var send= +new Date,
			$msg=$jq('#template_msg').clone();
		var $node=$msg.find('.info').html(strToHtml(text));
		$msg.attr({'id':'msg_'+send,'data-msg-user-id':$this.guid,'data-to-user-id':userTo,'data-id':0,'data-send':send})
            .data({dataMsgUserId:$this.guid, dataToUserId:userTo, id:0, send:send})
		$this.showMsgOne($msg);
        $.post(url_main+'messages.php?cmd=send_message&display=one_chat',
			  {ajax:1,user_to:userTo,msg:text,send:send,to_delete:0},
              function(res){
                var data=checkDataAjax(res);
                if(data!==false){
                    if(data=='redirect'){
						redirectUrl('messages.php')
                    }else{
						data=$($.trim(data));
                        if(!data[0]||!data[0].id)return;
                        if($('#'+data[0].id,$this.scrollBox)[0]&&data[0].id.indexOf('system')==-1)return;
						var dataId=data.data('id');
                        $msg.attr({'id':data[0].id,'data-id':dataId})
                            .data('id',dataId);
                        $msg.find('.msg_read').attr({'id':'msg_read_'+dataId});
                        data.filter('script').appendTo('#update_server');
						$msg.find('.date_msg').html(data.find('.date_msg').html()).fadeTo($this.dur,1);
						var txt=data.find('.info').html();
                        if(trim(txt)!=$node.html()){
                            $node.html(txt);
                            $this.reInitToScrollPanelChat();
                        }
                    }
				}
        });
		return false;
    }

	this.isReInitPanel=false;
	this.reInitToScrollPanelChat = function(posY){
        posY=posY||'bottom';
        $this.scrollBoxPl.update(posY);
    }

	this.checkExistenceMessagesOneChat = function(existingMsg){//Not used - DISABLED
        var existingMsg = jQuery.parseJSON(existingMsg),$msg,$block,numberMsg;
        for (var mid in $this.messagesCache[userTo]) {
            if($.type(existingMsg[mid])!=='number'){
                delete $this.messagesCache[userTo][mid];
                if(mid.indexOf('system')==-1){
                    $('#msg_'+mid).slideUp({
                        duration:200,
                        step:function(){$this.reInitToScrollPanelChat()},
                        complete:function(){
                            $(this).remove();
                            $this.reInitToScrollPanelChat()
                        }
                    })
                }
            }
        }
    }

	this.setReadMsg = function(mid){
        var $mark=$('#msg_read_'+mid+'.hide');
        if ($mark[0]) {
            $('[data-msg-user-id='+siteGuid+'].im_msg_one .msg_read.hide').each(function(){
                var $el=$(this),id=$el.closest('.im_msg_one').data('id');
                //console.log('SET',id);
                if(id<=mid)$el.removeClass('hide');
            })
        }
    }

    this.setWritingOneChat = function(){
        status_writing = parseInt(new Date()/1000);
    }

    this.deleteWritingUser = function(){
		return;
        var $wrBlock=$('.is_writing',$this.messagesBox).closest('.item');
        if($wrBlock[0]){
            $wrBlock.stop().slideUp(300,function(){
                $wrBlock.remove();
                clearInterval($this.blink);
            });
        }
    }

    this.deleteWritingUserAfterMsg = function(dur){
		return;
        var $wrBlock=$('.is_writing',$this.messagesBox).closest('.item');
        if($wrBlock[0]){
            $wrBlock.hide(dur,function(){
                $wrBlock.remove();
                clearInterval($this.blink);
            });
        }
    }


    this.setWritingUser = function(){
		return;
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
    /* ONE CHAT */

    /* GENERAL CHATS */
    this.initGeneral = function(){
        userTo=0;
        isOneChat='general_chat';
        $(function(){
            $this.showLinkNoOneFound(1);
            $this.messagesBox=$('#messages_box');
            $this.init();
            $jq('.main').scroll(function(){
                if($jq('.main').scrollTop()>($('.column_main').height()-$jq('.main').height()-1000)){
                   $this.uploadingHistoryGeneral();
                }
            })
        })
    }

    this.showPhotoUser = function(sel,urlPhoto){
        var $photoBl=$(sel);
        if($photoBl.is('to_opacity_show'))return;
        $('<img src="'+urlPhoto+'"/>').load(function(){
            $photoBl.toggleClass('to_opacity_hide to_opacity_show')
        })
    }

    this.hideLinkNoOneFound = function(dur){
        if($('.im_general_user',$this.messagesBox)[0]){
			$jq('#im_list_users_empty').fadeOut($this.dur);
		}
    }

    this.showLinkNoOneFound = function(dur){
		if(!$('.im_general_user',$this.messagesBox)[0]){
			$jq('#im_list_users_empty').fadeIn(dur||$this.dur);
		}
    }

    /* Clearing history */
    this.switchAction = function(is,$el,clear){
		var dur=$this.dur*.7,$date=$('.info_date', $el);
        clear=clear||0;
		if(!$date[0])return;
		if(is){
            $date.clearQueue();
            $('.delete', $el).clearQueue();
            $date.data('action',setTimeout(function(){
                $date.stop().fadeOut(dur);
                $('.delete', $el).stop().fadeIn(dur);
            },500));
		}else{
            !clear&&clearTimeout($date.data('action'));
			$date.stop().delay(50).fadeIn(dur);
			$('.delete', $el).stop().delay(50).fadeOut(dur);
		}
	}

	this.historyClear = function($el){
		$this.isClearIm=false;
		var uid=$el.data('uid');
		$el.html(getLoader('im_clear_history',false));
		$.post(url_main+'messages.php', {ajax:1, cmd:'clear_history_messages', user_id:uid}, function(res){
			var data=checkDataAjax(res);
			if(data){
				$this.removeGeneralImUser(uid);
                $this.uploadingHistoryGeneral(1);
			}else{
				alertServerError()
			}
        })
    }
    /* Clearing history */
    /* Upload history */
    this.updateHistoryGeneral = function(data){
        var $data=$('<div>'+data+'</div>');
        $data.find('script:not(.in_content)').appendTo('#update_server');
        var $ims=$data.find('.im_general_user');
        if(!$ims[0])return;
        var i=0;
        (function fu(){
            var $item=$ims.eq(i);
            if($item[0]){
                var $existsIm=$('#im_'+$item.data('uid'));
                if(!$existsIm[0]){
                    $item.addClass('to_hide').appendTo($this.messagesBox).delay(10).removeClass('to_hide',0);
                    i++; fu();
                }else{
                    i++; fu();
                }
            }
        })()
    }

    this.uploadingHistoryGeneral = function(limit){
        limit=limit||0;
        if($this.ajaxUpdateGeneralChat&&!limit)return;
        var isMoreMsg=$this.isAjax.more_msg;
        if(limit)isMoreMsg=0;
        if(isMoreMsg||$this.stop)return;
        console.log('UPLOAD HISTORY GENERAL stop:', $this.stop, ' limit:', limit);
        $jq('#loader_messages').removeClass('hidden');
        console.log($this.imHistoryMessages);
        if(limit){
            start=limitStart+$this.imHistoryMessages-limit;
        } else {
            limitStart+=$this.imHistoryMessages;
            start=limitStart;
        }
        $this.isAjax.more_msg=true;
        $.post(url_main+'messages.php',{ajax:1, user_id:userTo, limit_start:start, limit:limit}, function(res){
            $jq('#loader_messages').addClass('hidden');
            var data=checkDataAjax(res);
            if(data!==false){
                var data=$.trim(data);
                if(data===''){$this.stop=1;return}
                $this.updateHistoryGeneral(data);
            }else{
                alertServerError();
            }
			$this.isAjax.more_msg=false;
        })
    }
    /* Upload history */

    this.setStatusNewMessagesFromUsers = function(msgFromUsers){
        var $newMail;
        for (var uid in msgFromUsers) {
            $newMail=$('#new_mail_'+uid);
            if($newMail[0]){
                var n=Boolean(msgFromUsers[uid]*1);
                if(n!=$newMail.is('.unread'))$newMail[n?'addClass':'removeClass']('unread',0);
            }
        }
    }

    this.setCounterNewMessagesFromUsers = function(msgFromUsers){
        var $im,count;
        for (var uid in msgFromUsers) {
            $im=$('#im_'+uid);
            if($im[0]){
                if($im.data('newMsg')!=msgFromUsers[uid]){
                    console.log(uid,msgFromUsers[uid]);
                    $im.data('newMsg',msgFromUsers[uid]);
                    $('#im_user_name_'+uid).find('.count').fadeTo(250,0,function(){
                        count='';
                        if(msgFromUsers[uid]>1){
                            count=l('general_im_title_count').replace(/{count}/,msgFromUsers[uid]);
                        }
                        $(this).html(count).fadeTo(250,1);
                    })
                }
            }
        }
    }

    this.updateOnlineUsers = function(usersStatus){
        for (var uid in usersStatus) {
            users_list[uid]=usersStatus[uid];
            $('#im_user_status_'+uid).fadeTo(400,usersStatus[uid]);
        }
    }

    this.removeGeneralImUser = function(uid,cl){
        cl=cl||'to_hide';
        $this.messagesCacheRemoveByUid(uid);
        $this.usersCacheRemove(uid);
        $('#im_'+uid).oneTransEnd(function(){
            $(this).remove();
			$this.showLinkNoOneFound();
        }).addClass(cl);
	}

    this.ajaxUpdateGeneralChat=0;
    this.removeUsersGeneralChat = function(users){
        for (var uid in users) {
            //console.log('REMOVE GENERAL IM', uid);
            $this.removeGeneralImUser(uid,'to_remove');
        }
    }

    this.setOrderUsersGeneralChat = function(users){
        for (var uid in users) {
            //console.log('SET or', uid,users[uid]);
            $('#im_'+uid).attr('data-check-order',users[uid]).data('checkOrder',users[uid]);
        }
    }

    this.checkOrderUsersGeneralChat = function(users){
        var $chats=$('.im_general_user[data-check-order!=""]',$this.messagesBox);
        if (!$chats[0]) {
            $this.ajaxUpdateGeneralChat=0;
            return;
        }
        var i=0;
        (function fu(){
            var $item=$chats.eq(i);
            if (!$item[0]){
                $this.ajaxUpdateGeneralChat=0;
                return;
            }
            var o=$item.data('checkOrder'),ro=$item.index('.im_general_user');
            $item.attr('data-check-order','').data('checkOrder','');
            //if(ro)ro--;
            //console.log('CHECK ORDER',$item[0].id,o,ro);
            if(o!=ro){
                if(!o){
                    var $eQ0=$('.im_general_user',$this.messagesBox).eq(0);
                    if ($eQ0[0]&&$item[0].id!=$eQ0[0].id) {
                        $item.oneTransEnd(function(){
                            $item.prependTo($this.messagesBox).oneTransEnd(function(){
                            }).removeClass('to_hide',0);
                            i++; fu();
                        }).addClass('to_hide',0);
                    }else{
                        i++; fu();
                    }
                }else{
                    o--;
                    var $eQo=$('.im_general_user',$this.messagesBox).eq(o);
                    if($eQo[0]&&$item[0].id!=$eQo[0].id){
                        $item.oneTransEnd(function(){
                            $item.insertAfter($eQo).oneTransEnd(function(){
                            }).removeClass('to_hide',0);
                            i++; fu();
                        }).addClass('to_hide',0);
                    }else{
                        i++; fu();
                    }
                }
            }else{
                i++; fu();
            }
        })()
    }

	this.update = function($data){
        console.log('SERVER UPDATE GENERAL CHATS',last_id,$this.ajaxUpdateGeneralChat);
        if(activePage != 'messages.php')return;
        if($this.ajaxUpdateGeneralChat)return;
        //$this.ajaxUpdateGeneralChat=1;
        console.log('SERVER UPDATE GENERAL CHATS EXECUTE');
        $data.find('.script > script').appendTo('#update_server');
        setTimeout(function(){
            var $chats = $data.find('.im_general_user').addClass('to_hide');
            if ($chats[0]) {
                var i=0;
                (function fu(){
                    var $item=$chats.eq(i);
                    if (!$item[0]){
                        $this.checkOrderUsersGeneralChat();
                        return;
                    }
                    var $im=$('#'+$item[0].id);
                    if(!$im[0]){
                        var order=$item.data('order');
                        var $itemMsg=$item.find('.im_msg_one'),
                            itemMsgId=$itemMsg.data('id');
                        //if(itemMsgId>last_id)last_id=itemMsgId;
                        $this.setLastMid(itemMsgId);
                        if(!order){
                            $item.prependTo($this.messagesBox)
                            .delay(10).oneTransEnd(function(){
                                i++; fu();
                            }).removeClass('to_hide',0);
                        }else{
                            order--;
                            $item.insertAfter($('.im_general_user').eq(order))
                            .delay(10).oneTransEnd(function(){
                                i++; fu();
                            }).removeClass('to_hide',0);
                        }
                        $this.hideLinkNoOneFound();
                    }else{
                        var $itemMsg=$item.find('.im_msg_one'), $imMsg=$im.find('.im_msg_one'),itemMsgId=$itemMsg.data('id');
                        if (itemMsgId>$imMsg.data('id')) {
                            $this.messagesCacheRemoveByMid($im.data('uid'),$imMsg.data('id'));
                            //if(itemMsgId!='block')last_id=itemMsgId;
                            $this.setLastMid(itemMsgId);
                            var dur=300;
                            $im[$item.find('.item').is('unread')?'addClass':'removeClass']('unread');
                            $im.find('.info_bl').slideUp(dur,function(){
                                $(this).html($item.find('.info_bl').html()).slideDown(dur,function(){});
                            });
                            $im.find('.info_date').slideUp(300,function(){
                                $(this).html($item.find('.info_date').html()).slideDown(dur,function(){});
                            });
                        }
                        i++; fu();
                    }
                })()
            }else{
                $this.checkOrderUsersGeneralChat();
                $this.showLinkNoOneFound();
            }
        },400)
    }
    /* GENERAL CHATS */

	this.showOriginalMessage=function($el) {
        $el.fadeOut(300);
        $el.parent('.pp_message_original_title').next('.pp_message_original_text').slideDown(300);
    }

    this.updateCounter = function(count){
        var $count=$jq('#narrow_messages');
        count *=1;
        var countNarrow=$count.text()*1;
        if(count>countNarrow)playSound();
        updateCounter('#narrow_messages',count,1)
    }

    $(function(){

    })

    return this;
}
