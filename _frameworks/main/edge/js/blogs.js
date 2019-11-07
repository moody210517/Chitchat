var CBlogs = function() {

    var $this=this;

    this.setData = function(data){
        for (var key in data) {
           $this[key] = data[key];
        }
    }

    /* Editor */
    this.initEditor = function() {
        var isMobile=device.mobile();

        $this.defaultTitle=l('enter_a_title');
        $this.$postTitle=$jq('#blog_post_title').focus(function(){
            if(!$this.getTitlePost()){
                this.innerText='';
                $(this).removeClass('default');
            }
        }).blur(function(){
            if(!$this.getTitlePost()){
                this.innerText=$this.defaultTitle;
                $(this).addClass('default');
            }
        }).on('change propertychange input', $this.setDisabledSavePost)
        if(!$this.getTitlePost())$this.$postTitle.text($this.defaultTitle).addClass('default');
        $this.postTitleOriginal=$this.getTitlePost();

        $this.defaultText=l('write_something');
        $this.$postText=$jq('#blog_post_text').on('focus',function(){
            if(!$this.getTextPost()){
                this.innerText='';
                $(this).removeClass('default');
            }
        }).on('blur',function(){
            if(!$this.getTextPost()){
                this.innerText=$this.defaultText;
                $(this).addClass('default');
            }
        }).on('change propertychange input', $this.setDisabledSavePost)
        .wysiwyg({fileUploadError: $this.showUploadFileError})
        if(!$this.getTextPost())$this.$postText.html($this.defaultText).addClass('default');
        $this.postTextOriginal=$this.$postText[0].innerHTML;

        if (isMobile) {
            $this.$postText.contextmenu(function() {
               return false;
            })
        }

        $('.dropdown-menu input', '#editor_toolbar').click(function(){
            return false
        }).change(function(){
            $(this).parent('.dropdown-menu').siblings('.dropdown-toggle').dropdown('toggle')
        }).keydown('esc', function(){
            this.value='';
            $(this).change();
        })

        var stateResize=false, $imgResize;
        $('body').on('mousemove', 'img', function(e){
            if(stateResize)return;
            var $img=$(this),el=getOffsetElement(this),mouse=getMouseOffset(e),
                dT=(mouse.top-el.top > $img.height()-10),
                dL=(mouse.left-el.left > $img.width()-10);
            $img.removeClass('se-resize e-resize s-resize');
            if(dT && dL) {
                $img.addClass('se-resize');
            } else if (dL) {
                $img.addClass('e-resize');
            } else if (dT) {
                $img.addClass('s-resize');
            }
            return false;
        }).on('mousedown touchstart', 'img', function(e){
            var $img=$(this);
            if(e.type=='touchstart'){
                if(e.originalEvent.touches.length!=1)return false;
                $img.addClass('se-resize');
            }
            if ($img.is('.se-resize')||$img.is('.e-resize')||$img.is('.s-resize')) {
                stateResize=getMouseOffset(e);
                $imgResize=$img;
                $this.$postText.prop('contenteditable', false);
            }
            return false;
        })

        $doc.on('mousemove touchmove', function(e){
            if(!stateResize)return;
            isMobile&&$jq('#cham-page').addClass('overflow_hidden');
            var imgH=$imgResize.height(), imgW=$imgResize.width(),
                maxW=$this.$postText.width(), p=imgW/imgH, w,
                mouse=getMouseOffset(e);
            if(e.type=='touchmove'){
                var ev=e.originalEvent.touches;
                if(ev.length!=1)return false;

                e.preventDefault();//????
                var topD = stateResize.top-mouse.top,
                    leftD = stateResize.left-mouse.left;
                if (Math.abs(topD) > Math.abs(leftD)) {
                    w = Math.round((imgH + topD*-1)*p);
                } else {
                    w = imgW + leftD*-1;
                }
            } else {
                if ($imgResize.is('.s-resize')) {
                    w = Math.round((imgH + (stateResize.top-mouse.top)*-1)*p);
                }else{
                    w = imgW + (stateResize.left-mouse.left)*-1;
                }
            }
            stateResize=mouse;

            if(w>maxW){w=maxW} else if(w<50)w=50;
            $imgResize.width(w);
            return false;
        }).on('mouseup touchend', function(e){
            if(!stateResize)return;
            isMobile&&$jq('#cham-page').removeClass('overflow_hidden');
            stateResize=false;
            $imgResize.removeClass('se-resize e-resize s-resize');
            $this.$postText.prop('contenteditable', true);//.focus();
            return false;
        })
        var text='ghghghhttp://sitesman.com/s/1014-2018-02-20_21-42-06.png  sdfasdfasdf  \n\
                  http://sitesman.com/s/1014-2018-02-20_21-48-31.png www.chameleondeveloper.com';
        //grabsTextLink(text);

    }

    this.getTitlePost = function() {
        var title=trim($this.$postTitle.text());
        if (title==$this.defaultTitle)title='';
        return title;
    }

    this.getTextPost = function() {
        var text=trim($this.$postText.html());
        if (text==$this.defaultText)text='';
        return text;
    }

    this.setDisabledSavePost = function() {
        var disabled = false, disabledCancel = true, title=$this.getTitlePost();
        if($this.postTitleOriginal!=title||$this.postTextOriginal!=$this.$postText[0].innerHTML){
            disabledCancel = false;
            disabled = false;
        }
        if (!title || !$this.getTextPost()) {
            disabled = true;
        }
        $jq('#blog_post_cancel').prop('disabled', disabledCancel);
        $jq('#blog_post_submit').prop('disabled', disabled);
    }

    this.cancelChangePost = function() {
        $this.$postTitle.text($this.postTitleOriginal).blur();
        $this.$postText.html($this.postTextOriginal).blur();
        $jq('#blog_post_submit, #blog_post_cancel').prop('disabled', true);
        clMediaTools.scrollTop();
    }

    this.savePost = function() {
        var title=$this.getTitlePost();
        if (!title||!$this.getTextPost()) {
            alertCustom(l('please_fill_in_all_the_fields'), l('alert_html_title_error'))
            return;
        }
        var data = {
            title:title,
            text:$this.$postText.html(),
            tags:trim($jq('#blog_post_tags').val())
        }

        $this.$postText.prop('contenteditable', false);
        $this.$postTitle.prop('contenteditable', false);
        $jq('#blog_post_submit').addChildrenLoader();
        $jq('#blog_post_submit, #blog_post_cancel').prop('disabled', true);

        $.post('blogs_add.php?ajax=1',data,function(res){
                var data=getDataAjax(res, 'data');
                if (data) {
                    var h=$content.html(data).find('.bl_modal_body').addClass('to_show').height();
                    setTimeout(function(){
                        if(ajax_login_status){
                            $content.css({height:'auto',overflow:'visible'});
                        } else {
                            $content.oneTransEnd(function(){
                                $content.css({height:'auto',overflow:'visible'});
                            }).height(h);
                        }
                        var fnSuccess=function(){
                            $jq('#pp_contact').one('hidden.bs.modal', function(){
                                setTimeout(function(){alertCustom(l('message_sent'),l('success'))},0)
                            }).modal('hide')
                        }
                        initContactUs($jq('#pp_contact'),fnSuccess,showError,hideError);
                    },0)
                }else{
                    $jq('#pp_contact').one('hidden.bs.modal', alertServerError).modal('hide');
                }
            })

    }

    this.showUploadFileError = function(reason, detail) {
		var msg=l('photo_file_upload_failed');
		if(reason==='unsupported-file-type'){
            msg=l('wrong_photo_types');
            console.log('Unsupported format',detail,reason);
        } else {
			console.log('Error uploading file',detail,reason);
		}
        alertCustom(msg, l('alert_html_title_error'));
	}
    /* Editor */

    $(function(){
        $('.menu_blogs_add_edge').click(function(){
            redirectUrl(urlPagesSite.blogs_add);
            return false;
        });
    })
    return this;
}