var CMessages = function(guid) {

    var $this=this;

    this.guid = guid;
    this.imHistoryMessages = 0;
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

    /*this.init = function(){
        $this.$wnd = $(window);
        $this.$stContent = $('.st-content-inner');
        $this.updateServer = $('#update_server');


        $this.numberNewMessagesBox = $('.number_new_messages');
        $this.userMenuNewMessages = $('#user_menu_counter_messages');
        $this.$counterEventsUserMenu=$('#counter_events')
        $this.messageSettings = $('#message_settings');

    }*/

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
        console.log('SET LAST ID1', last_id);
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
        //console.log('SET LIMIT GENERAL limit:',limitLoad,' limitStart:',limitStart,' stop:',$this.stop);
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
        //console.log('MESSAGE ADD', uid, mid, isSp);
		//if ($this.messagesCache[uid][mid]) return;
		$this.messagesCache[uid][mid] = isSp*1;
	}

    this.messagesCacheRemoveByMid = function(uid, mid) {
		if (!$this.messagesCache[uid][mid]) return;
		delete $this.messagesCache[uid][mid];
	}

	this.messagesCacheRemoveByUid = function(uid) {
        if (!$this.messagesCache[uid]) return;
		delete $this.messagesCache[uid];
	}

    this.clearCacheAll = function() {
        users_list={};
        $this.messagesCache={};
    }

    /* Upgrade Menu TO -> profile.js*/
    this.$counterEventsUserMenu=false;
    this.setNumberMessages = function(counter, lastNewMessageUserId, lastNewMessageText){
        //console.log(counter, lastNewMessageUserId, lastNewMessageText, imMessagesCount);
        if ($this.$counterEventsUserMenu === false) {
            $this.$counterEventsUserMenu=$('#counter_events');
        }
        counter=counter*1;
        if($this.$counterEventsUserMenu[0]){
            $this.$counterEventsUserMenu[counter?'addClass':'removeClass']('to_show');
        }
        if(!counter)counter='';
        updateCounter('messages',counter);

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
    }
    /* Upgrade Menu TO -> profile.js*/

    /* ONE CHAT */
    this.notMoreMsg = function(mid) {
        var mid=mid||$this.firstMsgId;
        if($('#msg_'+mid)[0]){
            $this.firstMsgId=0;
        }
	}

    this.clearChat = function(){
        console.log('CLEAR');
        appCurrentImUserId=0;
        users_list={};
        isOneChat='';
        userTo=0;
        limitStart=0;
        last_id=0;
    }

    this.initOneChat = function(user_to, url_photo, user_name, limit_start, first_msg_id, user_to_photo, user_to_name, url_page_profile_view){
        //$('#main').css({overflow:'hidden!important'});
        $('body').addClass('fixFixed');
        //$('#wrapper, #content, .message_chat').css('height', '100%');
        $this.messageTextBlH=0;
        $this.messagesCont=$('#message_cont');
        $this.$messagesBox=$('#messages_box');
        $this.$profilePic=$('#one_chat_profile_pic');
        $this.$messageTextBl=$('#message_field_chat');
        $this.$messageText=$('#message_text');
        $this.$messageText.autosize({isSetScrollHeight:false,callback:$this.prepareMessagesCont});
        appCurrentImUserId=user_to;
        $this.usersCacheAdd(user_to);
        userTo=user_to;
        limitStart=limit_start*1;
        isOneChat='one_chat';
        $this.isAjax={access:0, more_msg:0, send:0};
        $this.stop=0;
        $this.firstMsgId=first_msg_id*1;

        $this.notMoreMsg();

        $this.$loaderBox=$('#loader_box_msg');//to_hide to_show
        $this.$htmlMsgBlock=$('<div class="im_msg_one to_show"><div class="item answer">'+
                                '<div class="msg">'+
                                    '<div class="info">'+
                                        '<p><strong class="name">'+user_name+'</strong><span class="data">'+l('just_now')+'</span>'+
                                        '<span class="icon_check msg_read hide"></span>'+
                                        '</p>'+
                                        '<p class="msg_txt"></p>'+
                                    '</div>'+
                                    '<div class="pic">'+
                                        '<button title="" style="background-image: url('+url_files+url_photo+');"></button>'+
                                    '</div>'+
                                '</div>'+
                              '</div></div>');

        $this.$htmlMsgWriteBlock=
                $('<div id="msg_write" class="im_msg_one to_show left write" data-send="0" data-id="0" data-msg-user-id="'+userTo+'" data-to-user-id="'+userTo+'">'+
                    '<div class="item">'+
                        '<div class="msg">'+
                            '<div class="pic go_to_page" data-cl-loader="loader_one_chat_msg_to_profile" data-type-loader="fade_btn" data-url="'+url_page_profile_view+'?user_id='+userTo+'">'+
                                '<button id="msg_user_pic_chat_write" class="to_opacity_show" style="background-image: url('+urlFiles+user_to_photo+');"></button>'+
                            '</div>'+
                            '<div class="info">'+
                                '<p><strong class="name">'+user_to_name+'</strong></p>'+
                                '<p class="msg_txt"><span class="blink_msg">...</span></p>'+
                            '</div>'+
                        '</div>'+
                    '</div>'+
                '</div>');
        $this.$btnSend=$('#message_btn_send');
        $this.$messageText.keydown(function(e){
            if (e.which == 13){
                $this.send();
                return false;
            }
        }).focus(function(){
            //setTimeout($this.reInitToScrollChat,200)
        }).on('change propertychange input', $this.setWritingOneChat);

        $this.messagesCont.scroll(function(e){
            if (!$this.messagesCont.scrollTop()){
                $this.uploadingMsg();
            }
        });

        $win.on(getEventOrientation(), function(){setTimeout(function(){$this.prepareMessagesContResize(400)},getTimeOrientation())});
        $this.reInitToScrollChat();
        $('.message_chat').addClass('to_show',0);
        $this.$messageText.focus();

        /* Access private photo */
        $('body').on('click', '.photo_grant_access, .photo_deny_access, .go_to_albums', function(e){
            var el=$(this);
            if(el.is('.photo_grant_access') || el.is('.photo_deny_access')){
                if($this.isAjax.access)return false;
                var type='request_approved',
                    msg=l('private_photo_you_granted_access');
                if (el.is('.photo_deny_access')) {
                    type='request_declined';
                    msg=l('private_photo_request_declined');
                }
                var $block=el.closest('.im_msg_one'),mid=$block.data('id'),uid=el.data('userId');
                el.data('clLoader','loader_msg_access').addLoader();
                $this.isAjax.access=1;
                $.post(url_main+'tools_ajax.php',{cmd:'send_request_private_access',type:type,user_to:uid,mid:mid},
                    function(res){
                         if(checkDataAjax(res)){
                            $block.addClass('initial').find('.item').oneTransEnd(function(){
                                $block.find('.item').addClass('answer');
                                $block.find('.msg_txt').html(msg);
                                $block.find('.name').text(user_name);
                                $block.find('button').css('background-image','url('+url_files+url_photo+')');
                                $(this).oneTransEnd(function(){$block.removeClass('initial')}).removeClass('to_hide');
                            }).addClass('to_hide',0);
                        }
                        $this.isAjax.access=0;
                })
            } else if (el.is('.go_to_albums')) {
                getPage(el,this.href,false,true);
            }
            return false;
        })
        /* Access private photo */
        if(!checkWebrtc())$('.btn_audio_video').remove();
        $this.$messageTextBl.addClass('to_show');
    }

    this.prepareMessagesCont = function(ta,ta,height){
        var th=parseInt(ta)+16;
        if($this.messageTextBlH!=th){
            $this.messageTextBlH=th;
        }else{
            th=0;
        }
        if(th){
            /*var h=$win[0].innerHeight-th-50;
            $this.messagesCont.height(h);
            if($this.$profilePic.is('.hide')){
                h -=$this.$profilePic.outerHeight(true);
                $this.$messagesBox.css({minHeight:(h+1)});
            }*/
            $this.prepareMessagesContResize();
            //console.log(th);
        }
    }

    this.prepareMessagesContResize = function(d){
        //$this.messagesCont.height($win[0].innerHeight-$this.messageTextBlH-50);
        //console.log($this.messageTextBlH);
        $this.$messagesBox.css({paddingBottom:$this.messageTextBlH-57})
        if($this.$messageText.is(':focus')){
            if($this.sendMsg){
                $this.reInitToScrollChat();
            }else{
                $this.reInitToScrollChatAnimate(d);
            }
        }
        if($this.$profilePic.is('.hide')){
            //$this.$messagesBox.css({minHeight:($this.messagesCont.height()-19)});
            $this.$messagesBox.css({minHeight:($this.messagesCont.height()+1)});
        } else {
            $this.$messagesBox.css({minHeight:($this.messagesCont.height()-128)});
        }
    }

    this.reInitToScrollChat = function(scrollToY){
        var sc=defaultFunctionParamValue(scrollToY, $this.messagesCont[0].scrollHeight);
        //console.log('SCROLL',sc);
        $this.messagesCont[0].scrollTop=sc;
    }

    this.reInitToScrollChatAnimate = function(d, scrollToY){
        console.log('ANIMATE');
        var sc=defaultFunctionParamValue(scrollToY, $this.messagesCont[0].scrollHeight);
        $this.messagesCont.delay(1)//.animate({scrollTop:sc},d||1800)
        .animate({scrollTop:sc},d||800)
    }

    this.showMsgOne = function($msg,t,call,fnTo,cont,scrollToY){
		//!isCurUserSuperPowers&&$msg.find('.upgrade_msg').show();
		$msg.css({opacity:0, display:'none', overflow:'hidden'})[fnTo||'appendTo'](cont||$this.$messagesBox)
		.animate({opacity:1,height:'toggle'},
                 {duration:t||450,
				  specialEasing: {
					opacity: 'linear',
					//height: 'easeOutQuart'
				  },
                  step:function(h,fn){
                    $this.reInitToScrollChat(scrollToY);
                  },
                  complete:function(){
                        $this.reInitToScrollChat(scrollToY);
						if(typeof call=='function')call();
                        if(!$this.firstMsgId&&$jq('#one_chat_profile_pic').is('.hide')){
                            $jq('#one_chat_profile_pic').slideDown({
                                duration:t,
                                step:function(){
                                    $this.reInitToScrollChat(1);
                                },
                                complete:function(){
                                    $this.reInitToScrollChat(1);
                                    $jq('#one_chat_profile_pic').removeClass('hide');
                                }
                            })
                        }
                  }
        })
	}

    this.showMsgBouncein = function($msg,call,fnTo,scrollToY){
        var cont=$this.$messagesBox;
        if(!fnTo){
            fnTo='appendTo';
            var $lastWrite=$('.write',$this.$messagesBox);
            if($lastWrite[0]){
                fnTo='insertBefore';
                cont=$lastWrite;
            }
        }
        $msg.oneAnimationEnd(function(){
            if(typeof call=='function')call();
            if(!$this.firstMsgId&&$jq('#one_chat_profile_pic').is('.hide')){
                $jq('#one_chat_profile_pic').slideDown({
                    duration:300,
                        step:function(){
                            $this.reInitToScrollChat(1);
                        },
                        complete:function(){
                            $this.reInitToScrollChat(1);
                            $jq('#one_chat_profile_pic').removeClass('hide');
                        }
                })
            }
        })[fnTo](cont);
        setTimeout(function(){$this.reInitToScrollChat(scrollToY)},10);
        //$this.reInitToScrollChatAnimate(scrollToY);
    }

    this.sendMsg = false;
    this.send = function(msg){
        if (typeof msg!='string') msg=0;
        var msg=msg||$.trim($this.$messageText.val());
        if(!msg){
            $this.$messageText.val('').trigger('autosize').focus();
            return false;
        }
        var send= +new Date, $msg=$this.$htmlMsgBlock.clone();
        var $node=$msg.find('.msg_txt').html(strToHtml(msg));
		$msg.attr({'id':'msg_'+send,'data-msg-user-id':$this.guid,'data-to-user-id':userTo,'data-id':0,'data-send':send})
            .data({dataMsgUserId:$this.guid, dataToUserId:userTo, id:0, send:send});

        //$this.showMsgOne($msg);
        $this.sendMsg = true;
        $this.$messageText.val('').trigger('autosize',function(){
            $this.showMsgBouncein($msg)
        }).focus()
        $this.sendMsg = false;
        msg=emojiToHtml(msg);
        //return false;
        $.post(url_main+'messages.php?cmd=send_message&display=one_chat',
               {ajax:1,user_to:userTo,msg:msg,send:send,to_delete:0},
               function(res){
                    var data=checkDataAjax(res);
                    if(data!==false){
                        if(data=='redirect'){
                            getPage([],urlPagesSite.messages,false)
                        }else{
                            data=$($.trim(data));
                            if(!data[0]||!data[0].id)return;
                            if($('#'+data[0].id,$this.$messagesBox)[0]&&data[0].id.indexOf('system')==-1)return;
                            var dataId=data.data('id');
                            $msg.attr({'id':data[0].id,'data-id':dataId})
                                .data('id',dataId);
                            $msg.find('.icon_check').attr('id','msg_read_'+dataId);
                            data.filter('script:not(.in_content)').appendTo('#update_server');
                            //$msg.find('.data').html(data.find('.data').html()).animate({width:'toggle',paddingRight: '5px'},{duration:200});
                            var txt=data.find('.msg_txt').html();
                            if(trim(txt)!=trim($node.html())){
                                $node.html(txt);
                                $this.reInitToScrollChat();
                            }
                        }
                    }
        })
		return false;
    }

    this.setWritingOneChat = function(){
        status_writing = parseInt(new Date()/1000);
    }

    /* Upload more scroll top msg */
    function ready(){if ($this.isAjax['more_msg']) {clearTimeout($this.isAjax['more_msg']); $this.isAjax['more_msg']=0}};
    this.uploadingMsg = function(){
        if ($this.isAjax['more_msg']||!$this.firstMsgId||$this.stop) return;
        $this.$loaderBox.addClass('show');
        limitStart+=$this.imHistoryMessages;
        $this.isAjax['more_msg']=setTimeout(ready, $this.wait);
        $.post(url_main+'messages.php',{ajax:1, display:'one_chat', user_id:userTo, limit_start:limitStart}, function(res){
            $this.$loaderBox.removeClass('show');
            var data=checkDataAjax(res);
            if(data!==false){
                var data=$.trim(data);
                if(data===''){$this.stop=1;return}//$this.firstMsgId=0;
                var $html=$('<div>'+data+'</div>'), $listMsg=$html.find('.im_msg_one');
                $html.children('script:not(.in_content)').appendTo('#update_server');
                //$this.$loaderBox.oneTransEnd(function(){
                    $this.showUploadingMsg($listMsg);
                //}).removeClass('show');
            }else{
                serverError();
            }
            ready();
        });
    }

    this.showUploadingMsg = function($listMsg){
        var $msg, firstId, mid, t=600,i=$listMsg.length-1;
        firstId = $this.firstMsgId;
        (function fu(){
            if(i<0)return false;
            var item=$listMsg.eq(i);
            item.slideUp(t*=.7, function(){
                $msg=$(this);
                $msg.addClass($msg.data('msgUserId')==$this.guid?'to_show_upload':'to_show_upload left');//.hide();
                mid=$msg.data('id');
                if($this.firstMsgId==mid)$this.firstMsgId=0;
                if(!$('#msg_'+mid,$this.$messagesBox)[0]){
                    //if(t<180)t=180;
                    $this.showMsgBouncein($msg.css({animationDuration:t+'ms'}),false,'prependTo',1);
                    setTimeout(function(){i--; fu();},t)
                    //$this.showMsgOne($msg,t,function(){i--; fu();},'prependTo',false,1);
                }else{
                    i--; fu();
                }
            })
        })()
    }
    /* Upload more scroll top msg */
    /* Update server */
    this.updateOneChat = function(data){
        var $html=$('<div>'+data+'</div>');
        var $listMsg=$html.find('.im_msg_one'), $msg, $block, $appendBlock, $listMsgBlock,
            lastMsgUid, msgUid, mid, isShowMsg, t=500,i=0;
        if($listMsg[0]){
            (function fu(){
                var item=$listMsg.eq(i);
                if(!item[0]){
                    $html.children('script:not(.in_content)').appendTo('#update_server');
                    return;
                }
                mid=item.data('id');
                $this.setLastMid(mid);
                if(!$('#'+item[0].id,$this.$messagesBox)[0]){
                    item.addClass(item.data('msgUserId')==$this.guid?'to_show':'to_show left')
                    .css({animationDuration:t+'ms'});
                    //console.log(item[0].id);
                    $this.showMsgBouncein(item,function(){i--; fu();});
                    t*=.9;
                    //$this.showMsgOne(item,t,function(){i++; fu();});
                }else{
                    i++; fu();
                }
            })()
        }else{
            $html.children('script:not(.in_content)').appendTo('#update_server');
        }
    }

    this.setReadMsg = function(mid){
        //console.log('SET READ MSG', mid);
        var $mark=$('#msg_read_'+mid+'.hide');
        if ($mark[0]) {
            $('[data-msg-user-id='+siteGuid+'].im_msg_one .msg_read.hide').each(function(){
                var $el=$(this),id=$el.closest('.im_msg_one').data('id');
                //console.log('SET',id);
                if(id<=mid)$el.removeClass('hide');
            })
        }
    }
    /* Update server */

    this.showOriginalMessage = function($el){
        var $orig=$el.closest('.msg_original_title').next('.msg_original_text').not(':animated');
        if($orig[0]){
            var isV=$orig.is(':visible');
            $el.text(isV?l('show_original_message'):l('hide_original_message'))
            $orig.stop()[isV?'hide':'show'](250);
        }
    }
    /* ONE CHAT */

    /* Prints a message+ */
    this.updateWritingUser = function(){
        if($('.write',$this.$messagesBox)[0])return;
        $this.showMsgBouncein($this.$htmlMsgWriteBlock.clone());
    }

    this.deleteWritingUser = function(){
        var $wrBlock=$('.write',$this.$messagesBox);
        if(!$wrBlock[0])return;
        $wrBlock.animate({width:'toggle',height:'toggle'},
                 {duration:400,
                  step:function(h,fn){
                    $this.reInitToScrollChat();
                  },
                  complete:function(){
                    $this.reInitToScrollChat();
                    $wrBlock.remove();
                  }
        })
    }
    /* Prints a message+ */

    /* GENERAL CHATS */
    this.initGeneral = function(){
        $this.ajaxUpdateGeneralChat=0;
        userTo=0;
        isOneChat='general_chat';
        $this.updateServer = $('#update_server');
        $this.messagesBox = $('#messages_box');
        $this.messagesCont = $('#content').css('min-height',$win[0].innerHeight-50+1);
        $win.on('resize orientationchange', function(){
            $this.messagesCont.css('min-height',$win[0].innerHeight-50+1);
        });
        $this.$noOneFound = $('.no_one_found');
        $this.$loaderGeneral=$('#loader_general');
        $this.isAjax={access:0, more_msg:0, send:0};
        //$this.stop=0;
        $this.showLinkNoOneFound();
        $jq('#main').scroll(function(e){
            if (this.clientHeight+this.scrollTop>$this.messagesBox.height()+10){
                $this.uploadingHistoryGeneral();
            }
        })[0].scrollTop=0;

        $('body').off('mousedown touchstart').on('mousedown touchstart', '.to_one_chat .data', function(e){
            var $el=$(this);
            if($el.closest('.to_one_chat').find('.css_loader')[0])return false;
            if($('.delete', $el).is('.to_show')){
                $this.actionClear[$el[0].id]=true;
                showConfirm(l('really_delete_all_messages'),
                    function(){$this.historyClear($el); $this.actionClear[$el[0].id]=false;},
                    function(){
                        var $date=$('.info_date_bl', $el);
                        clearTimeout($date.data('action'));
                        $date.removeClass('to_hide');
                        $('.delete', $el).removeClass('to_show');
                        $this.actionClear[$el[0].id]=false;})
			}else{
                $this.showActionClear($el)
            }
			return false;
        }).off('mouseup touchend').on('mouseup touchend', '.to_one_chat .data', function(e){
            var $el=$(this);
            if($el.closest('.to_one_chat').find('.css_loader')[0]) return false;
            $this.hideActionClear($el);
            return !$('.info_date_bl', $el).is('.to_hide');
        }).off('click', '.to_one_chat').on('click', '.to_one_chat', function(e){
            var $el=$(this),$date=$el.find('.data');
            if($el.find('.css_loader')[0])return false;
            if ($('.info_date_bl', $date).is('.to_hide')||$this.actionClear[$date[0].id])return false;
            $this.toOneChat($date.data('uid'));
        }).on('click', '.photo_grant_access, .photo_deny_access, .go_to_albums', function(e){
            var el=$(this);
            if(el.is('.photo_grant_access') || el.is('.photo_deny_access')){
                if($this.isAjax.access)return false;
                var type='request_approved',
                    msg=l('private_photo_you_granted_access');
                if (el.is('.photo_deny_access')) {
                    type='request_declined';
                    msg=l('private_photo_request_declined');
                }
                var $block=el.closest('.im_msg_one'),mid=$block.data('id'),uid=el.data('userId');
                el.data('clLoader','loader_msg_access').addLoader();
                $this.isAjax.access=1;
                $.post(url_main+'tools_ajax.php',{cmd:'send_request_private_access',type:type,user_to:uid,mid:mid},
                    function(res){
                        if(checkDataAjax(res)){
                            $block.slideUp(300, function(){
                                $block.html(msg).slideDown(300);
                            })
                        }
                        $this.isAjax.access=0;
                })
            } else if (el.is('.go_to_albums')) {
                getPage(el,this.href,false,true);
            }
            return false;
        })
    }

    this.showPhotoUser = function(sel,urlPhoto){
        var $photoBl=$(sel);
        if($photoBl.is('to_opacity_show'))return;
        $('<img src="'+urlPhoto+'"/>').load(function(){
            $photoBl.toggleClass('to_opacity_hide to_opacity_show')
        })
    }

    this.toOneChat = function(uid){
        goToPage($('#msg_user_pic_'+uid).find('.pic_btn'), urlPagesSite.messages+'?display=one_chat&user_id='+uid)
    }

    /* No One Found */
    this.hideLinkNoOneFound = function(dur){
        if($('.to_one_chat:first', $this.messagesBox)[0]&&!$this.$noOneFound.is('.to_hide')){
            $this.$noOneFound.toggleClass('to_show to_hide');
            //$this.setBannerParam();
        }
    }

    this.showLinkNoOneFound = function(){
        if(!$('.to_one_chat:first', $this.messagesBox)[0]&&!$this.$noOneFound.is('.to_show')){
            $this.$noOneFound.removeClass('to_hide').delay(1).toggleClass('to_show',0);
            //var $banner=$('.footer_mobile_messages, .footer_mobile_paid_messages').stop().fadeOut(200);
            //$this.$noOneFound.addClass('to_show').fadeTo(0,0).css({display:'table'}).delay(200).fadeTo(400,1,function(){
                //$banner.stop().fadeIn(400);
                //$this.messagesBox.removeAttr('style');
                //$this.setBannerParam();
            //})
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

    /* Clearing history */
    this.actionClear={};
    this.showActionClear = function($el){
		var $date=$('.info_date_bl', $el);
        clearTimeout($date.data('action'));
		if(!$date[0]||$date.is('to_hide'))return;
        $date.data('action',setTimeout(function(){
            $date.addClass('to_hide');
            $('.delete', $el).oneTransEnd(function(){vibrate(150)}).toggleClass('to_hide to_show',0);
        },400))
	}

    this.hideActionClear = function($el){
        var $date=$('.info_date_bl', $el);
        clearTimeout($date.data('action'));
		if(!$date[0]||!$date.is('.to_hide')||$this.actionClear[$el[0].id])return;
        $date.data('action',setTimeout(function(){
            if($this.actionClear[$el[0].id])return;
            $date.removeClass('to_hide');
            $('.delete', $el).toggleClass('to_show to_hide',0);
        },2000))
    }

    this.historyClear = function($el){
		var uid=$el.data('uid');
		$el.addLoader();
		$.post(url_main+'messages.php', {ajax:1, cmd:'clear_history_messages', user_id:uid}, function(res){
			var data=checkDataAjax(res);
			if(data){
				$this.removeGeneralImUser(uid);
                $this.uploadingHistoryGeneral(1);
			}else{
				serverError();
                $el.removeLoader();
			}
        })
        return;
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
        if($this.ajaxUpdateGeneralChat&&!limit)return;
        limit=limit||0;
        var isMoreMsg=$this.isAjax.more_msg;
        if(limit)isMoreMsg=0;
        if(isMoreMsg||$this.stop)return;
        console.log('UPLOAD HISTORY GENERAL stop:', $this.stop, ' limit:', limit);
        $this.$loaderGeneral.addClass('show');
        if(limit){
            start=limitStart+$this.imHistoryMessages-limit;
        } else {
            limitStart+=$this.imHistoryMessages;
            start=limitStart;
        }
        $this.isAjax.more_msg=true;
        $.post(url_main+'messages.php',{ajax:1, user_id:userTo, limit_start:start, limit:limit}, function(res){
            $this.$loaderGeneral.removeClass('show');
            var data=checkDataAjax(res);
            if(data!==false){
                var data=$.trim(data);
                if(data===''){$this.stop=1;return}
                $this.updateHistoryGeneral(data);
            }else{
                serverError();
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
            if(cl=='to_hide')$this.showLinkNoOneFound();
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

    this.update = function(data){
        console.log('SERVER UPDATE GENERAL CHATS',last_id,$this.ajaxUpdateGeneralChat);
        var $html=$(data);
        $html.filter('script:not(.in_content)').appendTo('#update_server');
        if(activePage != 'messages.php')return;
        //console.log($this.ajaxUpdateGeneralChat,$this.isAjax.more_msg);
        if($this.ajaxUpdateGeneralChat)return;//||$this.isAjax.more_msg
        $this.ajaxUpdateGeneralChat=1;
        $html.filter('.script').find('script:not(.in_content)').appendTo('#update_server');
        console.log('SERVER UPDATE GENERAL CHATS EXECUTE');
        setTimeout(function(){
            var $chats = $html.filter('.im_general_user').addClass('to_hide');
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
    /* Upload history */
    /* GENERAL CHATS */

    $(function(){
    })
    return this;
}