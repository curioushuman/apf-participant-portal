/**
 * Module dependencies.
 */
const express = require('express');
const compression = require('compression');
const session = require('express-session');
const bodyParser = require('body-parser');
const logger = require('morgan');
const chalk = require('chalk');
const errorHandler = require('errorhandler');
const lusca = require('lusca');
const dotenv = require('dotenv');
const path = require('path');
const expressValidator = require('express-validator');
const expressStatusMonitor = require('express-status-monitor');
const multer = require('multer');
const jsforceAjaxProxy = require('jsforce-ajax-proxy');
const cors = require('cors');

const upload = multer({ dest: path.join(__dirname, 'uploads') });

/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 * Modified, seems to work.
 */
dotenv.config();

/**
 * Controllers (route handlers).
 */
const accountController = require('./controllers/salesforce/account')
const actionController = require('./controllers/salesforce/action');
const affiliationController = require('./controllers/salesforce/affiliation');
const contactController = require('./controllers/salesforce/contact');
// const contentVersionController = require('./controllers/salesforce/content_version');
const countryController = require('./controllers/salesforce/country')
const participantController = require('./controllers/salesforce/participant');
const questionController = require('./controllers/salesforce/question');
const responseController = require('./controllers/salesforce/response');
const sessionController = require('./controllers/salesforce/session');
const sessionParticipationController = require('./controllers/salesforce/session_participation');
const userController = require('./controllers/salesforce/user');

/**
 * Create Express server.
 */
const app = express();

/**
 * Express configuration.
 */
app.set('port', process.env.PORT || 3000);
app.use(expressStatusMonitor());
app.use(compression());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));

// JSforce proxy
app.all('/proxy/?*', jsforceAjaxProxy());

// CORS
if (process.env.ENV === 'development') {
  app.use(cors());
  var corsOptions = {};
} else {
  var corsWhitelist = [
    process.env.LOCAL_URI,
    process.env.DEVELOPMENT_URI,
    process.env.STAGING_URI,
    process.env.PRODUCTION_URI
  ];
  var corsOptions = {
    origin: function (origin, callback) {
      if (corsWhitelist.indexOf(origin) !== -1) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    }
  };
}

app.options('*', cors());

/**
 * Primary app routes.
 */
// DISABLED
// app.get('/salesforce/action', cors(corsOptions), actionController.list);
// app.get('/salesforce/account', cors(corsOptions), accountController.list);
// app.put('/salesforce/response/:responseid', cors(corsOptions), responseController.update);
// ENABLED
app.get('/salesforce/account/type/:type', cors(corsOptions), accountController.listByType);
app.post('/salesforce/account/multiple/:accountids', cors(corsOptions), accountController.listByIds);
app.get('/salesforce/account/:accountid', cors(corsOptions), accountController.retrieve);
app.post('/salesforce/account', cors(corsOptions), accountController.create);
app.put('/salesforce/account/:accountid', cors(corsOptions), accountController.update);

app.get('/salesforce/action/:slug', cors(corsOptions), actionController.retrieve);
app.get('/salesforce/action/related_action/:actionid', cors(corsOptions), actionController.listByRelatedAction);

app.get('/salesforce/aff/contact/:contactid', cors(corsOptions), affiliationController.listContact);
app.get('/salesforce/aff/account/:accountid', cors(corsOptions), affiliationController.listAccount);
app.get('/salesforce/aff/primary/:contactid', cors(corsOptions), affiliationController.retrievePrimary);
app.get('/salesforce/aff/:contactid/:accountid', cors(corsOptions), affiliationController.retrieve);
app.post('/salesforce/aff', cors(corsOptions), affiliationController.create);
app.put('/salesforce/aff/:affiliationid', cors(corsOptions), affiliationController.update);

app.get('/salesforce/contact/:contactid', cors(corsOptions), contactController.retrieve);
app.get('/salesforce/contact/email/:email', cors(corsOptions), contactController.retrieveByEmail);
// app.get('/salesforce/content_version', cors(corsOptions), contentVersionController.retrieve);
app.post('/salesforce/contact', cors(corsOptions), contactController.create);
app.put('/salesforce/contact/:contactid', cors(corsOptions), contactController.update);

app.get('/salesforce/country', cors(corsOptions), countryController.list);
app.get('/salesforce/country/:countryid', cors(corsOptions), countryController.retrieve);

app.get('/salesforce/participant/:contactid/:actionid', cors(corsOptions), participantController.retrieve);
app.get('/salesforce/participant/related_action/:contactid/:actionid', cors(corsOptions), participantController.listByRelatedAction);
app.post('/salesforce/participant', cors(corsOptions), participantController.create);
app.put('/salesforce/participant/:participantid', cors(corsOptions), participantController.update);

app.get('/salesforce/question/:actionid', cors(corsOptions), questionController.list);

app.get('/salesforce/response/:participantid', cors(corsOptions), responseController.list);
app.get('/salesforce/response/:participantid/:questionid', cors(corsOptions), responseController.retrieve);
app.post('/salesforce/response', cors(corsOptions), responseController.create);
app.put('/salesforce/response/:responseid', cors(corsOptions), responseController.update);

app.get('/salesforce/session/:actionid', cors(corsOptions), sessionController.list);

app.get('/salesforce/session_participation/:participantid', cors(corsOptions), sessionParticipationController.list);
app.get('/salesforce/session_participation/:participantid/:sessionid', cors(corsOptions), sessionParticipationController.retrieve);
app.post('/salesforce/session_participation', cors(corsOptions), sessionParticipationController.create);
app.put('/salesforce/session_participation/:session_participantid', cors(corsOptions), sessionParticipationController.update);

app.get('/salesforce/user/:uid', cors(corsOptions), userController.retrieve);

/**
 * Error Handler.
 */
app.use(errorHandler());

/**
 * Start Express server.
 */
app.listen(app.get('port'), () => {
  console.log('%s App is running at http://localhost:%d in %s mode', chalk.green('✓'), app.get('port'), app.get('env')); 
  console.log('  Press CTRL-C to stop\n');
});

module.exports = app;
