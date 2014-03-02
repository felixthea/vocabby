// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

/**
 * Global variable containing the query we'd like to pass to Flickr. In this
 * case, kittens!
 *
 * @type {string}
 */
var QUERY = 'puppies';

var kittenGenerator = {
  /**
   * Flickr URL that will give us lots and lots of whatever we're looking for.
   *
   * See http://www.flickr.com/services/api/flickr.photos.search.html for
   * details about the construction of this URL.
   *
   * @type {string}
   * @private
   */
  searchOnFlickr_: 'https://secure.flickr.com/services/rest/?' +
      'method=flickr.photos.search&' +
      'api_key=90485e931f687a9b9c2a66bf58a3861a&' +
      'text=' + encodeURIComponent(QUERY) + '&' +
      'safe_search=1&' +
      'content_type=1&' +
      'sort=interestingness-desc&' +
      'per_page=20',

  /**
   * Sends an XHR GET request to grab photos of lots and lots of kittens. The
   * XHR's 'onload' event is hooks up to the 'showPhotos_' method.
   *
   * @public
   */
  requestKittens: function() {
    var req = new XMLHttpRequest();
    req.open("GET", this.searchOnFlickr_, true);
    req.onload = this.showPhotos_.bind(this);
    req.send(null);
  },

  /**
   * Handle the 'onload' event of our kitten XHR request, generated in
   * 'requestKittens', by generating 'img' elements, and stuffing them into
   * the document for display.
   *
   * @param {ProgressEvent} e The XHR ProgressEvent.
   * @private
   */
  showPhotos_: function (e) {
    var kittens = e.target.responseXML.querySelectorAll('photo');
    for (var i = 0; i < kittens.length; i++) {
      var img = document.createElement('img');
      img.src = this.constructKittenURL_(kittens[i]);
      img.setAttribute('alt', kittens[i].getAttribute('title'));
      document.body.appendChild(img);
    }
  },

  /**
   * Given a photo, construct a URL using the method outlined at
   * http://www.flickr.com/services/api/misc.urlKittenl
   *
   * @param {DOMElement} A kitten.
   * @return {string} The kitten's URL.
   * @private
   */
  constructKittenURL_: function (photo) {
    return "http://farm" + photo.getAttribute("farm") +
        ".static.flickr.com/" + photo.getAttribute("server") +
        "/" + photo.getAttribute("id") +
        "_" + photo.getAttribute("secret") +
        "_s.jpg";
  }
};

function createCORSRequest(method, url) {
  var xhr = new XMLHttpRequest();
  if ("withCredentials" in xhr) {

    // Check if the XMLHttpRequest object has a "withCredentials" property.
    // "withCredentials" only exists on XMLHTTPRequest2 objects.
    xhr.open(method, url, true);

  } else if (typeof XDomainRequest != "undefined") {

    // Otherwise, check if XDomainRequest.
    // XDomainRequest only exists in IE, and is IE's way of making CORS requests.
    xhr = new XDomainRequest();
    xhr.open(method, url);

  } else {

    // Otherwise, CORS is not supported by the browser.
    xhr = null;

  }
  return xhr;
}

document.addEventListener('DOMContentLoaded', function () {
  var storedSessionToken = window.localStorage.getItem('sessionToken')

  if (storedSessionToken !== 'null') { 
    hideLogInForm();
    logInUsingSessionToken(storedSessionToken);
  }

  $('form#log-in').on('click', '#submit', function(event){
    var form = $('form#log-in')
    event.preventDefault();
    user_email = $('#user_email').val();
    user_password = $('#user_password').val();
    formData = form.serializeJSON();

    $.ajax({
      type: "POST",
      url: "http://localhost:3000/session",
      data: formData,
      success: function(data,status,jqXHR){
        saveSessionToken(data["session_token"])
      },
      error: function(jqXHR,textStatus,errorThrown){
        console.log(jqXHR)
        console.log(textStatus)
        console.log(errorThrown)
      }
    })
  })

  function saveSessionToken(sessionToken){
    window.localStorage.setItem('sessionToken', sessionToken)
  }

  function hideLogInForm(){
    $('form#log-in').addClass('hidden');
  }

  function logInUsingSessionToken(sessionToken) {
    $.ajax({
      type: "POST",
      url: "http://localhost:3000/find_current_user",
      data: {"session_token": storedSessionToken},
      success: function(data,status,jqXHR){
        console.log(data);
        $('#welcome').html("Hi " + data["email"])
      },
      error: function(jqXHR,textStatus,errorThrown){
        console.log('error finding user using session token');
      }
    })
  }
})

// http://shielded-shore-5923.herokuapp.com/session

// Run our kitten generation script as soon as the document's DOM is ready.
// document.addEventListener('DOMContentLoaded', function () {
  // kittenGenerator.requestKittens();
// });

// function requestSyns() {
//   var req = new XMLHttpRequest();
//   req.open("GET", "http://words.bighugelabs.com/api/2/7b6ad11fccc077c6e8794f11597d63e9/brave/json", true);
//   req.onload = function(data){
//     console.log(JSON.parse(data.target.responseText));
//   };
//   req.send(null);
// }

// requestSyns();
