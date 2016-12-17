function getActiveBody(cb) {
    chrome.tabs.query(
        {active: true, currentWindow: true},
        (tabs) => {
            // console.log('tabs:', tabs);
            tabs[0] && chrome.tabs.sendMessage(tabs[0].id, {text: 'fetch_body'}, (html) => {
                // console.log('html:', html)
                cb && cb(html);
            })
        }
    )
}
