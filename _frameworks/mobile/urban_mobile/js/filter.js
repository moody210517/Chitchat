$(function(){
    var $frmFilter = $('#frm_filter'),
        $selectLocation = $('.location', $frmFilter),
        $boxLoader = $('#filter_loacation_box'),
        $country = $('#country'),
        $state = $('#state'),
        $city = $('#city'),
        $ageFrom = $('#p_age_from'),
        $ageTo = $('#p_age_to');

    function disabledOptionAge(){
        $ageFrom.find('option').toggleDisabled($ageTo.val()*1,true);
        $ageTo.find('option').toggleDisabled($ageFrom.val()*1,false);
    }

    disabledOptionAge();

    $('#p_age_from, #p_age_to').change(disabledOptionAge);
    var $peopleNearby = $('#people_nearby'),
        $regionControl = $('#state, #city'),
        $radius=$('#radius'),
        $radiusBl=$('#radius_bl'),
        $countryPart=$('#country_part'),//partl
        $countryRes=$('#country_res');//resizel

    var fnSearchPeople= function(){
        if($peopleNearby.val()*1){
            $regionControl.hide();
            fnShowRadius(true);
            $countryPart.removeClass('partl');
            $countryRes.removeClass('resizel');
        }else{
            $regionControl.show();
            $countryPart.addClass('partl');
            $countryRes.addClass('resizel');
        }
    }

    var fnShowRadius= function(val){
        $radiusBl[val?'slideDown':'slideUp'](200,function(){
            $radius.change();
        })
        $radius.change();
    }
    fnSearchPeople();

    if(!($peopleNearby.val()*1)&&$country.val()=='people_nearby'){
        $country.val(0)
    }

    $('#country, #state').change(function(){
            var cmd = $(this).data('location'),
                option='<option value="0">'+lSelectAll+'</option>';
            if(cmd=='geo_states' && this.value == 'people_nearby'){
                $peopleNearby.val(1);
                fnSearchPeople();
                return;
            }
            $peopleNearby.val(0);
            fnSearchPeople();
            fnShowRadius(false);
            $.ajax({type: 'POST',
                    url: url_page,
                    data: {cmd:cmd,
                           select_id:this.value,
                           filter:'1',
                           list: '0'},
                    beforeSend: function(){
                        $city.html(option);
                        $selectLocation.prop('disabled',true);
                        showLoaderLocation();
                    },
                    success: function(res){
                        var data=checkDataAjax(res);
                        if (data) {
                            if (cmd == 'geo_states') {
                                $state.html(option + data.list).prop('disabled',false);
                                $city.html(option).prop('disabled',false);
                            } else {
                                $state.prop('disabled',false);
                                $city.html(option + data.list).prop('disabled',false);
                            }
                        }
                        $country.prop('disabled',false);
                    },
                    complete: function(){
                        hideLoaderCl('loader_location');
                    }
            });
    });

    $city.change(function(){
        if($peopleNearby.val()*1)return;
        var val=this.value*1;
        fnShowRadius(val);
    }).change();

    function showLoaderLocation(){
        hideLoaderCl('loader_location');
        $boxLoader.append(getLoaderCl('loader_location','loader_filter_location',1));
    }

    $('.orientation > a', $frmFilter).on('click', function(){
        var checked = $(this).parent('li').toggleClass('selected').is('.selected');
        $(this).find('input').prop('checked', checked);
        return false;
    })

    var $i_am_here_to = $('.i_am_here_to', $frmFilter),
        $i_am_here_to_prev = $('.i_am_here_to.selected', $frmFilter);
    $i_am_here_to.find('a').on('click', function(){
        var $li=$(this).parent('li');
        if($li.is('.selected'))return false;
        $i_am_here_to_prev.removeClass('selected');
        $i_am_here_to_prev = $li;
        $li.addClass('selected')
        $li.find('input').prop('checked', true);
        return false;
    })

    $('#perform_action_search').on('click', function(){
        $(this).html(getLoader());
        $frmFilter.submit();
        return false;
    })
})