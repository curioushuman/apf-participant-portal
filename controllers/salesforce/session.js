const salesforce = require('../salesforce');

var allowedFields = {
  Id: 1,
  Name: 1,
  Action__c: 1,
  Day__c: 1,
  Period__c: 1,
  Order_of_appearance__c: 1,
  Description__c: 1
};

/**
 * @api {get} /salesforce/session Retrieve sessions
 * @apiName RetrieveSessions
 * @apiGroup Session
 * @apiUse listParams
 * @apiSuccess {Object[]} sessions List of sessions.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 */
exports.list = (req, res, next) => {

  salesforce.conn.sobject('Session__c')
  .find(
    {
      'Action__c' : req.params.actionid,
      'Requires_registration__c' : true
    },
    allowedFields
  )
  .sort(
    {
      Day__c: 1,
      Period__c: 1,
      Order_of_appearance__c: 1,
      CreatedDate : 1
    }
  )
  .skip(0)
  .execute(function(err, records) {
    if (err) {
      console.error(err);
      return next(err);
    }
    console.log("fetched : " + records.length);
    res.send(records);
  });

};
