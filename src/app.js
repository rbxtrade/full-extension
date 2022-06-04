import './app.css';

window.root = document.getElementById('root');

var loaded = false;
var current = {
    page: 'index',
    data: null
};
var samples = {
    'index': []
}

const scripts = {
    "index": () => new Promise(resolve => chrome.runtime.sendMessage('getAllData', (response) => {
        resolve(response);
    }))
};

const loadData = async(page, data) => {
    const apiData = await scripts[page.toString()]();

    const limitedSample = samples[page][0].cloneNode(true);
    var limiteds = [];

    if (apiData.roblox.user) {
        document.getElementById('inventoryLink').href = `https://www.roblox.com/users/${apiData.roblox.user.UserID}/inventory`;
        document.getElementById('stats.robux').innerText = apiData.roblox.user.RobuxBalance.toLocaleString();
        var rap = 0;
        var net = 0;

        if (apiData.roblox.inventory) {
            for (var i = 0; i < apiData.roblox.inventory.length; i++) {
                const limited = apiData.roblox.inventory[i];
                rap += limited.recentAveragePrice;

                const cheapest = apiData.rolimons[limited.assetId.toString()][5];
                var limitedNet = cheapest * 0.7;
                if (limitedNet > limited.recentAveragePrice * 0.7) {
                    limitedNet = limited.recentAveragePrice * 0.7;
                }
                net += limitedNet;

                // create limited divs
                const limitedDiv = limitedSample.cloneNode(true);
                limitedDiv.id = limited.assetId.toString() + '-' + limited.userAssetId.toString();
                if (limited.serialNumber !== null) {
                    limitedDiv.querySelector('#serial').innerText = limited.serialNumber.toLocaleString();
                } else {
                    limitedDiv.querySelector('#seriall').style.display = 'none';
                }
                limitedDiv.querySelector('#price').innerText = cheapest.toLocaleString();
                limitedDiv.querySelector('#rap').innerText = limited.recentAveragePrice.toLocaleString();
                if (apiData.rolimons[limited.assetId.toString()][16] !== null) {
                    limitedDiv.querySelector('#rolimons').innerText = apiData.rolimons[limited.assetId.toString()][16].toLocaleString();
                } else {
                    limitedDiv.querySelector('.rolipos').style.display = 'none';
                }
                limitedDiv.querySelector('img').src = apiData.rolimons[limited.assetId.toString()][23];
                limiteds.push(limitedDiv);

                limitedDiv.onclick = (e, limitedId = limited.assetId.toString()) => {
                    window.location = 'https://www.roblox.com/catalog/' + limitedId
                }
            }
        }

        net += apiData.roblox.user.RobuxBalance;
        document.getElementById('stats.rap').innerText = rap.toLocaleString();
        document.getElementById('stats.net').innerText = Math.round(net).toLocaleString();
        if (apiData.roblox.transactionTotals && apiData.roblox.transactionTotals.salesTotal) {
            document.getElementById('stats.income').innerText = apiData.roblox.transactionTotals.salesTotal.toLocaleString();
        }

        document.querySelector('.inventory').innerHTML = '';
        const inventory = document.querySelector('.inventory');
        for (var i = 0; i < limiteds.length; i++) {
            inventory.appendChild(limiteds[i]);
        }

        if (apiData.roblox.counts) {
            document.getElementById('counts.trades').innerText = apiData.roblox.counts.inbound.toLocaleString();
            document.getElementById('counts.requests').innerText = apiData.roblox.counts.requests.toLocaleString();
            document.getElementById('counts.messages').innerText = apiData.roblox.counts.pms.toLocaleString();
        }
    }

    loaded = true;
}

const load = async(page, data = null) => {
    window.root.className = 'index';

    samples[page].push(document.getElementById('sample').cloneNode(true));
    document.getElementById('counts.trades').parentNode.parentNode.onclick = () => {
        window.location = 'https://www.roblox.com/trades';
    }
    document.getElementById('counts.requests').parentNode.parentNode.onclick = () => {
        window.location = 'https://www.roblox.com/users/friends#!/friend-requests';
    }
    document.getElementById('counts.messages').parentNode.parentNode.onclick = () => {
        window.location = 'https://www.roblox.com/my/messages/#!/inbox';
    }
    document.getElementById('stats.income').parentNode.parentNode.onclick = () => {
        window.location = 'https://www.roblox.com/transactions';
    }

    await loadData(page, data);
};

loaded = false;
current.page = 'index';
load('index');

(async() => {
    while (true) {
        if (loaded) {
            await loadData(current.page, current.data);
            await new Promise(resolve => setTimeout(resolve, 6000));
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
})();