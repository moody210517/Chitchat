var CIndex = function() {
    var $this = this;

    this.isAjax = false;

    this.init = function(context){
        $(function(){
            $this.loginInit(context)
        })
    }

    this.loginInit = function(context){
        console.info('%cInit page Index, context:"'+context+'"','background: #fcffd6');
        $this.isAjax = false;
        $this.$frmLogin = $('#form_login', context);
        $this.$frmLoginInput = $('input', $this.$FrmLogin);
        $this.$frmLoginName = $('#form_login_user', context);
        $this.$frmInputPass = $('#form_login_pass', context)
        $('#icon_field_hint', context).click(function(){
            $this.$frmInputPass[0].type=$this.$frmInputPass[0].type=='text'?'password':'text';
            $(this).toggleClass('icon_field_hint icon_field_vis');
        })

        $this.$frmLoginInput.keydown(function(e){
            if (e.keyCode == 13) {
                $this.$frmLogin.submit();
                return false;
            }
        });

        $this.$frmLoginSubmit = $('#form_log_in_submit', context).click(function(){
            $this.$frmLogin.submit();
            return false;
        });

        $this.$frmLogin.submit(function(){
            if($this.isAjax)return false;
            if($this.$terms[0] && !$this.$terms.prop('checked')){
                showError($this.$terms, l('please_agree_to_the_terms'));
                return false;
            }
            $this.isAjax=true;
            $this.$frmLoginName.val($.trim($this.$frmLoginName.val()));
            $this.$frmLoginSubmit.prop('disabled', true).addLoader();
            showLayerBlockPageNoLoader();
            $this.$frmLogin.ajaxSubmit({success: $this.loginFrmResponse});
            return false;
        });

        $this.$frmLoginInput.on('change propertychange input',function(){
            resetError($this.$frmLoginName);
        }).focus(function(){
            showErrorWrongEl($this.$frmLoginName);
        }).blur(function(){
            hideError($this.$frmLoginName)
        })

        $this.$terms=$('#terms').on('change', function(){
            var el=$(this);
            if (el.prop('checked')){
                resetError($this.$terms);
            } else {
                showError($this.$terms,l('please_agree_to_the_terms'))
            }
        }).focus(function(){
            showErrorWrongEl($this.$terms);
        })
    }

    this.loginFrmInputDisabled = function(){
        hideLayerBlockPage();
        $this.$frmLoginSubmit.removeLoader().prop('disabled', false);
    }

    this.serverError = function(){
        hideLayerBlockPage();
        $this.loginFrmInputDisabled();
        serverError();
    }

    this.loginFrmResponse = function(data){
        var data = getDataAjax(data);
        $this.isAjax = false;
        if (data){
            if(data.substring(0, 11) == '#js:logged:') {
                $.ajax({
                    url:data.substring(11),
                    type:'POST',
                    data:{upload_page_content_ajax:1},
                    context:document.body,
                    beforeSend: function(){

                    },
                    success: function(res){
                        res=checkDataAjax(res);
                        responseHomePage(res,$this.serverError);
                    },
                    error: function(){
                        $this.serverError();
                    },
                    complete: function(){
                    }
                })
                return false;
            }
            if(data.substring(0, 10) == '#js:error:') {
                $this.loginFrmInputDisabled();
                showError($this.$frmLoginName.focus(),data.substring(10));
                return false;
            }
        }else{
            $this.serverError();
        }
    }

    this.goToSocialLogin = function($btn,url){
        $btn.addLoader();
        redirectUrl(url);
    }

    $(function(){

    })

    return this;
}