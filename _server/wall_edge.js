var CWall = function() {

	var $this = this;
    this.dur=500;
    this.scrollDelta = 500;
    this.scrollBlock = false;
    this.oldItemsExists = false;
    this.isProfileWall = 0;
    this.singleItemMode = true;
    this.isFriendResponse = 0;


    this.sel = {
        commentsCount           : '#wall_item_comments_count_',
        commentReplyBl          : '#wall_item_comments_replies_',
        commentReply            : '#wall_item_comment_reply_',
        commentLikesBl          : '#wall_item_comment_likes_bl_',
        commentLikesBlLink      : '#wall_item_comment_like_link_',
        commentReplyLikesBl     : '#wall_item_comment_reply_likes_bl_',
        commentReplyLikesBlLink : '#wall_item_comment_reply_like_link_',
        sharesCount             : '#wall_item_shares_count_',
        feedShare               : '#feed_share_'
    }

    this.prepareSel = function(sel, prf) {
        sel=$this.sel[sel];
        prf=prf||'';
        if (prf) {
            sel='#'+prf+sel.replace('#','');
        }
        return sel;
    }


    this.isDebug = true;
    this.debug = function(msg, data) {
        if (!$this.isDebug) return;
        debugLog('Wall: '+msg, data);
    }

    this.setData = function(data){
        for (var key in data) {
            //console.log('WALL DATA: ' + key + '=' + data[key]);
            $this[key] = data[key];
        }
    }

    /* ----------------------- CACHE DATA ----------------------------------- */
    this.itemsInfo = {};
    this.itemInfoSet = function(id, like, comment, commentsCount, isViewed, listLikeUser, section, shares, sharesCount, actionLikeComment) {
        if(!id) return;
        if (!$this.itemsInfo[id]) {
            $this.itemsInfo[id] = {
                section:'',
                like:'',
                comment:'',
                commentsCount:0,
                listLikeUser:'',
                shares:false,
                sharesCount:0,
                actionLikeComment:'0000-00-00 00:00:00'
            }
        }
		var info=$this.itemsInfo[id];
		info.like=(like||info.like);
		info.comment=(comment||info.comment);
		info.commentsCount=(commentsCount||info.commentsCount);
        info.listLikeUser=listLikeUser||info.listLikeUser;
        info.section=section||info.section;

        info.shares=shares||info.shares;
        info.sharesCount=sharesCount||info.sharesCount;
        info.actionLikeComment=actionLikeComment||info.actionLikeComment;

        $this.debug('ItemInfoSet - '+id, info);

        $this.updateCounters(id,sharesCount,info);
        $this.updateCountersOnePost(id);

        if (info.section == 'photo' || info.section == 'vids') {
            var mid=$('#wall_item_'+id).data('itemId');
            if (info.section == 'vids') {
                mid='v_'+mid;
            }
            if(typeof clProfilePhoto.visibleMediaData != 'undefined' && clProfilePhoto.visibleMediaData[mid]){
                clProfilePhoto.visibleMediaData[mid]['comments_count'] = info.commentsCount;
                $this.debug('update MEDIA - '+id, clProfilePhoto.visibleMediaData[mid]);
            }
        }
        $this.commentsLoadMoreStatus(id, info.commentsCount, isViewed);
	}

    this.commentsCacheAll = {};
    this.commentsCache = {};
    this.commentsLast = {};
    this.commentsFirst = {};
    this.commentsVisible = {};
    this.commentsCacheAddAll = function(id, cid) {
        if (!$this.commentsCacheAll[id]) {
            $this.commentsCacheAll[id]={};
        }
        $this.commentsCacheAll[id][cid] = cid;
    }

    this.commentsCacheAdd = function(id, cid) {

        if (!id) return;

        $this.commentsCacheAddAll(id, cid);

		if (!$this.commentsCache[id]) {
            $this.commentsCache[id]={};
            $this.commentsVisible[id]=0;
        }

		if ($this.commentsCache[id][cid]) return;

        if (!$this.commentsInfo[cid]) {
            $this.commentsInfo[cid] = {
                replyCount:0,
                replyVisible:0
            }
        }

		$this.commentsCache[id][cid] = cid;
        $this.commentsVisible[id]++;

        if (!$this.commentsReplyCache[cid]) {
            $this.commentsReplyCache[cid]={};
        }

        if(!$this.commentsLast[id]){
            $this.commentsLast[id]=$this.getDataId(cid);
        }
        $this.commentsLast[id]=Math.min($this.commentsLast[id], $this.getDataId(cid));

        if(!$this.commentsFirst[id]){
            $this.commentsFirst[id]=$this.getDataId(cid);
        }
		$this.commentsFirst[id]=Math.max($this.commentsFirst[id], $this.getDataId(cid));

        //$this.debug('commentsCacheAll', $this.commentsCacheAll);
        //$this.debug('commentsCache', $this.commentsCache);
        //$this.debug('commentsLast', $this.commentsLast);
        //$this.debug('commentsFirst', $this.commentsFirst);
        //$this.debug('commentsVisible', $this.commentsVisible);
	}

    this.commentsReplyCache = {};
    this.itemCommentsReplyFirst = {};
    this.itemCommentsReplyLast = {};
    this.commentsInfo = {};

    this.updateRepliesLoadMoreStatus = function(cid, count) {
        if (!$this.commentsInfo[cid]) {
            $this.commentsInfo[cid] = {
                replyCount:0,
                replyVisible:0
            }
        }

        var info=$this.commentsInfo[cid];
        info.replyCount=count||info.replyCount;
        $this.commentsRepliesLoadMoreStatus(cid, info.replyCount);
    }

    this.commentsReplyCacheAdd = function(id, cid, rcid, count) {
        if (!id || !cid) return;
        count *=1;
        $this.commentsCacheAddAll(id, rcid);

		if (!$this.commentsReplyCache[cid]) {
            $this.commentsReplyCache[cid]={};
        }

        if (!$this.commentsInfo[cid]) {
            $this.commentsInfo[cid] = {
                replyCount:0,
                replyVisible:0
            }
        }

        $this.debug('commentsInfo', [id, cid, rcid, count]);
        /*var info=$this.commentsInfo[cid];
        info.replyVisible++;
        info.replyCount=count||info.replyCount;
        $this.commentsRepliesLoadMoreStatus(cid, info.replyCount);*/
        $this.commentsInfo[cid].replyVisible++;
        $this.updateRepliesLoadMoreStatus(cid, count);

		if ($this.commentsReplyCache[cid][rcid]) return;
        $this.commentsReplyCache[cid][rcid] = rcid;


        if(!$this.itemCommentsReplyFirst[cid]){
            $this.itemCommentsReplyFirst[cid]=$this.getDataId(rcid);
        }
        $this.itemCommentsReplyFirst[cid]=Math.min($this.itemCommentsReplyFirst[cid], $this.getDataId(rcid));

        $this.setReplyCommentInfoLoadWall(cid, rcid);
        //$this.debug('commentsCacheAll', $this.commentsCacheAll);
        //$this.debug('commentsReplyCache', $this.commentsReplyCache);
        //$this.debug('itemCommentsReplyFirst', $this.itemCommentsReplyFirst);
        //$this.debug('itemCommentsReplyLast', $this.itemCommentsReplyLast);
	}

    this.setReplyCommentInfoLoadWall = function(cid, rcid) {
        $this.debug('setReplyLastId', [cid, rcid]);
        rcid=$this.getDataId(rcid);

        if(!$this.itemCommentsReplyLast[cid]){
            $this.itemCommentsReplyLast[cid]=rcid;
        }
		$this.itemCommentsReplyLast[cid]=Math.max($this.itemCommentsReplyLast[cid], rcid);
    }

    this.itemInfoDelete = function(id) {
		delete $this.itemsInfo[id];
        if ($this.commentsCache[id]){
            for(var cid in $this.commentsCache[id]) {
                $this.commentsCacheRemoveByCid(id, cid);
            }
            delete $this.commentsCache[id];
        }
        if ($this.commentsCacheAll[id]){
            delete $this.commentsCacheAll[id];
        }
        if ($this.commentsVisible[id]) {
            delete $this.commentsVisible[id];
        }
	}

    this.commentsCacheRemoveByCid = function(id, cid) {
        if (!$this.commentsCache[id][cid]) return;
		if ($this.commentsCache[id] && $this.commentsCache[id][cid]){
            delete $this.commentsCache[id][cid];
        }
		if ($this.commentsCacheAll[id] && $this.commentsCacheAll[id][cid]){
            delete $this.commentsCacheAll[id][cid];
        }
        if ($this.commentsReplyCache[cid]) {
            for(var rcid in $this.commentsReplyCache[cid]) {
                if ($this.commentsCacheAll[id] && $this.commentsCacheAll[id][rcid]) {
                    delete $this.commentsCacheAll[id][rcid];
                }
            }
            delete $this.commentsReplyCache[cid];
        }
        if ($this.commentsInfo[cid]) {
            delete $this.commentsInfo[cid];
        }
        var c=$this.commentsVisible[id] - 1;
        if(c<0)c=0;
		$this.commentsVisible[id] = c;
        if (typeof $this.itemsInfo[id] != 'undefined'
                && typeof $this.itemsInfo[id].commentsCount != 'undefined') {
            c=$this.itemsInfo[id].commentsCount - 1;
            if(c<0)c=0;
            $this.itemsInfo[id].commentsCount = c;
        }
	}

    /* ----------------------- CACHE DATA ----------------------------------- */


    this.queueUpdateCounters = {};
    this.queueCountersInc = 0;
    this.setQueueUpdateCounters = function(fn){
        var check = false;
        if(!$.isEmptyObject($this.queueUpdateCounters)){
            check = true;
        }
        $this.queueUpdateCounters[$this.queueCountersInc++]=fn;
        return check;
    }

    this.runQueueUpdateCounters = function(){
        var i=true;
        for(var id in $this.queueUpdateCounters) {
            if(i){
                i=false;
                delete $this.queueUpdateCounters[id]
            } else {
                $this.queueUpdateCounters[id]();
                break;
            }
        }
        $this.debug('QueueUpdateCounters:', $this.queueUpdateCounters);
    }

    this.updateCounters = function(id,sharesCount,info) {
        var isUpdateShares = info.shares !== false,
            fn=false;
        if(isUpdateShares){
            fn=function(){
                $this.updateSharesCounter(id, info.sharesCount)
            };
        }
        $this.updateCommentsCounter(id, info.commentsCount, fn);
    }

    this.updateCommentsCounter = function(id,count,call) {
        if($this.setQueueUpdateCounters(function(){
            $this.updateCommentsCounter(id,count,call)
        })){
            return;
        }
        count *=1;

        var $counterBl=$($this.sel.commentsCount + id),
            fnCall=function(){
                if(typeof call=='function'){
                    call();
                } else {
                    $this.runQueueUpdateCounters();
                }
            };

        if(!$counterBl[0] || $counterBl.data('count')==count) {
            fnCall();
            return;
        }

        $counterBl.data('count',count).attr('data-count',count);
        var $counter=$counterBl.find('.comments_count'),
            cl='to_hide',lVar=count==1?'wall_comments_one_count':'wall_comments_count',
            countTitle=l(lVar).replace('{comments_count}',count);

        if(count){
            $counter.text(countTitle);
            if($counterBl.is('.'+cl)){
                $counterBl.oneTransEnd(fnCall).removeClass(cl);
            } else {
                fnCall()
            }
        } else if(!$counterBl.is('.'+cl)) {
            $counterBl.oneTransEnd(function(){
                if(!$counterBl.data('count'))$counter.text(countTitle);
                fnCall()
            }).addClass(cl);
        } else {
            fnCall()
        }
    }

    this.updateSharesCounter = function(id,count) {
        count *=1;
        var $counterBl=$($this.sel.sharesCount + id);
        $this.debug('SHARES', id, count, $counterBl.data('count')==count);

        if(!$counterBl[0] || $counterBl.data('count')==count){
            $this.runQueueUpdateCounters();
            return;
        }

        var $conterBlComments=$($this.sel.commentsCount + id),
            $counter=$counterBl.find('.shares_count');

        $counterBl.data({count: count}).attr('data-count',count);

        if ($counterBl.closest('ul.how_many_comments_shares').is(':hidden')) {//Mobile block hidden
            if(count){
                $counter.text(count);
                $counterBl.removeClass('to_hide');
            } else {
                $counterBl.addClass('to_hide');
            }
            $this.runQueueUpdateCounters();
            return;
        }
        if(count){
            $counter.text(count);
            if($counterBl.is('.to_hide')){
                if ($conterBlComments.is('.to_hide')) {
                    $counterBl.toggleClass('to_hide to_hide_1').oneTransEnd(function(){
                        $this.runQueueUpdateCounters();
                    }).delay(10).removeClass('to_hide_1',0);
                } else {
                    clMediaTools.showLi($counterBl,$this.runQueueUpdateCounters);
                }
            } else {
                $this.runQueueUpdateCounters();
            }
        } else if(!$counterBl.is('.to_hide')) {
            if ($conterBlComments.is('.to_hide')) {
                $counterBl.oneTransEnd(function(){
                    $counterBl.addClass('to_hide');
                    $counterBl.removeClass('to_hide_1');
                    $this.runQueueUpdateCounters();
                }).addClass('to_hide_1')
            } else {
                clMediaTools.hideLi($counterBl,$this.runQueueUpdateCounters);
            }
        } else {
            $this.runQueueUpdateCounters();
        }
    }

    this.itemLikeSet = function(id, like, listLikeUser) {
        $this.itemsInfo[id].like=like;
        $this.itemsInfo[id].listLikeUser=listLikeUser;
        $this.debug('ItemLikeSet: ',[id,like,listLikeUser]);
    }

    this.initScrollToNotifComment = function(cid, pcid){
        $(function(){
            if (!cid && !pcid)return;
            $this.debug('Init Scroll to notif comment', [cid, pcid]);
            var $comm=[], $toCommentH=[];
            if (cid) {
                $comm=$('#wall_item_comment_reply_'+cid);
                $toCommentH=$comm.find('.comment_text_reply_one');
                if (!$comm[0]) {
                    $comm=$('#wall_item_comment_'+cid);
                    $toCommentH=$comm.find('.comment_text_cont');
                }
            }
            if (!$comm[0] && pcid) {
                $comm=$('#wall_item_comment_'+pcid);
                $toCommentH=$comm.find('.comment_text_cont');
            }

            if ($comm[0]) {
                clMediaTools.highlightEvent($toCommentH);
                clMediaTools.getElOnScroll().scrollTo($comm.eq(0), $this.dur*1.5, {axis:'y', interrupt:true, over_subtract:{top:3}, easing:'easeOutExpo'});
            }
        })
    }

    this.init = function(){
        $this.debug('INIT');

        $this.wallBl=$jq('.bl_wall');
        $this.wallItems=$jq('#wall_items');
        $this.inputPostAdd=$('#wall_item_add').keydown(doOnEnter($this.itemAdd)).autosize();
        $win.on(evWndRes,function(){
            if(!isMobileSite || isChangeDevice)return;
            setTimeout(function(){
                if(!isMobileSite || isChangeDevice)return;
                if(isAppAndroid){
                    setZeroTimeout($this.checkScrollInput)
                }else{
                    setTimeout($this.checkScrollInput,evWndResTime)
                }
            },evWndResTime)
        })

        $this.$itemAddLoader=$('#wall_item_add_loader');
        $this.$scriptUpdate=$('#wall_script_ajax');
        $this.$placeholder=$('#placeholder_post').clone();
        $this.$loadAnimationBl=$('.wall_load_old_items');
        $this.$loadAnimation=$('#load_animation');
        $this.$wallNoItems=$('#wall_no_items');

        $this.initGoTo();
        $this.initAddImage();
        $this.initPpOnePost();

        $jq('body').on('click', function(e){
            $this.hideMoreMenu(e);
        }).on('click', '.timeline_photo', function(e){
            //$this.showOnePost($(this).closest('.wall_post_item').data('id'), '');
            var $el=$(this);
            $this.showOnePost($el.closest('.wall_post_item').data('id'), $el[0].href, $el);
            return false;
        }).on('click', '.timeline_photo_comment', function(e){
            //$this.showOnePost($(this).closest('.wall_post_item').data('id'), '');
            var $el=$(this);
            $this.showOnePost($el.closest('.wall_post_item').data('id'), $el[0].href, $el, true);
            return false;
        })
    }

    this.showPostForFriend = function(uid, action, wallOnlyPost){
        if($this.uid!=uid)return;
        var $blPostWall=$('.bl_post_wall_'+uid),d=300;
        if(!$blPostWall[0])return;
        $this.isFriend = action=='approve';
        var $blArrow=$('.pl_grid_count .menu_inner_wall_posts_edge.active .bl');
        if(wallOnlyPost==1){
            $blPostWall.stop()[$this.isFriend?'slideDown':'slideUp'](d);
            $blArrow[$this.isFriend?'addClass':'removeClass']('show_post_input');
        }else if($blPostWall.is(':hidden')){
            $blPostWall.stop().slideDown(d);
            $blArrow.addClass('hide_post_input');
        }
    }

    this.showPostBlockedUser = function(uid, action, wallOnlyPost){
        //console.log(uid, action, wallOnlyPost);

        if($this.uid!=uid || (!wallOnlyPost && action=='user_unblock'))return;

        var $blPostWall=$('.bl_post_wall_'+uid),d=300;
        if(!$blPostWall[0])return;
        var $blArrow=$('.pl_grid_count .menu_inner_wall_posts_edge.active .bl'),
            isShow=action=='user_unblock';

        $blPostWall.stop()[isShow?'slideDown':'slideUp'](d);
        $blArrow[isShow?'addClass':'removeClass']('show_post_input');
    }

    this.hideMoreMenu = function(e){
        var $targ=$(e.target);
        //if(!$targ.closest('.bl_wall')[0])return;
        if(e){
            if($targ.is('.more_menu_collapse')||$targ.closest('.more_menu_collapse')[0]){
                return;
            }
        }
        $('.more_menu_collapse.in', '.bl_wall').collapse('hide');
    }

    this.updaterTimer = false;
    this.stopUdater = false;
    this.autoUpdateTimeout = 10000;
    this.updaterInit = function(){
        if ($this.stopUdater)return;
        $this.debug('UpdaterInit');
        $this.singleItemMode = false;
        clearTimeout($this.updaterTimer);
        $this.updaterTimer = setTimeout($this.updater, $this.autoUpdateTimeout);
    }

    this.updater = function() {
        if ($this.stopUdater) return;
        //return;
        clearTimeout($this.updaterTimer);
		$this.setPostIdMax($this.firstPostId);

		var url='wall_ajax.php?cmd=update&last_item_id='+$this.getPostIdMax()+'&wall_uid='+$this.uid,
            data={//last_comment_id: $this.commentsLast[$this.OnePostId]||0,
				  items: JSON.stringify($this.itemsInfo),
                  comments_all: JSON.stringify($this.commentsCacheAll),
                  comments: JSON.stringify($this.commentsCache),
                  comments_replies: JSON.stringify($this.commentsReplyCache),
                  comments_first: JSON.stringify($this.commentsFirst),
                  comments_reply_last: JSON.stringify($this.itemCommentsReplyLast),
                  is_see: $this.onlySeeFriends,
                  is_profile_wall: $this.isProfileWall,
                  type_wall: 'all'};
		$.post(url,data, function(res){
            if($this.stopUdater)return;
            var items=$this.checkDataAjax(res,1);
            if(items && (items=trim(items))){
                //$this.checkToSeeWall(items);
                if(items=='no'||items=='no_post')return;
                var $html=$(items),
                    $scrInfo=$html.filter('script.update_item_info_set');

                $this.updateItems(items, false, false, true);
                var $liked=$html.filter('.who_liked');
                if($liked[0]){
                    $liked.each(function(){
                        $this.likeChange(this.id,$(this));
                    })
                }

                var fnAddComment = function($comments, reply, fnAppend, isPost, $commentsPrevLoad, notReverse){
                    if (!$comments[0])return;
                    isPost=isPost||false;
                    reply=reply||false;
                    fnAppend=fnAppend||false;
                    $commentsPrevLoad=$commentsPrevLoad||[];
                    notReverse=notReverse||false;
                    var ord = (fnAppend == 'prependTo' || reply) && !notReverse;
                    //$this.debug('UPDATE COMMENTS ONE',reply,$comments);
                    var $comment,i=ord ? 0 : $comments.length-1;
                    (function fu(){
						$comment=$comments.eq(i);
						if(!$comment[0] || i < 0){
							return;
						}
                        if(ord){
                            i++
                        } else i--;
                        var send=$comment.data('send'),
                            cid=$comment.data('cid'),
                            id=$comment.data('post'),
                            sel, $bl;

                        if (isPost) {
                            $this.updateContOnePost($comment);
                            sel=reply ? '#pp_wall_item_comment_reply_' : '#pp_wall_item_comment_';
                            $bl=reply ? $('#pp_wall_item_comments_replies_'+cid) : $('#pp_wall_item_comments_'+id);

                        } else {
                            sel=reply ? '#wall_item_comment_reply_' : '#wall_item_comment_';
                            $bl=reply ? $('#wall_item_comments_replies_'+cid) : false;
                        }
                        //console.log(33333, isPost, '#'+$comment[0].id, sel+send);
                        var isParse=true;
                        if (fnAppend == 'prependTo' && $commentsPrevLoad[0]) {//ATTACH
                            if ($commentsPrevLoad.filter('#'+$comment[0].id)[0]) {
                                console.log('No Parse '+$comment[0].id);
                                isParse=false;
                            }
                        }
                        if (!$('#'+$comment[0].id)[0] && !$(sel+send)[0] && isParse){
                            var fn = 'appendTo';
                                //fn = reply ? 'appendTo' : 'prependTo';
                            if(fnAppend)fn=fnAppend;
                            clMediaTools.addCommentToBl($comment, id, fn, false, false, $bl);
						}
                        fu();
					})()
                }

                var $comments_g,
                    $commentsParse=[],
                    $comments = $html.find('.comment_to_comment_container.comment_attach_reply_one');

                if ($comments[0]) {
                    $this.debug('UPDATE COMMENTS REPLIES', $comments);
                    if($this.isOpenOnePost){
                        $comments_g=$comments.clone();
                        $('script', $comments_g).remove();
                        fnAddComment($comments_g,true,false,true);
                    }
                    fnAddComment($comments.clone(),true);
                    $html.find('.wall_item_one_comment.comment_attach_reply').remove();
                }

                $comments=$html.find('.comment_to_comment_container.comment_attach_reply_one_add');

                if ($comments[0]) {
                    $this.debug('UPDATE COMMENTS REPLIES ADD', $comments);
                    if($this.isOpenOnePost){
                        $comments_g=$comments.clone();
                        $('script', $comments_g).remove();
                        fnAddComment($comments_g,true,'prependTo',true,false,true);
                    }
                    fnAddComment($comments.clone(),true,'prependTo',false,false,true);
                    $html.find('.wall_item_one_comment.comment_attach_reply_add').remove();
                }

                $comments=$html.find('.wall_item_one_comment')
                               .not('.comment_attach, .comment_attach_reply, .comment_attach_reply_add');
                if ($comments[0]) {
                    $this.debug('UPDATE COMMENTS',$comments);
                    if($this.isOpenOnePost){
                        $comments_g=$comments.clone();
                        $('script', $comments_g).remove();
                        fnAddComment($comments_g,false,false,true);
                    }
                    $commentsParse=$comments.clone();
                    fnAddComment($commentsParse);
                    $comments.remove();
                }

                $comments = $html.find('.wall_item_one_comment.comment_attach');
                if ($comments[0]){
                    $this.debug('UPDATE COMMENTS ATTACH', $comments);
                    if($this.isOpenOnePost){
                        $comments_g=$comments.clone();
                        $('script', $comments_g).remove();
                        fnAddComment($comments_g, false, 'prependTo', true, $commentsParse);
                    }
                    fnAddComment($comments.clone(), false, 'prependTo', false, $commentsParse);
                    $comments.remove();
                }

                setTimeout(function(){
                    $scrInfo[0] && $this.$scriptUpdate.append($scrInfo);
                },500)
            }
            $this.updaterInit();
        })
    }


    this.initAddImage = function(){

        $this.addImageWall=$('#add_image_wall');
        $this.addImageUploadWall=$('#add_image_upload_wall');

        $('#wall_frm_upload_image').submit(function(e){
            var frm = $(this), file = frm.find('input[type=file]'),
                fileName = file.attr('name'), formData = new FormData(),
                error = '';
                $.each(file[0].files, function(i, file){
                    if ("image/jpeg,image/png,image/gif".indexOf(file.type) === -1) {
                        error = l('accept_file_types');
                        return false;
                    }else if (file.size > $this.maxFileSize) {
                        error = $this.lMaxFileSize;
                        return false;
                    }
                    formData.append(fileName, file);
                });
                if (error) {
                    alertCustom(error);
                    return false;
                }
                $this.processUploadImage=true;
                $this.addImageWall.hide();
                $this.$itemAddLoader.removeClass('hidden');

                var xhr = new XMLHttpRequest();
                xhr.open("POST", url_ajax+'?cmd=upload_image_wall&input_name=' + fileName);
                xhr.onreadystatechange = function() {
                    if (xhr.readyState == 4) {
                        if(xhr.status == 200) {
                            var data = xhr.responseText;
                            data = checkDataAjax(data);
                            if (data) {
                                $this.$itemAddLoader.addClass('hidden');
                                $this.processUploadImage = false;
                                if (data!='complete_upload_image') {
                                    $this.addImageWall.show();
                                    alertCustom(data);
                                } else {
                                    $this.addImageUploadWall.show();
                                    $this.isImageLoaded=true;
                                }
                            }

                        }
                    }
                };
                xhr.send(formData);
                return false;
        });
    }

    this.changeUploadImage = function($file) {
        $file.parent('form').find('input[type=submit]').click();
    }

    this.clickUpload = function($file) {
        $file.next('input[type=reset]').click();
    }

    this.clearUploadImage = function(){
        $this.processUploadImage=false;
        $this.isImageLoaded=false;
        $this.addImageUploadWall.hide();
        $this.addImageWall.show();
    }

    this.initGoTo = function(){
        var durGo='500ms', goTop=$('#wall_up')[0], wCont=$('#wall_items')[0],
        top=0, lastTop=0, scrolling, hidden=1, lastPos=0,
		transform=('webkitTransform' in document.body.style)?'webkitTransform':'transform',
		transition=('transition' in document.body.style)?'transition':'webkitTransition';
        var onresize=function(){
            top=$jq('body').scrollTop();
            if (!scrolling && wCont.offsetHeight<500+window.innerHeight) {
                goTop.style[transition]=hidden++?'none':0;
                goTop.style[transform]='translateY('+(lastPos=top>300?-window.innerHeight-105:0)+'px)';
                return
            }
            var pos=183, dur=durGo;
            if ((top)>500) {
			if (!scrolling) lastTop=top;
			var d=window.innerHeight-wCont.getBoundingClientRect().bottom+20;
			if (goTop.className) {goTop.className=''; goTop.title=l('to_the_top')};
			if (hidden) {pos=d>10?window.innerHeight+105:0};
			if (d>70) {pos=d+100; dur=hidden?durGo:'none'};
			hidden=0;
            }else if (top<200 && !goTop.className && lastTop) {
			goTop.className='down'; goTop.title=l('to_the_post_last_read');
            } else if (!goTop.className&&!scrolling) {pos=lastTop=0; hidden=0}
            if (pos==lastPos) return;
            goTop.style[transition]='all '+dur+', left 0s';
            goTop.style[transform]='translateY(-'+(lastPos=pos)+'px)';
        }
        $jq('body').on('scroll', onresize);
        $win.on('resize', onresize);
        $(goTop).click(function() {
            scrolling=1
            $('body, html').stop().animate({scrollTop:lastTop*$(goTop).is('.down')}, parseInt(durGo), function(){scrolling=0})
        })
    }

    this.initStyle = function(){
        var fn=function(){
            var w=$jq('#wall_items').width(), d=1.777778;
            $jq('#wall_custom_style')[0].innerHTML=[//, .video_native_poster
                ".wall_video_post .one_media_vimeo, .video-js, .video_native, .video-js object, .video_native object{height:", Math.round(w/d), "px;}",
                ".wall_video_post .one_media_youtube, .wall_video_post .one_media_metacafe{height:", Math.round(w/d), "px;}",
                ".wall_video_one_post .one_media_vimeo{height:", Math.round((w-80)/d), "px;}",
                ".wall_video_one_post .one_media_youtube, .wall_video_one_post .one_media_metacafe{height:", Math.round((w-80)/d), "px;}"
                ].join("");
        }
        fn();
        //getEventOrientation()
        //getTimeOrientation();
        $win.on('resize', function(){setTimeout(fn,1)});
    }

    this.postIdMax = 0;
    this.setPostIdMax = function(id){
		if(id > $this.postIdMax) {
			$this.postIdMax = id;
		}
	}

    this.getPostIdMax = function(){
		return $this.postIdMax;
	}

    $this.lastPostId = 0;
    this.setPostLastId = function(id){
		$this.lastPostId=id;
	}

    this.firstPostId = 0;
    this.setPostFirstId = function(id){
		$this.firstPostId=id;
	}

    this.isAuthOnly = function(value) {
		if (value == 'please_login') {
			redirectToLoginPage();
			return false;
		}
		return true;
	}

    this.isBlocked = function(value) {
		if(trim(value) == 'you_are_blocked') {
			alertCustom(MSG_YOU_ARE_IN_BLOCK_LIST);
			return true;
		}
		return false;
	}

    this.checkDataAjax = function(data, isCheckBlocked) {
        isCheckBlocked=isCheckBlocked||0;
        data=getDataAjax(data);
        if(data){
            if (!$this.isAuthOnly(data)) {
                return false;
            }
            if(!isCheckBlocked&&$this.isBlocked(data)) {
                return false;
            }
            return data;
        }else{return false}
    }


    this.preparePost = function() {
        return $this.$placeholder.clone().hide().attr('id', '')//.css({marginTop:'-30px'})
               .prependTo($this.wallItems).oneTransEnd(function(){
                    //clMediaTools.scrollToEl($(this));
                    //clMediaTools.scrollTopCheckViewport($(this));
               }).addClass('prependTo');
    }

    //this.sendAjaxAdd=0;
    this.isImageLoaded=false;
    this.processUploadImage=false;
    this.itemAdd = function() {
        var post=$.trim($this.inputPostAdd.val());
        if($this.processUploadImage)return false;
        if(!post&&!$this.isImageLoaded){
            $this.inputPostAdd.val('').trigger('autosize').focus();
            return false;
        }

        $this.inputPostAdd.val('').trigger('autosize',function(){
            //clMediaTools.scrollTopCheckViewport($this.inputPostAdd);
        }).blur();

        $this.setPostIdMax($this.firstPostId);

        var $itemTemp=$this.preparePost(),$preview=$('.timeline-wrapper', $itemTemp),
            $item=[], isUpdateItem=false,
            send = +new Date;
        $itemTemp.data({send:send}).attr({'id':'wall_item_'+send, 'data-send':send});

        var fnUpdateItem=function(){
            if(!$item[0]||!isUpdateItem)return;
//return;
            var hb=$win.width()>480 ? 0 : 1
            var h1=$itemTemp[0].offsetHeight+hb,
                m1=parseInt($itemTemp.css('margin-bottom'));
            $itemTemp.css({height:h1});//,overflow:'hidden'
//console.log($itemTemp.outerHeight(), $itemTemp.outerHeight(true),$itemTemp[0].offsetHeight, $itemTemp[0].clientHeight);
            isUpdateItem=false;

            var $next=$itemTemp.nextAll('.wall_post_item').eq(0).addClass('add_shadow_top');
            $preview.addClass('to_hide');
            var $itemUpdate=$('<div class="wall_post_item_update">').html($item.html())
            .appendTo($itemTemp).oneTransEnd(function(){
                $itemTemp.html($itemUpdate.html());
                //$itemUpdate.removeClass('wall_post_item_update to_show',0);
                //$preview.remove();
            }).addClass('to_show',0);

            hb=$win.width()>480 ? 7 : 1;
            var h=$itemUpdate.height()+hb;//7 = :before
        //console.log(1111,h, h1);
            $itemTemp.attr({id:$item[0].id, 'data-id':$item.data('id'), 'data-section':$item.data('section'), 'data-item-id':$item.data('itemId')})
                     .data({id:$item.data('id'), section:$item.data('section'), itemId:$item.data('itemId')});
            if (h > h1) {
                /*$itemTemp.oneTransEndM(function(){
                    $itemTemp.removeAttr('style');
                    $next.removeClass('add_shadow_top');
                    $this.checkTop();
                }).css({height:h,transition:'height 1.5s'})*/
                $itemTemp.stop().animate({height:h}, $this.dur, function() {
                                $itemTemp.removeAttr('style');
                                $next.removeClass('add_shadow_top');
                                $this.checkTop();
                            });
            } else {
                $itemTemp.removeAttr('style');
                $next.removeClass('add_shadow_top');
                $this.checkTop();
            }
        }
        $itemTemp.data('call',function(){
            isUpdateItem=true;
            fnUpdateItem();
        });
        if($this.$wallNoItems.is(':visible')){
            $this.showNoItem($this.checkTop);
        }else{
            $this.checkTop();
        }

        //wall_video_post = 588/472 = 1.25
        //wall_one_video = 640/360 = 1.78
        //one_media_metacafe = 480/385
        //one_media_youtube = 480/385
        //one_media_vimeo = 400/225
        //return false;
        var isImageLoaded=$this.isImageLoaded,
            lastItemId=$this.getPostIdMax();
        var fnSend=function(retry){
            var retry=retry||0,
                url = 'wall_ajax.php?cmd=item&last_item_id='+lastItemId+'&wall_uid='+$this.uid,
                data = {comment: post,
                        image_upload: isImageLoaded,
                        send: send,
                        is_profile_wall: $this.isProfileWall,
                        retry: retry}
            $this.debug('send post', data);
            $.ajax({url:url,
                type:'POST',
                data:data,
                timeout: globalTimeoutAjax,
                //cache: false,
                success: function(res){
                    var item=$this.checkDataAjax(res);
                    if(item && item != 'empty comment'){
                        var $data=$(trim(item));

                        $this.$scriptUpdate.append($data.filter('script'));
                        var $itemRes=$data.filter('div.wall_post_item').imagesLoaded(function(){
                            $item=$itemRes;
                            if($item.data('send')!=send)return;
                            if(isUpdateItem)fnUpdateItem();
                        })
                    }
                },
                error: function(xhr, textStatus, errorThrown){
                    globalRetryAjaxTimeout(xhr, textStatus, errorThrown, function(){
                        $this.debug('retry post', true);
                        fnSend(1);
                    })
                },
            })
        }
        fnSend();


        $this.clearUploadImage();
        return false;
	}

    this.checkTop = function() {
		if ($this.wallItems.offset().top-$jq('.navbar').height()>0 && !$('.wall_post_item:animated')[0]) {
            /*var $el=$('.wall_post_item.prependTo:hidden:last').addClass('animated'),
                $els=$el.add($el.nextAll('.wall_post_item')),
                h=$el.outerHeight(true);

			$els.css({transform: 'translateY(-'+h+'px)', transition: 'none', display:'block'})
            setTimeout(function(){
                $els.last().oneTransEnd(function(){
                    $els.removeAttr('style');
                    var call=$el.removeClass('prependTo animated').data('call');
                    if(typeof call=='function')call();
                    $this.checkTop();
                },'transform').end().css({transform: 'translateY(0px)', transition: $this.dur+'ms', display:'block'})
            },10)*/

            $('.wall_post_item.prependTo:hidden:last').slideDown($this.dur, function(){
                var call=$(this).removeClass('prependTo').data('call');
                if(typeof call=='function')call()
                $this.checkTop();
            }).scrollTop(5000);
		}
	}

    this.updateItems = function(data, insertFn, order, notScriptItemInfo) {

        insertFn=insertFn||'prependTo';
        order=order||0;

        var $html=$(trim(data)),
            $items=$html.filter('div.wall_post_item'), t=$this.dur, $item, i=0,
            selScript='script';

        if(notScriptItemInfo)selScript='script:not(.update_item_info_set)';
        $this.$scriptUpdate.append($html.filter(selScript));

        if (!order) {
            i=$items.length-1;
        }

        (function fu(){
			//$('.bl_post_wall_items .add_shadow').removeClass('add_shadow')
            $item=$items.eq(i);
            if(!$item[0] || i < 0){
                if(insertFn=='appendTo')$this.scrollBlock=false;
                return;
            }; if(!order)i--; else i++;
            var send=$item.data('send');
            if (!$('#'+$item[0].id)[0] && !$('#wall_item_'+send)[0]){
                $item.hide()[insertFn]($this.wallItems).addClass(insertFn);
                $item.prev().addClass('add_shadow');
                if($this.$wallNoItems.is(':visible')){
                    $this.showNoItem(fu);
                } else {
                    fu();
                }
            } else {fu()}
        })()

		if (insertFn=='prependTo') {
            $this.checkTop();
        } else {
            $this.showHistory($this.dur);
        }
    }

    this.setLastItem = function() {
        return;
        $('.wall_item').removeClass('last').last().addClass('last');
    }

    this.showNoItem = function(call) {
        $this.$wallNoItems[$('.wall_post_item', $this.wallItems)[0]?'slideUp':'slideDown'](function(){
            typeof call == 'function' && call()
        })
    }

    this.showHistory = function(dur) {
        dur*=.7;
        $('.wall_post_item.appendTo:hidden:first').slideDown(dur, function(){
            $(this).removeClass('appendTo');
            $this.showHistory(dur);
        }).scrollTop(5000);
	}

    /* History load */
    this.itemsHistoryLoadItems = function() {
        if ($this.stopUdater) return;
		$this.setPostIdMax($this.firstPostId);

        $this.$loadAnimation.addClass('to_show');

		/*var url = 'wall_ajax.php?cmd=items_old&id=' + $this.lastPostId + '&wall_uid=' + $this.uid
                  + '&is_see=' + $this.onlySeeFriends+ '&is_profile_wall='+$this.isProfileWall;
		$.get(url, function(res){
            $this.$loadAnimation.removeClass('to_show');
            var items=$this.checkDataAjax(res,1);
            if(items && (items=trim(items))){
                $this.updateItems(items, 'appendTo', 1);
            }
		})*/

        var data={
            id: $this.lastPostId,
            wall_uid: $this.uid,
            is_profile_wall: $this.isProfileWall,
            is_see: $this.onlySeeFriends
        }
        var fnLoad=function(){
            $.ajax({url:'wall_ajax.php?cmd=items_old',
                type:'POST',
                data:data,
                timeout: globalTimeoutAjax,
                success: function(res){
                    $this.$loadAnimation.removeClass('to_show');
                    var items=$this.checkDataAjax(res,1);
                    if(items && (items=trim(items))){
                        $this.updateItems(items, 'appendTo', 1);
                    }
                },
                error: function(xhr, textStatus, errorThrown){
                    globalRetryAjaxTimeout(xhr, textStatus, errorThrown, function(){
                        $this.debug('Retry history load',true);
                        fnLoad();
                    })
                },
            })
        }
        fnLoad();
	}

	this.itemsHistoryLoad = function() {
        $(function(){
            clMediaTools.getElOnScroll().scroll(function() {
                if ($this.stopUdater)return false;
                var d=$doc.height()- $win.height() - $this.scrollDelta - $jq('.cham-footer-style-3').height();
                //$('.cham-footer-widget h3').text($jq('body').scrollTop()+'/'+d);
                if ($this.oldItemsExists && !$this.scrollBlock && ($jq('body').scrollTop() > d)) {
                    $this.scrollBlock = true;
                    $this.itemsHistoryLoadItems();
                }
                $this.checkTop();
            })
        })
	}
    /* History load */

    /* Comments */
    this.commentsReplyCacheRemoveByCid = function(id, cid, rcid) {
        if (!$this.commentsCacheAll[id][rcid])return;
        if ($this.commentsCacheAll[id] && $this.commentsCacheAll[id][rcid]) {
            delete $this.commentsCacheAll[id][rcid];
        }
        if ($this.commentsReplyCache[cid] && $this.commentsReplyCache[cid][rcid]) {
            delete $this.commentsReplyCache[cid][rcid];
        }
		var c=$this.commentsInfo[cid].replyVisible - 1;
        if(c<0)c=0;
		$this.commentsInfo[cid].replyVisible = c;

        c=$this.commentsInfo[cid].replyCount - 1;
        if(c<0)c=0;
		$this.commentsInfo[cid].replyCount = c;
	}

    this.itemRemove = function() {
        if ($('.wall_post_item.animate_remove',$this.wallItems)[0])return;
        var $el = $('.wall_post_item.removeTo:first',$this.wallItems).addClass('animate_remove');
	    if (!$el[0]) return false;

        $this.shareUpdateTitle($el.data('shared'), $el.data('sharedUid'), 'unshare');

        var $els=$el.add('#' + $el[0].id + '~.wall_post_item'),
            $shAll=$el.prevAll('.wall_post_item').css({zIndex:2}),
            $sh=$el.prev().addClass('add_shadow_post'),
            h=$el.outerHeight(true);

        $el.css({zIndex:0});
        $jq('#bl_post_wall').addClass('add_shadow_remove');
        //if ($this.wallItems[0].getBoundingClientRect().bottom<$win.height()+h-50) {
        //var $last=$('.wall_post_item:last',$this.wallItems);($last[0] == $el[0])
        if ($('.wall_post_item',$this.wallItems).length == 1) {
            $el.oneTransEnd(function(){
                $el.remove();
                $sh.removeClass('add_shadow_post');
                $jq('#bl_post_wall').removeClass('add_shadow_remove');
                $shAll.css({zIndex:''});
                $this.showNoItem();
                $this.itemRemove();
            }).css({top: -h+'px', transition: $this.dur+'ms'})
        } else {
            $els.last().oneTransEnd(function(){
                $el.remove();
                $sh.removeClass('add_shadow_post');
                $jq('#bl_post_wall').removeClass('add_shadow_remove');
                $els.css({transform: '', transition: '', marginTop: ''});
                $shAll.css({zIndex:''});
                $this.showNoItem();
                $this.itemRemove();
            },'transform').end().css({transform: 'translateY(-'+h+'px)', transition: $this.dur+'ms'})
        }
    }

    this.itemExists = function(id, value, notUpdateInfo, cid, rCid) {
		var exists = true;
        notUpdateInfo=notUpdateInfo||false;
        if (value=='server_error') {
            $this.debug('SERVER ERROR');
            alertServerError();
            return false;
        }
        if (value=='you_are_blocked') {

        }

        if (value=='not exists comment') {
            $this.commentHide(id, cid, rCid, true);
        } else if (value=='not_exists' || value=='not exists' || value=='deleted') {

            $('#wall_item_' + id).addClass('removeTo');
            $this.itemRemove();

            if(!notUpdateInfo){
                $this.itemInfoDelete(id);
                /*if ($this.getPostIdMax()==id) {
                    var $first=$('.wall_post_item',$this.wallItems).not('.removeTo').first();
                    if($first[0] && $first.data('id')){
                        var id=$first.data('id')?$first.data('id'):0;
                        $this.setPostFirstId(id);
                        $this.postIdMax=id;
                    }
                }*/
            }

			exists = false;
		}

		return exists;
	}

    this.commentsLoadMore = function(id, $el) {
		if($el.is('.disabled'))return;
		$el.addClass('disabled');

        var isPpOnePost=$this.isElOnePost($el),
            data={id:id, last_id:$this.commentsLast[id], wall_uid:$this.uid};

        addChildrenLoader($el);

        var fnLoad=function(){
            $.ajax({url:'wall_ajax.php?cmd=comments_load',
                type:'POST',
                data:data,
                timeout: globalTimeoutAjax,
                success: function(res){
                    res=$this.checkDataAjax(res);
                    var $blComments=$('#wall_item_comments_'+id);
                    if (res && $blComments[0]) {
                        var $data=$(res),
                            $comments=$data.filter('.bl_comments').find('.item');
                        //$('script.item_script', $data).appendTo($this.$scriptUpdate);
                        if ($comments[0]) {
                            if (isPpOnePost) {
                                var $comments_g=$comments.clone();
                            }
                            var fnAddComment = function($comments, isPost){
                                isPost=isPost||false;
                                var $comment,i=0;
                                (function fu(){
                                    $comment=$comments.eq(i);
                                    if(!$comment[0]){
                                        if (!isPost) {
                                            $this.showFrmBottomCommentDelay(id);
                                        }
                                        return;
                                    }
                                    if (isPost) {
                                        $this.updateContOnePost($comment);
                                    }
                                    if(!$('#'+$comment[0].id)[0]){
                                        if (isPost) {
                                            clMediaTools.addCommentToBl($comment, id, 'prependTo', $this.showFrmBottomCommentOpenPost, '#pp_wall_item_comments_')
                                        } else {
                                            clMediaTools.addCommentToBl($comment, id, 'prependTo')
                                        }
                                    }
                                    i++;fu();
                                })()
                            }
                            fnAddComment($comments);
                            if (isPpOnePost) {
                                $('script', $comments_g).remove();
                                fnAddComment($comments_g, true);
                            }
                        }
                    } else {
                        //Gallery post delete - close
                    }
                    removeChildrenLoader($el);
                    $el.removeClass('disabled');
                },
                error: function(xhr, textStatus, errorThrown){
                    globalRetryAjaxTimeout(xhr, textStatus, errorThrown, function(){
                        $this.debug('Retry load more comments',data);
                        fnLoad();
                    })
                },
            })
        }
        fnLoad();
	}

    this.commentsLoadMoreStatusOne = function(id, count, isViewed, prf) {
        prf=prf||'';
        var $itemLoadMore = $('#'+prf+'wall_load_more_comments_' + id);
        $this.debug('commentsLoadMoreStatus',[id, count, $itemLoadMore.is(':visible')]);
        if (!$itemLoadMore[0] || !$itemLoadMore.is(':visible')) return;

        count=count||0;
        count *=1;
		var v=$this.commentsVisible[id]||0,
            q=count-v,
            dur=$this.dur;

        $this.debug('commentsLoadMoreStatus_START',[id, q>0, count, v]);

		if (q>0) {
            if ($itemLoadMore.data('all')!=count){
                $itemLoadMore.find('.number_all').text(count);
            }
            $itemLoadMore.data('all',count);
            if ($itemLoadMore.data('vis')==v) return;
            $itemLoadMore.data('vis',v);
            $itemLoadMore.find('.number_view').text(v);
            //clMediaTools.updateLoadMoreCounter($itemLoadMore, v, count);

            /*if (typeof isViewed != 'undefined' && isViewed != '') {
               $itemLoadMore[isViewed == 1?'addClass':'removeClass']('to_new');
            }*/
		} else {
			$itemLoadMore.stop().slideUp(dur);
		}
	}

    this.commentsLoadMoreStatus = function(id, count, isViewed) {
        $this.commentsLoadMoreStatusOne(id, count, isViewed);
        $this.isOpenOnePost && $this.commentsLoadMoreStatusOne(id, count, isViewed, 'pp_');
    }

    this.addCommentReplyFirstPlace = function($comment, cid, isPost) {
        if(!$comment[0])return;
        var prf='';
        if (isPost) {
            prf='pp_';
            $this.updateContOnePost($comment);
        }
        var send=$comment.data('send');
        if (!$('#'+$comment[0].id)[0] && !$($this.prepareSel('commentReply',prf)+send)[0]) {
            clMediaTools.addCommentToBl($comment, cid, 'prependTo', false, $this.prepareSel('commentReplyBl',prf));
            return true;
        } else {
            return false;
        }
        return false;
    }

    this.addCommentsRepliesLoadMore = function($data, cid, call, isPost) {
        if(!$data[0]) return;
        var $comments=$data.find('.photo_and_comment').find('.comment_to_comment_container');
        if ($comments[0]) {
            var i=$comments.length-1, $el;
            (function fu(){
                $el=$comments.eq(i);
                if(!$el[0] || i < 0){
                    if(typeof call == 'function')call();
                    return;
                }
                $this.addCommentReplyFirstPlace($el, cid, isPost);
                i--; fu();
            })()
            return true;
        } else {
            return false;
        }
    }

    this.resRepliesLoadMore = {};
    this.commentsRepliesLoadMore = function(id, cid, $el) {
        if($el.is('.disabled')) return;
        $el.addClass('disabled');
        var $icon=$el.find('.icon').addChildrenLoader();
        $this.debug('CommentsRepliesLoadMore',[$this.itemCommentsReplyFirst[cid]]);

        var isPpOnePost=$this.isElOnePost($el),
            data={id:id, cid:cid, last_id:$this.itemCommentsReplyFirst[cid], wall_uid:$this.uid};

        var fnLoad=function(){
            $.ajax({url:'wall_ajax.php?cmd=comments_load',
                type:'POST',
                data:data,
                timeout: globalTimeoutAjax,
                //cache: false,
                success: function(res){
                    res=$this.checkDataAjax(res);
                    if(res && $this.itemExists(id, res)){
                        var $num=$el.next('.comm_to_comm_text_number'),
                            $comments=$(res);
                        if (isPpOnePost) {
                            var $comments_g=$comments.clone();
                        }
                        $this.addCommentsRepliesLoadMore($comments,cid, function(){
                            setTimeout(function(){
                                if($num[0] && !$num.is('.to_show')){
                                    $el.find('.comments_replies_load_title').text(l('view_previous_replies'));
                                    $num.addClass('to_show');
                                }
                            },400)
                        })

                        if (isPpOnePost) {
                            $('script', $comments_g).remove();
                            $this.addCommentsRepliesLoadMore($comments_g,cid, function(){
                                return;
                                setTimeout(function(){
                                    if($num[0] && !$num.is('.to_show')){
                                        $el.find('.comments_replies_load_title').text(l('view_previous_replies'));
                                        $num.addClass('to_show');
                                    }
                                },400)
                            },true)
                        }
                    }
                    $icon.removeChildrenLoader();
                    $el.removeClass('disabled');
                },
                error: function(xhr, textStatus, errorThrown){
                    globalRetryAjaxTimeout(xhr, textStatus, errorThrown, function(){
                        $this.debug('Retry load more replies comments',data);
                        fnLoad();
                    })
                },
            })
        }
        fnLoad();
	}

    this.commentsRepliesLoadMoreStatusOne = function(cid, count, prf) {
        prf=prf||'';
        var $bl=$('#'+prf+'wall_item_comment_replies_load_' + cid);

        if (!$bl[0] || !$bl.is(':visible')) return;
        count=count||0;
        count *=1;
		var $itemLoadMore=$bl.find('.comm_to_comm_text_number'),
            v=$this.commentsInfo[cid].replyVisible||0,
            q=count-v,
            dur=$this.dur;
        $this.debug('commentsRepliesLoadMoreStatus',[cid, q>0, count, v]);
		if (q>0) {
            if ($bl.data('all')!=count){
                $itemLoadMore.find('.number_all').text(count);
            }
            $bl.data('all',count);
            if ($bl.data('vis')==v) return;
            $bl.data('vis',v);
            $itemLoadMore.find('.number_view').text(v);
		} else {
			$bl.stop().slideUp(dur);
		}
	}

    this.commentsRepliesLoadMoreStatus = function(cid, count) {
        $this.commentsRepliesLoadMoreStatusOne(cid, count);
        $this.isOpenOnePost && $this.commentsRepliesLoadMoreStatusOne(cid, count, 'pp_');
	}

    /* Comments */
    /* Like */
    this.likeChange = function(id,$cont) {
        var $blLikes=$('#'+id);

        if(!$blLikes[0]||$blLikes.is('.animate'))return;
        $blLikes.addClass('animate');
        var id0=id.replace('feed_like_result_','');
        if(!$cont[0]){
            $this.itemsInfo[id0].listLikeUser='';
        }
        $('#feed_like_'+id0)[$this.itemsInfo[id0].listLikeUser.indexOf($this.guid) === -1?'removeClass':'addClass']('wall_like_hidden');
        if(!$cont[0]||!$this.itemsInfo[id0].listLikeUser){
            $blLikes.slideUp($this.dur,function(){
                $blLikes.removeClass('animate');
                $blLikes.find('.who_liked_bl').empty();
            });
            return;
        }

        var $el=$cont.find('.who_liked_bl');

        if($blLikes.is(':hidden')){
            $blLikes.find('.who_liked_bl').html($el.html()).end().slideDown($this.dur,function(){
                $blLikes.removeClass('animate');
            })
        }else{
            var $blF=$blLikes.find('.who_liked_bl:last').addClass('to_top')
                    .delay(1).toggleClass('to_top to_state_op',0);
            $blLikes.prepend($el.addClass('to_top_op').delay(1)
            .oneTransEnd(function(){
                $blF.remove();
                $el.removeClass('to_state');
                $blLikes.removeClass('animate');
            }).toggleClass('to_top_op to_state',0));
        }
    }

    this.likeAddAjax={};
    this.likeAdd = function(id, $link,cmd) {
		$link=$link||$('#feed_like_hand_' + id);
        if($this.likeAddAjax[id])return;
        $this.likeAddAjax[id]=true;
        var $icon=$('.icon',$link).addChildrenLoader(),
            data={id:id,wall_uid:$this.uid};
        cmd=cmd||'like';
		$.post('wall_ajax.php?cmd='+cmd,data, function(data){
            $icon.removeChildrenLoader();
            data=$this.checkDataAjax(data);
            if(data && $this.itemExists(id, data)){
                var $likes=$(data).filter('.who_liked');
                $this.$scriptUpdate.append($(data).filter('script'));
                $this.likeChange('feed_like_result_'+id,$likes);
            }
            $this.likeAddAjax[id]=false;
        })
	}

	this.likeDelete = function(id, $link) {
        $this.likeAdd(id, $link, 'unlike');
	}
    /* Like */
    /* Delete */
    this.confirmItemDelete = function(id) {
        if ($this.stopUdater) return;
        confirmCustom(l('really_remove_this_post'), function(){$this.itemDelete(id)}, l('are_you_sure'));
        $('#wall_item_more_menu_'+id).closest('.more_menu_collapse').collapse('hide');
    }

    this.itemDelete = function(id) {
        if ($this.stopUdater) return;
        $this.itemExists(id, 'deleted', true);
		var url = 'wall_ajax.php?cmd=item_delete&id='+id+'&wall_uid='+$this.uid;
		$.post(url, function(data){
            data=$this.checkDataAjax(data);
            if(data == 'deleted'){
                $this.itemInfoDelete(id);
                $this.updater();

            }
        });
		return false;
	}
    /* Delete */
    /* Comment */
    this.initFeedComment = function(id,fn,$inp) {
        $inp=$inp||$(id);
        if(!$inp[0])return;
        if(typeof fn!='function')fn=$this.commentAdd;
        $inp.autosize({isSetScrollHeight:false,callback:function(){}}).keydown(doOnEnter(fn));
        $inp.next('.wall_post_send').click(function(){
            fn($inp);
        })
    }

    this.initFeedCommentReplies = function(id,$inp,prf) {
        prf=prf||'';
        $this.initFeedComment('#'+prf+'wall_comment_area_replies_'+id,$this.commentAddReplies,$inp)
    }

    this.getItemInfo = function($el, $wallItem) {
        var $item=$wallItem||$el.closest('.wall_post_item');
        if(!$item[0]){
            $item=$el.closest('.pp_wall_post_item');
        }
        var section=$item.data('section'),
            itemId=$item.data('itemId'),
            id=$item.data('id');
        if (section=='photo' || section=='vids') {
            return {id: id, item_id: itemId, section: section};
        }
        return {id: id, item_id: 0, section: ''};
    }

    this.showFrmBottomComment = function(id,prf) {
        prf=prf||'';
        var frm=prf+'wall_feed_comment_'+id,
            $frm=$('#'+frm);
        if(!$frm[0])return;
        var c=$this.commentsVisible[id]||0;
        if(c>$this.numberCommentsFrmShow){
            if($frm.is(':hidden')){
                clMediaTools.showFrmReplyComment([], frm, false, false, true);
            }
        } else {
            clMediaTools.hideFrmReplyComment(frm, true, false)
        }
    }

    this.showFrmBottomCommentOpenPost = function(callCompete,noAnimate) {
        clProfilePhoto.showLastFieldComment(callCompete,noAnimate,$('.bl_comments > .wall_item_one_comment', $this.$ppWallOnePost),$this.numberCommentsFrmShow)
    }

    this.showFrmBottomCommentDelay = function(id, d, prf) {
        d=d||200;
        prf=prf||'';
        setTimeout(function(){$this.showFrmBottomComment(id,prf)},d);
    }

    this.fnBlur = function($inp, $comment) {
        var d = isMobileSite ? 150 : 1,
            dt = isMobileSite ? evWndResTime : 1;
        setTimeout(function(){
            $inp.blur();
            setTimeout(function(){
                if (!$this.inViewport($comment[0])) {
                    $this.scrollToNative($comment, false, $this.dur);
                }
            },dt)
        },d)
    }

    this.commentAdd = function(inp) {
        var $inp=$(inp);

        if($inp.is('button')){
            $inp=$inp.prev('textarea');
        }

        var isPpOnePost=$this.isElOnePost($inp),
            $wallItem=false;
        if (isPpOnePost) {
            $wallItem=$this.$ppWallOnePost;
        }

        var comment=trim($inp.val()),
            itemInfo=$this.getItemInfo($inp,$wallItem),
            id=itemInfo.id,
            section=itemInfo.section,
            param=itemInfo.item_id;

        if(section == 'vids')param='v_'+param;

        if(!comment){
            $inp.val('').blur().trigger('autosize');
            //$inp.is('.wall_comment_area_top') &&
            if (!isPpOnePost) {
                clMediaTools.hideFrmReplyWall(id, false);
            }
            return false;
        }

        var send = +new Date, $comment, $comment_g;

        $comment = $('<div id="wall_item_comment_'+send+'" data-cid="'+send+'" data-post="'+id+'" data-send="'+send+'" class="item wall_item_one_comment">'+
                        '<div class="comment_item_wrapper">'+
                        '</div>'+
                     '</div>');
        $comment.find('.comment_item_wrapper').append(clMediaTools.prepareComment());
        if (isPpOnePost) {
            $comment_g=$comment.clone();
        }

        var fnAdd=function(){
            //return
            if (isPpOnePost) {
                clProfilePhoto.showLastFieldComment(function(){
                    cancelAnimationFrame(globalID);
                    clProfilePhoto.scrollBottomAnimation();
                    clProfilePhoto.fnBlur($inp, $comment_g, 0);
                },false,$('.bl_comments > .wall_item_one_comment', $this.$ppWallOnePost),$this.numberCommentsFrmShow)
            } else {
                /*if ($inp.is('.wall_comment_area_top')) {
                    $this.scrollToNative($comment);
                }*/
                clMediaTools.hideFrmReplyWall(id, false);
                $this.fnBlur($inp, $comment);
            }
            //return;
            comment=emojiToHtml(comment);

            var firstId=$this.commentsFirst[id]?$this.commentsFirst[id]:0,
                url = 'wall_ajax.php?cmd=comment&id='+id+'&wall_uid='+$this.uid+'&last_id='+firstId,
                data={comment:comment,send:send,section:section,photo_id:param};
            $.post(url,data,function(res){
                var data=$this.checkDataAjax(res);
                if(data && $this.itemExists(id, data)){
                    var $resComm=$(data).find('.wall_item_one_comment');
                    if ($resComm[0]) {
                        if (isPpOnePost) {
                            var $resComm_g=$resComm.clone();
                        }

                        var fnPasteComment = function($resComm1, $comment1, isPost){
                            isPost=isPost||false;
                            var fnPaste = 'insertAfter', i=$resComm1.length-1, $el;
                            (function fu(){
                                $el=$resComm1.eq(i);
                                if(!$el[0] || i < 0){
                                    if (!isPost) {
                                        $this.showFrmBottomCommentDelay(id);
                                    }
                                    return;
                                }; i--;
                                if (isPost) {
                                    $this.updateContOnePost($el);
                                }
                                if (!$('#'+$el[0].id)[0]){
                                    if ($el.data('send') == send) {
                                        fnPaste = 'insertBefore';
                                        var cid=$el.data('cid');
                                        //$this.$scriptUpdate.append($el.find('script'));
                                        $comment1.data('cid', cid).attr({'id':$el[0].id, 'data-cid':cid});
                                        clMediaTools.commentUpdate($comment1, $el);
                                    } else {
                                        clMediaTools.addCommentToBl($el, id, fnPaste, false, false, $comment1);
                                    }
                                    fu();
                                } else {
                                    fu()
                                }
                            })()
                        }

                        fnPasteComment($resComm, $comment);

                        if (isPpOnePost) {
                            $('script', $resComm_g).remove();
                            fnPasteComment($resComm_g, $comment_g, true);
                        }
                    }else{
                        $this.commentHide(id, send, false, true);
                        alertServerError(true);
                    }
                } else {
                    $this.commentHide(id, send, false, true);
                    alertServerError()
                }
            })
        }

        $inp.val('').trigger('autosize',function(){
            if (isPpOnePost) {
                clMediaTools.addCommentToBl($comment, id, 'appendTo');
                var fnSend = function(){
                    clProfilePhoto.scrollBottomAnimationFrame();
                    clMediaTools.addCommentToBlUpdate($comment_g, id, 'appendTo', fnAdd, '#pp_wall_item_comments_');
                }
                var $last=$('.wall_item_one_comment:last',$this.$ppWallOnePost);
                if ($inp[0] == $this.$ppGalleryFieldCommentInput[0] && $last[0] && !clProfilePhoto.inViewport($last[0])) {
                    clProfilePhoto.scrollBottomNative(fnSend)
                } else {
                    fnSend()
                }
            } else {
                //clMediaTools.scrollTopElCheckViewport($inp,function(){
                    clMediaTools.addCommentToBl($comment, id, 'appendTo', fnAdd);
                //},20)
            }
        }).focus();

        return false;
	}


    this.commentAddReplies = function(inp) {
        var $inp=$(inp),
            comment=trim($inp.val()),
            isPpOnePost=$this.isElOnePost($inp),
            $wallItem=false;
        if (isPpOnePost) {
            $wallItem=$this.$ppWallOnePost;
        }
        var itemInfo=$this.getItemInfo($inp,$wallItem),
            id=itemInfo.id,
            section=itemInfo.section,
            param=itemInfo.item_id,
            cid=$inp.data('cid');

        if(section == 'vids')param='v_'+param;

        if(!comment){
            $inp.val('').trigger('autosize').blur();
            if(isPpOnePost){
                clMediaTools.hideFrmReplyWall(cid,true,'pp_');
            } else {
                clMediaTools.hideFrmReplyWall(cid);
            }
            return false;
        }

        var send = +new Date, $comment, $comment_g;

        $comment = $('<div id="wall_item_comment_reply_'+send+'" data-cid="'+cid+'" data-rcid="'+send+'" data-post="'+id+'" data-send="'+send+'" class="comment_to_comment_container">'+
                        '<div class="comment_item_wrapper">'+
                        '</div>'+
                     '</div>');
        $comment.find('.comment_item_wrapper').append(clMediaTools.prepareComment());

        if (isPpOnePost) {
            $comment_g=$comment.clone();
        }

        var fnAdd=function(){
            if (isPpOnePost) {
                clMediaTools.hideFrmReplyComment('pp_wall_feed_comment_replies_'+cid, false, true, function(){clProfilePhoto.fnBlur($inp, $comment_g, 1)})
            } else {
                clMediaTools.hideFrmReplyWall(cid);
                $this.fnBlur($inp, $comment);
            }
            //return;

            comment=clMediaTools.replaceUserName(comment, $inp.data('name'), $inp.data('uid'));
            comment=emojiToHtml(comment);
            if(section == 'vids')param='v_'+param;

            var lastId=$this.itemCommentsReplyLast[cid]?$this.itemCommentsReplyLast[cid]:0,
                url = 'wall_ajax.php?cmd=comment&id='+id+'&wall_uid='+$this.uid+'&last_id='+lastId,
                data = {comment:comment, send:send, section:section, photo_id:param, reply_id:$this.getDataId(cid)};

            $.post(url,data,function(res){
                var data=$this.checkDataAjax(res);
                if(data && $this.itemExists(id, data)){
                    var $resComm=$(data).find('.photo_and_comment').find('.comment_to_comment_container');
                    if ($resComm[0]) {
                        if (isPpOnePost) {
                            var $resComm_g=$resComm.clone();
                        }
                        var fnPasteComment = function($resComm1, $comment1, isPost){
                            var fnPaste = 'insertBefore', i=0, $el;
                            (function fu(){
                                $el=$resComm1.eq(i);
                                if(!$el[0]){
                                    return;
                                }; i++;
                                if (isPost) {
                                    $this.updateContOnePost($el);
                                }
                                if (!$('#'+$el[0].id)[0]){
                                    if ($el.data('send') == send) {
                                        fnPaste = 'insertAfter';
                                        var resCid=$el.data('rcid');
                                        //$this.$scriptUpdate.append($el.find('script'));
                                        $comment1.data('rcid', resCid).attr({'id':$el[0].id, 'data-rcid':resCid});
                                        clMediaTools.commentUpdate($comment1, $el);
                                    } else {
                                        clMediaTools.addCommentToBl($el, id, fnPaste, false, false, $comment1);
                                    }
                                    fu();
                                } else {
                                    fu()
                                }
                            })()
                        }

                        fnPasteComment($resComm, $comment);
                        if (isPpOnePost) {
                            $('script', $resComm_g).remove();
                            fnPasteComment($resComm_g, $comment_g, true);
                        }
                    }else{
                        $this.commentHide(id, cid, send, true);
                        alertServerError(true)
                    }
                } else {
                    $this.commentHide(id, cid, send, true);
                    alertServerError()
                }
                return;
            })
        }

        $inp.val('').trigger('autosize',function(){
            if (isPpOnePost) {
                clMediaTools.addCommentToBl($comment, cid, false, false, '#wall_item_comments_replies_');
                clMediaTools.addCommentToBl($comment_g, cid, false, fnAdd, '#pp_wall_item_comments_replies_');
            } else {
                //clMediaTools.scrollTopElCheckViewport($inp,function(){
                    clMediaTools.addCommentToBl($comment, cid, false, fnAdd, '#wall_item_comments_replies_');
                //})
            }

        }).focus();

        return false;
	}

    this.confirmCommentDelete = function(el) {
        if ($this.stopUdater) return;
        var $el=$(el);
        confirmCustom(l('are_you_sure'), function(){$this.commentDelete($el)}, l('confirm_delete_comment'));
        $el.closest('.more_menu_collapse').collapse('hide');
    }

    this.commentDelete = function($el) {
        var isPpOnePost=$this.isElOnePost($el),
            $wallItem=false;
        if (isPpOnePost) {
            $wallItem=$this.$ppWallOnePost;
        }
        var itemInfo=$this.getItemInfo($el,$wallItem), lastId, cid,
            id=itemInfo.id, cidP=$el.data('cid'), rCid=$el.data('rcid'),
            listComments, $commItem, $commItemPp;
        if (rCid) {
            cid=rCid;
            lastId=$this.itemCommentsReplyFirst[cidP]?$this.itemCommentsReplyFirst[cidP]:0;
            listComments=JSON.stringify($this.commentsReplyCache);
            $commItem=$('#wall_item_comment_reply_'+rCid);
            $commItemPp=$('#pp_wall_item_comment_reply_'+rCid);
            //$this.commentHide(id, cidP, rCid);
        } else {
            cid=cidP;
            cidP=0;
            lastId=$this.commentsLast[id]?$this.commentsLast[id]:0;
            listComments=JSON.stringify($this.commentsCache);
            $commItem=$('#wall_item_comment_'+cid);
            $commItemPp=$('#pp_wall_item_comment_'+cid);
            //$this.commentHide(id, cid, rCid);
        }
        if($commItem.is('.deleted')||$commItemPp.is('.deleted'))return;
        $commItem.addClass('deleted').fadeTo(200,.4);
        if (isPpOnePost) {
            $commItemPp.addClass('deleted').fadeTo(200,.4);
        }

        var cidParent = $this.getDataId(cidP),
            data={id:itemInfo.id, cid:$this.getDataId(cid), cid_parent:cidParent, last_id:lastId,
                  wall_uid:$this.uid, section: itemInfo.section, param:itemInfo.item_id, list_comments:listComments};
        $this.debug('commentDelete', data);

        $.post('wall_ajax.php?cmd=comment_delete', data, function(res){
            var data=$this.checkDataAjax(res);
            if(data && $this.itemExists(id, data)){
                var $data=$(data);
                $this.$scriptUpdate.append($data.filter('script'));
                if(cidParent){
                    $this.commentHide(id, cidP, rCid);
                    var $comment=$data.find('.photo_and_comment').find('.comment_to_comment_container');
                    if($comment[0] && !$('#'+$comment[0].id)[0]){
                        clMediaTools.addCommentToBl($comment, cidP, 'prependTo', false, '#wall_item_comments_replies_');
                        if (isPpOnePost) {
                            var $comment_g=$comment.clone();
                            $this.updateContOnePost($comment_g);
                            clMediaTools.addCommentToBl($comment_g, cidP, 'prependTo', false, '#pp_wall_item_comments_replies_');
                        }
                    }
                } else {
                    $this.commentHide(id, cid, rCid);
                    var $comment=$data.find('.wall_item_one_comment');
                    if($comment[0] && !$('#'+$comment[0].id)[0]){
                        clMediaTools.addCommentToBl($comment, id, 'prependTo');
                        $this.showFrmBottomCommentDelay(itemInfo.id);

                        if (isPpOnePost) {
                            var $comment_g=$comment.clone();
                            $this.updateContOnePost($comment_g);
                            clMediaTools.addCommentToBl($comment_g, id, 'prependTo', $this.showFrmBottomCommentOpenPost, '#pp_wall_item_comments_');
                        }
                    } else {
                        $this.showFrmBottomComment(itemInfo.id);
                        if (isPpOnePost) {
                            $this.showFrmBottomCommentOpenPost();
                        }
                    }
                }
            }
        })

		return false;
	}

    this.commentHideWall = function(cid, rcid, prf) {
        prf=prf||'';
        clMediaTools.commentHide(cid, rcid, true, false, false, prf);
        if($this.isOpenOnePost){
            clMediaTools.commentHide(cid, rcid, true, false, false, 'pp_');
        }
    }

    this.commentHide = function(id, cid, rcid, notUpdateData, prf) {
        $this.debug('CommentHide', [id, cid, rcid, notUpdateData]);
        rcid=rcid||false;
        notUpdateData=notUpdateData||false;
        prf=prf||'';

        $this.commentHideWall(cid, rcid, prf);

        if (!notUpdateData) {
            var c;
            if (rcid) {
                $this.commentsReplyCacheRemoveByCid(id, cid, rcid)
                c = $this.commentsInfo[cid].replyCount;
                $this.commentsRepliesLoadMoreStatus(cid, c);
            } else if($this.itemsInfo[id]){
                $this.commentsCacheRemoveByCid(id, cid);
                c = $this.itemsInfo[id].commentsCount;
                $this.updateCommentsCounter(id, c);
                $this.commentsLoadMoreStatus(id, c);
                $this.updateCountersOnePost(id);
            }
        }
    }

    this.commentDeleteFromPage = function(id, cid, rcid) {
        $this.debug('CommentDeleteFromPage', [id,cid,rcid]);
        if(rcid === '0_p' || rcid === '0_v' || rcid === '0'){
            rcid=0;
        }
        $this.commentHide(id, cid, rcid, true);
        if(rcid){
            $this.commentsReplyCacheRemoveByCid(id, cid, rcid)
        }else{
            $this.commentsCacheRemoveByCid(id, cid);
        }
	}
    /* Comment */
    /* Share */
    this.shareUpdateTitle = function(id, uid, cmd) {
        var $el=$($this.sel.feedShare+uid+'_'+id);
        if($el[0]){
            cmd=cmd||($el.is('.share')?'share':'unshare');
            if (cmd == 'share') {
                if($el.is('.unshare')) return;
                $('span',$el).text(l('unshare'));
                $el.removeClass('share');
                $el.addClass('unshare');
            }else{
                if($el.is('.share')) return;
                $('span',$el).text(l('share'));
                $el.removeClass('unshare');
                $el.addClass('share');
            }
        }
    }

    this.shareConfirm = function(id, $el) {
        var msg={
            share : l('share_this_on_your_timeline'),
            unshare : l('unshare_on_your_timeline')
        }
        var cmd=$el.is('.share')?'share':'unshare';
        confirmCustom(msg[cmd],function(){$this.share(id, $el)},l('are_you_sure'));
    }

    this.share = function(id, $el, cmd) {
        $el=$el||$($this.sel.feedShare+$this.guid+'_'+id);
        var $icon;
        if ($el[0]) {
            $el.addClass('disabled');
            $icon=$('.icon',$el).addChildrenLoader();
        }

        cmd=cmd||($el.is('.share')?'share':'unshare');
        var url = 'wall_ajax.php?cmd=' + cmd + '&id=' + id + '&wall_uid=' + $this.uid;
		$.get(url, function(res){
            var data=$this.checkDataAjax(res);
            if(data && $this.itemExists(id, data)){
                $this.shareUpdateTitle(id, $this.guid, cmd);
                $this.updater();
            }
            if($el[0]){
                $el.removeClass('disabled')
                $icon.removeChildrenLoader();
            }
        })
	}
    /* Share */

    /* Like comment */
    this.queueUpdateLikeComments = {};
    this.setQueueLikeComments = function(id,fn){
        var check = false;
        if(typeof $this.queueUpdateLikeComments[id] == 'undefined'){
            $this.queueUpdateLikeComments[id] = [];
        }
        if($this.queueUpdateLikeComments[id].length){
            check = true;
        }
        $this.queueUpdateLikeComments[id].push(fn);
        //$this.debug('SetQueueLikeComments:'+id, check);
        return check;
    }

    this.runQueueLikeComments = function(id){
        if(typeof $this.queueUpdateLikeComments[id] == 'undefined'){
            return;
        }
        var fn=$this.queueUpdateLikeComments[id].shift();
        if(typeof fn=='function')fn();
        //$this.debug('RunQueueLikeComments:', [id, $this.queueUpdateLikeComments[id]]);
        return;
    }

    this.updateCommentLike = function(dataLike, $bl, id) {
        if($this.setQueueLikeComments(id,function(){
            clMediaTools.updateCommentOneLike(dataLike,$bl,id)
        })){
            return;
        }
        //$this.queueUpdateLikeComments[id].shift();
        clMediaTools.updateCommentOneLike(dataLike,$bl,id);
    }

    this.likeCommentAdd = function($el, cid, rCid) {
        if (!cid||$el.is('.disabled')) return;
        $el.addClass('disabled');

        rCid=rCid||0;
        var like=$el.data('like'),
            info=$this.getItemInfo($el),
            id=info.id,
            parentId=0,
            cidD=cid;
        if(rCid){
            parentId=cid;
            cid=rCid;
        }

        clMediaTools.likeChangeStatus($el, like);

        var data={id:id,section:info.section,
                  cid:$this.getDataId(cid),parent_id:$this.getDataId(parentId),
                  like:like,wall_uid:$this.uid}

        $.post('wall_ajax.php?cmd=like_comment', data, function(res){
            var data=$this.checkDataAjax(res);
            if(data && $this.itemExists(id, data, false, cidD, rCid)){
                var $bl=rCid?$($this.sel.commentReplyLikesBl+rCid):$($this.sel.commentLikesBl+cid),
                    dataLike={count:data['likes'],title:data['likes_users']};
                $this.updateCommentLike(dataLike, $bl, cid);
                if (typeof $this.itemsInfo[id] != 'undefined' && data.date) {
                    $this.itemsInfo[id].actionLikeComment = data.date;
                }

                /*$this.updateCommentLike(1, $bl, rCid||cid);
                $this.updateCommentLike(0, $bl, rCid||cid);
                $this.updateCommentLike(2, $bl, rCid||cid);
                $this.updateCommentLike(0, $bl, rCid||cid);
                $this.updateCommentLike(3, $bl, rCid||cid);
                $this.updateCommentLike(0, $bl, rCid||cid);*/
            }
        })
        return;
	}

    this.updateLikeComments = function(data){
        $this.debug('UpdateLikeComments', data);
        if (typeof data == 'object') {
            for(var post_id in data) {
                if (typeof $this.itemsInfo[post_id] != 'undefined') {
                    $this.itemsInfo[post_id].actionLikeComment = data[post_id].actionLikeComment;
                }
                var comment=data[post_id].items,
                    section=data[post_id].section;
                for(var key in comment) {
                    var com=comment[key],
                        pCid=com['parent_id']*1,
                        cid=com['id'];

                    if (section == 'photo') {
                        cid=''+cid+'_p';
                    } else if (section == 'vids') {
                        cid=''+cid+'_v';
                    }
                    var $bl=pCid?$($this.sel.commentReplyLikesBl+cid):$($this.sel.commentLikesBl+cid),
                        dataLike={count:com['likes'],title:com['likes_users']};
                    $this.updateCommentLike(dataLike, $bl, cid);

                    var $el=pCid?$($this.sel.commentReplyLikesBlLink+cid):$($this.sel.commentLikesBlLink+cid);
                    clMediaTools.likeChangeStatus($el, com['my_like']*1);
                }
            }
        }
    }
    /* Like comment */

    this.changeAccess = function($el, id, access) {
        var $li=$el.closest('li'), $ul=$el.closest('ul');
        if($ul.is('.disabled') || $li.is('.active'))return;
        $ul.addClass('disabled').find('li').removeClass('active');
        $('#wall_item_more_menu_access_'+id).collapse('hide');
        var $liOld=$ul.find('li.active'),
            $ac=$ul.closest('.data').find('.comment_access'),
            $icon=$('.icon_fa',$ac).addChildrenLoader();
        $li.addClass('active');

		$.post('wall_ajax.php?cmd=update_access',{id:id,wall_uid:$this.uid,access:access}, function(data){
            data=$this.checkDataAjax(data);
            if(data && $this.itemExists(id, data)){
                $ac.removeClass('public private friends');
                $ac.addClass(access);
                $this.updater();
            } else {
                $li.removeClass('active');
                $liOld.addClass('active');
            }
            $icon.removeChildrenLoader();
            $ul.removeClass('disabled');
        })

    }

    this.updateCounter = function(counter) {
        counter *=1;
        var $cont=$jq('.menu_inner_wall_posts_edge').find('.num'), c=$cont.text()*1;
        if (counter!=c) {
            $cont.text(counter);
        }
        //!counter && $this.$wallNoItems.is(':hidden') && setTimeout($this.showNoItem,1000);
    }

    this.getDataId = function(data) {
        data=''+data;
        return (data.replace('_p','').replace('_v',''))*1;
    }


    /* Show one post */
    this.isElOnePost = function($el){
        return $el.closest('.pp_wall_one_post')[0]
    }

    this.getPrepareIdOnePost = function(id, is){
        if(is){
            id +='';
            id=id.replace('#','');
            id='#pp_'+id;
        }
        return id;
	}

    this.updateContOnePost = function($cont, initForm){
        $('script', $cont).remove();
        $cont.filter('script').remove();
        if($cont[0].id)$cont[0].id='pp_'+$cont[0].id;
        $cont.find('*[id]').each(function(){
            this.id='pp_'+this.id;
        })
        $cont.find('*[data-target]').each(function(){
            var $el=$(this),
                tr='#pp_'+$el.data('target').replace('#','');
            $el.attr('data-target', tr).data('target', tr);
        })
        $cont.find('.pic.to_hide').removeClass('to_hide');

        initForm=defaultFunctionParamValue(initForm,true);
        if (initForm) {
            $cont.find('.comments_replies_post textarea').each(function(){
                $(this).after("<script>clWall.initFeedCommentReplies('" + $(this).data('cid') + "',false,'pp_');</script>");
            })
        }
    }

    this.closePpOnePostPopup = function(){
        if(!$this.isOpenOnePostImage)return;
        if(!backStateHistory()){
            $this.closePpOnePost();
        }
    }

    this.closePpOnePost = function(){
        $this.$ppShowOnePost[0] && $this.$ppShowOnePost.modal('hide');
    }

    $this.$ppShowOnePostClone;
    this.initPpOnePost = function(){
        $('body').on('click', '.pp_gallery_overflow', function(e){
            if(this != e.target)return;
            $this.closePpOnePost();
        })
        $this.$ppShowOnePostClone=$jq('#pp_wall_one_post').clone().html();
        $this.$ppShowOnePost=$jq('#pp_wall_one_post');
    }

    this.$ppShowOnePost=[];
    this.isOpenOnePost=false;
    this.isOpenOnePostImage=false;
    this.$ppWallOnePost=[];
    this.$ppShowOnePostId=0;
    this.showOnePost = function(id, src, $target, noComment){
        $this.debug('Show One Post', [id, src, $target, noComment]);
		if($this.isOpenOnePost)return;
        var $post=$('#wall_item_'+id);
        if(!$post[0])return;

        $target=$target||[];
        var timeLineImgId=0;
        if ($target[0]) {
            timeLineImgId=$target.data('id');
        }
        noComment=noComment||false;//Image from comment or reply comment
        $this.isOpenOnePost=true;
        $this.$ppShowOnePostId=id;

        $this.$ppWallOnePost=$post;
        src=src||false;

        $this.$ppShowOnePost.empty().html($this.$ppShowOnePostClone);
        var info=$this.itemsInfo[id],
            $cont=$post.clone();

        var $contItem=$('.pp_wall_post_item', $this.$ppShowOnePost).attr('id', 'pp_'+$post[0].id),
            params=$post.data(),
            kA;

        for(var k in params) {
            if (k=='call') {
                continue;
            }
            kA=k;
            if(kA=='sharedUid'){
                kA='shared-uid';
            }else if(kA=='itemId') {
                kA='item-id';
            }
            $contItem.data(k,params[k]).attr('data-'+kA,params[k]);
        }

        //data-id="{id}" data-send="{item_send}"
        //data-section="{item_section_real}"
        //data-item-id="{item_id}"
        //data-shared="{wall_item_shared_id}"
        //data-shared-uid="{item_user_id}"

        $this.updateContOnePost($cont, false);

        var $img=[];
        if (src) {
            $this.isOpenOnePostImage=true;
            if (timeLineImgId) {
                $img=$target.find('img').clone()//$cont.find('a.'+timeLineImgId+' img')
                 .addClass('fade_to_1_4 fade_to_0_4')
                 .attr('src', src)
                 .one('load',function(){
                    $('.css_loader', $this.$ppShowOnePost).oneTransEnd(function(){
                        $(this).remove();
                    }).addClass('hidden');
                    $(this).removeClass('fade_to_0_4');
                 });
            } else {
                $img=$cont.find('img.wall_image_post_img')
                        .addClass('fade_to_0_4')
                        .attr('src', src)
                        .one('load',function(){
                            $('.css_loader', $this.$ppShowOnePost).oneTransEnd(function(){
                                $(this).remove();
                            }).addClass('hidden');
                        });
            }
        }

        var desc='',
            $desc=[],
            $userInfo=$cont.find('.user_wall_info'),
            $photo=$userInfo.find('.photo'),
            $time=$userInfo.find('.comment_time_ago'),
            $name=$userInfo.find('.name > a'),
            nameUser=$name.text(),
            urlUser=$name[0].href;
        if (timeLineImgId && noComment) {
            $time=$target.closest('.comment_text').find('.comment_reply_data, .comment_item_data');
            $photo=$target.closest('.comment_item_wrapper').find('.photo');
            $userInfo=$photo.find('a');
            nameUser=$userInfo.attr('title'),
            urlUser=$userInfo[0].href;
        }
        if (src) {
            if (timeLineImgId) {
                /*var $blImg=$desc=$img.closest('.wall_image_post');
                $desc=$blImg.prev('.txt');
                if (!$desc[0]) {
                    $desc=$blImg.next('.txt');
                }*/
            } else {
                $desc=$cont.find('p.data_orig');
            }
            if ($desc[0]) {
                desc=$desc.html();
            }
            $('.photo_one_cont', $this.$ppShowOnePost).append($img);

        } else {
            //$('.css_loader', $this.$ppShowOnePost).remove();
            $('.photo_one_bl', $this.$ppShowOnePost).html($cont.find('.wall_post').html());
        }

        if(desc){
            $('.pp_wall_one_post_desc', $this.$ppShowOnePost).html(desc);
        }else{
            $('.pp_wall_one_post_desc', $this.$ppShowOnePost).closest('.title').remove();
        }
        $('.pp_wall_one_post_user_name', $this.$ppShowOnePost).text(nameUser)[0].href=urlUser;
        $photo.find('.open_im_user').remove();
        $('.pp_wall_one_post_user_photo', $this.$ppShowOnePost).html($photo.html());
        $('.pp_wall_one_post_date', $this.$ppShowOnePost).text($time.data('photoDate'));

        $('.pp_wall_one_post_time_ago', $this.$ppShowOnePost).text($time.text());

        var $commentsCount=$('.pp_wall_one_post_comments_count', $this.$ppShowOnePost),
            c=info.commentsCount*1;
        $commentsCount.text(c)[0].id='pp_wall_item_comments_count_'+id;
        if(c)$commentsCount.closest('.time').show();


        var $commets=$cont.find('.bl_comments');
        $commets.find('script').remove();

        var $blComments=$('.pp_wall_one_post_comments', $this.$ppShowOnePost).html($commets),
            $loadMore=$cont.find('.like_comment_and_share_bl');
        if($loadMore[0]){
            $loadMore.insertBefore($blComments);
        }

        var $frm=$('.photo_and_field_comment', $this.$ppShowOnePost),
            $photoFrm=$cont.find('.photo_and_field_comment > .photo');
        $frm.find('.photo').html($photoFrm.html());
        $frm.last()[0].id='pp_wall_feed_comment_'+id;

        $('.comments_replies_post', $this.$ppShowOnePost).removeAttr('style');

        /* Init gallery */
        clProfilePhoto.$ppGalleryOverflow = $('.pp_gallery_overflow',$this.$ppShowOnePost);
        clProfilePhoto.$ppGalleryFieldCommentBottom=$frm.last();

        $this.$ppGalleryFieldCommentInput = $('.photo_and_field_comment textarea',$this.$ppShowOnePost);

        if(isMobileSite)clProfilePhoto.resizeImage();
        /* Init gallery */
        $this.showFrmBottomCommentOpenPost(false,true);

        if (noComment) {
            $commentsCount.closest('.time').remove();
            $('.container', $this.$ppShowOnePost).addClass('no_comments');
            $('.photo_one_comments', $this.$ppShowOnePost).remove();
        }
        setPushStateHistory('wall_gallery');
        $this.$ppShowOnePost.on('hide.bs.modal',function(){
            $this.isOpenOnePost=false;
            $this.isOpenOnePostImage=false;
            $this.$ppWallOnePost=[];
            $this.$ppShowOnePostId=0;
            $jq('html, body').removeClass('overh');
            $this.$ppShowOnePost.oneTransEndM(function(){
                $this.$ppShowOnePost.removeClass('to_show').empty();
                $jq('body').removeClass('gallery_open');
            })
        }).one('shown.bs.modal',function(){

        }).one('show.bs.modal',function(){
            $this.$ppShowOnePost.addClass('to_show');
            $jq('body').addClass('gallery_open');
            $jq('html, body').addClass('overh');
            $this.initFeedComment(false,false,$this.$ppGalleryFieldCommentInput);
            $this.initFeedCommentReplies(false,$('.comments_replies_post textarea',$this.$ppShowOnePost));
        }).modal('show');
	}

    this.updateCountersOnePost = function(id){
        if ($this.isOpenOnePost && $this.$ppShowOnePostId == id) {
            var $counter=$('#pp_wall_item_comments_count_'+id);
            if (!$counter[0] || typeof $this.itemsInfo[id] == 'undefined')return;
            var count =$this.itemsInfo[id].commentsCount*1;
            if (count) {
                $counter.text(count);
                $counter.closest('.time').show();
            } else {
                $counter.closest('.time').hide();
            }
        }
    }
    /* Show one post */

    this.inViewport = function(el){
        return inViewport(el,{container:$('body')[0],threshold:-40})//container:$('')[0]
    }

    this.scrollToNative = function($el,call,t){
        t=defaultFunctionParamValue(t, $this.dur*1.5);
        clMediaTools.getElOnScroll().scrollTo($el, t, {axis:'y', interrupt:true, easing:'easeOutExpo', over_subtract:{top:3}, onAfter:call});
    }

    this.scrollToInto = function($el,t){
        t=defaultFunctionParamValue(t, $this.dur);
        $this.scrollToNative($el,false,t);
        return;
    }

    this.checkScrollInput = function(){
        var $fl=$('textarea:focus, input:focus', $this.wallBl);
        if($fl[0]){
            !$this.inViewport($fl[0]) && $this.scrollToInto($fl);
        }
    }

    this.onLoadImgTimeLine = function(id){
        var $el=$('.'+id+':not(.to_show)');
        if(!$el[0])return;
        onLoadImgToShow($el[0].href,$el)
    }

    this.goToProfileFromPhoto = function($el){
        if(!notLoaderIos)$el.addChildrenLoader();
        redirectUrl($el[0].href);//getPrepareUrl($el[0].href)
    }

    this.goToProfileFromName = function($el){
        if(!notLoaderIos)$el.addChildrenLoader();
        redirectUrl($el[0].href);//getPrepareUrl($el[0].href)
    }

    $.fn.getDataId = function(options){
        var data=$(this).data(options);
        data=''+data;
        data=data.replace('_p','').replace('_v','');
        return data;
    };

	$(function(){
        $this.init();
	})

	return this;
}