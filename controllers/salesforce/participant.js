const salesforce = require('../salesforce');

/**
 * @api {get} /participants/:email Retrieve participant
 * @apiName RetrieveParticipant
 * @apiGroup Participant
 * @apiSuccess {Object} participant Participant's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Participant not found.
 */
exports.retrieve = (req, res, next) => {

  if (!req.params.contactid || !req.params.actionid) {
    var err = new Error('Participant not found — Missing ID');
    console.error(err);
    return next(err);
  }

  salesforce.conn.sobject('Participant__c')
  .find(
    {
      'Contact__c': req.params.contactid,
      'Action__c': req.params.actionid
    },
    {
      Id: 1,
      Prior_experience_with_action_topic__c: 1,
      Knowledge_they_would_like_to_gain__c: 1,
      Skills_they_would_like_to_gain__c: 1,
      Additional_information__c: 1,
      // Airport_nearest__c: 1,
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
