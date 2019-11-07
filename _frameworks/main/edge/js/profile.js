var CProfile = function(guid, uid) {

    var $this=this;
	this.popup={};
	this.html={};
    this.guid=guid*1;
    this.uid=uid*1;
	this.ppIncPop='#pp_increase_payment';
    this.requestAjax={report : 0, reportMedia : {}};
	this.serverError='Error server!';
	this.incPopShow = function(){
        var pp=$this.openPopupAjax($this.ppIncPop);
        $this.updatePopupAjax(pp,$('.increase_payment'),true);
    }
	this.incPopClosePayment = function(type){
        var type=type||'';
        $this.closePopupAjax($this.ppIncPop);
    }
	this.incPopRefill = function(planId,systemId){
        var planId=planId||0;
        var systemId=systemId||0;
        var pp=$this.openPopupAjax($this.ppIncPop);
        //pp.find('.head > strong').text($this.langParts.refill_now);
        $.post(url_main+'increase_popularity.php',{ajax:1,cmd:'pp_refill',action:'refill',current_plan:planId,current_system:systemId},function(data){
            var data=checkDataAjax(data);
			
            if(data&&$($this.ppIncPop+':visible')[0]){
                data=$(data).filter('.increase_payment');
                $this.updatePopupAjax(pp,data);
            }else{$this.incPopAlertError()}
        });
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
	this.incPopOpenPaymentSpotlight = function(type,request_uri,id,credits){
        if ($this.hideMyPresence===1) {
            confirmHtml($this.langParts.only_you_will_see_your_photo_in_the_spotlight, function(){
                $this.incPopOpenPayment(type,request_uri,id,credits);
            })
        } else {
            $this.incPopOpenPayment(type,request_uri,id,credits);
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
	
	this.incPopAlertError = function(){
        $this.closePopupAjax($this.ppIncPop);
        setTimeout(alertCustom($this.serverError),1000);
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
	
    this.setData = function(data){
        for (var key in data) {
           $this[key] = data[key];
        }
    }

    this.updateServerMyData = function(allowedFeature){
        userAllowedFeature=allowedFeature;
    }

    this.isMyProfile = function(){
        var isMy=currentPage == 'profile_view.php'
                || (currentPage == 'search_results.php' && requestUserId && $this.guid==requestUserId);
        return isMy;
    }

    this.statusOnline=0;
    this.realStatusOnline=0;
    this.updateOnlineStatus = function(status, realStatus){
        if($this.realStatusOnline!=realStatus){
            $this.realStatusOnline=realStatus;
        }
        if ($this.statusOnline!=status) {
            $jq('#profile_status_online')[status?'addClass':'removeClass']('to_show');
            $this.statusOnline=status;
        }
	}

    this.setStatusOnline = function(realStatus, userStatus){
        $this.realStatusOnline=realStatus*1;
        $this.statusOnline=userStatus*1;
	}

    this.getRealStatusOnline = function(){
        return $this.realStatusOnline;
	}

    this.hideMoreMenu = function(){
        if($jq('#profile_user_more_menu_bl').is('.in'))$jq('#profile_user_more_menu_bl').collapse('hide');
    }

    /* Block user */
    this.isBlockedProfile = function(){
        return $this.guid!=$this.uid && $this.isBlocked;
    }

    this.confirmBlockUser = function($btn){
        if($this.requestAjax['blocked'])return;
        var t=0;
        if($btn.data('tooltip')){
            $btn.blur();
            t=100;
        }
        var msg={
            block_visitor_user : l('do_you_want_to_block_the_user'),
            user_unblock : l('the_user_will_be_unblocked')
        }
        setTimeout(function(){
            confirmCustom(msg[$btn.data('cmd')],function(){$this.blockUser($btn)},l('are_you_sure'))
        },t)
    }

    this.blockUser = function($btn,uid,cmd,call){
        if($this.requestAjax['blocked'])return;
        $this.requestAjax['blocked']=true;
        var cmdCur;
        $btn=$btn||[];
        if($btn[0]){
            uid=$btn.data('uid');
            cmdCur=$btn.data('cmd');
            addChildrenLoader($btn);
        }else{
            cmdCur=cmd;
        }

        $.post(urlMain+'ajax.php?cmd='+cmdCur,{user_id:uid,user_to:uid},function(res){
            var data = checkDataAjax(res);
            if(data){
                if(cmd&&cmd=='block_visitor_user') {
                    alertCustom(l('the_user_has_been_blocked'));
                }
                $this.blockUserResponse(uid,$btn,cmdCur,data);
                if(typeof call=='function')call()
            }else{
                alertServerError(true)
            }
            $btn[0]&&removeChildrenLoader($btn);
            $this.requestAjax['blocked']=false;
        })
    }

    this.blockUserResponse = function(uid, $btn, cmdCur, data){
        var title=l('profile_menu_user_unblock'),
            cmd='user_unblock',
            msg=l('the_user_has_been_blocked');
        if (cmdCur=='user_unblock') {
            title=l('menu_user_block_edge');
            cmd='block_visitor_user';
            msg=l('the_user_has_been_unlocked');
            $jq('#bl_user_blocked').removeClass('to_show');
            $this.isBlocked = 0;
        }else{
            $jq('#update_server').append($(data.script).filter('script'));
            $jq('#bl_user_blocked').addClass('to_show');

            $this.updateLinkFavorite(l('tooltip_add_favorite'));

            clFriends.updateLink('request', l('menu_friends_add_edge'), 0);
            $this.isBlocked = 1;
        }
        if ($btn[0]) {
            alertCustom(msg, l('alert_html_done'));
        }

        $this.showPostWall(uid, cmdCur, data.wall_only_post);
        if(cmdCur=='block_visitor_user'){
            clPages.pageFriendsReloadCheckUser($this.guid);
        }

        $jq('.menu_user_block_edge, .menu_user_unblock_edge').each(function(){
            var $btn=$(this).data('cmd',cmd).attr('data-cmd',cmd);
            if($btn.data('tooltip')){
                $btn.tooltip('hide').attr('data-original-title', title);
            }else{
                $btn.find('.btn_title').text(title);
            }
            $btn.find('i').toggleClass('fa-times-circle fa-ban');
        })
    }

    this.showPostWall = function(uid, action, wall_only_post){
        if(typeof clWall != 'object')return;
        clWall.showPostBlockedUser(uid, action, wall_only_post);
    }
    /* Block user */

    /* Favorite */
    this.actionFavorite = function($btn){
        if($btn.is('.disabled'))return;
        addChildrenLoader($btn.addClass('disabled'));
        if($btn.data('tooltip'))$btn.blur();
        var uid=$btn.data('uid');

        $.post(url_ajax+'?cmd=favorite_action',{user_id:uid},function(res){
            var data = checkDataAjax(res);
            if(data){
                var title=l('tooltip_add_favorite');
                if (data == 'add') {
                    title=l('tooltip_remove_favorite');
                }
                $this.updateLinkFavorite(title);
            }else{
                alertServerError(true)
            }
            removeChildrenLoader($btn.removeClass('disabled'));
        })
    }

    this.updateLinkFavorite = function(title){
        $jq('.menu_favorite_add_edge, .menu_favorite_remove_edge').each(function(){
            var $btn=$(this);
            if($btn.data('tooltip')){
                $btn.tooltip('hide').attr('data-original-title', title);
            }else{
                $btn.find('.btn_title').text(title);
            }
            $btn.find('i.fa-star').toggleClass('active');
        })
    }
    /* Favorite */

    /* Report */
    this.reportUserId = 0;
    this.reportPhotoId = 0;
    this.openReport = function(uid, pid) {
        $this.reportUserId=uid||0;
        $this.reportPhotoId=pid||0;

        var isAjax = pid ? $this.requestAjax.reportMedia[pid] : $this.requestAjax.report;

        if(isAjax)return;

        var title = clProfilePhoto.isShowGallery ? (clProfilePhoto.ppGalleryIsVideo ? l('report_this_video_to_administrator') : l('report_this_photo_to_administrator')) : l('report_this_user_to_the_administrator');

        $('.modal-title', $this.$ppUserReport).text(title);
        $this.$ppUserReportMsg.val('').change();
        $this.$ppUserReport.modal('show');
    }

    this.closeReport = function() {
        $this.$ppUserReport.modal('hide')
    }

    this.cancelReport = function() {
        var msg=$this.$ppUserReportMsg.val();
        if(trim(msg)){
            $this.$ppUserReportMsg.val('').change();
            alert("aaa");
        }else{
            $this.closeReport();
            alert("bbb");
        }
    }

    this.checkCloseReport = function() {
        if ($this.$ppUserReport[0] && $this.$ppUserReport.is('.in')) {
            var msg=trim($this.$ppUserReportMsg.val());
            return msg ? true : false;
        }
        return false;
    }

    this.sendReport = function() {
        var uid=$this.reportUserId,
            pid=$this.reportPhotoId,
            msg=trim($this.$ppUserReportMsg.val());
        $this.closeReport();
        if (pid) {
            $this.requestAjax.reportMedia[pid] = 1;
        } else {
            $this.requestAjax.report=1;
        }
        if(pid) {
            clProfilePhoto.$el.linkReport.addChildrenLoader();
        }
        $.post(url_ajax+'?cmd=report_user',
               {user_to : uid, msg : msg, photo_id: pid},
                function(res){
                    if(checkDataAjax(res)){
                        setTimeout(function(){
                            alertCustom(l('report_sent'),l('alert_success'))
                        },220);
                        if(pid){
                            clProfilePhoto.setDataReports(pid);
                        }else{
                            $('.menu_user_report_edge').remove();
                        }
                    }
                    if (pid) {
                        clProfilePhoto.$el.linkReport.removeChildrenLoader();
                        $this.requestAjax.reportMedia[pid]=0;
                    } else {
                        $this.requestAjax.report=0;
                    }
        })
    }
    /* Report */

    $(function(){
        $('.menu_messages_edge').click(function(){
            var uid=$this.uid==$this.guid?0:$this.uid;
            sendMessages(uid, $(this));
            return false;
        })

        $this.$ppUserReport=$('#pp_user_report');
        if($this.$ppUserReport[0]){
            $this.$ppUserReportMsg=$jq('#pp_user_report_msg').on('change propertychange input', function(){
                if(trim($this.$ppUserReportMsg.val())){
                    $jq('#pp_user_report_cancel_title').text(l('reset'));
                    $jq('#pp_user_report_send').prop('disabled', false);
                }else{
                    $jq('#pp_user_report_cancel_title').text(l('cancel'));
                    $jq('#pp_user_report_send').prop('disabled', true);
                }
            })
        }
    })
    return this;
}