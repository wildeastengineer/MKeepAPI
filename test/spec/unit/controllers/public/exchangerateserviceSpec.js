'use strict';

const root = require('rootrequire');
const exchangeRateServiceController = require(`${root}/${process.env.TEST_SRC}/controllers/exchangerateservice.js`);
const exchangeRateServices = require('../../../../entity/exchangeRateServices');

describe('Test PUBLIC methods of Exchange Rate Service controller', () => {
    let exchangeRateServiceList;

    it('Should Get All Currency Exchange Services', (done) => {
        exchangeRateServiceController.getAll()
            .then((exchangeRateServices) => {
                expect(exchangeRateServices).toBeArrayOfObjects();

                exchangeRateServiceList = exchangeRateServices;

                done();
            })
            .fail((error) => {
                expect(error).toBe(null);

                done();
            });
    });

    it('Should Get Currency Exchange Service by given ID', (done) => {
        exchangeRateServiceController.getById(exchangeRateServiceList[0]._id)
            .then((exchangeRateService) => {
                expect(exchangeRateService).toBeObject();
                expect(exchangeRateService).toHaveString('name');
                expect(exchangeRateService).toHaveString('abbreviation');
                expect(exchangeRateService).toHaveString('url');
                expect(exchangeRateService).toHaveMember('lastUpdate');
                expect(exchangeRateService).toHaveString('base');
                expect(exchangeRateService).toHaveObject('rates');
                expect(exchangeRateService).toHaveDate('created');
                expect(exchangeRateService).toHaveString('updateTime');
                expect(exchangeRateService.abbreviation).toBe('CBR');

                done();
            })
            .fail((error) => {
                expect(error).toBe(null);

                done();
            });
    });

    it('Should Get CBR Currency Exchange Rate by given ID', (done) => {
        exchangeRateServiceController.getCurrencyExchangeRate(exchangeRateServiceList[0]._id)
            .then((exchangeRate) => {
                expect(exchangeRate.abbreviation).toBe(exchangeRateServices.cbr.abbreviation);
                expect(exchangeRate.base).toBe(exchangeRateServices.cbr.base);
                expect(exchangeRate.name).toBe(exchangeRateServices.cbr.name);
                expect(exchangeRate.url).toBe(exchangeRateServices.cbr.url);
                expect(exchangeRate.updateTime).toBe(exchangeRateServices.cbr.updateTime);
                expect(exchangeRate.rates).toBeNonEmptyObject();
                expect(Object.keys(exchangeRate.rates).length).toBe(34);

                done();
            })
            .fail((error) => {
                expect(error).toBe(null);

                done();
            });
    });

    it('Should Get ECB Currency Exchange Rate by given ID', (done) => {
        exchangeRateServiceController.getCurrencyExchangeRate(exchangeRateServiceList[1]._id)
            .then((exchangeRate) => {
                expect(exchangeRate.abbreviation).toBe(exchangeRateServices.ecb.abbreviation);
                expect(exchangeRate.base).toBe(exchangeRateServices.ecb.base);
                expect(exchangeRate.name).toBe(exchangeRateServices.ecb.name);
                expect(exchangeRate.url).toBe(exchangeRateServices.ecb.url);
                expect(exchangeRate.updateTime).toBe(exchangeRateServices.ecb.updateTime);
                expect(exchangeRate.rates).toBeNonEmptyObject();
                expect(Object.keys(exchangeRate.rates).length).toBe(31);

                done();
            })
            .fail((error) => {
                expect(error).toBe(null);

                done();
            });
    });

    it('Should Get OER (forex) Currency Exchange Rate by given ID', (done) => {
        exchangeRateServiceController.getCurrencyExchangeRate(exchangeRateServiceList[2]._id)
            .then((exchangeRate) => {
                expect(exchangeRate.abbreviation).toBe(exchangeRateServices.oer.abbreviation);
                expect(exchangeRate.base).toBe(exchangeRateServices.oer.base);
                expect(exchangeRate.name).toBe(exchangeRateServices.oer.name);
                expect(exchangeRate.url).toBe(exchangeRateServices.oer.url);
                expect(exchangeRate.updatePeriod).toBe(exchangeRateServices.oer.updatePeriod);
                expect(exchangeRate.rates).toBeNonEmptyObject();
                expect(Object.keys(exchangeRate.rates).length).toBe(170);

                done();
            })
            .fail((error) => {
                expect(error).toBe(null);

                done();
            });
    });
});
