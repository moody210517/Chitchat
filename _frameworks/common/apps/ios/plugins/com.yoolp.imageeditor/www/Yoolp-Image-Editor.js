cordova.define("com.yoolp.imageeditor.YoolpImageEditor", function(require, exports, module) {
var exec = require('cordova/exec');

const pluginName = "YoolpImageEditor";


exports.editImage = function (urlImage, urlSendResult, successSaveCallback, error) {
    exec(
        function(successParams){
            successSaveCallback(successParams);
        },
        error,
        pluginName,
        'editImage',
        [urlImage, urlSendResult]
    );
};

});
