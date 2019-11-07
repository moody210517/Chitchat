var CTools = function(guid) {

    var $this=this;

    this.guid = guid;
    this.langParts = {};

    this.showServerError = function(wr){
        var wr=wr||'#st-container';
        showAlert($this.langParts.server_error,wr);
    }

    this.redirect = function(href){
        window.location.href=href;
    }

    this.validateEmail = function($email, msg, box){
        var val = $.trim($email.val()), res = true;
        if (!checkEmail(val)) {
            showTipTop($email,msg,1,$email.closest('.bl'));
            res = false;
        } else {
            resetTipTopError($email)
        }
        return res;
    }

    $(function(){

    })

    return this;
}