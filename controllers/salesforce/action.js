const salesforce = require('../salesforce');

var allowedFields = {
  Id: 1,
  Name: 1,
  Selection_criteria__c: 1,
  Ideal_candidate__c: 1,
  Registrations_due_date__c: 1,
  Digital_component__c: 1,
  Digital_start_date__c: 1,
  Digital_finish_date__c: 1,
  Face_to_face_component__c: 1,
  Face_to_face_start_date__c: 1,
  Face_to_face_finish_date__c: 1,
  Start_date__c: 1,
  Finish_date__c: 1,
  Show_Experience_section__c: 1,
  Show_English_Skills_section__c: 1,
  Show_Expectations_section__c: 1,
  Show_IT_Skills_section__c: 1,
  Show_Outcomes_section__c: 1,
  Show_Sessions_section__c: 1,
  Show_Related_Events_section__c: 1,
  Registration_via_related_action__c: 1,
  Related_registration_is_automatic__c: 1,
  // Training_partner__c: 1,
  Description__c: 1,
  Help_text__c: 1,
  Supporting_text__c: 1,
  RecordTypeId: 1,
  OwnerId: 1
};

/**
 * DISABLED FOR NOW
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
    // {
    //   'RecordTypeId' : '0126F000000iyY7QAI'
    // },  // Training only
    {}, // ALL
    allowedFields
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
 * @api {get} /salesforce/action/related_action Retrieve actions by related
 * @apiName RetrieveActions
 * @apiGroup Action
 * @apiUse listParams
 * @apiSuccess {Object[]} actions List of actions.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 */
exports.listByRelatedAction = (req, res, next) => {

  var conditions = {
    'Registration_via_related_action__c' : req.params.actionid
  };

  salesforce.conn.sobject('Action__c')
  .find(
    conditions,
    allowedFields
  )
  .sort({ Name : 1 })
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
 * @api {get} /salesforce/action/:slug Retrieve action
 * @apiName RetrieveAction
 * @apiGroup Action
 * @apiSuccess {Object} action Action's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Action not found.
 */
exports.retrieve = (req, res, next) => {

  salesforce.conn.sobject('Action__c')
  .find(
    {
      'Slug__c' : req.params.slug
    },
    allowedFields
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
