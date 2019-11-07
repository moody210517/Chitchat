var CEvents = function(guid) {

    var $this=this;
    this.guid=guid*1;

    this.getFirstEventDate = function(){
        var $ev=$this.ppEventsList.find('.events_notification_item').not('#events_notification_more').first();
        return $ev[0] ? $ev.data('date') : '0000-00-00 00:00:00';
    }

    this.updateEvents = function(data){
        debugLog('Update events', data);
        clCounters.setDataOneCounter('new_events', data.new_count);
        if (typeof data.new_list != 'object' || $.isEmptyObject(data.new_list)) return;
        $this.updateListNotification(data.new_list,'prependTo',$this.ppEventsList,'top',true);
    }

    this.updateListNotification = function(data,fn,$bl,pos,update,noAnimate){
        /* Data:
        event_id: "2522"
        event_item_id: "217"
        event_user_id: "451"
        id: "217"
        new: "0"
        photo: "./_files/photo/1025_414145_s.jpg"
        rank: "6"
        time_ago: "2 years ago"
        title: "<a  href="./jenny_bright">J. Bright</a> has commented your thought about a video"
        type: "vids_comment"
        type_short: "vc"
        url: "jenny_bright"
        user_id: "1025"*/
        var d=-250,t=300, rank=0,
            c=0,
            count= typeof data == 'object' ? Object.keys(data).length : 0;
        pos=pos||'bottom';
        fn=fn||'insertBefore';
        $bl=$bl||$jq('#events_notification_more');
        update=update||false;
        noAnimate=noAnimate||false;
        !$.isEmptyObject(data)&&$this.ppEventsListTop.addClass('no_animate');
        var fnComplete = function(){
            c++;
            if(c==count){
                $this.ppEventsListTop.removeClass('no_animate');
                if (update) {
                    debugLog('Update events Rank', rank);
                    var rankB=$this.ppEventsMore.data('rank')+rank;
                    $this.ppEventsMore.attr('data-rank', rankB).data('rank', rankB);
                }
            }
        }
        for (var key in data) {
            var event=data[key];
            if (!$('#'+event['alias'])[0]) {
                var isNew =(event['new'])*1;
                var clNew=isNew ? 'new' : '',
                tmplMoreMenu = '<span class="event_menu dropdown-toggle" data-target="#'+event['alias']+'_menu" data-toggle="collapse" role="button" aria-haspopup="true">'+
                                '<span class="dots_circle"></span>'+
                                '<ul id="'+event['alias']+'_menu" class="more_menu_collapse menu_collapse collapse">'+
                                    '<li>'+
                                        '<a class="">'+
                                            '<span>'+
                                                '<span data-cl-loader="more_menu_loader" class="icon_fa"><i class="fa fa-check" aria-hidden="true"></i></span>'+
                                                '<span class="btn_title">'+l('mark_as_read')+'</span>'+
                                            '</span>'+
                                        '</a>'+
                                    '</li>'+
                                '</ul>'+
                            '</span>';
                if (!isNew) {
                    tmplMoreMenu = '';
                }
                var $tmpl=
                $('<li id="'+event['alias']+'" data-id="'+event['id']+'" data-date="'+event['date']+'" data-type="'+event['type']+'" data-event-id="'+event['event_id']+'" data-event-item-id="'+event['event_item_id']+'" data-event-user-id="'+event['event_user_id']+'" data-event-item-parent-id="'+event['event_item_parent_id']+'" class="events_notification_item '+clNew+'">'+
                    '<div class="cont">'+
                        '<a class="pic" href="'+event['url']+'">'+
                        '<img src="'+event['photo']+'" alt="" />'+
                        '</a>'+
                        '<span class="text">'+
                            '<span class="event_title">'+event['title']+'</span>'+//+event['alias']+'/'
                            '<span class="event_time_ago">'+event['time_ago']+'</span>'+
                        '</span>'+
                        tmplMoreMenu+
                    '</div>'+
                  '</li>');
                !update && $this.ppEventsMore.attr('data-rank', event['rank']).data('rank', event['rank']);
                if ($this.ppEvents.is('.in')) {
                    $tmpl.hide()[fn]($bl).delay((d+=250)*.8)
                        .slideDown({step:function(){
                        $this.reInitToScroll(pos,noAnimate)
                        },complete:function(){
                            $this.reInitToScroll(pos,noAnimate);
                            fnComplete();
                        },duration:t *=.8})
                } else {
                    $tmpl[fn]($bl);
                    $this.reInitToScroll(pos,noAnimate);
                    fnComplete();
                }
                rank++;
            }else{
                fnComplete();
            }
        }
    }

    this.noEvents = function(){
        var is=!$('.events_notification_item', $this.ppEventsList)[0];
        $this.btnShowEventsList[is?'addClass':'removeClass']('disabled');
        return is;
    }

    this.reInitToScroll = function(posY,noAnimate){
        posY=defaultFunctionParamValue(posY, 'relative');
        noAnimate=noAnimate||false;

        if(isMobile()) {
            if(posY=='relative')return;
            var t=600;
            if(posY=='bottom'){
                posY=noAnimate?$this.ppEventsListPl[0].scrollHeight:'max';
            }
            console.log(1111111111,posY, noAnimate);
            if (noAnimate) {
                $this.ppEventsListPl.stop();
                $this.ppEventsListPl[0].scrollTop = posY;
                return;
            }
            $this.ppEventsListPl.scrollTo(posY, t, {axis:'y', interrupt:true, easing:'easeOutExpo'});
        } else {
            $this.ppEventsListPl.update(posY);
        }
    }

    this.visibleList = function(action,fnHide){
        if(typeof fnHide!='function')fnHide=function(){};
        if(!$this.ppEvents[0]){
            fnHide();
            return;
        }
        action=action||($this.ppEvents.is('.pp_show')?'hide':'show');
        var cl='pp_'+action;
        if($this.ppEvents.is('.'+cl)){
            fnHide();
            return;
        }
        if(action=='hide'){
            $this.ppEvents.one('hidden.bs.collapse',function(){
                fnHide();
            })
        }
        $this.ppEvents.removeClass(action=='show'?'pp_hide':'pp_show');
        $this.ppEvents.addClass(cl).collapse(action);
    }

    this.getEventsMore = function(){
        //console.log('Events more', $this.ppEventsMore.data('rank'));
        $this.ppEventsMore.addClass('disabled');
        addChildrenLoader($this.ppEventsMore);
        $.post(url_ajax+'?cmd=get_more_event',{rank:$this.ppEventsMore.data('rank')},
            function(res){
                var data=checkDataAjax(res);
                if(data!== false){
                    $this.updateListNotification(data.data,false,false,false,false,true);
                    if (data.load) {
                        $this.ppEventsMore.removeClass('disabled');
                        removeChildrenLoader($this.ppEventsMore);
                    } else {
                        $jq('#events_notification_more').slideUp({step:function(){
                            $this.reInitToScroll('bottom',true)
                        },complete:function(){
                            $jq('#events_notification_more').remove();
                            $this.reInitToScroll('bottom',true);
                        },duration:200})
                    }
                }else{
                    alertServerError();
                    $this.ppEventsMore.removeClass('disabled');
                    removeChildrenLoader($this.ppEventsMore);
                }
        })
    }

    this.hideSeenEvent = function($item, count){
        clCounters.setDataOneCounter('new_events', count);
        $item.removeClass('new');
        $item.find('.more_menu_collapse').collapse('hide');
        $item.find('.event_menu').fadeTo(300,0,function(){
            $(this).remove()
        })
    }

    this.markSeenEvent = function($btn){
        if($btn.is('.disabled'))return;
        addChildrenLoader($btn.addClass('disabled'));
        var $item=$btn.closest('.events_notification_item');
        var id=$item.data('id'),type=$item.data('type');
        $.post(url_ajax+'?cmd=mark_see_event',{type:type, id:id},
            function(res){
                var data=checkDataAjax(res);
                if(data!== false){
                    $this.hideSeenEvent($item, data);
                }else{
                    alertServerError();
                    removeChildrenLoader($btn.removeClass('disabled'));
                }
        })
    }

    $(function(){
        $this.ppEvents=$('#events_notification');
        if($this.ppEvents[0]){
            $this.ppEvents.on('shown.bs.collapse',function(){
                $jq('body').addClass('drop_collapse');
                $this.reInitToScroll();
            }).on('hide.bs.collapse',function(){
                $jq('body').removeClass('drop_collapse');

                if(!isMobileSite)return;
                if($this.btnShowEventsList.is('.history_open')&&!$this.btnShowEventsList.is('.history_close_back')){
                    backStateHistory();
                }
                $this.btnShowEventsList.removeClass('history_open history_close_back');
            }).collapse({toggle:false});

            $this.ppEventsList=$('#events_notification_list');

            if(isMobile()) {
                $this.ppEventsListPl=$('#events_notification_scrollbox .viewport');
            } else {
                $this.ppEventsListPl=$('#events_notification_scrollbox').tinyscrollbar({wheelSpeed:30,thumbSize:30,deltaHeight:12}).data('plugin_tinyscrollbar');
            }
            $this.ppEventsListTop=$('.overview, .thumb', $this.ppEvents);
            $this.btnShowEventsList=$('#events_notification_link').click(function(){
                var fn=function(){
                    if(isMobileSite && !$this.noEvents()){
                        if (!$this.btnShowEventsList.is('.history_open')) {
                            $this.btnShowEventsList.addClass('history_open');
                            setPushStateHistory('mobile_events_list_open');
                        }
                    }
                    if ($this.noEvents()) {
                        $this.visibleList('hide');
                        return false;
                    }
                    $this.visibleList();
                }

                if (isMobileSite) {
                    clFriends.visiblePendingList('hide',fn);
                } else {
                    clFriends.visiblePendingList('hide');
                    fn();
                }
                return false;
            })

            $this.ppEvents.click(function(e){
                this==e.target&&$this.btnShowEventsList.click();
            })

            $this.ppEventsMore=$jq('#events_notification_more_link').click(function(){
                if($this.ppEventsMore.is('.disabled'))return false;
                $this.getEventsMore();
                return false;
            })

            $doc.on('click', function(e){
                var $el=$(e.target);
                if (!$el.is('#events_notification')&&!$el.closest('#events_notification')[0]
                    &&!$el.is('.custom_modal')&&!$el.closest('.custom_modal')[0]){
                    $this.visibleList('hide');
                }
            })

            $('body').on('click', '.events_notification_item', function(e){
                var $el=$(this),$target=$(e.target);

                if($target.is('a')||$target.closest('a')[0]||$target.is('.event_menu')||$target.closest('.event_menu')[0]){
                    var $markSee=$target.closest('.more_menu_collapse');
                    if ($markSee[0]) {
                        $this.markSeenEvent($markSee.find('a'));
                    }
                    return;
                }

                var isVideo=false,
                    type=$el.data('type'),
                    eventId=$el.data('eventId'),
                    eventUserId=$el.data('eventUserId'),
                    eventItemId=$el.data('eventItemId'),
                    eventItemParentId=$el.data('eventItemParentId');
                $this.visibleList('hide');
                if (type == 'wall_comments_likes' || type == 'wall_comments') {
                    var url=urlPagesSite.wall+'?item='+eventId+'&uid='+$this.guid+'&ncid='+eventItemId,
                        parentId=eventItemParentId ? '&npcid='+eventItemParentId : '';
                    redirectUrl(url+parentId);
                    return;
                }

                if (type == 'vids_comment' || type == 'vids_comments_likes') {
                    isVideo=true;
                    eventId='v_'+eventId;
                }
                setTimeout(function(){
                    var c=$jq('.new_events_counter').data('counter')*1
                    if($el.is('.new'))c--;
                    if(c<0)c=0;
                    $this.hideSeenEvent($el, c);
                    debugLog(eventId, isVideo, eventUserId, eventItemId);
                    openGallery(e, eventId, isVideo, eventUserId, eventItemId);
                },200)
            })
        }
    })
    return this;
}