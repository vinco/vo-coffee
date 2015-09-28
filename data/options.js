// Saves options to chrome.storage.sync.
function save_options() {
  var status = document.getElementById('status');
  var username = document.getElementById('username').value;
  var server = document.getElementById('server').value;

  if(!validTwitteUser(username)){
    status.textContent = 'Input valid twitter username.';
    document.getElementById('username').focus();
    return;
  }
/*
  if(!validateIpAndPort(server)){
    status.textContent = 'Input valid hostname.';
    document.getElementById('server').focus();
    return;
  }
*/
  chrome.storage.sync.set({
    username: username,
    server: server
  }, function() {
    // Update status to let user know options were saved.
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  // Use default value color = 'red' and likesColor = true.
  chrome.storage.sync.get({
    username: '',
    server: '127.0.0.1:1337'
  }, function(items) {
    document.getElementById('username').value = items.username;
    document.getElementById('server').value = items.server;
  });
}

function validTwitteUser(sn) {
    return /^[a-zA-Z0-9_]{1,15}$/.test(sn);
}

function valid952Hostname(sn) {
    return /^(([a-zA-Z]|[a-zA-Z][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z]|[A-Za-z][A-Za-z0-9\-]*[A-Za-z0-9])$/.test(sn);
}

function validateIpAndPort(input) {
    var parts = input.split(":");
    var ip = parts[0].split(".");
    var port = parts[1];
    return validateNum(port, 1, 65535) &&
        ip.length == 4 &&
        ip.every(function (segment) {
            return validateNum(segment, 0, 255);
        });
}

function validateNum(input, min, max) {
    var num = +input;
    return num >= min && num <= max && input === num.toString();
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);
