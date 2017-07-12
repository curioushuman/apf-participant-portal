const salesforce = require('../salesforce');

/**
 * @api {get} /affiliations/:email Retrieve affiliation
 * @apiName RetrieveAffiliation
 * @apiGroup Affiliation
 * @apiSuccess {Object} affiliation Affiliation's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Affiliation not found.
 */
exports.retrieve = (req, res, next) => {

  if (!req.params.contactid || !req.params.accountid) {
    var err = new Error('Affiliation not found — Missing ID');
    console.error(err);
    return next(err);
  }

  salesforce.conn.sobject('npe5__Affiliation__c')
  .find(
    {
      'npe5__Contact__c': req.params.contactid,
      'npe5__Organization__c': req.params.accountid
    },
    {
      Id: 1,
      Name: 1,
      npe5__Contact__c: 1,
      npe5__Organization__c: 1,
      Department__c: 1,
      npe5__Primary__c: 1,
      npe5__Role__c: 1,
      npe5__StartDate__c: 1,
      npe5__Status__c: 1,
      CreatedDate: 1
    }
  )
  .limit(1)
  .execute(function(err, records) {
    if (err) {
      console.error(err);
      return next(err);
    }
    console.log("fetched : " + records.length);
    if (records.length === 0) {
      res.sendStatus(404);
    } else {
      res.send(records[0]);
    }
  });

};
