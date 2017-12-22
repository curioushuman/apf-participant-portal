const salesforce = require('../salesforce');

var allowedFields = {
  Id: 1,
  Name: 1,
  Participant__c: 1,
  Registration_preference__c: 1,
  Session__c: 1,
  Status__c: 1
};

/**
 * @api {get} /salesforce/session_participation Retrieve session_participations
 * @apiName RetrieveSessionParticipations
 * @apiGroup SessionParticipation
 * @apiUse listParams
 * @apiSuccess {Object[]} session_participations List of session_participations.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 */
exports.list = (req, res, next) => {

  salesforce.conn.sobject('Session_participation__c')
  .find(
    {
      'Participant__c' : req.params.participantid
    },
    allowedFields
  )
  .sort({ CreatedDate: -1, Name : 1 })
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
 * @api {get} /session_participations/:email Retrieve session_participation
 * @apiName RetrieveSessionParticipation
 * @apiGroup SessionParticipation
 * @apiSuccess {Object} session_participation SessionParticipation's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 SessionParticipation not found.
 */
exports.retrieve = (req, res, next) => {

  if (!req.params.participantid || !req.params.questionid) {
    var err = new Error('SessionParticipation not found — Missing ID');
    console.error(err);
    return next(err);
  }

  salesforce.conn.sobject('Session_participation__c')
  .find(
    {
      'Participant__c' : req.params.participantid,
      'Session__c' : req.params.sessionid
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
 * @api {post} /session_participations Create session_participation
 * @apiName CreateSessionParticipation
 * @apiGroup SessionParticipation
 * @apiSuccess {Object} session_participation SessionParticipation's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 SessionParticipation not found.
 */
exports.create = (req, res, next) => {

  var session_participation = {};
  for (var property in req.body) {
    if (allowedFields.hasOwnProperty(property)) {
      session_participation[property] = req.body[property];
    }
  }

  salesforce.conn.sobject('Session_participation__c')
  .create(
    session_participation,
    function (err, ret) {
      if (err || !ret.success) {
        console.error(err);
        return next(err);
      }
      for (var property in req.body) {
        if (!allowedFields.hasOwnProperty(property)) {
          session_participation[property] = req.body[property];
        }
      }
      session_participation.Id = ret.id;
      session_participation.success = ret.success;
      res.send(session_participation);
    }
  );

};

/**
 * @api {post} /session_participations Update session_participation
 * @apiName UpdateSessionParticipation
 * @apiGroup SessionParticipation
 * @apiSuccess {Object} session_participation SessionParticipation's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 SessionParticipation not found.
 */
exports.update = (req, res, next) => {

  var session_participation = {
    Id: req.params.session_participationid
  };
  for (var property in req.body) {
    if (allowedFields.hasOwnProperty(property)) {
      session_participation[property] = req.body[property];
    }
  }

  // you can't re-parent Master Detail relationships
  var sessionParticipationParticipant = session_participation.Participant__c;
  delete session_participation.Participant__c;
  var sessionParticipationSession = session_participation.Session__c;
  delete session_participation.Session__c;
  var sessionParticipationName = session_participation.Name;
  delete session_participation.Name;

  // this is where you'll need to add in the relevant req.body if they exist
  salesforce.conn.sobject('Session_participation__c')
  .update(
    session_participation,
    function (err, ret) {
      if (err || !ret.success) {
        console.error(err);
        return next(err);
      }
      for (var property in req.body) {
        if (!allowedFields.hasOwnProperty(property)) {
          session_participation[property] = req.body[property];
        }
      }
      session_participation.success = ret.success;

      if (sessionParticipationParticipant !== null) {
        session_participation.Participant__c = sessionParticipationParticipant;
      }
      if (sessionParticipationSession !== null) {
        session_participation.Session__c = sessionParticipationSession;
      }
      if (sessionParticipationName !== null) {
        session_participation.Name = sessionParticipationName;
      }

      res.send(session_participation);
    }
  );

};
