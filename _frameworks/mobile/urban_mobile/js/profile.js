var CProfile = function(guid, is_free_site, is_credits_enabled) {

    var $this=this;

    this.guid = guid;
    this.isFreeSite=is_free_site*1;
    this.isCreditsEnabled=is_credits_enabled*1;
    this.uid = 0;
    this.langParts = {};
    this.ajax = {'block':0,'meet':0, 'gift':0, 'email':0};

    this.logOut = function(){
        var el=$('#menu-3').find('.menu_logout'), l=el.find('.txt > span');
        l.after(
            loaderRedirect.removeAttr('style')
                          .css({left:(l[0].offsetLeft+l[0].offsetWidth+5)+'px'})
                          .removeClass('loader_user_menu_header')
                          .addClass('loader_user_menu').fadeIn(100,function(){
                tools.redirect(url_main+'index.php?cmd=logout&t='+(+new Date));
            })
        );
    }

    this.logOutCancel = function(){$('.menu_logout').removeClass('selected')}

    // Counter common events is not used
    this.setStatusNewEvents = function(coun){
        var $counter=$('#counter_events');
        if($counter[0]){
            $counter.fadeTo(400,(coun*1)?1:0);
        }
    }

    /* GIFT */
    this.initGifts = function(uid){
        $this.userTo = uid;
        $this.$headGiftPrice = $('#head_gift_price');
        $this.$text = $('#gift_text');
        $this.$credits = $('#gift_credits');
        $this.$recipient = $('#gift_recipient');
        $this.$inputGifts = $('#gift_text, #gift_recipient');
        $this.$listGifts = $('#list_items_gifts');
        $this.$btnSend = $('#gift_send');
        $this.btnGiftImg=$this.$btnSend.find('img').clone();

        $this.$stContent = $('.st-content');
        $(window).on('resize orientationchange',function(){
            $this.$stContent.scrollTop($this.$stContent[0].scrollHeight)
        });

        var $giftsItems = $('a.gift_img', '#list_items_gifts').on('click',function(){
            $giftsItems.removeClass('selected');
            var el=$(this).addClass('selected');
            if($this.isCreditsEnabled){
                var cr=el.data('credits')*1,credits=$this.langParts['gift_free'];
                if(cr)credits=$this.langParts.gift_price.replace(/{pay_credits}/,cr);;
                $this.$headGiftPrice.html(credits);
            }
        }).mouseenter(function(){$(this).addClass('hover')}).mouseleave(function(){$(this).removeClass('hover')})
    }

    this.sendGift = function(){
        if($this.ajax['gift']) return;
        var giftId=$this.$listGifts.find('.selected').attr('id'),
            text=$this.$text.val(),
            credits=$this.$credits.val(),
            recipient=$this.$recipient.prop('checked')*1;
        $.ajax({url: url_page,
                type: 'POST',
                data: {ajax:1,
                       cmd:'gift_send',
                       user_to:$this.userTo,
                       gift:giftId,
                       text:text,
                       gifts_credits:credits,
                       recipient:recipient,
                },
                beforeSend: function(){
                    $this.ajax['gift']=1;
                    $this.$inputGifts.prop('disabled',true);
                    $this.$btnSend.html(getLoaderCl('loader_send_gift'));
                },
                success: function(res){
                    var data=checkDataAjax(res);
                    if(data===true){
                        $.cookie('gift_sent_user', $this.userTo);
                        tools.redirect(url_main+'profile_view.php?user_id='+$this.userTo);
                    } else if (data==='refill_credits') {
                        $.cookie('gift_id',giftId);
                        $.cookie('gift_text',text);
                        $.cookie('gift_recipient',recipient);
                        tools.redirect(url_main+'upgrade.php?action=payment_services&type=gift&gift_id='+giftId+'&user_to='+$this.userTo);
                    }else{
                        tools.showServerError();
                        $this.$btnSend.html($this.langParts['btn_perform_action']).prepend($this.btnGiftImg);
                    }
                },
                error: function(){
                    tools.showServerError();
                    $this.$btnSend.html($this.langParts['btn_perform_action']).prepend($this.btnGiftImg);
                },
                complete: function(){
                    $this.$inputGifts.prop('disabled',false);
                    $this.$text.val('');
                    $this.$credits.val('');
                    $this.$recipient.prop('checked',false);
                    $this.ajax['gift']=0;
                }
        });
    }

    this.showAlertSentGift = function(uid){
        var giftSentUser = $.cookie('gift_sent_user');
        if(giftSentUser != 'null' && giftSentUser==uid){
            setTimeout(showAlert($this.langParts['has_been_sent_gift'],'#st-container','blue'),400);
            $.cookie('gift_sent_user', null);
        }
    }

    this.preparePaidGift = function(){
        var id=$.cookie('gift_id'),
            text=$.cookie('gift_text'),
            rec=$.cookie('gift_recipient');
        if(id!='null'){
            $.cookie('gift_id',null);
            $this.$listGifts.find('#'+id).addClass('selected');
        }
        if(text!='null'){
            $.cookie('gift_text',null);
            $this.$text.val(text);
        }
        if(rec!='null'){
            $.cookie('gift_recipient',null);
            $this.$recipient.prop('checked',rec*1);
        }
    }

    this.redirectToSendGift = function(uid){
        if($this.guid==uid)return;
        tools.redirect(url_main+'gifts_send.php?user_id='+uid);
    }
    /* GIFT */

    this.prepareReportTip = function(uid, is_blocked_user){
        $this.uid = uid;
        $this.isBlockedUser = is_blocked_user*1;
        if ($this.guid!=$this.uid) {
            $this.profileViewMenu=$('#profile_view_menu');

            $('.header').click(function(e){
                if($(e.target).is('.header')&&$this.tipReport.is('.open'))$this.showTipReport();
            });

			$this.tipReportFriend=$('#tip_report_friend');
			$this.tipReportFriendAction=$('#tip_report_action_friend');

            $this.tipReportShadow=$('#tip_report_shadow');
            $this.tipReport=$('#tip_report').click($this.showTipReport);
            $this.tipReportBlock=$('#tip_report_blocked_user');
            if($this.isBlockedUser){
                $this.tipReportBlock.text($this.langParts['tip_report_unblock']);
				$this.tipReportFriendAction[0]&&$this.tipReportFriendAction.hide();
            }
            $this.tipReportPhoto=$('#tip_report_action_photo');
            $this.tipReportAction=$('#tip_report_action');
            $this.tipReportSend=$('#tip_report_send');
            $this.changeSettings=$('#change_status_user');

            $this.tipReportItem=$('.item:not(.send)', '#tip_report').click(function() {
                var $el=$(this), action=$el.data('action');
                $this.tipReportItem.removeClass('selected');
                $el.addClass('selected');
            })

            $('textarea',$this.tipReportSend).keydown(function(e){
                if (e.keyCode == 13) {
                    $this.sendReport();
                    return false;
                }
            });
        }
    }

    this.setInfoProfile = function(uid, is_blocked_user){
        $this.$loader = $('#loader_redirect');
        $this.$blockedPhoto = $('#blocked_photo');
        $this.prepareReportTip(uid, is_blocked_user);
    }

    /* Tip report */
    this.showTipReport = function(e){
        if (e&&e.target!=this) return;
        $this.cleanTipReport();
        $this.tipReport.toggleClass('open').removeClass('send');
    }

    this.cleanTipReport = function(){
        $this.tipReportItem.removeClass('selected');
    }

    this.reportUser = function(type){
        $this.typeReport = type;
        $this.tipReport.addClass('send')
    }

    this.sendReport = function($btn){
        if($this.ajax[$this.typeReport]) return;
        var $btn=$('.txt',$this.tipReportSend),
            $input=$('textarea',$this.tipReportSend),
            pid=$this.typeReport=='photo'?photos.curPid:0;
        $.ajax({url: url_main+'profile_view.php?cmd=report_user',
                type: 'POST',
                data: {ajax : 1,
                       user_to : $this.uid,
                       msg : trim($input.val()),
                       photo_id: pid
                },
                beforeSend: function(){
                    $input.val('').blur();
                    $this.ajax[$this.typeReport]=1;
                    $btn.html(getLoaderCl('loader_send_report','loader_tip_report'));
                },
                success: function(res){
                    var data=checkDataAjax(res);
                    if(data){
                        $this.showTipReport();
                        setTimeout(function(){
                            showAlert($this.langParts['report_sent'],'.main','blue');
                            if(!pid){
                                if(photos.display=='encounters'||photos.display=='rate_people'){
                                    $('#tip_report_action_user').hide();
                                }else{
                                    $('#tip_report_action_user').remove();
                                }
                            }else{
                                if ($.type(photos.photosInfo[pid]) === 'object') {
                                    if(trim(photos.photosInfo[pid]['reports'])){
                                        photos.photosInfo[pid]['reports'] +=','+$this.guid;
                                    }else{
                                        photos.photosInfo[pid]['reports'] =$this.guid;
                                    }
                                }
                                $this.tipReportPhoto.hide();
                            }
                            if(!$this.tipReportAction.find('.item:visible')[0]){
                                $this.changeSettings.fadeOut(200);
                            }
                        },800)
                    }else{showAlert($this.langParts.server_error,'.main')}
                    hideLoaderCl('loader_send_report');
                    setTimeout(function(){$btn.text($this.langParts['submit_your_report']);},450);
                },
                error: function(){
                    showAlert($this.langParts.server_error,'.main');
                },
                complete: function(){
                    $this.ajax[$this.typeReport]=0;
                }
        });

    }

	this.actionFriend = function(){
        if($this.ajax['friend']) return;
		if($this.tipReportFriendAction.data('action')=='remove'){
			showConfirm($this.langParts.are_you_sure, $this.langParts.remove_request, $this.langParts.cancel, $this.requestFriend, 'red', '#st-container', $this.cleanTipReport);
		}else{
			$this.requestFriend();
		}
    }

	this.actionFriendToList = function(uid){
		showConfirm($this.langParts.alert_add_to_friends, $this.langParts.add, $this.langParts.decline, $this.requestFriend, 'blue', '#st-container');
	}

	this.requestFriend = function(){
		if($this.ajax['friend']) return;
        var ind=+new Date;
		var btnMsg=$this.tipReportFriend.text();

        $.ajax({url: url_main+'my_friends.php?cmd=reguest_friend',
                type: 'POST',
                data: {uid : $this.uid, action:$this.tipReportFriendAction.data('action')},
                beforeSend: function(){
                    hideConfirm();
                    $this.ajax['friend']=1;
                    $this.tipReportFriend.html(getLoaderCl(ind,'loader_tip_report'));
                },
                success: function(res){
                    var data=checkDataAjax(res);
                    if(data){
						var photoList=data.photos;
						var action=data.action;
                        $this.showTipReport();
						btnMsg=$this.langParts['remove_from_friends'];
						var act='remove';
						if(action=='request'){
							btnMsg=$this.langParts['remove_request'];
							$('#access_requested').show();
							$('#request_access').hide();
						}else if(action=='remove'){
							$('#access_requested').hide();
							$('#request_access').show();
							btnMsg=$this.langParts['add_to_friends'];
							act='request';
						}
                        var fuid=photos.fuid*1;
                        var isShowPhoto=false;
                        if (data.is_friends) {
                            if (!fuid) {
                                photos.numberPrivate=0;
                                photos.fuid=$this.uid;
                                isShowPhoto=true;
                            }
                        } else if(fuid){
                            photos.numberPrivate=data.photos.private;
                            photos.setNumberPrivatePhoto();
                            photos.fuid=0;
                            isShowPhoto=true;
                        }
                        if (isShowPhoto) {
                            var pidCur=data.photos.cur_photo, photosCurPid=photos.curPid;
                            photos.curPid=pidCur;
                            photos.photosNumber = data.photos.number_photos;
                            photos.photosInfo = data.photos.list_photos;
                            photos.firstPreLoadingPhotos();
                            photos.photosInfo[pidCur].load=photos.isPublic(pidCur)?$('<img src="'+url_files+photos.photosInfo[pidCur]['src_bm']+'" class="hidden">'):photos.$privateBox;
                            console.log(photosCurPid,pidCur);
                            photos.show('show', pidCur);
                        }

						$this.tipReportFriendAction.attr('data-action',act).data('action',act);
						setTimeout(function(){
							if(action=='request'){
								showAlert($this.langParts.request_sent,'.main','blue');
							}
							$this.setParamAddFriend(act,btnMsg);
						},450);
                    }else{
						$this.tipReportFriend.text(btnMsg);
						showAlert($this.langParts.server_error,'.main');
					}
					$this.ajax['friend']=0;
                    hideLoaderCl(ind);
                },
                error: function(){
					$this.tipReportFriend.text(btnMsg);
                    showAlert($this.langParts.server_error,'.main');
                },
                complete: function(){
                    $this.ajax['friend']=0;
                }
        });
	}

	this.setParamAddFriend = function(act, btnMsg){
		if($this.tipReportFriend[0]){
			$('#change_settings_events').removeClass('no_opacity');
			$this.tipReportFriend.text(btnMsg);
			$this.tipReportFriendAction.attr('data-action',act).data('action',act);
		}
	}

    this.blockedUser = function(){
        if($this.ajax['block']) return;
        if ($this.isBlockedUser) {
            showConfirm($this.langParts.unblock_user, $this.langParts.unblock, $this.langParts.cancel, $this.unblockUser, 'blue', '#st-container', $this.cleanTipReport);
        } else {
            showConfirm($this.langParts.block_user, $this.langParts.block, $this.langParts.cancel, $this.blockUser, 'red', '#st-container', $this.cleanTipReport);
        }
    }

    this.blockUser = function(){
        if($this.ajax['block']) return;
        var ind=+new Date;
        $.ajax({url: url_main+'profile_view.php?cmd=block_user',
                type: 'POST',
                data: {ajax : 1,
                       user_id : $this.uid
                },
                beforeSend: function(){
                    hideConfirm();
                    $this.ajax['block']=1;
                    $this.tipReportBlock.html(getLoaderCl(ind,'loader_tip_report'));
                },
                success: function(res){
                    var data=checkDataAjax(res);
                    if(data){
                        $this.showTipReport();
                        $this.isBlockedUser=1;
                        photos.isBlockedUser=1;
                        if(photos.display=='encounters'){
                            csearch.likeToMeet('N','reply',$('#encounters_like_no'));
                        }else if(photos.display=='rate_people'){
                            csearch.setRatedPhoto(0);
                        }else{
                            $this.$blockedPhoto.fadeIn(200);
                            $this.profileViewMenu.fadeOut(200);
                            setTimeout(function(){
								$this.tipReportFriendAction.hide();
								$this.setParamAddFriend('request',$this.langParts['add_to_friends']);
								$this.tipReportBlock.text($this.langParts['tip_report_unblock']);
							},450);
                        }
                    }else{showAlert($this.langParts.server_error,'.main')}
                    hideLoaderCl(ind);
                },
                error: function(){
                    showAlert($this.langParts.server_error,'.main');
                },
                complete: function(){
                    $this.ajax['block']=0;
                }
        });
    }

    this.unblockUser = function(){
        if($this.ajax['block']) return;
        var ind=+new Date;
        $.ajax({url: url_page,
                type: 'POST',
                data: {ajax : 1,
                       user_id : $this.uid,
                       cmd : 'unblock_user'
                },
                beforeSend: function(){
                    hideConfirm();
                    $this.ajax['block']=1;
                    $this.tipReportBlock.html(getLoaderCl(ind,'loader_tip_report'));
                },
                success: function(res){
                    var data=checkDataAjax(res);
                    if(data){
                        $this.showTipReport();
                        $this.isBlockedUser=0;
                        photos.isBlockedUser=0;
                        $this.$blockedPhoto.fadeOut(200);
                        $this.profileViewMenu.fadeIn(200);
                    }else{showAlert($this.langParts.server_error,'.main')}
                    hideLoaderCl(ind);
                    setTimeout(function(){
						$this.tipReportFriendAction.show();
						$this.setParamAddFriend('request',$this.langParts['add_to_friends']);
						$this.tipReportBlock.text($this.langParts['tip_report_block']);
					},450);
                },
                error: function(){
                    showAlert($this.langParts.server_error,'.main');
                },
                complete: function(){
                    $this.ajax['block']=0;
                }
        });
    }

    this.meetUser = function(el){
        if($this.ajax['meet']) return;
        hideAlert();
        var ind=+new Date, sp=el.find('span'), is=sp.is('.active');
        $.ajax({url: url_page,
                type: 'POST',
                data: {ajax : 1,
                       user_id : $this.uid,
                       cmd : (is?'un':'')+'like_user'
                },
                beforeSend: function(){
                    el.before(getLoaderCl(ind,'loader_view_menu'));
                    $this.ajax['meet']=1;
                },
                success: function(res){
                    var data=checkDataAjax(res);
                    if(data){
                        if(is){sp.removeClass('active')
                        }else{
                            sp.addClass('active');
                            showAlert($this.langParts.your_interest_will,'.main','blue');
                        }
                    }else{showAlert($this.langParts.server_error,'.main')}
                },
                error: function(){
                    showAlert($this.langParts.server_error,'.main');
                },
                complete: function(){
                    $this.ajax['meet']=0;
                    hideLoaderCl(ind);
                }
        });
    }


    /* Email not confirmed */
    this.notConfirmedEmailInit = function(){
        $this.$frmNotConfirmedEmail = $('#form_email_not_confirmed');
        $this.$frmNotConfirmedEmailMail = $('#form_email_not_confirmed_mail');
        $this.$frmNotConfirmedEmailSubmit = $('#perform_action_email_not_confirmed');

        $this.$frmNotConfirmedEmailMail.keydown(function(e){
            if (e.keyCode == 13) {
                $this.$frmNotConfirmedEmailSubmit.click();
                return false;
            }
        });

        $this.$frmNotConfirmedEmailSubmit.click(function(){
            if($this.ajax['email'])return;
            if (tools.validateEmail($this.$frmNotConfirmedEmailMail, $this.langParts.incorrect_email)) {
                $this.$frmNotConfirmedEmail.submit();
            }
            return false;
        });

        $this.$frmNotConfirmedEmail.submit(function(){
            $this.ajax['email']=1;
            $this.ind=+new Date;
            $this.$frmNotConfirmedEmailSubmit.html(getLoaderCl($this.ind));
            $this.$frmNotConfirmedEmail.ajaxSubmit({success:$this.confirmedEmailFrmResponse});
            $this.$frmNotConfirmedEmailMail.prop('disabled', true);
            return false;
        });

        $this.$frmNotConfirmedEmailMail.on('change propertychange input',function(){
            resetTipTopError($(this));
        }).focus(function(){
            resetTipTopError($(this));
        }).blur(function(){
            resetTipTopError($(this));
        })
    }

    this.confirmedEmailFrmResponse = function(data){
        var data = checkDataAjax(data);
        $this.ajax['email']=0;
        $this.$frmNotConfirmedEmailMail.prop('disabled', false);
        $this.$frmNotConfirmedEmailSubmit.html($this.langParts['submit']);
        if (data!==false){
            if(data == '') {
                showAlert($this.langParts.email_sent,'.wrapper','blue');
            } else {
                showTipTop($this.$frmNotConfirmedEmailMail,data,1,$this.$frmNotConfirmedEmailMail.closest('.bl'));
            }
        }else{
            tools.showServerError();
        }
    }
    /* Email not confirmed */

    this.setCountersUserMenu = function(counters){
        //counters=counters.split(',');
        for (var el in counters) {
            //counters[el]=counters[el].split(':');
            $('#user_menu_counter_'+el).text(!(counters[el]*1)?'':counters[el]);
        }
    }

    this.cancelRedirectToUser = function(){
        $('a.people_nearby_to_user').fadeTo(0,1);
        $('#loader_to_user').hide(1,function(){$(this).remove()});
        $this.$userMenu.removeClass('selected');
        $this.$userMenuHead.removeClass('selected');

    }

    this.clearPageBeforeRedirect = function(){
        $('a.people_nearby_to_user').fadeTo(0,1);
        $('#loader_to_user').hide(1,function(){$(this).remove()});
        loaderRedirect.hide();
        $this.$userMenu.removeClass('selected');
        $this.$userMenuHead.removeClass('selected');
    }

    var loaderRedirect;
    $(function(){

        loaderRedirect=$('#loader_redirect');

        $('#icon_to_filter, .number_new_messages').on('click',function(){
            var el=$(this), url=this.href, cl='loader_to_search';
            if($('#change_status_user')[0]){
                cl='loader_to_search_and_report'
            }
            if(el.hasClass('number_new_messages'))cl='loader_to_messages';
            el.before(loaderRedirect.addClass(cl).fadeIn(100,function(){
                tools.redirect(url);
            }));
            return false;
        })
        /* Link add - Link edit*/
        $('.fl_right > .link_edit').on('click',function(e){
            var el=$(this);
            if($(e.target).is('.profile_info_edit')){
                el.before(getLoaderCl('loader_link_edit','loader_link_edit'))
            }
            //return false;
            tools.redirect(this.href);
            el.addClass('active');
            setTimeout(function(){
                el.switchClass('active','',600,'linear');
            },300)
            return false;
        })
        /* Link add - Link edit*/
        /* Menu Profile */
        $('#profile_view_menu > li > a')
        .on('click',function(){
            var el=$(this), url=this.href;
            if(el.is('.profile_info') && photos.checkUploadPhotoToSeePhotos()){
                return false;
            }

            el.find('span.cloud').fadeTo(1,1).fadeTo(800,0);
            if(this.hash=='#meet'){
                $this.meetUser($(this));
            } else {
                el.before(loaderRedirect.addClass('loader_view_menu').fadeIn(100,function(){
                    tools.redirect(url);
                }));
            }
            return false;
        })
        /* Menu Profile */
        /* Menu User */

        $this.$userMenuHead = $('.header', '#menu-3').on('click',function(){
            $this.clearPageBeforeRedirect();
            var el=$(this),l=el.find('.pic_profile'),
                url=el.addClass('selected').data('url');
            el.append(
                loaderRedirect.removeAttr('style')
                              .css({left:(l[0].offsetLeft+l[0].offsetWidth+2)+'px',top:'12px'})
                              .removeClass('loader_user_menu')
                              .addClass('loader_user_menu_header')
                              .fadeIn(100,function(){
                                tools.redirect(url);
                              })
            );
            return false;
        })

        $this.$userMenu = $('.item', '#menu-3').on('click',function(e){
            $this.clearPageBeforeRedirect();
            var el=$(this), url=el.addClass('selected').data('url');
            if (el.is('.menu_logout')) {
                showConfirm($this.langParts.really_log_out, $this.langParts.log_out, $this.langParts.cancel, $this.logOut, 'red', '#st-container', $this.logOutCancel);
            } else {
                var l=el.find('.txt > span');
                l.after(
                    loaderRedirect.removeAttr('style')
                                  .css({left:(l[0].offsetLeft+l[0].offsetWidth+5)+'px'})
                                  .removeClass('loader_user_menu_header')
                                  .addClass('loader_user_menu')
                                  .fadeIn(100,function(){
                                        tools.redirect(url);
                                  })
                );
            }
            return false;
        })
        /* IOS */
        $win.on('pagehide', function(){
            $this.clearPageBeforeRedirect();
        })
        /* Menu User */
    })

    return this;
}