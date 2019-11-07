/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

function showToast(msg)
{
    // alert(msg);
}


callback = function () {
    cordova.plugins.notification.local.getIds(function (ids) {
        showToast('IDs: ' + ids.join(' ,'));
    });
};

clearMultiple = function () {
    cordova.plugins.notification.local.clear([2, 3], callback);
};
clearAll = function () {
    cordova.plugins.notification.local.clearAll(callback);
};
cancel = function () {
    cordova.plugins.notification.local.cancel(1, callback);
};
cancelMultiple = function () {
    cordova.plugins.notification.local.cancel([2, 3], callback);
};
cancelAll = function () {
    cordova.plugins.notification.local.cancelAll(callback);
};
isPresent = function () {
    cordova.plugins.notification.local.isPresent(id, function (present) {
        showToast(present ? 'Yes' : 'No');
    });
};
isScheduled = function () {
    cordova.plugins.notification.local.isScheduled(id, function (scheduled) {
        showToast(scheduled ? 'Yes' : 'No');
    });
};
isTriggered = function () {
    cordova.plugins.notification.local.isTriggered(id, function (triggered) {
        showToast(triggered ? 'Yes' : 'No');
    });
};
var callbackIds = function (ids) {
    console.log(ids);
    showToast(ids.length === 0 ? '- none -' : ids.join(' ,'));
};
getIds = function () {
    cordova.plugins.notification.local.getIds(callbackIds);
};
getScheduledIds = function () {
    cordova.plugins.notification.local.getScheduledIds(callbackIds);
};
getTriggeredIds = function () {
    cordova.plugins.notification.local.getTriggeredIds(callbackIds);
};
var callbackOpts = function (notifications) {
    console.log(notifications);
    showToast(notifications.length === 0 ? '- none -' : notifications.join(' ,'));
};
var callbackSingleOpts = function (notification) {
    console.log(notification);
    showToast(notification.toString());
};
get = function () {
    cordova.plugins.notification.local.get(1, callbackSingleOpts);
};
getMultiple = function () {
    cordova.plugins.notification.local.get([1, 2], callbackOpts);
};
getAll = function () {
    cordova.plugins.notification.local.getAll(callbackOpts);
};
getScheduled = function () {
    cordova.plugins.notification.local.getScheduled(callbackOpts);
};
getTriggered = function () {
    cordova.plugins.notification.local.getTriggered(callbackOpts);
};
setDefaultTitle = function () {
    cordova.plugins.notification.local.setDefaults({
        title: 'New Default Title'
    });
};

var app = {

    activeStatus: true,
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.addEventListener("pause", this.onPause, false);
        document.addEventListener("resume", this.onResume, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {

        // alert('onDeviceReady window 1');

        clearAll();
        cancelAll();

        /*
        window.plugin.notification.local.onclick = function (id, state, json) {

            alert(JSON.stringify(id));
            alert(JSON.stringify(state));
            alert(JSON.stringify(json));

            // var data = JSON.parse(json);
           //  navigator.notification.alert( data.message, null,  data.title, "Ok");
        }
        */
        app.receivedEvent('deviceready');
    },

    onPause: function () {
        app.activeStatus = false;
    },

    onResume: function () {
        app.activeStatus = true;
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        /*
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
        */
    }
};
app.initialize();


function schedule(title, id, text){

    console.log('PUSH', title, id, text);

    if(app.activeStatus == undefined || !app.activeStatus)
    {
        console.log('PUSH active');
        navigator.vibrate(appVibrationDuration);
        cordova.plugins.notification.local.schedule({
            id: id,
            title: title,
            text: text,
            data: id,
            json: JSON.stringify({ 'title': title, 'text': text })

        });
        console.log('PUSH sent');

        cordova.plugins.notification.local.on("click", function(notification) {
            //$('body').empty().css('background', '#000');
            // don't show and redirect if chat already active
            if(appCurrentImUserId != notification.id) {
                appPreloaderShow();
                setTimeout(function(){ document.location.href = 'messages.php?display=one_chat&user_id=' + notification.id; }, 100);
            }
        });
    } else {
        console.log('PUSH inactive');
    }
}