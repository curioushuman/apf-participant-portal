const fs = require('fs');
const salesforce = require('../salesforce');

var allowedFields = {
  Id: 1,
  VersionData: 1
};

/**
 * DISABLED FOR NOW
 * @api {get} /salesforce/content_version Retrieve content_versions
 * @apiName RetrieveContentVersions
 * @apiGroup ContentVersion
 * @apiUse listParams
 * @apiSuccess {Object[]} content_versions List of content_versions.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 */
// exports.list = (req, res, next) => {
//
//   salesforce.conn.sobject('ContentVersion__c')
//   .find(
//     // {
//     //   'RecordTypeId' : '0126F000000iyY7QAI'
//     // },  // Training only
//     {}, // ALL
//     allowedFields
//   )
//   .sort({ CreatedDate: -1, Name : 1 })
//   .limit(5)
//   .skip(0)
//   .execute(function(err, records) {
//     if (err) {
//       console.error(err);
//       return next(err);
//     }
//     console.log("fetched : " + records.length);
//     res.send(records);
//   });
//
// };

// I pulled this out of the developer console, it might be useful later
// SELECT Id, ContentDocumentId, ContentDocument.LatestPublishedVersionId,
// ContentDocument.Title, ContentDocument.createdDate, ContentDocument.FileType
// FROM ContentDocumentLink
// WHERE LinkedEntityId = 'a0m6F00000HC6EWQA1'

/**
 * @api {get} /salesforce/content_version/:slug Retrieve content_version
 * @apiName RetrieveContentVersion
 * @apiGroup ContentVersion
 * @apiSuccess {Object} content_version ContentVersion's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 ContentVersion not found.
 */
exports.retrieve = (req, res, next) => {

  console.log('balls');

  salesforce.conn.sobject('ContentVersion')
  .retrieve('0686F00000551TdQAI',
    function(err, contentVersion) {
      if (err) { return console.error(err); }
      var fileOut = fs.createWriteStream('./test.docx');
      res.send('balls');
    }
  );

};
