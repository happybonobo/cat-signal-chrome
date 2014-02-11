// Cat Signal

// Set defaults.
var saved = localStorage;
if (!saved.lastRequest) {
    saved.lastRequest = 0;
}

chrome.browserAction.onClicked.addListener(function() {
    saved.lastRequest = 0;
    makeRequest();
});

var notification, xhr;

function makeRequest() {
    // Append timestamp to URL.
    var url = 'http://mothership.fightforthefuture.org/campaigns/query?since_timestamp=' + saved.lastRequest;

    xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.onreadystatechange = onResponse;
    xhr.send();
}

function onResponse() {
    if (xhr.readyState !== 4) {
        return;
    }

    // Update saved timestamp.
    saved.lastRequest = Date.now();

    // Check for new campaigns.
    var campaigns = JSON.parse(xhr.responseText).campaigns;
    if (!campaigns.length) {
        return;
    }

    // Select first campaign.
    var campaign = campaigns[0];

    // Shorten description.
    var description = campaign.description.split('\n')[0];
    
    if (notification) {
        notification.cancel();
    }

    notification = webkitNotifications.createNotification(
        'catface.png',  // icon url - can be relative
        campaign.name,  // notification title
        description  // notification body text
    );

    notification.addEventListener('click', function() {
        notification.cancel();
        window.open(campaign.url);
    });

    notification.show();
}

makeRequest();
