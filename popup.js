// var API_BASE = "http://localhost:3000"
var API_BASE = "http://shielded-shore-5923.herokuapp.com"

document.addEventListener('DOMContentLoaded', function () {
  var userInfo;
  var storedSessionToken = window.localStorage.getItem('vocabbySessionToken');
  var $logInForm = $('form#log-in');
  var $addWordsForm = $('form#add-words');

  if (storedSessionToken !== null) { 
    logInUsingSessionToken(storedSessionToken);
    $logInForm.addClass('hidden');
  } else {
    $addWordsForm.addClass('hidden');

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
          $logInForm.addClass('hidden');
          $addWordsForm.removeClass('hidden');
          $('#welcome').html("Hi " + data["email"])
          $('button#log-out').removeClass('hidden');
        },
        error: function(jqXHR,textStatus,errorThrown){
          console.log(jqXHR)
          console.log(textStatus)
          console.log(errorThrown)
        }
      })
    })
  }

  $('button#log-out').on('click', function(event){
    event.preventDefault();
    $.ajax({
      type: "DELETE",
      url: API_BASE + "/session",
      success: function(data,status,jqXHR){
        console.log("logged out");
        window.localStorage.removeItem('vocabbySessionToken');
        $('#welcome').html("");
        $logInForm.removeClass('hidden');
        $addWordsForm.addClass('hidden');
        $('button#log-out').addClass('hidden');
      },
      error: function(jqXHR, textStatus, errorThrown){
        console.log("error in logging out");
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
    window.localStorage.setItem('vocabbySessionToken', sessionToken)
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