var CGifts = function(is_credits_enabled) {

    var $this=this;

    this.isCreditsEnabled=is_credits_enabled*1;

    this.giftsCache={};
    this.lastGift=0;
    this.currentDeleteGiftText;
    this.currentDeleteGift;
    this.giftUserId;

    this.langParts={};

    this.pp_gift_img;
    this.pp_gift_text;
    this.pp_gift_recipient;
    this.notOpenPpGift=true;

    this.send_gift;
    this.send_text;
    this.send_gifts_credits;
    this.send_recipient;

    this.setGiftsCache = function(id) {
        $this.giftsCache[id]=1;
        $this.lastGift=id;
    }

    this.giftsCacheRemove = function(id) {
        if (!$this.giftsCache[id]) return;
        delete $this.giftsCache[id];
    }

    this.deleteGiftText = function(){
        confirmHtmlClose();
        var gid=$this.currentDeleteGiftText.data('id');
        $this.currentDeleteGiftText.closest('.profile_gift_decor').fadeOut(200,function(){
            var el=$(this);
            el.prev('.user_gift_delete').hide();
            setTimeout(function(){el.remove()},10);
        })
        $.post(url_ajax,{cmd:'delete_text_gift',gid:gid},
            function(data){
                var data=checkDataAjax(data);
                if(data){}
            }
        );
    }

    this.setBorderGift = function(){
        var box=$('#profile_gift_box');
        if($('#profile_user_gift_list > li:visible')[0]){box.addClass('profile_gift_b')
        }else{box.removeClass('profile_gift_b')}
    }

    this.deleteGiftBox = function(el,id){
        if(el[0]){
            el.fadeOut(200,function(){
                el.remove();
                $this.setBorderGift();
                $this.giftsCacheRemove(id);
            })
        }
    }

    this.deleteGift = function(){
        confirmHtmlClose();
        var el=$this.currentDeleteGift.closest('li'),
            giftId=$this.currentDeleteGift.data('id');
        $.post(url_ajax,{cmd:'delete_gift',gid:giftId,
                         uid:$this.currentDeleteGift.data('uid'),img:$this.currentDeleteGift.data('img')},
            function(data){
                var data=checkDataAjax(data);
                if(data){
                    $this.deleteGiftBox(el,giftId);
                }
            }
        );
    }

    this.ppGiftClose = function(){
        //Profile.popup['#pp_gift'].close();
        $this.pp_gift.close();
        setTimeout(function(){
            var cr=$this.pp_gift_img.removeClass('selected').eq(0).addClass('selected').data('credits')*1;
            if($this.isCreditsEnabled){
                var credits=$this.langParts['gift_free'];
                if(cr)credits=$this.langParts.gift_price.replace(/{pay_credits}/,cr);
                $('#pp_gift_title').html(credits);
            }
            $this.pp_gift_text.val('');
            $('#pp_gifts_credits').val('');
            $this.pp_gift_recipient.prop('checked',false);
            $('#pp_gift_send').prop('disabled',false);
            $this.isChangeFormGift=false;
        },200);
    }

    // will integrate with CGifts.checkExistenceGifts
    this.update = function(id){
        var list=$('#profile_user_gift_list'),
            giftId='#profile_user_gift_'+id;
        if(id&&!list.find(giftId)[0]){
            $(giftId).hide().appendTo(list).fadeIn(400);
            $('#profile_gift_box').addClass('profile_gift_b');
            $this.setGiftsCache(id);
        }
    }

    this.checkExistenceGifts = function(existingGifts){
        var existingGifts = jQuery.parseJSON(existingGifts);
        for (var id in $this.giftsCache) {
            if($.type(existingGifts[id])!=='number'){
                $this.deleteGiftBox($('#profile_user_gift_'+id),id);
            }
        }
    }

    this.send = function(){
        $this.ppGiftClose();
        $.post(url_ajax,
               {cmd:'send_gift',user_to:$this.giftUserId,gift:$this.send_gift,
                text:$this.send_text,recipient:$this.send_recipient,
                page:currentPage,gifts_credits:$this.send_gifts_credits},
                function(data){
                        data=checkDataAjax(data);
                        if(data!==false){
                        var $data=$($.trim(data)),setCredits=$data.filter('script');
                        $('#update_server').append(setCredits);
                            setTimeout(function(){
                                alertCustom(MSG_YOUR_GIFT_HAS_BEEN_SENT,true,ALERT_HTML_SUCCESS);
                                var gift=$data.not('script'),id=gift.attr('id');
                                $this.setGiftsCache(gift.data('id'));
                                $('.icon_ok').on('click',function(){
                                    var list=$('#profile_user_gift_list');
                                    if(id&&!list.find('#'+id)[0]){gift.hide().appendTo(list).fadeIn(400)}
                                    $('#profile_gift_box').addClass('profile_gift_b');
                                });
                            },200);
                        }
                        $('#pp_gift_send').prop('disabled',false);
                        $this.ppGiftClose();
                }
        );
    }

    $this.isChangeFormGift=false;
    this.changeFormGift = function(){
        $this.isChangeFormGift=trim($this.$giftsCreditsInput.val())
            ||trim($this.pp_gift_text.val())
            ||$this.firstGift!=$('.gift_img.selected',$this.pp_gift).data('gift')
            ||$this.pp_gift_recipient.prop('checked');
    }

    $(function(){
        $('#pp_gift_close').click($this.ppGiftClose);

        $this.pp_gift=$('#pp_gift');
        $this.pp_gift_img=$('.gift_img',$this.pp_gift);
        $this.pp_gift_text=$('#pp_gift_text').on('change propertychange input', function(){
            $this.changeFormGift();
        });
        $this.pp_gifts_credits=$('#pp_gifts_credits');
        $this.pp_gift_recipient=$('#pp_gift_recipient').on('change', function(){
            $this.changeFormGift();
        });

        $this.firstGift=$('.gift_img.selected',$this.pp_gift).data('gift');

        $this.pp_gift_img.on('click',function(){
            var el=$(this);
            $this.pp_gift_img.removeClass('selected');//.switchClass('selected','none',100,'linear');
            el.addClass('selected');
            if($this.isCreditsEnabled){
                var cr=el.data('credits')*1,credits=$this.langParts['gift_free'];
                if(cr)credits=$this.langParts.gift_price.replace(/{pay_credits}/,cr);
                $('#pp_gift_title').html(credits);
            }
            $this.changeFormGift();
            return false;
        });

        var pp_gift_send=$('#pp_gift_send');

        pp_gift_send.click(function(){
            var selGigf=$('.gift_img.selected',$this.pp_gift),id;
            if(!selGigf[0]){
                alertCustom(MSG_PLEASE_CHOOSE_A_GIFT,true);
                return;
            };
            pp_gift_send.prop('disabled',true);
            $this.send_gift=selGigf.data('gift');
            $this.send_text=$this.pp_gift_text.val();
            $this.send_gifts_credits=$this.pp_gifts_credits.val();
            $this.send_recipient=$this.pp_gift_recipient.prop('checked')*1;
            if($this.isCreditsEnabled){
               //Profile.incPopOpenPayment('gift',Profile.requestUri,$this.send_gift,selGigf.data('credits'));
               Profile.incPopOpenPayment('gift',Profile.requestUri,$this.send_gift,$this.send_gifts_credits);
            }else{
               $this.send();
            }

            /*pp_gift_send.prop('disabled',true);
            id=selGigf.data('gift');
            $.post(url_ajax,
                   {cmd:'send_gift',user_to:$this.giftUserId,gift:id,
                    text:$this.pp_gift_text.val(),recipient:$this.pp_gift_recipient.prop('checked')*1,
                    page:currentPage},
                    function(data){
                        data=checkDataAjax(data);
                        if(data!==false){
                        var $data=$($.trim(data)),setCredits=$data.filter('script');
                        $('#update_server').append(setCredits);
                            setTimeout(function(){
                                alertCustom(MSG_YOUR_GIFT_HAS_BEEN_SENT,true,ALERT_HTML_SUCCESS);
                                var gift=$data.not('script'),id=gift.attr('id');
                                $this.setGiftsCache(gift.data('id'));
                                $('.icon_ok').on('click',function(){
                                    var list=$('#profile_user_gift_list');
                                    if(id&&!list.find('#'+id)[0]){gift.hide().appendTo(list).fadeIn(400)}
                                    $('#profile_gift_box').addClass('profile_gift_b');
                                });
                            },200);
                        }
                        pp_gift_send.prop('disabled',false);
                        $this.ppGiftClose();
                    }
            );*/
        });

        $this.$giftsCreditsInput=$('#pp_gifts_credits').keypress(function(e){
            var key=null,chr;
            e=e||event;
            if(e.ctrlKey||e.altKey||e.metaKey)return;
            if(e.keyCode)key=e.keyCode
            else if(e.which)key=e.which;
            if(key==null)return;
            chr=String.fromCharCode(key);
            if(chr<'0'||chr>'9')return false;
        }).on('change propertychange input', function(){
            $this.changeFormGift();
        })

        $('body').on('click', '.user_gift_text_delete, .user_gift_delete, .send_user_gift, .pp_body', function(e){
            var el=$(this),target=$(e.target);
            if(el.is('.user_gift_text_delete')){
                $this.currentDeleteGiftText=el;
                confirmCustom(ALERT_HTML_ARE_YOU_SURE,$this.deleteGiftText);
                return false;
            }
            if(el.is('.user_gift_delete')){
                $this.currentDeleteGift=el;
                confirmCustom(ALERT_HTML_ARE_YOU_SURE,$this.deleteGift);
                return false;
            }
            if(el.is('.send_user_gift')){
                if (!ajax_login_status) {
                    window.location.href=url_main+urlPageLogin;
                    return false;
                }
                var $el=$(this);
                if ($el.data('isBlockedMe')*1) {
                    alertCustom(MSG_YOU_ARE_IN_BLOCK_LIST,true,ALERT_HTML_ALERT);
                    return false;
                }
                /*Profile.incPopOpenPayment('gift',Profile.requestUri);*/
                $this.giftUserId=$el.data('userId');
                if($this.notOpenPpGift){$this.pp_gift.modalPopup().open();$this.notOpenPpGift=false;
                }else{$this.pp_gift.open()}
                return false;
            }
            if(el.is('.pp_body')&&target.is('.pp_body')){
                if(!$this.notOpenPpGift&&!$this.isChangeFormGift)$this.ppGiftClose();
            }
        }).on('mouseenter mouseleave', '.profile_gift ul li', function(e){
            var el=$(this);
            if(el.is('.profile_gift ul li')){
                var item=$('.profile_gift_decor, a.icon_delete',this);
                if(e.type=='mouseenter'){item.fadeIn(200)
                }else{item.fadeOut(200)}
            }
        });
    })

    return this;
}