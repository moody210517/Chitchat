var CSearchResults = function() {
    var $this = this, prevPL=[], nextPL=[];
    this.isAjax = true;
    this.wait = 4000;
    this.onPage = this.minOffset = this.emptyItems = this.total = 0;
    this.offset = 1;
    this.display = '';
    this.cmd = '';

    this.setData = function(data){
        for (var key in data) {
           $this[key] = data[key];
           console.log('SET DATA', key, data[key]);
        }
    }

    this.setOffset = function(offset){
		$this.minOffset=$this.offset=+offset;
        //var d=$this.minOffset>1?20:1;
        $('#wrapper').css({minHeight:'calc(100% + 1px)'});
    }

    this.initialContent=true;
    this.uploadContent=false;
    function ready(){if ($this.waiting) {clearTimeout($this.waiting); $this.waiting=0}};
    this.showNextPage = function(prev, force){
        force=force||0;
		//if ($this.waiting) return;
        if ($this.uploadContent) return;
        $this.uploadContent=true;
        var list=$('#search_users_list');
        if (!list[0]) return;//No one here yet
		var items=$('.users_list_item'),
            //itemsH=items.height(),
			n=items.length+$this.emptyItems,
			onLine=Math.round($this.$searchUsersList.width()/items.width()),
			onPage=Math.round($this.onPage/onLine-0.05)*onLine
			 + (prev? $this.emptyItems : (onLine-1-(n-1+$this.emptyItems)%onLine)),
			offset=prev?Math.max($this.minOffset-onPage, 1):($this.minOffset+n);
		//console.log('empty='+$this.emptyItems, $this.total, items.filter('.sliding')[0], 'offset='+offset, 'onPage='+onPage);
		if(offset>$this.total || (items.filter('.sliding')[0]&&!force)){
            $this.uploadContent=false;
            return;
        }
        console.log('LOAD_!!2');
		//$this.waiting=setTimeout(ready, $this.wait);

        var $loader=(prev?prevPL:nextPL);
        if($loader[0])$loader.addClass('show');

		list.removeClass('initial');
        $this.initialContent=false;
		$.post(activePage, {ajax:1, set_filter:0, offset:offset, on_page:onPage, display:$this.display}, function(data){
            //ready();
			var newItems = $(data).filter('.items');
			if (!newItems[0]) {
                $this.prepareNextLoader();
                return;
            }
			$('body').append(newItems.find('script'));
			newItems=newItems.find('.users_list_item').each(function(){
				if ($('#' + this.id)[0]) $(this).removeAttr('id');
			}).filter('[id]');

            if (!newItems[0]) {
                $this.prepareNextLoader();
                return;
            }

			list[prev?'prepend':'append'](newItems);
			if (prev) {
				$this.emptyItems=($this.minOffset-offset-newItems.length)%onLine;
				$this.$stContent[0].scrollTop+=1;
				$this.minOffset=offset;
			} else {
				$this.offset+=newItems.length;
				$this.$stContent[0].scrollTop+=items.height();
			}

            var maxVisItem=onPage*4;
            //if(maxVisItem<onPage)maxVisItem=onPage+10;

            var $items=$('li.users_list_item',$this.$searchUsersList),cItems=$items.length;
            if (cItems <= maxVisItem) {
                $this.prepareNextLoader();
                return;
            }

            var cDel=Math.floor((cItems-maxVisItem)/onLine);
            if (prev) {
                cItems -=cDel*onLine;
                $items.each(function(i){
                    if(i>=cItems){
                        //console.log('del1',i,cItems);
                        $this.offset -=1;
                        $(this).remove();
                        if(i==cItems){
                            $this.prepareNextLoader();
                        }
                    }
                })
            } else {
                $this.prepareNextLoader();
                /*cItems=cDel*onLine;
                $items.each(function(i){
                    if(i<cItems){
                        //console.log('del',i);
                        $this.minOffset++;
                        $(this).remove();
                    }else{
                        //console.log('del2',i);
                        $this.prepareNextLoader();
                        return false;
                    }
                })*/
            }

		})
    }

    this.prepareNextLoader = function(){
        if(nextPL[0]){
            var n=$('.users_list_item').length+$this.emptyItems;
            nextPL[($this.minOffset+n)>$this.total?'removeClass':'addClass']('vis')
        }
        $this.uploadContent=false;
    }

    this.setCookiePage = function(){
        var W=$win.width(), H=$win.height()-50, n=3, h=W/n*1.1;
        $.cookie('on_page', Math.ceil(H/h)*n);
        $.cookie('on_line', n);
    }

    this.pageBeforeUnload = function(){
        if($this.page[0]){
            var H=$win.height()-50, n=3,
                cel=$('li:visible', $this.$searchUsersList), h=cel.height(),
                offset=Math.round(($this.minOffset-1)/n-($this.page.offset().top-20)/h)*n,
                offsetMin=(Math.floor($this.total/n)-Math.round(H/h))*n;
            var cN='back_offset',prf=0;
            if(activePage=='mutual_attractions.php') {
                prf=$this.display ? '_'+$this.display : '_mutual_likes';
            } else if(activePage=='users_viewed_me.php'){
                prf='_profile_view';
            } else if(activePage=='my_friends.php'){
                prf='_my_friends';
            }

            prf&&(cN +=prf);

            $.cookie(cN, Math.min(offset, offsetMin)+1);
        }
    }

    this.removeLoader = function(){
        $('a.people_nearby_to_user').css({opacity:'1'});
        $('#loader_to_user').remove();
    }

    this.init = function(){
        if($this.minOffset)$('#main')[0].scrollTop=1;//($this.minOffset>1)*20;
        $this.setHashPage();
        $(function(){
            $this.pageInit();
        })
    }

	this.showPhoto=function($img,ol){
        //if($this.initialContent&&!ol)return;
        $img.removeClass('to_hide').closest('li').removeClass('sliding');
        /*setTimeout(function(){
            $img.closest('li').removeClass('sliding');
        },350)*/
        $('.loader_search_list.show').removeClass('show');
	}

    this.$stContent;
    this.page;
    this.pageOneInit = function(){
        $this.pageBl=$('.bl_list_photo');
        $this.page=$('#search_users_list');
        $this.$stContent=$('#main');
        $this.$searchUsersList=$('#bl_search_users_list');
        $this.$searchHead=$('#search_head');
        $this.$wrapper=$('#wrapper');
        //$this.loadPhoto($this.page);
		//if($this.minOffset>1)
        prevPL=getLoader('loader_search_list prev', false, true).insertBefore($this.page);
		//if($this.minOffset+$('li', $this.$searchUsersList).length<$this.total)
        var isNext=$this.minOffset+$('li', $this.$searchUsersList).length<$this.total;
        nextPL=getLoader('loader_search_list next', false, true).insertAfter($this.page)[isNext?'addClass':'removeClass']('vis');
        if(isNext&&$('li.users_list_item',$this.$searchUsersList).length<$.cookie('on_page'))$this.showNextPage(0,1);
    }

    this.pageInit = function(){
        console.log('SEARCH RESULTS DISPLAY', $this.display);
        if($this.display=='encounters')return;
        /* Search results */
        $this.pageOneInit();
        var dScroll=0;
 		$win.on('resize orientationchange', function(){
            //if(prevPL||nextPL)$contentMain.css({minHeight:$contentMain[0].offsetHeight+1});
            dScroll=$win.width()*.4;
			//$this.$stContent.scroll();
            $this.setCookiePage();
            $this.prepareHeaderDataFilter();
        }).resize();

        var startY=0,scrollTop=0,$wrapper=$('#wrapper'),
        fnNextPage=function(){
            if($this.uploadContent||$('li.sliding')[0]){
                scrollTop=$this.$stContent[0].scrollTop;
                return;
            }
            if($this.$stContent.is(':animated') || !$('#search_switch').is('.target')){//$this.uploadContent ||
                 scrollTop=$this.$stContent[0].scrollTop;
                 return;
            }
            if (!$this.$stContent[0].scrollTop && $this.minOffset>1 ) {
                $this.showNextPage(1);
            //}else if ($this.$stContent[0].scrollTop>=scrollTop &&
                      //$this.$stContent[0].clientHeight+$this.$stContent[0].scrollTop>($this.$searchUsersList.height()+20)) {
            }else if ($this.$stContent[0].scrollTop>=scrollTop &&
                      $this.$stContent[0].clientHeight+$this.$stContent[0].scrollTop>($wrapper.height()-dScroll)) {
                $this.showNextPage();
            }
            scrollTop=$this.$stContent[0].scrollTop;
        };

		$this.$stContent.on('scroll', function(e){
            fnNextPage();
        }).on('touchmove', function(e){
            var to=e.originalEvent.touches[0],y=to.pageY;
            if(!startY)startY=y;
            if(Math.abs(y-startY)>10){
                startY=0;
                fnNextPage();
            }
        }).on('touchend',function(e){
            scrollTop=startY=0;
        })
        //.animate({scrollTop: ($this.minOffset>1)*20},300);
		$win.on('beforeunload', $this.pageBeforeUnload);
	}

    this.setHashPage = function(){
        if (activePage=='search_results.php') {
            var id0=location.hash,id=clProfile.defaultHashPage['search_results'];
            if(id0 && !$this.uploadContentAjax && clProfile.isHashLoadPage('search_results',id0)){
                id=id0;
            }else{
                clProfile.setSearchDefaultTabs();
            }
            if(id=='#search'){
                $('#main_content_block').addClass('target');
            }else{
                $jq('#btn_show_filter').addClass('active')
            }
            $(id+'_switch').addClass('target');
            clProfile.curHash=id;
            clProfile.initHash();
        }else{
            clProfile.setHash('#search');
        }
    }

    this.showNoOneFound = function(){
        var $el=$('.no_one_found', '#search_switch');
        if($el.is('.to_show'))return;
        $el.removeClass('to_hide').delay(1).toggleClass('to_show',0);
    }

    this.hideNoOneFound = function(){
        var $el=$('.no_one_found', '#search_switch');
        if($el.is('.to_hide'))return;
        $el.toggleClass('to_show to_hide');
    }

    this.toProfileUser = function(link){
        $this.pageBeforeUnload();
        $(link).css({opacity:'.6', transition:'opacity .4s'})
               .closest('.users_list_item').append(getLoader('loader_user_search hidden',false,true).delay(1).removeClass('hidden',0));
        setErrorLoadPage(function(){
            $(link).css({opacity:'1', transition:'opacity .4s'}).closest('.users_list_item').find('.loader_user_search').remove();
        })
        //return;
        goToPage(link);
    }

    this.prepareHeaderDataFilter = function(){
        if($this.display)return;
        var $count=$jq('#search_head').find('.count'),
            wc=$count.find('span').width();
        $count.width(wc);
        $jq('#search_head').find('.info').width($jq('#search_head').width() - wc - 5);
    }

    /* Filter */
    this.showFilter = function(){
        $jq('#btn_show_filter').addLoader();
        showLayerBlockPageNoLoader();
        if($('#filter_switch').is('.target')){
            clProfile.setFnTabsEnd(function(){
                $jq('#btn_show_filter').removeLoader().removeClass('active');
            })
            setTimeout(function(){clProfile.loadTabs('#search')},180);
            setTimeout($this.prepareHeaderDataFilter,300);
        }else{
            clProfile.setFnTabsEnd(function(){
                $jq('#btn_show_filter').removeLoader().addClass('active');
                $this.$radius.change();
            })
            setTimeout(function(){clProfile.loadTabs('#filter')},180);
        }
    }

    this.setSliderRadius = function(radius) {
		radius *=1;
        var index='city',w=$this.$radius.width();
        if(radius>0)index = 'radius';
        if($this.isMaxFilterDistanceCountry && radius >= $this.maxRadius)index = 'country';
        $this.$radiusCountTitle.html($this.sliderTitles[index].replace('%1', radius));
		var d=20*(radius/$this.maxRadius-.54)+6;
		var left=$this.$radius[0].offsetWidth*radius/$this.maxRadius-d;
        if(left<6)left=6;
        if(left>(w-15))left=w-15;

        var leftPos=left-$this.$radiusCountTitle[0].offsetWidth/2+4;
		if((leftPos-10)<=0)leftPos=0;
		if((left+$this.$radiusCountTitle[0].offsetWidth/2)>=($this.$radius[0].offsetWidth-3)){
			leftPos=$this.$radius[0].offsetWidth-$this.$radiusCountTitle[0].offsetWidth;
		}
        if($('#filter_switch').is('.target')){
            $this.$radiusCount.css({left:leftPos+'px'});
            $this.$radiusCountDecor.css({left:left});
            $this.$radiusCount.add($this.$radiusCountDecor).delay(1).fadeTo(100,1);
        }
    }

    this.disabledOptionAge = function(){
        $jq('#p_age_from').find('option').toggleDisabled($jq('#p_age_to').val()*1,true);
        $jq('#p_age_to').find('option').toggleDisabled($jq('#p_age_from').val()*1,false);
    }

    this.initFilter = function(slRadius,maxRadius,isMaxFilterDistanceCountry){
        $this.sliderTitles={
            city:l('slider_in_the_whole_city'),
            radius:slRadius,
            country:l('slider_in_the_whole_country')
        }
        $this.maxRadius = parseInt(maxRadius);
        $this.isMaxFilterDistanceCountry = isMaxFilterDistanceCountry*1;

        $this.$radiusCount=$('#radius_slider .count');
		$this.$radiusCountTitle=$('#count_cont');
		$this.$radiusCountDecor=$('#radius_slider .count_decor');
        $this.$radius=$('#radius').on('change input', function(){
            $this.setSliderRadius(this.value);
        });

        $this.$nameKey=$('#filter_name_key');

        $('#p_age_from, #p_age_to').change($this.disabledOptionAge).change();

        var $frmFilter = $('#frm_filter'),
            $selectLocation = $('.location', $frmFilter),
            $country = $('#country'),
            $state = $('#state'),
            $city = $('#city'),
            $regionControl = $('#state, #city'),
            $radiusBl = $('#radius_bl'),
            $peopleNearby = $('#people_nearby');

        var fnSearchPeople= function(){
            if($peopleNearby.val()*1){
                $regionControl.hide();
                fnShowRadius(true);
            };
        }

        var fnShowRadius= function(val){
            $radiusBl[val?'show':'hide'](1,function(){
                $this.$radius.change();
            })
        }
        fnSearchPeople();
        if(!($peopleNearby.val()*1)&&$country.val()=='people_nearby'){
            $country.val(0)
        }

        $('#country, #state').change(function(){
            var cmd = $(this).data('location'),
            option='<option value="0">'+l('select_all')+'</option>';
            if(cmd=='geo_states' && this.value == 'people_nearby'){
                $peopleNearby.val(1);
                fnSearchPeople();
                return;
            }
            $peopleNearby.val(0);
            $regionControl.show();
            fnShowRadius(false);
            $.ajax({type: 'POST',
                    url: url_main+'search.php',
                    data: {cmd:cmd,
                           select_id:this.value,
                           filter:'1',
                           list:'0',
                           ajax:1},
                    beforeSend: function(){
                        $city.html(option);
                        $selectLocation.prop('disabled',true);
                    },
                    success: function(res){
                        var data=checkDataAjax(res);
                        if (data) {
                            if (cmd == 'geo_states') {
                                $state.html(option + data.list).prop('disabled',false);
                                $city.prop('disabled',false);
                            } else {
                                $state.prop('disabled',false);
                                $city.html(option + data.list).prop('disabled',false);
                            }
                        }
                        $country.prop('disabled',false);
                    },
                    complete: function(){
                    }
            })
        });

        $win.on('resize',function(){
            $this.$radius.change()
        });

        $city.change(function(){
            if($peopleNearby.val()*1)return;
            var val=this.value*1;
            fnShowRadius(val);
        }).change();

        $('#perform_action_search').click(function(){
            $this.hideNoOneFound();
            showLayerBlockPageNoLoader();
            var $btn=$(this).addLoader().prop('disabled', true);
            $jq('#frm_filter').ajaxSubmit({success: function(res){
                var data=checkDataAjax(res);
                if(data!==false){
                    var $data=$(data);
                    if ($this.display == 'encounters') {
                        clPhoto.updateEncounters($data);
                    }else{
                        $this.initialContent=true;
                        $this.onPage = $this.minOffset = $this.emptyItems = $this.total = 0;
                        $this.offset = 1;
                        prevPL = nextPL = false;
                        $jq('#search_switch').find('.loader_search_list').remove();
                        $jq('#search_head').empty().html($data.find('#search_head').html());

                        var $blPage=$data.find('.bl_list_photo');
                        $this.pageBl.empty().html($blPage.html());
                        if($data.find('.users_list_item')[0]){
                            //$data.find('#bl_search_users_list > script').appendTo('#bl_search_users_list');
                            //$this.page.addClass('initial').empty().append($data.find('.users_list_item'));
                            setTimeout($this.pageOneInit,100);
                        }
                    }
                    setTimeout(function(){
                        clProfile.setFnTabsEnd(function(){
                            $btn.removeLoader().prop('disabled', false);
                            $this.prepareHeaderDataFilter();
                            $jq('#btn_show_filter').removeClass('active');
                        })
                        clProfile.loadTabs('#search');
                    },200)
                } else {
                    hideLayerBlockPage();
                    $btn.removeLoader().prop('disabled', false);
                    serverError();
                }
            }})
            return false;
        })
    }
    /* Filter */

    $(function(){

    })

    return this;
}