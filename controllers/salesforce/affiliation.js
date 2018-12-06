const salesforce = require('../salesforce');

var allowedFields = {
  Id: 1,
  // Name: 1,
  npe5__Contact__c: 1,
  npe5__Organization__c: 1,
  Department__c: 1,
  npe5__Primary__c: 1,
  npe5__Role__c: 1,
  npe5__Description__c: 1,
  npe5__StartDate__c: 1,
  npe5__EndDate__c: 1,
  npe5__Status__c: 1,
  Type__c: 1,
  International_coop_committee__c: 1
};

/**
 * @api {get} /salesforce/aff Retrieve affiliations
 * @apiName RetrieveAffiliations
 * @apiGroup Affiliation
 * @apiUse listParams
 * @apiSuccess {Object[]} affiliations List of affiliations.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 */
exports.listContact = (req, res, next) => {

  var conditions = {
    'npe5__Contact__c': req.params.contactid
  };

  if (req.query.current !== undefined) {
    conditions['npe5__Status__c'] = 'Current';
  }

  salesforce.conn.sobject('npe5__Affiliation__c')
  .find(
    conditions,
    allowedFields
  )
  .sort({ npe5__EndDate__c: -1, npe5__StartDate__c: -1, CreatedDate: -1 })
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
 * @api {get} /salesforce/aff Retrieve affiliations
 * @apiName RetrieveAffiliations
 * @apiGroup Affiliation
 * @apiUse listParams
 * @apiSuccess {Object[]} affiliations List of affiliations.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 */
exports.listAccount = (req, res, next) => {

  var conditions = {
    'npe5__Organization__c': req.params.accountid
  };

  if (req.query.current !== undefined) {
    conditions['npe5__Status__c'] = 'Current';
  }

  salesforce.conn.sobject('npe5__Affiliation__c')
  .find(
    conditions,
    allowedFields
  )
  .sort({ npe5__EndDate__c: -1, npe5__StartDate__c: -1, CreatedDate: -1 })
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
 * @api {get} /aff/:email Retrieve affiliation
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
 * @api {get} /aff/primary/:contactid Retrieve affiliation
 * @apiName RetrievePrimaryAffiliation
 * @apiGroup Affiliation
 * @apiSuccess {Object} affiliation Affiliation's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Affiliation not found.
 */
exports.retrievePrimary = (req, res, next) => {

  salesforce.conn.sobject('npe5__Affiliation__c')
  .find(
    {
      'npe5__Contact__c': req.params.contactid,
      'npe5__Primary__c': true
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
 * @api {post} /aff Create affiliation
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
      for (var property in req.body) {
        if (!allowedFields.hasOwnProperty(property)) {
          affiliation[property] = req.body[property];
        }
      }
      affiliation.Id = ret.id;
      affiliation.success = ret.success;
      res.send(affiliation);
    }
  );

};

/**
 * @api {post} /aff Update affiliation
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

  // you can't re-parent Master Detail relationships
  // if they change their org just create a new one
  // and update the old one to be old
  var affiliationContact = affiliation.npe5__Contact__c;
  delete affiliation.npe5__Contact__c;
  var affiliationOrganisation = affiliation.npe5__Organization__c;
  delete affiliation.npe5__Organization__c;

  // this is where you'll need to add in the relevant req.body if they exist
  salesforce.conn.sobject('npe5__Affiliation__c')
  .update(
    affiliation,
    function (err, ret) {
      if (err || !ret.success) {
        console.error(err);
        return next(err);
      }
      for (var property in req.body) {
        if (!allowedFields.hasOwnProperty(property)) {
          affiliation[property] = req.body[property];
        }
      }
      affiliation.success = ret.success;

      // reinstate the contact and organisation
      if (affiliationOrganisation !== null) {
        affiliation.npe5__Organization__c = affiliationOrganisation;
      }
      if (affiliationContact !== null) {
        affiliation.npe5__Contact__c = affiliationContact;
      }

      res.send(affiliation);
    }
  );

};
