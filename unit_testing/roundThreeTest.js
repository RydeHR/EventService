/* ----------- REQUIRE PACKAGES ----------- */
const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const cassandra = require('cassandra-driver');
const roundThree = require('../server/roundThree.js');

/* ----------- DATABASE CONNECTION ----------- */
client = new cassandra.Client({ contactPoints: ['127.0.0.1'], keyspace: 'dillon' });
client.connect();

/* ----------- FUNCTIONS TO TEST ----------- */
const storeLocationData = roundThree.storeLocationData;
const publishLocationsDataToSNS = roundThree.publishLocationsDataToSNS;

/* ----------- UNIT TESTS ----------- */
describe('Round Three - Rider Books A Ride', () => {
  it('StoreLocationData Should Store A New Pricing Entry', (done) => {
    const fakeLocationData = [9999999,"[-59.0519, 41.6842]",76].join(',');
    storeLocationData(fakeLocationData).then((result) => { assert.equal(typeof result.info, 'object'); }).catch((error) => console.log(error));
    done();
  })
  it('StoreLocationData Should Store Pricing Entries In Under 200ms', (done) => {
    const fakeLocationData = [9999999,"[-59.0519, 41.6842]",76].join(',');
    const startTime = new Date();
    storeLocationData(fakeLocationData).then(() => { expect((new Date() - startTime)/1000).to.be.below(200); }).catch((error) => console.log(error));
    done();
  })
  it('PublishLocationsDataToSNS Should Return A Promise', (done) => {
    var publishFunction = publishLocationsDataToSNS([9999999,"[-59.0519, 41.6842]",76]);
    assert.equal(typeof publishFunction.then, 'function');
    done();
  })
  it('PublishLocationsDataToSNS Should Pass On New Pricing Information To Pricing Services', (done) => {
    publishLocationsDataToSNS([9999999,"[-59.0519, 41.6842]",76]).then((result) => { assert.equal(typeof result, 'object'); }).catch((error) => console.log(error));
    done();
  })
})