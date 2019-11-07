cordova.define("com.yoolp.video.YoolpVideoEditor", function(require, exports, module) {
var exec = require('cordova/exec');

exports.editVideo = function(videoUrl, successUrl, posterUrl, successCallback, errorCallback) {
  exec(
    function(successParams) {
        if (successCallback) {
            successCallback(successParams);
        }
    },
    function(errorParams) {
        if (errorCallback) {
            errorCallback();
        }
    },
    'YoolpVideoEditor',
    'editVideo',
    [videoUrl, successUrl, posterUrl]
  );
};

});
