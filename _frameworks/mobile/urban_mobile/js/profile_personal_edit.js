$(function(){
    var fieldsBox = $('#fileds_box');

    $('.main').click(function(){
        hideCustomTip(1);
    });

    /* Change Location */
    var $country=$('#country'),
        $state=$('#state'),
        $city=$('#city');

    $('body').on('change', 'select', function(e){
        var $el=$(this);
        if (!$el.is('.birthday')) {
            $el.removeClass('wrong');
        }
    });

    /* Birthday */
    var isBirthdayError=false,
        $birthday=$('.birthday',fieldsBox),
        $day=$('#day');

    $birthday.click(function(){
    }).change(function(){
        if(this.id!='day'){
            updateDay('month','frm_personal_fields','year','month','day');
        }
        validateBirthday();
    })

    function validateBirthday(){
        if(birthDateToAge()){
            $birthday.removeClass('wrong');
            isBirthdayError=false;
        }else{
            isBirthdayError=true;
            showBirthdayError();
        }
    }

    function birthDateToAge() {
        var birth=new Date($('#year').val(), $('#month').val()-1, $('#day').val()),
            now = new Date(),
            age = now.getFullYear() - birth.getFullYear();
            age = now.setFullYear(1972) < birth.setFullYear(1972) ? age - 1 : age;
        return age>=minAge;
    }

    function showBirthdayError() {
        $birthday.addClass('wrong');
        setTimeout(function(){showTipTop($day,lIncorrectDate,1,$day.parent('.bl'),'+65')},100);
    }
    /* Birthday */

    var $selectLocation = $('.location', fieldsBox);
    $('#country, #state').change(function(){
            var cmd = $(this).data('location'),ind=+new Date;
            $.ajax({type: 'POST',
                    url: url_main+'tools_ajax.php',
                    data: {cmd:cmd,
                           select_id:this.value,
                           filter:'1',
                           list: '0'},
                    beforeSend: function(){
                        isAjax=false;
                        $selectLocation.prop('disabled',true);
                        $('#country_box').append(getLoaderCl(ind,'loader_personal',1));
                    },
                    success: function(res){
                        var data=checkDataAjax(res);
                        if (data) {
                            var option='<option value="0">'+lChooseACity+'</option>';
                            if (cmd == 'states') {
                                $state.html('<option value="0">'+lChooseAState+'</option>' + data.list).prop('disabled',false);
                                $city.html(option).prop('disabled',false);
                            } else {
                                $state.prop('disabled',false);
                                $city.html(option + data.list).prop('disabled',false);
                            }
                        }
                        $country.prop('disabled',false);
                    },
                    complete: function(){
                        hideLoaderCl(ind);
                        isAjax=true;
                    }
            });
    });
    /* Change Location */
    /* Age */
    var $ageFrom = $('#p_age_from'), $ageTo = $('#p_age_to');
    function disabledOptionAge(){
        $ageFrom.find('option').toggleDisabled($ageTo.val()*1,true);
        $ageTo.find('option').toggleDisabled($ageFrom.val()*1,false);
    }
    disabledOptionAge();

    $('#p_age_from, #p_age_to').change(disabledOptionAge);
    /* Age */
    /* Link Add*/
    $('.link_add', fieldsBox).click(function(){
        hideCustomTip(1);
        var el=$(this),
            type = el.data('typeAdd'),
            prevSelect = el.parent('.bl_add').prev('.bl'),
            select = prevSelect.find('select'),
            countOption = select.find('option').length,
            countSelect = $('[data-checkbox='+type+']').length+1;
        if (countOption <= countSelect+1){$(this).hide()}
        if (countOption > countSelect) {
            var id='personal_'+type+'_'+(countSelect-1),
            nSelect = select.clone(false).attr({id:id});
            nSelect.find('option').removeAttr('selected').eq(0).attr({selected:'selected'});
            $('<div class="bl"><label style="margin-right:5px;">&nbsp;</label></div>').append(nSelect).insertAfter(prevSelect);
        }
        return false;
    })

    $('body').on('click', 'select[data-checkbox]', function(e){
        this.lastValue=$(this).val();
    }).on('change', 'select[data-checkbox]', function(e){
        var el=$(this),type=el.data('checkbox'),id=el.attr('id'),
            val=el.val(),lastValue=this.lastValue;
        $('[id != "'+id+'"][data-checkbox='+type+']').each(function(){
            var els=$(this),elsV=els.val()*1;
            if (elsV&&elsV==val) {
                el.val(lastValue);
                setTimeout(function(){
                    showTipTop(el,lAlreadyChosenOption,1,el.parent('.bl'));
                    el.removeClass('wrong');
                },100);
                return false;
            }
        })
    })
    /* Link Add*/
    var submit = $('#perform_action_profile_personal_edit');
    submit.click(function(){
        if(!isAjax)return false;
        var el,isError=false;
        if (!($state.val()*1)) {
            el=$state;
            showTipTop(el,lIAmFromRequired,1,el.parent('.bl'));
            isError=true;
        }else if(!($city.val()*1)){
            el=$city;
            showTipTop(el,lIAmFromRequired,1,el.parent('.bl'));
            isError=true;
        }else if (isBirthdayError) {
            el=$day;
            isError=true;
            showBirthdayError();
        }
        if(isError){
            $('.st-content-inner').animate({scrollTop:el.offset().top+el[0].offsetHeight},900);
        }else{frmPersonalFields.submit()}
        return false;
    })

    var isAjax=true,frmPersonalFields=$('#frm_personal_fields'),ind;

    frmPersonalFields.submit(function(){
        if(isAjax){
            isAjax=false;
            ind=+new Date;
            submit.html(getLoaderCl(ind));
            frmPersonalFields.ajaxSubmit({success:update});
            $('input, textarea, select', fieldsBox).prop('disabled',true);
        }
        return false;
    });

    function update(res){
        var data=checkDataAjax(res);
        isAjax=true;
        if(data){tools.redirect($('.btn_play_header').attr('href'));
        }else{
            submit.html(lSubmit);
            $('input, textarea, select', fieldsBox).prop('disabled',false);
            tools.showServerError();
        }
    }
})