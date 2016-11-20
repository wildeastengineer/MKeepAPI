const exchangeRateServices = {
    cbr: {
        name: 'Центральный банк Российской Федерации',
        abbreviation: 'CBR',
        url: 'http://www.cbr.ru/scripts/XML_daily_eng.asp',
        updateTime: '14:00:00 GMT+0300',
        base: 'RUB'
    },
    ecb: {
        name: 'European Central Bank',
        abbreviation: 'ECB',
        url: 'http://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml',
        updateTime: '16:00:00 GMT+0100',
        base: 'EUR'
    },
    oer: {
        name: 'Open Exchange Rates API (forex)',
        abbreviation: 'OER',
        url: 'https://openexchangerates.org/api/latest.json?app_id=f30c1cbbe48445d3af6a995d7fd9f30b',
        updatePeriod: 3600, //seconds
        base: 'USD'
    }
};

module.exports = exchangeRateServices;