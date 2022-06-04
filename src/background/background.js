import rolimons from './rolimons';
import roblox from './roblox';

'use strict';

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request === 'getAllData') {
        sendResponse({
            roblox,
            rolimons: rolimons()
        });
    }
});