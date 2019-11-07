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
    },
    {
        "id": "com.yoolp.imageeditor.YoolpImageEditor",
        "file": "plugins/com.yoolp.imageeditor/www/Yoolp-Image-Editor.js",
        "pluginId": "com.yoolp.imageeditor",
        "clobbers": [
            "YoolpImageEditor"
        ]
    },
    {
        "id": "cordova-plugin-file.DirectoryEntry",
        "file": "plugins/cordova-plugin-file/www/DirectoryEntry.js",
        "pluginId": "cordova-plugin-file",
        "clobbers": [
            "window.DirectoryEntry"
        ]
    },
    {
        "id": "cordova-plugin-file.DirectoryReader",
        "file": "plugins/cordova-plugin-file/www/DirectoryReader.js",
        "pluginId": "cordova-plugin-file",
        "clobbers": [
            "window.DirectoryReader"
        ]
    },
    {
        "id": "cordova-plugin-file.Entry",
        "file": "plugins/cordova-plugin-file/www/Entry.js",
        "pluginId": "cordova-plugin-file",
        "clobbers": [
            "window.Entry"
        ]
    },
    {
        "id": "cordova-plugin-file.File",
        "file": "plugins/cordova-plugin-file/www/File.js",
        "pluginId": "cordova-plugin-file",
        "clobbers": [
            "window.File"
        ]
    },
    {
        "id": "cordova-plugin-file.FileEntry",
        "file": "plugins/cordova-plugin-file/www/FileEntry.js",
        "pluginId": "cordova-plugin-file",
        "clobbers": [
            "window.FileEntry"
        ]
    },
    {
        "id": "cordova-plugin-file.FileError",
        "file": "plugins/cordova-plugin-file/www/FileError.js",
        "pluginId": "cordova-plugin-file",
        "clobbers": [
            "window.FileError"
        ]
    },
    {
        "id": "cordova-plugin-file.FileReader",
        "file": "plugins/cordova-plugin-file/www/FileReader.js",
        "pluginId": "cordova-plugin-file",
        "clobbers": [
            "window.FileReader"
        ]
    },
    {
        "id": "cordova-plugin-file.FileSystem",
        "file": "plugins/cordova-plugin-file/www/FileSystem.js",
        "pluginId": "cordova-plugin-file",
        "clobbers": [
            "window.FileSystem"
        ]
    },
    {
        "id": "cordova-plugin-file.FileUploadOptions",
        "file": "plugins/cordova-plugin-file/www/FileUploadOptions.js",
        "pluginId": "cordova-plugin-file",
        "clobbers": [
            "window.FileUploadOptions"
        ]
    },
    {
        "id": "cordova-plugin-file.FileUploadResult",
        "file": "plugins/cordova-plugin-file/www/FileUploadResult.js",
        "pluginId": "cordova-plugin-file",
        "clobbers": [
            "window.FileUploadResult"
        ]
    },
    {
        "id": "cordova-plugin-file.FileWriter",
        "file": "plugins/cordova-plugin-file/www/FileWriter.js",
        "pluginId": "cordova-plugin-file",
        "clobbers": [
            "window.FileWriter"
        ]
    },
    {
        "id": "cordova-plugin-file.Flags",
        "file": "plugins/cordova-plugin-file/www/Flags.js",
        "pluginId": "cordova-plugin-file",
        "clobbers": [
            "window.Flags"
        ]
    },
    {
        "id": "cordova-plugin-file.LocalFileSystem",
        "file": "plugins/cordova-plugin-file/www/LocalFileSystem.js",
        "pluginId": "cordova-plugin-file",
        "clobbers": [
            "window.LocalFileSystem"
        ],
        "merges": [
            "window"
        ]
    },
    {
        "id": "cordova-plugin-file.Metadata",
        "file": "plugins/cordova-plugin-file/www/Metadata.js",
        "pluginId": "cordova-plugin-file",
        "clobbers": [
            "window.Metadata"
        ]
    },
    {
        "id": "cordova-plugin-file.ProgressEvent",
        "file": "plugins/cordova-plugin-file/www/ProgressEvent.js",
        "pluginId": "cordova-plugin-file",
        "clobbers": [
            "window.ProgressEvent"
        ]
    },
    {
        "id": "cordova-plugin-file.fileSystems",
        "file": "plugins/cordova-plugin-file/www/fileSystems.js",
        "pluginId": "cordova-plugin-file"
    },
    {
        "id": "cordova-plugin-file.requestFileSystem",
        "file": "plugins/cordova-plugin-file/www/requestFileSystem.js",
        "pluginId": "cordova-plugin-file",
        "clobbers": [
            "window.requestFileSystem"
        ]
    },
    {
        "id": "cordova-plugin-file.resolveLocalFileSystemURI",
        "file": "plugins/cordova-plugin-file/www/resolveLocalFileSystemURI.js",
        "pluginId": "cordova-plugin-file",
        "merges": [
            "window"
        ]
    },
    {
        "id": "cordova-plugin-file.isChrome",
        "file": "plugins/cordova-plugin-file/www/browser/isChrome.js",
        "pluginId": "cordova-plugin-file",
        "runs": true
    },
    {
        "id": "cordova-plugin-file.iosFileSystem",
        "file": "plugins/cordova-plugin-file/www/ios/FileSystem.js",
        "pluginId": "cordova-plugin-file",
        "merges": [
            "FileSystem"
        ]
    },
    {
        "id": "cordova-plugin-file.fileSystems-roots",
        "file": "plugins/cordova-plugin-file/www/fileSystems-roots.js",
        "pluginId": "cordova-plugin-file",
        "runs": true
    },
    {
        "id": "cordova-plugin-file.fileSystemPaths",
        "file": "plugins/cordova-plugin-file/www/fileSystemPaths.js",
        "pluginId": "cordova-plugin-file",
        "merges": [
            "cordova"
        ],
        "runs": true
    },
    {
        "id": "cordova-plugin-media-capture.CaptureAudioOptions",
        "file": "plugins/cordova-plugin-media-capture/www/CaptureAudioOptions.js",
        "pluginId": "cordova-plugin-media-capture",
        "clobbers": [
            "CaptureAudioOptions"
        ]
    },
    {
        "id": "cordova-plugin-media-capture.CaptureImageOptions",
        "file": "plugins/cordova-plugin-media-capture/www/CaptureImageOptions.js",
        "pluginId": "cordova-plugin-media-capture",
        "clobbers": [
            "CaptureImageOptions"
        ]
    },
    {
        "id": "cordova-plugin-media-capture.CaptureVideoOptions",
        "file": "plugins/cordova-plugin-media-capture/www/CaptureVideoOptions.js",
        "pluginId": "cordova-plugin-media-capture",
        "clobbers": [
            "CaptureVideoOptions"
        ]
    },
    {
        "id": "cordova-plugin-media-capture.CaptureError",
        "file": "plugins/cordova-plugin-media-capture/www/CaptureError.js",
        "pluginId": "cordova-plugin-media-capture",
        "clobbers": [
            "CaptureError"
        ]
    },
    {
        "id": "cordova-plugin-media-capture.MediaFileData",
        "file": "plugins/cordova-plugin-media-capture/www/MediaFileData.js",
        "pluginId": "cordova-plugin-media-capture",
        "clobbers": [
            "MediaFileData"
        ]
    },
    {
        "id": "cordova-plugin-media-capture.MediaFile",
        "file": "plugins/cordova-plugin-media-capture/www/MediaFile.js",
        "pluginId": "cordova-plugin-media-capture",
        "clobbers": [
            "MediaFile"
        ]
    },
    {
        "id": "cordova-plugin-media-capture.helpers",
        "file": "plugins/cordova-plugin-media-capture/www/helpers.js",
        "pluginId": "cordova-plugin-media-capture",
        "runs": true
    },
    {
        "id": "cordova-plugin-media-capture.capture",
        "file": "plugins/cordova-plugin-media-capture/www/capture.js",
        "pluginId": "cordova-plugin-media-capture",
        "clobbers": [
            "navigator.device.capture"
        ]
    },
    {
        "id": "com.yoolp.invitecontacts.YoolpContacts",
        "file": "plugins/com.yoolp.invitecontacts/www/cordova-plugin-invite-contacts.js",
        "pluginId": "com.yoolp.invitecontacts",
        "clobbers": [
            "YoolpContacts"
        ]
    },
    {
        "id": "com.yoolp.video.YoolpVideoEditor",
        "file": "plugins/com.yoolp.video/www/cordova-plugin-video-editor.js",
        "pluginId": "com.yoolp.video",
        "clobbers": [
            "cordova.plugins.YoolpVideoEditor"
        ]
    },
    {
        "id": "com-yoolp-image-cropper.YoolpImageCropper",
        "file": "plugins/com-yoolp-image-cropper/www/YoolpImageCropper.js",
        "pluginId": "com-yoolp-image-cropper",
        "clobbers": [
            "YoolpImageCropper"
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
    "cordova-plugin-admob-free": "0.17.4",
    "cordova-plugin-add-swift-support": "1.7.2",
    "com.yoolp.imageeditor": "1.0.0",
    "cordova-plugin-file": "6.0.1",
    "cordova-plugin-media-capture": "3.0.3-dev",
    "com.yoolp.invitecontacts": "1.0.0",
    "com.yoolp.video": "1.0.0",
    "com-yoolp-image-cropper": "1.0"
};
// BOTTOM OF METADATA
});