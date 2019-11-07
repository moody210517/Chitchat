$(function () {
    var $ppSignIn=$('#pp_sign_in').modalPopup({shClass:currentPage=='join.php'?'pp_shadow_empty':''});
    function signInClose() {
        if(!$ppSignIn.is(':visible'))return;
        $ppSignIn.close(false,function(){
            hideErrorLoginFrom('#form_login_user', $('input.inp, #form_login_submit, button', '#form_login'))
        })
    }

    $('#pp_sign_in_close').click(function(){
        signInClose();
        return false;
    })

    $('#pp_sign_in_open').click(function(){
        $ppSignIn.open();
        return false;
    })

    var $ppForgotPass=$('#pp_resend_password').modalPopup();
    $jq('#pp_forgot_pass_open').click(function(){
        //var $shadow=$('<div class="pp_shadow"></div>').hide().prependTo('body').fadeIn('fast');
        $ppSignIn.close(false,function(){
            //$shadow.fadeOut('fast');
            hideErrorLoginFrom('#form_login_user', $('input.inp, #form_login_submit, button', '#form_login'));
            $ppForgotPass.open();
        })
        return false;
    })

    $jq('.pp_forgot_pass_close').click(function(){
        $ppForgotPass.close(false,function(){
            $ppSignIn.open();
        })
        return false;
    })
    function forgotPassClose() {
        if(!$ppForgotPass.is(':visible'))return;
        $jq('.pp_forgot_pass_close').click();
    }

    $jq('#pp_resend_password_email').on('change propertychange input',validateEmailForgotPass);
    function validateEmailForgotPass() {
        var email=trim($jq('#pp_resend_password_email').val()),
            is=checkEmail(email);
        hideErrorLoginFrom('#pp_resend_password_email', $jq('#pp_resend_password_email'));
        hideErrorLoginFrom('#pp_resend_password_error', $jq('#pp_resend_password_email'), '.successful');
        $jq('#pp_resend_password_submit').prop('disabled',!is);
        return is;
    }

    $jq('#pp_resend_password_submit').click(function(){
		var url=url_main+'forget_password.php?ajax=1&mail='+$jq('#pp_resend_password_email').val();
        $jq('#pp_resend_password_email').prop('disabled', true);
        $jq('#pp_resend_password_submit').html(getLoader('css_loader_btn', false, true));
		$.get(url, function(data){
            if(data == 'link_send'){
                siteLangParts.send_password=siteLangParts.send_again;
                showErrorLoginFrom('#pp_resend_password_error', siteLangParts.link_password_send, $jq('#pp_resend_password_submit'), '.successful')
            }else{
                showErrorLoginFrom('#pp_resend_password_email', data, $jq('#pp_resend_password_submit'));
            }
            $jq('#pp_resend_password_submit').html(siteLangParts.send_password);
            $jq('#pp_resend_password_email').prop('disabled', false);
		})
	})

	$('body').on('click', '.pp_wrapper', function(e){
		if($(e.target).is('.pp_wrapper')){
            signInClose();
            forgotPassClose();
        }
	})

    var $frmLogin = $('#form_login'),
		$frmLoginInput = $('input.inp, #form_login_submit, button', $frmLogin),
        $frmLoginSubmit = $('#form_login_submit'),
        $frmLoginUser = $('#form_login_user'),
        isFrmLoginSubmitAjax = false;

    $frmLogin.submit(function() {
        if(isFrmLoginSubmitAjax)return false;
        isFrmLoginSubmitAjax=true;
        $frmLoginUser.val($.trim($frmLoginUser.val()));
        $(this).ajaxSubmit({success: loginResponse});
        $frmLoginInput.prop('disabled', true);
        $frmLoginSubmit.html(getLoader('css_loader_login_form',false,true));
        return false;
    });

    $('input.inp', $frmLogin).on('change propertychange input', function(){
        hideErrorLoginFrom('#form_login_user', $frmLoginInput);
    })

	function loginResponse(data) {
        isFrmLoginSubmitAjax=false;
		if(data.substring(0, 11) == '#js:logged:') {
			//Without it will not work autocomplete form
			//frm_login.attr('action', data.substring(11)).submit();
			location.href = data.substring(11);
			return false;
		}
		if(data.substring(0, 10) == '#js:error:') {
            $frmLoginInput.prop('disabled', false);
            $frmLoginSubmit.html(siteLangParts.signIn);
            showErrorLoginFrom('#form_login_user', data.substring(10), $frmLoginInput);
			return false;
		}
		location.href = 'index.php';
	}

    function showErrorLoginFrom(el, text, $input, cl){
        var cl=cl||'.error',
            $el=$(el).focus(),$error=$el.next(cl);
        if ($error.is('.to_show')) {
            $error.html(text);
            return;
        }
        var h=$error.html(text).css('height', 'auto').height();
		$error.height(0);
		setTimeout(function(){
			$error.css({height:h}).addClass('to_show');
		},1);
        $input.prop('disabled', false);
    }
})

function hideErrorLoginFrom(el, $input,cl){
    cl=cl||'.error';
    $(el).next(cl).removeClass('to_show').css({height:0});
    $input.prop('disabled', false);
}