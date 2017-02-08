/// Libs
const Q = require('q');

module.exports =  {
    /**
     * Migration that updates global currencies with additional data
     *
     * @param {DataBaseInstance} db
     *
     * @returns {promise}
     */
    execute: function (db) {
        const currencyCollection = db.collection('currencies');
        const currenciesList = {
            AUD: {
                sign: '$',
                name: 'Dollar',
                country: 'Australia'
            },
            BRL: {
                sign: 'R$',
                name: 'Real',
                country: 'Brazil'
            },
            CAD: {
                sign: '$',
                name: 'Dollar',
                country: 'Canada'
            },
            CHF: {
                sign: 'CHF',
                name: 'Franc',
                country: 'Switzerland'
            },
            CLP: {
                sign: '$',
                name: 'Peso',
                country: 'Chile'
            },
            CNY: {
                sign: '¥',
                name: 'Yuan Renminbi',
                country: 'China'
            },
            CZK: {
                sign: 'Kč',
                name: 'Koruna',
                country: 'Czech Republic'
            },
            DKK: {
                sign: 'kr',
                name: 'Krone',
                country: 'Denmark'
            },
            EUR: {
                sign: '€',
                name: 'Euro',
                country: 'Euro Member'
            },
            GBP: {
                sign: '£',
                name: 'Pound',
                country: 'United Kingdom'
            },
            HKD: {
                sign: '$',
                name: 'Dollar',
                country: 'Hong Kong'
            },
            HUF: {
                sign: 'Ft',
                name: 'Forint',
                country: 'Hungary'
            },
            IDR: {
                sign: 'Rp',
                name: 'Rupiah',
                country: 'Indonesia'
            },
            INR: {
                sign: '₹',
                name: 'Rupee',
                country: 'India'
            },
            ILS: {
                sign: '₪',
                name: 'Shekel',
                country: 'Israel'
            },
            JPY: {
                sign: '¥',
                name: 'Yen',
                country: 'Japan'
            },
            KRW: {
                sign: '₩',
                name: 'Won',
                country: 'Korea'
            },
            MXN: {
                sign: '$',
                name: 'Peso',
                country: 'Mexico'
            },
            NOK: {
                sign: 'kr',
                name: 'Krone',
                country: 'Norway'
            },
            NZD: {
                sign: '$',
                name: 'Dollar',
                country: 'New Zealand'
            },
            MYR: {
                sign: 'RM',
                name: 'Ringgit',
                country: 'Malaysia'
            },
            PHP: {
                sign: '₱',
                name: 'Peso',
                country: 'Philippines'
            },
            PKR: {
                sign: '₨',
                name: 'Rupee',
                country: 'Pakistan'
            },
            PLN: {
                sign: 'zł',
                name: 'Zloty',
                country: 'Poland'
            },
            RUB: {
                sign: '₽',
                name: 'Ruble',
                country: 'Russia'
            },
            SEK: {
                sign: 'kr',
                name: 'Krona',
                country: 'Sweden'
            },
            SGD: {
                sign: '$',
                name: 'Dollar',
                country: 'Singapore'
            },
            THB: {
                sign: '฿',
                name: 'Baht',
                country: 'Thailand'
            },
            TRY: {
                sign: '₺',
                name: 'Lira',
                country: 'Turkey'
            },
            TWD: {
                sign: 'NT$',
                name: 'New Dollar',
                country: 'Taiwan'
            },
            USD: {
                sign: '$',
                name: 'Dollar',
                country: 'United States'
            },
            ZAR: {
                sign: 'S',
                name: 'Rand',
                country: 'South Africa'
            }
        };
        const updateQueue = [];

        for (const iso in currenciesList) {
            const currencyData = currenciesList[iso];

            updateQueue.push(currencyCollection.update({
                iso
            }, {
                $set: currencyData
            }));
        }

        return Q.all(updateQueue);
    }
};
