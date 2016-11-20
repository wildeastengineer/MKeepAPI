'use strict';

const root = require('rootrequire');
const config = require(`${root}/${process.env.TEST_SRC}/libs/config`);
const currencyController = require(`${root}/${process.env.TEST_SRC}/controllers/currency.js`);
const mongoose = require('mongoose');

require('jasmine-expect');

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

describe('Test public methods of Currency controller', () => {
    let currency;
    let exchangeRateService;

    beforeAll(function () {
        mongoose.connect(`${config.get('database:uri')}:${config.get('database:port')}
            /${config.get('database:name')}`, (err) => {
                if (err) {
                    console.log(err)
                }
            });
    });

    beforeEach(() => {

    });

    it('Should Get All Currencies', (done) => {
        currencyController.getAll()
            .then((currencies) => {
                expect(currencies).toBeArrayOfObjects();

                currency = currencies[getRandomInt(0, currencies.length)];

                done()
            })
            .fail((error) => {
                expect(error).toBe(null);

                done()
            });
    });

    it('Should Get Currency by give ID', (done) => {
        currencyController.getById(currency._id)
            .then((currency) => {
                expect(currency).toBeObject();
                expect(currency).toHaveString('iso');
                expect(currency).toHaveDate('modified');
                expect(currency).toHaveDate('created');

                done()
            })
            .fail((error) => {
                expect(error).toBe(null);

                done()
            });
    });

    it('Should Get All Currency Exchange Services', (done) => {
        currencyController.getAllCurrencyExchangeServices()
            .then((exchangeRateServices) => {
                expect(exchangeRateServices).toBeArrayOfObjects();

                exchangeRateService = exchangeRateServices[getRandomInt(0, exchangeRateServices.length)];

                done()
            })
            .fail((error) => {
                expect(error).toBe(null);

                done()
            });
    });

    it('Should Get Currency Exchange Service by given ID', (done) => {
        currencyController.getCurrencyExchangeRate(exchangeRateService._id)
            .then((exchangeRateService) => {
                expect(exchangeRateService).toBeObject();
                expect(exchangeRateService).toHaveString('name');
                expect(exchangeRateService).toHaveString('abbreviation');
                expect(exchangeRateService).toHaveString('url');
                expect(exchangeRateService).toHaveDate('lastUpdate');
                //expect(exchangeRateService).toHaveNumber('updatePeriod');
                //expect(exchangeRateService).toHaveString('updateTime');
                expect(exchangeRateService).toHaveString('base');
                expect(exchangeRateService).toHaveObject('rates');
                expect(exchangeRateService).toHaveDate('created');

                done()
            })
            .fail((error) => {
                expect(error).toBe(null);

                done()
            });
    });

    afterAll(() => {
        mongoose.disconnect();
    })
});
