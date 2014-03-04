chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if (request.method == "getStatus") {
		sendResponse({status: "hello");
	} else {
		sendResponse({});
	}
})