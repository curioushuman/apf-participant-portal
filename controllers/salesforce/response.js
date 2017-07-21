const salesforce = require('../salesforce');

var allowedFields = {
  Id: 1,
  Name: 1,
  Score__c: 1,
  Self_assessment_topic_alias__c: 1,
  Comments__c: 1
};

/**
 * @api {get} /salesforce/response Retrieve responses
 * @apiName RetrieveResponses
 * @apiGroup Response
 * @apiUse listParams
 * @apiSuccess {Object[]} responses List of responses.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 */
exports.list = (req, res, next) => {

  salesforce.conn.sobject('Self_assessment_response__c')
  .find(
    {
      'Participant__c' : req.params.participantid
    },
    allowedFields
  )
  .sort({ CreatedDate: -1, Name : 1 })
  .limit(50)
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
 * @api {get} /responses/:email Retrieve response
 * @apiName RetrieveResponse
 * @apiGroup Response
 * @apiSuccess {Object} response Response's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Response not found.
 */
exports.retrieve = (req, res, next) => {

  if (!req.params.participantid || !req.params.questionid) {
    var err = new Error('Response not found — Missing ID');
    console.error(err);
    return next(err);
  }

  salesforce.conn.sobject('Self_assessment_response__c')
  .find(
    {
      'Participant__c' : req.params.participantid,
      'Self_assessment_question__c' : req.params.questionid
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
 * @api {post} /responses Create response
 * @apiName CreateResponse
 * @apiGroup Response
 * @apiSuccess {Object} response Response's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Response not found.
 */
exports.create = (req, res, next) => {

  var response = {};
  for (var property in req.body) {
    if (allowedFields.hasOwnProperty(property)) {
      response[property] = req.body[property];
    }
  }

  salesforce.conn.sobject('Response')
  .create(
    response,
    function (err, ret) {
      if (err || !ret.success) {
        console.error(err);
        return next(err);
      }
      response.Id = ret.id;
      response.success = ret.success;
      res.send(response);
    }
  );

};

/**
 * @api {post} /responses Update response
 * @apiName UpdateResponse
 * @apiGroup Response
 * @apiSuccess {Object} response Response's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Response not found.
 */
exports.update = (req, res, next) => {

  var response = {
    Id: req.params.responseid
  };
  for (var property in req.body) {
    if (allowedFields.hasOwnProperty(property)) {
      response[property] = req.body[property];
    }
  }

  // this is where you'll need to add in the relevant req.body if they exist
  salesforce.conn.sobject('Response')
  .update(
    response,
    function (err, ret) {
      if (err || !ret.success) {
        console.error(err);
        return next(err);
      }
      response.success = ret.success;
      res.send(response);
    }
  );

};
