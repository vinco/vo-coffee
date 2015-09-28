// Copyright (c) 2015 Alexander J. Salas B. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

chrome.browserAction.setBadgeBackgroundColor({ color: [77, 77, 77, 255] });
chrome.browserAction.setBadgeText({text: '0'});


//chrome.browserAction.setBadgeBackgroundColor({ color: [255, 0, 0, 255] });
//chrome.browserAction.setBadgeText({text: '10'});
//chrome.runtime.sendMessage({clicked : true}, function(response) {
  //chrome.browserAction.setBadgeText({text: response.farewell});
//});

$(function () {
    "use strict";
    var connection = {
      send: function(msg) {
        chrome.runtime.sendMessage({coffee : msg});
      }
    }

    chrome.runtime.onMessage.addListener( function (message, sender, sendResponse) {
      if (message.wscs) {
        input.removeAttr('disabled').focus();
      }
    });

    // for better performance - to avoid searching in DOM
    var content = $('#incomingChatMessages');
    var input = $('#input');
    var username;
    var server;
    chrome.storage.sync.get({
      username: '',
      server: '127.0.0.1:1337'
    }, function(items) {
      username = items.username;
      server = items.server;
      if(username){
        input.attr('placeholder', 'Coffee ready to share?');
      }
    });


    input.removeAttr('disabled');

    input.keydown(function(e) {
        if (e.keyCode === 13) {
            var msg = $(this).val();
            if (!msg) {
                return;
            }
            // we know that the first message sent from a user their name
            if (!username) {
                if(validTwitteUser(msg)){
                  username = msg.replace('@','');
                  msg = username;
                  //self.port.emit('username', msg);
                  input.attr('placeholder', 'Coffee ready to share?');
                } else {
                  $(this).val('');
                  input.attr('placeholder', 'Input valid twitter username');
                  return;
                }
            }
            // send the message as an ordinary text
            connection.send(msg);
            $(this).val('');
            // disable the input field to make the user wait until server
            // sends back response
            input.attr('disabled', 'disabled');
        }
    });
    function validTwitteUser(sn) {
        return /^[a-zA-Z0-9_]{1,15}$/.test(sn.replace('@',''));
    }
    /**
     * Add message to the chat window
     */
    function addMessage(author, message, color, dt) {
             var me = 'me';
             if(username != author){
              me = '';
              self.port.emit('coffee', {author: author, text: message});
             }
             content.append('<li>'+
                             '<div class="avatar"><img src="https://twitter.com/'+author+'/profile_image?size=bigger"></div>'+
                             '<div class="msgWrap '+me+'">'+
                             '<div class="user">'+ author + '</div>'+
                             '<div class="msg">'+message+'</div>'+
                             '</div>'+
                             '<div class="time"><i class="glyphicon glyphicon-time"></i><span data-livestamp="'+dt+'"></span> </div>'+
                             '</li>');
      window.scrollTo(0,document.body.scrollHeight);
    }
    $('input').placeholder();
});
