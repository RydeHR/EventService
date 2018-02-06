/* ----------- REQUIRE PACKAGES ----------- */
const chai = require('chai');
const assert = chai.assert;
const cassandra = require('cassandra-driver');
const roundZero = require('../server/roundZero.js');

/* ----------- DATABASE CONNECTION ----------- */
client = new cassandra.Client({ contactPoints: ['127.0.0.1'], keyspace: 'dillon' });
client.connect();

/* ----------- FUNCTIONS TO TEST ----------- */
const retrievePricingData = roundZero.retrievePricingData;
const storePricingData = roundZero.storePricingData;
const sendToSQSPricingService = roundZero.sendToSQSPricingService;

/* ----------- UNIT TESTS ----------- */
describe('Round Zero - Rider Opens The App', () => {
  it('Should Retrieve 5000 Pricing Entries', (done) => {
    retrievePricingData().then((result) => { assert.equal(result.rowLength, 5000); });
    done();
  })
  it('Should Store A New Pricing Entry', (done) => {
    const fakePricingData = [9999999,1494146909000,76,7.95,true].join(',');
    storePricingData(fakePricingData).then((result) => { assert.equal(typeof result.info, 'object') });
    done();
  })
  it('Should Pass On New Pricing Information To Pricing Services', (done) => {
    sendToSQSPricingService().then((result) => { assert.equal(typeof result.MessageId, 'string') });
    done();
  })
})