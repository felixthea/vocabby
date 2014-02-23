$(document).ready(function(){
	console.log("in the content.js file");
	var currentWord = "";
	var key;
	var word;
	var syn;
	var synList = {
		"comedic": "humorous1",
		"funny": "humorous2",
		"laugh": "humorous3",
		"amusing": "humorous4",
		"zany": "humorous5"
	}

	var endCharCodes = [' ', '.', '?', '!'].map(function(character) { 
		return character.charCodeAt(); 
	})

	endCharCodes.push(13); //adding in the newline charcode

	function createNoticeModal() {
		$('body').prepend("<div id='vocab'></div>");
	}

	function showVocabWord(originalWord, toLearn){
		$v = $('div#vocab')
		$v.empty();
		$v.fadeIn();
		$v.html(originalWord + " -> " + toLearn);
		// $v.removeClass('hidden');
		window.setTimeout(function() {
      		$v.fadeOut();
    	}, 3000)
	}

	$(document).keypress(function(event){
		charCode = event.charCode;
		letter = String.fromCharCode(charCode);

		if($.inArray(charCode, endCharCodes) > -1){ 
			console.log(currentWord);

			syn = getSyn(currentWord.toLowerCase())

			if (syn !== undefined) { showVocabWord(currentWord, syn); }

			currentWord = "";
		} else {
			currentWord += letter
		}
	})

	$(document).keydown(function(event){
		if (event.keyCode == 8) {
			currentWord = currentWord.substr(0,currentWord.length-1)
		}
	})

	function getSyn(word) {
		if (word in synList) {
			return synList[word];
		}
	}

	createNoticeModal();
})