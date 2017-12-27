'use strict';
const root = require('rootrequire');
const currencyController = require(`${root}/src/controllers/currency.js`);

describe('Test Currency Controller', () => {
    let currency;

    it('Should Get All Currencies', (done) => {
        currencyController.getAll()
            .then((currencies) => {
                expect(currencies).toBeArrayOfObjects();
                expect(currencies.length).toBe(32);

                currency = currencies[0];

                done();
            })
            .fail((error) => {
                expect(error).toBe(null);

                done();
            });
    });

    it('Should Get first Currency by give ID', (done) => {
        currencyController.getById(currency._id)
            .then((currency) => {
                expect(currency).toBeObject();
                expect(currency).toHaveString('iso');
                expect(currency).toHaveDate('modified');
                expect(currency).toHaveDate('created');
                expect(currency.iso).toBe('AUD');

                done();
            })
            .fail((error) => {
                expect(error).toBe(null);

                done();
            });
    });
});
