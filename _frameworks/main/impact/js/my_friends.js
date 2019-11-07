var CMyFriends = function(on_page, show) {

    var $this=this;

    this.on_page=on_page*1;
    this.show=show;
    this.rank=0;
    this.isLoad=false;
    this.stop;
    this.langParts={};

    this.setRank = function(rank){
        $this.rank=rank*1;
    }

    this.setParam = function(stop){
        $this.stop=stop*1;
    }

    this.loaderListUser = function(on_page){
        if($this.isLoad||!$this.stop)return;
        var on_page=on_page||$this.on_page;
        if($this.rank<0)$this.rank=0;
        $.ajax({type:'POST',url:url_main+'my_friends.php', data:{ajax:1, show:$this.show, on_page:on_page, rank:$this.rank},
            beforeSend:function(){
                $this.isLoad=true;
                $jq('#loader_base_page').removeClass('hidden');
            },
            success:function(data){
                $jq('#loader_base_page').addClass('hidden');
                data=checkDataAjax(data);
                if(data!==false){
                    var list=$(trim(data)),users,t=200,i=0;
                    list.find('script').appendTo('#page_list_users');
                    users=list.filter('.items').find('.item').hide();
                    (function fu(){
                        var item=users.eq(i);
                        if(!item[0]){
                            $this.isLoad=false;
                            return;
                        }
                        if(!$('#'+item.attr('id'))[0]){
                            item.appendTo('#page_list_users').slideDown(t*=.8, function(){
                                $(this).removeAttr('style');
                                i++; fu();
                            })
                        }else if(item[0]){
                            i++; fu();
                        }
                    })()
                }else{
                    $this.isLoad=false;
                }
            }
        })
    }

    this.confirmDisallowPrivatePhoto = function(uid){
        confirmCustom(ALERT_HTML_ARE_YOU_SURE, function(){$this.disallowPrivatePhoto(uid)}, ALERT_HTML_ALERT);
    }

    this.disallowPrivatePhoto = function(uid){
        $this.isLoad=true;
        closeAlert();
        var $btn=$('#disallow_btn_'+uid).prop('disabled',true);
        $btn.find('span').fadeTo(0,0);
        $btn.append(getLoader('loader_btn_list_md'));
        $this.rank--;
        $.post(url_main+'my_friends.php?cmd=send_request_private_access',
            {type:'request_declined',
             user_to:uid,
             mid:0,
             ajax:1,
             show:$this.show,
             on_page:1,
             rank:$this.rank},
            function(res){
                var data=checkDataAjax(res)
                if(data){
                    updateCounterTitle('#narrow_private_photo_count',true);
                    $('#friend_user_'+uid).slideUp(durRemoveListItem, 'easeOutCirc', function(){
                        $(this).remove();
                        var list=$($.trim(data));
                        list.find('script').appendTo('#page_list_users');
                        var user=list.find('.item');
                        if(user[0]){
                            user.hide().appendTo('#page_list_users').slideDown(200,function(){
                                $(this).removeAttr('style')
                            })
                        }
                    })
                }else{
                    $btn.prop('disabled',false);
                    $btn.find('.loader_btn_list_md').remove();
                    $btn.find('span').fadeTo(0,1);
                    alertServerError(true);
                }
                $this.isLoad=false;
        })
    }

    $(function(){
        $jq('.main').scroll(function(){
            if($jq('.main').scrollTop()>($('.column_main').height()-$jq('.main').height()-1000)
                &&!$this.isLoad&&$this.stop){
                $this.loaderListUser();
            }
        })
    })

    return this;
}