var CRatePeople = function(average) {

    var $this=this;

    this.pl=url_tmpl_main+'images/lazy_loader.gif';
    this.uid;
    this.pid;
    this.dur=400;
    this.rating_info={};
    this.rate;
    this.langParts={};
    this.average=average;
    this.hide_rating_info=false;
    this.isSend=false;
    this.isReply=false;

    this.info_photo;
    this.info_rate;
    this.info_box;
    this.info_slider;
    this.info_slider_span;
    this.info_average;
    this.all_blocks_rate;
    this.info_img;
    this.noOneHere;
    this.info_count;

    this.setVars = function(){
        $this.info_photo=$('#enc_page_photo');
        $this.info_rate=$('#rate_people_list_rate > li');
        $this.info_box=$('#rating_info');
        $this.info_slider=$('#rating_info_slider');
        $this.info_slider_span=$('#rating_info_slider_span');
        $this.info_average=$('#rating_info_average');
        $this.all_blocks_rate=$('.rate_people_info');
        $this.info_img=$('#rating_info_img');
        $this.noOneHere=$('.encounters_no_one_here');
        $this.loader=$('#loader_btn');
    }

    this.setCurrentInfo = function(uid,pid){
        $this.uid=uid;
        $this.pid=pid;
        //if(window.history && history.pushState)
        //history.replaceState(history.state, document.title, url_main+'search_results.php?display=rate_people&uid='+$this.uid);
    }

    this.setRatingInfo = function(data){
        $this.rating_info=data;
    }

    this.initLazyRatePeople = function(){
        var pl=getPlaceholderImage($this.pid);
        $('.lazy_rate_people').lazyload({skip_invisible:false,
                                         event:'load',
                                         effect_speed:0,
                                         //placeholder:pl,
                                         failure_limit:1,
                                         load:function(){
                                            var el=$(this);
                                            el.closest('.frame').css({height:'auto',width:'auto',lineHeight:'0'})
                                              .find('.name').fadeIn($this.dur);
                                            el.fadeTo($this.dur,1);
                                        }});
    }

    this.setInfoBox = function(){
        $this.info_box.find('.info span').text($this.rating_info.next_see);
        $this.info_slider.css('width',$this.rating_info.next_slider+'%');
        $this.info_slider_span.text($this.rating_info.next_see);
    }

    this.getParams = function(){
        return '&display=rate_people&rate='+$this.rate+'&photo_user_id='+$this.uid+'&photo_id='+$this.pid;
    }

    this.reload = function(data){
        $this.loader.hide();
        var dur=$this.dur*.6;
        if ($(data).filter('.enc_page_photo').find('.frame')[0]){
                if($('.encounters_no_one_here:visible')){
                    $this.noOneHere.fadeOut(dur,function(){
                        $this.all_blocks_rate.fadeIn(dur);
                    });
                }
                $this.info_photo.html($(data).filter('.enc_page_photo')).find('img').attr('src');
                //setTimeout($this.initLazyRatePeople,10);
                if ($('img', $this.info_photo)[0].complete) $('.frame', $this.info_photo).css({backgroundImage:'none'});
                if($.isEmptyObject($this.rating_info)){
                    $this.hide_rating_info=true;
                    $this.rating_info.next_see='';
                    $this.info_box.find('div.info').text($this.langParts.your_rating);
                    $this.rating_info.next_slider=100;
                    $this.setInfoBox();
                    $this.info_average.text($this.average);
                    $this.info_img.css('cursor','pointer').on('click',function(){
                        window.location.href=url_main+'profile_view.php?show=gallery&photo_id='+$(this).data('photoId');
                    });
                }else{$this.setInfoBox()}
                $this.info_rate.removeClass('ajax');
                $('#encounter_box').fadeIn(dur);
                if($this.isReply){
                    setTimeout(hidePartFilter,200);
                    $this.isReply=false;
                }
        } else {
            $this.all_blocks_rate.fadeOut(dur,function(){
                if($this.isReply){
                    showPartFilter();
                    $this.isReply=false;
                }
                $this.noOneHere.fadeIn(dur);
            });
            //alertCustomRedirect(false,$this.langParts.everyone);
        }
    }

    this.setRated = function(n){
        var el=$('#rate_people_b_'+n);
        if(el.hasClass('ajax'))return;
        $this.info_rate.addClass('ajax');
        $this.isSend=true;
        $this.isReply=true;
        $this.rate=n;
        if($this.hide_rating_info){
            $this.hide_rating_info=false;
            $this.info_box.fadeOut($this.dur);
        }
        $this.loader.show();
        searchResultsLoad();
    }

    $(function(){
        document.cookie=getCookieRecord($this.pid);
        $this.initLazyRatePeople($this.pl);

        $('#rate_people_list_rate > li').on('mouseenter mouseleave',function(e){
            var el=$(this);
            if(e.type=='mouseenter'){
                el.addClass('selected').prevAll().addClass('selected');
            }else{el.removeClass('selected').prevAll().removeClass('selected')}
        }).on('click',function(){
            $this.setRated($(this).index()+1);
            return false;
        })
    })

    return this;
}