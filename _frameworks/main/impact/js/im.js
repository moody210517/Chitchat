var CIm = function(guid, imHistoryMessages, isSp) {

    var $this=this;

    this.guid = guid*1;
    this.isSp = isSp*1;

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
    this.initAjaxIm = false;

    this.setData = function(data){
        for (var key in data) {
           $this[key] = data[key];
           //console.log(key, $this[key]);
        }
    }

    this.initListIm = function(){
        if(activePage == 'messages.php' || activePage == 'email_not_confirmed.php' || !ajax_login_status)return;
        if(activePage == 'city.php' && isSiteOptionActive('hide_im_on_page_city'))return;
        $.post(url_ajax+'?cmd=init_list_im',{number_visible_im:$this.getNumberVisibleIm()},
            function(res){
                var data=checkDataAjax(res);
                if(data!==false){
                    var $list=$(data).filter('#list_chats_bl');
                    if($list&&$list[0]){
                        $list.appendTo('body');
                        $this.initAjaxIm = true;
                    }
                }
        })
    }

    this.setLastId = function(lastId) {
        last_id=lastId*1;
    }

    this.setLastMid = function(mid){
        mid=mid*1;
        if((mid^0)!==mid||last_id>=mid)return;
        last_id=mid;
        //console.log('SET LAST ID', last_id);
    }

    this.usersCacheAdd = function(uid, status){
        //console.log('USER ADD', uid, status);
        users_list[uid]=status*1;
    }

    this.usersCacheRemove = function(uid){
        delete users_list[uid];
    }

    this.messagesCacheAdd = function(uid, mid, isSp) {
        //console.log('messagesCacheAdd', uid, mid);
		if (!$this.messagesCache[uid]) {$this.messagesCache[uid]={}}
		//if ($this.messagesCache[uid][mid]) return;
		$this.messagesCache[uid][mid] = isSp*1;
	}

    this.isOpen = function($im){
       return $im.is('.to_show')*1;
    }

    this.reInitToScrollListChats = function(){
        $this.reInitToScroll($this.$lcScrollBoxPl);
    }

    this.reInitToScroll = function(pl,posY){
        posY=defaultFunctionParamValue(posY, 'bottom');
        if(posY=='bottom'&&((pl.contentSize-pl.trackSize)<=20)){
            posY=0;
        }
        pl.update(posY);
    }

    /* List chats */
    this.durHideMore=150;
    this.initListChats = function(limitStart, stopMore, limitLoad, lastId, imHistoryMessages, imHistoryListMessages, allNewMsgCount){
        isOneChat='open_list_chats';
        $this.setLimitStart(limitStart, stopMore, limitLoad);
        $this.setLastId(lastId);
        $this.imHistoryMessages=imHistoryMessages*1;
        $this.imHistoryListMessages=imHistoryListMessages*1;

        $(function(){
            $this.$lc=$jq('#list_chats_open_users');
            $this.$lcScrollBox=$jq('#list_chats_open_users_scroll_box');
            if(!$this.$lcScrollBox.find('.list_chats_open_item')[0]){
                $this.$lc.removeClass('to_show').oneTransEnd(function(){
                    $this.$lc.removeAttr('style');
                }).addClass('to_hide');
            }else{
                $this.$lc.removeAttr('style');
            }

            $this.$lcScrollBox.tinyscrollbar({wheelSpeed:30,thumbSize:45}).on('move',function(){
                if(($this.$lcScrollBoxPl.contentSize-$this.$lcScrollBoxPl.contentPosition)==lcScrollBoxDefaultSize){
                    $this.uploadingHistoryListChats()
                }
            })
            $this.$lcScrollBoxPl=$this.$lcScrollBox.data('plugin_tinyscrollbar');
            var lcScrollBoxDefaultSize=$this.$lcScrollBoxPl.viewportSize;

            $this.$lcListCount=$jq('#list_chats_open_count');
            $this.$openImMoreListBl=$jq('.open_im_more_list_bl');
            $this.$openImMoreList=$jq('#open_im_more_list');

            $this.$openImMore=$jq('#open_im_more').click(function(){
                clearTimeout($this.$openImMoreListBl.data('action'));
                if($this.$openImMoreListBl.is(':hidden')){
                    $this.$openImMoreListBl.removeAttr('style').slideDown($this.durHideMore,function(){
                        $this.$openImMoreList[0].scrollTop=$this.$openImMoreList[0].scrollHeight;
                    }).data('action',setTimeout($this.hideMoreList,1500))
                }else{
                    $this.$openImMoreListBl.stop().slideUp($this.durHideMore);
                }
            })
            $this.$openImMoreCount=$this.$openImMore.find('.count');
            $('.open_im_more_list_bl').mouseenter(function(){
                clearTimeout($this.$openImMoreListBl.data('action'));
            }).mouseleave(function(){
                $this.$openImMoreListBl.data('action',setTimeout($this.hideMoreList,1500))
            })
            $('body').on('click',function(e){
                var $tr=$(e.target);
                if(!$tr.is('.open_im_more')&&!$tr.closest('.open_im_more')[0]){
                    $this.$openImMoreListBl.stop().slideUp($this.durHideMore);
                }
            })
            $this.prepareIm(true);
            $win.resize($this.prepareIm);
            $this.updateCounter(allNewMsgCount);

            /* Grand Access */
            $('body').on('click', '.photo_grant_access, .photo_deny_access', function(e){
                var $el=$(this);
                if(!$el.closest('.list_chats_bl')[0])return false;
                if($el.is('.photo_grant_access') || $el.is('.photo_deny_access')){
                    if($this.isAjax['access'])return false;
                    $this.isAjax['access']=1;
                    var type='request_approved',
                        msg=l('private_photo_you_granted_access');
                    if ($el.is('.photo_deny_access')) {
                        type='request_declined';
                        msg=l('private_photo_request_declined');
                    }

                    var $msg=$el.closest('.bl_im_msg_one'),dur=400,
                        uid=$msg.data('toUserId'),

                        $prev=$msg.prev('.bl_im_msg_one:not(.write)'),
                        prevUid=$prev[0]?$prev.data('msgUserId'):0,
                        $next=$msg.next('.bl_im_msg_one:not(.write)'),
                        nextUid=$next[0]?$next.data('msgUserId'):0;

                    $.post(url_ajax+'?cmd=send_request_private_access',{type:type,user_to:uid,mid:$msg.data('id')},
                        function(res){
                            $this.isAjax['access']=0;
                    })

                    $this.deleteMsgOne(uid,$msg,dur,function(){
                        var $msgNew=$this.getTemplateMsg(),fn,cont;
                        $msgNew.find('p').html(msg);
                        $msgNew.attr({'id':$msg[0].id,'data-id':$msg.data('id'),
                                      'data-send':$msg.data('send'),
                                      'data-msg-user-id':$this.guid,'data-to-user-id':uid})
                               .data({'id':$msg.data('id'),'send':$msg.data('send'),dataMsgUserId:$this.guid, dataToUserId:uid});
                        if($prev[0]){
                            fn='insertAfter';
                            cont=$prev;
                        }else if($next[0]){
                            fn='insertBefore';
                            cont=$next;
                        }else{
                            fn='appendTo';
                            cont=$('#im_open_list_msg_'+uid);
                        }
                        if($prev[0] && prevUid==$this.guid){
                            $msgNew.find('.pic_user').remove();
                            $msgNew.find('.msg_arrow').removeClass('msg_arrow');
                            //console.log('удалить фотку');
                        }
                        if($next[0] && nextUid==$this.guid){
                            $next.find('.pic_user').slideUp(100,function(){
                                $(this).remove()
                            });
                            $next.find('.msg_arrow').removeClass('msg_arrow');
                            //console.log('оставить фотку - удалить у $next');
                        }
                        $this.showMsgOne(uid,$msgNew,cont,fn,dur,false,true);
                    },true)


                //var $im=$('#im_open_list_msg_'+uid),data=$this.prepareMsg($im,$msg);
                //$this.showMsgOne(uid,data.msg,data.cont,data.fn);

                /*var $block=$el.closest('.im_msg_one'),mid=$block.data('id'),uid=$el.data('userId');

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

                */
                    return false;
                }
            })
            /* Grand Access */

        })
    }

    this.visibleListIm = function(){
        var numNewMsg=$jq('#list_chats_open_count').data('newMsgCount'),
            cl=numNewMsg?' to_show':'';

        if($this.$lcScrollBox.find('.list_chats_open_item')[0]){
            if($this.$lc.is('.to_hide')){
                $this.$lc.toggleClass('to_hide'+cl);
                setCookie('open_list_chats', numNewMsg?1:0);
            }
        }else if(!$this.$lc.is('.to_hide')){
            if($this.$lc.is('.to_show')){
                $this.$lc.toggleClass('to_show to_hide');
            }else{
                $this.$lc.addClass('to_hide');
            }
        }
    }

    this.hideMoreList = function(){
        if(!$this.$openImMoreListBl.is(':hidden')&&!$this.$openImMoreListBl.is(':animated')){
            $this.$openImMoreListBl.stop().slideUp($this.durHideMore);
        }
    }

    this.stopList=0;
    this.setLimitStart = function(start,stop_more,limitLoad){
        limitLoad=(limitLoad*1)||0;
        if(!limitLoad)limitStart=start*1;
        $this.stopList=stop_more*1;
        //console.log('SET LIMIT LIST CHATS limit:',limitLoad,' limitStart:',limitStart,' stop:',$this.stopList);
    }

    this.ajaxUpdateListChats=false;
    this.uploadingHistoryListChats = function(){
        if($this.ajaxUpdateListChats||$this.stopList)return;
        $this.ajaxUpdateListChats=true;
        console.log('UPLOAD HISTORY LIST CHATS stop:', $this.stopList);
        $jq('#loader_list_chats_open_users').show();
        $this.reInitToScrollListChats();
        limitStart+=$this.imHistoryMessages;
        $.post(url_main+'messages.php',{ajax:1, limit_start:limitStart, display:isOneChat}, function(res){
            $jq('#loader_list_chats_open_users').hide(1,$this.reInitToScrollListChats);
            var data=checkDataAjax(res);
            if(data!==false){
                $this.updateHistoryListChats($.trim(data));
            }else{
                alertServerError();
            }
            $this.ajaxUpdateListChats=false;
        })
    }

    this.updateHistoryListChats = function(data){
        var $data=$('<div>'+data+'</div>');
        $data.find('script:not(.in_content)').appendTo('#update_server');
        var $ims=$data.find('.list_chats_open_item');
        if(!$ims[0]){
            $this.stopList=1;
            return;
        }
        var i=0,t=300;
        (function fu(){
            var $item=$ims.eq(i);
            if($item[0]){
                if(!$('#'+$item[0].id)[0]){
                    $item.hide().css('opacity',0).insertBefore($jq('#loader_list_chats_open_users'))
                    .animate({height:'toggle',opacity:1},
                        {duration:t*=.9,
                        step:function(h,fn){
                            $this.reInitToScrollListChats();
                        },
                        complete:function(){
                            $this.reInitToScrollListChats();
                        }
                    })
                    setTimeout(function(){i++; fu();},1)
                }else{
                    i++; fu();
                }
            }
        })()
    }

    this.setStatusNewMessagesFromUsers = function(msgFromUsers){
        var $newMsg,
            numberVisIm=$('.open_im_chat:visible').length,
            defaultVisIm=$this.getNumberVisibleIm(),
            isForcedOpen=isSiteOptionActive('forced_open_chat_with_new_message');
        for (var uid in msgFromUsers) {
            $newMsg=$('#list_chats_open_user_new_msg_'+uid);
            if($newMsg[0]){
                var n=Boolean(msgFromUsers[uid]*1);
                var is=true;
                if(isForcedOpen&&n&&!$('#im_open_'+uid)[0]) {
                    numberVisIm++;
                    if(numberVisIm<=defaultVisIm){
                        is=false;
                        $newMsg.removeClass('to_show',0);
                    }
                }
                if(is&&n!=$newMsg.is('.to_show')){
                    $newMsg[n?'addClass':'removeClass']('to_show',0);
                }
            }
        }
    }

    this.removeUsersFromListChats = function(users){
        for (var uid in users) {
            $this.usersCacheRemove(uid);
            var $el=$('#list_chats_open_user_'+uid);
            if($el[0]){
                $el.stop().slideUp(200,function(){
                    $(this).remove();
                    $this.$lcScrollBoxPl.update();
                })
            }
        }
    }

    this.setOrderUsersListChats = function(users){
        for (var uid in users) {
            //console.log('SET or', uid,users[uid]);
            $('#list_chats_open_user_'+uid).attr('data-check-order',users[uid]).data('checkOrder',users[uid]);
        }
    }

    this.checkOrderUsersListChats = function(){
        var $chats=$('.list_chats_open_item[data-check-order!=""]');
        if (!$chats[0]){
            $this.visibleListIm();
            $this.ajaxUpdateListChats=false;
            return;
        }
        var t=200,i=0;
        (function fu(){
            var $item=$chats.eq(i);
            if (!$item[0]){
                $this.visibleListIm();
                $this.ajaxUpdateListChats=false;
                return;
            }
            var o=$item.data('checkOrder'),ro=$item.index('.list_chats_open_item');
            $item.attr('data-check-order','').data('checkOrder','');
            //if(ro)ro--;
            //console.log('CHECK ORDER LIST CHATS',$item[0].id,o,ro);
            if(o!=ro){
                t*=.9;
                if(!o){
                    var $eQ0=$('.list_chats_open_item').eq(0);
                    if ($eQ0[0]&&$item[0].id!=$eQ0[0].id) {
                        $item.slideUp(t,function(){
                            $item.prependTo($jq('#list_chats_open_items')).stop().slideDown(t,function(){
                                $this.$lcScrollBoxPl.update();
                                i++; fu();
                            })
                        })
                    }else{
                        i++; fu();
                    }
                }else{
                    o--;
                    var $eQo=$('.list_chats_open_item').eq(o);
                    if($eQo[0]&&$item[0].id!=$eQo[0].id){
                        $item.slideUp(t,function(){
                            $item.insertAfter($eQo).stop().slideDown(t,function(){
                                $this.$lcScrollBoxPl.update();
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

    this.hideMarkNewMsg = function(uid){
        setTimeout(function(){
            $('.bl_im_msg_one.new',$this.uploadMsgList[uid]).removeClass('new')
        },10);
        $this.uploadMsgList[uid].off('mouseover')
    }

    this.reInitToScrollUpdateMsg = function(offTop,imUid){
        if(offTop
            && offTop<($this.uploadMsgScrollPl[imUid].contentSize-$this.uploadMsgScrollPl[imUid].viewportSize+46)){
            $this.reInitToScroll($this.uploadMsgScrollPl[imUid],offTop-10);
        }else{
            $this.reInitToScroll($this.uploadMsgScrollPl[imUid]);
        }
    }

    this.updateServerMsg = function($dataMsg){
        if(!$dataMsg[0])return;
        //$dataMsg.find('.script > script').appendTo('#update_server');
        var $listMsg=$dataMsg.find('.bl_im_msg_one');
        if($listMsg[0]){
            var mid, imUid, mUid, d=225,j=0, sendId;
            (function fu(){
                var item=$listMsg.eq(j);
                if(!item[0]){
                    $dataMsg.find('.script > script').appendTo('#update_server');
                    return;
                }
                mid=item.data('id');
                imUid=item.data('toUserId');
                mUid=item.data('msgUserId');
                sendId=item.data('send');
                $this.setLastMid(mid);
                if(!$('#'+item[0].id)[0]&&!$('#im_open_msg_'+sendId)[0]&&$this.uploadMsgList[imUid]){
                    var data=$this.prepareMsg($this.uploadMsgList[imUid],item);
                    item=data.msg;
                    if(mUid!=$this.guid){
                        item.closest('.bl_im_msg_one').addClass('new');
                    }
                    var $newMsg=$('.bl_im_msg_one.new',$this.uploadMsgList[imUid]).first(),offTop=0;
                    if($newMsg[0]){
                        offTop=$newMsg[0].offsetTop;
                    }
                    $this.listImOverview[imUid].removeClass('animate');
                    item.addClass('sent').hide()[data.fn](data.cont).slideDown({
                        step:function(){
                            //$this.reInitToScrollUpdateMsg(offTop,imUid);
                            $this.reInitToScroll($this.uploadMsgScrollPl[imUid]);
                        },
                        complete:function(){
                            $this.reInitToScroll($this.uploadMsgScrollPl[imUid]);
                            //$this.reInitToScrollUpdateMsg(offTop,imUid);
                            item.removeClass('sent');
                            if(!$this.listImOverview[imUid].find('.bl_im_msg_one.sent')[0]){
                                $this.listImOverview[imUid].addClass('animate');
                            }
                            j++; fu();
                        },
                        duration:d*=.9
                    })
                    $this.setTooltipDateMsg(item);
                }else{
                    j++; fu();
                }
            })();
        } else {
            $dataMsg.find('.script > script').appendTo('#update_server');
        }
    }

    this.updateServer = function($res){
        //console.log('SERVER UPDATE LIST CHATS',$this.ajaxUpdateListChats);
        if($this.ajaxUpdateListChats)return;
        $this.ajaxUpdateListChats=true;

        var $data=$res.filter('div.update_built_im'),
            $dataMsg=$res.filter('div.update_msg_im');

        $this.updateServerMsg($dataMsg);

        $data.find('.script > script').appendTo('#update_server');
        //imChats.setOrderUsersListChats({"12":0});
        //imChats.setStatusNewMessagesFromUsers({"12":"0"});
        var isForcedOpen=isSiteOptionActive('forced_open_chat_with_new_message');
        setTimeout(function(){
            var fnAfter=function(){
                $res.filter('div.script_after').find('script').appendTo('#update_server');
                //imChats.updateCounter({"12":"0","all":0});
            }
            if (!isForcedOpen)fnAfter();
            var $chats = $data.find('.list_chats_open_item').hide();
            if ($chats[0]) {
                var t=180,i=0;
                (function fu(){
                    var $item=$chats.eq(i);
                    if (!$item[0]){
                        $this.checkOrderUsersListChats();
                        if(isForcedOpen)fnAfter();
                        return;
                    }
                    var $im=$('#'+$item[0].id);
                    if(!$im[0]){
                        var order=$item.data('order');
                        t*=.9;
                        if(!order){
                            $item.hide().prependTo($jq('#list_chats_open_items')).slideDown(t,function(){
                                $this.$lcScrollBoxPl.update();
                                i++; fu();
                            })
                        }else{
                            order--;
                            $item.hide().insertAfter($('.list_chats_open_item').eq(order)).slideDown(t,function(){
                                $this.$lcScrollBoxPl.update();
                                i++; fu();
                            })
                        }
                    }else{
                        i++; fu();
                    }
                })()
            }else{
                $this.checkOrderUsersListChats();
                if(isForcedOpen)fnAfter();
            }
        },400)
    }

    this.updateOnlineUsers = function(usersStatus,check){
        for (var uid in usersStatus) {
            if(check){
                var $im=$('#im_open_chat_'+uid);
                if($im[0] && ($im.is('.active')*1)!=usersStatus[uid]){
                    $im.toggleClass('active noactive');
                }
            }else{
                if(users_list[uid]!=usersStatus[uid]){
                    $('#list_chats_open_user_status_online_'+uid).fadeTo(400,usersStatus[uid]);
                }
                users_list[uid]=usersStatus[uid];
            }
        }
    }

    this.getNumberVisibleIm = function(){
        return Math.floor(($win.width()-354-80)/334);
    }

    this.prepareIm = function(loadPage){
        $this.$openImMoreListBl.stop().slideUp($this.durHideMore);
        var numVis=$this.getNumberVisibleIm();//Math.floor(($win.width()-354-80)/334);
        //$this.$openImMore.removeClass('to_show');
        var $ims=$('.open_im_chat').removeClass('hide');
        //$jq('#open_im_more_list').find('li').remove();
        var i=0,isShowMore=false,lIm=$ims.length;
        $ims.each(function(){
            var $el=$(this),uid=$el.data('uid'),$li=$('#im_open_more_'+uid);
            if(++i>numVis){
                isShowMore=true;
                //$this.$openImMore.addClass('to_show');
                $el.removeAttr('style').css({transition:'none'});
                $el.removeClass('to_show').addClass('hide');
                setTimeout(function(){$el.removeAttr('style')},10)
                if(!$li[0]){
                    var $headTitle=$el.find('.head_title');
                    $('<li id="im_open_more_'+uid+'" data-uid="'+uid+'" onclick="imChats.openImWithUser($(this))">'+
                        $headTitle.html()+'</li>')
                    .attr({'data-user-name':$headTitle.data('userName'),'data-new-msg-count':$headTitle.data('newMsgCount')})
                    .data({userName:$headTitle.data('userName'), newMsgCount:$headTitle.data('newMsgCount')})
                    .appendTo($jq('#open_im_more_list'));
                }
            }else{
                $li.remove();
                $el.removeClass('hide');
            }
            if(i==lIm){
                $this.$openImMore[isShowMore?'addClass':'removeClass']('to_show');
                var $hideIm=$('li',$this.$openImMoreList);
                if($hideIm[0]){
                    var l=$hideIm.length;
                    if(l>1){
                        $this.$openImMoreCount.text(l).stop().fadeIn(200);
                    }else{
                        $this.$openImMoreCount.stop().fadeOut(200);
                    }
                    $this.$openImMore.addClass('to_show');
                }
            }
        })
        if(loadPage){
            $jq('#list_chats_bl').delay(100).fadeTo(200,1);
        }
    }

    this.expandBox = function($el,fn,close){
        var st=$this.isOpen($el)||close,uid=$el.data('uid');
        $el.oneTransEnd(function(){
            if(typeof fn=='function')fn();
            $this.prepareIm();
        })[st?'removeClass':'addClass']('to_show');
        var bt=$el.data('bottom');
        if(bt){
            if(st){
                $el.removeAttr('style');
            }else{
                $el.css({bottom:bt});
            }
        }
        if(!st)$('#im_open_msg_send_'+uid).focus();
        $this.openImCacheAdd(uid);
    }

    this.showUsersList = function(){
        var st=$this.$lc.is('.to_show');
        setCookie('open_list_chats', !st*1);
        setCookie('open_list_chats_demo', 1);
        $this.expandBox($this.$lc);
    }

    this.showImWithUser = function($im){
        //$this.$openImMore.removeClass('to_show');
        var uid=$im.data('uid');
        $im.insertAfter($this.$lc).delay(100)
           .oneTransEnd(function(){
               $('#im_open_msg_send_'+uid).focus();
               $this.openImCacheAdd(uid)
           }).toggleClass('to_close to_show',0);
        var bt=$im.data('bottom');
        if(bt){
            $im.css({bottom:bt});
        }
        $this.prepareIm();
    }

    this.openImWithUserFromList = function($el,e){
        if(e&&$(e.target).is('.frame')||$(e.target).closest('.frame')[0]){
            $el.find('.pic').addLoader();
            redirectUrl(url_main+$el.data('urlProfile'));
            return;
        }
        $this.openImWithUser($el);
    }

    this.actionOpenImWithUser={};
    this.openImWithUser = function($el,toUid){
        var uid=toUid||$el.data('uid');
        if($this.actionOpenImWithUser[uid])return;
        $this.actionOpenImWithUser[uid]=true;
        $this.$openImMoreListBl.stop().slideUp($this.durHideMore);
        var $im=$('#im_open_'+uid);
        if($im[0]){
            if($im.is('.hide')){
                $this.setActiveIm(uid);
                $this.showImWithUser($im.toggleClass('hide to_close'));
            } else {
                if(!$this.isOpen($im))$this.updateCounterImOpen(uid);
                $this.expandBox($im);
                $this.actionOpenImWithUser[uid]=false;
                //return;
            }
            $this.actionOpenImWithUser[uid]=false;
            $el=[];
            //return;
        }
        if(!toUid&&$el[0])$el=$el.find('.pic');
        $el[0]&&$el.addLoader();
        $.post(url_ajax+'?cmd=open_im_with_user',{user_id:uid,users_list:JSON.stringify(users_list),last_id_temp:last_id,},function(res){
                $el[0]&&$el.removeLoader();
                var data=checkDataAjax(res);
                if(data!==false){
                    data=$($.trim(data));
                    data.filter('script').appendTo('#update_server');
                    //imChats.updateCounter({"12":"0","all":0});
                    $this.updateServer(data.filter('div.update_built_im'));
                    //imChats.setOrderUsersListChats({"12":0});
                    //imChats.setStatusNewMessagesFromUsers({"12":"0"});
                    $im=data.filter('.open_im_chat');
                    if($im[0]&&!$('#'+$im[0].id)[0]){
                        if(!$im.find('.bl_im_msg_one')[0]){
                            $im.addClass('new_empty_im');
                        }
                        $this.showImWithUser($im.addClass('to_close'));
                    }
                    /*if(toUid){
                        var $imOnline=data.filter('.list_chats_open_item');
                        if($imOnline[0]&&!$('#'+$imOnline[0].id)[0]){
                            $this.showItemOnline($imOnline);
                        }
                    }*/
                }else{
                    alertServerError()
                }
                $this.actionOpenImWithUser[uid]=false;
        })
    }

    this.openIm = function(uid,e){
        var $targ=$(e.target);
        if(e&&$targ.is('.im_close'))return;
        if(e&&$targ.is('.im_title_name')){
            redirectUrl($this.listImBl[uid].data('userProfileUrl'));
            return;
        }
        var $im=$this.listImBl[uid],visible='N';
        if(!$this.isOpen($im)){
            $this.setReadMsg(uid);
            visible='Y';
        }
        $this.setVisibleIm(uid,visible);
        $this.expandBox($im);
    }

    this.setReadMsg = function(uid){
        $.post(url_server+'?cmd=set_read_msg',{display:isOneChat, user_current:uid},
            function(res){
                var data=checkDataAjax(res);
                if(data!==false){
                    $this.updateCounter(data);
                }
        })
        $this.updateCounterImOpen(uid);
    }

    this.setActiveIm = function(uid){
        $.post(url_server+'?cmd=activate_im',{display:isOneChat, user_current:uid, user_id:0, users_list:JSON.stringify(users_list), last_id:last_id},
            function(res){
                var data=checkDataAjax(res);
                if(data!==false){
                    data=$($.trim(data));
                    data.filter('.script').find('script').appendTo('#update_server');
                    $this.updateServer(data.filter('div.update_built_im'));
                }
        })
        $this.updateCounterImOpen(uid);
    }
    /* List chats */
    /* One IM */
    this.openImCacheAdd = function(uid){
        if(!uid)return;
        uid *=1;
        //console.log('USER OPEN IM ADD', uid, $this.isOpen($('#im_open_'+uid)));
        users_list_open_im[uid]=$this.isOpen($('#im_open_'+uid));
    }

    this.openImCacheRemove = function(uid){
        delete users_list_open_im[uid];
        delete status_writing[uid];
    }

    this.inOpenImInCache = function(uid){
        return uid in users_list_open_im;
    }

    this.uploadMsgAjax = {};
    this.uploadMsgFirstId = {};
    this.uploadMsgScrollPl = {};
    this.uploadMsgLimit = {};
    this.uploadMsgLoader = {};
    this.uploadMsgList = {};
    this.listImBl = {};
    this.listIm = {};
    this.listImText = {};
    this.listImOverview = {};
    this.initOneIm = function(uid, firstMsgId){
        $this.uploadMsgFirstId[uid]=firstMsgId*1;
        $this.uploadMsgAjax[uid]=0;
        $this.uploadMsgLimit[uid]=0;
        $this.uploadMsgLoader[uid]=0;

        //$this.addCacheUsersList(uid);
        $(function(){
            $this.listImBl[uid]=$('#im_open_'+uid);
            $this.listIm[uid]=$('#im_open_chat_'+uid);
            $this.listImText[uid]=$('#im_open_msg_send_'+uid);
            $this.uploadMsgList[uid]=$('#im_open_list_msg_'+uid);
            $this.listImOverview[uid]=$('#im_overview_'+uid);
            $this.openImCacheAdd(uid);
            var sb=$('#im_scrollbar_'+uid).tinyscrollbar({wheelSpeed:30,thumbSize:45}).on('move',function(){
                if($this.uploadMsgScrollPl[uid].contentPosition==0){
                    $this.uploadingImMsg(uid);
                }
            })
            $this.uploadMsgScrollPl[uid]=sb.data('plugin_tinyscrollbar');
            $this.reInitToScroll($this.uploadMsgScrollPl[uid]);
            $this.listImText[uid].keydown(doOnEnter($this.send))
                .on('input propertychange', function(){
                    status_writing[uid] = parseInt((new Date())/1000);
                    $this.hideMarkNewMsg(uid)
                }).on('mouseover',function(){$this.hideMarkNewMsg(uid)})
                .autosize({isSetScrollHeight:false,callback:$this.prepareMessagesCont});
            $('#im_scrollbar_'+uid).on('mouseover',function(){$this.hideMarkNewMsg(uid)});

            $this.setTooltipDateMsgAll($this.uploadMsgList[uid]);
            $('#im_open_chat_'+uid+' .head .marker').on('mouseover',function(){
                var title=$this.listIm[uid].is('.active') ? l('im_user_online') : l('im_user_offline');
                $(this)[0].title=title.replace(/{name}/, $('#im_open_title_'+uid).data('userName'));
            });
        })
    }

    this.deleteDataOneIm = function(uid){
        delete $this.uploadMsgAjax[uid];
        delete $this.uploadMsgFirstId[uid];
        delete $this.uploadMsgScrollPl[uid];
        delete $this.uploadMsgLimit[uid];
        delete $this.uploadMsgLoader[uid];
        delete $this.uploadMsgList[uid];
        delete $this.listImBl[uid];
        delete $this.listIm[uid];
        delete $this.listImText[uid];
        delete $this.listImOverview[uid];
        $this.openImCacheRemove(uid);
    }

    this.prepareMessagesCont = function(ta,ta){
        var $tx=$(this),uid=$tx.data('uid');
        if (ta<140) {
            var $cont=$('#im_viewport_'+uid), dH=330, dHc=dH-ta;
            $this.listImBl[uid].removeAttr('style').attr('data-bottom',0).data('bottom',0);
            $this.listImBl[uid].css({transition:'all .4s, bottom 0s'});
            $('#im_thumb_'+uid).removeClass('animate');
            $('#im_cont_'+uid).css({minHeight:dHc,maxHeight:dHc});
            $cont.height(dH-ta);
            $this.reInitToScroll($this.uploadMsgScrollPl[uid]);
            setTimeout(function(){
                $('.im_trans_'+uid).addClass('animate');
                $this.listImBl[uid].removeAttr('style');
            },10);
        }else{
            var h=$this.listIm[uid].height()-2;
            $this.listImBl[uid].css({bottom:h}).attr('data-bottom',h).data('bottom',h);
        }
    }

    this.setTooltipDateMsgAll  = function(cont) {
        $('.bl_im_msg_one',cont).each(function(){
            $this.setTooltipDateMsg($(this))
        })
    }

    this.setTooltipDateMsg = function($msg) {
        $msg=$msg.find('.im_msg_user');
        var data={position:{my:'left+8 top',at:'right top+3'}};
        if($msg.is('.msg_check')){
            data={position:{my:'right-8 center',at:'left top+18'}};
        }

        data['content']=$msg.data('date');
        data['create']=function(e,ui){
            $(this).data('ui-tooltip').liveRegion.remove();
        }
        data['open']=function(e, ui){
            var offTop=$msg.closest('.bl_im_msg_one')[0].offsetTop,
                uid=$msg.closest('.list_chats_item').data('uid');
            if(offTop
                && ((offTop<=($this.uploadMsgScrollPl[uid].contentPosition))
                     ||(offTop>=($this.uploadMsgScrollPl[uid].contentPosition+$this.uploadMsgScrollPl[uid].viewportSize-34)))){
                $msg.tooltip('close');
            }
        };
        data['show']={duration:120,delay:500};
        data['hide']={duration:120};
        //hide: { effect: "explode", duration: 1000 }
        $msg.tooltip(data);
        if($msg.is('.msg_check')){
            $msg.tooltip('option', 'tooltipClass', 'left');
        }
        $('.ui-helper-hidden-accessible').remove();
        $msg.off('focusin focusout');
    }

    this.uploadingImMsg = function(uid) {
        var fmid=$this.uploadMsgFirstId[uid];
        if($('#im_open_msg_'+fmid)[0]||!fmid||$this.uploadMsgAjax[uid])return;
        $this.uploadMsgAjax[uid]=true;
        if(!$this.uploadMsgLoader[uid]){
            $this.uploadMsgLoader[uid]=getLoader('loader_one_im_open').prependTo($this.uploadMsgList[uid]);
            $this.reInitToScroll($this.uploadMsgScrollPl[uid],0)
        }else{
            $this.uploadMsgLoader[uid].slideDown({
                        step:function(){$this.reInitToScroll($this.uploadMsgScrollPl[uid],0)},
                        complete:function(){$this.reInitToScroll($this.uploadMsgScrollPl[uid],0)},
                        duration:$this.dur
                    })
        }
        $this.uploadMsgLimit[uid]+=$this.imHistoryListMessages;
        $.post(url_ajax+'?cmd=uploading_msg',{user_id:uid, limit_start:$this.uploadMsgLimit[uid], display:isOneChat}, function(res){
            $this.uploadMsgLoader[uid].slideUp({
                        step:function(){$this.reInitToScroll($this.uploadMsgScrollPl[uid],0)},
                        complete:function(){$this.reInitToScroll($this.uploadMsgScrollPl[uid],0)},
                        duration:$this.dur
                    });
            var data=checkDataAjax(res);
            if(data!==false){
                var data=$.trim(data);
                if(data==='')return;
                $this.showUploadingMsg($(data),uid);
            }else{
                alertServerError(true);
                $this.uploadMsgAjax[uid]=false;
            }
        })
    }

    this.showUploadingMsg = function($data,uid){
        var $listMsg=$data.filter('div.bl_im_msg_one');
        if(!$listMsg[0]){
            $this.uploadMsgAjax[uid]=false;
            return;
        }
        var $listMsgBlock=$this.uploadMsgList[uid],
            mid,t=$this.dur,i=$listMsg.length-1,
            $firstMsg=$('.bl_im_msg_one:first',$listMsgBlock),
            $firstPhoto=$firstMsg.find('.pic_user');
        (function fu(){
            if(i<0){
                $this.uploadMsgAjax[uid]=false;
                return false;
            }
            var $msg=$listMsg.eq(i);
            if($msg[0]){
                mid=$msg.data('id');
                if(!$listMsgBlock.find('#im_open_msg_'+mid)[0]){
                    if($firstPhoto && $firstPhoto[0] && $msg.data('msgUserId')==$firstMsg.data('msgUserId')){
                        $firstMsg.find('.msg_arrow').removeClass('msg_arrow');
                        $firstPhoto.slideUp(100,function(){
                            $(this).remove()
                        });
                    }
                    $firstPhoto=false;
                    $msg.hide().insertAfter($this.uploadMsgLoader[uid]).slideDown({
                        step:function(){
                            $this.reInitToScroll($this.uploadMsgScrollPl[uid],0)
                        },
                        complete:function(){
                            $this.reInitToScroll($this.uploadMsgScrollPl[uid],0)
                            i--; fu();
                        },
                        duration:t*=.7
                    })
                    $this.setTooltipDateMsg($msg);
                }else{
                    i--; fu();
                }
            }
        })()
    }

    this.getTemplateMsg = function(){
        return  $('<div class="bl_im_msg_one">'+
                        '<div class="bl_msg_check">'+
                            '<div class="top_msg_check">'+
                                '<div class="msg_check im_msg_user msg_arrow" data-date="'+l('just_now')+'" title=""><p></p>'+
                                    '<div class="icon_check_msg hide"></div>'+
                                '</div>'+
                                '<div class="pic_msg_check pic_user">'+
                                    '<a href="'+urlPagesSite.profile_view+'">'+
                                        '<img onload="$(this).parent(\'a\').addClass(\'show\')" src="'+urlFiles+$this.user_photo+'" alt="" title="" />'+
                                    '</a>'+
                                '</div>'+
                            '</div>'+
                        '</div>'+
                '</div>');
        //'+$this.user_name+', '+$this.user_age+'
    }

    this.send = function(el){
        if(Profile.notAccessToSite())return false;
		var text=$.trim(el.value),$el=$(el);
        $el.val('').trigger('autosize');
		if(!text)return false;
        var $msg=$this.getTemplateMsg();
		var uid=$el.data('uid'), send= +new Date,
            $node=$msg.find('p').html(strToHtml(text));
		$msg.attr({'id':'im_open_msg_'+send,'data-msg-user-id':$this.guid,'data-to-user-id':uid,'data-id':0,'data-send':send})
            .data({dataMsgUserId:$this.guid, dataToUserId:uid, id:0, send:send});
        //if(!$this.isSp){
           //$msg.find('.upgrade_msg').removeClass('hide');
        //}
        var $im=$('#im_open_list_msg_'+uid),data=$this.prepareMsg($im,$msg);
		$this.showMsgOne(uid,data.msg,data.cont,data.fn);
        $this.listImBl[uid].removeClass('new_empty_im');
        $.post(url_main+'messages.php?cmd=send_message&display='+isOneChat,
			  {ajax:1,user_to:uid,msg:text,send:send,to_delete:0,last_id:last_id},
              function(res){
                var data=checkDataAjax(res);
                if(data!==false){
                    data=$($.trim(data));
					if(!data[0])return;

                    $this.updateServer(data);
                    var $im=data.filter('.bl_im_msg_one'),
                        dataId=$im.data('id'),sendId=$im.data('send');

                    if(!$('#im_open_msg_'+dataId)[0]&&$('#im_open_msg_'+sendId)[0]){
                        $msg.attr({'id':'im_open_msg_'+dataId,'data-id':dataId}).data('id',dataId);
                        $msg.find('.icon_check_msg').attr({'id':'msg_read_'+dataId,'data-mid':dataId}).data('mid',dataId);
                        $im.find('script').appendTo('#update_server');
                        $this.messagesCacheAdd(uid, dataId, 0);
                        var txt=$im.find('p').html();
                        if(txt!=$node.html()){
                            $node.html(txt);
                            $this.reInitToScroll($this.uploadMsgScrollPl[uid]);
                        }
                    }
				}
        })
		return false;
    }

    this.prepareMsg = function($im,$msg){
        var $lastMsg=$im.find('.bl_im_msg_one:not(.write)').last(),fn='appendTo',cont=$im;
        if($lastMsg[0]){
            if($lastMsg.data('msgUserId')==$msg.data('msgUserId')){
                $msg.find('.msg_arrow').removeClass('msg_arrow');
                if($msg.is('.write')){
                    $msg.find('.pic_user').hide();
                }else{
                    $msg.find('.pic_user').remove();
                }
            }
            cont=$lastMsg;
            fn='insertAfter';
        }
        var $lastMsgWr=$im.find('.bl_im_msg_one').last();
        if($lastMsgWr[0]&&$lastMsgWr.is('.write')){
            var is=$lastMsgWr.data('msgUserId')==$msg.data('msgUserId');
            $lastMsgWr.find('.im_msg_user')[is?'removeClass':'addClass']('msg_arrow');
            $lastMsgWr.find('.pic_user')[is?'fadeOut':'fadeIn'](300);
            if (!$lastMsg[0]) {
                fn='insertBefore';
                cont=$lastMsgWr;
            }
        }
        return {msg:$msg, cont:cont, fn:fn};
    }

    this.showMsgOne = function(uid,$msg,cont,fn,t,call,notReInitScroll){
        /*$msg[fnTo||'appendTo'](cont);
        $this.reInitToScroll(scrollPl);
        if(typeof call=='function')setTimeout(call,10);*/
        notReInitScroll=notReInitScroll||0;
        $this.listImOverview[uid].removeClass('animate');
        var scrollPl=$this.uploadMsgScrollPl[uid];
        $msg.addClass('sent').hide()[fn](cont)
            .slideDown({duration:t||350,
                        step:function(){
                            if(!notReInitScroll)$this.reInitToScroll(scrollPl)
                        },
                        complete:function(){
                            if(!notReInitScroll)$this.reInitToScroll(scrollPl)
                            if(typeof call=='function')call();
                            $msg.removeClass('sent');
                            if(!$this.listImOverview[uid].find('.bl_im_msg_one.sent')[0]){
                                $this.listImOverview[uid].addClass('animate');
                            }
                        }})
        $this.setTooltipDateMsg($msg);
	}

    this.deleteMsgOne = function(uid,$msg,t,call,notReInitScroll){
        if(!$msg[0]||typeof $this.uploadMsgScrollPl[uid]=='undefined'){
            return;
        }
        notReInitScroll=notReInitScroll||0;
        $this.listImOverview[uid].removeClass('animate');
        var scrollPl=$this.uploadMsgScrollPl[uid];
        $msg.slideUp({duration:t||350,
                      step:function(){
                        if(!notReInitScroll)$this.reInitToScroll(scrollPl)
                      },
                      complete:function(){
                        $msg.remove();
                        if(!notReInitScroll)$this.reInitToScroll(scrollPl);
                        if(typeof call=='function')call();
                        $msg.removeClass('sent');
                        if(!$this.listImOverview[uid].find('.bl_im_msg_one.sent')[0]){
                            $this.listImOverview[uid].addClass('animate');
                        }
                    }})
    }

    /* One IM */
    this.closeOneIm = function(uid){
        var msg=trim($this.listImText[uid].val());
        if(msg){
            confirmCustom($this.langParts.are_you_sure_you_want_to_close,function(){$this.closeIm(uid)});
            return;
        }
        $this.closeIm(uid);
    }

    this.closeIm = function(uid){
        var $im=$this.listImBl[uid],st=$this.isOpen($im);
        $im.oneTransEnd(function(){
            $im.remove();
            $this.prepareIm();
        }).addClass(st?'to_close':'to_close_head');
        $im.removeAttr('style');
        $this.setVisibleIm(uid,'C');
        $this.deleteDataOneIm(uid);
    }

    this.setVisibleIm = function(uid,visible){
        $.post(url_ajax+'?cmd=set_visible_open_im',{user_id:uid, visible:visible},function(res){
                var data=checkDataAjax(res);
                if(!data){
                    //alertServerError()
                }
        })
    }

    this.showOriginalMessage = function($el){
        $el.slideUp(300);
        $el.next('.original_message').slideDown(300);
    }

    this.showReadMsg = function(list){
        //console.log('SET READ MSG:', list);
        for (var uid in list) {
            var $im=$('#im_open_'+uid),id=list[uid]*1;
            if ($im[0]&&$('#msg_read_'+id+'.hide')[0]) {
                //console.log(uid,id);
                $im.find('.icon_check_msg.hide').each(function(){
                    var $el=$(this);
                    if($el.data('mid')<=id)$el.removeClass('hide');
                })
            }
        }
    }

    this.updateCounterImOpen = function(uid){
        var $imTitle=$('#im_open_title_'+uid),valIm=$imTitle.data('newMsgCount');//.data('newMsgCount',0);
        var name=l('open_im_title').replace(/{name}/, $imTitle.data('userName'));
        $imTitle.html(name);
        $imTitle.closest('a').removeClass('blink');
        var $listChatsOpenCount=$jq('#list_chats_open_count'),
            count=$listChatsOpenCount.data('newMsgCount')-valIm,
            title = l('popup_messages_list_title_empty');
        if(count > 0){
            title = l('popup_messages_list_title').replace(/{count}/, count)
        }
        $listChatsOpenCount.text(title);
        var $imMore=$('#im_open_more_'+uid);
        var $newMsg=$('#list_chats_open_user_new_msg_'+uid);
        if($newMsg[0]){
            $newMsg.removeClass('to_show');
        }
    }

    this.updateCounter = function(listNewMsg){
        var countOpen=0, countForceOpen=0,
            numberVisIm=$('.open_im_chat:visible').length,
            defaultVisIm=$this.getNumberVisibleIm(),
            isForcedOpen=isSiteOptionActive('forced_open_chat_with_new_message');
        for (var uid in listNewMsg) {
            var count=listNewMsg[uid]*1, $im, $imTitle, $imMore, title=false;
            if(uid=='all'){
                count -=countForceOpen;
                var $listChatsOpenCount=$jq('#list_chats_open_count');
                if($listChatsOpenCount[0]){
                    title = l('popup_messages_list_title_empty');
                    if(count){
                        title = l('popup_messages_list_title').replace(/{count}/, count)
                    }
                }
                if (title != $listChatsOpenCount.text()) {
                    //console.log('ALL TILTE',title);
                    $listChatsOpenCount.html(title)
                }
                $listChatsOpenCount.data('newMsgCount',count);
                messages.updateCounter(count);
            }else{
                $im=$('#im_open_'+uid);
                $imMore=$('#im_open_more_'+uid);
                if($im[0]||$imMore[0]){
                    if($im[0]){
                        $imTitle=$('#im_open_title_'+uid);
                        if(!$this.isOpen($im)&&$imTitle.data('newMsgCount')!=count){
                            //console.log(uid,$imTitle.data('newMsgCount'),count);
                            var name=$imTitle.data('userName');
                            if(count){
                                title = l('open_im_title_count').replace(/{count}/, count).replace(/{name}/, name);
                                if(!$im.is('.hide'))$imTitle.closest('a').addClass('blink');
                            }else{
                                $imTitle.closest('a').removeClass('blink');
                                title=l('open_im_title').replace(/{name}/, name);
                            }
                            $imTitle.html(title);

                            //console.log('USER TITLE',title);
                        }
                        $imTitle.data('newMsgCount',count);
                        if(!$im.is('.hide')){
                            countOpen +=count;
                        }
                    }
                    if($imMore[0]){
                        if ($imMore.data('newMsgCount')!=count) {
                            if(title === false){
                                title=$imMore.data('userName');
                                if(count){
                                    title = l('open_im_title_count').replace(/{count}/, count).replace(/{name}/, title);
                                }
                            }
                            $imMore.html(title);
                        }
                        $imMore.data('newMsgCount',count);
                    }
                }else if(count && isForcedOpen){
                    numberVisIm++;
                    if(numberVisIm<=defaultVisIm){
                        countOpen +=count;
                        countForceOpen +=count;
                        $('#list_chats_open_user_'+uid).click();
                    }
                }
            }
        }
        if(listNewMsg['all']){
            var c=listNewMsg['all']-countOpen;
            $this.$lc.find('.head span.marker')[c?'addClass':'removeClass']('blink');
        }else{
            $this.$lc.find('.head span.marker').removeClass('blink');
        }
    }

    this.updateWritingUsers = function(writingUsers){
        for (var uid in writingUsers) {
            var $im=$('#im_open_'+uid);
            if ($im[0] && !$this.uploadMsgList[uid].find('.bl_im_msg_one.write')[0]) {
                var msg =
                '<div id="im_open_msg_write" class="bl_im_msg_one write" data-send="0" data-id="0" data-msg-user-id="'+uid+'" data-to-user-id="'+uid+'">'+
                '<div class="top">'+
                '<div class="pic pic_user">'+
                    '<a href="'+urlMain+$im.data('userProfileUrl')+'">'+
                        '<img onload="$(this).parent(\'a\').addClass(\'show\')" src="'+urlFiles+$im.data('userPhoto')+'" alt="" title="'+$im.data('userName')+', '+$im.data('userAge')+'"/>'+
                    '</a>'+
                    '</div>'+
                    '<div class="msg im_msg_user msg_arrow" title="">'+
                        '<span class="blink_msg">...</span>'+
                    '</div>'+
                '</div>'+
                '</div>';
                $this.updateServerMsg($('<div>'+msg+'</div>'));
            }
        }
    }

    this.deleteWritingUsers = function(deleteWritingUsers){
        for (var uid in deleteWritingUsers) {
            var $im=$('#im_open_'+uid);
            if($im[0]){
                $this.deleteMsgOne(uid,$this.uploadMsgList[uid].find('.bl_im_msg_one.write'));
            }
        }
    }

    this.deleteNoExistsIm = function(uid){
        var $im=$this.listImBl[uid];
        $im.oneTransEnd(function(){
            $im.remove();
            $this.prepareIm();
        }).addClass('to_close');
        $im.removeAttr('style');
        $this.deleteDataOneIm(uid);
    }

    this.existsOpenIm = function(existsIm){
        //console.log(existsIm,users_list_open_im);
        for (var uid in users_list_open_im) {
            if(!(uid in existsIm)
                &&$this.listImBl[uid]
                &&!$this.listImBl[uid].is('.new_empty_im')){
                $this.deleteNoExistsIm(uid);
                //console.log('DELETE EXISTS IM', uid);
            }
        }
    }

    $(function(){
    })

    return this;
}