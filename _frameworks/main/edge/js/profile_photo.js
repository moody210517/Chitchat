var CProfilePhoto = function(guid,uid) {

    var $this=this;
    this.guid=guid*1;
    this.uid=uid*1;
    this.dur=500;

    this.uploadFileData = {public:{},private:{},video:{},photo:{}};

    this.setData = function(data){
        for (var key in data) {
           $this[key] = data[key];
           //console.log(key, data[key]);
        }
    }

    this.clearUploadFileData = function(type){
        for(var id in $this.uploadFileData[type]) {
            delete $this.uploadFileData[type][id];
        }
    }

    this.visDropZone = function(show, type, call){
        show=show||'show';
        if(show=='show'){
            setPushStateHistory('upload_file');
        }
        $this.$ppUpload[type]['pp']
        .one('hide.bs.modal',function(){
            $jq('body').removeClass('upload_file_'+type);
        }).one('hidden.bs.modal',function(){
            checkOpenModal();
            if(typeof call=='function')call();
        }).one('show.bs.modal',function(){
            $jq('body').addClass('upload_file_'+type);
        }).modal(show);
    }

    this.closeDropZone = function(type){
        $this.visDropZone('hide', type, function(){$this.removeUploadFile(type)})
    }

    this.closeDropZonePopup = function(type){
        if(!$jq('body').is('.upload_file_'+type))return;
        if(!backStateHistory()){
            $this.closeDropZone(type);
        }
    }



    this.publishFile = function(type) {
        var showError=function(){
            alertServerError(true);
            $this.$ppUpload[type]['btn_cancel'].prop('disabled', false);
            $this.$ppUpload[type]['btn_publish'].prop('disabled', false).removeChildrenLoader();
        }
        $this.$ppUpload[type]['btn_cancel'].prop('disabled', true);
        $this.$ppUpload[type]['btn_publish'].prop('disabled', true).addChildrenLoader();

        var paramType=type,sel='videos';
        if (type == 'photo') {
            paramType='public';
            sel='photos';
        }
        for(var id in $this.uploadFileData[type]) {
            var $desc=$('#dz_item_desc_'+id);
            $this.uploadFileData[type][id]['desc']=$desc[0]?$desc.val():'';
        }

        $.ajax({url:url_ajax,
                type:'POST',
                data:{cmd:'publish_photos_gallery',type:paramType, photos:$this.uploadFileData[type]},
                beforeSend: function(){
                },
                success: function(res){
                    $this.$ppUpload[type]['upload_count']=0;
                    var data=checkDataAjax(res);
                    if (data!==false){
                        $this.clearUploadFileData(type);
                        /*for(var id in $this.uploadFileData[type]) {
                            delete $this.uploadFileData[type][id];
                        }*/
                        //console.log(data);
                        $this.$ppUpload[type]['pp'].one('hidden.bs.modal', function(){
                            $this.$ppUpload[type]['btn_cancel'].prop('disabled', false);
                            $this.$ppUpload[type]['btn_publish'].removeChildrenLoader();
                            $this.removeUploadFile(type);
                        }).modal('hide');

                        if(!clPages.myPageReload(sel)){
                            updateGridPhotoFromPublish();
                            $this.updaterCounterPage(sel,data.data.count_title, data.data.count);
                        }
                        delete data.data;
                    }else{
                        showError()
                    }
                },
                error: function(){
                    showError()
                },
                complete: function(){
                }
        })
    }

    this.enabledPublish = function(type){
        var $pp=$this.$ppUpload[type]['pp'],
            n=$('.'+$this.$ppUpload[type]['sel_item']+'',$pp).not('.dz-error').length,
            nC=$('.'+$this.$ppUpload[type]['sel_item']+'.dz-complete',$pp).not('.dz-error').length;

        $this.$ppUpload[type]['btn_publish'].prop('disabled', (!n || n!=nC));
        $this.$ppUpload[type]['btn_cancel'].text(n>0?l('cancel'):l('close_window'));
    }

    this.removeUploadFile = function(type){
        $this.$ppUpload[type]['dropzone'].removeAllFiles(true);
        $this.clearUploadFileData(type);
        $this.reInitScroll(type, 0);
    }

    this.reInitScroll = function(type, posY){
        posY=defaultFunctionParamValue(posY, 'bottom');
        $this.$ppUpload[type]['pl_scroll'].update(posY);
    }

    this.$ppUpload={public:{},private:{},video:{},photo:{}};

    var show_angle = 0;
    var left_angle = 0;
    var right_angle = 0;
    var photo_lists = [];
    var recure = 0;        

    this.initUploadFile = function(type){
        var sel='pp_'+type+'_upload', selItem=sel+'_item', $pp=$('#'+sel);

        $this.$ppUpload[type]['pp']=$pp;
        //$this.$ppUpload[type]['pp_modal']=$pp.find('.modal-dialog');
        //$this.$ppUpload[type]['w'] = 0;
        $this.$ppUpload[type]['pl_scroll']=$pp.find('.scrollbarY').tinyscrollbar({wheelSpeed:30,thumbSize:45}).data('plugin_tinyscrollbar');

        $this.$ppUpload[type]['upload_count']=0;
        $this.$ppUpload[type]['sel_item']=selItem;

        $this.$ppUpload[type]['btn_cancel']=$('button.btn_close', $pp).click(function(){
            //var $remove=$('[data-dz-remove]',$pp);
            if($this.$ppUpload[type]['upload_count']){
                            
                confirmCustom(l('you_have_already_uploaded_several_'+type+'s'), function(){
                    //$this.removeUploadFile(type);
                    setTimeout(function(){
                        $this.closeDropZonePopup(type);
                        $("#pp_photo_upload").modal("hide");
                    },550)
                })
            }else{
                $this.closeDropZonePopup(type)
            }
        });
        $this.$ppUpload[type]['btn_publish']=$('button.btn_publish', $pp).click(function(){
            $this.publishFile(type);
        });

        
        $this.$ppUpload[type]['btn_left_rotate']=$('.btn_left_rotate', $pp).click(function(){
            //$(".thumb_img").style.transform = 'rotate(90deg)';
            
            left_angle -= 90;
            show_angle -= 90;
            if(photo_lists.length > 0){                                
                recure = 0;                               
                $this.myrotate(photo_lists[recure], left_angle, recure);
            }

        });
        $this.$ppUpload[type]['btn_right_rotate']=$('.btn_right_rotate', $pp).click(function(){
            

            right_angle += 90; 
            show_angle += 90; 
            if(photo_lists.length > 0){
                recure = 0;              
                $this.myrotate(photo_lists[recure], right_angle, recure);
            }            
        });

        $this.$ppUpload[type]['original']=$('#original', $pp).click(function(){
            if(photo_lists.length > 0){
                $this.imgFilter(photo_lists[0], "original", 0);
            }           
        });
        $this.$ppUpload[type]['grey']=$('#grey', $pp).click(function(){            
            if(photo_lists.length > 0){
                $this.imgFilter(photo_lists[0], "grey",0);
            }           
         });
         $this.$ppUpload[type]['blue']=$('#blue', $pp).click(function(){            
            if(photo_lists.length > 0){
                $this.imgFilter(photo_lists[0], "blue" , 0);
            }  
         });
         $this.$ppUpload[type]['red']=$('#red', $pp).click(function(){                    
            if(photo_lists.length > 0){
                $this.imgFilter(photo_lists[0], "red", 0);
            }  
         });
         $this.$ppUpload[type]['yellow']=$('#yellow', $pp).click(function(){            
            if(photo_lists.length > 0){
                $this.imgFilter(photo_lists[0], "yellow", 0);
            }  
         });


        



        var reduceUploadCount = function(){
            if($this.$ppUpload[type]['upload_count']>0)$this.$ppUpload[type]['upload_count']--;
        }
        var showError = function(file,msg){
            if (file.previewElement) {
                var msgError = {
                    max_file_size : $this['max'+type+'FileSizeLimit'],
                    accept_file_types : l('accept_file_types')
                }
                if(file.size > ($this['max'+type+'Size']*1024*1024)){
                    debugLog('Error upload max size',file.size);
                    msg=msgError['max_file_size'];
                }
                if(msg&&msgError[msg])msg=msgError[msg];
                msg=msg||l('photo_file_upload_failed');

                var $preview=$(file.previewElement);
                $preview.find('.dz-error-message > .dz-error-wrap > span').text(msg);
                $preview.addClass('dz-error');
            }
            reduceUploadCount();
        }


        var acceptFileTypes='image/*', paramName='file_photo';
        if (type=='video') {
            acceptFileTypes='video/*';
            paramName='file_video';
        }
        var options={
            dictDefaultMessage: l('drop_files_here_or_click_to_upload'),
            dictFallbackMessage: l('your_browser_does_not_support_dragndrop_file_uploads'),
            dictInvalidFileType: 'accept_file_types',
            dictFileTooBig: 'max_file_size',
            acceptedFiles: acceptFileTypes,
            paramName: paramName,
            maxFilesize: $this['max'+type+'Size'],
            //maxFilesize:20, - how many files are processed by Dropzone(dz-max-files-reached)
            //capture
            parallelUploads:6,
            ignoreHiddenFiles:true,
            timeout:3600000,
            createImageThumbnails:false,
            dictRemoveFileConfirmation:false,
            dictCancelUploadConfirmation:'',
            previewTemplate: '<div class="'+selItem+' dz-preview dz-file-preview">'+
                                '<div class="dz-image">'+
                                    '<img class="thumb_img" data-dz-thumbnail />'+
                                    '<input type="text" class="dz-desc" placeholder="'+l('add_a_title')+'">'+
                                '</div>'+
                                '<div class="dz-progress"><span class="dz-upload" data-dz-uploadprogress></span></div>'+
                                '<div class="dz-converting"><span>'+l('processing')+'</span><i class="fa fa-cog fa-spin"></i></div>'+
                                '<div class="dz-converting-complete"><div class="icon_check"></div></div>'+ //<i class="fa fa-check" aria-hidden="true"></i><span>'+l('uploaded')+'</span>
                                '<div class="dz-error-message"><div class="dz-error-wrap"><span></span></div></div>'+
                                '<div class="dz-cancel"><i data-dz-remove title="'+l('cancel_download')+'" class="fa fa-times" aria-hidden="true"></i></div>'+
                              '</div>'
        }
        $this.$ppUpload[type]['dropzone'] = new Dropzone('#pp_'+type+'_upload_frm',options);
        $this.$ppUpload[type]['dropzone'].on('uploadprogress',function(file,progress){
            if(progress==100){
                var $preview=$(file.previewElement);
                //$preview.find('.dz-converting').append(createLoader('dz-progress-loader'));
                $preview.addClass('dz-progress-full');
            }
        }).on('addedfile',function(file){
            /*var w;
            if ($this.$ppUpload[type]['w']) {
                w=$this.$ppUpload[type]['pp_modal'].css('width', 'auto').width();

                //if (w > $this.$ppUpload[type]['w']) {
                    $this.$ppUpload[type]['pp_modal'].css({width:$this.$ppUpload[type]['w']+'px',transition:'width .4s'});
                    setTimeout(function(){
                        $this.$ppUpload[type]['pp_modal'].css({width:w})
                    },1)
                    $this.$ppUpload[type]['w'] = w;

                //}
            } else {
                w=$this.$ppUpload[type]['pp_modal'].width();
                $this.$ppUpload[type]['w']=w;
                $this.$ppUpload[type]['pp_modal'].width(w);
            }*/
            //debugLog('ADDED file', file);
            $this.enabledPublish(type);
            $this.$ppUpload[type]['upload_count']++;
            $this.reInitScroll(type);
        }).on('removedfile',function(file){
            var id=$(file.previewElement).data('id')
            if(id){
                delete $this.uploadFileData[type][id];
            }
            //debugLog('REMOVE file',file);
            $this.enabledPublish(type);
            reduceUploadCount();
            $this.reInitScroll(type, 'relative');

            for(var i=0;i< photo_lists.length ;i++) {
                if(photo_lists[i] == id)
                    photo_lists.splice(i,1);
            }                        
        }).on('complete',function(file){
            if (file.previewElement && file.status=='success'){
                var $preview=$(file.previewElement);
                try {
                    var res=jQuery.parseJSON(file.xhr.response);
                    if (typeof res=='object') {
                        var src;
                        if (type=='video') {
                            res=res.file_video[0];
                            src=res.src_b;
                        } else {
                            src=res.src_r;
                        }

                        if(res.error){
                            showError(file, res.error);
                            //debugLog('COMPLETE ERROR', res.error);
                            return;
                        }
                        var $img=$preview.find('.dz-image > img').on('load', function(){
                            $preview.addClass('dz-complete-full').data({id:res.id});
                        })[0].src=urlFiles+src;
                        if($img[0].complete)$img.load();
                        $preview.find('.dz-desc')[0].id='dz_item_desc_'+res.id;
                        $this.uploadFileData[type][res.id]={id:res.id,
                                                            desc:''};
                        //$('.dz-caption-text',$preview).data('value')
                        $preview.data('id',res.id);
                        $('.fa-times',$preview).attr('title',l('delete'));
                        //debugLog('COMPLETE UPLOAD FILE', $this.uploadFileData[type][res.id]);


                        var id=$(file.previewElement).data('id');
                        photo_lists.push(id);
                        show_angle = 0;
                        left_angle =0;
                        right_angle = 0;
            
                        
                    } else {
                        //debugLog('COMPLETE ERROR NO OBJECT', file);
                        showError(file)
                    }
                } catch(e){
                    //debugLog('COMPLETE ERROR TRY', e, file);
                    showError(file)
                }
                $this.enabledPublish(type);
            } else {
                showError(file)
                //debugLog('COMPLETE NO PREVIEW', file);
            }
        }).on('error',function(file,errorMessage,xhr){
            if(file.status!='canceled'){
                //debugLog('ERROR', [file, errorMessage, xhr]);
                showError(file,errorMessage)
            }
        })

        var sel='#navbar_menu_'+type+'_add_edge, .menu_'+type+'_add_edge, .'+type+'_upload';
        $this.initClickUploadFile(sel,type);
    }

    this.initClickUploadFile = function(sel,type) {
        $(sel).click(function(e){
            /*var $el=$(e.target);
            if (($el.is('.photo_upload') || $el.closest('.photo_upload')[0]) && $this.guid != $this.uid) {
                return false;
            }*/
            closeAllMenuAndPopup();
            closeNavbarMenuCollapse(function(){
                $this.$ppUpload[type]['upload_count']=0;
                $this.enabledPublish(type);
                $this.visDropZone(false,type);
            })
            return false;
        })
    }

    /* Gallery */
    this.isVideo = function(id) {
		var s=''+id;
		return s.indexOf('v_')!==-1;
	}

    this.getVideoId = function(pid) {
        pid=''+pid;
        return parseInt(pid.replace('v_',''));
    }

    this.prepareId = function(pid) {
        if ($this.ppGalleryIsVideo) {
            pid=$this.getVideoId(pid);
        }
        return pid;
    }

    this.isPublic = function(pid,info){
        info=info||$this.galleryMediaData[pid];
        return (($this.guid==info['user_id']||info['is_friend']||info['private']=='N'))||$this.ppGalleryIsVideo;
    }

    this.prepareLoadParamPhoto = function(pid){
        pid=pid||$this.curPid;
        $this.setLoadParamPhoto(pid);
        $this.preLoadingPhotos('right', pid);
        $this.preLoadingPhotos('left', pid);
    }

    this.setLoadParamPhoto = function(pid){
        var info=$this.galleryMediaData[pid],$content;
        if(info && !info.load) {
            if($this.isPublic(pid,info)){
                $content=$('<img src="'+urlFiles+info['src_bm']+'" class="hidden">');
            }else{
                $content=$('<img src="'+urlFiles+info['src_bm']+'" class="hidden">');
            }
            $this.galleryMediaData[pid].load=$content;
        }
    }

    this.preLoadingPhotos = function(direct, pid, n){
        if($this.countAllMedia<2)return;
        var direct=direct=='left'?'prev_id':'next_id',pid=pid||$this.curPid,
            info=$this.galleryMediaData[pid];
        if (!info[direct]) return;
        for(var i=1;i<(n||4);i++) {
            info=$this.galleryMediaData[pid];
            pid=info[direct];
            $this.setLoadParamPhoto(pid);
        }
    }

    this.galleryMediaData = {};
    this.offsetInfo = {};

    this.setGalleryMediaData = function(data, pageUpdateDate, curPid, stopPreloadPhoto) {
        stopPreloadPhoto = defaultFunctionParamValue(stopPreloadPhoto,$this.stopPreloadPhoto);
        //debugLog('Gallery - setGalleryMediaData', pageUpdateDate);
        if (pageUpdateDate) {

            if ($.isEmptyObject(data)) {
                $this.stopPreloadPhoto = true;
                return;
            }
            //$this.stopPreloadPhoto = true;

            var dataOffset = {}, offsetMax=0, c=0;
            for (var pid in data) {//Dublicate
                if ($this.galleryMediaData[pid]) {
                    var info=data[pid],
                        off=info['offset'],
                        pidNext=info['next_id'],
                        pidPrev=info['prev_id'];
                    data[pidNext]['prev_id'] = pidPrev;
                    data[pidNext]['prev_title'] = data[pidPrev]['description'];
                    data[pidPrev]['next_id'] = pidNext;
                    data[pidPrev]['next_title'] = data[pidNext]['description'];
                    delete data[pid];
                    for (var pid in data) {
                        if (data[pid]['offset'] > off) {
                            data[pid]['offset'] -=1;
                        }
                    }
                }
            }

            if ($.isEmptyObject(data)) {
                $this.stopPreloadPhoto = true;
                return;
            }

            for (var pid in data) {
                var info=data[pid],off=info['offset'];
                dataOffset[off]=info;
                if(info['offset']>offsetMax)offsetMax=off;
                c++;
            }
            //console.log(2222222, dataOffset);

            if (pageUpdateDate == 'right') {
                var curOffset=$this.offsetInfo['first_offset'];
                for (var pid in $this.galleryMediaData) {
                    var off=$this.galleryMediaData[pid]['offset'];
                    if (off >= curOffset) {
                        $this.galleryMediaData[pid]['offset'] += c;
                    }
                }

                for (var pid in data) {
                    data[pid]['offset'] += curOffset+1;
                }

                var id1=$this.offsetInfo['first_id'];
                var id2=$this.offsetInfo['last_id'];

                var id3=dataOffset[0]['photo_id'];
                var id4=dataOffset[offsetMax]['photo_id'];

                $this.offsetInfo['first_id'] = id3;
                $this.offsetInfo['first_offset'] = data[id3]['offset'];
                $this.offsetInfo['max_offset'] += c;

                $this.galleryMediaData[id1]['prev_id'] = id4;
                $this.galleryMediaData[id1]['prev_title'] = data[id4]['description'];

                $this.galleryMediaData[id2]['next_id'] = id3;
                $this.galleryMediaData[id2]['next_title'] = data[id3]['description'];

                data[id3]['prev_id'] = id2;
                data[id3]['prev_title'] = $this.galleryMediaData[id2]['description'];

                data[id4]['next_id'] = id1;
                data[id4]['next_title'] = $this.galleryMediaData[id1]['description'];

            } else {
                var curOffset=$this.offsetInfo['last_offset'];
                /*for (var pid in $this.galleryMediaData) {
                    var off=$this.galleryMediaData[pid]['offset'];
                    if (off >= curOffset) {
                        $this.galleryMediaData[pid]['offset'] += c;
                    }
                }*/

                for (var pid in data) {
                    data[pid]['offset'] += curOffset+1;//+1
                }

                var id1=$this.offsetInfo['first_id'];
                var id2=$this.offsetInfo['last_id'];

                var id3=dataOffset[0]['photo_id'];
                var id4=dataOffset[offsetMax]['photo_id'];

                $this.offsetInfo['last_id'] = id4;
                $this.offsetInfo['last_offset'] = data[id4]['offset'];
                $this.offsetInfo['max_offset'] += c;

                $this.galleryMediaData[id1]['prev_id'] = id4;
                $this.galleryMediaData[id1]['prev_title'] = data[id4]['description'];

                $this.galleryMediaData[id2]['next_id'] = id3;
                $this.galleryMediaData[id2]['next_title'] = data[id3]['description'];

                data[id3]['prev_id'] = id2;
                data[id3]['prev_title'] = $this.galleryMediaData[id2]['description'];

                data[id4]['next_id'] = id1;
                data[id4]['next_title'] = $this.galleryMediaData[id1]['description'];
            }

            for (var pid in data) {
                $this.galleryMediaData[pid] = data[pid];
            }

            $this.prepareLoadParamPhoto(curPid);

            console.log('MEDIA DATA UPDATE',$this.galleryMediaData, $this.offsetInfo);

        } else {
            for (var pid in $this.galleryMediaData) {
                delete $this.galleryMediaData[pid];
            }
            $this.galleryMediaData=data;
            if (!stopPreloadPhoto) {
                $this.updateOffsetMediaData(curPid);
            }
        }
    }

    this.updateOffsetMediaData = function(curPid, noFirstUpdate, noLastUpdate, data) {
        noFirstUpdate=noFirstUpdate||false;
        noLastUpdate=noLastUpdate||false;
        data=data||$this.galleryMediaData;
        var c=0,offsetMax=0, galleryMediaOffset={};
        for (var pid in data) {
            var info=data[pid],off=info['offset'];
            galleryMediaOffset[off]=info;
            if(info['offset']>offsetMax)offsetMax=off;
            c++;
        }

        var curOffset=data[curPid]['offset'];
        var iF=curOffset-$this.limitLoadMediaData;
        if(iF<0)iF=c-Math.abs(iF);
        var iL=curOffset+$this.limitLoadMediaData;
        if(iL>=c)iL=iL-c;

        if (!noFirstUpdate) {
            $this.offsetInfo['first_id'] = galleryMediaOffset[iF]['photo_id'];
            $this.offsetInfo['first_offset'] = iF;
        }

        if (!noLastUpdate) {
            $this.offsetInfo['last_id'] = galleryMediaOffset[iL]['photo_id'];
            $this.offsetInfo['last_offset'] = iL;
        }

        $this.offsetInfo['max_offset'] = offsetMax;
        console.log('CUR PHOTO', curPid);
        console.log('FIRST PHOTO', iF);
        console.log('LAST PHOTO', iL);
        console.log('OFFSET PHOTO', galleryMediaOffset);
        console.log('OFFSET PHOTO INFO', $this.offsetInfo);

    }

    this.visibleMediaData = {};
    this.setVisibleMediaData = function(pid, data) {
        if (typeof $this.visibleMediaData[pid] == 'undefined') {
            $this.visibleMediaData[pid] = {};
        }
        $this.visibleMediaData[pid] = data;
        photo_lists = [];
    }

    /* Media info */
    this.setDescription = function(desc){
        $this.$el['desc'].attr('title', desc);
        $('span.text_overflow_page',$this.$el['desc']).html(desc);
    }

    this.updatePhotoInfo = function(pid,info){
        info=info||$this.galleryMediaData[pid];
        if(pid!=$this.curPid||!info)return;

        var isMy=$this.guid==info['user_id'],
            desc=info['description'],tags=info['tags_html'],
            space='&nbsp;',
            isPublic=$this.isPublic(pid,info);

        if ($this.$el['directLink'][0]) {
            var isLink=isSiteOptionActive('gallery_show_download_original', 'edge_gallery_settings')
            if (isLink) {
                var srcLink=$this.ppGalleryIsVideo ? info.src_v : info.src_bm;
                $this.$el['directLink'][0].href = urlFiles+srcLink;
            } else {
                $this.$el['directLink'].remove();
            }
        }

        if(isMy){
            if(!desc){
                desc=$this.ppGalleryIsVideo?l('click_here_to_add_a_video_caption'):l('click_here_to_add_a_photo_caption');
            }
            $this.$el['desc'].addClass('my_desc');
        }else{
            if(!isPublic)desc=space;
            $this.$el['desc'].removeClass('my_desc');
        }
        if(isMy){
            if(!tags){
                tags=l('click_to_add_tags');
            }
            $this.$el['tagsLink'].addClass('my_tags').attr('title', l('edit_tags'));
        }else{
            $this.$el['tagsLink'].removeClass('my_tags').attr('title', '');//info['tags_title']
        }

        $this.$el['tagsList'].removeChildrenLoader();
        $this.$el['tagsList'].html(tags);
        $this.$el['tagsBl'][tags?'show':'hide']();

        $this.setDescription(desc);
        if(isMy){
            $this.$el['descWrap'].removeClass('empty');
            $this.cancelEditDesc();
        } else {
            $this.$el['descWrap'][desc?'removeClass':'addClass']('empty');
        }

        $this.$ppGalleryDescPhoto
            .addClass('profile_photo_r_'+info['user_id'])
            .css('background-image', 'url('+urlFiles+info['user_photo_r']+')')[0].href=info['user_url'];
        $this.$ppGalleryDescName.text(info['user_name'])[0].href=info['user_url'];

        var commentsCount=info['comments_count']*1;
        if(commentsCount){
            $this.$el['commentCount'].text(commentsCount)
            $this.$el['commentCountBl'].show();
        }else{
            $this.$el['commentCountBl'].hide();
            $this.$el['commentCount'].text('');
        }

        $this.$ppGalleryDate.text(info['date']);
        $this.$ppGalleryTimeAgo.text(info['time_ago']);

        $this.$el['infoBl'].addClass('to_show');
        $this.$el['metaBl'].addClass('to_show');
    }

    this.showLastFieldComment = function(callCompete,noAnimate,$box,number){
        noAnimate=noAnimate||false;
        $box=$box||$('.bl_comments > .pp_gallery_comment_item', $this.$ppGallery);
        number=number||$this.numberCommentsFrmShow;
        var l=$box.length,
            frmV=$this.$ppGalleryFieldCommentBottom.is(':visible'),
            fn='', n=number, n1=n+1;
        if(l>n && !frmV){
            fn=noAnimate?'show':'slideDown';
        }else if(l<n1 && frmV){
            fn=noAnimate?'hide':'slideUp';
            callCompete=false;
        }
        if(typeof callStep!='function')callStep=function(){};
        if(typeof callCompete!='function')callCompete=function(){};
        if (fn){
            if (noAnimate) {
                $this.$ppGalleryFieldCommentBottom.stop()[fn]();
            } else {
                $this.$ppGalleryFieldCommentBottom.stop()[fn](
                {complete:callCompete, duration:400})
            }
        } else {
            callCompete();
        }
    }

    this.changeLinkHideHeaderPicture = function(hide,$title,pid){
        pid=pid||0;
        if(!$title&&pid){
            var $elList=$('#list_photos_image_menu_hide_header_'+pid);
            if($this.isVideo(pid)){
                $elList=$('#list_videos_image_menu_hide_header_'+pid);
            }
            $this.changeLinkHideHeaderPicture(hide, $elList);
        }
        $title=$title||$this.$el['linkHideHeader'];
        if(!$title[0])return;
        $title.find('.hide_header_picture_title').text(hide?l('picture_add_in_header'):l('picture_remove_from_header'));
        $title.find('.fa').removeClass('fa-plus-square fa-minus-square').addClass(hide?'fa-plus-square':'fa-minus-square');
    }

    this.showConrolsComment = function(pid,info){
        var d=$this.$el['mediaMenuMore'].is('.collapsing')?200:1;
        setTimeout(function(){
            $this.$el['linkSetDefault'].removeChildrenLoader();
        },d)
        var info=info||$this.galleryMediaData[pid];

        removeChildrenLoader($this.$el['linkSetDefault']);
        $this.$el['linkReport'].removeChildrenLoader();
        removeChildrenLoader($this.$el['linkHideHeader']);

        if ($this.guid==info['user_id']) {
            if (info['visible']=='N'||info['visible']=='Nudity') {
                $this.$el['notChecked'].show();
                $this.$el['linkSetDefault'].stop().delay(d).fadeOut(1);
            } else {
                $this.$el['notChecked'].hide();
                if (info['default']=='N' && info['private'] == 'N'){
                    $this.$el['linkSetDefault'].stop().delay(d).fadeIn(1);
                }else{
                    $this.$el['linkSetDefault'].stop().delay(d).fadeOut(1);
                }
            }

            $this.changeLinkHideHeaderPicture(info['hide_header']);

            $this.$el['linkDelete'].show();
            $this.$el['linkEdit'][$this.ppGalleryIsVideo?'hide':'show']();
            $this.$el['linkCrop'][$this.ppGalleryIsVideo?'hide':'show']();
            $this.$el['linkEditVideo'][$this.ppGalleryIsVideo?'show':'hide']();
            $this.$el['linkReport'].hide();
            $this.$el['mediaMenu'].show();
        } else {
            $this.$el['linkSetDefault'].hide();
            $this.$el['linkHideHeader'].hide();
            $this.$el['linkDelete'].hide();
            $this.$el['linkEdit'].hide();
            $this.$el['linkCrop'].hide();
            $this.$el['linkEditVideo'].hide();
            $this.$el['notChecked'].hide();
            if(!in_array($this.guid, info['reports'].split(',')) && $this.isPublic(pid,info)){
                var title=$this.ppGalleryIsVideo ? l('report_video') : l('report_photo');
                $('span', $this.$el['linkReport']).text(title);
                $this.$el['linkReport'].show();
                $this.$el['mediaMenu'].show();
            } else {
                $this.$el['mediaMenu'].hide();
            }
        }
        if($this.isPublic(pid,info)){
            $this.$ppGalleryFieldComment.show();
            $this.$ppGalleryCommentsHidden.hide();
            $this.$ppGalleryComments.show();
        }else{
            $this.$ppGalleryFieldComment.hide();
            $this.$ppGalleryComments.hide().html('');
            $this.$ppGalleryCommentsHidden.show();
        }
        return info;
    }

    this.setArrowsTitle = function(pid){
        if($this.$el['arrows'].is(':hidden'))return;
        var info=$this.galleryMediaData[pid]||false,
            isPublic=$this.isPublic(pid),
            prev=$this.galleryMediaData[info['prev_id']],
            next=$this.galleryMediaData[info['next_id']],
            nextTitle=l('next_photo'),
            prevTitle=l('prev_photo');
        if($this.ppGalleryIsVideo){
            nextTitle=l('next_video');
            prevTitle=l('prev_video');
        }
        $this.$el['arrowsPrev'].attr('title',(isPublic&&prev&&prev['description'])||prevTitle);
        $this.$el['arrowsNext'].attr('title',(isPublic&&next&&next['description'])||nextTitle);
    }

    this.increaseCommentsCounter = function(pid,inc){
        var count=$this.$el['commentCount'].text()*1;
        inc=defaultFunctionParamValue(inc, true);
        if(inc){
            count++;
        }else{
            count--;
        }
        $this.$el['commentCount'].text(count);
        $this.$el['commentCountBl'].show();
        if($this.galleryMediaData[pid])$this.galleryMediaData[pid]['comments_count']=count;
        if($this.visibleMediaData[pid])$this.visibleMediaData[pid]['comments_count']=count;
        if ($this.ppGalleryIsVideo) {
            $('.video_comments_count_'+$this.prepareId(pid)).text(count);
        } else {
            $('.photo_comments_count_'+pid).text(count);
        }
    }
    /* Media info */

    this.countAllMedia = 0;
    this.photoLoad=true;
    this.curPid=0;
    this.updateOnlyData=false;
    this.stopPreloadPhoto=true;
    this.pagePreloadLimit={};
    this.initShowGallery = function(curPid, data,
                                    count, countProfile, countProfileTiltle, photoDefault, noMediaRequested,
                                    stopPreloadPhoto, pagePreloadUpdate, pagePreloadLimit) {

        debugLog('initShowGallery', [data, curPid,
                                     count, countProfile, countProfileTiltle, photoDefault, noMediaRequested,
                                     stopPreloadPhoto, pagePreloadLimit, pagePreloadUpdate]);

        if ($this.ppGalleryIsVideo) {
            pagePreloadUpdate=false;
            stopPreloadPhoto=true;
        } else {
            stopPreloadPhoto *=1;
            $this.pagePreloadLimit=pagePreloadLimit;
            if (!stopPreloadPhoto){
                var limit=pagePreloadLimit;
                if ($.isEmptyObject(limit)) {
                    $this.stopPreloadPhoto=true;
                } else {
                    debugLog('initShowGallery SET LIMIT', limit);
                    if (limit['next'][1] == limit['prev'][0] || limit['next'][0] == limit['prev'][1]) {
                        $this.stopPreloadPhoto=true;
                    }
                }
            }
        }

        $this.setGalleryMediaData(data, pagePreloadUpdate, curPid, stopPreloadPhoto);

        if($this.updateOnlyData || pagePreloadUpdate){
            //debugLog('Gallery Update only DATA');
            return;
        }
        if ($this.ppGalleryIsVideo) {
            $this.stopPreloadPhoto=true;
        } else {
            $this.stopPreloadPhoto=stopPreloadPhoto*1;
        }

        $this.countAllMedia=count*1;
        noMediaRequested=noMediaRequested*1;//no picture

        $this.$ppGalleryPrivateBox = [];

        $this.$el['arrows']         = $('#photo_show_prev, #photo_show_next');
        $this.$el['arrowsPrev']     = $('#photo_show_prev');
        $this.$el['arrowsNext']     = $('#photo_show_next');
        $this.$el['mediaMenu']      = $('#pp_gallery_more_menu');
        $this.$el['mediaMenuMore']  = $('#pp_gallery_more_options');
        $this.$el['linkSetDefault'] = $('#pp_gallery_make_profile_picture');
        $this.$el['linkHideHeader'] = $('#pp_gallery_hide_header_picture');
        $this.$el['linkDelete']     = $('#pp_gallery_delete_picture');
        $this.$el['linkEdit']       = $('#pp_gallery_edit_picture');
        $this.$el['linkCrop']       = $('#pp_gallery_crop_picture');
        $this.$el['linkEditVideo']  = $('#pp_gallery_edit_video');
        $this.$el['linkReport']     = $('#pp_gallery_report');

        $this.$el['notChecked']     = $('#pp_gallery_not_checked');

        /* No media file */
        if (noMediaRequested) {
            debugLog('No media file - DELETED', curPid);
            if ($this.ppGalleryIsVideo) {
                $this.videoFilePlayFailed();
                $this.updatePageData($this.curPid, countProfileTiltle, countProfile, true);
            } else {
                $this.prepareLoadParamPhoto(curPid);
                $this.updatePageData($this.curPid, countProfileTiltle, countProfile);
                setTimeout(function(){
                    $this.show('right', curPid, true);
                    photoDefault && $this.replacePhotoDefault(photoDefault);
                    setTimeout(function(){
                        if($this.countAllMedia>1){
                            $this.$el['arrows'].removeClass('to_hide');
                        } else {
                            $this.$ppGalleryContainer.addClass('one_photo');
                        }
                    },300)
                },100)
            }
            return;
        }

        if ($this.curPid!=curPid) {
            $this.curPid=curPid;
        }
        var pid=$this.curPid;
//return;
        $this.showConrolsComment(pid);
           // console.log($this.galleryMediaData[$this.curPid])
            //$this.curPid=curPid;
        if($this.countAllMedia>1){
            if ($this.ppGalleryIsVideo) {

            } else {
                $this.activateSwipeGallery();
                $this.prepareLoadParamPhoto(pid);
                $this.setArrowsTitle(pid);
                $this.$el['arrows'].removeClass('to_hide');
            }
        }else{
            $this.$ppGalleryContainer.addClass('one_photo');
        }
    }

    this.showCommentId=0;
    this.prevUid=0;
    this.closeCall=false;
    this.curDataOpenGallery={};
    this.openGallery = function(e, pid, video, uid, cid, list) {
        list=list||false;
        cid *=1;
        if (!video) {
           pid *=1;
        }
        if (!pid) {
            return false;
        }
        if (!cid) {
            cid=0;
        } else {
            cid *=1;
        }

        if (e&&($(e.target).closest('.tag')[0] || $(e.target).is('.name'))) {
            return false;
        }
        if (!checkLoginStatus()) {
            return false;
        }

        $this.closeCall=false;

        $this.prevUid=$this.uid;
        uid=uid||0;
        if (uid) {
            $this.uid=uid;
        }

        /* Events */
        $this.showCommentId=cid||0;
        var curDataOpenGallery={pid:pid, video:video, uid:uid};
        if (cid && $this.isShowGallery) {//Events
            if (JSON.stringify(curDataOpenGallery)==JSON.stringify($this.curDataOpenGallery)){
                if($this.showUploadCommentsEnd()){
                    return;
                }
            }
            $this.closeCall=function(){$this.openGallery(e, pid, video, uid, cid)};
            $this.closeGallery();
            return;
        }
        $this.curDataOpenGallery={pid:pid, video:video, uid:uid};
        /* Events */

        $this.closeCall=false;
        $this.$ppGallery.removeClass('first_update').empty().html($this.$ppGalleryClone.html());

        $this.ppGalleryIsVideo=video||false;
        if ($this.ppGalleryIsVideo) {
            $this.$ppGallery.removeClass('pp_photo_gallery');
            $this.$ppGallery.addClass('pp_video_gallery');
        }else{
            $this.$ppGallery.addClass('pp_photo_gallery');
            $this.$ppGallery.removeClass('pp_video_gallery');
        }

        $this.updateOnlyData=false;
        $this.curPid=0;

        var dataMedia = $this.visibleMediaData[pid];

        $this.ajaxLikes = {};
        if(dataMedia==undefined){//Fix - not data from gallery
            setTimeout(function(){$this.showGallery(pid, false, false, true)},100);
            return;


            $this.updateOnlyData=true;
            var cmd=$this.ppGalleryIsVideo?'get_video_comment':'get_photo_comment';
            $.post(url_ajax+'?cmd='+cmd,
               {uid:$this.uid, photo_id:pid, photo_cur_id:pid,
                get_data_edge:1, load_more:0, last_id:0, limit:0},function(res){
                if($this.isShowGallery||$this.curPid||!$this.updateOnlyData)return;
                var data=checkDataAjax(res);
                if(data){
                    var $data=$(data);
                    $data.filter('.init_gallery').appendTo('#update_server');
                    setTimeout(function(){
                        $this.showGallery(pid, $this.galleryMediaData, list);
                        $this.updateOnlyData=false;
                    },100);
                }else{
                    $this.updateOnlyData=false;
                }
            })
        } else {
            setTimeout(function(){$this.showGallery(pid, false, list)},100);
        }
    }

    $this.isShowGallery=false;
    this.noAction = function(pid){
        var is=!$this.isShowGallery;
        if(pid||0){
            is = is || pid!=$this.curPid;
        }
        return is;
    }

    $this.$el={};
    $this.mediaList=false;
    $this.mediaOffset=false;
    this.showGallery = function(pid, dataMedia, list, reloadData){

        reloadData=reloadData||false;

        $this.isShowGallery=true;

        $this.mediaList=false;
        $this.mediaOffset=false;
        if (list) {
            var $itemList=$('.list_photos_image_'+pid);
            if ($itemList[0]) {
                var $list=$itemList.closest('.module_filter_result');
                if ($list[0]) {
                    var offset=$list.find('.item').index($itemList.closest('.item')),
                        page=clPages.page-1;
                    if(page<0) page=0;
                    $this.mediaList=true;
                    $this.mediaOffset=page*9+offset;
                }
            }
       }

        dataMedia = (dataMedia && dataMedia[pid]) || $this.visibleMediaData[pid];

        $this.$el={
            layerBlocked   : $('#pp_gallery_layer_blocked'),
            container      : $('#pp_gallery_photos_img_box').addClass('change_photo'),
            infoBl         : $('#pp_gallery_info'),
            metaBl         : $('#pp_gallery_meta'),
            descWrap       : $('#pp_gallery_desc_wrap'),
            desc           : $('#pp_gallery_desc'),
            descEditBl     : $('#pp_gallery_desc_bl_edit'),
            descEditText   : $('input','#pp_gallery_desc_bl_edit').keydown(function(e){
                                if (e.keyCode==13) {
                                    $this.saveEditDesc();
                                    return false;
                                }
                             }),
            tagsBl         : $('#pp_gallery_tags_bl'),
            tagsLink       : $('.pp_gallery_tags_edit_link', '#pp_gallery_tags_bl'),
            tags           : $('.pp_gallery_tags', '#pp_gallery_tags_bl'),
            tagsList       : $('.pp_gallery_tags_list', '#pp_gallery_tags_bl'),
            tagsEdit       : $('#pp_gallery_tags_edit'),
            tagsEditText   : $('input','#pp_gallery_tags_edit').keydown(function(e){
                                if (e.keyCode==13) {
                                    $this.saveEditTags();
                                    return false;
                                }
                             }),
            commentCountBl : $('#pp_gallery_comments_count_bl'),
            commentCount   : $('#pp_gallery_comments_count'),
            directLink     : $('#pp_gallery_direct_link')
        };
        //$this.$el['commentCount']
        $this.$ppGalleryOverflow       = $('.pp_gallery_overflow',$this.$ppGallery);
        $this.$ppGalleryContainer      = $('#pp_gallery_photos_img_box').addClass('change_photo');
        $this.$ppGalleryOneBl          = $('#pp_gallery_photo_one_bl');
        $this.$ppGalleryOneImg         = $('#pp_gallery_photo_one_img').on('dragstart',function(){return false}).addClass('ready');
        $this.$ppGalleryDescPhoto      = $('#pp_gallery_desc_user_photo');
        $this.$ppGalleryDescName       = $('#pp_gallery_desc_user_name');
        $this.$ppGalleryCommentsBl     = $('#pp_gallery_comments_bl');
        $this.$ppGalleryComments       = $('#pp_gallery_comments');
        $this.$ppGalleryCommentsHidden = $('#pp_gallery_comments_hidden');
        $this.$ppGalleryFieldComment            = $('.pp_gallery_field_comment');
        $this.$ppGalleryFieldCommentInput       = $('textarea', $this.$ppGalleryFieldComment);
        $this.$ppGalleryFieldCommentBottom      = $('.pp_gallery_field_comment_bottom').hide();
        $this.$ppGalleryFieldCommentBottomInput = $('textarea', $this.$ppGalleryFieldCommentBottom);
        $this.$ppGalleryCommentText    = $('.pp_gallery_comment_text').val('').keydown(doOnEnter($this.commentAdd)),
        $this.$ppGalleryTimeAgo        = $('#pp_gallery_time_ago');
        $this.$ppGalleryDate           = $('#pp_gallery_date');

        $this.curPid=pid;

        if ($this.ppGalleryIsVideo) {
            $('#pp_gallery_photo_one_bl').remove();
        }else{
            $('#pp_gallery_video_one_bl').remove();
        }
        if(isMobileSite)$this.resizeImage();

        $this.$ppGalleryLoader=$('.css_loader', $this.$ppGallery);
        $this.$ppGalleryLoaderFrame = [];
        if ($this.showCommentId) {//Events
            $this.$ppGalleryLoaderFrame = $this.$ppGalleryLoader.clone().addClass('frame_loader_gallery').insertAfter($this.$ppGalleryLoader);
            $this.$ppGalleryLoader.hide();
        }

        var fnPrepareGallery=function(){
            if ($this.ppGalleryIsVideo) {
                //stopAllPlayers();
                $this.setVideoPlayer(pid, dataMedia);
            }else{
                $this.$ppGalleryOneImg.load(function(){
                    if($this.noAction())return;
                    $this.$ppGalleryOneImg.removeClass('to_hide');
                    $this.$ppGalleryLoader.addClass('hidden');
                })[0].src = urlFiles+dataMedia.src_bm;
            }
            $this.updatePhotoInfo(pid,dataMedia);
        }

        if ($this.ppGalleryIsVideo) {
            $this.$ppGalleryOneBl = $('#pp_gallery_video_one_bl').addClass('to_show');
        }
        if(reloadData){
            debugLog('Reupload Gallery', pid);
            $this.showUploadComments(pid,1,0,function(){
                setTimeout(function(){
                   dataMedia = $this.galleryMediaData && $this.galleryMediaData[pid];
                   fnPrepareGallery();
                },10)
            })
        } else {
            fnPrepareGallery();
            $this.showUploadComments(pid,1);
        }

        /*var d=isIE?300:1;
        setTimeout(function(){
            $this.$ppGalleryCommentText.autosize({isSetScrollHeight:false,callback:function(){}})
        },d)*/

        setPushStateHistory('gallery');
        $this.$ppGallery.on('hide.bs.modal',function(){
            $this.curDataOpenGallery={};
            $this.showCommentId=0;
            $this.uid=$this.prevUid;
            $this.isShowGallery=false;

            if ($this.ppGalleryIsVideo) {
                //if($this.isVideo&&isPlayerNative){
                    ///setTimeout(function(){$('.bl_video_one_cont', '#pp_gallery_photo_one_cont').find('video, object, script').remove()},120);
                //}
                $this.stopVideoPlayer();
            }
            $jq('html, body').removeClass('overh');
            $this.$ppGallery.oneTransEndM(function(){
                $this.$ppGallery.removeClass('to_show');
                $jq('body').removeClass('gallery_open');
                if(typeof $this.closeCall=='function')$this.closeCall();
                $this.closeCall=false;
            })
        }).one('shown.bs.modal',function(){
        }).one('show.bs.modal',function(){
            $this.$ppGallery.oneTransEndM(function(){
                $this.$ppGalleryCommentText.autosize({isSetScrollHeight:false,callback:function(){}})
            }).addClass('to_show');
            $jq('body').addClass('gallery_open');
            $jq('html, body').addClass('overh');
        }).modal('show');


        /*notLockedUser=notLockedUser||$this.notLockedUser;
        if (!notLockedUser) {
            alertCustom($this.langParts.not_see_this_gallery,true,ALERT_HTML_ALERT);
            return false;
        }*/
        //if ($this.isShowGalleryPhoto || $this.checkUploadPhotoToSeePhotos() || !pid) return false;
    }

    this.closeGalleryPopup = function(){
        if(!$this.isShowGallery)return;
        if(!backStateHistory()){
            $this.closeGallery();
        }
    }

    this.closeGallery = function(){
        $this.$ppGallery.modal('hide');
    }

    this.initInputPostReply = function(cid) {
        if(!cid)return;
        $('textarea','#comment_replies_post_'+cid).autosize({isSetScrollHeight:false,callback:function(){}})
    }

    this.startVideoParams={};
    this.videoPlayer;
    this.videoPlayerNative;
    this.autoPlayVideo='autoplay';
    this.currentFormatVideo='';
    this.stopVideoPlayer = function() {
        /*if(typeof $this.videoPlayer =='object' && typeof $this.videoPlayer.dispose == 'function'){
            $this.videoPlayer.pause();
        }
        if(typeof $this.videoPlayerNative =='object'){
            $this.videoPlayerNative.pause();
        }*/

        var pl;
        for(var k in videoPlayers) {
            pl = videoPlayers[k];
            if (isPlayerNative) {
                if (!pl.paused) pl.pause();
            } else if (typeof pl =='object' && typeof pl.dispose == 'function'){
                if (!pl.paused()) pl.pause();
            }
            delete videoPlayers[k];
        }

        setTimeout(function(){$this.$ppGalleryOneBl.find('video, object, script').remove()},150);
    }

    this.videoFilePlayFailed = function() {
        setTimeout(function(){
            $this.$ppGallery.one('hidden.bs.modal',function(){
                setTimeout(function(){
                    alertCustom(l('video_file_playback_failed'));
                },200)
            }).modal('hide')
            debugLog('Video ERROR');
        },500)
    }

    this.setVideoPlayer = function(pid,dataMedia,direct) {
        if (direct) {
            if(!$this.curPid)return false;
            direct=direct=='left'?'next_id':'prev_id';
            pid=pid||$this.galleryMediaData[$this.curPid][direct];

            dataMedia=$this.galleryMediaData[pid];
            $this.curPid=pid;

            $this.showConrolsComment(pid);
            $this.setArrowsTitle(pid);
            $this.updatePhotoInfo(pid);
            $this.showUploadComments(pid);
        }
        var id=$this.getVideoId(pid),
            params=$this.startVideoParams;

		if (params.id!=id) params={};
        var src=params.poster||(urlFiles+dataMedia['src_src']),
            $media=$this.$ppGalleryOneBl.removeClass('ready'), d=400, loaded=0;

        var debugBuffer=false;
        function initTestBuffered(video){
            if(!debugBuffer)return;
            $('#media_buffer_test').show();
            video.addEventListener('timeupdate', function() {
                var duration=video.duration;
                if(duration>0){
                    $('#video_progress')[0].style.width=((video.currentTime/duration)*100)+"%";
                }
            })
            video.addEventListener('progress', function() {
                var duration=video.duration;
                if(duration>0){
                    for (var i = 0; i < video.buffered.length; i++) {
                        //console.log(video.buffered.start(video.buffered.length - 1 - i), video.currentTime);
                        if (video.buffered.start(video.buffered.length - 1 - i) < video.currentTime) {
                            $('#video_buffer')[0].style.width=(video.buffered.end(video.buffered.length-1-i)/duration)*100+"%";
                            break;
                        }
                    }
                }
            })
        }

		if(isPlayerNative){
            var $videoNative=$('.video_native', $media);
            if(!$videoNative[0]){
                if(mobileAppLoaded) {
                    /*var srcV=dataMedia.src_v,
                        idV=dataMedia.video_id,
                        frmt=/.+\.([^\?#]+)/.exec(srcV)[1],
                        html='<video style="opacity:0;" class="video_native" id="user_video_'+idV+'_gallery" preload="metadata" webkit-playsinline="webkit-playsinline" controls poster="'+urlFiles+dataMedia.src_src+'">'+
                                '<source src="'+urlFiles+srcV+'" type="video/'+frmt+'"/>'+
                             '</video>';
                    $videoNative=$(html).prependTo($media);
                    initNativeVideoPlayer(idV+'_gallery');*/
                    var html=dataMedia['html_code'];
                    html +='<div class="video_native_poster" style="background-image: url(\''+urlFiles+dataMedia.src_src+'\')">'+
                                '<button class="play_button" type="button" aria-live="polite"></button>'+
                           '</div>';
                    $videoNative=$(html);
                    var $mediaV=$videoNative.not('script, .video_native_poster'),
                        autoPlay=$mediaV.attr('autoplay')!==undefined && !$this.showCommentId;

                    $mediaV.addClass('to_hide');
                    $mediaV.attr({muted: true, preload: 'metadata'});//crossorigin:'anonymous', playsinline: true,
                    $mediaV.data('autoplay', autoPlay);
                    $mediaV.removeAttr('autoplay');

                    /*
                    type:"video/mp4; codecs='avc1.42E01E, mp4a.40.2'"
                    <video autobuffer="true"
                           x-webkit-airplay="allow"
                           controlslist="nodownload"
                           controls=""
                           playinfullscreen="false"
                           src="https://video.fiev4-1.fna.fbcdn.net/v/t42.9040-2/43037400_371099033465046_3215103816458305536_n.mp4?_nc_cat=107&amp;efg=eyJ2ZW5jb2RlX3RhZyI6InN2ZV9zZCJ9&amp;_nc_ht=video.fiev4-1.fna&amp;oh=f6e9dd4865c29acc5746f566f28cd004&amp;oe=5C61E04C">
                    </video>*/

                    $('object',$videoNative).remove();
                    initTestBuffered($videoNative[0]);
                    $media.prepend($videoNative);
                    if (detectApiFullScreen()) {
                        changeFullScreen($mediaV[0],function(){
                            if(isFullScreen()){
                                $jq('body').addClass('full-screen-mode-app');
                            } else {
                                $jq('body').removeClass('full-screen-mode-app');
                                if (versionAndroid=='6.0.1') {//Fix for android 6.01
                                    if ($mediaV[0].paused){
                                        $mediaV[0].play();
                                        $mediaV[0].pause();
                                    } else {
                                        $mediaV[0].pause();
                                        $mediaV[0].play();
                                    }
                                }
                            }
                        })
                    }
                } else {
                    $videoNative=$(dataMedia['html_code']);
                    if($this.showCommentId)$videoNative.removeAttr('autoplay');
                    $media.addClass('ready');
                    initTestBuffered($videoNative[0]);
                    $media.prepend($videoNative);
                }
                $this.startVideoParams={};

            }else{//No use EDGE
                $videoNative.stop().fadeTo(d,0,function(){
                    $('>:not(.css_loader)',$media).remove();
                    $(dataMedia['html_code']).fadeTo(0,0).prependTo($media)
                    .delay(100).fadeTo(d,1);
                    $media.addClass('ready');
                    $this.startVideoParams={};
                })
            }
            //$this.applyNativePlayerParams(params);
            loaded=1;
		}else{
            var srcV=params.src||(urlFiles+dataMedia['src_v']),
                frmt=/.+\.([^\?#]+)/.exec(srcV)[1];
			if (!$this.videoPlayer || !$this.videoPlayer.dispose || !$('#video-js', $media)[0]){
                if ($this.videoPlayer && $this.videoPlayer.dispose){
					$this.videoPlayer.dispose();
				}
				loaded=1;
				$media.prepend($this.getVideoCode());

				$this.currentFormatVideo=frmt;
				$this.videoPlayer=videojs('#video-js').volume(getVolumeVideoPlayer())
				.on('fullscreenchange', function() {
					//$this.$ppGallery.toggleClass('full-screen-mode');
				}).on('ended', function() {
                    debugLog('Video ENDED');
                    var th=this;
                    setTimeout(function(){
                        th.load();
                        th.pause();
                    },250)
                }).on("error",function(){

				}).on("volumechange",function(){
					if(this.muted()){
						this.volume(0);
					}
					//setCookie('videojs_volume', $this.videoPlayer.volume());
                    $.cookie('videojs_volume', $this.videoPlayer.volume(), {path:'/'});
				}).on('loadedmetadata', function(){this.controls(true)});
			}
            var $mediaVideo=$('#video-js', $media);
			if($mediaVideo.is('.to_hide')){
                loaded=2;
            } else {
                $mediaVideo.oneTransEnd(function(){
                    if (!$(this).is('.to_hide')) return;
                    loaded=2;
                    $this.videoPlayer.pause();
                    if (img && img[0].complete) {
                        img.load()
                    }
                }).addClass('to_hide');
            }
		}
		//to move in the event -> .on('ready')
        if (!isPlayerNative) {
            var img=$('<img />').on('load',function(){
                if (!loaded) return;
                loaded=0;
                //in the chain of functions does not work in chrome(Mazilu error in the console), each separately connected
                $this.videoPlayer.poster(src).src({type: "video/"+frmt, src:srcV});
                $this.videoPlayer.controls(!$this.autoPlayVideo||params.paused);
                $this.videoPlayer.currentTime(params.currentTime);
                var isAutoPlay = ($this.autoPlayVideo&&params.currentTime!==0||params.currentTime)&&!$this.showCommentId;
                $this.videoPlayer[isAutoPlay?'play':'pause']();
                if (params.currentTime) $this.videoPlayer[(params.paused)?'pause':'play']();
                $mediaVideo.delay(100).removeClass('to_hide',0);
                $media.addClass('ready');
                $this.startVideoParams={};
            }).prop('src',src);
        }

        //$.post(url_ajax+'?cmd=increase_view_count_video',{vid:id,user_id:uid}, checkDataAjax);

        $this.replaceHistory(id);
    }

    this.replaceHistory = function(id,link) {
        try {
            if (!link && id) {
                var link=location.href.split('#');
                link=link[0]+'#site_video:'+id;
            }
            if (link) {
                history.replaceState(history.state, document.title, link);
            }
        } catch(e) {};
    }

    this.getVideoCode = function() {
        return '<video id="video-js" class="video-js vjs-default-skin to_hide" preload="auto" data-setup="{&quot;example_option&quot;:true}" />'
	}

    this.applyNativePlayerParams = function(params) {
        var player=videoPlayers[params.id+'_gallery'];
        if(player){
            $this.videoPlayerNative=player;
            player.currentTime=params.currentTime;
            player[($this.autoPlayVideo&&params.currentTime!==0||params.currentTime)?'play':'pause']();
            if (params.currentTime) player[(params.paused)?'pause':'play']();
        }
    }

    this.scrollTop = function(delay) {
        delay=delay||1;
        var top=$this.$ppGallery[0].scrollTop,t=200;
        if(top>450)t=450;
        $this.$ppGallery.stop().delay(delay).animate({scrollTop:0},t,'easeInOutCubic')
    }

    this.loaderGalleryShow = function(){
        $this.$ppGalleryLoader.stop().delay(200).removeClass('hidden', 0)
    }

    this.loaderGalleryHidden = function(){
        $this.$ppGalleryLoader.stop().addClass('hidden',0);
    }

    this.checkPreloadData = function(curPid, direct){
        //left - next
        //right - prev
        var offset=direct=='left'?'last_offset':'first_offset',
            curOffset=$this.galleryMediaData[curPid]['offset'],
            toOffset=$this.offsetInfo[offset],
            maxOffset=$this.offsetInfo['max_offset'],
            i,noViewed=0,limit=5;

        //debugLog('Gallery checkPreloadData Param', [curOffset, toOffset, direct]);
        if (direct=='left') {
            if (toOffset > curOffset) {
                for(i=curOffset+1; i < toOffset; i++){
                    //debugLog('1Gallery checkPreloadData Last noViewed "i"', i);
                    noViewed++;
                }
            } else {
                for(i=curOffset; i < maxOffset; i++){
                    //debugLog('2Gallery checkPreloadData Last noViewed "i"', i);
                    noViewed++;
                }
                for(i=0; i < toOffset; i++){
                    //debugLog('3Gallery checkPreloadData Last noViewed "i"', i);
                    noViewed++;
                }
            }
        } else {
            if (toOffset > curOffset) {
                var curOffset1=curOffset-1;
                if (curOffset1 > 0) {
                    for(i=curOffset1; i > 0; i--){
                        //debugLog('3Gallery checkPreloadData First noViewed "i"', i);
                        noViewed++;
                    }
                } else if (curOffset1 < 0) {
                    maxOffset--;
                }

                for(i=maxOffset; i >= toOffset; i--){
                    //debugLog('4Gallery checkPreloadData First noViewed "i"', i);
                    noViewed++;
                }
            } else {
                for(i=curOffset-1; i > toOffset; i--){
                    //debugLog('5Gallery checkPreloadData First noViewed "i"', i);
                    noViewed++;
                }
            }
        }
        debugLog('Gallery checkPreloadData', [curPid, noViewed, limit >= noViewed, $this.galleryMediaOffset]);

        return limit >= noViewed;
    }

    this.show = function(direct, pid, arrow){
        if ($this.ppGalleryIsVideo) {
            $this.setVideoPlayer(pid||0, false, direct);
            return;
        }
        if(!$this.photoLoad||!$this.curPid)return false;

        $this.saveEditDesc();
        var paramPid=pid||0,
            curPid=$this.curPid;
        arrow=arrow||false;
        var _dir=direct=='left'?'right':'left',
            nextPid = pid||$this.galleryMediaData[$this.curPid][direct=='left'?'next_id':'prev_id'],
            dir=_dir;


        if(arrow)_dir=direct='';
        //console.log(nextPid,pid,dir,direct=='left'?'next_id':'prev_id',$this.galleryMediaData,$this.galleryMediaData[nextPid].load);
        if(!$this.galleryMediaData[nextPid]||!$this.galleryMediaData[nextPid].load) return false

        $this.photoLoad=false;
        var isPrivatePrevImg=false;
        if(!paramPid)isPrivatePrevImg=!$this.isPublic($this.curPid);
        if( $this.galleryMediaData[$this.curPid])$this.galleryMediaData[$this.curPid]['show'] = 1;
        $this.curPid=nextPid;
        $this.curDataOpenGallery['pid']=$this.curPid;
        //$this.$photoInfo.stop().fadeTo(0,0);

        var img0=[],pr,isPublic=$this.isPublic(nextPid);
        if($this.$ppGalleryOneImg[0]){
            img0=$this.$ppGalleryOneImg.addClass(direct);
        }

        if(!isPublic)$this.photoLoad=pr=true;

        var img=$this.$ppGalleryOneImg=$this.galleryMediaData[nextPid].load.removeClass(direct);

        $this.showConrolsComment(nextPid);
        $this.setArrowsTitle(nextPid);
        $this.updatePhotoInfo(nextPid);
        if(isPublic){
            var pagePreload=false;
            $this.galleryMediaData[nextPid]['show'] = 1;
            //debugLog('Gallery PRELOAD PHOTO STOP', $this.stopPreloadPhoto);
            if (!$this.stopPreloadPhoto && $this.galleryMediaData[curPid]) {
                if ($this.checkPreloadData(curPid, direct)) {
                    pagePreload=direct;
                    console.log('PRELOAD PHOTO DATA', nextPid, curPid, direct);
                }
            }
            if($jq('body').is('.ie11')){
                setTimeout(function(){
                    $this.showUploadComments(nextPid, 0, pagePreload);
                },300)
            } else {
                $this.showUploadComments(nextPid, 0, pagePreload);
            }
        }
        //$jq('.pp_gallery_overflow',$this.$ppGallery).stop().delay(750).animate({scrollTop:0},500,'easeOutCubic');

        /*if($this.display == 'profile' && !isOneLoad && $jq('#main')[0].scrollTop){
            var top=$jq('#main')[0].scrollTop;
            if(top<200)top=200;if(top>450)top=450;
            $jq('#main').stop().delay(750).animate({scrollTop:0},top,'easeOutCubic');
        }*/

        $this.$ppGalleryContainer.addClass('change_photo');
        $this.preLoadingPhotos(dir);

        var oneLoadImage=function(event){
            event=event||'transform';
            if($jq('body').is('.ie11')){
                event='';
            }
            var loadImage=function(event){
                //$this.resImg(img[0]);
                $this.$ppGalleryContainer.removeClass('change_photo');
                //$this.$ppGalleryLoader.stop().addClass('hidden',0);
                img.stop().show().delay(10).removeClass('left right hidden', 0).oneTransEnd(function(){
                    if(img0==$this.$ppGalleryOneImg) return;
                    img.addClass('ready');
                    img0[0]&&img0.remove().removeClass(direct);
                    if(!isPrivatePrevImg&&!isPublic){
                        setTimeout(function(){$this.$ppGalleryOneImg.appendTo($this.$ppGalleryCont.removeAttr('style'))},10);
                        $this.$ppGalleryCont.css({transition: '0s', transform: 'none', opacity:1}).removeClass('left right anim');
                    }
                }, event);
                $this.photoLoad = true;
            }
            img.addClass(_dir).hide().prependTo($this.$ppGalleryContainer).one('load', function(){
                loadImage(event)
            });
            if(pr||img[0].complete)img.load();
        }

        if (arrow) {
            if(img0==$this.$ppGalleryOneImg) return;
            img0.oneTransEnd(function(){
                $this.loaderGalleryShow();
                oneLoadImage('opacity')
            }).addClass('hidden');
            return true;
        }
        $this.loaderGalleryShow();
        setTimeout(function(){oneLoadImage()}, 150);
        return true
    }

    this.activateSwipeGallery = function() {
        var $container=$this.$ppGalleryContainer,
            $cont=$('<div class="bl_img trans"/>').insertBefore($container),
            dW=100,abs=0,_abs=0,el,_swipe, allowPageScroll='vertical',
            preventDefaultEvents=true;

        $this.$ppGalleryCont=$cont;
        if(isIframeDemo)preventDefaultEvents=false;

        $this.$ppGalleryOneBl.css({overflow: 'hidden'}).swipe({
                swipeStatus:function(e,ph,dir,d,duration,c,f) {
					if (ph=='start') {
                        _swipe=$this.isSwipe=true;
                        el=$this.$ppGalleryOneImg.not('.hidden, .left, .right');
                        //console.log(el,el.closest($container)[0]);
                        if (el.closest($container)[0]) {
                            setTimeout(function(){if (el) el.appendTo($cont.removeAttr('style'))}, 10);
                            $cont.off(transEvent).css({transition: '0s', transform: 'none', opacity:1}).removeClass('left right anim');
                        }
                        $this.$ppGalleryOneBl.addClass('moving');
                        //$this.$ppGalleryLoader.addClass('hidden');
                        $this.$ppGalleryContainer.removeClass('change_photo');
                        $this.hideMoreMenu();
                        //if($this.display=='profile'){
                            //$this.toggleMoreMenu(true);
                            //$this.$photoFrmPostCommentText.blur();
                       // }
                        return;
                    }
                    var isAnimPhoto=/left|right/.test(dir);
                    if (ph=='move'&&_swipe) { _swipe--;
                        if ($this.countAllMedia<2) return false;
                        if (!el[0] && dir!='left' && !/mouse/.test(e.type)) return false;
                    }
                    if (/end|move/.test(ph)&&isAnimPhoto) {
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
                        if(el && abs>1)$cont.not('.anim').removeClass(_dr).addClass(dr+' anim');
                        if(el && abs>dW*.1)$cont.not('.'+dr).removeClass(_dr).addClass(dr);
                        if(el && abs<dW*.1 && _abs>abs){
                            $cont.removeClass(dr);
                        };
                        if(abs>dW&&el){
                            $this.swipeCallback(e, dr);
                            $this.isSwipe=el=abs=_abs=0;
                            return false;
                        }
                    }
                    if (/end|cancel/.test(ph)) {
                        if ((abs>dW*.4 || _abs<abs) && el && $cont.hasClass(dr) && ph=='end') {
                            if(el&&isAnimPhoto)$this.swipeCallback(e, dr);
                        } else {
                            if(el){
                                $cont.removeClass('left right anim');
                            }
                        }
                        $this.isSwipe=el=abs=_abs=0;
                        if (ph=='end' && d<2 && !$cont.is('.anim')) $this.swipeCallback(e);
                    }
                }, threshold:0,
                excludedElements: 'button, a, #photo_gallery_set_default, #photo_gallery_report, #request_access, .icon_close',
                allowPageScroll:allowPageScroll,
                preventDefaultEvents:preventDefaultEvents
        })
    }

    this.swipeCallback = function(e, direct) {
        $this.$ppGalleryOneBl.removeClass('moving');
        if(!$this.photoLoad||!$this.curPid||$this.countAllMedia<2)return;
        if (direct) {
            //if ($('.tip_alert:visible')[0])return;
            //if ($this.uid != $this.guid && $this.isBlockedUser && activePage == 'profile_view.php') return;
            if (!$this.show(direct)) $this.$ppGalleryCont.removeClass('left right')
            else{$this.loaderGalleryShow()}
        } else {
            if($(e.target).is('#pp_gallery_photos_img_box')){
                var offset = $this.$ppGalleryContainer.offset(),
                    x=(e.pageX - offset.left),wB=$this.$ppGalleryContainer.width(),
                    xC=wB/2,dir='left';
                if(Math.abs(xC-x)<100 || x > xC){
                    dir='right';
                }
                $this.show(dir)
            }
            //if ($(e.target).filter('#request_access button').click()[0]) return;
        }
    }

    this.commentsRepliesLoadMore = function($el,limit){
        limit=limit||0;
        if($el.is('.disabled')) return;
        $el.addClass('disabled');
        var $icon=$el.find('.icon').addChildrenLoader(),
            cid=$el.data('cid'),
            pid=$this.curPid,
            $listReplies=$('#comments_replies_list_'+cid),
            $loadReplies=$('#comments_replies_load_'+cid),
            $loadRepliesNumber=$loadReplies.find('.comm_to_comm_text_number'),
            lastId=$listReplies.find('.comments_replies_item').first().data('rcid');
        if(!lastId)lastId=0;

        var dataRes={type:$this.getTypeGallery(), load_more:1, last_id:lastId, comment_id:cid, limit:limit};

        var fnLoad=function(){
            debugLog('Gallery commentsRepliesLoadMore', dataRes);
            $.ajax({url:url_ajax+'?cmd=get_comment_replies',
                type: 'POST',
                data: dataRes,
                timeout: globalTimeoutAjax,
                //cache: false,
                success: function(res){
                    if($this.noAction(pid))return;
                    var data=checkDataAjax(res);
                    if(data){
                        var $data=$(data),
                            $comments=$data.find('.comments_replies_item').hide(),
                            $listReplies=$('#comments_replies_list_'+cid);
                        if(!$listReplies[0]||!$comments[0])return;

                        var $numberView=$loadReplies.find('.number_view'),
                            numberStart=$numberView.text()*1,
                            numberAll=$data.find('.number_all').text()*1;

                        if (numberAll) {
                            $loadReplies.find('.number_all').text(numberAll);
                            if (!$loadRepliesNumber.is('.to_show')) {
                                $el.find('.comments_replies_load_title').text(l('view_previous_replies'));
                                $loadRepliesNumber.addClass('to_show');
                            }
                        } else {
                            $this.hideReplyLoad($loadRepliesNumber);
                        }

                        var $comment,i=0,t=300,i=$comments.length-1;
                        (function fu(){
                            $comment=$comments.eq(i).show();
                            if(!$comment[0]||i<0)return;
                            if(!$('#'+$comment[0].id)[0]){
                                if (numberAll) {
                                    numberStart++;
                                    if(numberStart>=numberAll){
                                        $this.hideReplyLoad($loadReplies);
                                        //$loadReplies.find('.comments_replies_load_link').addClass('disabled');
                                        numberStart=numberAll;
                                    }
                                    $numberView.text(numberStart);
                                }
                                clMediaTools.addCommentToBl($comment, cid, 'prependTo', false, '#comments_replies_list_');
                            }
                            i--;fu();
                        })()
                    }else{
                        alertServerError(true)
                    }
                    $icon.removeChildrenLoader();
                    $el.removeClass('disabled');
                },
                error: function(xhr, textStatus, errorThrown){
                    if($this.noAction(pid))return;
                    globalRetryAjaxTimeout(xhr, textStatus, errorThrown, function(){
                        if($this.noAction(pid))return;
                        fnLoad();
                    })
                },
            })
        }
        fnLoad();

        return;
        /*$.post(url_ajax+'?cmd=get_comment_replies&type=' + $this.getTypeGallery(),
              {load_more:1, last_id:lastId, comment_id:cid, limit:limit},
              function(res){
            if($this.noAction(pid))return;
            var data=checkDataAjax(res);
            if(data){

                var $data=$(data),
                    $comments=$data.find('.comments_replies_item').hide(),
                    $listReplies=$('#comments_replies_list_'+cid);
                if(!$listReplies[0]||!$comments[0])return;

                var $numberView=$loadReplies.find('.number_view'),
                    numberStart=$numberView.text()*1,
                    numberAll=$data.find('.number_all').text()*1;

                if (numberAll) {
                    $loadReplies.find('.number_all').text(numberAll);
                    if (!$loadRepliesNumber.is('.to_show')) {
                        $el.find('.comments_replies_load_title').text(l('view_previous_replies'));
                        $loadRepliesNumber.addClass('to_show');
                    }
                } else {
                    $this.hideReplyLoad($loadRepliesNumber);
                }

                var $comment,i=0,t=300,i=$comments.length-1;
                (function fu(){
                            $comment=$comments.eq(i).show();
                            if(!$comment[0]||i<0)return;
                            if(!$('#'+$comment[0].id)[0]){
                                if (numberAll) {
                                    numberStart++;
                                    if(numberStart>=numberAll){
                                        $this.hideReplyLoad($loadReplies);
                                        //$loadReplies.find('.comments_replies_load_link').addClass('disabled');
                                        numberStart=numberAll;
                                    }
                                    $numberView.text(numberStart);
                                }
                                clMediaTools.addCommentToBl($comment, cid, 'prependTo', false, '#comments_replies_list_');
                            }
                            i--;fu();
                })()
            }else{
                alertServerError(true)
            }
            $icon.removeChildrenLoader();
            $el.removeClass('disabled');
        })*/
    }


    this.hideReplyLoad = function($el){
        $el.closest('.comments_reply_load').slideUp($this.dur,function(){
            $(this).removeClass('to_show').removeAttr('style')
        })
    }

    this.loadMoreComments = function(limit, $el){
        limit=limit||0;
        $el=$el||[];
        var $bl=$('#pp_gallery_load_more_comments_bl');
		if(!$bl[0] || $bl.is('.disabled'))return;

        var $firstComment=$this.$ppGalleryComments.find('.pp_gallery_comment_item:first');
        if(!$firstComment[0])return;
        $bl.addClass('disabled');

        var $icon=[];
        if($el[0]){
            $icon=$el.find('.icon').addChildrenLoader();
        }
        var pid=$this.curPid,
            cmd=$this.ppGalleryIsVideo?'get_video_comment':'get_photo_comment',
            uid=$this.uid,
            lastId=$firstComment.data('cid');


        var fnLoad=function(){
            var dataRes={uid:uid, photo_id:pid,
                         load_more:1, last_id:lastId, limit:limit}
            debugLog('Gallery loadMoreComments', dataRes);

            $.ajax({url:url_ajax+'?cmd='+cmd,
                    type:'POST',
                    data:dataRes,
                    timeout: globalTimeoutAjax,
                    //cache: false,
                    success: function(res){
                        if($this.noAction(pid))return;
                        var data=checkDataAjax(res);
                        if(data){
                            var $data=$(data),
                            $comments=$data.find('.item').hide();
                            if($comments[0]){
                                var $numberView=$bl.find('.number_view'),
                                    count=$numberView.text()*1,
                                    countAll=$bl.find('.number_all').text()*1,
                                    $blComments=$this.$ppGalleryComments.find('.bl_comments'),
                                    $comment,i=0;
                                (function fu(){
                                    $comment=$comments.eq(i).show();
                                    if(!$comment[0])return;
                                    if(!$('#'+$comment[0].id)[0]){
                                        if($numberView[0]){
                                            count++;
                                            if (count == countAll) {
                                                $bl.stop().slideUp($this.dur,function(){
                                                    $bl.remove()
                                                })
                                            } else {
                                                $numberView.text(count);
                                            }
                                        }
                                        clMediaTools.addCommentToBl($comment, 0, 'prependTo', $this.showLastFieldComment, '', $blComments);
                                    }
                                    i++;fu();
                                })()
                            }
                        }
                        setTimeout(function(){
                            $icon[0]&&$icon.removeChildrenLoader();
                            $bl.removeClass('disabled');
                        },200)
                    },
                    error: function(xhr, textStatus, errorThrown){
                        if($this.noAction(pid))return;
                        globalRetryAjaxTimeout(xhr, textStatus, errorThrown, function(){
                            if($this.noAction(pid))return;
                            fnLoad()
                        })
                    },
            })
        }
        fnLoad();
    }

    this.showUploadCommentsEnd = function(){
        var sel='#pp_gallery_comment_'+$this.showCommentId,
            $toComment=$(sel),
            $toCommentH=$toComment.find('.comment_text_cont');
        if(!$toComment[0]){
            sel='#comments_replies_item_'+$this.showCommentId;
            $toComment=$(sel);
            $toCommentH=$toComment.find('.comment_text_reply_one');
        }
        clMediaTools.highlightEvent($toCommentH);

        setTimeout(function(){
            //if(!$toComment[0])sel='#pp_gallery_comments_bl';
            $this.scrollToNative($toComment);
            $this.$ppGalleryLoader.show();
        },50)
        return $toComment[0];
    }

    this.showUploadComments = function(pid,isUpdateData,direct,callRes){
        var cmd='get_photo_comment',pidD=pid;
        if ($this.ppGalleryIsVideo) {
            cmd='get_video_comment';
            pid=$this.getVideoId(pid);
        }
        isUpdateData=isUpdateData||0;
        $this.$ppGalleryCommentText.prop('disabled',true);
        $this.$ppGalleryCommentsBl.addClass('to_hidden');

        if (!$this.$ppGallery.is('.first_update')) {
            $('.photo_one_comments').stop().fadeTo(0,0);
        }

        var dataRes={uid:$this.uid, photo_id:pid, photo_cur_id:pid,
                  get_data_edge:isUpdateData, load_more:0, last_id:0, limit:0,
                  offset_media:$this.mediaOffset,
                  show_comment_id: $this.showCommentId};

        direct=direct||0;
        if (direct) {
            isUpdateData=true;
            dataRes['get_data_edge']=1;
            dataRes['page_preload_limit']=$this.pagePreloadLimit;
            dataRes['page_preload_direct']=direct;
            //data['page_preload_count_all']=$this.countAllMedia;
        }

        var fnLoad=function(){
            debugLog('Gallery showUploadComments', dataRes);
            $.ajax({url: url_ajax+'?cmd='+cmd,
                    type: 'POST',
                    data: dataRes,
                    timeout: globalTimeoutAjax,
                    //cache: false,
                    success: function(res){
                        if($this.noAction(pidD))return;
                        var data=checkDataAjax(res);
                        if(data){
                            var $data=$(data);
                            $this.$ppGallery.addClass('first_update');

                            if(isUpdateData){
                                $data.filter('.init_gallery').appendTo('#update_server');
                            }

                            var fn = function(){
                                $this.$ppGalleryComments.html($data.filter('#pp_gallery_comments').html());
                                if(!$this.showCommentId)return;
                                //Events
                                if($this.$ppGalleryLoaderFrame[0]){
                                    $this.$ppGalleryLoaderFrame.oneTransEnd(function(){
                                        $(this).remove();
                                    }).addClass('to_hide');
                                    $this.$ppGalleryLoaderFrame = [];
                                }
                                $this.showUploadCommentsEnd();
                            }
                            if(typeof callRes=='function')callRes();
                            $('.photo_one_comments').delay(50).fadeTo(350,1);
                            fn();
                            $this.showLastFieldComment(false,true);
                        }else{
                            if($this.showCommentId){
                                $this.$ppGalleryLoader.show();
                            };
                            alertServerError(true)
                        }
                        $this.showCommentId=0;
                        $this.$ppGalleryCommentText.prop('disabled',false);
                        $this.$ppGalleryCommentsBl.removeClass('to_hidden');
                    },
                    error: function(xhr, textStatus, errorThrown){
                        if($this.noAction(pidD))return;
                        globalRetryAjaxTimeout(xhr, textStatus, errorThrown, function(){
                            if($this.noAction(pidD))return;
                            fnLoad();
                        })
                    },
            })
        }
        fnLoad();
        $this.mediaOffset = false;
        return;
        /*$.post(url_ajax,data,function(res){
            if($this.noAction(pidD))return;
            var data=checkDataAjax(res);
            if(data){
                var $data=$(data);
                $this.$ppGallery.addClass('first_update');

                if(isUpdateData){
                    $data.filter('.init_gallery').appendTo('#update_server');
                }

                var fn = function(){
                    $this.$ppGalleryComments.html($data.filter('#pp_gallery_comments').html());
                    if(!$this.showCommentId)return;
                    //Events
                    if($this.$ppGalleryLoaderFrame[0]){
                        $this.$ppGalleryLoaderFrame.oneTransEnd(function(){
                            $(this).remove();
                        }).addClass('to_hide');
                        $this.$ppGalleryLoaderFrame = [];
                    }
                    $this.showUploadCommentsEnd();
                }
                $('.photo_one_comments').delay(50).fadeTo(350,1);
                fn();
                $this.showLastFieldComment(false,true);
            }else{
                if($this.showCommentId){
                    $this.$ppGalleryLoader.show();
                };
                alertServerError(true)
            }
            $this.showCommentId=0;
            $this.$ppGalleryCommentText.prop('disabled',false);
            $this.$ppGalleryCommentsBl.removeClass('to_hidden');
        })
        $this.mediaOffset = false*/
    }

    /* -------------------------  */
    this.scrollToNative = function($el,call,t){
        t=defaultFunctionParamValue(t, $this.dur*1.5);
        $this.$ppGalleryOverflow.scrollTo($el, t, {axis:'y', interrupt:true, easing:'easeOutExpo', over_subtract:{top:3}, onAfter:call});
    }

    this.scrollToInto = function($el,t){
        t=defaultFunctionParamValue(t, $this.dur);
        $this.scrollToNative($el,false,t);
        return;
        $this.$ppGalleryOverflow.stop(true,true);
        $el.get(0).scrollIntoView(false);
    }

    this.scrollBottomAnimationFrame = function(){
        globalID = requestAnimationFrame($this.scrollBottomAnimationFrame);
        $this.scrollBottomAnimation();
    }

    this.scrollBottomAnimation = function(){
        var $el=$this.$ppGalleryOverflow;
        $el[0].scrollTop = $el[0].scrollHeight;
    }

    this.scrollBottomNative = function(call){
        $this.$ppGalleryOverflow.scrollTo('max', $this.dur*1.5, {axis:'y', queue:false, easing:'easeInOutCubic', onAfter:call});
    }
    /* -------------------------  */


    this.sel = {
        replies_post : 'comment_replies_post_',
        replies_input : '#comment_replies_input_'
    }

    this.showFrmReply = function(el){
        var $el=$(el);
        clMediaTools.showFrmReplyComment($el, $this.sel.replies_post+$(el).data('cid'), false, true);
    }

    this.hideFrmReply = function(id, call){
        clMediaTools.hideFrmReplyComment($this.sel.replies_post+id, false, true, call)
    }

    this.initFeedCommentReplies = function(id) {
        var $inp=$($this.sel.replies_input+id);
        if(!$inp[0])return;
        $inp.autosize({isSetScrollHeight:true,callback:function(){}}).keydown(doOnEnter($this.commentAdd));
    }

    this.fnBlur = function($inp, $comment, rCid) {
        var d = isMobileSite ? 150 : 1,
            dt = isMobileSite ? evWndResTime : 1;
        setTimeout(function(){
            $inp.blur();
            setTimeout(function(){
                if (rCid) {
                    if (!$this.inViewport($comment[0])) {
                        $this.scrollToNative($comment, false, $this.dur);
                    }
                } else {
                    $this.scrollBottomAnimation();
                }
            },dt)
        },d)
    }

    this.commentAdd = function(inp) {
        var $inp=$(inp);
        if($inp.is('button')){
            $inp=$inp.prev('textarea');
        }

        var comment=trim($inp.val()),
            rCid=$inp.data('cid');

        if(!comment){
            $inp.val('').trigger('autosize').blur();
            if (rCid) {
                $this.hideFrmReply(rCid);
            }
            return false;
        }

        var send = +new Date,
            pid=$this.curPid,
            $comment;
        if (rCid) {
            $comment = $('<div id="comments_replies_item_'+send+'" data-rcid="'+send+'" class="comment_to_comment_container comments_replies_item">'+
                            '<div class="comment_item_wrapper">'+
                            '</div>'+
                         '</div>');
        } else {
            $comment = $('<div id="pp_gallery_comment_'+send+'" data-cid="'+send+'" class="pp_gallery_comment_item item">'+
                            '<div class="comment_item_wrapper">'+
                            '</div>'+
                         '</div>');
        }
        $comment.find('.comment_item_wrapper').append(clMediaTools.prepareComment());

        var fnAdd=function(){
            if (rCid) {
                $this.hideFrmReply(rCid, function(){$this.fnBlur($inp, $comment, rCid)})
            } else {
                $this.showLastFieldComment(function(){
                    //$this.$ppGalleryFieldCommentBottomInput.is(':visible') && $this.$ppGalleryFieldCommentBottomInput.focus();
                    cancelAnimationFrame(globalID);
                    $this.scrollBottomAnimation();
                    $this.fnBlur($inp, $comment, rCid);
                })
            }

            comment=clMediaTools.replaceUserName(comment, $inp.data('name'), $inp.data('uid'));
            comment=emojiToHtml(comment);

            var data={comment:comment,
                      photo_id:pid,
                      photo_user_id:$this.galleryMediaData[pid]['user_id'],
                      reply_id:rCid,
                      private:$this.galleryMediaData[pid]['private']};
            $.post(url_ajax+'?cmd=photo_comment_add',data,
            function(res){
                if ($this.noAction(pid))return;
                data=checkDataAjax(res);
                if (data!==false){
                    var $data=$(trim(data));
                    if (rCid) {
                        $data=$data.find('.comments_replies_item');
                        if(!$data[0]||$('#'+$data[0].id)[0])return;
                        var resCid=$data.data('rcid');
                    } else {
                        $data=$data.filter('.pp_gallery_comment_item');
                        if(!$data[0]||$('#'+$data[0].id)[0])return;
                        var resCid=$data.data('cid');
                    }
                    $comment.data('cid', resCid).attr({'id':$data[0].id, 'data-rcid':resCid});
                    clMediaTools.commentUpdate($comment, $data);
                }else{
                    //$this.commentHide(id, send, true);
                    alertServerError(true)
                }
            })
        }

        $inp.val('').trigger('autosize',function(){
            if (rCid) {
                clMediaTools.addCommentToBl($comment, rCid, false, fnAdd, '#comments_replies_list_');
            } else {
                var fnSend = function(){
                    //$this.$ppGalleryFieldCommentBottomInput.is(':visible') && $this.$ppGalleryFieldCommentBottomInput.focus();
                    $this.scrollBottomAnimationFrame();
                    clMediaTools.addCommentToBlUpdate($comment, 0, 'appendTo', fnAdd, '', $this.$ppGalleryComments.find('.bl_comments'));
                }
                var $last=$('.pp_gallery_comment_item:last',$this.$ppGalleryComments);
                if ($inp[0] == $this.$ppGalleryFieldCommentInput[0] && $last[0] && !$this.inViewport($last[0])) {
                    $this.scrollBottomNative(fnSend)
                } else {
                    fnSend()
                }
            }
        }).focus();

        return false;
	}

    this.updateRepliesCounter = function(cid, countReplies){
        var $el=$('#comments_replies_load_'+cid).find('.comm_to_comm_text_number.to_show');
        if(!$el[0])return;
        var v=$('#comments_replies_list_'+cid).find('.comments_replies_item').length;
        $el.find('.number_view').text(v);
        $el.find('.number_all').text(countReplies);
    }

    this.updatePageCounter = function(count){
        var pid=$this.curPid, $pageConter;
        if($this.ppGalleryIsVideo) {
            $pageConter=$('.video_comments_count_'+$this.prepareId(pid));
        } else {
            $pageConter=$('.photo_comments_count_'+pid);
        }
        if (count>0) {
            $this.$el['commentCount'].text(count);
            $this.$el['commentCountBl'].show();
            $pageConter[0] && $pageConter.text(count).show();
        } else {
            $this.$el['commentCountBl'].hide();
            $pageConter[0] && $pageConter.hide();
        }

        if($this.galleryMediaData[pid])$this.galleryMediaData[pid]['comments_count']=count;
        if($this.visibleMediaData[pid])$this.visibleMediaData[pid]['comments_count']=count;
    }

    /* Photo default */
    this.setPhotoDefault = function(pid,$btn){
        var isGallery=false;
        $btn=$btn||[];
        if(!$btn[0]){
            isGallery=true;
            $btn=$this.$el['linkSetDefault'];
        }
        pid=pid||$this.curPid;

        if($btn.find('.css_loader')[0])return;
        $.ajax({type: 'POST',
                url: url_ajax,
                data: {cmd:'set_photo_default', photo_id: pid},
                beforeSend: function(){
                    addChildrenLoader($btn);
                },
                success: function(res){
                    var is=$this.curPid==pid;
                    if (!isGallery) {
                        is=false;
                    }
                    if (checkDataAjax(res)){
                        $this.replacePhotoDefaultDelay(pid);
                        if(is){
                            $this.$el['mediaMenuMore'].one('hidden.bs.collapse',function(){
                                $btn.hide();
                                removeChildrenLoader($btn);
                            })
                            $this.hideMoreMenu();
                            alertCustom(l('this_photo_has_been_set'),l('alert_success'));
                        }else if (!isGallery) {
                            removeChildrenLoader($btn);
                            alertCustom(l('this_photo_has_been_set'),l('alert_success'));
                        }
                        $('.list_photos_image_menu_profile_pic.to_hide').removeClass('to_hide');
                        $('#list_photos_image_menu_profile_pic_'+pid).addClass('to_hide');
                    }else if(is||!isGallery){
                        removeChildrenLoader($btn);
                        $this.hideMoreMenu();
                    }
                }
        })
        return;
    }

    this.getPhotoDefaultId = function() {
        var data=$this.galleryMediaData, info;
        for (var id in data) {
            info=data[id];
            if(info['user_id']==$this.guid && info['default']=='Y'){
                return id;
                break;
            }
        }
        return 0;
    }

    this.updatePhotoInfoDefault = function(pid, url){
        if ($this.visibleMediaData) {
            for (var id in $this.visibleMediaData) {
                var data=$this.visibleMediaData[id];
                if(data['user_id']==$this.guid){
                    $this.visibleMediaData[id]['user_photo_r']=url;
                    $this.visibleMediaData[id]['default']=(id==pid)?'Y':'N';
                }
            }
        }

        if(!$this.galleryMediaData) return;

        for (var id in $this.galleryMediaData) {
            var info=$this.galleryMediaData[id];
            if(info['user_id']==$this.guid){
                $this.galleryMediaData[id]['user_photo_r']=url;
                $this.galleryMediaData[id]['default']=(id==pid)?'Y':'N';
            }
        }
    }

    this.sizePhotoDefault={bm:1,r:1};
    this.replacePhotoDefault = function(pidS){
        var pid=defaultFunctionParamValue(pidS, $this.getPhotoDefaultId());
        if(pidS==-1)pid=0;
        var info=false;
        if(pid){
            if($this.galleryMediaData[pid]){
                info=$this.galleryMediaData[pid];
            }else if($this.visibleMediaData[pid]){
                info=$this.visibleMediaData[pid];
            }
        }
        var urlDefault=info ? info['src_r'] : 'edge_nophoto_r.png';
        pid && $this.updatePhotoInfoDefault(pid, urlDefault);

        var replace=function(s){
            var cl='.profile_photo_'+s+'_'+$this.guid,
                $photos=$(cl).add($this.$ppGalleryClone.find(cl)).add($this.$ppGalleryTmplCommentReply.find(cl));
            if(!$photos[0])return;
            var url=urlFiles+'edge_nophoto_'+s+'.png', img=new Image();
            if(pid)url=urlFiles+info['src_'+s];
            img.onload = function(){
                $photos.each(function(){
                    if ($photos.closest('.user_pic_frame_ie')[0]) {
                        $photos.data('pid', pid);
                    }
                    var $el=$(this);
                    if ($el[0].src) {
                        $el[0].src=url;
                    }else{
                        $el.css('background-image','url('+url+')')
                    }
                })
                delete img;
            }
            img.src=url;
        }
        for (var s in $this.sizePhotoDefault) {
            replace(s);
        }
    }

    this.replacePhotoDefaultDelay = function(pid){
        setTimeout(function(){
            $this.replacePhotoDefault(pid);
        },100);
    }

    this.replacePhotoDefaultCheck = function(setPhotoDefault, photoDefaultId){
        photoDefaultId=photoDefaultId||$this.getPhotoDefaultId();
        if(setPhotoDefault != photoDefaultId){
            $this.replacePhotoDefault(setPhotoDefault);
        }
    }
    /* Photo default */

    /* Photo delete */
    this.confirmPhotoDelete = function(pid, isVideo){
        $this.hideMoreMenu();
        if(isVideo==undefined){
            isVideo=$this.ppGalleryIsVideo;
        }
        confirmCustom(l('this_action_can_not_be_undone'),function(){$this.photoDelete(pid)}, isVideo?l('confirm_delete_video'):l('confirm_delete_photo'))
    }

    this.toggleShowLayerBlocked = function(vis){
        vis=vis||'show';
        if(vis=='show'){
            $this.scrollTop();
            $this.$el['layerBlocked'].show();
            $this.$ppGalleryContainer.addClass('change_photo');
            $this.stopVideoPlayer();
            $this.loaderGalleryShow();
        } else {
            $this.$el['layerBlocked'].hide();
            $this.$ppGalleryContainer.removeClass('change_photo');
            $this.loaderGalleryHidden();
        }
    }

    this.updaterCounterPage = function(sel,title,count){
        if (title) {
            $jq('#left_column_'+sel+'_count').html(title);
            $jq('#menu_inner_'+sel+'_edge').find('.num').text(count);
        }
    }

    this.updatePageData = function(pid, count_title, count, isVideo) {
        var uid=$this.uid||$this.guid;
        count *=1;
        pid=$this.getVideoId(pid);
        if(isVideo==undefined){
            isVideo=$this.ppGalleryIsVideo;
        }
        var type=isVideo?'videos':'photos',
            $listPhoto=$('.list_'+type+'_image_'+pid);
        if ($listPhoto[0]) {
            var page=clPages.page,noReplaceHistory=true;
            if($('.'+type+'_list_user .cham-post-image').length==1){
                page--;
                if(page<=0)page=1;
                noReplaceHistory=false;
            }
            clPages.pageReload(page,false,true,noReplaceHistory);
        }

        if (count) {
            var $li=$('.column_'+type+'_item_'+pid);
            if($li[0]){
                $li.oneTransEnd(function(){
                    $(this).remove()
                }).addClass('to_hide');
            }
            $this.updaterCounterPage(type, count_title, count);
        } else {
            var $bl=$('#left_column_'+type);
            if($bl[0]){
                $bl.slideUp(300,function(){
                    $bl.find('li').remove();
                    $this.updaterCounterPage(type, count_title, count);
                })
            } else {
                $this.updaterCounterPage(type, count_title, count);
            }
        }
    }

    this.photoDelete = function(pid,notGallery,isVideo) {
        pid=pid||$this.curPid;
        notGallery=notGallery||0;
        if(isVideo==undefined){
            isVideo=$this.ppGalleryIsVideo;
        }

        var photoDefaultId=0;
        if(!isVideo){
            photoDefaultId=notGallery ? -1 : $this.getPhotoDefaultId();
        }
        var pidNext=0;
        if(!notGallery)pidNext=$this.galleryMediaData[pid].next_id;

        $.ajax({type:'POST',
                url:url_ajax,
                data:{cmd:'delete_photo',id:pid, uid:$this.uid, get_data_edge:1},
                beforeSend: function(){
                    if($this.isShowGallery && !notGallery){
                        $this.toggleShowLayerBlocked()
                    }
                },
                success: function(res){
                    if ($this.noAction()&&!notGallery)return;
                    var data=checkDataAjax(res);
                    if (data!==false){
                        updateGridPhotoFromDelete(pid);

                        /* Events delete */
                        var evPid=$this.getVideoId(pid),
                        sel1='.events_notification_item[data-type="photo_comments_likes"][data-event-id="'+evPid+'"]',
                        sel2='.events_notification_item[data-type="photo_comments"][data-event-id="'+evPid+'"]';
                        if ($this.isVideo(pid)) {
                            sel1='.events_notification_item[data-type="vids_comments_likes"][data-event-id="'+evPid+'"]',
                            sel2='.events_notification_item[data-type="vids_comment"][data-event-id="'+evPid+'"]';
                        }
                        $(sel1).remove();
                        $(sel2).remove();
                        clEvents.reInitToScroll();
                        /* Events delete */
                        $this.updatePageData(pid, data.count_title, data.count, isVideo);
                        if(!notGallery){
                            if (isVideo){
                                $this.closeGalleryPopup();
                                return;
                            } else {
                                $this.countAllMedia -= 1;
                                //$this.countAllMedia = data.count;
                                /* Delete photo info */
                                if($this.galleryMediaData[pid]){
                                    var dataMedia=$this.galleryMediaData,
                                        info1=$this.galleryMediaData[pid],
                                        off=info1['offset'],
                                        pidNext1=info1['next_id'],
                                        pidPrev1=info1['prev_id'];
                                    dataMedia[pidNext1]['prev_id'] = pidPrev1;
                                    dataMedia[pidNext1]['prev_title'] = dataMedia[pidPrev1]['description'];
                                    dataMedia[pidPrev1]['next_id'] = pidNext1;
                                    dataMedia[pidPrev1]['next_title'] = dataMedia[pidNext1]['description'];
                                    delete dataMedia[pid];
                                    for (var id in dataMedia) {
                                        if (dataMedia[id]['offset'] > off) {
                                            dataMedia[id]['offset'] -=1;
                                        }
                                    }
                                    //console.log(555, id, dataMedia);
                                }
                                /* Delete photo info */
                                //$this.setGalleryMediaData(data.photos_info);
                            }
                        }

                        var fnSuccess = function(){
                            if(!notGallery){
                                $this.toggleShowLayerBlocked('hide');
                                if ($this.countAllMedia<1) {
                                    $this.closeGalleryPopup();
                                }else{
                                    if ($this.countAllMedia==1) {
                                        $this.$ppGalleryContainer.css('cursor','default');
                                        $this.$el['arrows'].addClass('to_hide');
                                    }
                                    if(isVideo){

                                    } else {
                                        $this.prepareLoadParamPhoto(pidNext);
                                    }
                                    $this.show('left', pidNext)
                                }
                            }
                            if (!isVideo){
                                $this.replacePhotoDefaultCheck(data.photo_default, photoDefaultId);
                            }
                        }
                        setTimeout(fnSuccess,200);
                    }else{
                        alertServerError(true);
                        if(notGallery){
                            $('#list_image_layer_action_'+pid).removeClass('to_show').removeChildrenLoader();
                        } else {
                            $this.toggleShowLayerBlocked('hide')
                        }
                    }
                }
        })
    }
    /* Photo delete */

    /* Comment delete */
    this.confirmDeleteComment = function($el,cid,rCid){
        confirmCustom(l('are_you_sure'), function(){$this.deleteComment(cid,rCid)}, l('confirm_delete_comment'));
        $el.closest('.more_menu_collapse').collapse('hide');
    }

    this.deleteComment = function(cid,rCid){
        var $stick,pid=$this.curPid,cidD=cid;
        rCid=rCid||0;
        if (rCid||0) {
            cid=rCid;
            $stick=$('#pp_gallery_comm_delete_'+rCid);
        } else {
            $stick=$('#pp_gallery_comm_delete_'+cid);
        }
        //$stick.addChildrenLoader();
        $this.commentHideGallery(cid, rCid, function(){
            $this.showLastFieldComment();
            $.post(url_ajax+'?cmd=photo_comment_delete',{parent_id:cidD,cid:cid,user_id:$this.uid,pid:pid},
                function(res){
                    if($this.noAction(pid))return;
                    var data=checkDataAjax(res);
                    if (data !== false){
                        if(rCid){
                            $this.updateRepliesCounter(cidD, data)
                        }else{
                            $this.updatePageCounter(data)
                        }
                    } else {
                        alertServerError();
                    }
                })
        })
    }

    this.commentHideGallery = function(cid, rcid, call, noRemove) {
        clMediaTools.commentHide(cid, rcid, false, noRemove, call);
    }
    /* Comment delete */

    /* Edit desc - tag */
    this.getListTags = function(tags){
        var list='';
        for (var id in tags) {
            list +=', <a href="'+urlPagesSite.photos_list+'?tag='+id+'">'+tags[id]+'</a>';
        }
        if (list) {
            list=list.slice(1);
        }
        return list;
    }

    this.openEditTags = function(){
        var data=$this.galleryMediaData[$this.curPid];
        if(!data || data['user_id']!=$this.guid || !$this.uid)return true;
        $this.$el['tags'].hide();
        $this.$el['tagsEditText'].val(data.tags_title);
        $this.$el['tagsEdit'].show();
        $this.$el['tagsEditText'].focus();
        return false;
    }

    this.cancelEditTags = function(e){
        if($this.$el['tagsEdit'].is(':hidden'))return;
        if(e){
            var $targ=$(e.target);
            if($targ.is('#pp_gallery_tags_bl')||$targ.closest('#pp_gallery_tags_bl')[0]){
                return;
            }
        }
        $this.$el['tagsEdit'].hide();
        $this.$el['tags'].show();
        $this.$el['tagsEditText'].val('');
    }

    this.saveEditTags = function(){
        if($this.$el['tagsEdit'].is(':hidden'))return;
        var pid=$this.curPid,
            dataTags=$this.galleryMediaData[pid],
            tags=trim($this.$el['tagsEditText'].val());
        tags=strip_tags(tags);

        if (dataTags['tags_title']!=tags) {
            $this.$el['tagsList'].html(l('saving')+'&nbsp;&nbsp;&nbsp;&nbsp;').addChildrenLoader();

            $.ajax({type: 'POST',
                    url: url_ajax+'?cmd=update_media_tags&type=' + $this.getTypeGallery(),
                    data: {tags: tags, photo_id: $this.prepareId(pid)},
                    beforeSend: function(){
                    },
                    success: function(res){
                        var data=checkDataAjax(res);
                        if(data){
                            $this.galleryMediaData[pid]['tags'] = data.tags;
                            $this.galleryMediaData[pid]['tags_html'] = data.tags_html;
                            $this.galleryMediaData[pid]['tags_title'] = data.tags_title;

                            $this.visibleMediaData[pid]['tags'] = data.tags;
                            $this.visibleMediaData[pid]['tags_html'] = data.tags_html;
                            $this.visibleMediaData[pid]['tags_title'] = data.tags_title;


                            if ($this.ppGalleryIsVideo) {
                                var $listTags=$('.video_list_tags_'+pid);
                            } else {
                                var $listTags=$('.photo_list_tags_'+pid);
                            }
                            if ($listTags[0]) {
                                $listTags.html(data.tags_html)
                                $listTags.closest('.tag').show();
                                //clPages.listLoad(clPages.page,false,true,true);
                            }

                            if($this.noAction(pid))return;
                            tags=data.tags_html;
                            if(!tags){
                                tags=l('click_to_add_tags');
                            }
                            $this.$el['tagsList'].html(tags);
                        }else{
                            if($this.noAction(pid))return;
                            $this.$el['tagsList'].html(dataTags['tags_html']);
                            alertServerError(true);
                        }
                    }
            })
        }
        $this.cancelEditTags();
    }

    this.openEditDesc = function(){
        var data=$this.galleryMediaData[$this.curPid];
        if(!data || data['user_id']!=$this.guid)return;
        $this.$el['desc'].hide();
        $this.$el['descEditText'].val(data.description);
        $this.$el['descEditBl'].show();
        $this.$el['descEditText'].focus();
    }

    this.cancelEditDesc = function(e){
        if($this.$el['descEditBl'].is(':hidden'))return;
        if(e){
            var $targ=$(e.target);
            if($targ.is('#pp_gallery_desc_bl_edit')||$targ.closest('#pp_gallery_desc_bl_edit')[0]
               ||$targ.is('#pp_gallery_desc')||$targ.closest('#pp_gallery_desc')[0]){
                return;
            }
            $this.saveEditDesc();
        }

        $this.$el['descEditBl'].hide();
        $this.$el['desc'].show();
        $this.$el['descEditText'].val('');
    }

    this.updateDescFromPage = function(id, desc){
        debugLog('Update description media from page', id);
        $('.photo_description_'+id).attr('title', desc);
        var $blPage=$('#list_media_description_bl_'+id);
        if ($blPage[0]) {
            if (desc) {
                $blPage.find('.subject').attr('title', desc);
                $blPage.find('.subject > span').text(desc).end().addClass('to_show');
            } else {
                $blPage.removeClass('to_show')
            }
        }
        /* Wall */
        var sel=$this.ppGalleryIsVideo?'#wall_video_'+$this.getVideoId(id):'#wall_photo_'+id,
            $wallDesc=$(sel);
        if($wallDesc[0]){
            var $blWall=$wallDesc.closest('.wall_image_post');
            if ($blWall[0]) {
                var $desc=$blWall.siblings('h4');

                if (desc) {
                    if($desc[0]){
                        $desc.attr('title',desc).text(desc);
                    } else {
                        $('<h4 title="'+desc+'">'+desc+'</h4>').insertAfter($blWall)
                    }
                } else {
                    $desc.remove();
                }
            }
        }
        /* Wall */
    }

    this.saveEditDesc = function(){
        if($this.$el['descEditBl'].is(':hidden'))return;
        var pid=$this.curPid,
            desc=trim($this.$el['descEditText'].val()),
            data=$this.galleryMediaData[pid];
        desc=strip_tags(desc);

        if (data['description']!=desc) {
            var descTitle=desc;
            if(!descTitle){
                descTitle=$this.ppGalleryIsVideo?l('click_here_to_add_a_video_caption'):l('click_here_to_add_a_photo_caption');
            }
            $this.setDescription(descTitle);
            var descOld=data['description'];
            $this.galleryMediaData[pid]['description']=desc;
            $this.visibleMediaData[pid]['description']=desc;
            $this.cancelEditDesc();
            $this.updateDescFromPage(pid,desc);

            $.ajax({type: 'POST',
                    url: url_ajax+'?cmd=photo_save_desc',
                    data: {desc: desc, pid: pid},
                    beforeSend: function(){
                    },
                    success: function(res){
                        if(!checkDataAjax(res)){
                            $this.galleryMediaData[pid]['description']=descOld;
                            $this.visibleMediaData[pid]['description']=descOld;
                            if(!$this.noAction(pid)){
                                $this.setDescription(descOld);
                                alertServerError(true);
                            }
                            $this.updateDescFromPage(pid,descOld);
                        }
                    }
            })
        } else {
            $this.cancelEditDesc();
        }
    }
    /* Edit desc - tag */

    this.like = function($el){
        if ($el.is('.disabled')) return;
        $el.addClass('disabled');

        var rcid=$el.data('rcid'),
            cid=$el.data('cid')||rcid,
            pid=$this.curPid,
            like=$el.data('like')*1;

        clMediaTools.likeChangeStatus($el, like);

        $.post(url_ajax+'?cmd=comment_like&type=' + $this.getTypeGallery(),
              {cid:cid,like:like,user_id:$this.galleryMediaData[pid]['user_id'], id:pid},
            function(res){
                if($this.noAction(pid))return;
                var data=checkDataAjax(res);
                if (data){
                    var $bl=rcid?$('#comment_reply_likes_bl_'+rcid):$('#comment_likes_bl_'+cid),
                        dataLike={count:data['likes'],title:data['likes_users']};
                    clMediaTools.updateCommentOneLike(dataLike, $bl);
                } else {
                    $el.removeClass('disabled');
                    alertServerError();
                }
        })
    }

    this.hideMoreMenu = function(e){
        if(!$this.$el['mediaMenuMore'])return;
        if(e){
            var $targ=$(e.target);
            if($targ.is('.wrap_upload_menu')||$targ.closest('.wrap_upload_menu')[0]){
                return;
            }
        }
        if($this.$el['mediaMenuMore'][0] && $this.$el['mediaMenuMore'].is('.in'))$this.$el['mediaMenuMore'].collapse('hide');
        $('.more_menu_right.in').collapse('hide');
    }
    /* Gallery */

    /* Report */
    this.setDataReports = function(pid){
        if(pid){
            $this.$el['mediaMenu'].hide();
            if (!in_array($this.guid, $this.galleryMediaData[pid]['reports'].split(','))) {
                if(trim($this.galleryMediaData[pid]['reports'])){
                    $this.galleryMediaData[pid]['reports'] +=','+$this.guid;
                }else{
                    $this.galleryMediaData[pid]['reports']=$this.guid+'';
                }
            }
        }
    }

    this.openReport = function() {
        $this.hideMoreMenu();
        clProfile.openReport($this.guid, $this.curPid);
    }
    /* Report */

    this.getTypeGallery = function(){
        return $this.ppGalleryIsVideo?'video':'photo';
    }

    this.hideMoreMenuAction = function(){
        $('.list_photos_image_menu.in').collapse('hide');
    }

    this.photoRotateInit = {};
    this.rotate = function(pid){
        pid *=1;
        if(!pid)return;
        $this.hideMoreMenuAction();

        var $layer=$('#list_image_layer_action_'+pid);
        if($layer.is('.to_show'))return;
        $layer.addClass('to_show').addChildrenLoader();

        if($this.photoRotateInit[pid] == undefined){
            $this.photoRotateInit[pid] = {angle:0,start:0,set:0};
        }
        $this.photoRotateInit[pid]['set']=1;

        var angle=$this.photoRotateInit[pid]['angle']+90;
        var $photo=$('#list_photos_image_photo_'+pid).css({transform:'rotate3d(0, 0, 1, '+angle+'deg)'});

        var fnShowBtn=function(pid,angle){
            $this.photoRotateInit[pid]['angle']=angle;
            $this.photoRotateInit[pid]['set']=0;
            $layer.removeClass('to_show').removeChildrenLoader();
        },
        fnError=function(pid,angle){
            angle -=90;
            $photo.css({transform:'rotate3d(0, 0, 1, '+angle+'deg)'});
            $this.photoRotateInit[pid]['set']=0;
            $this.photoRotateInit[pid]['angle']=angle;
            fnShowBtn(pid,angle);
            alertServerError(true);
        };

        $.ajax({url:url_ajax+'?cmd=photo_rotate',
                type:'POST',
                data:{photo_id:pid, angle:90},
                beforeSend: function(){},
                success: function(res){
                    if (checkDataAjax(res)){
                        //if($this.visibleMediaData[pid] != undefined){
                            var photo=$this.uid+'_'+pid,
                                sizes=['b', 's', 'r', 'm', 'bm'],
                                preloadArr=[],i=0,url,v=+new Date; v='?v='+v;
                            sizes.forEach(function(size,i,arr) {
                                url='photo/'+photo+'_'+size+'.jpg'+v;
                                $this.visibleMediaData[pid]['src_'+size] = url;
                                preloadArr[i++]=urlFiles+url;
                            })
                            preloadImageInsertInDom(preloadArr);
                            $this.replaceRotatePhoto(pid);
                        //}
                        fnShowBtn(pid,angle);
                    }else{
                        fnError(pid,angle);
                    }
                },
                error: function(){
                    fnError(pid,angle);
                }
        })
    }

    this.myrotate = function(pid, an, index){
        pid *=1;
        if(!pid)return;
        $this.hideMoreMenuAction();

        var $layer=$('#list_image_layer_action_'+pid);
        if($layer.is('.to_show'))return;
        $layer.addClass('to_show').addChildrenLoader();

        if($this.photoRotateInit[pid] == undefined){
            $this.photoRotateInit[pid] = {angle:0,start:0,set:0};
        }
        $this.photoRotateInit[pid]['set']=1;

        var angle=$this.photoRotateInit[pid]['angle']+90;
        var $photo=$('#list_photos_image_photo_'+pid).css({transform:'rotate3d(0, 0, 1, '+angle+'deg)'});

        var fnShowBtn=function(pid,angle){
            $this.photoRotateInit[pid]['angle']=angle;
            $this.photoRotateInit[pid]['set']=0;
            $layer.removeClass('to_show').removeChildrenLoader();
        },
        fnError=function(pid,angle){
            angle -=90;
            $photo.css({transform:'rotate3d(0, 0, 1, '+angle+'deg)'});
            $this.photoRotateInit[pid]['set']=0;
            $this.photoRotateInit[pid]['angle']=angle;
            fnShowBtn(pid,angle);
            alertServerError(true);
        };

        $.ajax({url:url_ajax+'?cmd=photo_rotate',
                type:'POST',
                data:{photo_id:pid, angle:an},
                beforeSend: function(){},
                success: function(res){
                    if (checkDataAjax(res)){
                        //if($this.visibleMediaData[pid] != undefined){

                            var response = JSON.parse(res);
                            var num = $(".thumb_img").length;
                            if(index < num){
                                //document.getElementsByClassName("thumb_img")[index].style.transform = 'rotate(' + show_angle+ 'deg)';
                                original = document.getElementsByClassName("thumb_img")[index].src;

                                if(original.indexOf(response.data.src) !== -1){
                                    document.getElementsByClassName("thumb_img")[index].style.transform = 'rotate(' + show_angle+ 'deg)';
                                }else{
                                    document.getElementsByClassName("thumb_img")[index].src = window.location.origin + '/_files/' + response.data.src;
                                    //document.getElementsByClassName("thumb_img")[index].src = window.location.origin + '/chitchattest/_files/' + response.data.src;
                                    document.getElementsByClassName("thumb_img")[index].style.transform = 'rotate(' + 0 + 'deg)';
                                    show_angle = 0;
                                }                                
                            }                            

                        //}
                        fnShowBtn(pid,angle);
                        left_angle = 0;
                        right_angle = 0;
                        if(index < num - 1 ){
                            index = index + 1;
                            $this.myrotate(photo_lists[index], an, index);
                        }

                    }else{
                        fnError(pid,angle);
                    }
                },
                error: function(){
                    fnError(pid,angle);
                }
        })
    }


    this.imgFilter = function(pid, filter, index){
        pid *=1;
        if(!pid)return;
        $this.hideMoreMenuAction();

        var $layer=$('#list_image_layer_action_'+pid);
        if($layer.is('.to_show'))return;
        $layer.addClass('to_show').addChildrenLoader();

        $.ajax({url:url_ajax+'?cmd=photo_filter',
                type:'POST',
                data:{photo_id:pid, filter:filter},
                beforeSend: function(){},
                success: function(res){
                    if (checkDataAjax(res)){
                        //if($this.visibleMediaData[pid] != undefined){
                            var response = JSON.parse(res);                           
                            var url = response.data.src;                        
                            var num = $(".thumb_img").length;
                            if(index < num){
                                
                                document.getElementsByClassName("thumb_img")[index].src = window.location.origin + "/_files/" +  url + "?" + new  Date().getTime();
                                //document.getElementsByClassName("thumb_img")[index].src = window.location.origin + "/chitchattest/_files/" +  url + "?" + new  Date().getTime();
                                //show_angle = show_angle - show_angle * 2;
                                document.getElementsByClassName("thumb_img")[index].style.transform = 'rotate('  + 0 + 'deg)';
                            }
                        //}
                        // left_angle = 0;
                        // right_angle = 0;
                        if(index < num - 1 ){
                            index = index + 1;
                            $this.imgFilter(photo_lists[index], filter, index);
                        }

                    }else{
                      
                    }
                },
                error: function(){

                }
        })
    }
    

    this.replaceRotatePhoto = function(pid) {
        var info=$this.visibleMediaData[pid];
        var el={
            s:'img.column_photo_s_'+pid,
            b:'.grid_item_'+pid
        }
        if(info.default == 'Y'){
            el.bm='img.profile_photo_bm_'+$this.guid;
        }
        for (var size in el) {
            var $els=$(el[size]);
            if($els[0]){
                $els.each(function(){
                    var $img=$(this),
                        src=urlFiles+$this.visibleMediaData[pid]['src_'+size];
                    if($img.attr('src')){
                        this.src=src;
                    }else{
                        $img.css('background-image','url('+src+')');
                    }
                })
            }
        }
    }

    this.confirmPhotoDeleteList = function(pid, isVideo){
        $this.hideMoreMenu();
        isVideo=isVideo||false;
        confirmCustom(l('this_action_can_not_be_undone'),function(){
            $this.photoDeleteList(pid)
        }, isVideo?l('confirm_delete_video'):l('confirm_delete_photo'))
    }

    this.photoDeleteList = function(pid){
        var $layer=$('#list_image_layer_action_'+pid);
        if($layer.is('.to_show'))return;
        $layer.addClass('to_show').addChildrenLoader();
        $this.hideMoreMenuAction();

        var isVideo=$this.isVideo(pid);
        if(!pid)return;

        $this.photoDelete(pid,true,isVideo);
    }

    this.inViewport = function(el){
        return inViewport(el,{container:$this.$ppGalleryOverflow[0],threshold:-40})//
    }

    this.resizeImageOne = function(h){
        var style='';
        if (h) {
            h = Math.round(h*$this.galleryImageHeightMobile/100);
            //console.log(33333,'H: '+ h+'/'+$this.galleryImageHeightMobile);
            //$('#pp_gallery_photo_one_bl, #pp_wall_one_post_photo_one_bl').css({'height':h,'max-height':h});
            //$('#pp_gallery_photo_one_bl img, #pp_wall_one_post_photo_one_bl img').css('max-height',h);
            style='#pp_gallery_photo_one_bl, #pp_wall_one_post_photo_one_bl{height:'+h+'px; max-height:'+h+'px;}'+
                  '#pp_gallery_photo_one_bl img, #pp_wall_one_post_photo_one_bl img{max-height:'+h+'px;}';
        }
        $jq('#style_gallery')[0].innerHTML=style;
    }

    this.resizeImage = function(){
        var h=$win[0].innerHeight;
        if(!h)return;
        h -=$jq('.navbar').height();
        $this.resizeImageOne(h);
    }

    this.isWallGallery = function(){
        if(typeof clWall != 'object')return false;
        return clWall.isOpenOnePostImage;
    }

    this.checkScrollInput = function(){
        var $context=$this.isShowGallery?$this.$ppGallery:clWall.$ppGalleryOverflow;
        var $fl=$('textarea:focus, input:focus', $context);
        if($fl[0]){
            !$this.inViewport($fl[0]) && $this.scrollToInto($fl);
        }
    }

    this.hideHeaderPicture = function($btn,pid){
        var isGallery=false;
        $btn=$btn||[];
        if(!$btn[0]){
            isGallery=true;
            $btn=$this.$el['linkHideHeader'];
        }
        if($btn.find('.css_loader')[0])return;
        pid=pid||$this.curPid;
        $.ajax({type: 'POST',
                url: url_ajax+'?cmd=hide_from_header_picture',
                data: {photo_id: pid},
                beforeSend: function(){
                    addChildrenLoader($btn);
                },
                success: function(res){
                    var is=$this.curPid==pid||!isGallery,
                        data=checkDataAjax(res);
                    if (data!==false){
                        var hideHeader=data*1;
                        if($this.galleryMediaData[pid]!=undefined){
                            $this.galleryMediaData[pid]['hide_header']=hideHeader;
                        }
                        if(is){
                            if(isGallery){
                                $this.$el['mediaMenuMore'].one('hidden.bs.collapse',function(){
                                    $this.changeLinkHideHeaderPicture(hideHeader,false,pid);
                                    removeChildrenLoader($btn);
                                })
                                $this.hideMoreMenu();
                            } else {
                                $this.changeLinkHideHeaderPicture(hideHeader,$btn);
                                removeChildrenLoader($btn);
                            }
                            alertCustom(hideHeader?l('picture_remove_from_header_alert'):l('picture_add_in_header_alert'),l('alert_success'));
                        }
                        if (hideHeader) {
                            updateGridPhotoFromDelete(pid);
                        } else {
                            updateGridPhoto();
                        }
                     }else if(is){
                        if(isGallery){
                            $this.hideMoreMenu();
                        }
                        removeChildrenLoader($btn);
                    }
                }
        })
        return;
    }

    Dropzone.autoDiscover = false;
    $(function(){
        $this.initUploadFile('video');
        $this.initUploadFile('photo');

        $this.$ppGallery=$('#pp_gallery_photos_content');
        $this.$ppGalleryClone=$this.$ppGallery.clone();
        $this.ppGalleryIsVideo=false;
        $this.$ppGalleryTmplComment=$('.bl_templates').find('.pp_gallery_comment_item').addClass('to_post');
        $this.$ppGalleryTmplCommentReply=$('.bl_templates').find('.comments_replies_item').addClass('to_post');
        $this.$ppGalleryTmplComment.find('.comments_replies_list').empty();

        window.onbeforeunload = function (e) {
            //console.log($this.$ppUpload['photo']['upload_count'],$this.$ppUpload['video']['upload_count']);
            if($this.$ppUpload['photo']['upload_count']||$this.$ppUpload['video']['upload_count']){
                var message = l('your_photos_will_not_be_published');
                if(typeof e =='undefined'){e=window.event}
                if(e){e.returnValue = message}
                return message;
            }
        }

        $jq('body').on('click', '.pp_file_upload', function(e){
            var $targ=$(e.target), type=$(this).data('type');
            if ($targ.is('.modal-content')||$targ.closest('.modal-content')[0]
                ||$this.$ppUpload[type]['upload_count']){
                return false;
            }
            $this.$ppUpload[type]['btn_cancel'].click();
        }).on('click', function(e){
            var $target = $(e.target);

            if($target.is('.pp_gallery_overflow') || $target.is('.navbar-default') || $target.is('.navbar-header')){
                if ($this.isShowGallery) {
                    if($this.$ppGalleryOverflow.is('.moving'))return;
                    $this.closeGalleryPopup();
                    return;
                } else if ($this.isWallGallery()) {
                    clWall.closePpOnePostPopup();
                    return;
                }

            }
            if (!$this.isShowGallery)return;

            if($target.is('.app_ios_video_editor_link')
                || $target.closest('.app_ios_video_editor_link')[0]
                || $target.is('.app_ios_image_editor_link')
                || $target.closest('.app_ios_image_editor_link')[0]) {
                return;
            }
            $this.hideMoreMenuAction();
            if($this.noAction())return;
            $this.hideMoreMenu(e);
            $this.cancelEditDesc(e);
            $this.cancelEditTags(e);
        })

        $win.on('popstate',function(){
            if (window.history && typeof history.state == 'object') {
                if ($jq('#events_notification_link').is('.history_open')) {
                    $jq('#events_notification_link').addClass('history_close_back').click();
                } else if ($jq('#friends_notification_link').is('.history_open')) {
                    $jq('#friends_notification_link').addClass('history_close_back').click();
                } else if ($jq('#btn_header_menu_nav').is('.history_open')) {
                    $jq('#btn_header_menu_nav').addClass('history_close_back').click();
                } else if ($jq('body').is('.upload_file_video')) {
                    if($this.$ppUpload['video']['upload_count']){
                        setPushStateHistory('upload_file');
                    }else{
                        $this.closeDropZone('video');
                    }
                } else if ($jq('body').is('.upload_file_photo')) {
                    if($this.$ppUpload['photo']['upload_count']){
                        setPushStateHistory('upload_file');
                    }else{
                        $this.closeDropZone('photo');
                    }
                } else if ($jq('body').is('.message_open')) {
                    clMessages.close();
                } else if ($this.isShowGallery) {
                    $this.closeGallery();
                } else if ($this.isWallGallery()) {
                    clWall.closePpOnePost();
                }
            }
        })

        $win.on(evWndRes,function(e){
            if(!isMobileSite || isChangeDevice){
                $this.resizeImageOne('');
                return;
            }
            if ($this.isShowGallery || $this.isWallGallery()) {
                var ev=e.type;
                setTimeout(function(){
                    if(!isMobileSite || isChangeDevice){
                        $this.resizeImageOne('');
                        return;
                    }
                    if (ev == 'orientationchange') {
                        $this.resizeImage();
                    }
                },evWndResTime)
                if (!isMobileSite || isChangeDevice) {
                    return;
                }
                if(isAppAndroid){
                    setZeroTimeout($this.checkScrollInput)
                }else{
                    setTimeout($this.checkScrollInput,evWndResTime)
                }
            }
        })
    })

    return this;
}