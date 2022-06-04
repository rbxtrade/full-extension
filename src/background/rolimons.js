var data = {};

const getLimitedInfo = async() => {
    const body = await fetch('http://www.rolimons.com/catalog');
    const data = await body.text();
    return JSON.parse(data.split('var item_details = ')[1].split(';')[0]);
}

(async() => {
    while (true) {
        data = await getLimitedInfo();
        // var items = {};
        // for (let i = 0; i < Object.keys(data).length; i++) {
        //     const limitedId = Object.keys(data)[i];
        //     const limitedData = data[limitedId];
        //     items[limitedId] = {
        //         name: limitedData[0],
        //         type: limitedData[1],
        //         originalPrice: limitedData[2],
        //         createdEpoch: limitedData[3],
        //         foundByRolimonsEpoch: limitedData[4],
        //         bestPrice: limitedData[5],
        //         favorites: limitedData[6],
        //         sellers: limitedData[7],
        //         rap: limitedData[8],
        //         owners: limitedData[9],
        //         premiumOwners: limitedData[10],
        //         totalCopies: limitedData[11],
        //         deletedCopies: limitedData[12],
        //         premiumCopies: limitedData[13],
        //         hoardedCopies: limitedData[14],
        //         acronym: limitedData[15],
        //         value: limitedData[16],
        //         averageDailySales: limitedData[17],
        //         trend: limitedData[18],
        //         projected: limitedData[19],
        //         hyped: limitedData[20],
        //         rare: limitedData[21],
        //         thumbnail_url_lg: limitedData[22]
        //     };
        // }
        // rolimons = items;

        await new Promise(resolve => setTimeout(resolve, 120000))
    }
})();

export default () => {
    return data;
};