const salesforce = require('../salesforce');

var allowedFields = {
  Id: 1,
  Prior_experience_with_action_topic__c: 1,
  Knowledge_they_would_like_to_gain__c: 1,
  Skills_they_would_like_to_gain__c: 1,
  Additional_information__c: 1
};

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

/**
 * @api {post} /participants Create participant
 * @apiName CreateParticipant
 * @apiGroup Participant
 * @apiSuccess {Object} participant Participant's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Participant not found.
 */
exports.create = (req, res, next) => {

  var participant = {};
  for (var property in req.body) {
    if (allowedFields.hasOwnProperty(property)) {
      participant[property] = req.body[property];
    }
  }

  salesforce.conn.sobject('Participant')
  .create(
    participant,
    function (err, ret) {
      if (err || !ret.success) {
        console.error(err);
        return next(err);
      }
      participant.Id = ret.id;
      participant.success = ret.success;
      res.send(participant);
    }
  );

};

/**
 * @api {post} /participants Update participant
 * @apiName UpdateParticipant
 * @apiGroup Participant
 * @apiSuccess {Object} participant Participant's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Participant not found.
 */
exports.update = (req, res, next) => {

  var participant = {
    Id: req.params.participantid
  };
  for (var property in req.body) {
    if (allowedFields.hasOwnProperty(property)) {
      participant[property] = req.body[property];
    }
  }

  // this is where you'll need to add in the relevant req.body if they exist
  salesforce.conn.sobject('Participant')
  .update(
    participant,
    function (err, ret) {
      if (err || !ret.success) {
        console.error(err);
        return next(err);
      }
      participant.success = ret.success;
      res.send(participant);
    }
  );

};
