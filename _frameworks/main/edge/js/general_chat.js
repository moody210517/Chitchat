var activePage= 'general_chat.php'
var CGeneralChat = function(uid, room, homePage) {

    var $this=this;

    this.uid = uid;
    this.lastId = 0;
    this.room = room;
    this.homePage = homePage;

    this.langParts = {};

    this.setLastId = function(lastId){
        $this.lastId = lastId*1;
        //console.log($this.lastId);
    }

    this.moduleChangeShow = function(dur){
        var dur=dur||300;
        $this.roomsItem.stop().animate({height:'toggle'},dur);
    }

    this.showSaver = function(){
        $this.dialogLoader.height($this.dialog[0].offsetHeight+50).fadeIn(150);
        $this.dialog.addClass('lighten');
        $this.frmChat.addClass('lighten');
    }

    this.hideSaver = function(){
        $this.dialogLoader.fadeOut(150);
        $this.dialog.removeClass('lighten');
        $this.frmChat.removeClass('lighten');
    }

    this.changeRoom = function(el, id){
        $this.stopUpdate();
        var oldRoom=$this.room;
        $this.room=id;
        $this.roomsItemShow.html(el.children('span').html());
        $('a.room_item.selected').removeClass('selected');
        el.addClass('selected');
        $this.moduleChangeShow(1);
        $this.msgText.val('').trigger('autosize');
        $this.showSaver();
        $.post(activePage+'?cmd=general_chat_change_room', {ajax:1, room:$this.room, room_old:oldRoom},
                function(res){
                    var data=checkDataAjax(res);
                    if (data){
                        var $data=$(trim(data));
                        //$this.scriptUpdate.append($data.filter('script'));
                        $this.$listUsers.html($data.filter('.dialog_users').html())
                                        .scrollTop($this.$listUsers[0].scrollHeight);
                        $this.dialog.html($data.filter('.dialog').html())
                                    .scrollTop($this.dialog[0].scrollHeight);
                        $this.hideSaver();
                    }
                    $this.initUpdate();
                });
        return false;
    }

    this.timeOut=5000;
    this.isUpdate=true;
    this.update = function(){
        if(!$this.isUpdate)return;
        $.post(activePage+'?cmd=general_chat_update', {ajax:1, room:$this.room, last_id:$this.lastId},
                function(res){
                    var data=checkDataAjax(res);
                    if (data){
                        data=trim(data)
                        if(data){
                            var $data=$(data);
                            $this.scriptUpdate.append($data.filter('script'));
                            var $users=$this.$listUsers.find('div.user_info'), t=300, i=0, $user;
                            (function fu(){
                                $user=$users.eq(i);
                                if(!$user[0]){
                                    return;
                                }; i++;
                                if(!$data.find('#'+$user[0].id)[0]){
                                    $user.slideUp({duration:t,
                                        step:function(){$this.$listUsers.scrollTop($this.$listUsers[0].scrollHeight)},
                                        complete: function(){
                                            $(this).remove();
                                    }});
                                }
                                fu();
                            })();

                            $users=$data.find('div.user_info');
                            i=0;
                            (function fu(){
                                $user=$users.eq(i);
                                if(!$user[0]){
                                    return;
                                }; i++;
                                if(!$this.$listUsers.find('#'+$user[0].id)[0]){
                                    $user.hide().appendTo($this.$listUsers).slideDown({duration:t*=.7, step:function(){
                                        $this.$listUsers.scrollTop($this.$listUsers[0].scrollHeight)}, complete: function(){
                                        fu();
                                    }});
                                }else{
                                    fu();
                                }
                            })();

                            var $items=$data.find('div.item'), t=300, i=0, $item;
                            (function fu(){
                                $item=$items.eq(i);
                                if(!$item[0]){
                                    return;
                                }; i++;
                                if (!$('#'+$item[0].id)[0] && !$('#general_chat_msg_'+$item.data('send'))[0]){
                                    $item.hide().appendTo($this.dialog).slideDown({duration:t*=.7, step:function(){
                                        $this.dialog.scrollTop($this.dialog[0].scrollHeight)}, complete: fu});
                                } else {fu()}
                            })();
                        }
                    }
                });
        $this.initUpdate();
    }

    this.initUpdate = function(){
        if(!ajax_login_status)return;
        $this.isUpdate=true;
        clearTimeout($this.timeOutChat);
        $this.timeOutChat=setTimeout('GeneralChat.update()',$this.timeOut);
    }

    this.stopUpdate = function(){
        $this.isUpdate=false;
        clearTimeout($this.timeOutChat);
    }

    this.sendMsg = function(){
        var msg=$.trim($this.msgText.val());
        if(!msg)return false;
        $this.msgText.val('').trigger('autosize');
        $this.prepareView();

        var send= +new Date,room=$this.room,
            $msg=$this.tmplMsg.clone().hide();
        $msg.attr({id:$msg[0].id+send, 'data-room':$this.room}).data('room', $this.room);
        var $time=$msg.find('.dash, .data').fadeTo(1,0),
            $node=$msg.find('.pp_message_node').html(strToHtml(msg));
        $msg.appendTo($this.dialog).slideDown({step:function(){
                $this.dialog.scrollTop($this.dialog[0].scrollHeight)}});
        $.post(activePage+'?cmd=general_chat_send', {ajax:1, messages:msg, room:$this.room, send:send},
                function(res){
                    var data=checkDataAjax(res);
                    if (data && room==$this.room){
                        data = trim(data);
                        if (data == 'system_user_banned') {
                            //$msg.slideUp();
                            alertCustomRedirect($this.homePage, $this.langParts['user_ban'], $this.langParts['ooops']);
                        } else {
                            var $data=$(data), node=$data.find('.pp_message_node').html();
                            if(node!=$node.html()){
                                //console.log('replace');
                                $node.html(node);
                            }
                            $msg.find('.data').text($data.find('.data').text());
                            $time.fadeTo(200,1);
                        }
                    }
                });
        return false;
    }


    this.prepareView = function(){
        $this.d=184+$this.content.offset().top;
        $this.h=$this.hv=$win.innerHeight()-$this.d;
        $this.chatsBl.height($this.h);
        $this.dialog.scrollTop($this.dialog[0].scrollHeight);
    }

    $(function(){
        $this.content=$('.column_main').css({backgroundColor:'#F1F1F1', paddingBottom:'25px'});
        $this.tmplMsg=$('#tmpl_message > .item');
        $this.roomsItem=$('#rooms_item');
        $this.roomsItemShow=$('#rooms_item_show');
        $this.dialog=$('#general_chat_dialog');
        $this.$listUsers=$('#general_chat_users');
        $this.chatsBl=$('#general_chat_dialog, #general_chat_users');
        $this.$listUsers.scrollTop($this.$listUsers[0].scrollHeight);

        $this.prepareView();

        $('.general_chat').css({opacity:1});

        $this.chatsBl.on('mouseenter mouseleave', function(e){
            isDisableSmoothScroll=e.type=='mouseenter';
        }).on('wheel mousewheel', function(e){
            if(e.ctrlKey)return;
            var $el=$(this);
            if($el[0].offsetHeight==$el[0].scrollHeight)return;
            if (($el[0].scrollTop == 0 && e.deltaY < 0) ||
                (e.deltaY > 0 && $el[0].scrollHeight == ($el[0].scrollTop + $el[0].offsetHeight))) {
                e.preventDefault();
            }
        })

        $this.frmChat=$('#frm_general_chat');
        $this.dialogLoader=$('#general_chat_dialog_loader');

        $('#rooms').hover(
            function(e){if($(e.target).not('.selected')){$this.moduleChangeShow()}},
            function(){if ($('#rooms_item:visible')[0]){$this.moduleChangeShow()}}
        )

        var hPrev=0;
        function resizeInput() {
            var $el=$(this), h=$el.height();
            if(h>72&&h>hPrev){
                $this.hv -=18;
                $this.chatsBl.height($this.hv);
                $this.chatsBl.scrollTop($this.dialog[0].scrollHeight);
            }else{
                $this.prepareView();
            }
            hPrev=h;
        }

        $this.msgText=$('#msg_text').keydown(doOnEnter($this.sendMsg))
                                    .autosize({isSetScrollHeight:false,callback:resizeInput})
                                    .focus();
        $this.scriptUpdate=$('#general_chat_ajax');
        $this.initUpdate();

        $win.on('resize', $this.prepareView)
        .on('beforeunload', function(){
            setCookie('general_chat_logout', 'logout', {path:'/'});
        })

    })

    return this;
}