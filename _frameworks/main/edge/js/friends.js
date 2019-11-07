var CFriends = function(guid) {

    var $this=this;

    this.guid=guid*1;

    this.updateListNotification = function(data){
        var d=0;
        for (var key in data) {
            var user=data[key],
            $tmpl=
                $('<li id="friends_notification_'+user['user_id']+'" class="friends_notification_item" data-created="'+user['created']+'">'+
                    '<div class="cont">'+
                        '<a class="pic" href="'+user['url']+'">'+
                        '<img src="'+user['photo']+'" alt="" />'+
                        '</a>'+
                        '<span class="text">'+user['title']+'</span>'+
                    '</div>'+
                    '<div class="buttons">'+
                        '<button onclick="clFriends.actionNotification('+user['user_id']+', \'approve\', $(this))"  class="btn btn-success btn-sm">'+
                            '<span>'+l('add_friend')+'</span>'+
                        '</button>'+
                        '<button onclick="clFriends.actionNotification('+user['user_id']+', \'remove\', $(this))" class="btn btn-secondary btn-sm">'+
                            '<span>'+l('ignore')+'</span>'+
                        '</button>'+
                    '</div>'+
                  '</li>');

            if ($this.ppPending.is('.in')) {
                $tmpl.hide().prependTo($this.ppPendingList).delay(d+=350)
                    .slideDown({step:function(){
                        $this.reInitToScroll(0)
                    },complete:function(){
                        $this.reInitToScroll(0)
                    },duration:350})
            } else {
                $tmpl.prependTo($this.ppPendingList);
                $this.reInitToScroll(0);
            }
        }
        $this.noPendingRequest();
    }

    this.actionNotification = function(uid, cmd, $btn){
        $btn.prop('disabled', true).addChildrenLoader();
        $btn.siblings('button').prop('disabled', true);
        $this.sendRequestFriend(false, uid, cmd, cmd=='remove');
    }

    this.isGetListFriends = function(){
        var uid=$this.getListFriendsUid();
        if(uid && uid == $this.guid){
            return 1;
        }
        return 0;
    }
    this.getListFriendsUid = function(){
        if($this.$rightColumnBl.friends[0]){
            return $this.$rightColumnBl.friends.data('uid');
        }
        return 0;
    }

    $this.requestAjax={};
    if($this.requestAjax['blocked'])return;
    this.sendRequestFriend = function($btn, uid, cmd, notAlert){
        $btn=$btn||[];
        if($btn[0]){
            uid=$btn.data('uid');
            cmd=$btn.data('cmd');
        }
        if($this.requestAjax[uid])return;

        //return;

        var fn=function(){
            $this.requestAjax[uid]=true;
            if($btn[0]){
                addChildrenLoader($btn);
            }

            $.post(url_main+'my_friends.php?action='+cmd,{ajax_data:1,uid:uid,get_counter_pending:1,friends_list_uid:$this.getListFriendsUid()},
            function(res){
                var data=checkDataAjax(res);
                if(data){
                    $this.responseRequestFriend(uid, $btn, data, cmd, notAlert);
                }else{
                    /*var $notif=$('#friends_notification_'+uid);
                    if ($notif[0]) {
                        $notif.find('button').prop('disabled', false).removeChildrenLoader();
                    }*/
                    alertServerError();
                }
                $this.requestAjax[uid]=false;
                $btn[0]&&removeChildrenLoader($btn);
            })
        }

        if($btn[0] && $btn.data('tooltip'))$btn.blur();
        if($btn[0] && cmd == 'remove') {
            confirmCustom(l('really_remove_from_friends').replace('{user_name}',$btn.data('userName')),fn,l('are_you_sure'));
        } else {
            fn()
        }
    }

    this.responseRequestFriend = function(uid, $btn, data, cmd, notAlert){
        notAlert=notAlert||0;
        clCounters.setDataOneCounter('friends_pending', data.counter, data.counter);

        var action=data.action, uidRequest=0;
        if($btn[0]){
            uidRequest=$btn.data('param');
            //if(uid!=uidRequest)$btnRightColumn=[];
        }
        var msg=l('the_friend_request_has_been_sent');
        if ((cmd=='request'||cmd=='approve')&&action=='approve') {
            msg=l('you_are_now_friends');
        }else if(cmd=='remove'&&action=='remove'){
            msg=uidRequest==siteGuid ?l('you_have_canceled_the_request_as_a_friend'):l('the_user_has_been_unfriended');
        }//else if(cmd=='decline'&&action=='decline'){
            //msg=l('you_have_canceled_the_request_as_a_friend');
        //}
        !notAlert&&alertCustom(msg, l('alert_success'));

        if(action!='request'){
            if(data.list_friends){
                $this.updateFriends(data.list_friends);
                $this.updateFriends(data.list_friends_online, true);
            }
            clPages.myFriendsReload();
        }
        cmd='request';
        uidRequest=0;
        var title=l('add_to_friends');
        if (action=='request'||action=='approve') {
            cmd='remove';
            if (action=='approve') {
                title=l('unfriend');

            }else{
                title=l('remove_request');
                uidRequest=siteGuid;
            }
        }
        $this.showPostForFriend(uid, action, data.wall_only_post);
        if(action=='approve' || action=='remove'){
            clPages.pageFriendsReloadCheckUser($this.guid);
        }
        var $notif=$('#friends_notification_'+uid);
        if ($notif[0]) {
            $this.ppPendingListTop.addClass('no_animate');
            $notif.slideUp({step:function(){
                        $this.reInitToScroll()
                    },complete:function(){
                        $notif.closest('li').remove();
                        if ($this.noPendingRequest()) {
                            $this.visiblePendingList('hide');
                            return false;
                        }
                        $this.reInitToScroll();
                        setTimeout(function(){$this.ppPendingListTop.removeClass('no_animate')},100);
                    },duration:350})
        }
        $this.updateLink(cmd, title, uidRequest);
    }

    this.showPostForFriend = function(uid, action, wall_only_post){
        if(typeof clWall != 'object')return;
        clWall.showPostForFriend(uid, action, wall_only_post);
    }

    this.updateLink = function(cmd, title, uidRequest){
        $jq('.menu_friends_add_edge').each(function(){
            var $btn=$(this).attr({cmd:cmd, param:uidRequest}).data({cmd:cmd, param:uidRequest});
            var fn=function(){
                if($btn.data('tooltip')){
                    $btn.tooltip('hide').attr('data-original-title', title);
                }else{
                    $btn.find('.btn_title').text(title);
                }
                var cl=cmd=='remove'?'fa-user-times':'fa-user-plus';
                $btn.find('i').removeClass('fa-user-times fa-user-plus').addClass(cl);
            }
            if ($btn.closest('.bl_column_friend_add')[0]) {
                var $bl=$btn.closest('.bl_column_friend_add'),
                    isHidden=$bl.is('.to_hide_btn');
                isHidden&&fn();
                $bl.oneTransEnd(function(){
                    !isHidden&&fn()
                })[cmd=='request'?'removeClass':'addClass']('to_hide_btn')
                $this.visibleMenuItemAddFriend();
            } else {
                fn()
            }
        })
    }

    this.getNewItemRightColumn = function(uid, data, online){
        online=online||'';
        var chat='';
        if (online || $this.isGetListFriends() == $this.guid) {
            chat='<i onclick="sendMessages(\''+uid+'\');" class="fa fa-commenting open_im_user" aria-hidden="true"></i>';
        }
        return $('<li id="right_column_friend'+online+'_item_'+uid+'" class="right_column_friend_item">'+
                    chat+
                    '<a class="right_column_friend'+online+'_'+uid+' to_hide_bl" href="'+data.friend_url+'" title="'+data.friend_name+'">'+
                        '<img src="'+data.friend_photo+'" alt=""/>'+
                    '</a>'+
                 '</li>')
    }

    this.noPendingRequest = function(){
        var is=!$('.friends_notification_item', $this.ppPendingList)[0];
        $this.btnShowPendingList[is?'addClass':'removeClass']('disabled');
        return is;
    }

    this.visiblePendingList = function(action,fnHide){
        if(typeof fnHide!='function')fnHide=function(){};
        if(!$this.ppPending[0]){
            fnHide();
            return;
        }
        action=action||($this.ppPending.is('.pp_show')?'hide':'show');
        var cl='pp_'+action;

        if($this.ppPending.is('.'+cl)){
            fnHide();
            return;
        }
        if(action=='hide'){
            $this.ppPending.one('hidden.bs.collapse',function(){
                fnHide();
            })
        }
        $this.ppPending.removeClass(action=='show'?'pp_hide':'pp_show');
        //$this.ppPendingListTop.css('top',0);
        $this.ppPending.addClass(cl).collapse(action);
    }

    this.reInitToScroll = function(posY){
        posY=defaultFunctionParamValue(posY, 'relative');
        $this.ppPendingListPl.update(posY);
    }

    this.dur=300;
    this.friendsCount=0;
    this.friendsOnlineCount=0;
    this.updateFriends = function(data, online){
        online=online||false;
        var count=data.count*1, curCount, $more, $moreEl,
            $bl=online?$this.$rightColumnBl.friends_online:$this.$rightColumnBl.friends,
            debug=false&&online,
            isVisibleBl=isVisiblePage;
        if(isVisibleBl){
            isVisibleBl = $bl.is(':visible');
        }
        if (!$bl[0])return;

        if(online){
            $more=$('.more',$bl);
            $moreEl=$('.more > a',$bl);
            curCount=$this.friendsOnlineCount;
        }else{
            curCount=$this.friendsCount;
        }
        var $items=$('.right_column_friend_item',$bl),
            friends=data.list;

        if (debug) {
            console.log('Friend ONLINE visible page', isVisibleBl);
            console.log('Friend ONLINE all', count, data.list);
        }

        if (!count) {
            var fnEnd0=function(){
                $bl.removeClass('to_show');
                $items.remove();
                if (online) {
                    $moreEl.addClass('to_hide_bl',0);
                    $this.friendsOnlineCount=0;
                }else{
                    $this.friendsCount=0;
                }
            }
            if($bl.is('.to_show')){
                $bl.aSlideUp({dur:$this.dur,complete:fnEnd0})
            }
            return;
        }

        var $el,$list=$bl.find('.list_photo'),
        fnEnd=function(){
            for (var key in friends) {
                if(online){
                    $el=$this.getNewItemRightColumn(key, friends[key], '_online');
                    if(!$('#'+$el[0].id)[0]){
                        debug && console.log('ADD Friend online',key);
                        if (isVisibleBl) {
                            $el.insertBefore($more).find('a').removeClass('to_hide_bl',0);
                        } else {
                            $el.insertBefore($more).find('a')[0].classList.remove('to_hide_bl');
                        }
                    }
                }else{
                    $el=$this.getNewItemRightColumn(key, friends[key]);
                    if(!$('#'+$el[0].id)[0]){
                        debug && console.log('ADD Friend',key);
                        if (isVisibleBl) {
                            $el.appendTo($list).find('a').removeClass('to_hide_bl',0);
                        } else {
                            $el.appendTo($list).find('a')[0].classList.remove('to_hide_bl');
                        }
                    }
                }
            }
            debug && console.log('ADD Friend COUNT',curCount,count);
            if (curCount!=count) {
                if (online) {
                    $moreEl[count>data.max_number?'removeClass':'addClass']('to_hide_bl');
                    $this.friendsOnlineCount=count;
                }else{
                    $this.friendsCount=count;
                }
                $('.title > a',$bl).html(data.count_title);
            }
        },

        fnStart=function(){
            if (!$items[0]) {
                fnEnd();
                return;
            }
            var i=0, $item;
            (function fu(){
                $item=$items.eq(i);
                if(!$item[0]){
                    fnEnd();
                    return;
                }
                if(online){
                    var k=$item[0].id.replace(/right_column_friend_online_item_/, '');
                } else{
                    var k=$item[0].id.replace(/right_column_friend_item_/, '');
                }
                if(friends[k]){
                    debug && console.log('Friend ONLINE exists', k);
                    delete friends[k];
                    i++;fu();
                }else{
                    //console.log('DELETE Friend', el.id);
                    if (isVisibleBl) {
                        $item.oneTransEnd(function(){
                            debug && console.log('Friend ONLINE delete', k);
                            $item.remove();
                            i++;fu();
                        }).find('a').addClass('to_hide_bl',0);
                    } else {
                        debug && console.log('Friend ONLINE delete no vis page', k);
                        $item.remove();
                        i++;fu();
                    }
                }
            })()
        }

        if (!$bl.is('.to_show')) {
            $bl.aSlideDown({dur:$this.dur,complete:function(){
                $bl.addClass('to_show');
            }})
        }

        fnStart();

        return;
    }

    this.removeItem = function(uid,prf){
        prf=prf||'';
        if(prf)prf = '_' + prf;
        $('#right_column_friend'+prf+'_item_'+uid).oneTransEnd(function(){
            $(this).remove();
        }).addClass('to_hide_bl');

    }

    this.visibleMenuItemAddFriend = function(){
        var $blBtn=$('.bl_column_friend_add');
        if(!$blBtn[0])return;
        $jq('#profile_user_more_menu_bl').find('.menu_friends_add_edge')[$blBtn.is('.to_hide_btn')?'show':'hide']()
    }

    $(function(){
        $this.$rightColumnBl={
            friends : $('#right_column_friend_bl'),
            friends_online : $('#right_column_friend_online_bl')
        }
        $this.ppPending=$('#friends_notification');
        if($this.ppPending[0]){
            $this.ppPending.on('shown.bs.collapse',function(){
                $jq('body').addClass('drop_collapse');
                $this.reInitToScroll();
            }).on('hide.bs.collapse',function(){
                $jq('body').removeClass('drop_collapse');

                if(!isMobileSite)return;
                if($this.btnShowPendingList.is('.history_open')&&!$this.btnShowPendingList.is('.history_close_back')){
                    backStateHistory();
                }
                $this.btnShowPendingList.removeClass('history_open history_close_back');
            }).collapse({toggle:false});
            $this.ppPendingList=$('#friends_notification_list');
            $this.ppPendingListPl=$('#friends_notification_scrollbox').tinyscrollbar({wheelSpeed:30,thumbSize:30,deltaHeight:12}).data('plugin_tinyscrollbar');
            $this.ppPendingListTop=$('.overview, .thumb', $this.ppPending);
            $this.btnShowPendingList=$('#friends_notification_link').click(function(){
                var fn=function(){
                    if(isMobileSite && !$this.noPendingRequest()){
                        if (!$this.btnShowPendingList.is('.history_open')) {
                            $this.btnShowPendingList.addClass('history_open');
                            setPushStateHistory('mobile_pending_friends_list_open');
                        }
                    }
                    if ($this.noPendingRequest()) {
                        $this.visiblePendingList('hide');
                        return false;
                    }
                    $this.visiblePendingList();
                }

                if (isMobileSite) {
                    clEvents.visibleList('hide',fn);
                } else {
                    clEvents.visibleList('hide');
                    fn();
                }
                return false;
            })

            $this.ppPending.click(function(e){
                this==e.target&&$this.btnShowPendingList.click();
            })
            $doc.on('click', function(e){
                var $el=$(e.target);
                if (!$el.is('#friends_notification')&&!$el.closest('#friends_notification')[0]
                    &&!$el.is('.custom_modal')&&!$el.closest('.custom_modal')[0]){
                    $this.visiblePendingList('hide');
                }
            })
        }
        $this.visibleMenuItemAddFriend();
    })
    return this;
}