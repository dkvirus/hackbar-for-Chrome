/**
 When we receive the message, execute the given script in the given
 tab.
 */
'use strict';
let referer;
let user_agent;
let cookie;
let method;
let postDataCurrent = [];

function setCurrentPostData(e) {
    if (e.method === "POST" && e.requestBody) {
        let rawData = e.requestBody.formData;
        var post_data_array = [];
        for (let key in rawData) {
            if (rawData.hasOwnProperty(key)) {
                var item = key + "=" + rawData[key];
                post_data_array.push(item);
            }
        }
        chrome.tabs.query(
            {currentWindow: true, active: true},
            function (tabArray) {
                const currentTabId = tabArray[0].id;
                postDataCurrent.push({'tabId': currentTabId, 'data': post_data_array.join("&")});
            }
        );
    }
}

function getCurrentPostData(currentTabId) {
    for (let i = 0; i < postDataCurrent.length; i++) {
        if (postDataCurrent[i].tabId === currentTabId) {
            return postDataCurrent[i].data;
        }
    }
    return null;
}

function rewriteHeaders(e) {
    let index_referer, index_user_agent, index_cookie;
    index_cookie = index_referer = index_user_agent = -1;
    for (let i = 0; i < e.requestHeaders.length; i++) {
        let v = e.requestHeaders[i];
        switch (v.name.toLowerCase()) {
            case 'referer':
                index_referer = i;
                break;
            case 'user-agent':
                index_user_agent = i;
                break;
            case 'cookie':
                index_cookie = i;
                break;
        }
    }
    //add referer
    if (referer) {
        if (index_referer !== -1) {
            e.requestHeaders[index_referer].value = referer;
        } else {
            e.requestHeaders.push({
                name: "Referer",
                value: referer
            });
        }
    }
    //modify user agent
    if (user_agent) {
        if (index_user_agent !== -1) {
            e.requestHeaders[index_user_agent].value = user_agent;
        } else {
            e.requestHeaders.push({
                name: "User-Agent",
                value: user_agent
            });
        }
    }
    //modify cookie
    if (cookie) {
        if (index_cookie !== -1) {
            e.requestHeaders[index_cookie].value = cookie;
        } else {
            e.requestHeaders.push({
                name: "Cookie",
                value: cookie
            });
        }
    }
    return {requestHeaders: e.requestHeaders};
}

function handleMessage(request, sender, sendResponse) {
    if (sender.url !== chrome.runtime.getURL("/theme/hacktools-panel.html")) {
        return;
    }
    const tabId = request.tabId;
    const action = request.action;
    switch (action) {
        case 'send_requests':
            const Data = request.data;
            const url = Data.url;
            method = Data.method;
            referer = Data.referer;
            user_agent = Data.user_agent;
            cookie = Data.cookie;

            if (method === 'GET') {
                chrome.tabs.update(tabId, {url: url});
            } else {
                const post_data = JSON.stringify(Data.post_data);
                chrome.tabs.executeScript(tabId, {code: 'var post_data = "' + encodeURIComponent(post_data) + '"; var url = "' + encodeURIComponent(url) + '"'}, function () {
                    chrome.tabs.executeScript(tabId, {file: 'theme/js/post_form.js'});
                });
            }
            chrome.webRequest.onBeforeSendHeaders.addListener(
                rewriteHeaders,
                {urls: ["<all_urls>"], tabId: tabId},
                ["blocking", "requestHeaders"]
            );
            sendResponse({status: true});
            break;
        case 'load_url':
            chrome.tabs.get(tabId, function (tab) {
                const data = getCurrentPostData(tabId);
                sendResponse({url: tab.url, data: data});
            });
            break;
    }
    return true;
}

chrome.webRequest.onBeforeRequest.addListener(
    setCurrentPostData,
    {urls: ["<all_urls>"]},
    ["requestBody"]
);

/**
 Listen for messages from our devtools panel.
 */
chrome.runtime.onMessage.addListener(handleMessage);