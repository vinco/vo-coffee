/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
 
var { ToggleButton } = require('sdk/ui/button/toggle');
var panels = require("sdk/panel");
var self = require("sdk/self");
var name = "lightweightThemes.selectedThemeID";
var selectedThemeID = require("sdk/preferences/service").get(name);
var notifications = require("sdk/notifications");

var myIconURL = self.data.url("icon32.png");




var panel = panels.Panel({
  width: 360,
  height: 480,
  contentURL: self.data.url("panel.html"),
  onHide: handleHide,
  contentScript: "document.addEventListener('coffee', function (e) { self.port.emit('coffee', e.detail); }, false);"
});

panel.port.on("coffee", function(msj) {
  button.badgeColor = "#AA00AA";
  button.badge = button.badge + 1;
  notifications.notify({
    title: msj.author,
    text: msj.text,
    iconURL: myIconURL
  });
});

function handleChange(state) {
  if (state.checked) {
    panel.show({
      position: button
    });
  }

  /*
  if (state.checked) {
    button.badgeColor = "#000000";
  }
  else {
    button.badgeColor = "#00AAAA";
  }*/
}

function handleHide() {
  button.state('window', {checked: false});
  button.badge = 0;
  button.badgeColor = "#4d4d4d";
  
}

var button = ToggleButton({
  id: "vo-coffee",
  label: "French Press",
  icon: {
    "16": selectedThemeID === "firefox-devedition@mozilla.org" ? 
          "./icondev16.png" : "./icon16.png",
    "32": "./icon32.svg",
    "64": "./icon64.svg"
  },
  onChange: handleChange,
  badge: 0,
  badgeColor: "#4d4d4d"
});
