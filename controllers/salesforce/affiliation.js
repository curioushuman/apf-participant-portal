const salesforce = require('../salesforce');

var allowedFields = {
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
};

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
 * @api {post} /affiliations Create affiliation
 * @apiName CreateAffiliation
 * @apiGroup Affiliation
 * @apiSuccess {Object} affiliation Affiliation's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Affiliation not found.
 */
exports.create = (req, res, next) => {

  var affiliation = {};
  for (var property in req.body) {
    if (allowedFields.hasOwnProperty(property)) {
      affiliation[property] = req.body[property];
    }
  }

  salesforce.conn.sobject('npe5__Affiliation__c')
  .create(
    affiliation,
    function (err, ret) {
      if (err || !ret.success) {
        console.error(err);
        return next(err);
      }
      affiliation.Id = ret.id;
      affiliation.success = ret.success;
      res.send(affiliation);
    }
  );

};

/**
 * @api {post} /affiliations Update affiliation
 * @apiName UpdateAffiliation
 * @apiGroup Affiliation
 * @apiSuccess {Object} affiliation Affiliation's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Affiliation not found.
 */
exports.update = (req, res, next) => {

  var affiliation = {
    Id: req.params.affiliationid
  };
  for (var property in req.body) {
    if (allowedFields.hasOwnProperty(property)) {
      affiliation[property] = req.body[property];
    }
  }

  // this is where you'll need to add in the relevant req.body if they exist
  salesforce.conn.sobject('npe5__Affiliation__c')
  .update(
    affiliation,
    function (err, ret) {
      if (err || !ret.success) {
        console.error(err);
        return next(err);
      }
      affiliation.success = ret.success;
      res.send(affiliation);
    }
  );

};
