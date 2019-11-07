$(function () {
    var input = $('.frm_login > .cont > .inp'),
        frm_login = $('#form_login'),
		submit = $('#form_login [type="submit"]'),
        is_ajax = true;

    $('#form_login_join').click(function(){
        is_ajax = false;
        $('#form_login_cmd').val('register');
        frm_login.attr('action', urlPageJoin).submit();
    })

    frm_login.submit(function() {
        if (is_ajax) {
            var login = $('#form_login_user');
            login.val($.trim(login.val()));
            //if (user!=''&&pass!='') {
                this.ajax.value=1;
                $(this).ajaxSubmit({success: loginResponse});
                submit.attr('disabled', '');
                this.ajax.value=0;
            //}
            return false;
        }
    });

    input.on('change propertychange input', function(){
		customHideTip(input, submit);
    });

	function loginResponse(data) {
		if(data.substring(0, 11) == '#js:logged:') {
			//Without it will not work autocomplete form
			//frm_login.attr('action', data.substring(11)).submit();
			location.href = data.substring(11);
			return false;
		}

		if(data.substring(0, 10) == '#js:error:') {
			customShowTip(input, submit, data.substring(10), frm_login);
			return false;
		}
		location.href = 'index.php';
	}});
