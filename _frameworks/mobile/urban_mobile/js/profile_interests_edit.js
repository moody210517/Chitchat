var CInterests = function() {

    var $this=this;

    this.langParts = {};
    this.isAjax={more:0}
    this.step={};
    this.newInterest = '';

    this.init = function(){
        $this.curId = 0;
        $this.$listCategory = $('#list_category_custom');
        $this.$listCategoryLi = $('#list_category_custom > li');
        $this.$listItemCategory = $('ul.list_link_interest');
        $this.$newInterestText = $('#new_interest_text');
        $this.$searchBox = $('#list_search_box');
        $this.$searchBoxItem = $('#list_search_item');
        $this.$categoryInterests = $('#list_category');
        $this.$listUserInterests = $('#list_interest_user');
        $this.$stContent = $('.st-content');
        $this.$shadow = $('#shadow_block');
    }

    this.changeCategory = function(id){
        var cat=$('#category_'+id);
        if(!cat.hasClass('selected')){
            var sel=$this.$listCategory.find('li.selected').removeClass('selected'),
                span=sel.find('span'),
                cls=span.attr('class'),
                cl=cls.replace(/_selected/, '');
            span.removeClass(cls).addClass(cl);

            span=cat.addClass('selected').find('span');
            cl=span.attr('class');
            span.removeClass(cl).addClass(cl+'_selected');

            $this.$listItemCategory.hide();
            $('#category_item_'+id).show();
        }
    }

    this.moreItemCategory = function(id,link){
        if($this.isAjax['more'])return;
        var linkMore=link.parent('li'),
            listItem = $('#category_item_'+id);/*,
            lastId=function(){
                var lid=0,i=1;
                listItem.find('a.add_new_interest').each(function(){
                    if(i){i=0; lid=$(this).data('intId');
                    }else if(lid>$(this).data('intId')){
                        lid=$(this).data('intId');
                    }
                });
                return lid;
            };*/
        linkMore.addClass('more_no_refresh').append(getLoaderCl(+new Date,'loader_interest_more'));
        listItem.fadeTo(0,.6);
        $this.isAjax['more']=1;
        $this.step[id]=($this.step[id])?$this.step[id]+1:1;
        $.post(url_page,{cmd:'more_interests',ajax:1,cat_id:id,step:$this.step[id]},function(res){
            $this.isAjax['more']=0;
            listItem.fadeTo(0,1);
            linkMore.find('.loader_interest_more').remove().end().removeClass('more_no_refresh');
            var data=checkDataAjax(res);
            if(data!==false){
                listItem.find('li:not(.more)').remove();
                linkMore.before(data);
            }else{tools.showServerError()}
        })
    }

    this.confirmDeleteOneInterest = function(id){
        $this.curId = id;
        showConfirm($this.langParts.delete_this_interest, $this.langParts.ok, $this.langParts.cancel, $this.deleteOneInterest);
    }

    this.deleteOneInterest = function(){
        var id = $this.curId;
        hideConfirm();
        if(id){
            $.post(url_page,{cmd:'delete_interest',ajax:1,id:id},function(res){
                var data=checkDataAjax(res);
                if(data!==false){
                    $('#user_iterest_'+id).animate({width:'0px'},500,function(){
                        $(this).remove();
                    });
                }else{tools.showServerError()}
            })
        }
    }

    this.addInterestCustom = function(value,cat,link,loader,isNew){
        var isNew=isNew||false,
            loader=loader?'loader_interest_search':'loader_interest',
            linkMore=link.parent('li');
        if(linkMore.find('.'+loader)[0])return;
        var ind=+new Date;
            link.addClass('active');
            linkMore.append(getLoaderCl(ind,loader));
        $.post(url_page,{cmd:'add_new_interest',ajax:1,value:value,cat_id:cat},function(res){
            hideLoaderCl(ind);
            link.removeClass('active');
            var data=checkDataAjax(res);
            if(data!==false){
                if(isNew){
                    $this.$categoryInterests.hide();
                    $this.$shadow.hide();
                    $this.newInterest='';
                    $this.$newInterestText.val('');
                }
                data=$.trim(data);
                if(data!=''){
                    var $data=$(data).css({width:'0px'}),
                        $title=$data.find('span.interest_title');
                    $data.prependTo('#list_interest_user')
                    .animate({width:'50%'},400,function(){$this.clipUserOneInterest($title)});//
                }
            }else{tools.showServerError()}
        });
    }

    this.showCatInterests = function(){
        $this.$searchBox.hide(1,function(){
            $this.$categoryInterests.show();
            $this.$shadow.show();
            $this.scrollPopupBox();
        });
    }

    this.searchInterest = function(){
        if($this.newInterest==''){
            $this.clearSearchInput();
            return;
        }
        $.post(url_page,{cmd:'search_interests',ajax:1,value:$this.newInterest},function(res){
            var data=checkDataAjax(res);
            if(data!==false){
                if(data==''){$this.clearSearchInput()
                }else{
                    if ($('<ul>'+data+'</ul>').find('li').length == 1){
                        data = '<li><a href="">'+$this.langParts['not_found']+'</a></li>' + data;
                    }
                    $this.$searchBoxItem.html(data).parent('.pp_interests_search').show(1,function(){
                        $this.scrollPopupBox();
                    });
                }
            }else{tools.showServerError()}
        })
    }

    this.scrollPopupBox = function(top){
        $this.$stContent.animate({scrollTop:$this.$newInterestText.offset().top+$this.$stContent[0].scrollTop-50},400);
    }

    this.clearSearchInput = function(){
        $this.$searchBoxItem.html('').parent('.pp_interests_search').hide();
    }

    this.clipUserInterest = function(){
        $this.$listUserInterests.find('span.interest_title').each(function(){
            $this.clipUserOneInterest($(this));
        })
    }

    this.clipUserOneInterest = function(el){
        var w=el.width();
        if (el.closest('li').width()<(w+72)){
            el.width(w).css({whiteSpace:'nowrap'});
        }
    }

    $(function(){
        $this.init();

        $this.$newInterestText.on('keyup', function(e){
            $this.newInterest=$.trim($(this).val());
            $this.searchInterest();
        })

        $this.$shadow.on('click',function(){
            if ($this.$categoryInterests.is(':visible')) {
                $this.newInterest='';
                $this.$newInterestText.val('');
                $this.$categoryInterests.hide();
                $(this).hide();
            }
        });

        $this.clipUserInterest();

        $(window).on('resize orientationchange',function(){
            $this.$listUserInterests.find('span.interest_title').each(function(){
                $(this).width('').css({whiteSpace:'normal',width:'auto'});
                $this.clipUserOneInterest($(this));
            })
        })

        $('body').on('click', '.interest_delete, .link_more, .show_cats_interests, .add_new_interest, .add_new_interest_to_cat, .change_cat',  function(e){
            var el=$(this)

            if(el.is('.interest_delete')){
                var id=el.data('id');
                $this.confirmDeleteOneInterest(id);
                return false;
            }

            if(el.is('.link_more')){
                var id=el.data('id');
                $this.moreItemCategory(id,$('#link_more_'+id));
                return false;
            }

            if(el.is('.show_cats_interests')){
                $this.showCatInterests();
                return false;
            }

            if(el.is('.add_new_interest')){
                var catId=el.data('catId');
                $this.addInterestCustom(el.text(),catId,el,0);
                return false;
            }

            if(el.is('.add_new_interest_to_cat')){
                var catId=el.data('catId');
                $this.addInterestCustom($this.newInterest,catId,el,1,1);
                return false;
            }

            if(el.is('.change_cat')){
                var catId=el.data('catId');
                $this.changeCategory(catId);
                return false;
            }

        })
    })

    return this;
}