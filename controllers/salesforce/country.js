const salesforce = require('../salesforce');

var allowedFields = {
  Id: 1,
  Name: 1
};

/**
 * @api {get} /salesforce/country Retrieve countries
 * @apiName RetrieveCountries
 * @apiGroup Country
 * @apiUse listParams
 * @apiSuccess {Object[]} countries List of countries.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 */
exports.list = (req, res, next) => {

  salesforce.conn.sobject('Country__c')
  .find(
    {},
    allowedFields
  )
  .sort({ Name : 1 })
  .skip(0)
  .execute(function(err, records) {
    if (err) {
      console.error(err);
      return next(err);
    }
    console.log("fetched countries : " + records.length);
    res.send(records);
  });

};

/**
 * @api {get} /salesforce/country/:slug Retrieve country
 * @apiName RetrieveCountry
 * @apiGroup Country
 * @apiSuccess {Object} country Country's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Country not found.
 */
exports.retrieve = (req, res, next) => {

  salesforce.conn.sobject('Country__c')
  .find(
    {
      'Id' : req.params.countryid
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
