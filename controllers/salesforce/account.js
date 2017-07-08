const salesforce = require('../salesforce');

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
      'Type' : 'National Human Rights Institution'
    },
    {
      Id: 1,
      Name: 1,
      CreatedDate: 1
    }
  )
  .sort({ Name : 1 })
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
