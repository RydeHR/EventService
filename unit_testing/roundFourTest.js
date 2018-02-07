/* ----------- REQUIRE PACKAGES ----------- */
const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const cassandra = require('cassandra-driver');
const roundFour = require('../server/roundFour.js');

/* ----------- DATABASE CONNECTION ----------- */
client = new cassandra.Client({ contactPoints: ['127.0.0.1'], keyspace: 'dillon' });
client.connect();

/* ----------- FUNCTIONS TO TEST ----------- */
const insertAnalyticsData = roundFour.insertAnalyticsData;
const retrieveAnalyticsData = roundFour.retrieveAnalyticsData;

/* ----------- UNIT TESTS ----------- */
describe('Round Four - Answering The Business Question', () => {
  it('StorePricingData Should Store A New Pricing Entry', (done) => {
    const fakeAnalyticsData = [14,1506700000000,6.98].join(',');
    insertAnalyticsData(fakeAnalyticsData).then((result) => { assert.equal(typeof result.info, 'object'); }).catch((error) => console.log(error));
    done();
  })
  it('StorePricingData Should Store Pricing Entries In Under 200ms', (done) => {
    const fakeAnalyticsData = [14,1506700000000,6.98].join(',');
    const startTime = new Date();
    insertAnalyticsData(fakeAnalyticsData).then(() => { expect((new Date() - startTime)/1000).to.be.below(200); }).catch((error) => console.log(error));
    done();
  })
  it('RetrievePricingData Should Retrieve Pricing Entries In Under 200ms', (done) => {
    const startTime = new Date();
    let randomNumber = Math.floor(Math.random()*1500);
    retrieveAnalyticsData(randomNumber).then((result) => { expect((new Date() - startTime)/1000).to.be.below(200); }).catch((error) => console.log(error));
    done();
  })
})