cordova.define("com.yoolp.invitecontacts.YoolpContacts", function(require, exports, module) {
var exec = require('cordova/exec');

exports.inviteFriends = function (message, success, error) {
  exec(success || null, error || null, 'YoolpContacts', 'inviteFriends', [message]);
};

});
