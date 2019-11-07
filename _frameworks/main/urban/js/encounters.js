var CEncounters = function() {

    var $this=this;

    this.pid;
    this.uid;
    this.status;
    this.cmd;
    this.paramUid;
    this.uidUndo;
    this.statusUndo=true;
    this.isSend=false;
    this.isReply=false;

    this.dur=400;
    this.durCar=100;

    this.langParts={};

    this.btnUndo;
    this.btnReply;
    this.bloksInfo;
    this.noOneHere;

    this.setVars = function(urlPhotoMy){
        $this.btnUndo=$('#encounters_undo');
        $this.btnReply=$('.btn_encounters');
        $this.bloksInfo=$('.encounters_info'),
        $this.noOneHere=$('.encounters_no_one_here');
        $this.$loader=$('#loader_btn');
        //console.log(urlPhotoMy);
    }

    this.setCurrentInfo = function(uid,pid){
        $this.uid=uid;
        $this.pid=pid;
        //if(window.history && history.pushState)
        //history.replaceState(history.state, document.title, url_main+'search_results.php?display=encounters&uid='+$this.uid);
    }

    this.setMutualAttractionUserEncounter = function(is, from, urlPhotoFrom, urlPhotoGender) {
        $this.attractionReplyFrom=from;
        $this.isMutualAttractionEncounter=is*=1;
        from=from?1:0;
        $this.isAttractionFrom=1*!is*from;

        //console.log($this.isMutualAttractionEncounter, $this.isAttractionFrom, $this.attractionReplyFrom, urlPhotoFrom, urlPhotoGender);
    }

    this.showMutualAttractionEncounters = function(isM){
        return;
        if ($this.isMutualAttractionEncounter||isM) {
            alertHtml('MATCH');
            //$this.$image.removeClass('right left hidden');
            //$('#bl_tinder').addClass('active').stop().css({opacity:1, visibility:'visible'});
        }
    }

    this.setParam = function(paramUid){
        $this.paramUid=paramUid;
    }

    this.initLazy = function(){
        var pl=getPlaceholderImage($this.pid),
            options={
                event:'load',
                effect_speed:0,
                load:function(){
                    $(this).fadeTo($this.dur,1);
                    if (--i) fr.css({backgroundImage:'none'});
                    el.trigger('appear');
                    fr.find('.name').fadeIn($this.dur);
                }
            }, el=$('.lazy_encounters').lazyload(options),
            fr=el.closest('.frame'), i=el.length;

        $('.lazy_encounters_carousel').lazyload({
            event:'load',
            effect_speed:0,
            load:function(){
                var el=$(this),id=el.parent('.encounters_carousel').attr('id');
                el.fadeTo($this.durCar,1);
                if(id=$this.pid)$('#encounters_select_'+id).fadeIn($this.durCar);
        }}).trigger('appear');
    }

    this.undoLike = function(){
        if($this.statusUndo){$this.likeToMeet(0,'undo')}
    }

    this.getParams = function(){
        $this.btnReply.prop('disabled',true);
        var uid,param='';
        if($this.cmd=='undo'){
            $this.statusUndo=false;
            uid=$this.uidUndo;
            if($this.paramUid*1&&$this.uidUndo==$this.paramUid*1){param='&uid='+$this.paramUid}
        }else{
            $this.uidUndo=$this.uid;
            uid=$this.uid;
        }
        return '&display=encounters&cmd_enc='+$this.cmd+'&reply_enc='+$this.status+'&uid_enc='+uid+param;
    }

    this.reload = function(data){
        $this.$loader.hide();
        $this.statusUndo=true;
        var dur=$this.dur*.6;
        if ($(data).filter('.enc_page_photo').find('.frame')[0]){
            if($('.encounters_no_one_here:visible')){
                $this.noOneHere.fadeOut(dur,function(){
                    $this.bloksInfo.fadeIn(dur);
                    $this.btnUndo.hide();
                });
            }
            var dataBlocks = {'.enc_page_info' : '#enc_page_info',
                              '.enc_page_photo' : '#enc_page_photo',
                              '.enc_page_carousel':'#enc_page_carousel',
            };
            insertFromDataHtmlToHtml(data,dataBlocks);
            $('.pl_photo_sm').fadeTo($this.dur,1);
            setTimeout($this.initLazy,10);
            $this.btnReply.prop('disabled',false);
            if($this.cmd=='undo'){$this.btnUndo.fadeOut($this.durCar)
            }else if($this.isReply){$this.btnUndo.fadeIn($this.durCar)}
            $('#encounter_box').fadeIn(dur);
            if($this.isReply){
                setTimeout(hidePartFilter,200);
                $this.isReply=false;
            }
        } else {
            $this.bloksInfo.fadeOut(dur,function(){
                if($this.isReply){
                    showPartFilter();
                    $this.isReply=false;
                }
                $this.noOneHere.fadeIn(dur);
            });
            //alertCustomRedirect(false,$this.langParts.everyone);
        }
    }

    this.likeToMeet = function(status,cmd){
        $this.cmd=cmd||'reply';
        $this.status=status;
        var isFrom=$this.isAttractionFrom&&status!='N'&&$this.cmd=='reply';
        if(isFrom)$this.showMutualAttractionEncounters(1);
        $this.isSend=true;
        $this.isReply=true;
        $this.btnUndo.hide();
        $this.$loader.show();
        searchResultsLoad();
    }

    $(function(){
        $this.initLazy();

        $('body').on('click', '.encounters_carousel', function(e){
            var el=$(this),pid=this.id,name=$('#encounters_name');
            name.fadeTo($this.dur,0);
            $('[id ^= encounters_photo_]:visible').fadeOut($this.dur,function(){
                $('#encounters_photo_'+pid).fadeIn($this.dur);
                name.fadeTo($this.dur,1);
            });
            $('#enc_page_photo .frame').css({width:'',height:''});
            $('.encounter_select:visible').fadeOut($this.dur*.5,function(){
                el.next('.encounter_select').fadeIn($this.dur*.5);
            });
            return false;
        })


    })

    return this;
}