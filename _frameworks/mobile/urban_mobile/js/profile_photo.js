var CProfilePhoto = function() {

    var $this=this;

    this.uid;
    this.guid;
    this.fuid;

    this.langParts = {};

    this.photosNumber;
    this.photosCount = 0;
    this.curPid = 0;
    this.src_b = '';
    this.display = '';
    this.visibleUserInfo = true;
    this.numberPrivate = 0;

    this.photosInfo = {};
    this.photosKey = []; //not used
    this.isPhotosDelete = [];

    this.url_ajax;
    this.photoLoad = true;

    this.maxFileSize;

    this.durUpload = 400;
    this.dur = 400;

    this.$contextUploadFile = {};
    this.idGenerator = 0;

    this.approvePhotoCode = '';
    this.approveVideoCode = '';
    this.reportUser = 1;

    this.setData = function(data){
        for (var key in data) {
           $this[key] = data[key];
        }
    }

    this.setDisplayParam = function(display){
        $this.display = display;
    }

    /* Photo upload */
    this.onLoadImage = function(el) {
        el.fadeTo(400,1);
        el.parent('a').next('a.icon_edit').fadeTo(400,1);
    }

    this.setInfoPhotoUpload = function(guid, iAmInspotlight) {
        $this.guid = guid;
        $this.curPid = 0;
        $this.photosInfo = {};
        $this.iAmInspotlight=iAmInspotlight;
    }

    this.setCachePhoto = function(id,private,main,isVideo,approve) {
        if(typeof $this.photosInfo[id]=='undefined'){
            $this.photosInfo[id] = {};
        }
        var isVideo=isVideo || 0;
        $this.photosInfo[id]['private'] = private*1;
        $this.photosInfo[id]['default'] = main*1;
        $this.photosInfo[id]['is_video'] = isVideo*1;
        $this.photosInfo[id]['approve'] = approve*1;
    }

    this.changeUpload = function(file, type, isVideo) {
        var isVideo = isVideo || 0;
        var idUpload = +new Date + '_' + $this.idGenerator++,
            frm = file.parent('form');
        $this.prepareUpload(type, idUpload, isVideo);
       // console.log(idUpload);
        frm.data('idUpload', idUpload)
           .find('input[type=submit]').click();
    }

    this.checkUploadVideo = function()
    {

        return true;
    }

    this.checkUploadLimit = function()
    {
        //console.log($this.photosCount+' '+$this.uploadLimitPhotoCount+' '+isSuperPowers);
        if(isFreeSite==false && isSuperPowers==false && $this.photosCount>=$this.uploadLimitPhotoCount){
                showConfirm($this.langParts.upload_more_than_limit,
                            $this.langParts.upgrade,
                            $this.langParts.cancel,
                            function(){window.location.href=url_main+'upgrade.php'}, 'red', '#st-container');
            return false;
        }

        return true;
    }

    this.prepareUpload = function(type, idUpload, isVideo) {
        var pref =isVideo?'video':'photo';
        if(isVideo){
            var srcImg=url_tmpl_mobile+'images/video_empty.png';
        } else {
            var srcImg=url_tmpl_mobile+'images/photo/photo_empty.png';
        }
        var w = $('#'+pref+'_add_' + type).width(),
            h = $('#'+pref+'_add_' + type).find('img').height(),
            context = $('<li class="photo_upload">'+
                            '<div class="photo_upload_box">'+
                                '<a id="'+idUpload+'" class="photo_upload_a cancel_upload" href="">'+
                                    '<img style="height:'+h+'px" src="'+srcImg+'" alt="" />'+
                                    '<div style="opacity:0" class="photo_loader spinner center">'+
                                        '<div class="spinner-blade"></div>'+
                                        '<div class="spinner-blade"></div>'+
                                        '<div class="spinner-blade"></div>'+
                                        '<div class="spinner-blade"></div>'+
                                        '<div class="spinner-blade"></div>'+
                                        '<div class="spinner-blade"></div>'+
                                        '<div class="spinner-blade"></div>'+
                                        '<div class="spinner-blade"></div>'+
                                        '<div class="spinner-blade"></div>'+
                                        '<div class="spinner-blade"></div>'+
                                        '<div class="spinner-blade"></div>'+
                                        '<div class="spinner-blade"></div>'+
                                    '</div>'+
                                '</a>'+
                                '<a data-id="'+idUpload+'" class="icon_delete cancel_upload" href=""></a>'+
                            '</div>'+
                        '</li>').css({width:'0px', opacity:.3});
            context.prependTo('#line_'+pref+'_'+type)
                   .animate({width:w + 'px',opacity:1},$this.durUpload,function(){
                                $(this).css({width:''})
                                       .find('img').css({height:''}).end()
                                       .find('.photo_loader').fadeTo(200,1);
                            })
            var scrollEl = $('#head_'+pref+'_' + type);
            $this.$stContent.animate({scrollTop:scrollEl[0].offsetTop-52},900);

            $this.$contextUploadFile[idUpload] = context;
        return $this.$contextUploadFile[idUpload];
    }

    this.showImageUpload = function(data) {
        var pid = data.id,
            src = url_files+data.src_r;
        if ($this.$contextUploadFile[data.id_upload] && pid) {
            var context = $this.$contextUploadFile[data.id_upload],
                private = context.parent('ul').data('listPrivate');
            $.post(activePage,{cmd:'publish_one_photo',photo_id:pid,ajax:1},
                function(res){
                    var data=checkDataAjax(res);
                    if (data){
                        var approve='';
                        if (data != 'Y') {
                            approve=$this.approvePhotoCode
                        }
                        $this.setCachePhoto(pid,private,0);
                        $('<img src="'+src+'"/>').load(function() {
                            var img=$('<a id="photo_'+pid+'" title="" onclick="photos.editPhotoInfo($(this),\''+pid+'\'); return false;" href="">'+
                                          approve +
                                          '<img class="photo_item" src="'+src+'" alt="" />'+
                                      '</a>').css({opacity:0});
                            context.find('.photo_loader').fadeTo($this.durUpload,0,function(){
                                                $(this).remove();
                                                context.find('.photo_upload_box').html(img.fadeTo($this.durUpload,1))
                            });

                            if($this.isReplacePhotoMenu){
                                $this.replacePhotoMenu(data.src_r);
                                $this.isReplacePhotoMenu=false;
                            }
                        })

                        delete $this.$contextUploadFile[data.id_upload];
                    } else {
                        data['error']=$this.langParts.server_error;
                        $this.showUploadError(data);
                    }
            });
        }
    }

    this.showVideoUpload = function(data) {
        var data = data[0];
        var pid = data.id,
            src = url_files+data.src_r;
        if ($this.$contextUploadFile[data.id_upload] && pid) {
            var context = $this.$contextUploadFile[data.id_upload],
                private = context.parent('ul').data('listPrivate');
            $.post(activePage,{cmd:'publish_one_video',photo_id:pid,ajax:1},
                function(res){
                    if (checkDataAjax(res)){
                        $this.setCachePhoto(pid,private,0);
                        $('<img src="'+src+'"/>').load(function() {
                            var img=$('<a id="video_'+pid+'" title="" onclick="photos.editPhotoInfo($(this),\''+pid+'\'); return false;" href="">'+
                                          $this.approveVideoCode +
                                          '<img class="photo_item" src="'+src+'" alt="" />'+
                                      '</a>').css({opacity:0});
                            context.find('.photo_loader').fadeTo($this.durUpload,0,function(){
                                                $(this).remove();
                                                context.find('.photo_upload_box').html(img.fadeTo($this.durUpload,1))
                            });

                        })

                        delete $this.$contextUploadFile[data.id_upload];
                    } else {
                        data['error']=$this.langParts.server_error;
                        $this.showUploadError(data);
                    }
            });
        }
    }

    this.hideTipError = function() {
        $('.tooltip.error:visible').stop().fadeTo(100, 0, function(){$(this).remove()});
    }

    this.showUploadError = function(data) {
        if ($this.$contextUploadFile[data.id_upload]) {
            $this.hideTipError();
            var context = $this.$contextUploadFile[data.id_upload];
            context.find('.photo_loader').fadeTo($this.durUpload,0,function(){
                //context.html(data.error);
                $(this).remove();
                context.find('a.photo_upload_a, a.icon_delete')
                        .attr('title', data.error)
                        .removeClass('cancel_upload').addClass('error_upload').end()
                        .find('a.photo_upload_a').addClass('icon_photo_error');
                delete $this.$contextUploadFile[data.id_upload];
            });
        }
    }

    this.replacePhotoMenu = function(src) {
        $this.$menuUserPhoto.attr('src',url_files+src);
    }

    this.hideBoxUpload = function(el) {
        $this.hideTipError();
        var box = el.closest('li.photo_upload'),
            img = box.find('img');
        img.css({height : img.height()+'px'})
        el.fadeTo(100, 0);
        box.animate({width:'0px',opacity:0},$this.durUpload,function(){
            $(this).remove();
        });
    }

    this.versionPhoto=+new Date;

    jQuery.fn.center = function()
    {
        var videoPlayer = this.find('video');

        videoPlayer.css("visibility", "hidden");

        var videoPlayerMaxWidth = 640;
        var videoPlayerMaxHeight = 360;

        var videoProportion = videoPlayerMaxWidth / videoPlayerMaxHeight;

        this.css("position", "absolute");


// detect w > h or w < h
// then resize by correct side

        var w = $(window);

// resize

// new video size limits - 30px borders

        var topSideOffset = 30;
        var leftSideOffset = 30;

        var windowProportion = w.width() / w.height();

        if(videoPlayerMaxHeight > w.height()) {
            videoPlayerMaxHeight = w.height();
            videoPlayerMaxWidth = videoPlayerMaxHeight * videoProportion;
        }
        if(videoPlayerMaxWidth > w.width()) {
            videoPlayerMaxWidth = w.width();
            videoPlayerMaxHeight = videoPlayerMaxWidth / videoProportion;
        }

        // find good size - less then width or height with enough gap for close
        if(w.height() * videoProportion < w.width() - 2 * leftSideOffset) {
            topSideOffset = 0;
            videoPlayerMaxHeight = w.height();
            videoPlayerMaxWidth = videoPlayerMaxHeight * videoProportion;
        } else if(w.width() / videoProportion < w.height() - 2 * topSideOffset) {
            leftSideOffset = 0;
            videoPlayerMaxWidth = w.width();
            videoPlayerMaxHeight = videoPlayerMaxWidth / videoProportion;
        } else {
            // max to borders
            if(windowProportion < 1) {
                videoPlayerMaxHeight = w.height() - 2 * topSideOffset;
                videoPlayerMaxWidth = videoPlayerMaxHeight * videoProportion;
            } else {
                videoPlayerMaxWidth = w.width() - 2 * leftSideOffset;
                videoPlayerMaxHeight = videoPlayerMaxWidth / videoProportion;
            }
        }

        var videoPlayerWidth = videoPlayerMaxWidth;
        var videoPlayerHeight = videoPlayerMaxHeight;

        videoPlayerWidth = videoPlayerMaxWidth;

        var videoPlayerTop = ((w.height() - videoPlayerHeight) / 2) + w.scrollTop();
        var videoPlayerLeft = (w.width() - videoPlayerWidth) / 2;

        var topLeftResize = false;

        if(videoPlayerTop < topSideOffset && videoPlayerLeft < leftSideOffset) {
            //console.log(videoPlayerTop + ':' + videoPlayerLeft + ' | ' + videoPlayerWidth + 'x' + videoPlayerHeight);
            topLeftResize = true;
            if(videoPlayerTop < videoPlayerLeft) {
                var videoPlayerLeftDiff = leftSideOffset - videoPlayerLeft;

                videoPlayerWidth = videoPlayerWidth - videoPlayerLeftDiff * 2;
                videoPlayerHeight = videoPlayerWidth / videoProportion;

                //console.log('Max left > ' + videoPlayerWidth + 'x' + videoPlayerHeight + ' Diff > ' + videoPlayerLeftDiff + ' | Top > ' + videoPlayerTop);

            } else {
                var videoPlayerToptDiff = topSideOffset - videoPlayerTop;

                videoPlayerHeight = videoPlayerHeight - videoPlayerToptDiff * 2;
                videoPlayerWidth = videoPlayerHeight * videoProportion;

                //console.log('Max top > ' + videoPlayerWidth + 'x' + videoPlayerHeight + ' Diff > ' + videoPlayerToptDiff + ' | Left > ' + videoPlayerLeft);
            }
        }

        videoPlayerTop = ((w.height() - videoPlayerHeight) / 2) + w.scrollTop();
        videoPlayerLeft = (w.width() - videoPlayerWidth) / 2;

        videoPlayer.width(videoPlayerWidth);
        videoPlayer.height(videoPlayerHeight);

        this.width(videoPlayerWidth);
        this.height(videoPlayerHeight);

// resize

        this.css("top", videoPlayerTop + "px");
        this.css("left", videoPlayerLeft + "px");

        if(videoPlayerWidth < 1) {
            videoPlayerWidth = 1;
        }
        if(videoPlayerHeight < 1) {
            videoPlayerHeight = 1;
        }

        this.css('width', videoPlayerWidth + 'px');
        this.css('height', videoPlayerHeight + 'px');

        if(topLeftResize) {
            var log = 'New size:' + videoPlayerWidth + 'x' + videoPlayerHeight + ' | Top: ' + videoPlayerTop + ' > Left: ' + videoPlayerLeft + ' | W > ' + w.width() + 'x' + w.height();
            //console.log(log);
            //alert(log);
        }

        videoPlayer.css("visibility", "visible");

        return this;
    }

    this.playVideo = function(pid,video_name)
    {
        var pid = pid || $this.curPid;

            var vid=(pid+'').replace('v_','')
            var url_video=url_files+'video/'+vid+'.mp4';
            $this.$videoPlayer.src=url_video;
            if(typeof $this.$tipPhotoInfoEdit != 'undefined'){
                $this.$tipPhotoInfoEdit.stop().fadeOut(200);
            }
            $this.$tipVideoPlayer.stop().fadeIn(220,function(){
                $this.$shadowEmpty.show();
                $this.$shadowEmpty.css('opacity','1.0');
                $this.$videoPlayer.volume = getVolumeVideoPlayer();
                if ($this.$videoPlayer.paused) {
                    $this.$videoPlayer.play();
                }
                $this.$tipVideoPlayer.center();
            });

            /*
            $this.$tipVideoPlayer.stop().fadeIn(220,function(){
                $this.$shadowEmpty.show();
            });
        */

    }

    this.editPhotoInfo = function(el,pid) {
        $this.hideTipError();
        var pidS=''+pid;
        var isVideo=(pidS.indexOf('v_')>=0);

        if($this.isPhotosDelete[pid])return;
        if(typeof $this.photosInfo[pid]=='undefined'||$.isEmptyObject($this.photosInfo[pid])) return;
        if($('.tip_confirm:visible')[0]) return;
        if($this.$tipPhotoInfoEdit.is(':visible')){
            $this.savePhotoInfo();
            return;
        }
        if(isVideo){
            var vid=(pid+'').replace('v_','')
            var photo=url_files+'video/'+vid+'.jpg',v=$this.versionPhoto;
        } else {
            var photo=url_files+'photo/'+$this.guid+'_'+pid+'_r.jpg',v=$this.versionPhoto;
        }
        if($this.photoRotateInit[pid]&&$this.photoRotateInit[pid]['rotate']){
            v=+new Date;
        }
        photo=photo+'?v='+v;
        $this.$tipPhotoInfoEdit.find('img').attr('src',photo);
        if($this.photosInfo[pid]['default']||$this.photosInfo[pid]['private']||$this.photosInfo[pid]['approve']){
            $this.$tipPhotoInfoEdit.find('a.icon_profile').hide()
        }else{$this.$tipPhotoInfoEdit.find('a.icon_profile').show()}

        var $photoStatus=$this.$tipPhotoInfoEdit.find('a.photo_status');
        if ($this.photosInfo[pid]['default']) {
            $photoStatus.hide();
        }else{
            if($this.photosInfo[pid]['private']){
                $photoStatus.show().removeClass('icon_block').addClass('icon_unblock');
            }else{
                $photoStatus.show().removeClass('icon_unblock').addClass('icon_block');
            }
        }
        if(isVideo){
            $this.$tipPhotoInfoEdit.find('a.icon_profile').hide();
            $this.$tipPhotoInfoEdit.find('a.icon_rotate').hide();
            $this.$tipPhotoInfoEdit.find('a.icon_block').hide();
            $this.$tipPhotoInfoEdit.find('a.icon_play').show();
        } else {
            $this.$tipPhotoInfoEdit.find('a.icon_play').hide();
            $this.$tipPhotoInfoEdit.find('a.icon_rotate').show();
        }

        $this.$tipPhotoInfoEdit.find('textarea').val(el[0].title);
        $this.$tipPhotoInfoEdit.stop().fadeIn(220,function(){
            $this.$shadowEmpty.show();
        });
        $this.curPid=pid;
        $this.$ofBox=el;
    }

    this.savePhotoInfo = function(el) {

        var pid=$this.curPid;
        var isVideo=(pid.indexOf('v_')>=0);
        if(isVideo){
            var pref='video';
        } else {
            var pref='photo';
        }
        var curDesc=$('#'+pref+'_'+pid).attr('title'),
            desc=$.trim($this.$tipPhotoInfoEdit.find('textarea').val()),
            ind=+new Date;
        if(curDesc==desc){
            $this.$tipPhotoInfoEdit.stop().fadeOut(200);
            $this.$shadowEmpty.hide();
            $this.$shadowEmpty.css('opacity','0.0');

            return;
        }
        $this.$tipPhotoEditBtnAction.after(getLoaderCl(ind,'loader_photo_save'));
        $.post(url_page,{cmd:'set_photo_description',ajax:1,pid:pid,desc:desc},
            function(res){
                hideLoaderCl(ind);
                if (checkDataAjax(res)){
                    $('#'+pref+'_'+pid).attr('title',desc);
                    $this.$tipPhotoInfoEdit.stop().fadeOut(200,function(){
                        var mess='';
                        if($this.photosInfo[pid]['is_video']){
                            mess=$this.langParts.description_video_saved;
                        } else {
                            mess=$this.langParts.description_photo_saved;
                        }
                        showAlert($this.langParts['description_'+pref+'_saved'],'#st-container','blue');
                    })
                }else{
                    $this.photoActionServerError();
                }
        });
    }

    this.setPhotoDefault = function() {
        var ind=+new Date,pid=$this.curPid;
        $this.$tipPhotoEditLoader.append(getLoaderCl(ind,'loader_photo_action'));
        $.post(url_page,{cmd:'set_photo_default',ajax:1,photo_id:pid},
            function(res){
                hideLoaderCl(ind);
                if (checkDataAjax(res)){
                    $this.photosInfo[pid]['default']=1;
                    for(var id in $this.photosInfo) {
                        if(id!=pid&&$this.photosInfo[id]['default']){
                            $this.photosInfo[id]['default']=0;
                            break;
                        }
                    }
                    $this.$tipPhotoInfoEdit.stop().fadeOut(200,function(){
                        $this.replacePhotoMenu('photo/'+$this.guid+'_'+pid+'_m.jpg');
                        showAlert($this.langParts.set_photo_profile,'#st-container','blue');
                    })
                }else{
                    $this.photoActionServerError();
                }
        });
    }

    this.confirmPhotoDelete = function() {
        $this.$tipPhotoInfoEdit.fadeOut(200,function(){
            //if($this.iAmInspotlight&&$this.photosInfo[$this.curPid]['default']){
                //showAlert($this.langParts.you_can_not_delete_spotlight_photo, '#st-container', 'red', 2000, true)
            //} else {
                showConfirm($this.langParts.really_delete_photo, $this.langParts.delete, $this.langParts.cancel, $this.onePhotoDelete, 'red', '#st-container', $this.photoDeleteCancel);
            //}
        });
    }

    this.photoDeleteCancel = function() {
        hideConfirm();
        $this.$tipPhotoInfoEdit.stop().delay(220).fadeIn(200,function(){
            $this.$shadowEmpty.show();
        });
    }

    this.onePhotoDelete = function() {
        hideConfirm();
        var ind=+new Date,pid=$this.curPid;
        if($this.isPhotosDelete[pid])return;
        $this.isPhotosDelete[pid]=1;

        var pidS=''+pid;
        var isVideo=(pidS.indexOf('v_')>=0);
        if(isVideo){
            var pref='video';
        } else {
            var pref='photo';
        }

        $this.showLoaderBoxToPhoto(pid,ind);
        $.post(url_page,{cmd:'photo_delete',ajax:1,photo_id:pid},
            function(res){
                delete $this.isPhotosDelete[pid];
                var pidDefault=checkDataAjax(res);
                if (pidDefault!==false){
                    delete $this.photosInfo[pid];
                    $this.photosCount--;
                    if(pidDefault && !isVideo){
                        $this.photosInfo[pidDefault]['default']=1;
                        for(var id in $this.photosInfo) {
                            if(id!=pidDefault&&$this.photosInfo[id]['default']){
                                $this.photosInfo[id]['default']=0;
                                break;
                            }
                        }
                    }

                    $this.$tipPhotoInfoEdit.stop().fadeOut(200,function(){
                        $this.$shadowEmpty.hide();
                        $this.$shadowEmpty.css('opacity','0.0');
                        var img=$this.$ofBox.find('img');
                            img.css({height : img.height()+'px'})
                        $this.$ofBox.closest('li').animate({width:'0px',opacity:0},$this.durUpload,function(){
                            $(this).remove();
                        })
                    })
                }else{
                    tools.showServerError();
                    setTimeout(function(){$this.removeLoaderBoxToPhoto(pid,ind)},100);
                }
        });
    }

    this.photoRotateInit = {};
    this.photoRotate = function() {
        $this.$tipPhotoInfoEdit.fadeOut(200,function(){
            $this.$shadowEmpty.hide();
            $this.$shadowEmpty.css('opacity','0.0');
        });
        var pid=$this.curPid;
        if(!$this.photoRotateInit[pid]){
            $this.photoRotateInit[pid]= {angle:0,set:0,rotate:0};
        }else if($this.photoRotateInit[pid]['set']){
            return;
        }
        $this.photoRotateInit[pid]['set']=1;
        var ind=+new Date,$block=$this.showLoaderBoxToPhoto(pid,ind),
            $photo=$block.find('img.photo_item');

        var angle=$this.photoRotateInit[pid]['angle']+90;
        $photo.css({transform:'rotate('+angle+'deg) scale(1.135)'});
        $this.photoRotateInit[pid]['angle']=angle;
        $.post(url_page,{cmd:'photo_rotate',ajax:1,photo_id:pid,angle:90},
            function(res){
                $this.removeLoaderBoxToPhoto(pid,ind);
                if (checkDataAjax(res)){
                    var photo=$this.guid+'_'+pid,
                        v=+new Date; v='?v='+v;
                    /*preloadImageInsertInDom([
                        url_files+'photo/'+photo+'_s.jpg'+v,
                        url_files+'photo/'+photo+'_r.jpg'+v,
                        url_files+'photo/'+photo+'_m.jpg'+v,
                        url_files+'photo/'+photo+'_b.jpg'+v,
                    ]);*/
                    if($this.photosInfo[pid]['default']){
                        $this.replacePhotoMenu('photo/'+photo+'_r.jpg'+v);
                    }
                    if(pid==$this.curPid){
                        $this.$tipPhotoInfoEdit.find('img').attr('src',url_files+'photo/'+photo+'_r.jpg'+v);
                    }
                    $this.photoRotateInit[pid]['rotate']=1;
                }else{
                    var scale='scale(1.135)';
                    angle -=90;
                    $this.photoRotateInit[pid]['angle']=angle;
                    if(!angle)scale='';
                    $photo.css({transform:'rotate('+angle+'deg) '+scale}).addClass('set_rotate');
                    $this.photoActionServerError();
                }
                $this.photoRotateInit[pid]['set']=0;
        })
    }

    this.showLoaderBoxToPhoto = function(pid,ind) {
        return $('#photo_'+pid).css({opacity:'.6', transition:'opacity .6s'})
                               .parent('div').addClass('action_loader')
                               .append(getLoaderCl(ind, 'photo_action')).end();
    }

    this.removeLoaderBoxToPhoto = function(pid,ind) {
        $('#'+ind).remove();
        $('#photo_'+pid).css({opacity:'1', transition:'opacity .6s'});//.parent('div').removeClass('action_loader');
    }

    this.setPhotoStatus = function() {
        if(typeof $this.photosInfo[$this.curPid]=='undefined'||$.isEmptyObject($this.photosInfo[$this.curPid])) return;
        var ind=+new Date,pid=$this.curPid;
        $this.$tipPhotoEditLoader.append(getLoaderCl(ind,'loader_photo_action'));
        $.post(url_page,{cmd:'set_photo_private',ajax:1,photo_id:pid},
            function(res){
                hideLoaderCl(ind);
                var data=checkDataAjax(res);
                if (data){
                    var private=$this.photosInfo[pid]['private'],
                    type=private?'public':'private';
                    $this.$tipPhotoInfoEdit.stop().fadeOut(200,function(){
                        var img=$this.$ofBox.find('img:not(.not_checked_photo)');
                        img.css({height : img.height()+'px'})
                        var li=$this.$ofBox.closest('li').animate({width:'0px',opacity:0},$this.durUpload,function(){
                            if(data.indexOf('photo_approval')!==-1){
                                if (!li.find('.not_checked_photo')[0]) {
                                    li.find('.photo_item').before($this.approvePhotoCode);
                                } else {
                                    li.find('.not_checked_photo').show();
                                }
                                $this.photosInfo[pid]['approve']=1;
                            }

                            var w=$('#photo_add_'+type).width();
                            li.prependTo('#line_photo_'+type).animate({width:w+'px',opacity:1},$this.durUpload,function(){
                                $(this).css({width:''}).find('img').css({height:''});
                                setTimeout(function(){
                                    showAlert($this.langParts['moved_to_'+type],'#st-container','blue');
                                    var scrollEl = $('#head_photo_' + type);
                                    $this.$stContent.animate({scrollTop:scrollEl[0].offsetTop-52},900);
                                },200);
                                $this.photosInfo[pid]['private']=!private*1;
                            })
                        });
                    })
                }else{
                    $this.photoActionServerError();
                }
        });
    }

    this.photoActionServerError = function() {
        $this.$tipPhotoInfoEdit.stop().fadeOut(200,function(){
            tools.showServerError();
        })
    }
    /* Photo upload */
    this.setInfoProfileView = function(uid, photos, guid, fuid, number, number_private, pid, is_blocked_user, is_upload_photo_to_see_photos, photo_rating_enabled) {
        $this.uid = uid;
        $this.photosInfo = photos;
        $this.guid = guid;
        $this.fuid = fuid;
        $this.photosNumber = number*1;
        $this.numberPrivate = number_private*1;
        $this.curPid = pid*1;
        $this.isBlockedUser = is_blocked_user*1;
        cprofile.isBlockedUser = is_blocked_user*1;
        $this.isUploadPhotoToSeePhotos = is_upload_photo_to_see_photos*1;
        $this.photoRatingEnabled = photo_rating_enabled*1;
        //$this.firstPreLoadingPhotos();
        //$this.preparePhotosInfo();
        //$this.initProfileView();
    }

    this.isMutualAttractionEncounter=0;
    this.setMutualAttractionUserEncounter = function(is, from) {
        $this.isMutualAttractionEncounter=is*=1;
        $this.isAttractionFrom=1*!is*from;
    }

    this.setNumberPrivatePhoto = function() {
        if ($this.numberPrivate) {
            var numberPrivate = $this.langParts.number_private_photo.replace(/\{number\}/, $this.numberPrivate);
            $this.$privateBox.find('.count').html(numberPrivate);
        }
    }

    this.setInfoRatePeople = function(uid, guid, src_b, pid, report_user, reports, private, is_blocked_user) {
        $this.uid = uid;
        $this.guid = guid;
        $this.src_b = src_b;
        $this.curPid = pid;
        $this.photosInfo[pid]={};
        $this.photosInfo[pid]['report_user'] = report_user;
        $this.photosInfo[pid]['reports'] = reports;
        $this.photosInfo[pid]['private'] = 'N';
        cprofile.isBlockedUser=is_blocked_user*1;
        $this.isBlockedUser=is_blocked_user*1;
    }

    this.initProfileView = function(){
        $this.$container = $('#profile_view_photo'),
        $this.$image = $('#profile_view_photo > img').on('dragstart',function(){return false}).addClass('ready');
        if ($this.display == 'profile' && $this.photosNumber<2){
            $this.$image.css('cursor','default')
        }
        $this.$position = $('#profile_view_photo_position > span');
        $this.$privateBox = $('#private_photo_box');
        $this.$noPhotoBox = $('#no_photo_box');
        $this.$description = $('#photo_description');
        $this.$average = $('#photo_average');
        $this.$userInfo = $('.user_info');
        $this.$photoInfo = $('.photo_info');
        $this.$spinner = $('.loader_image');
        if (/profile|rate_people|encounters/.test($this.display)) {
            $this.tipReportPhoto=$('#tip_report_action_photo');
            $this.tipReportUser=$('#tip_report_action_user');
            $this.tipReportAction=$('#tip_report_action');
            $this.changeSettings=$('#change_status_user');
            $this.prepareActionReports($this.curPid)
        }
        if ($.support.opacity) $.cssHooks.opacity.set=function(el, o){
            el.style.opacity=(o==1&&el.parentNode==($this.$container[0]||{}).parentNode)?.999:o
        }
   }

    this.isPublic = function(pid){
        //typeof($this.photosInfo[pid])!='undefined';
        return ($this.guid == $this.uid || $this.fuid*1 != 0 || $this.photosInfo[pid]['private'] == 'N')
    }

    this.setPosition = function(offset){
        var position = $this.langParts.position_photo.replace(/\{offset\}/, ($this.photosNumber-offset*1))
                                                     .replace(/\{num\}/, $this.photosNumber);
        $this.$position.text(position).parent('div').delay($this.dur).fadeTo(1,1);
    }


    this.prepareActionReports = function(pid, dur){
        if (!/encounters|rate_people/.test($this.display)) {
            return;
        }
        if ($this.guid==$this.uid) return;
        var info=$this.photosInfo[pid];
        if(info==undefined){
            info={report_user:$this.reportUser, reports:$this.guid};
        }
        $('#tip_report_blocked_user').text(cprofile.langParts['tip_report_block']);
        $this.tipReportUser[(info.report_user*1)?'hide':'show']();
        $this.tipReportPhoto[!in_array($this.guid, info.reports.split(','))&&$this.isPublic(pid)?'show':'hide']()
        $this.changeSettings[$('.item:visible', $this.tipReportAction)[0]?'removeClass':'addClass']('hidden');
    }
    this.show = function(direct, pid){
        if (!$this.photoLoad || !$this.curPid) {
            return false;
        }
        var url, dur = 1, durPhoto = 400, _dir=direct=='left'?'right':'left', isOneFirstLoad=false,
            nextPid = pid||$this.photosInfo[$this.curPid][direct=='left'?'prev_id':'next_id'];
        if (direct==='show'){
            isOneFirstLoad=true;
            direct='';
            _dir='';
        }
        if (!$this.photosInfo[nextPid] || !$this.photosInfo[nextPid].load) return false

        $this.photoLoad = false;
        $this.curPid = nextPid;
        url = url_files + $this.photosInfo[nextPid]['src_bm'];
        $this.$photoInfo.stop().fadeTo(0,0);

        //$this.$container.removeClass(cls).css({transform: 'none', opacity: 1}); //console.log(nextPid)
        var img0=$this.$image.addClass(direct), pr;
        if (!$this.isPublic(nextPid)) $this.photoLoad = pr = true;

        if ($this.display == 'profile' || $this.display == 'encounters') {
            $this.prepareActionReports(nextPid, 0);
            if ($this.display == 'profile') {
                $.post(url_ajax,{cmd:'set_media_views',photo_id:nextPid},
                function(res){})
            }
        }

        var img=$this.$image=$this.photosInfo[nextPid].load.removeClass(direct);
        setTimeout(function(){
            if(isOneFirstLoad)img.fadeTo(0,0);
            img.addClass(_dir).css('display', 'none').prependTo($this.$container).one('load', function(){
                resImg(this);
                img.stop().show().delay(10).removeClass('left right hidden', 0).oneTransEnd(function(){
                    if (img0==$this.$image) return;
                    img.addClass('ready');
                    img0.remove().removeClass(direct);
                    $this.showMutualAttractionEncounters();
                    $this.setPosition($this.photosInfo[nextPid]['offset']);
                    $this.preLoadingPhotos(direct);
                }, 'transform');
                if(isOneFirstLoad){
                    img.delay(100).fadeTo(400,1,function(){
                        img.removeAttr('style')
                    });
                    img0.remove();
                }
                $this.photoLoad = true;
            }); //debugger
            if (pr || img[0].complete) img.load()
        }, 150);
        $this.setPhotoInfo(nextPid);
        return true
    }

    this.showOnlySrc = function(spinner, userInfo, userInterest){
        if ($this.src_b) {
            var url = url_files + $this.src_b, durPhoto=400;
            $this.$image.not('.hidden').addClass('hidden').oneTransEnd(function(){$(this).remove()})
            $this.$image=$('<img class="hidden">').one('load', function(){
                resImg(this);
                $(this).prependTo($this.$container).delay(10).removeClass('hidden', 1);
            }).attr('src', url);
            if ($this.display != 'rate_people') return
            $('#rate_people_list_rate > li').removeClass('selected');
            csearch.isReply=true;
            if (userInfo) $('#rate_people_user_info').html(userInfo.html()).fadeTo(0,1);
            if (userInterest && userInterest[0]) {
                userInterest.find('li').removeAttr('style');
                $('#rate_people_user_interests').html(userInterest.html()).fadeTo(0,1);
            }
            $this.prepareActionReports($this.curPid, 1);
        //Without processing cache
        }
    }

    this.showEncounters = function(pid, userInfo, userInterest, dir){
        console.log('enc')
        if (!$this.curPid) {
            return;
        }
        if ($this.photosInfo[pid]) {
            $this.btnTinder.css({opacity:0});
            var url = url_files + $this.photosInfo[pid]['src_bm'];
            $this.$image=$('<img>').addClass(dir).one('load', function(){
                //$this.$container.removeAttr('style');
                resImg(this);
                $(this).prependTo($this.$container).delay(10).removeClass('right left', 0)
                 .off('transitionend webkitTransitionEnd').oneTransEnd(function(){
                    $this.prepareActionReports(pid, 0);
                    $this.showMutualAttractionEncounters();
                    if (userInfo) {
                        var infoBox=$('#encounters_user_info').html(userInfo.html());
                        $this.$position = infoBox.find('#profile_view_photo_position').fadeTo(0,1).find('span');
                        $this.setPosition($this.photosInfo[pid]['offset']);
                        infoBox.fadeTo(0,1);
                    }
                    if (userInterest && userInterest[0]) {
                        userInterest.find('li').css('opacity', 1);
                        $('#encounters_user_interests').html(userInterest.html()).fadeTo(0,1);
                    }
                });
                csearch.isReply = true;
                $this.photoLoad = true;
                $this.visibleUserInfo = true;
                cprofile.uid=$this.photosInfo[pid]['user_id'];
                //$this.firstPreLoadingPhotos();
            }).attr('src', url);
        }
    }

    this.showMutualAttractionEncounters = function(isM){
        if ($this.isMutualAttractionEncounter||isM) {
            $this.$image.removeClass('right left hidden');
            $('#bl_tinder').addClass('active').stop().css({opacity:1, visibility:'visible'});
        }
    }

    this.setPhotoInfo = function(pid){
        if (!$this.isPublic(pid))return;

        var desc = $this.photosInfo[pid]['description'];
        if ($this.visibleUserInfo&&desc){
            $this.$description.delay($this.dur).fadeTo(1,0, function(){$(this).html(desc)}).fadeTo(1,.999);
        }

        if(!$this.photoRatingEnabled)return;
        if($this.guid==$this.uid&&!$this.photosInfo[pid]['visible_rating'])return;

        var av = $this.photosInfo[pid]['average']*1;
        if ($this.visibleUserInfo&&av){
            var $av=$this.$average.delay($this.dur+300).fadeTo(1, 0, function(){
                $('.vslider_range', this).css('height', av*19);
                $('.count_cont', this).text(av);
            }).fadeTo(1,.999)
        }
    }

    this.sendRequestPrivateAccess = function(){
        if ($this.uid != $this.guid) {
            var ind=+new Date;
            $.ajax({type: 'POST',
                    url: url_main+'tools_ajax.php',
                    data: {cmd:'send_request_private_access',
                           user_to:$this.uid,
                           ajax:1},
                    beforeSend: function(){
                        $('#request_access').hide(1,function(){
                            $this.$privateBox.append(getLoaderCl(ind,'loader_request_private',1));
                        })
                    },
                    success: function(res){
                        var data=checkDataAjax(res);
                        hideLoaderCl(ind);
                        if(data){
                            $('#access_requested').fadeIn(100);
							cprofile.setParamAddFriend('remove',cprofile.langParts['remove_request']);
                        }else{
                            $('#request_access').fadeIn(100);
                            tools.showServerError();
                        }
                    }
            });
        }
    }

    this.redirectAddPhoto = function(){
        if ($this.uid == $this.guid) {
            tools.redirect(url_main+'profile_photo.php');
        }
    }

    this.showNoOneFound = function(){
        $('.no_one_found').css({display:'table'});
    }

    this.preLoadingPhotos = function(direct, n){
        if(!$this.photosNumber || $this.photosNumber<2)return;
        var direct=direct=='left'?'prev_id':'next_id',
            img, pid=$this.curPid,
            info=$this.photosInfo[pid];
        if (!info[direct]) return;
        for(var i=1;i<(n||4);i++) {
            pid=info[direct]; //console.log($this.curPid, pid, direct)
            info=$this.photosInfo[pid]
            if(info && !$this.photosInfo[pid].load) {
                img=$this.isPublic(pid) ? $('<img src="'+url_files+info.src_bm+'" class="hidden">') : $this.$privateBox;
                info.load=('profile'==$this.display)?img:1
            }
        }
    }
    this.firstPreLoadingPhotos = function(){
        //console.log('firstPreLoadingPhotos');
        $this.preLoadingPhotos('right', 3);
        $this.preLoadingPhotos('left', 3);
    }

    this.checkUploadPhotoToSeePhotos = function() {
        if($this.isUploadPhotoToSeePhotos){
            showConfirm($this.langParts['please_upload_photo_to_see_photos'],
                        ALERT_HTML_OK,
                        ALERT_HTML_CANCEL,
                        function(){tools.redirect('profile_photo.php')}, 'red', '#st-container');
            return true;
        }
        return false;
    }

    $(function(){
        $this.$stContent = $('.st-content').css('transform', '');
        $this.$shadowEmpty = $('#page_shadow_empty');
        var tind=$this.btnTinder=$('.bl_tinder_btn');
        $this.btnTinderLeft=$('#bl_tinder_btn_left');
        $this.btnTinderRight=$('#bl_tinder_btn_right');

        if (activePage == 'profile_view.php'|| activePage == 'search_results.php') {
            $this.initProfileView();
            var wndW, dW=100, durationEvent = 0, rotate = 0, abs=0, _abs=0, rateClass = $this.display == 'rate_people' ? 'rate' : '',
                swipeCancel, el, _swipe, $loader=$this.$loader=$('.loader', $this.$container),
                $cont=$this.$cont=$('<div class="bl_img trans '+rateClass+'"/>').insertBefore($this.$container),
                $notSwipe=$('<div class="not_swipe"/>').insertAfter($this.$container)
                $main=$('.st-content .main');

            $win.resize(function(){
                wndW=$win.width();
                dW = Math.min(wndW/3, 150);
                resImg($this.$image[0])
            }).resize();

            if ($this.display == 'rate_people') {
                $this.showOnlySrc();
            } else {
                if (!$this.photosNumber) {
                    if($this.uid==$this.guid){
                        $this.$noPhotoBox.fadeIn(1);
                    }else{
                        $this.$image[0].src=$this.photoDefault;
                    }
                } else $win.load($this.firstPreLoadingPhotos)
            }

            var swipeCallback = function(e, direct) {
                if ($this.display=='encounters' && direct) return csearch.likeToMeet(direct=='left'?'N':'Y');
                if (!$this.photoLoad || !$this.curPid || $this.display == 'rate_people') return;
                if ($this.photosNumber<2) return;
                if (direct) {
                    if ($('.tip_alert:visible')[0])return;
                    if ($this.uid != $this.guid && $this.isBlockedUser && activePage == 'profile_view.php') return;
                    if (!$this.show(direct)) $cont.removeClass('left right')
                    else $loader.stop().delay(200).removeClass('hidden', 0)
                } else {
                    if ($(e.target).filter('#request_access a').click()[0]) return;
                    if (!$this.photoLoad || !$this.curPid) return;
                    if ($this.uid != $this.guid) {
                        if ($('.tip_alert:visible')[0])return;
                        if ($this.isBlockedUser && activePage == 'profile_view.php') return;

                        $this.visibleUserInfo=!$this.$userInfo.toggleClass('hidden').is('.hidden')
                        if (activePage == 'profile_view.php') {
                            if($this.visibleUserInfo){
                                $this.setPhotoInfo($this.curPid);
                            }else{
                                $this.$photoInfo.fadeTo(0,0);
                            }
                        }
                    }
                }
            };

            $this.clickTinderBtn=false;
            if (/encounters|rate_people/.test($this.display)) {
                $this.clickTinderBtn=false;
                $('.bl_tinder_yes_no > a, #encounters_user_interests, a.btn_like').mouseenter(function(){
                    $this.clickTinderBtn=true;
                    $this.$container.mouseup();
                }).mouseleave(function(){
                    $this.clickTinderBtn=false;
                })
                if (!(cprofile.uid=$this.uid)) {
                    photos.$image.remove();
                    $('.no_one_found').removeClass('hidden')
                }
                $this.prepareActionReports($this.curPid, 300);
                $this.showMutualAttractionEncounters();
                var $blTinderInfo,
                    imgW,dEnd,st,deg,o,s,sign;
            }

            $win.on('touchend mouseup pointerup', function(e){
                $this.$container.triggerHandler(e.type)
            }).one('mousemove', function(e){if (!$(e.target).is(':active')) $notSwipe.hide()})
            if (/profile|encounters/.test($this.display)) window.$main=$main.css({overflow: 'hidden', position: 'absolute'}).swipe({
                swipeStatus:function(e,ph,dir,d,duration, c, f) { //console.log(ph, e.target.tagName)
					if (ph=='start') {
                        e.preventDefault();
                        _swipe=$this.isSwipe=true;
                        $blTinderInfo=$('#bl_tinder');
                        $blTinderInfo.filter('.active:visible').delay(100).fadeTo(0,0)
                        el=$this.$image.not('.hidden, .left, .right')
                        if (el.closest($this.$container)[0]) {
                            setTimeout(function(){if (el) el.appendTo($cont.removeAttr('style'))}, 10);
                            $cont.off(transEvent).css({transition: '0s', transform: 'none', opacity:1}).removeClass('left right anim');
                        }
                        $loader.addClass('hidden')
                        return;
                    }
                    if (ph=='move'&&_swipe) { _swipe--;
                        if ($this.display=='encounters'&&($this.isMutualAttractionEncounter||!$this.photoLoad||!csearch.isReply)) return false;
                        if ($this.display == 'profile'&&($this.photosNumber<2||cprofile.isBlockedUser)) return false;
                        if (!el[0] || e.target==$notSwipe[0] && dir!='left' && !/mouse/.test(e.type)) return false;
                    }
                    if (/end|move/.test(ph)) {
                        if($this.checkUploadPhotoToSeePhotos() || $('.st-menu-open')[0]) return false;
                        durationEvent = duration;
                        var ds=f[0].end.x-f[0].start.x,
                            dr=ds>0?'right':'left',
                           _dr=ds<0?'right':'left';
                        if (ph=='move') _abs=abs;
                        abs=Math.abs(ds);
                        /* Fix IPhone*/
                        if(f[0].end.x==f[0].start.x && d){
                            abs=d;
                            dr=dir;
                            _dr=dir=='left'?'right':'left';
                            ds=dir=='left'?-1:1;
                        }
                        /* Fix IPhone*/
                        if (el && abs>1) $cont.not('.anim').removeClass(_dr).addClass(dr+' anim');//[0]&&console.log(abs);
                        if (el && abs>dW*.1) $cont.not('.'+dr).removeClass(_dr).addClass(dr);
                        if (el && abs<dW*.1 && _abs>abs) {$cont.removeClass(dr); tind.fadeTo(0,0)};
                        if (el && $this.display=='encounters' && $cont.is('.'+dr) && !csearch.likeToMeetData){
                            tind[0].style.opacity=(ds<0)*1;
                            tind[1].style.opacity=(ds>0)*1;
                        }
                        if (abs>dW && el) {
                            swipeCallback(e, dr);
                            $this.isSwipe=el=abs=_abs=0;
                            return false;
                        }
                    }
                    if (/end|cancel/.test(ph)) {
                        if ((abs>dW*.4 || _abs<abs) && el && $cont.hasClass(dr) && ph=='end') {
                            if (el) swipeCallback(e, dr);
                        } else {
                            $blTinderInfo.filter('.active').stop().fadeTo(0,1);
                            if (el) {$cont.removeClass('left right anim'); tind.fadeTo(0,0)}
                        }
                        $this.isSwipe=el=abs=_abs=0;
                        if (ph=='end' && d<2 && !$cont.is('.anim')) swipeCallback(e);
                    }
                }, threshold:0,
                excludedElements: 'a, :input, .noSwipe, #tip_report'
            });
            $this.$tipVideoPlayer = $('#tip_video_player').appendTo('#st-container');
            $this.$videoPlayer = document.getElementById("video_player");
            if($this.$videoPlayer){
                $this.$videoPlayer.onvolumechange = function() {
                    if($this.$videoPlayer.muted){
                        $this.$videoPlayer.volume = 0;
                    }
                    setCookie('videojs_volume',$this.$videoPlayer.volume);
                };
            }
            $this.$shadowEmpty.on('click touchstart',function(){
                if($('.tip_confirm:visible')[0]) return;
                if($this.$tipVideoPlayer.is(':visible')){
                    if (!$this.$videoPlayer.paused) {
                        $this.$videoPlayer.pause();
                    }

                    $this.$tipVideoPlayer.stop().fadeOut(200,function(){
                        $this.$shadowEmpty.hide();
                        $this.$shadowEmpty.css('opacity','0.0');
                    });
                }else{hideAlert()}
            });
            $(window).resize(function(){
                if($this.$tipVideoPlayer.is(':visible')){
                    $this.$tipVideoPlayer.center();
                }
            });

        } else if (activePage == 'profile_photo.php') {
            $this.$menuUserPhoto = $('#menu_user_photo_profile');
            $this.isReplacePhotoMenu=~$this.$menuUserPhoto.attr('src').indexOf("nophoto")<0;

            $this.$uploadContent = $('#profile_photo_upload_content');
            $this.$tipPhotoInfoEdit = $('#tip_photo_info_edit').appendTo('#st-container');
            $this.$tipPhotoEditBtnAction = $('#tip_photo_info_edit_action');
            $this.$tipPhotoEditBtnSave = $('#tip_photo_info_edit_save');
            $this.$tipPhotoEditLoader = $('#tip_photo_info_edit_loader');
            $this.$tipVideoPlayer = $('#tip_video_player').appendTo('#st-container');
            $this.$videoPlayer = document.getElementById("video_player");
            $this.$videoPlayer.onvolumechange = function() {
                    if($this.$videoPlayer.muted){
                        $this.$videoPlayer.volume = 0;
                    }

                setCookie('videojs_volume',$this.$videoPlayer.volume);
            };

            $this.$shadowEmpty.on('click touchstart',function(){
                if($('.tip_confirm:visible')[0]) return;
                if($this.$tipPhotoInfoEdit.is(':visible')){
                    $this.$tipPhotoInfoEdit.stop().fadeOut(200,function(){
                        $this.$shadowEmpty.hide();
                        $this.$shadowEmpty.css('opacity','0.0');
                    });
                }else if($this.$tipVideoPlayer.is(':visible')){
                    if (!$this.$videoPlayer.paused) {
                        $this.$videoPlayer.pause();
                    }

                    $this.$tipVideoPlayer.stop().fadeOut(200,function(){
                        $this.$shadowEmpty.hide();
                        $this.$shadowEmpty.css('opacity','0.0');
                    });
                }else{hideAlert()}
            })

            $('body').on('click', '.error_upload, .cancel_upload, .tooltip', function(e){
                var el=$(this)

                if(el.is('.tooltip')){
                    var id = this.id.replace(/tip_/, '');
                    $('#' + id).click();
                    return false;
                }

                if(el.is('.error_upload')){
                    var el = $(this),
                        id = this.id;
                    if (el.is('.icon_delete')) {
                        id = el.data('id');
                        el = $(this).prev('a.photo_upload_a').click();
                    }
                    if ($('#tip_' + id + ':visible')[0]) {
                        $('#tip_' + id).stop().fadeTo(200, 0, function(){
                            $this.hideBoxUpload(el);
                        });
                    } else {
                        var w = el.width();
                        var html = '<div id="tip_' + id + '" class="tooltip error">'+
                                   '<div class="icon"></div></div>';
                        var tip=$(html).hide().css('max-width', (w-12)+'px');

                        tip.find('.icon').html(this.title);
                        tip.appendTo('.st-content').stop().fadeTo(200,1);
                        var h = tip.height()+33;
                        tip.position({ my: 'center top', at: 'center center-'+h, of: '#'+id});
                    }
                    return false;
                }

                if(el.is('.cancel_upload')){
                    var idUpload = this.id;
                    delete $this.$contextUploadFile[idUpload];
                    $this.hideBoxUpload($(this));
                    return false;
                }
            });

            $('input.file',$this.$uploadContent).click(function(){
                var el=$(this),link=el.closest('.fl_right').find('.link_add');
                link.addClass('active');
                setTimeout(function(){
                    link.switchClass('active','',600,'linear');
                },300)
                el.next('input[type=reset]').click();
                $this.hideTipError();
            });

            $('form.add_photo, form.add_photo_bind').submit(function(e){
                var frm = $(this),
                    file = frm.find('input[type=file]'),
                    fileName = file.attr('name'),
                    idUpload = frm.data('idUpload'),
                    isVideo = frm.data('is_video')||0,
                    url = this.action + '&cmd=insert&ajax=1&pending=P&size=' + (isVideo ? '' : 'mm') + '&' +
                                        'file=' + fileName + '&id_upload=' + idUpload + '&is_video=' + isVideo;
                var formData = new FormData(),
                    errors = {};
                    errors.id_upload = idUpload;
                    errors.error = '';
                $.each(file[0].files, function(i, file){
                    var acceptTypes='image/jpeg,image/png,image/gif';
                    /*
                    if(isVideo){
                        acceptTypes='video/mp4,video/avi,video/mpeg,video/3gpp,video/x-flv';
                    }
                    */
                    var patt = new RegExp(/^video\/.*$/),
                        tpp = file.type,
                        maxSize = isVideo ? $this.maxVideoSize : $this.maxFileSize;
                    if(isVideo && !patt.test(tpp)){
                        errors.error = $this.langParts.acceptFileTypes;
                        return false;
                    }else if (!isVideo && acceptTypes.indexOf(file.type) === -1) {
                        errors.error = $this.langParts.acceptFileTypes;
                        return false;
                    }else if (file.size > maxSize) {
                        errors.error = $this.langParts['maxFileSize_' + (isVideo ? 'video' : 'photo')];
                        return false;
                    }
                    formData.append(fileName, file);
                });
                if (errors.error) {
                    $this.showUploadError(errors);
                    return false;
                }

                $this.photosCount++;
                var xhr = new XMLHttpRequest();
                xhr.open("POST", url);
                xhr.onreadystatechange = function() {
                    if (xhr.readyState == 4) {
                        if(xhr.status == 200) {
                            var data = xhr.responseText;
                            data = checkDataAjax(data);
                            if (data) {
                                if (data.error) {
                                    $this.showUploadError(data);
                                    $this.photosCount--;
                                } else {
                                    if(isVideo){
                                        $this.showVideoUpload(data);
                                    } else {
                                        $this.showImageUpload(data);
                                    }
                                }
                            }else{
                                $this.photosCount--;
                            }
                        }
                    }
                };
                xhr.send(formData);

                return false;

                /*
                this.action = url;
                $(this).ajaxSubmit({success: function(res) {
                    var data = checkDataAjax(res);
                    if (data) {
                        $this.showImageUpload(data);
                    }
                }})

                var formData = new FormData();
                $.each($('#file_public_add')[0].files, function(i, file){
                    formData.append('file_add_public', file);
                });
                $.ajax({url: url,
                        type: 'POST',
                        contentType: false,
                        processData: false,
                        cache: false,
                        headers: { 'cache-control': 'no-cache' }, // fix for IOS6 (not tested)
                        //dataType: 'json',
                        data: formData,
                        timeout: 7000,
                        beforeSend: function(){
                        },
                        success: function(res){
                            var data = checkDataAjax(res);
                            if (data) {
                                $this.showImageUpload(data);
                            }
                        },
                        error: function(res){
                        },
                        complete: function(res){
                        }
                });

                return false;*/
            });

            $(window).resize(function(){
                if($this.$tipVideoPlayer.is(':visible')){
                    $this.$tipVideoPlayer.center();
                }
            });

        }
    })
    return this;
}
