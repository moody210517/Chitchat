cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "id": "org.apache.cordova.vibration.notification",
        "file": "plugins/org.apache.cordova.vibration/www/vibration.js",
        "pluginId": "org.apache.cordova.vibration",
        "merges": [
            "navigator.notification",
            "navigator"
        ]
    },
    {
        "id": "de.appplant.cordova.plugin.background-mode.BackgroundMode",
        "file": "plugins/de.appplant.cordova.plugin.background-mode/www/background-mode.js",
        "pluginId": "de.appplant.cordova.plugin.background-mode",
        "clobbers": [
            "cordova.plugins.backgroundMode",
            "plugin.backgroundMode"
        ]
    },
    {
        "id": "de.appplant.cordova.plugin.local-notification-ios9-fix.LocalNotification",
        "file": "plugins/de.appplant.cordova.plugin.local-notification-ios9-fix/www/local-notification.js",
        "pluginId": "de.appplant.cordova.plugin.local-notification-ios9-fix",
        "clobbers": [
            "cordova.plugins.notification.local",
            "plugin.notification.local"
        ]
    },
    {
        "id": "de.appplant.cordova.plugin.local-notification-ios9-fix.LocalNotification.Core",
        "file": "plugins/de.appplant.cordova.plugin.local-notification-ios9-fix/www/local-notification-core.js",
        "pluginId": "de.appplant.cordova.plugin.local-notification-ios9-fix",
        "clobbers": [
            "cordova.plugins.notification.local.core",
            "plugin.notification.local.core"
        ]
    },
    {
        "id": "de.appplant.cordova.plugin.local-notification-ios9-fix.LocalNotification.Util",
        "file": "plugins/de.appplant.cordova.plugin.local-notification-ios9-fix/www/local-notification-util.js",
        "pluginId": "de.appplant.cordova.plugin.local-notification-ios9-fix",
        "merges": [
            "cordova.plugins.notification.local.core",
            "plugin.notification.local.core"
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
        "id": "cordova-plugin-inappbrowser.inappbrowser",
        "file": "plugins/cordova-plugin-inappbrowser/www/inappbrowser.js",
        "pluginId": "cordova-plugin-inappbrowser",
        "clobbers": [
            "cordova.InAppBrowser.open",
            "window.open"
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
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "cordova-plugin-whitelist": "1.0.0",
    "org.apache.cordova.vibration": "0.3.13",
    "de.appplant.cordova.plugin.background-mode": "0.6.4",
    "de.appplant.cordova.plugin.local-notification-ios9-fix": "0.8.2",
    "cordova-plugin-device": "1.0.1",
    "de.appplant.cordova.common.registerusernotificationsettings": "1.0.1",
    "cordova-plugin-inappbrowser": "3.0.0",
    "cordova-promise-polyfill": "0.0.2",
    "cordova-admob-sdk": "0.17.0",
    "cordova-plugin-admob-free": "0.17.4"
};
// BOTTOM OF METADATA
});