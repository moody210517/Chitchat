var CProfile = function(guid,spotlightNumber,requestUri,isFreeSite) {

    var $this=this;

    this.guid=guid*1;
    this.langParts={};
    this.popup={};
    this.html={};
    this.requestUri=requestUri;
    this.isFreeSite=isFreeSite*1;

    this.isPhotoDefaultPublic;
    this.spotlightNumber=spotlightNumber;
    this.spotlightItems={};
    this.blink = {};
    this.$spotlightResponse;
    this.$spotlight;

    $this.dur=400;

    this.ppIncPop='#pp_increase_payment';
    this.serverError='Error server!';
    //this.wrClass='column-centered';

    this.isMyProfile = function(){
        return $this.guid==requestUserId || (!requestUserId && $this.guid);
    }

    this.confirmLogout = function(){
        confirmCustom($this.langParts.do_you_want_to_log_out,$this.logout);
		return false
    }

    this.logout = function(){
		//if (profileBgPlayer) profileBgPlayer.stopVideo();
        $('.bg_video').fadeTo(300,0); chProfileBg('',1);
        window.name=''; confirmHtmlClose();
        window.location.href=url_main+'index.php?cmd=logout';
    }

    /* Super Powers */
    this.openPlanSP = function(){
        $this.openPopupAjax('#pp_sp_plan');
    }

    this.closePlanSP = function(){
        $this.popup['#pp_sp_plan'].close();
    }

    this.processPlanSP = function(btn,request_uri){
        var item=$('select.item_plan','#pp_sp_plan').val(),
            system=$('select.item_system','#pp_sp_plan').val();
        $.ajax({type: 'POST',
                url: url_main+'upgrade.php',
                data: {ajax:1,cmd:'save',item:item,system:system,request_uri:request_uri},
                beforeSend: function(){
                    btn.prop('disabled', true).next('img.have_credits_loader').show();
                },
                error: function(){
                    btn.prop('disabled', false).next('img.have_credits_loader').hide();
                },
                success: function(data){
                    var data=checkDataAjax(data);
                    if(data){
                        $this.closePlanSP();
                        if(data=='before_error'){
                            setTimeout($this.openErrorSP,250)
                        }else if(data.type){
                            if(data.type=='demo'){
                                if (request_uri) {
                                    window.location.href=url_main+request_uri;
                                    return;
                                }
                                $('#super_powers_activate').fadeOut(250,function(){
                                    var activeTill = $('#super_powers_active_till');
                                    activeTill.find('span').html(data.date);
                                    activeTill.fadeIn(250);
                                })
                                setTimeout(function(){
                                    $this.openDoneSP();
                                    btn.prop('disabled', false).next('img.have_credits_loader').hide();
                                },250);
								isCurUserSuperPowers=1;
                            }else{
                                window.location.href=url_main+data.url;
                            }
                        }
                    }else{
                        $this.incPopAlertError();
                        btn.prop('disabled', false).next('img.have_credits_loader').hide();
                    }
                }
        });
    }

    this.openDoneSP = function(){
        $this.openPopupAjax('#pp_sp_done');
    }

    this.closeDoneSP = function(){
        $this.popup['#pp_sp_done'].close();
    }

    this.processDoneSP = function(){
        $this.closeDoneSP();
    }

    this.openErrorSP = function(){
        $this.openPopupAjax('#pp_sp_error');
    }

    this.closeErrorSP = function(){
        $this.popup['#pp_sp_error'].close();
    }

    this.processErrorSP = function(){
        $this.closeErrorSP();
    }
    /* Super Powers */
    /* Increase popularity */

    // 1 - Step into the Spotlight
    // 2 - Rise up to first place in search results
    // 3 - Get noticed in Encounters

    this.init = function(isPhotoDefaultPublic, isPhotoPublic, iAmInspotlight, spotlightCosts, hideMyPresence){
        $this.isPhotoDefaultPublic = isPhotoDefaultPublic*1;
        $this.isPhotoPublic = isPhotoPublic*1;
        $this.iAmInspotlight = iAmInspotlight*1;
        $this.spotlightCosts = spotlightCosts*1;
        $this.hideMyPresence = hideMyPresence*1;
    }

    this.incPop = function(){
        window.location.href=url_main+'increase_popularity.php';
    }

    this.incPopOpenPaymentSpotlight = function(type,request_uri,id,credits){
        if ($this.hideMyPresence===1) {
            confirmHtml($this.langParts.only_you_will_see_your_photo_in_the_spotlight, function(){
                $this.incPopOpenPayment(type,request_uri,id,credits);
            })
        } else {
            $this.incPopOpenPayment(type,request_uri,id,credits);
        }
    }

    this.incPopOpenPayment = function(type,request_uri,id,credits){
        var id=id||0,credits=credits||'';//gift
        //if ($this.isFreeSite && type=='gift') {
            /*$this.openPopupAjax('#pp_gift');*/
            //return;
        //}
        if (activePage == 'email_not_confirmed.php') {
            alertCustom($this.langParts.your_account_is_temporarily_blocked,true,ALERT_HTML_ERROR);
            return;
        }
        var pp;
        if(type=='encounters'&&!$this.isPhotoPublic){
            alertCustom($this.langParts.please_add_public_photo_first,true,ALERT_HTML_ALERT);
            return;
        }

        if(type=='spotlight'&&!$this.isPhotoDefaultPublic){//spotlight
            alertCustom($this.langParts.you_do_not_have_a_public_photo,true,ALERT_HTML_ALERT);
            return;
        }

        if (type!='gift') {
            var notOpen=false;
            if(type=='spotlight'&&!$this.spotlightCosts)notOpen=true;
            pp=$this.openPopupAjax($this.ppIncPop,'',notOpen);
            //pp.find('.head > strong').text($this.langParts['service_'+type]);//not used and remove $this.langParts['service_'+type]
            pp.find('.cont_loader').css('background','#fffcc5');
        }
        var request_uri=request_uri||'';
        if(request_uri){$this.requestUri=request_uri}

		$.post(url_main+'increase_popularity.php',{ajax:1,cmd:'pp_payment',type:type,action:'payment',id:id,credits:credits},function(data){
            var data=checkDataAjax(data),
                isVisiblePopup=$($this.ppIncPop+':visible')[0]
            if(data&&
               ((isVisiblePopup&&type!='gift')||type=='gift'||type=='spotlight')){
                data=$(data).filter('.increase_payment');
                if(type=='gift'){
                    if(data.find('.pay_with_credits')[0]){
                        /*$this.openPopupAjax('#pp_gift');*/
                        Gifts.send();
                        return;
                    }else{
                        Gifts.ppGiftClose();
                        setTimeout(function(){
                        pp=$this.openPopupAjax($this.ppIncPop);
                        pp.find('.head > strong').text($this.langParts['service_'+type]);
                        setTimeout(function(){$this.updatePopupAjax(pp,data)},220);
                        },200);
                    }
                }else{
                    if(type=='spotlight'){
                        var $btn=data.find('.my_payment_type');
                        $this.spotlightCosts=$btn.data('costs');
                        if($btn.data('costs')*1){
                            $this.updatePopupAjax(pp,data,!isVisiblePopup);
                        }else{
                            pp.find('.foot').append($btn);
                            $this.incPopPay('payment_service', $btn);
                        }
                    } else {
                        $this.updatePopupAjax(pp,data);
                    }
                    //$this.incPopPay('payment_service', $(this)); return false;
                    //data.filter('.increase_payment');
                }
            }else{$this.incPopAlertError()}
        });
    }

    this.incPopRefill = function(planId,systemId){
        var planId=planId||0;
        var systemId=systemId||0;
        var pp=$this.openPopupAjax($this.ppIncPop);
        pp.find('.head > strong').text($this.langParts.refill_now);
        $.post(url_main+'increase_popularity.php',{ajax:1,cmd:'pp_refill',action:'refill',current_plan:planId,current_system:systemId},function(data){
            var data=checkDataAjax(data);
            if(data&&$($this.ppIncPop+':visible')[0]){
                data=$(data).filter('.increase_payment');
                $this.updatePopupAjax(pp,data);
            }else{$this.incPopAlertError()}
        });
    }

    this.incPopShow = function(){
        var pp=$this.openPopupAjax($this.ppIncPop);
        $this.updatePopupAjax(pp,$('.increase_payment'),true);
    }

    this.incPopPay = function(action, btn){
        var item='',type=$('input.my_payment_type',$this.ppIncPop).val(),system='';
        if(action!='payment_service'){
            //if(type=='gift'){
                //$this.incPopClosePayment();
                //setTimeout(function(){$this.openPopupAjax('#pp_gift')},220);
                //return;
            //}
        //}else{
            item=$('select.item_plan',$this.ppIncPop).val();
            system=$('select.item_system',$this.ppIncPop).val();
        }
        $.ajax({type: 'POST',
                url: url_main+'increase_popularity.php',
                data: {ajax:1,action:action,item:item,system:system,action:action,type:type,request_uri:$this.requestUri},
                beforeSend: function(){
                    btn.prop('disabled', true).next('img.have_credits_loader').show();
                },
                error: function(){
                    btn.prop('disabled', false).next('img.have_credits_loader').hide();
                },
                success: function(data){
                var data=checkDataAjax(data);
                if(data){
                    $this.incPopClosePayment();
                    if (action=='refill'||action=='payment'
                        ||(action=='payment'&&type=='gift')) {
                        if (data.type=='demo') {
                            $this.setBalansCredit(data.balans);
                            if(action=='refill'){
                                setTimeout(function(){
                                    popupAlertHand($this.langParts.credits_have_been_added, $this.langParts.alert_success);
                                },500);
                            }
                        }else if(data.type=='url_system'){
                            window.location.href=url_main+data.url;
                        }
                    }
                    if(type!='gift' && $(data).is('.increase_payment')){
                        var d=$(data),b=d.find('input.balans'),dur=400;
                        $this.$spotlightResponse=d.find('.header_spotlight_list_item');
                        if(b[0]){$this.setBalansCredit(b.val())}

                        var activityServices=d.find('input.activity_services'),
                            levelPopularity=d.find('input.level_popularity'),
                            levelPopularityDecor=d.find('input.level_popularity_decor'),
                            levelDecor;
                        if(activityServices[0]&&levelPopularity[0]&&levelPopularityDecor[0]){
                            levelDecor=levelPopularityDecor.val();
                            var levelColumnNarrow=$('#popularity_level_column_narrow'),
                                level=$.trim(levelPopularity.val());
                            if($.trim(levelColumnNarrow.text())!=level){
                                $('#popularity_level_column_narrow').fadeOut(dur,function(){
                                    $(this).html(level).addClass(levelDecor).fadeIn(dur);
                                });
                                $('#popularity_low_column_narrow').fadeOut(dur,function(){
                                    $(this).attr('src',url_tmpl_main+'images/pic_popularity_'+levelDecor+'.png').fadeIn(dur);
                                });
                            }
                            if(activityServices.val()&&levelDecor=='very_high'){//???=='very_high'
                                $('#popularity_increase_column_narrow').fadeOut(dur,function(){
                                    $('#popularity_star_column_narrow').fadeIn(dur);
                                });
                            }
                        }

                        if(type=='search'||type=='encounters'){
                            $('.'+type+'_inactive').hide();
                            $('.'+type+'_active').removeClass('hide');
                            $this.blinkLabelService(type);
                        }

                        setTimeout(function(){
                            if(type=='spotlight'&&$this.$spotlightResponse[0]){
                                $this.iAmInspotlight=1;
                                $this.setSpotlight($this.$spotlightResponse)
                            }
                            $this.updatePopupAjax($this.popup[$this.ppIncPop],d);
                            $this.openPopupAjax($this.ppIncPop);
                            btn.prop('disabled', false).next('img.have_credits_loader').hide();
                        },220);
                    }
                }else{
                    btn.prop('disabled', false).next('img.have_credits_loader').hide();
                    $this.incPopAlertError();
                }
                }
        });
    }

    this.blinkLabelService = function(type){
        var i=0, el = $('#'+type+'_active_label');
        $this.blink[type] = setInterval(function(){el.animate({opacity: 'toggle'},600,function(){
            if (i == 4) {
                clearInterval($this.blink[type]);
                el.animate({opacity:1},600);
            }
            i++;
        })},600);
        var $linkMore=$('#'+type+'_active_more');
        if($linkMore.is('.hide')){
            $linkMore.hide().removeClass('hide').slideDown(200);
        }
    }

    this.incPopClosePayment = function(type){
        var type=type||'';
        $this.closePopupAjax($this.ppIncPop);
    }

    this.setSpotlight = function(data){
        $('.spotlight_inactive').addClass('hide');
        $('.spotlight_active').removeClass('hide');
        $this.blinkLabelService('spotlight');
        var list=$this.$spotlight.jcarousel('list');
        if(!list.find('[data-main-photo]')[0]){
            $('#spotlight_increase').hide();
            $('#spotlight_your').show().closest('.decor_photo_carousel').addClass('top');
        }
        $this.$spotlight.jcarousel('scroll',0,false);

        data.prependTo(list).animate({width:'62px'},$this.dur,function(){
            var img=$(this).find('img'),pid=img.data('pid');
            img.data('mainPhoto',pid).attr('data-main-photo',pid);
            $this.reloadSpotlight();
        })
    }

    this.reloadSpotlight = function(){
        var empty=$this.$spotlight.jcarousel('list').find('.spotlight_empty');
        if(empty[0]){empty.last().remove()
        }else{
            var items=$this.$spotlight.jcarousel('items');
            if(items.length>($this.spotlightNumber-1)){items.last().remove()}
        }
        $this.$spotlight.jcarousel('reload').jcarousel('scroll',0,false);
        $this.setSpotlightItems();
    }

    this.setSpotlightItems = function(){
        var items={},i=0,id;
        $('#header_spotlight_list > li:not(.remove)').each(function(){
            id=$(this).data('id');
            if(id)items[i++]=id;
        });
        $this.spotlightItems=items;
    }

    this.removeSpotlightItem = function($item){
        var $li=$item.closest('.header_spotlight_list_item').addClass('remove'),
            items=$('#header_spotlight_list > li:not(.remove)');
        if(items.length<14){
            $li.clone().html('').css('width','0px').removeClass('remove').addClass('spotlight_empty')
               .data('id','').attr('data-id','')
               .appendTo('#header_spotlight_list').animate({width:'62px'},$this.dur,function(){
                    $this.setSpotlightItems();
                    $this.$spotlight.jcarousel('reload');
            })
        }
        $li.animate({width:'0px'},
            {duration:$this.dur,
             progress:function(){
                $this.$spotlight.jcarousel('reload');
             },
             complete:function(){
                $(this).remove();
                $this.setSpotlightItems();
                $this.$spotlight.jcarousel('reload');
             }
        })
    }

    this.updateSpotlight = function(items){
        items=$('li','<div>'+items+'</div>');
        var $listItems=$('li:not(.remove)','#header_spotlight_list').not('.spotlight_empty'),
            l=$listItems.length, m=0,
            fn = function(items,dur){
                var i=0,t=dur,list=$('#header_spotlight_list');
                (function fu(){
                    var item=items.eq(i),id=item.data('id');
                    if(item[0]){
                        if(!list.find('[data-id='+id+']')[0]){
                            var $el=$('li:not(.remove)',list).eq(i);
                            if($el[0]){
                                $el.before(item);
                            }else{
                                item.appendTo(list);
                            }
                            item.animate({width:'62px'},t*=.8,function(){
                                $this.reloadSpotlight();
                                i++; fu();
                            });
                        }else{
                            i++; fu();
                        }
                    }
                })()
            };
        if(!l){
            fn(items,$this.dur);
        }else{
            var d=800,dt=1;
            $listItems.each(function(){
                var $el=$(this),isRemove=true;
                if(items[0]){
                    items.each(function(){
                        if($(this).data('id')==$el.data('id')){
                            isRemove=false;
                        }
                    })
                }
                if(isRemove){
                    dt=800;
                    setTimeout(function(){
                        $this.removeSpotlightItem($el.find('img'));
                    },d*=.8);
                }
                m++;
                if(l==m){
                    setTimeout(function(){fn(items,$this.dur)},dt);
                }
            });
        }
    }

    this.setBalansCredit = function(b){
        var cr=$('#credits_balans'),crH=$('#credits_balans_header');
        if(cr[0]){cr.text(b)}
        if(crH[0]){crH.text($this.langParts.credit_balance.replace(/{credit}/,b))}
    }

    this.incPopAlertError = function(){
        $this.closePopupAjax($this.ppIncPop);
        setTimeout(alertCustom($this.serverError),1000);
    }
    /* Increase popularity */

    /**/
    this.openPopupAjax = function(name,css,notOpen){
        var pp=$(name);
        if (!$this.popup[name]){
            //var css=css||{top:320,marginLeft:-185,position:'absolute'};
            $this.html[name]=pp.html();
            $this.popup[name]=pp.modalPopup({css:css, wrClass:$this.wrClass});
            if(!(notOpen||0))$this.popup[name].open();
            return $this.popup[name];
        }else{
            if(!(notOpen||0))$this.popup[name].open();
            return $this.popup[name];
        }
    }

    this.closePopupAjax = function(name,update){
        if ($this.popup[name]){
            update=update||0;
            var pp=$this.popup[name].close();
            if(!update){
                setTimeout(function(){pp.html($this.html[name])},210);
            }
        }
    }

    this.updatePopupAjax = function(pp,data,isOpen){
        pp.find('.head').replaceWith(data.find('.head'));
        var cont=data.find('.cont');
        cont.find('select').styler();
        if(pp.find('.cont').hasClass('cont_reloader')){
            pp.find('.cont_reloader').replaceWith(cont);
        } else {
            pp.find('.cont_loader').replaceWith(cont);
        }
        pp.find('.foot').replaceWith(data.find('.foot'));
        if(isOpen||0)pp.open();
    }

    this.popupByAuth = function(res) {
        var data=checkDataAjax(res);
        if(data!==false){$(data).insertAfter('.footer')}
    }

    this.showBasicFieldEdit = function(name,field,type,uid){
        $('.about_edit_'+name).on('click', function(){
            if(!$('#pp_3_'+name)[0]){
                var cl=$('.pp_fields_edit').clone().removeClass('pp_fields_edit')
                       .attr('id', 'pp_3_'+name).modalPopup().open();
                    cl.find('.edit').addClass(type+'_loader');
                    cl.find('.icon_close').on('click',function(){$('#pp_3_'+name).close();return false;});
                $('#pp_3_'+name).find('.head > strong').html(field);
            }else{
                $('#pp_3_'+name).open();
            }
            $this.showBasicField(name,uid);
        })
    }

    this.showBasicField = function(name,uid){
        var data={cmd:'pp_profile_about_edit',name:name};
        if(name=='private_note'){
            data={cmd:'pp_profile_private_note',uid:uid};
        }
        $.post(url_main+'ajax.php',data,function(res){
            var data=checkDataAjax(res);
            if(data){
                $('.about_edit_'+name).off('click');
                $('#pp_3_'+name).html(data);
            }
        })
    }

    this.showPersonalFieldsEdit = function(title){
        $('#personal_info_edit').on('click', function(){
            if(!$('#pp_4')[0]){
                var cl=$('.pp_fields_edit').clone().removeClass('pp_fields_edit')
                       .attr('id', 'pp_4').modalPopup().open();
                    cl.find('.edit').addClass('personal_loader');
                    cl.find('.icon_close').on('click',function(){$('#pp_4').close();return false;});
                $('#pp_4').find('.head > strong').html(title);
            }else{
                $('#pp_4').open();
            }
            $this.showPersonalFields();
        })
    }

    this.showPersonalFields = function(){
        $.post(url_main+'ajax.php',{cmd:'pp_profile_edit_field_personal'},function(res){
            var data=checkDataAjax(res);
            if(data){
                $('#personal_info_edit').off('click');
                $('#pp_4').html(data);
            }else{/*Error server*/}
        });
    }
    /* script_members.php */
    this.blockUser = function(uid,cmd,red){
        var cmd=cmd||'block_user',red=red||false;
        confirmHtmlClose();
        $.post(url_main+'ajax.php',{cmd:cmd,user_id:uid},function(res){
            if(checkDataAjax(res)){
                Messages.number_blocked_users++;
                $('#narrow_blocked_count').text(Messages.number_blocked_users);//user_block_list_count
                if(red){alertCustomRedirect(url_main+'search_results.php',$this.langParts.user_has_been_blocked,ALERT_HTML_SUCCESS)
                }else{
                    //$this.hideItemListUser(uid);
                }
            }
        })
    }

    this.confirmBlockUser = function(uid,cmd,red){
        var cmd=cmd||'block_user',red=red||false;
        confirmCustom(ALERT_HTML_ARE_YOU_SURE, function(){$this.blockUser(uid,cmd,red)});
    }
    /* script_members.php */

    this.hideAdditionalMenu = function(uid, data, fn, ev){
        var $item=$('#profile_visitor_menu_'+uid),ev=ev||0;
        if(!$item[0])$item=$('.additional_menu_'+uid);
        if(!$item[0]){
            if (typeof fn == 'function') fn(uid, data);
            return false;
        }
        visitorOrMenuNotHover=true;
        if($('.visitors_or_item').is(':visible')) {
            if(!ev)$item.off('mouseenter mouseleave',hoverVisitorTitleMenu);
            $item.find('.visitors_or_item').stop().animate({height:'toggle'},150,function(){
                setTimeout(function(){
                    if(!ev)$item.on('mouseenter mouseleave', hoverVisitorTitleMenu);
                    visitorOrMenuNotHover=false;
                },500);
                if (typeof fn == 'function') fn(uid, data);
            })
        } else {
            if (typeof fn == 'function') fn(uid, data);
        }
    }

    this.updateAdditionalMenu = function(uid){
        var $menu=$('#profile_visitor_menu_'+uid),
            $items=$menu.find('li:not(.not_visible)'),w=0;
        if($items[0]){
            $items.removeClass('first').first().addClass('first');
            w='auto';
            $menu.find('.visitors_or_item').hide();
        }
        $menu.stop().show().animate({width:w},300,function(){if(!w)$menu.hide()});
    }

    this.forceUpdateWall  = function(isWall) {
        if (!isWall && typeof Wall === 'object' && typeof Wall.updater === 'function') {
            Wall.updater();
        }
    }

    this.requestAjax = {};
    this.requestAjaxAddFriend = function(data, uid, isWall){
        var $menu=$('#profile_visitor_menu_'+uid),isWall=isWall||0;
        if(!$menu[0])return;
        var $li=$('#li_friend_add_'+uid),
            $el=$li.find('a');
        if(data=='request'){
            $li.addClass('not_visible');
            $this.updateAdditionalMenu(uid);
            return;
        }else if(data=='approve'){
            $el.text($this.langParts['unfriend']).data('action', 'remove')
                .removeClass('friend_add').addClass('friend_remove');
            $('#tab_wall').removeClass('not_allowed');
        }else if (data=='remove') {
            $el.text($this.langParts['add_friends']).data('action', 'request')
               .removeClass('friend_remove').addClass('friend_add');
        }
        $li.removeClass('not_visible');
        $this.forceUpdateWall(isWall);
        $this.updateAdditionalMenu(uid);
    }

    this.sendRequestFriend = function(uid, $el){
        if($this.requestAjax['friend'])return;
        $this.requestAjax['friend']=1;
        $.post(url_main+'my_friends.php',{ajax_data:1,action:$el.data('action'),uid:uid},
            function(res){
            var data=checkDataAjax(res);
            if(data){
                alertCustom($this.langParts['friend_'+data],0,ALERT_HTML_SUCCESS);
                $this.requestAjaxAddFriend(data, uid);
                $('.request_access_private_photo').fadeOut(100,function(){$(this).remove()});
            }
            $this.requestAjax['friend']=0;
        })
    }

    this.addFriend = function(uid, $el){
        $this.hideAdditionalMenu(uid, $el, $this.sendRequestFriend);
    }

    this.addFriendFromIm = function(uid){
        if($this.requestAjax['friend_from_im'])return;
        $this.requestAjax['friend_from_im']=1;
        $.post(url_main+'my_friends.php',{ajax_data:1,action:'request',uid:uid},
            function(res){
            var data=checkDataAjax(res);
            if(data){
                $('#pp_message_friend_add_'+uid).fadeOut(300,function(){
                    $(this).remove();
                    $('#pp_message_friend_add_send_'+uid).text($this.langParts['friend_'+data]).fadeIn(300,function(){
                        var $el=$(this);
                        setTimeout(function(){
                            $el.fadeOut(300,function(){$el.remove()});
                        },2000)
                    })
                });
                $this.requestAjaxAddFriend(data,uid);
            }
            $this.requestAjax['friend_from_im']=0;
        })
    }

    this.sendWinkFromMenuPage = function(uid){
        $this.hideAdditionalMenu(uid, '', $this.sendWink, 1);
    }

    this.sendWinkFromAdditionalMenu = function(uid){
        checkLoginStatus();
        $this.hideAdditionalMenu(uid, '', $this.sendWink);
    }

    this.sendWink = function(uid){
        if($this.requestAjax['wink'])return;
        $this.requestAjax['wink']=1;
        $.get(url_ajax+'?cmd=send_wink&uid='+uid, function(res){
                if(checkDataAjax(res)){
                    alertHtml($this.langParts['your_wink_has_been_sent'], 0, ALERT_HTML_SUCCESS);
                }
                $this.requestAjax['wink']=0;
        })
    }

    /* Report */
    this.reportUserId = 0;
    this.reportPhotoId = 0;
    this.openReport = function(uid, pid) {
        $this.reportUserId=uid||0;
        $this.reportPhotoId=pid||0;
        if(($this.requestAjax['report'] && !pid) || !uid)return;
        var title=$this.langParts[Photo.isShowGalleryPhoto?'report_title_photo':'report_title_user'];
        $('strong', $this.$userReportPopup).text(title);
        $this.$userReportPopup.open();
    }

    this.closeReport = function() {
        $this.$userReportPopup.close();
        $this.$userReportMsg.val('');
    }

    this.cancelReport = function() {
        var msg=$this.$userReportMsg.val();
        if(trim(msg)){
            $this.$userReportMsg.val('');
        }else{
            $this.closeReport();
        }
    }

    this.checkCloseReport = function($el) {
        if ($this.$userReportPopup.is(':visible')) {
            var msg=trim($this.$userReportMsg.val());
            if($el.is('.pp_wrapper')&&!msg)$this.closeReport();
            return false;
        }
        return true;
    }

    this.sendReport = function() {
        $this.requestAjax['report'] = 1;
        var uid=$this.reportUserId,
            pid=$this.reportPhotoId,
            msg=trim($this.$userReportMsg.val());
        $this.closeReport();
        if(pid)$('#report_photo_gallery').addClass('response_loader');
        $.post(url_ajax+'?cmd=report_user',
               {user_to : uid, msg : msg, photo_id: pid},
                function(res){
                    if(checkDataAjax(res)){
                        setTimeout(function(){alertCustom($this.langParts['report_sent'],1,ALERT_HTML_SUCCESS)},220);
                        Photo.setDataReports(pid);
                        if(!pid){
                            $('#menu_additional_report_'+uid).remove();
                            $this.updateAdditionalMenu(uid);
                        }
                    }else if(pid) {
                        $('#report_photo_gallery').removeClass('response_loader');
                    }
                    $this.requestAjax['report'] = 0;
        });
    }
    /* Report */

    $(function(){
        $this.$userReportPopup=$('#pp_user_report').modalPopup({wrCss:{zIndex:1001}});
        //$this.$report=$('#report_photo_gallery');
        $this.$userReportMsg=$('#pp_user_report_msg');

        /* profile_edit_js */
        /* Edit main */
        var profile_edit_main=$('#profile_edit_main'),
            pp_edit_main=$('#pp_profile_edit_main').modalPopup();
        profile_edit_main.on('click', function(){
            pp_edit_main.open();
            $.post(url_main+'ajax.php',{cmd:'pp_profile_edit_main'},function(res){
                var data=checkDataAjax(res);
                if(data){
                    profile_edit_main.off('click');
                    pp_edit_main.html(data);
                }else{/*Error server*/}
            });
        })
        $('#profile_edit_main_close').on('click',function(){pp_edit_main.close();return false;});
        /* Edit main */
        /* Edit looking */
        var profile_edit_looking=$('#profile_edit_looking'),
            pp_edit_looking=$('#pp_edit_looking').modalPopup();
        profile_edit_looking.on('click', function(){
            pp_edit_looking.open();
                $.post(url_main+'ajax.php',{cmd:'pp_profile_edit_looking'},function(res){
                    var data=checkDataAjax(res);
                if(data!==false){
                    profile_edit_looking.off('click');
                    pp_edit_looking.html(data);
                    }else{/*Error server*/}
                })
        })
        $('#pp_edit_looking_close_one').on('click',function(){pp_edit_looking.close();return false;});
        /* Edit looking */

        var updateCarousel = function(carousel) {
            var firstElement = carousel._first;
            var lastElement = carousel._last;
            $('#header_spotlight').find('li').each(function(index, el){
                if ($(el).offset().left >= firstElement.offset().left && $(el).offset().left <= lastElement.offset().left) {
                    $(el).find('img').css({visibility: 'visible'});
                    var a = $(el).find('a');
                    a.css({visibility: 'visible'});
                    if (!a.hasClass('vis')) {
                        a.addClass('vis');
                    }
                    $(el).css({visibility: 'visible'});
                } else {
                    $(el).find('img').css({visibility: 'hidden'});
                    var a = $(el).find('a');
                    a.css({visibility: 'hidden'});
                    if (a.hasClass('vis')) {
                        a.removeClass('vis');
                    }
                    $(el).css({visibility: 'hidden'});
                }
            });
        };

        /* Spotlight */
        $this.$spotlight = $('#header_spotlight')
        .on('jcarousel:createend',function(event, carousel){
            updateCarousel(carousel);
        }).on('jcarousel:reload', function(event, carousel) {
            //updateCarousel(carousel);
        }).jcarousel({
            vertical: false,
            list: '#header_spotlight_list',
            items: '.header_spotlight_list_item',
            wrap: 'last',
            transitions: Modernizr.csstransitions ? {
                transforms: Modernizr.csstransforms,
                transforms3d: Modernizr.csstransforms3d,
                easing: 'linear'
            }:false,
            animation:{duration:1000}
        });

        $this.$spotlight.on('jcarousel:fullyvisiblein', 'li', function(event) {
            var elem = $(event.target);
            elem.find('img').css({visibility: 'visible'});
            var a = elem.find('a');
            a.css({visibility: 'visible'});
            if (!a.hasClass('vis')) {
                a.addClass('vis');
            }
            elem.css({visibility: 'visible'});
        });

        $this.$spotlight.on('jcarousel:fullyvisibleout', 'li', function(event) {
            setTimeout(function(){
                var elem = $(event.target);
                var a = elem.find('a');
                if (a.hasClass('vis')) {
                    a.removeClass('vis');
                }
                elem.find('img').css({visibility: 'hidden'});
                elem.css({visibility: 'hidden'});
                a.css({visibility: 'hidden'});
            }, 1000);
        });

        $('#header_spotlight_next').click(function(){
            $this.$spotlight.jcarousel('scroll','+=6')
            return false;
        })

        $this.setSpotlightItems();
        /* Spotlight */

        $('.service_link').hover(function(){
            $(this).closest('.item_tb').find('.info > a').toggleClass('link_hover')
        });

        $('.header_spotlight_list_item a').hover(
            function(e){
                if ($(this).hasClass('vis')) {
                    $(this).closest('ul').css('z-index', 4);
                }
            },
            function(e){
                $(this).closest('ul').css('z-index', 1);
            }
        );

        $('.profile_verification_off').click(function(){
            return false;
        });

        var $profileVerificationShow=$('.profile_verification_show').click(function(){
            $this.openPopupAjax('#pp_profile_verification');
            return false;
        });
        if($profileVerificationShow[0]){
            $('body').on('click', '.pp_wrapper', function(e){
                if($(e.target).is('.pp_wrapper')){
                    $this.closePopupAjax('#pp_profile_verification', true);
                }
            })
        }
    })

    this.verifyAccount = function() {
        var url = $('select[name="profile_verification_system"]').val();
        if(url) {
            $('img.profile_verification_loader').show();
            location.href = 'social_login.php?redirect=' + url + '&page_from=' + location.href;
        }

        return false;
    }

    return this;
}

setTabs=function(id0){
    //console.log (id0);
    var $tabs=$('#tabs');
    $win.on('hashchange', function(e){
        var id=location.hash||id0,
            isWall=(id=='#tabs-3');
        var $a=$('a[href="'+id+'"]',$tabs);
        if(!$a[0]||$a.is('.not_allowed')){
            var af=$('a', $tabs)[0];
            if(af){
               var h=af.href.match(/#(tabs-[1-3])/);
               h[0]&&(location.hash=h[0]);
            }
            return;
        }
        if (!/#tabs-[1-3]/.test(id) && !$('#tabs>a.target')[0]) id=id0;
        if (!/#tabs-[1-3]/.test(id) || $(id+'.target')[0]) return;
        $('#tabs>a').removeClass('target');
        $(id).addClass('target');
        $('.tab a',$tabs).removeClass('active set');
        document.title=siteTitleTemp+' '+$('[href="'+id+'"].tabs_switch').addClass('active set').text();
        siteTitle=document.title;
        if(isWall){
            $('.column_main_cont').addClass('bg_wall');
        }else{
            $('.column_main_cont').removeClass('bg_wall');
            stopAllPlayers();
        }
        $('#wall_up').css({transition:'.2s linear', opacity:+isWall, visibility: (isWall?'':'hidden')})
        $win.scroll()
    }).trigger('hashchange')
}