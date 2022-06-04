var data = {};

const getLimitedInfo = async() => {
    const body = await fetch('http://www.rolimons.com/catalog');
    const data = await body.text();
    return JSON.parse(data.split('var item_details = ')[1].split(';')[0]);
}

(async() => {
    while (true) {
        data = await getLimitedInfo();
        await new Promise(resolve => setTimeout(resolve, 120000))
    }
})();

export default () => {
    return data;
};