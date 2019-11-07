cordova.define("com-yoolp-image-cropper.YoolpImageCropper", function(require, exports, module) {
var exec = require('cordova/exec');

exports.cropImage = function (image, minWidth, minHeight, saveUrl, success, error) {
  exec(function(successParams){ success(); }, error, 'YoolpImageCropper', 'cropImage', [image, minWidth, minHeight, saveUrl]);
};

});
