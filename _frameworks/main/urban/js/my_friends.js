var CMyFriends = function(on_page, show) {

    var $this=this;

    this.on_page=on_page*1;
    this.show=show;
    this.rank=0;
    this.isLoad=false;
    this.stop;
    this.langParts={};

    alertHtmlArea='.column_main';

    this.setRank = function(rank){
        $this.rank=rank*1;
    }

    this.setParam = function(stop){
        $this.stop=stop*1;
    }

    this.loaderListUser = function(on_page){
        if($this.isLoad||!$this.stop)return;
        var on_page=on_page||$this.on_page,loader=$('#load_animation');
        if($this.rank<0)$this.rank=0;
        $.ajax({type:'POST',url:url_main+'my_friends.php', data:{ajax:1, show:$this.show, on_page:on_page, rank:$this.rank},
            beforeSend:function(){$this.isLoad=true;loader.slideDown(durLoaderSvg);},
            success:function(data){
                data=checkDataAjax(data);
                if(data!==false){
                    $this.showItems(data);
                    loader.slideUp(durLoaderSvg);
                }else{isLoad=false}
            }
        })
    }

    hideItemListUser=this.hideItemListUser = function(uid){
        $this.rank--;
        var isPending=isPending||0,isFriendsPage=isFriendsPage||0;
        $('#friend_user_'+uid).slideUp(durItemsDeleteList,function(){
            $(this).remove();
            var items=$('[id ^= friend_user_]:visible');
            items.first().removeClass('item_border_top').addClass('item_border_none');
            updateCounterTitle('#narrow_private_photo_count',true);
            updateCounterTitle('#narrow_friends_count',true);
            if(!items[0]){alertCustomRedirect()
            }else{$this.loaderListUser(1)}
        });
    }

    this.confirmDisallowPrivatePhoto = function(uid){
        confirmCustom(ALERT_HTML_ARE_YOU_SURE, function(){$this.disallowPrivatePhoto(uid)}, ALERT_HTML_ALERT);
    }

    this.ajaxDisallow = {};
    this.disallowPrivatePhoto = function(uid){
        if($this.ajaxDisallow[uid])return;
        $this.ajaxDisallow[uid]=1;
        var btn=$('#friends_see_private_photo_btn_'+uid),isPending=isPending*1;
        confirmHtmlClose();
        btn.prop('disabled',true);
        $.post(url_main+'ajax.php',{cmd:'send_request_private_access',type:'request_declined',user_to:uid,mid:0},
            function(res){
                if(checkDataAjax(res)){
                    $this.hideItemListUser(uid)
                }else{btn.prop('disabled',false)}
                $this.ajaxDisallow[uid]=0;
        })
    }

    this.ajaxRequest = {};
    this.approve = function(uid, isMenuHide, $link){
        if($this.ajaxRequest[uid])return;
        $this.ajaxRequest[uid]=1;
        $link=$link||[];
        var $loader=[];
        var $item=$('#friend_user_'+uid);
        if(!(isMenuHide||0)){
            visitorOrMenuNotHover=true;
            $item.find('.visitors_or_item').stop().animate({height:'toggle'},300,function(){
                $('li.approve_friend',this).remove();
                $('a.delete',this).text($this.langParts.unfriend);
                visitorOrMenuNotHover=false;
            });
        }else{
            $item.find('li.approve_friend').remove();
            $item.find('a.delete').text($this.langParts.unfriend);
            if ($link[0]&&$link.is('.approve_friend_one')) {
                $link.append($loader=getLoader('loader_approve_friend_one'));
            }
        }
        $this.rank--;
        $.post(url_main+'my_friends.php',{ajax:1,action:'approve',uid:uid,show:$this.show,on_page:1,rank:$this.rank},
            function(res){
                var data=checkDataAjax(res);
                if(data){
                    $this.hideItem(uid,data,'approve');
                }
                $this.ajaxRequest[uid]=0;
                setTimeout(function(){
                    $loader[0]&&$loader.remove();
                },1000)
        })
    }

    this.confirmRemoveFriend = function(uid){
        confirmCustom(ALERT_HTML_ARE_YOU_SURE, function(){$this.removeFriend(uid)}, ALERT_HTML_ALERT);
    }

    this.removeFriend = function(uid){
        confirmHtmlClose();
        var isPending=$('#friend_user_'+uid).data('pending'), action=isPending?'decline':'remove';
        $this.rank--;
        $.post(url_main+'my_friends.php',{ajax:1,action:action,uid:uid,show:$this.show,on_page:1,rank:$this.rank},
            function(res){
                var data = checkDataAjax(res);
                if(checkDataAjax(res)){
                    $this.hideItem(uid,data,action);
                }
        })
    }

    // Надо сделать так везде -1 аякс запрос
    this.showItems = function(data){
        var list=$($.trim(data)).filter('.items'),
            users=list.find('.item').hide(),t=durItemsAddListToScroll,i=0;
        list.find('script').appendTo('#my_friends_user_list');
        $this.isLoad=false;
        (function fu(){
            var item=users.eq(i),id=item.attr('id');
            if(!$('#'+id)[0]){
                item.appendTo('#my_friends_user_list').slideDown(t*=.8, function(){
                    i++; fu();
                });
            }else if(item[0]){i++; fu();}
        })()
    }

    this.hideItem = function(uid, data, action){
        $('#friend_user_'+uid).slideUp(durItemsDeleteList,function(){
            var $item=$(this), items=$('[id ^= friend_user_]:visible');
            items.first().removeClass('item_border_top').addClass('item_border_none');
            var inc=true;
            if(action=='approve')inc=false;
            if(action!='decline')updateCounterTitle('#narrow_private_photo_count',inc);
            if(action!='approve')updateCounterTitle('#narrow_friends_count',true);
            if(action=='approve'){
                var $friends=$('[data-pending="0"]');
                if($friends[0]){
                    $this.rank++;
                    var $info=$item.find('.info'), $p=$('p',$info);
                    $('.pl_new',$info).remove();
                    $p.last().remove();
                    $p.first().addClass('one');
                    $item.attr('data-pending',0).data('pending',0)
                         .insertBefore($friends.eq(0)).slideDown(durItemsDeleteList);
                    if(!$('[data-pending="1"]')[0]){
                        $item.next().removeClass('item_border_none').addClass('item_border_top');
                    }else{
                        $item.removeClass('item_border_none').addClass('item_border_top');
                    }
                }else{
                    $item.remove();
                    $this.showItems(data);
                }
            }else{
                if(!items[0]){
                    alertCustomRedirect()
                }else {
                    $item.remove();
                    $this.showItems(data);
                }
            }
        });
    }

    $(function(){
        $win.scroll(function(){
            if(($win.scrollTop()>$(document).height()-$win.height()-deltaScroll)&&!$this.isLoad&&$this.stop){
                $this.loaderListUser();
            }
        })
    })

    return this;
}