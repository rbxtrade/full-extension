var roblox = {};

const getUserInfo = async() => {
    const response = await fetch('https://www.roblox.com/mobileapi/userinfo');
    try {
        const data = await response.json();
        return data;
    } catch (e) {
        return {};
    }
}

const getInventory = async(userId, cursor = "") => {
    const response = await fetch(`https://inventory.roblox.com/v1/users/${userId}/assets/collectibles?sortOrder=Asc&limit=100&cursor=${cursor}`);
    try {
        const data = await response.json();
        return data;
    } catch (e) {
        return {};
    }
}

const getFullInventory = async(userId, timeOut = 0) => {
    var cursor = "";
    var items = [];
    while (cursor !== null) {
        const data = await getInventory(userId, cursor);
        items = [...items, ...data.data];
        cursor = data.nextPageCursor;
        if (cursor !== null) {
            await new Promise(resolve => setTimeout(resolve, timeOut));
        }
    }
    return items;
}

const getTransactionTotals = async(userId, timeFrame = "Month") => {
    const response = await fetch(`https://economy.roblox.com/v2/users/${userId}/transaction-totals?timeFrame=${timeFrame}&transactionType=summary`);
    try {
        const data = await response.json();
        return data;
    } catch (e) {
        return {};
    }
}

const getInboundCount = async() => {
    const response = await fetch('https://trades.roblox.com/v1/trades/inbound/count');
    try {
        const data = await response.json();
        return data.count;
    } catch (e) {
        return roblox['counts'].inbound;
    }
}
const getFriendRequestsCount = async() => {
    const response = await fetch('https://friends.roblox.com/v1/user/friend-requests/count');
    try {
        const data = await response.json();
        return data.count;
    } catch (e) {
        return roblox['counts'].requests;
    }
}
const getUnreadPMCount = async() => {
    const response = await fetch('https://privatemessages.roblox.com/v1/messages/unread/count');
    try {
        const data = await response.json();
        return data.count;
    } catch (e) {
        return roblox['counts'].pms;
    }
}

(async() => {
    roblox['user'] = await getUserInfo();
    if (roblox['user'].UserID) {
        roblox['inventory'] = await getFullInventory(roblox['user'].UserID, 900);
    }
    roblox['transactionTotals'] = (await getTransactionTotals(roblox['user'].UserID)).salesTotal;

    while (true) {
        await new Promise(resolve => setTimeout(resolve, 120000))

        roblox['user'] = await getUserInfo();
        if (roblox['user'].UserID) {
            roblox['inventory'] = await getFullInventory(roblox['user'].UserID, 1000);
            roblox['transactionTotals'] = await getTransactionTotals(roblox['user'].UserID);
        }
    }
})();

(async() => {
    roblox['counts'] = {
        inbound: 0,
        requests: 0,
        pms: 0
    };

    while (true) {
        roblox['counts'].inbound = await getInboundCount();
        roblox['counts'].requests = await getFriendRequestsCount();
        roblox['counts'].pms = await getUnreadPMCount();

        await new Promise(resolve => setTimeout(resolve, 8000));
    }
})();

export default roblox;