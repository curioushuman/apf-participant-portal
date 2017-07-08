const salesforce = require('../salesforce');

/**
 * @api {get} /contacts/:email Retrieve contact
 * @apiName RetrieveContact
 * @apiGroup Contact
 * @apiSuccess {Object} contact Contact's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Contact not found.
 */
exports.retrieve = (req, res, next) => {

  salesforce.conn.sobject('Contact')
  .find(
    "Email = '" + req.params.email + "'"
    + " OR npe01__HomeEmail__c = '" + req.params.email + "'"
    + " OR npe01__WorkEmail__c = '" + req.params.email + "'",
    {
      Id: 1,
      LastName: 1,
      FirstName: 1,
      Salutation: 1,
      Gender__c: 1,
      Dietary_requirements__c: 1,
      Accessibility_requirements__c: 1,
      Title: 1,
      Department: 1,
      Email: 1,
      npe01__HomeEmail__c: 1,
      npe01__WorkEmail__c: 1,
      npe01__Preferred_Email__c: 1,
      HomePhone: 1,
      npe01__WorkPhone__c: 1,
      MobilePhone: 1,
      npe01__PreferredPhone__c: 1,
      Fax: 1,
      Ability_in_IT_average__c: 1,
      IT_Skills_Ability_to_download_files__c: 1,
      IT_Skill_Ability_to_use_spreadsheets__c: 1,
      IT_Skill_Ability_to_use_Word_documents__c: 1,
      IT_Skills_Ability_to_view_online_videos__c: 1,
      Ability_in_English_average__c: 1,
      EN_Skills_Ability_to_read_in_English__c: 1,
      EN_Skills_Ability_to_speak_English__c: 1,
      EN_Skills_Ability_to_understand_spoken__c: 1,
      EN_Skills_Ability_to_write_in_English__c: 1,
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
