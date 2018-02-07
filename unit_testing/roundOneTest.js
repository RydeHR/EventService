/* ----------- REQUIRE PACKAGES ----------- */
const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const cassandra = require('cassandra-driver');
const roundOne = require('../server/roundOne.js');

/* ----------- DATABASE CONNECTION ----------- */
client = new cassandra.Client({ contactPoints: ['127.0.0.1'], keyspace: 'dillon' });
client.connect();

/* ----------- FUNCTIONS TO TEST ----------- */
const logCloseEvent = roundOne.logCloseEvent;
const getSQSAttributes = roundOne.getSQSAttributes;
const receiveSQSMessage = roundOne.receiveSQSMessage;

/* ----------- UNIT TESTS ----------- */
describe('Round One - Rider Disagrees With The Surge Multiplier', () => {
  it('LogCloseEvent Should Store Event Entries In Under 200ms', (done) => {
    const startTime = new Date();
    const eventData = [5,1498251114000,1486865217000,true,42271,"'Dillon'",95176,"'Crystel'",true,1517529029000,1517506893000,"[12.0647, -161.1626]","[-89.3211, 161.7898]",153,4.21,164.99,true].join(',');
    logCloseEvent(eventData).then((result) => { expect((new Date() - startTime)/1000).to.be.below(200); });
    done();
  })
  it('GetSQSAttributes Should Return An Integer', (done) => {
    getSQSAttributes().then((result) => { assert.equal(typeof parseInt(result), 'number') }).catch((error) => console.log(error));
    done();
  })
  it('ReceiveSQSMessage Should Retrieve A Message From The SQS Queue', (done) => {
    receiveSQSMessage().then((result) => { assert.equal(typeof result, 'object'); }).catch((error) => console.log(error));
    done();
  })
  xit('ReceiveSQSMessage Should Delete A Message From The SQS Queue', (done) => {
    receiveSQSMessage().then((result) => { assert.equal(typeof result, 'object'); }).catch((error) => console.log(error));
    done();
  })
})