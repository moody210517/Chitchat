var CSearch = function() {

    var $this = this, prevPL, nextPL;

    this.isAjax = true;
    this.wait = 4000;
    this.nextPage = '';
    this.loadNextPage = true;
    this.onPage = this.minOffset = this.emptyItems = this.total = 0;
    this.offset = 1;
    this.display = '';
    this.isReply = true;

    this.langParts = {};

    this.setNextPageParams = function(params){
        $this.nextPageParams = params;
    }

    this.setOffset = function(offset){
		$this.minOffset=$this.offset=+offset;
    }

    this.setOnPage = function(on_page){
        $this.onPage = on_page;
    }

    this.setDisplayParam = function(display){
        $this.display = display;
    }

	function ready(){if ($this.waiting) {clearTimeout($this.waiting); $this.waiting=0}};

	this.showImg=function(img) {
        /*$(img).closest('.hidden').oneTransEnd(function(){
            $(this).closest('li').removeClass('sliding');
            //$this.$stContent.scroll();
        }).removeClass('hidden');
		var $loader=$('.loader_search_list').removeClass('show');
		if ($this.minOffset+$('.users_list_item').length>$this.total) $loader.removeClass('next');*/
        var $img=$(img);
        $img.closest('.hidden').removeClass('hidden');
        setTimeout(function(){
			$img.closest('li').removeClass('sliding');
            var $loader=$('.loader_search_list').removeClass('show');
            if ($this.minOffset+$('.users_list_item').length>$this.total) $loader.removeClass('next');
		}, 380)
	}

    this.showNextPage = function(prev, force){
		if ($this.waiting) return;
        var list=$('#search_users_list');
        if (!list[0]) return;//No one here yet
		var items=$('.users_list_item'),
			n=items.length+$this.emptyItems,
			onLine=Math.round($this.$stContent.width()/items.width()),
			onPage=Math.round($this.onPage/onLine-0.05)*onLine
			 + (prev? $this.emptyItems : (onLine-1-(n-1+$this.emptyItems)%onLine)),
			offset=prev?Math.max($this.minOffset-onPage, 1):($this.minOffset+n);
		//console.log('empty='+$this.emptyItems, items.filter('.sliding')[0], 'offset='+offset, 'onPage='+onPage);
		if ((offset>$this.total || items.filter('.sliding')[0])&&!(force||0)) return;
		//console.log('!!')
		$this.waiting=setTimeout(ready, $this.wait);
		(prev?prevPL:nextPL).addClass('show');
		list.removeClass('initial');
		$.post(activePage, {ajax:1, set_filter:0, offset:offset, on_page:onPage, display:$this.display}, function(data){
			var newItems = $(data).filter('.items');
			if (newItems[0]) {
				$('body').append(newItems.find('script'));
				newItems=newItems.find('.users_list_item').each(function(){
					if ($('#' + this.id)[0]) $(this).removeAttr('id');
				}).filter('[id]');
				if (newItems[0]) {
					onLine=Math.round($this.$stContent.width()/items.width());
					list[prev?'prepend':'append'](newItems);
					if (prev) {
						$this.emptyItems=($this.minOffset-offset-newItems.length)%onLine;
						newItems.eq(0).css('margin-left', items.width()*$this.emptyItems);
						items.eq(0).css('margin-left', 0);
						$this.$stContent[0].scrollTop+=1;
						$this.minOffset=offset;
					} else {
						$this.offset+=newItems.length;
						$this.$stContent[0].scrollTop+=items.height()-2
					}
				}
			}; ready()
		})
    }

    this.scrollToUser = function(){
        var uid = $.cookie('back_uid'),
            user = $('a[data-uid = '+uid+']', '#search_users_list');
        if (uid != 'null' && user[0]) {
            $this.$stContent.scrollTop(user.offset().top);
        }
        //$.cookie('back_uid', null);
    }

    this.setEncountersInfo = function(){
        //$this.$loader_image = $('.loader_image');
        $this.$userInfo = $('#encounters_user_info');
        $this.$userInterest = $('#encounters_user_interests');
        $this.$userInfoAll = $('#encounters_user_info, #encounters_user_interests');
        $this.$btnLike = $('#encounters_btn_like');
        $this.btnTinder=$('.bl_tinder_btn');
    }

    this.uidLikeEncounters={};
    this.removeLikeUsers = function(res){
        if(res*1){
            delete $this.uidLikeEncounters;
            $this.uidLikeEncounters={};
        }
    }
    this.likeToMeetSuccess = function(data, status, dir){
        $this.$userInfoAll.fadeTo(0,0);
        var item = $(data).filter('.items'),
            itemInfo = item.find('.bl_info_photo_top'),
            itemInterests = item.find('.list_interest_photo_cont');
        if (itemInfo[0]){
            //updateStatusCity(0,0,itemInfo);
            $('#bl_tinder').replaceWith(item.find('#bl_tinder'));
            eval($('script', item).text());
            photos.showEncounters(photos.curPid, itemInfo, itemInterests, dir||(status=='N'?'right':'left'));
        } else {
            photos.curPid = 0;
            photos.$image.remove();
            $this.btnTinder.add($this.$btnLike).add('#bl_tinder').addClass('hidden');
            $this.$userInfoAll.fadeTo(0,0);
            $('.no_one_found').removeClass('hidden');
        }
        photos.isMutual=false;
        $this.likeToMeetData=$this.lastStatus='';
        $('.btn_like span.cloud').fadeTo(0,0)
    }
    this.likeToMeet = function(status,cmd,el){
        $this.cmd = cmd||'reply';
        if(!$this.isReply) return;
        var dur = 300, isFrom=photos.isAttractionFrom&&status!='N', _el;
        if (isFrom) photos.showMutualAttractionEncounters(1);
        if(el||isFrom){
            //if(photos.isMutualAttractionEncounter)return;
            _el=$('span.cloud', el||'.yes.btn_like').stop(true).fadeTo(0,1);
            if(status=='Y'&&!$this.likeToMeetData||status=='N'){
                $('#bl_tinder_btn_'+(status=='N'?'left':'right')).delay(10).fadeTo(0, 1);
            }
        }
        $this.uidLikeEncounters[photos.uid]=1;
        var uidEencLike='';
        for (var uid in $this.uidLikeEncounters){
            uidEencLike +=uid+',';
        }
        photos.photoLoad = false;
        if (!isFrom||$this.likeToMeetData) {
            var img=photos.$image.addClass((status=='N'?'left':'right')+' hidden')
             .oneTransEnd(function(){setTimeout(function(){img.remove()}, 1)}, 'transform');
            $this.$userInfoAll.add('#bl_tinder, .btn_like .cloud').not(_el).fadeTo(0,0);
        } else {photos.$cont.removeClass('left right');}
        photos.changeSettings.delay(400).addClass('hidden',1);
        photos.$loader.stop().delay(200).removeClass('hidden', 0);

        if ($this.likeToMeetData && (!el||$this.lastStatus==status)) return $this.likeToMeetSuccess($this.likeToMeetData, status);
        $this.isReply = false;
        $.ajax({
            url: activePage+'?cmd_enc='+$this.cmd,
            type: 'POST',
            data: {ajax : 1,
                   set_filter : 0,
                   display : 'encounters',
                   //cmd_enc : $this.cmd,
                   reply_enc : status,
                   uid_enc : photos.uid,
                   uid_enc_like : uidEencLike.slice(0,-1)
            },
            success: function(data){
                $this.isReply = true;
                if (!isFrom || $this.lastStatus!=status&&$this.likeToMeetData) return $this.likeToMeetSuccess(data, status);
                $this.likeToMeetData=data;
                $this.lastStatus=status;
                $this.btnTinder.fadeTo(0,0);
                photos.photoLoad = true
            },
            error: function(res){
                $this.isReply = photos.photoLoad =true;
            },
            complete: function(res){
                $this.isReply = photos.photoLoad =true;
            }
        })
    }

    this.setRatedPhotoInfo = function(){
        $this.$listRateBox = $('#rate_people_list_rate_box');
        $this.listRate = $('#rate_people_list_rate > li');
        $this.$userInfoAll = $('#rate_people_user_info, #rate_people_user_interests');
    }

    this.setRatedPhoto = function(rate,cmd){
        $this.cmd = cmd||'reply';
        var dur = 300;
        $.ajax({url: activePage,
                type: 'POST',
                data: {ajax : 1,
                       set_filter : 0,
                       display : 'rate_people',
                       cmd_enc : $this.cmd,
                       rate : rate,
                       photo_user_id : photos.uid,
                       photo_id : photos.curPid
                },
                beforeSend: function(){
                    photos.photoLoad = false;
                    $this.$userInfoAll.fadeTo(0,0);
                    photos.$image.addClass('hidden').oneTransEnd(function(){$(this).remove()})
                },
                success: function(data){
                    var item = $(data).filter('.items'),
                        itemInfo = item.find('.bl_info_photo_top'),
                        itemInterests = item.find('.list_interest_photo_cont');
                    if (itemInfo[0]){
                        //updateStatusCity(0,0,itemInfo);
                        eval($('script', item).text());
                        photos.showOnlySrc(true,itemInfo,itemInterests);
                    } else {
                        photos.curPid = 0;
                        photos.$image.remove();
                        $this.$listRateBox.fadeTo(0,0);
                        $('.no_one_found').removeClass('hidden');
                    }
                },
                error: function(res){
                    $this.isReply = true;
                },
                complete: function(res){

                }
        });
    }

    /* Activated spotlight */
    this.setSpotlightNumber = function(number,is,request_uri,hideMyPresence){
        $this.spotlightPhotoNumber = number*1;
        $this.isSpotlight = is*1;//not used
        $this.requestUri=request_uri;
        $this.hideMyPresence = hideMyPresence*1;
    }

    this.spotlightActivated = function(){
        if ($this.hideMyPresence===1) {
            showConfirm($this.langParts.only_you_will_see_your_photo_in_the_spotlight, $this.langParts.ok, $this.langParts.cancel, $this.spotlightCheckAdd, 'blue');
        } else {
            $this.spotlightCheckAdd();
        }
    }

    this.spotlightCheckAdd = function(){
        if(!$this.isAjax) return;//||$this.isSpotlight
        $.ajax({url: url_main+'tools_ajax.php',
                type: 'POST',
                data: {cmd:'check_add_spotlight'},
                beforeSend: function(){
                    $this.isAjax=0;
                },
                success: function(res){
                    var data=checkDataAjax(res);
                    $this.isAjax=1;
                    if (typeof data['credits']!='undefined') {
                        if (data.error=='not_photo_public') {
                            showConfirm($this.langParts['public_photo_upload_to_activate'], $this.langParts.ok, $this.langParts.cancel, function(){
                                tools.redirect(url_main+'profile_photo.php');
                            });
                        }else if (data.error=='refill_credits') {
                            tools.redirect(url_main+'upgrade.php?action=payment_services&type=spotlight&request_uri='+$this.requestUri);
                        }else if(typeof data['credits']!='undefined') {
                            data.credits = data.credits*1;
                            if (data.credits) {
                                showConfirm(data.msg, $this.langParts.ok, $this.langParts.cancel, $this.spotlightAction, 'blue');
                            } else {
                                $this.spotlightAction();
                            }
                        }
                    } else {
                       tools.showServerError();
                    }

                },
                error: function(){
                    tools.showServerError();
                },
                complete: function(){
                    $this.isAjax=1;
                }
        });
    }

    this.spotlightAction = function(){
        if(!$this.isAjax) return;//||$this.isSpotlight
        $.ajax({url: url_main+'tools_ajax.php',
                type: 'POST',
                data: {cmd:'activated_spotlight'},
                beforeSend: function(){
                    $this.isAjax=0;
                },
                success: function(res){
                    var data=checkDataAjax(res);
                    if($.type(data)==='object'&&!$.isEmptyObject(data)){
                        //if($this.isSpotlight){
                            //showAlert($this.langParts['success_spotlight'],'#st-container','blue');
                            //return;
                        //}
                        var $spotlight=$('#spotlight'),
                            $item=$('li',$spotlight),
                            $firstItem=$item.eq(0),
                            l=$spotlight.height()*.6+'px';
                        $('<li data-id="'+data['id']+'">'+
                          '<a href="'+url_main+'profile_view.php?user_id='+data['uid']+'&ref=spotlight" class="people_nearby_to_user spotlight">'+
                          '<img height="70" src="'+url_files+data['photo_url']+'" alt="" />'+
                          '</a></li>')
                        .css({width:'0px'}).prependTo($spotlight)
                        .animate({width:'62px',
                                  marginLeft:l},
                                 {duration:250,
                                  start:function(){//$firstItem.css({marginLeft:'0px',transition: 'margin-left .28s'})
                                  },
                                  complete:function(){
                                      //$this.isSpotlight=1;
                                      $('.list_photo_decor_green > span').fadeTo(200,0,function(){
                                          $(this).text($this.langParts['your_are_here']).fadeTo(200,1);
                                          showAlert($this.langParts['success_spotlight'],'#st-container','blue');
                                      })
                                      if ($item.length>($this.spotlightPhotoNumber-1)||$item.is('.empty')){
                                        $item.last().find('img').css({height:'70px'}).end()
                                             .animate({width:'0px'},{duration:200,complete:function(){$(this).remove()}})
                                      }
                                  }
                        });
                        $firstItem.animate({marginLeft:'0px'},165);
                    }else if(data=='not_photo_public') {
                        showConfirm($this.langParts['public_photo_upload_to_activate'], $this.langParts.ok, $this.langParts.cancel, function(){
                            tools.redirect(url_main+'profile_photo.php');
                        });
                    }else if(data==='refill_credits') {
                        tools.redirect(url_main+'upgrade.php?action=payment_services&type=spotlight&request_uri='+$this.requestUri);
                        //$.cookie('gift_id',giftId);
                        //$.cookie('gift_text',text);
                        //$.cookie('gift_recipient',recipient);
                    }else{
                        tools.showServerError();
                    }
                },
                error: function(){
                    tools.showServerError();
                },
                complete: function(){
                    $this.isAjax=1;
                }
        });
    }
    /* Activated spotlight */


	var isList=!/display=[^&]+/.test(location.search);
    if (isList) try {
        history.replaceState(history.state, document.title, location.href.replace(/\?.*/, ''));
    } catch(e) {}

    $(function(){
        $this.$stContent = $('.st-content-inner');
        if ($this.display == 'encounters') {
            $this.setEncountersInfo();
            $('.btn_like').on('mousedown touchstart', function(){
                $(this).addClass('active');
            }).on('mouseup touchend', function(){
                $(this).removeClass('active');
            })
        } else if ($this.display == 'rate_people') {
            $this.setRatedPhotoInfo();
            $('#rate_people_list_rate > li > a').on('mouseenter mouseleave',function(e){
                if (!$this.isReply) {
                    return false;
                }
                var el=$(this);
                if(e.type=='mouseenter'){
                    el.parent('li').addClass('selected').prevAll().addClass('selected');
                }else{
                    el.parent('li').removeClass('selected').prevAll().removeClass('selected');
                }
            }).on('click',function(){
                if (!$this.isReply) {
                    return false;
                }
                $this.isReply = false;
                $this.setRatedPhoto($(this).parent('li').index()+1);
                return false;
            })
        } else {
            function setCookiePage(){
                var W=$win.width(), H=$win.height()-50, n=W>400?5:(W>300?4:3), h=W/n*1.1;
                $.cookie('on_page', Math.ceil(H/h)*n);
                $.cookie('on_line', n);
            }
            $('div.head > div.fl_left > span.gray:odd').addClass('green');
            var spotlight = $('#spotlight'), page=$('#search_users_list'), $contentMain=$('.main');
			if ($this.minOffset>1) prevPL=getLoaderCl('','loader_search_list prev').insertBefore(page);
			if ($this.minOffset+$('li', page).length<$this.total) nextPL=getLoaderCl('','loader_search_list next').insertAfter(page);
 			$win.on('resize orientationchange', function(){
				$('li' ,spotlight).eq(0).css({marginLeft: spotlight.height()*.6});
				$('li.users_list_item').css({marginLeft: $this.emptyItems=0});
                if(prevPL||nextPL)$contentMain.css({height:'100%'}).css({height:'+=1'});
				$this.$stContent.scroll();
                setCookiePage();
			}).resize()
			//$('.users_list_item>div').css({margin: '0 1px 1px 0', transition: 'opacity .3s'})
			var cont=$('.st-content-inner').scroll(function(e){
				if ($(this).is('.animated') || $('li.sliding')[0]) return;
				if (this.clientHeight+this.scrollTop>page.height()+10) $this.showNextPage();
				if (!cont.scrollTop() && $this.minOffset>1 ) $this.showNextPage(1);
			}).animate({scrollTop: ($this.minOffset>1)*90}, 300, function(){
				setTimeout(function(){cont.removeClass('.animated')},50)
			})

			$win.on('beforeunload', function(){
                if(page[0]){
                    var W=page.width(), H=$win.height()-50, n=W>400?5:(W>300?4:3),
                        cel=$('li:visible', page), h=cel.height(),
                        offset=Math.round(($this.minOffset-1)/n-(page.offset().top-50)/h)*n,
                        offsetMin=(Math.floor($this.total/n)-Math.round(H/h))*n;
                    var cN='back_offset',prf=0;
                    if(activePage=='mutual_attractions.php') {
                        prf=($this.display==''?'_mutual_match':'_mutual_meet');
                    } else if(activePage=='users_viewed_me.php'){
                        prf='_profile_view';
                    } else if(activePage=='my_friends.php'){
                        prf='_my_friends';
                    }
                    prf&&(cN +=prf);
                    $.cookie(cN, Math.min(offset, offsetMin)+1);
                    //page.css('margin-top', -cont.scrollTop())
                }
 			}).load(function(){
                if(nextPL&&$('li.users_list_item').length<$.cookie('on_page')){
                    $this.showNextPage(0,1)
                }
				$this.$stContent.stop().animate({scrollTop: ($this.minOffset>1)*90}, 300).scroll();
			});
        }

        function removeLoader(){
            $('a.people_nearby_to_user').css({opacity:'1'});
            $('#loader_to_user').remove();
        }
        var isIos=/iPhone|iPad/i.test(navigator.userAgent);
        //isIos&&$doc.on('pagehide', removeLoader);

		$('body').on('click', 'a.people_nearby_to_user', function(e){
			var el=$(this);
			if (el.is('.moving a')) return false;
			//$.cookie('back_uid', $(this).data('uid'));
			//window.location.href=this.href + '&offset_back=' + $this.offset;
            if(!isIos){
                removeLoader();
                var cls=el.is('.spotlight')?'loader_m':'loader_b'
                el.css({opacity:'.6', transition:'opacity .6s'})
                  .closest('li').append(getLoaderCl('loader_to_user',cls));
            }
		})
	})

    return this;
}