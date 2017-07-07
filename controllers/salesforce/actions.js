const salesforce = require('../salesforce');

/**
 * @api {get} /salesforce/actions Retrieve actions
 * @apiName RetrieveActions
 * @apiGroup Action
 * @apiUse listParams
 * @apiSuccess {Object[]} actions List of actions.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 */
exports.index = (req, res, next) => {

  salesforce.conn.sobject('Action__c')
  .find(
    // conditions in JSON object
    { 'Action__c.RecordTypeId' : 'Training' },
    // fields in JSON object
    { Id: 1,
      Name: 1,
      CreatedDate: 1 }
  )
  .sort({ CreatedDate: -1, Name : 1 })
  .limit(5)
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
