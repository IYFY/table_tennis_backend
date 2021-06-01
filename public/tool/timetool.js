function rTime(date) {
    // 2020-06-27T14:20:27.000000Z 时间格式转换成 2020-06-27 14:20:27
    if(!date) return ''
    var json_date = new Date(date).toJSON();
    return new Date(new Date(json_date) + 8 * 3600 * 1000)
        .toISOString()
        .replace(/T/g, ' ')
        .replace(/\.[\d]{3}Z/, '');
}

function getdate() {
    // 2021-04-18T13:59:49.823Z  换成 210418
    const date = new Date().toISOString().slice(2,10).replace(/\-/g, '')
    return date
}



module.exports = {rTime,getdate}