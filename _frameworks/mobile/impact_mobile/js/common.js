var CCommon = function() {

    var $this=this;

    this.isAjax = {};
    this.btnSend = {};
    this.textMsg = {};

    this.reportButtonTitle = '';

    this.initScr=false;
    this.init = function(){
        $(function(){
            if($this.initScr)return;
            $this.initScr=true;
            console.log('INIT COMMON CLASS');
            $this.initMenu();
        })
    }

    /* Menu */
    this.startX=0;
    this.initMenu = function(){
        $this.menuHeader=$('#header_menu','#main_wrap');
        $pageShadowEmpty.on('click',function(){
            $this.hideHeaderMenu()
        })

        $this.initMenuResize();

        $('#header_menu, #header_menu_cont, #header_menu_cont > .menu_squares, #header_menu_cont > .square')
        .on('touchmove', function(e){
            if($this.menuHeader.is('.animated'))return;
            var to=e.originalEvent.touches[0],
                x=to.pageX,d=$this.menuHeader[0].offsetWidth;
            if(!$this.startX)$this.startX=x;
            if(Math.abs(x-$this.startX)>(d*.45)){
                $this.startX=0;
                $this.hideHeaderMenu()
            }
        }).on('touchend',function(e){
            $this.startX=0;
        })

        $jq('#bl_header','#main_wrap').on('click', $this.hideHeaderMenu);
    }

    this.initMenuResize = function(){
        $win.on(getEventOrientation(), function(){
            setTimeout(function(){
                $('.cont_overflow','#header_menu').css({maxHeight:$win[0].innerHeight - 70 - $win[0].innerWidth*8/100})
            },getTimeOrientation())
        }).resize();
    }

    this.isVisibleHeaderMenu = function(){
        return $jq('#header_menu').is('.to_show')&&!$jq('#header_menu').is('.animated')
    }

    this.hideHeaderMenu = function(fn){
        if(!$this.isVisibleHeaderMenu()){
            if(typeof fn=='function')fn();
            return;
        }
        $this.showHeaderMenu(true,fn)
    }

    this.showHeaderMenu = function(hide,fn){
        if($this.menuHeader.is('.animated'))return;
        hide=hide||false;
        var isShowMenu=$this.menuHeader.is('.to_show'),
            isShow=isShowMenu||hide;
        if((isShow && !isShowMenu) || (!isShow && isShowMenu)){
            if(typeof fn=='function')fn();
            return;
        }
        $this.menuHeader.addClass('animated').oneTransEnd(function(){
            $pageShadowEmpty[isShow?'removeClass':'addClass']('show');
            $this.menuHeader.removeClass('animated');
            if(typeof fn=='function')fn();
            fn=false;
        },'transform')[isShow?'removeClass':'addClass']('to_show',0);
    }
    /* Menu */

    this.openPopupMessage = function(id,btnTitle,fnSend,reset,placeholder){
        placeholder=placeholder||'';
        if(typeof cacheJq[id] == 'undefined'){
            var $pp=$('<div id="'+id+'" class="popup send_message pp_cont">'+
                        '<div class="cont_pp">'+
                            '<textarea placeholder=""></textarea>'+
                            '<button class="btn large violet" disabled>'+btnTitle+'</button>'+
                        '</div></div>').modalPopup({css:{}})
            $this.btnSend[id]=$pp.find('button').click(function(){fnSend(id)});
            $this.textMsg[id]=$pp.find('textarea').on('change propertychange input', function(){
                $this.btnSend[id].prop('disabled',!$this.isChangePopupMessage(id));
            })
            if(placeholder){
                $this.textMsg[id].addClass('placeholder').attr('placeholder', placeholder)
            }
            $pp.open(durOpenPopup,function(){$this.afterOpenPopupMessage(id)});
            $('.pp_body').on('click',function(e){
                if(e.target==this&&$('#'+id)[0]){//&&!$this.isChangePopupMessage(id)
                    $this.closePopupMessage(id,btnTitle)
                }
            });
            cacheJq[id]=$pp;
        }else{
            if(placeholder){
                $this.textMsg[id].addClass('placeholder').attr('placeholder', placeholder)
            }
            $this.textMsg[id].val(trim($this.textMsg[id].val()))
            if(reset||0){
                $this.btnSend[id].text(btnTitle).prop('disabled',true);
                $this.textMsg[id].val('').prop('disabled',false);
            }
            //$this.btnSend[id].text(btnTitle).prop('disabled',true);
            cacheJq[id].open(durOpenPopup,function(){$this.afterOpenPopupMessage(id)});
        }
    }

    this.afterOpenPopupMessage = function(id){
        $this.textMsg[id].focus();
    }

    this.closePopupMessage = function(id,btnTitle,fnCallback){
        cacheJq[id].close(durOpenPopup,function(){
            if($this.isChangePopupMessage(id)&&$this.btnSend[id].prop('disabled')){
                $this.textMsg[id].val('').prop('disabled',false);
                if(typeof fnCallback=='function')fnCallback();
            }
            $this.btnSend[id].text(btnTitle).removeLoader();
        })
    }

    this.isChangePopupMessage = function(id){
        return $.trim($this.textMsg[id].val())!='';
    }

    this.openContact = function(){
        $this.openPopupMessage('pp_contact',l('send_a_message_to_the_admin'),$this.sendContactMsg)
    }

    this.sendContactMsg = function(id){
        if($this.isAjax[id])return;
        $this.isAjax[id]=true;
        var val=$.trim($this.textMsg[id].val());
        $this.btnSend[id].prop('disabled',true).addLoader();
        $this.textMsg[id].prop('disabled',true);
        $.post('../contact.php?cmd=send',{ajax:1,comment:val},function(res){
            $this.closePopupMessage(id,l('send_a_message_to_the_admin'), function(){
                var data=getDataAjax(res, 'data');
                if(data!==false){
                    showAlertDelayShow(l('message_sent'))
                }else{
                    serverError()
                }
            })
            $this.isAjax[id]=false;
        })
    }

    this.photoReport = false;
    this.videoReport = false;
    this.profileReport = true;

    this.openReport = function(isPhoto) {
        $this.setReportType(isPhoto);

        $this.setReportButtonTitle();

        var placeholder='';
        if($this.profileReport) {
            clProfile.toggleMoreMenu(true);
            placeholder=l('report_this_user_to_the_administrator');
        } else if ($this.photoReport) {
            placeholder=l('report_this_photo_to_administrator');
        } else if ($this.videoReport) {
            placeholder=l('report_this_video_to_administrator');
        }

        $this.openPopupMessage('pp_reports', $this.reportButtonTitle, $this.sendReport, true, placeholder);
    }

    this.sendReport = function(id) {
        if($this.isAjax[id])return;
        $this.isAjax[id]=true;
        var val=$.trim($this.textMsg[id].val()),
            pid = (!$this.profileReport) ? clPhoto.curPid : 0;
        $this.btnSend[id].prop('disabled',true).addLoader();
        $this.textMsg[id].prop('disabled',true);
        if(!$this.profileReport){
            clPhoto.$photoReport.stop().fadeOut(300);
        }else{
            $jq('#footer_more_menu_report_user').remove();
        }
        $.post(url_ajax+'?cmd=report_user',
               {user_to:clProfile.uid, msg:val, photo_id:pid},
                function(res){
                    $this.closePopupMessage('pp_reports', $this.reportButtonTitle, function(){
                        if(checkDataAjax(res)){
                            showAlertDelayShow(l('report_sent'))
                            if(!pid){
                                /*$('#menu_additional_report_'+uid).remove();
                                var $profileMenuMoreItems=$jq('#profile_menu_more_options_items');
                                if($profileMenuMoreItems[0]){
                                    hMenuMore=$profileMenuMoreItems.find('.pp_info_cont').height()+28;
                                }*/
                            }
                            clPhoto.setDataReports(pid);
                        }else{
                            serverError()
                        }
                    });
                    $this.isAjax[id]=false;
        })
    }

    this.setReportType = function(reportType)
    {
        var currentReportType = 'profileReport';
        if(reportType === 'video') {
            currentReportType = 'videoReport';
        } else if(reportType) {
            currentReportType = 'photoReport';
        }

        var reportTypes = ['photoReport', 'videoReport', 'profileReport'];
        var reportTypeItem;

        for(var index in reportTypes) {
            reportTypeItem = reportTypes[index];
            $this[reportTypeItem] = (reportTypeItem === currentReportType) ? true : false;
        }

        //console.log($this.profileReport, $this.photoReport, $this.videoReport);
    }

    this.setReportButtonTitle = function() {

        if($this.profileReport) {
            $this.reportButtonTitle = l('add_a_message_for_the_administrator');
        } else if ($this.photoReport) {
            $this.reportButtonTitle = l('add_a_message_for_the_administrator');
        } else if ($this.videoReport) {
            $this.reportButtonTitle = l('add_a_message_for_the_administrator');
        }

    }

    return this;
}