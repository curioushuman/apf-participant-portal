const salesforce = require('../salesforce');

/**
 * @api {get} /salesforce/action Retrieve actions
 * @apiName RetrieveActions
 * @apiGroup Action
 * @apiUse listParams
 * @apiSuccess {Object[]} actions List of actions.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 */
exports.list = (req, res, next) => {

  salesforce.conn.sobject('Action__c')
  .find(
    // conditions in JSON object
    // { 'RecordTypeId' : '0126F000000iyY7QAI' },  // Training only
    {  }, // ALL
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

/**
 * @api {get} /actions/:slug Retrieve action
 * @apiName RetrieveAction
 * @apiGroup Action
 * @apiSuccess {Object} action Action's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Action not found.
 */
exports.retrieve = (req, res, next) => {

  salesforce.conn.sobject('Action__c')
  .find(
    // conditions in JSON object
    { 'Slug__c' : req.params.slug },
    // fields in JSON object
    { Id: 1,
      Name: 1,
      CreatedDate: 1 }
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
