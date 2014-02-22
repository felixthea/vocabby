$(document).ready(function(){
	console.log("in the content.js file");
	var currentWord = "";
	var key;
	var word;

	$(document).keydown(function(event){
		key = event.keyCode
		if(key == 32){
			console.log("'" + currentWord.trim() + "'");
			currentWord = "";
		}
		currentWord += String.fromCharCode(key)
	})

	// console.log($(event.target).text());	

	// $.ajax({
	// 	url: "http://words.bighugelabs.com/api/2/7b6ad11fccc077c6e8794f11597d63e9/brave/json",
	// 	success: function(data, textStatus, jqXHR){
	// 		console.log(data);
	// 	},
	// 	dataType: "json"
	// })
})