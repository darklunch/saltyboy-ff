// Listen for messages from the content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    // Keep your existing logging if you wish
    if ('message' in request) {
        console.log(request.message)
    }

    // New handler: Proxy the fetch request
    if (request.type === 'fetchMatchData') {
        const SALTY_BOY_URL = 'https://www.salty-boy.com'
        const version = request.version || '1.8.2' 

        fetch(`${SALTY_BOY_URL}/api/current_match_info/?saltyboy_version=${version}`, {
            method: 'GET'
        })
        .then(res => {
            if (!res.ok) throw new Error(`Server returned ${res.status}`);
            return res.json();
        })
        .then(data => {
            sendResponse({ success: true, data: data });
        })
        .catch(error => {
            console.error('SaltyBoy Fetch Error:', error);
            sendResponse({ success: false, error: error.toString() });
        });

        // Return true to indicate we will send a response asynchronously
        return true; 
    }
})