cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
  {
    "file": "plugins/cordova-plugin-whitelist/whitelist.js",
    "id": "cordova-plugin-whitelist.whitelist",
    "runs": true
  },
  {
    "file": "plugins/org.apache.cordova.inappbrowser/www/inappbrowser.js",
    "id": "org.apache.cordova.inappbrowser.inappbrowser",
    "clobbers": [
      "window.open"
    ]
  },
  {
    "file": "plugins/org.apache.cordova.vibration/www/vibration.js",
    "id": "org.apache.cordova.vibration.notification",
    "merges": [
      "navigator.notification",
      "navigator"
    ]
  },
  {
    "file": "plugins/cordova-plugin-splashscreen/www/splashscreen.js",
    "id": "cordova-plugin-splashscreen.SplashScreen",
    "clobbers": [
      "navigator.splashscreen"
    ]
  },
  {
    "id": "cordova-plugin-android-permissions.Permissions",
    "file": "plugins/cordova-plugin-android-permissions/www/permissions.js",
    "pluginId": "cordova-plugin-android-permissions",
    "clobbers": [
      "cordova.plugins.permissions"
    ]
  },
  {
    "id": "cordova-promise-polyfill.Promise",
    "file": "plugins/cordova-promise-polyfill/www/Promise.js",
    "pluginId": "cordova-promise-polyfill",
    "runs": true
  },
  {
    "id": "cordova-promise-polyfill.promise.min",
    "file": "plugins/cordova-promise-polyfill/www/promise.min.js",
    "pluginId": "cordova-promise-polyfill"
  },
  {
    "id": "cordova-plugin-admob-free.AdMob",
    "file": "plugins/cordova-plugin-admob-free/www/admob.js",
    "pluginId": "cordova-plugin-admob-free",
    "clobbers": [
      "admob",
      "AdMob",
      "plugins.AdMob"
    ]
  },
  {
    "id": "cordova-plugin-device.device",
    "file": "plugins/cordova-plugin-device/www/device.js",
    "pluginId": "cordova-plugin-device",
    "clobbers": [
      "device"
    ]
  },
  {
    "id": "cordova-plugin-badge.Badge",
    "file": "plugins/cordova-plugin-badge/www/badge.js",
    "pluginId": "cordova-plugin-badge",
    "clobbers": [
      "cordova.plugins.notification.badge"
    ]
  },
  {
    "id": "cordova-plugin-local-notification.LocalNotification",
    "file": "plugins/cordova-plugin-local-notification/www/local-notification.js",
    "pluginId": "cordova-plugin-local-notification",
    "clobbers": [
      "cordova.plugins.notification.local"
    ]
  },
  {
    "id": "cordova-plugin-local-notification.LocalNotification.Core",
    "file": "plugins/cordova-plugin-local-notification/www/local-notification-core.js",
    "pluginId": "cordova-plugin-local-notification",
    "clobbers": [
      "cordova.plugins.notification.local.core",
      "plugin.notification.local.core"
    ]
  },
  {
    "id": "cordova-plugin-local-notification.LocalNotification.Util",
    "file": "plugins/cordova-plugin-local-notification/www/local-notification-util.js",
    "pluginId": "cordova-plugin-local-notification",
    "merges": [
      "cordova.plugins.notification.local.core",
      "plugin.notification.local.core"
    ]
  }
];
module.exports.metadata = 
// TOP OF METADATA
{
  "cordova-plugin-whitelist": "1.0.0",
  "org.apache.cordova.inappbrowser": "0.6.0",
  "de.appplant.cordova.common.registerusernotificationsettings": "1.0.1",
  "org.apache.cordova.vibration": "0.3.13",
  "cordova-plugin-splashscreen": "3.2.3-dev",
  "cordova-plugin-crosswalk-webview": "2.4.0",
  "cordova-android-support-gradle-release": "1.4.2",
  "cordova-plugin-android-permissions": "1.0.0",
  "cordova-promise-polyfill": "0.0.2",
  "cordova-admob-sdk": "0.17.0",
  "cordova-plugin-admob-free": "0.17.4",
  "cordova-plugin-device": "2.0.2",
  "cordova-plugin-badge": "0.8.7",
  "cordova-plugin-local-notification": "0.9.0-beta.2"
};
// BOTTOM OF METADATA
});