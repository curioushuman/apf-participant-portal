const salesforce = require('../salesforce');

var allowedFields = {
  Id: 1,
  Country__c: 1,
  Email_for_organisation__c: 1,
  Name: 1,
  Phone: 1,
  ShippingStreet: 1,
  ShippingCity: 1,
  ShippingState: 1,
  ShippingPostalCode: 1,
  Type: 1,
  Website: 1
};

/**
 * @api {get} /salesforce/account Retrieve accounts
 * @apiName RetrieveAccounts
 * @apiGroup Account
 * @apiUse listParams
 * @apiSuccess {Object[]} accounts List of accounts.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 */
exports.list = (req, res, next) => {

  salesforce.conn.sobject('Account')
  .find(
    {
      'RecordTypeId' : {
        $ne: '0126F000000Acz3QAC'
      }
    },
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
    console.log(records);
    res.send(records);
  });

};

/**
 * @api {get} /salesforce/account/type Retrieve accounts by type
 * @apiName RetrieveAccountsByType
 * @apiGroup Account
 * @apiUse listParams
 * @apiSuccess {Object[]} accounts List of accounts.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 */
exports.listByType = (req, res, next) => {

  // don't pickup households!
  var conditions = {
    'RecordTypeId' : {
      $ne: '0126F000000Acz3QAC'
    }
  };
  // parameter exclude reverses the request i.e. excludes that type
  if (req.query.exclude === undefined) {
    conditions['Type'] = req.params.type;
  } else {
    conditions['Type'] = {
      $ne: req.params.type
    };
  }

  salesforce.conn.sobject('Account')
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
 * @api {get} /salesforce/accounts Retrieve accounts by list of IDs
 * @apiName RetrieveAccountsByIds
 * @apiGroup Account
 * @apiUse listParams
 * @apiSuccess {Object[]} accounts List of accounts.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 */
exports.listByIds = (req, res, next) => {

  // don't pickup households!
  var conditions = {
    'RecordTypeId' : {
      $ne: '0126F000000Acz3QAC'
    }
  };

  salesforce.conn.sobject('Account')
  .retrieve(
    req.params.accountids,
    function(err, records) {
      if (err) {
        console.error(err);
        return next(err);
      }
      console.log("fetched : " + records.length);
      res.send(records);
    }
  );

};

/**
 * @api {get} /salesforce/account/:accountid Retrieve action
 * @apiName RetrieveAccount
 * @apiGroup Account
 * @apiSuccess {Object} action Account's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Account not found.
 */
exports.retrieve = (req, res, next) => {

  salesforce.conn.sobject('Account')
  .retrieve(req.params.accountid, function(err, account) {
    if (err) {
      console.error(err);
      return next(err);
    }
    res.send(account);
  });

};

/**
 * @api {post} /accounts Create account
 * @apiName CreateAccount
 * @apiGroup Account
 * @apiSuccess {Object} account Account's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Account not found.
 */
exports.create = (req, res, next) => {

  var account = {};
  for (var property in req.body) {
    if (allowedFields.hasOwnProperty(property)) {
      account[property] = req.body[property];
    }
  }

  salesforce.conn.sobject('Account')
  .create(
    account,
    function (err, ret) {
      if (err || !ret.success) {
        console.error(err);
        return next(err);
      }
      for (var property in req.body) {
        if (!allowedFields.hasOwnProperty(property)) {
          account[property] = req.body[property];
        }
      }
      account.Id = ret.id;
      account.success = ret.success;
      res.send(account);
    }
  );

};

/**
 * @api {post} /accounts Update account
 * @apiName UpdateAccount
 * @apiGroup Account
 * @apiSuccess {Object} account Account's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Account not found.
 */
exports.update = (req, res, next) => {

  var account = {
    Id: req.params.accountid
  };
  for (var property in req.body) {
    if (allowedFields.hasOwnProperty(property)) {
      account[property] = req.body[property];
    }
  }

  // this is where you'll need to add in the relevant req.body if they exist
  salesforce.conn.sobject('Account')
  .update(
    account,
    function (err, ret) {
      if (err || !ret.success) {
        console.error(err);
        return next(err);
      }
      for (var property in req.body) {
        if (!allowedFields.hasOwnProperty(property)) {
          account[property] = req.body[property];
        }
      }
      account.success = ret.success;
      res.send(account);
    }
  );

};
