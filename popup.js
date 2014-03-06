var API_BASE = "http://localhost:3000"
// var API_BASE = "http://shielded-shore-5923.herokuapp.com"

document.addEventListener('DOMContentLoaded', function () {
  var userInfo;
  var storedSessionToken = window.localStorage.getItem('sessionToken')

  if (storedSessionToken !== 'null') { 
    logInUsingSessionToken(storedSessionToken);
    hideLogInForm();
    showAddWordsForm();
  }

  $('form#log-in').on('click', '#submit', function(event){
    var form = $('form#log-in');

    event.preventDefault();

    formData = form.serializeJSON();
    $.ajax({
      type: "POST",
      url: API_BASE + "/session",
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

  $('form#add-words').on('click', '#submit', function(event){
    event.preventDefault();
    var word_name = $('#word_name').val();

    $.ajax({
      type: "POST",
      url: API_BASE + "/words",
      data: {"word": {"name": word_name, "session_token": storedSessionToken}},
      success: function(data,status,jqXHR){
        $('#word_name').val("");
        fetchWordsAndSyns();
      },
      error: function(jqXHR,textStatus,errorThrown){
        console.log(jqXHR);
        console.log(textStatus);
        console.log(errorThrown);
      }
    })
  })

  function fetchWordsAndSyns() {
    $.ajax({
      type: "GET",
      url: API_BASE + "/words",
      data: {"session_token": storedSessionToken},
      success: function(data,status,jqXHR){
        console.log(data)
        chrome.storage.local.set({"vocabList": data});
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
          chrome.tabs.sendMessage(tabs[0].id, {updatedVocab: "true"}, function(response){
            console.log(response);
          })
        })
      },
      error: function(jqXHR,textStatus,errorThrown){
        console.log(jqXHR);
        console.log(textStatus);
        console.log(errorThrown);
      } 
    })
  }

  function saveSessionToken(sessionToken){
    window.localStorage.setItem('sessionToken', sessionToken)
  }

  function hideLogInForm(){
    $('form#log-in').addClass('hidden');
  }

  function showAddWordsForm(){
    $('form#add-words').removeClass('hidden');
  }

  function logInUsingSessionToken(sessionToken) {
    $.ajax({
      type: "POST",
      url: API_BASE + "/find_current_user",
      data: {"session_token": storedSessionToken},
      success: function(data,status,jqXHR){
        userInfo = data
        $('#welcome').html("Hi " + data["email"])
        fetchWordsAndSyns();
      },
      error: function(jqXHR,textStatus,errorThrown){
        console.log('error finding user using session token');
      }
    })
  }
})