var isDots=false,step={};
$(function(){
var listInterests = $('.more_interests_item'),
    interests_loader = $('#interests_loader'),
    add_iterests_input = $('#add_interests'),
    add_interests_drop_list = $('#add_interests_drop_list'),
    $currentInsert,
    isAjax={};

    function setPositionListInterest(el){
        var list_more=el.children('.more_interests'),
            d=$('.list_interest').height()-(el[0].offsetTop-58)-list_more.height();
        if(d<0){list_more.css({top:d+'px'})}
    }

    function hideListInterests(el){
        listInterests.removeClass('selected').children('.more_interests').hide();
        setPositionListInterest(el);
        el.addClass('selected').children('.more_interests').show();
    }

    listInterests.eq(0).addClass('selected').children('.more_interests').show();

    add_iterests_input.keyup(function(e){
        var interest = $.trim($(this).val());
        if (isKeyPressed(e, 13) && interest != '') {
            $(this).blur();
            add_interests_show_category(interest);
        } else {
            $.post('ajax.php',{cmd:'search_interests',value:interest},function(res){
                var data=checkDataAjax(res);
                if(data!==false){
                    $('#add_interests_drop').html(data).closest('#add_interests_drop_list').show();
                }else{
                    //Error
                }
            })
        }
    }).blur(function(){
        setTimeout(function(){
            add_interests_drop_list.delay(100).hide()
        }, 200);
    });

    $('body').on('click', '#list_interest_user > li, .more_interests_item, .add_new_interest_search, #add_new_interest_one', function(e){
        var el=$(this),target=$(e.target);
        if(el.is('#list_interest_user > li')){
            alertHtmlArea = '.column_main';
            confirmCustom(l_delete_this_interest, delete_interests, l_delete_interests);
            $currentInsert = $(this).data('interestId');
            return false;
        }

        if(el.is('.add_new_interest_search')){
            add_interests_custom($.trim(el.children('span').text()),el.data('catId'));
        }

        if(el.is('#add_new_interest_one')){
            add_interests_show_category($.trim(add_iterests_input.val()));
            return false;
        }

        if(el.is('.more_interests_item')){
            if(target.is('.add_new_interest')){
                add_interests_custom($.trim(target.text()),target.data('catId'));
            } else if (target.is('.more_interests_link')) {                
                var elm=target.closest('.more_interests'), catId=elm.data('catId');
                if(isAjax[catId])return;
                isAjax[catId]=1;
                elm.find('li.add_new_interest_li').fadeTo(0,.6);
                var last=elm.find('a.more_interests_link').toggleClass('more_interests_loader');
                step[catId]=(step[catId])?step[catId]+1:1;
                $.post(url_main+'ajax.php',{cmd:'more_interests', step:step[catId], cat_id:catId},function(res){
                    isAjax[catId]=0;
                    last.toggleClass('more_interests_loader');
                    var data=checkDataAjax(res);
                    if(data!==false){
                        elm.find('.add_new_interest_li').remove();
                        target.before(data);
                        setPositionListInterest(el);
                    }else{
                        //Error
                    }
                })
            } else {
                hideListInterests(el);
            }
            return false;
        }
    })

    function delete_interests()
    {
        interests_loader.show();
        confirmHtmlClose();
        $.post('ajax.php', {cmd: 'delete_interest', ajax: 1, id: $currentInsert}, function(res){
            interests_loader.hide();
            if(checkDataAjax(res)){
                $('[data-interest-id='+$currentInsert+']').animate({width:'0',opacity:'0',padding:'0'},
                   {step:show_interests_dots,complete:function(){$(this).remove();show_interests_dots();}},300);
            }
        });
    }

    function add_interests_custom(interest, cat_id)
    {
        interests_loader.show();
        $.post('ajax.php',{cmd:'add_new_interest',value:interest,cat_id:cat_id},function(res){
            interests_loader.hide();
            add_iterests_input.val('');
            var data=checkDataAjax(res);
            if(data!==false&&$.trim(data)!=''){
                $($.trim(data)).hide().prependTo('#list_interest_user').show({duration:300,step:show_interests_dots,complete:show_interests_dots});
            }else{
                //Error
            }
        });
    }

    function add_interests_show_category(interest){
        add_interests_drop_list.hide();
        if($('#pp_5').length){setCategoryInterestsParams(interest)}
        else{$.post('ajax.php', {cmd:'pp_iterests_category',value:interest},popup_open)}
    }

    show_interests_dots();

    $('#interest_dots').on('click',function(){
        var h=$('#list_interest_user > .interests_user_item').last().position().top+28;
        isDots=true;
        $(this).hide();
        $('#refine_interest').animate({maxHeight:h+'px'},300,function(){$(this).css({maxHeight:'none'})});
    })

    var popup_open = function(res){
        var data=checkDataAjax(res);
        if(data!==false){$(data).insertAfter('.footer')}
    }
})

function show_interests_dots(){
    if(isDots)return false;
    var l,w,is=false,dots=$('#interest_dots'),c=false;
    $('#list_interest_user > .interests_user_item').each(function(){
        if($(this).position().top<74){
            l=$(this).position().left;
            w=$(this).width();
            c=$(this).is('.interest_item');
        }else{is=true;return false}
    });
    if(c){dots.addClass('interest')}else{dots.removeClass('interest')}
    if(is){dots.css({left:(l+w+12)+'px'}).show()}else{dots.hide()}
}