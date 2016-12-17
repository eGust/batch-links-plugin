chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    if (msg.text === 'fetch_body') {
        sendResponse(document.body.innerHTML);
    }
})
