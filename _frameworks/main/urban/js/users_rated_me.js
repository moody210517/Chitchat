var CUsersRatedMe = function(on_page_default) {

    var $this=this;

    this.isLoad=false;
    this.offset;
    this.on_page_default=on_page_default;
    this.last_id
    this.j;
    this.items;

    alertHtmlArea='.column_main';

    this.setOffset = function(offset){
        $this.offset=offset;
    }

    this.setLastId = function(last_id){
        $this.last_id=last_id;
    }

    this.loaderUsersList = function(on_page,fn){
        var fn=fn||false;
        if($this.offset=='no'){
            if(fn){$this.j++;$this.hideBlockedUser();}
            return
        };
        var on_page=on_page||$this.on_page_default,loader=$('.load_animation');
        $.ajax({type:'POST', url:url_main+'users_rated_me.php', data:{ajax:1,on_page:on_page,id:$this.last_id},
                beforeSend:function(){$this.isLoad=true;loader.slideDown(100);},
                success:function(data){
                    $this.isLoad=false;
                    var list=$($.trim(data)),users,t=200,i=0;
                    list.filter('.pages').appendTo('#users_rated_me_list');
                    users=list.filter('.items').find('.item').hide();
                    (function fu(){
                        var item=users.eq(i),id=item.attr('id');
                        if(!$('#'+id)[0]){
                            item.appendTo('#users_rated_me_list').slideDown(t*=.8, function(){
                                i++; fu();
                                //container:'#users_rated_me_list',
                                //item.find('img').lazyload({container:item,effect:'fadeIn',effect_speed:400});
                                if(fn){$this.j++;$this.hideBlockedUser();}
                            });
                        }else if(item[0]){i++;fu();}
                        if($this.offset=='no'&&fn){$this.j++;$this.hideBlockedUser();}
                    })()
                    loader.slideUp(100);
                }
        })
    }

    this.confirmHideUser = function(id){
        confirmCustom(ALERT_HTML_ARE_YOU_SURE, function(){$this.hideUser(id)});
    }

    this.hideUser = function(id){
        confirmHtmlClose();
        $.post(url_ajax,{cmd:'hide_rated_me_item',id:id},function(res){
            var count=checkDataAjax(res);
            if(count!==false){
                $('#users_rated_me_item_'+id).slideUp(300,function(){
                    $(this).remove();
                    var items=$('[id ^= users_rated_me_item_]:visible');
                    items.first().removeClass('item_border_top').addClass('item_border_none');
                    updateCounterRated(count);
                    if(!items[0]){alertCustomRedirect()
                    }else{$this.loaderUsersList(1)}
                });
            }
        })
    }

    this.confirmBlockedUser = function(uid){
        confirmCustom(ALERT_HTML_ARE_YOU_SURE,function(){$this.blockedUser(uid)});
    }

    this.blockedUser = function(uid){
        confirmHtmlClose();
        $this.j=0;
        $this.items=$('.users_rated_me_item_'+uid);
        confirmHtmlClose();
        $.post(url_ajax,{cmd:'block_user_rated_photo',user_id:uid},function(res){
            var count=checkDataAjax(res);
            if(count!==false){
                Messages.number_blocked_users++;
                $('#narrow_blocked_count').text(Messages.number_blocked_users);//user_block_list_count
                $this.hideBlockedUser();
                updateCounterRated(count);
            }
        })
    }

    this.hideBlockedUser = function(){
        var t=300,item=$this.items.eq($this.j);
        item.slideUp(t*=.8,function(){
            item.remove();
            var items=$('[id ^= users_rated_me_item_]:visible');
                items.first().removeClass('item_border_top').addClass('item_border_none');
            if(!items[0]){alertCustomRedirect()
            }else{$this.loaderUsersList(1,true)}
        });
    }

    $(function(){
        $win.scroll(function(){
            if(($win.scrollTop()>$(document).height()-$win.height()-800)&&!$this.isLoad&&$this.offset!='no'){
                $this.loaderUsersList();
            }
        })
    })

    return this;
}