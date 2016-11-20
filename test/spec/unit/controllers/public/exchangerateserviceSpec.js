'use strict';

const root = require('rootrequire');
const config = require(`${root}/${process.env.TEST_SRC}/libs/config`);
const exchangeRateServiceController = require(`${root}/${process.env.TEST_SRC}/controllers/exchangerateservice.js`);
const mongoose = require('mongoose');

require('jasmine-expect');

describe('Test public methods of Exchange Rate Service controller', () => {
    let exchangeRateService;

    it('Should Get All Currency Exchange Services', (done) => {
        exchangeRateServiceController.getAll()
            .then((exchangeRateServices) => {
                expect(exchangeRateServices).toBeArrayOfObjects();

                exchangeRateService = exchangeRateServices[0];

                done()
            })
            .fail((error) => {
                expect(error).toBe(null);

                done()
            });
    });

    it('Should Get Currency Exchange Service by given ID', (done) => {
        exchangeRateServiceController.getById(exchangeRateService._id)
            .then((exchangeRateService) => {
                expect(exchangeRateService).toBeObject();
                expect(exchangeRateService).toHaveString('name');
                expect(exchangeRateService).toHaveString('abbreviation');
                expect(exchangeRateService).toHaveString('url');
                expect(exchangeRateService).toHaveDate('lastUpdate');
                expect(exchangeRateService).toHaveString('base');
                expect(exchangeRateService).toHaveObject('rates');
                expect(exchangeRateService).toHaveDate('created');
                expect(exchangeRateService).toHaveString('updateTime');
                expect(exchangeRateService.abbreviation).toBe('CBR');

                done()
            })
            .fail((error) => {
                expect(error).toBe(null);

                done()
            });
    });
});
