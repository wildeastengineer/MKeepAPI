const entityFolder = '../../../../entity';
const exchangeRateServices = require(`${entityFolder}/exchangeRateServices`);
const fs = require('fs');
const moment = require('moment');
const root = require('rootrequire');
const exchangeRateServiceHelper = require(`${root}/src/utils/helpers/exchangeRateServiceHelper.js`);

describe('Test Exchange Rate Service Helper', () => {
    describe('Test requests to External Currency Rate Services', () => {
        it('Should send request to CBR service and get response', (done) => {
            exchangeRateServiceHelper.requestCurrencyRates(exchangeRateServices.cbr.url)
                .then((rate) => {
                    expect(rate).toBeNonEmptyString();

                    done()
                })
                .fail((error) => {
                    expect(error).toBe(null);

                    done()
                });
        });

        it('Should send request to OER (forex) service and get response', (done) => {
            exchangeRateServiceHelper.requestCurrencyRates(exchangeRateServices.oer.url)
                .then((rate) => {
                    expect(rate).toBeNonEmptyString();

                    done()
                })
                .fail((error) => {
                    expect(error).toBe(null);

                    done()
                });
        });


        it('Should send request to ECB service and get response', (done) => {
            exchangeRateServiceHelper.requestCurrencyRates(exchangeRateServices.ecb.url)
                .then((rate) => {
                    expect(rate).toBeNonEmptyString();

                    done()
                })
                .fail((error) => {
                    expect(error).toBe(null);

                    done()
                });
        });
    });

    describe('Test methods that convert responses to Exchange Rate objects', () => {
        let rate;

        it('Should convert give CBR XML string to currency rate object', (done) => {
            const CBRXmlString = readEntityFile('CBRXmlResponse');
            rate = exchangeRateServiceHelper.getCBRRatesObject(CBRXmlString);

            expect(rate).toBeNonEmptyObject();
            expect(rate).toHaveNonEmptyString('EUR');
            expect(rate).toHaveNonEmptyString('USD');
            expect(rate).toHaveNonEmptyString('CAD');

            done()
        });

        it('Should convert give ECB XML string to currency rate object', (done) => {
            const ECBXmlString = readEntityFile('ECBXmlResponse');
            rate = exchangeRateServiceHelper.getECBRatesObject(ECBXmlString);

            expect(rate).toBeNonEmptyObject();
            expect(rate).toHaveNonEmptyString('RUB');
            expect(rate).toHaveNonEmptyString('USD');
            expect(rate).toHaveNonEmptyString('CAD');

            done();
        });

        it('Should convert give OER XML string to currency rate object', (done) => {
            const OERJsonString = readEntityFile('OERJsonResponse');
            rate = exchangeRateServiceHelper.getOERRatesObject(OERJsonString);

            expect(rate).toBeNonEmptyObject();
            expect(rate).toHaveNumber('RUB');
            expect(rate).toHaveNumber('USD');
            expect(rate).toHaveNumber('CAD');
            expect(rate).toHaveNumber('EUR');
            expect(rate.USD).toBe(1);

            done();
        });
    });

    describe('Test isUpdateRequire method', () => {
        let exchangeRateService;
        let result;

        it('Should returns TRUE if lastUpdate is not defined', (done) => {
            exchangeRateService = {
                rate: {
                    RUB: 64.9351
                }
            };

            result = exchangeRateServiceHelper.isUpdateRequired(exchangeRateService);

            expect(result).toBeBoolean();
            expect(result).toBe(true);

            done();
        });

        it('Should returns TRUE if rate is not defined', (done) => {
            exchangeRateService = {
                lastUpdate: moment().format()
            };

            result = exchangeRateServiceHelper.isUpdateRequired(exchangeRateService);

            expect(result).toBeBoolean();
            expect(result).toBe(true);

            done();
        });

        it('Should returns TRUE if rate is empty object', (done) => {
            exchangeRateService = {
                lastUpdate: moment().format(),
                rates: {}
            };

            result = exchangeRateServiceHelper.isUpdateRequired(exchangeRateService);

            expect(result).toBeBoolean();
            expect(result).toBe(true);

            done();
        });

        it('Should returns FALSE if lastUpdate is BEFORE updateTime and updateTime is AFTER Current Time and' +
              'Next Update Time within 24 hours after lastUpdate', (done) => {
            exchangeRateService = {
                lastUpdate: moment().subtract(1, 'h').format(),
                updateTime: moment().add(1, 'h').format('HH-mm-ssZZ'),
                rates: {
                    RUB: 64.9351
                }
            };

            result = exchangeRateServiceHelper.isUpdateRequired(exchangeRateService);

            expect(result).toBeBoolean();
            expect(result).toBe(false);

            done();
        });

        it('Should returns FALSE if lastUpdate is BEFORE updateTime and updateTime is BEFORE Current Time and' +
               'Next Update Time within 24 hours after lastUpdate', (done) => {
            exchangeRateService = {
                lastUpdate: moment().subtract(1, 'h').format(),
                updateTime: moment().subtract(1, 'h').format('HH-mm-ssZZ'),
                rates: {
                    RUB: 64.9351
                }
            };

            result = exchangeRateServiceHelper.isUpdateRequired(exchangeRateService);

            expect(result).toBeBoolean();
            expect(result).toBe(false);

            done();
        });

        it('Should returns TRUE if lastUpdate is BEFORE Current Time and Current Time is BEFORE Next' +
              'Update Time and lastUpdate is more than 24 hours behind Next Update Time', (done) => {
            exchangeRateService = {
                lastUpdate: moment().subtract(1, 'h'),
                updateTime: moment().add(1, 'd').format('HH-mm-ssZZ'),
                rates: {
                    RUB: 64.9351
                }
            };

            result = exchangeRateServiceHelper.isUpdateRequired(exchangeRateService);

            expect(result).toBeBoolean();
            expect(result).toBe(true);

            done();
        });

        it('Should returns TRUE if lastUpdate is late than updatePeriod', (done) => {
            exchangeRateService = {
                lastUpdate: moment().subtract(3, 'h'),
                updatePeriod: 7200, // in seconds
                rates: {
                    RUB: 64.9351
                }
            };

            result = exchangeRateServiceHelper.isUpdateRequired(exchangeRateService);

            expect(result).toBeBoolean();
            expect(result).toBe(true);

            done();
        });

        it('Should returns TRUE if lastUpdate is within updatePeriod', (done) => {
            exchangeRateService = {
                lastUpdate: moment().subtract(1, 'h'),
                updatePeriod: 7200, // in seconds
                rates: {
                    RUB: 64.9351
                }
            };

            result = exchangeRateServiceHelper.isUpdateRequired(exchangeRateService);

            expect(result).toBeBoolean();
            expect(result).toBe(false);

            done();
        });
    });
});

/**
 * Get give entity test file date
 *
 * @param {string} fileName
 *
 * @returns {string}
 */
function readEntityFile(fileName) {
    let fileData;

    try {
        fileData = fs.readFileSync(`${__dirname}/${entityFolder}/${fileName}`, 'utf8');
    } catch (error) {
        console.error(error);
    }

    return fileData.toString();
}
