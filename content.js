$(document).ready(function(){
	console.log("in the content.js file");
	var currentWord = "";
	var key;
	var word;
	var syn;
	var synList = {
		"COMEDIC": "humorous1",
		"FUNNY": "humorous2",
		"LAUGH": "humorous3",
		"AMUSING": "humorous4",
		"ZANY": "humorous5"
	}

	function createNoticeModal() {
		$('body').prepend("<div id='vocab' class='hidden'></div>");
	}

	function showVocabWord(word){
		console.log("I'm in showVocabWord");
		$('div#vocab').html('');
		$('div#vocab').html(word);
		$('div#vocab').removeClass('hidden');
		window.setTimeout(function() {
      		$('div#vocab').addClass('hidden');
    	}, 3000)
	}

	$(document).keydown(function(event){
		key = event.keyCode
		letter = String.fromCharCode(key)

		if(key == 32){ //space
			console.log(currentWord.trim());

			syn = checkVocab(currentWord.trim())
			console.log(syn)
			if (syn !== undefined){
				showVocabWord(syn);
			}
			currentWord = "";
		} else if(key == 8){ //delete, backspace
			currentWord = currentWord.substr(0,currentWord.length-1)
		} else {
			currentWord += letter
		}
	})

	function checkVocab(word) {
		if (word in synList) {
			return synList[word];
		}
	}

	createNoticeModal();

	// console.log($(event.target).text());	

	// $.ajax({
	// 	url: "http://words.bighugelabs.com/api/2/7b6ad11fccc077c6e8794f11597d63e9/brave/json",
	// 	success: function(data, textStatus, jqXHR){
	// 		console.log(data);
	// 	},
	// 	dataType: "json"
	// })
})