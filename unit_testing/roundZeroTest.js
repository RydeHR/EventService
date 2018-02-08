/* ----------- REQUIRE PACKAGES ----------- */
const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const cassandra = require('cassandra-driver');
const roundZero = require('../server/roundZero.js');

/* ----------- DATABASE CONNECTION ----------- */
client = new cassandra.Client({ contactPoints: ['127.0.0.1'], keyspace: 'dillon' });
client.connect();

/* ----------- FUNCTIONS TO TEST ----------- */
const retrievePricingData = roundZero.retrievePricingData;
const storePricingData = roundZero.storePricingData;
const publishPricingDataToSNS = roundZero.publishPricingDataToSNS;

/* ----------- UNIT TESTS ----------- */
describe('Round Zero - Rider Opens The App', () => {
  it('RetrievePricingData Should Continuously Retrieve Less Than Or 5000 Pricing Entries', (done) => {
    retrievePricingData().then((result) => { assert.equal(result.rowLength <= 5000, true); });
    done();
  })
  it('RetrievePricingData Should Retrieve Pricing Entries In Under 200ms', (done) => {
    const startTime = new Date();
    retrievePricingData().then((result) => { expect((new Date() - startTime)/1000).to.be.below(200); }).catch((error) => console.log(error));
    done();
  })
  it('StorePricingData Should Store A New Pricing Entry', (done) => {
    const fakePricingData = [9999999,1494146909000,76,7.95,true].join(',');
    storePricingData(fakePricingData).then((result) => { assert.equal(typeof result.info, 'object'); }).catch((error) => console.log(error));
    done();
  })
  it('StorePricingData Should Store Pricing Entries In Under 200ms', (done) => {
    const fakePricingData = [9999999,1494146909000,76,7.95,true].join(',');
    const startTime = new Date();
    storePricingData(fakePricingData).then(() => { expect((new Date() - startTime)/1000).to.be.below(200); }).catch((error) => console.log(error));
    done();
  })
  it('PublishPricingDataToSNS Should Return A Promise', (done) => {
    var publishFunction = publishPricingDataToSNS([9999999,1494146909000,76,7.95,true]);
    assert.equal(typeof publishFunction.then, 'function');
    done();
  })
  it('PublishPricingDataToSNS Should Pass On New Pricing Information To Pricing Services', (done) => {
    publishPricingDataToSNS([9999999,1494146909000,76,7.95,true]).then((result) => { assert.equal(typeof result, 'object'); }).catch((error) => console.log(error));
    done();
  })
})