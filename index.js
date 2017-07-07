var bodyParser = require('body-parser');
var express = require('express');
var path = require('path');
var morgan = require('morgan');

require('dotenv').config();

let validRedirectURLs = [
  "https://layla.amazon.com/spa/skill/account-linking-status.html?vendorId=M1MXCAGUJCRGZ6",
  "https://pitangui.amazon.com/spa/skill/account-linking-status.html?vendorId=M1MXCAGUJCRGZ6"
  ];

let port = process.env.PORT || 8080;

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//app.set('port', (process.env.PORT || 8080));
//app.oauth = new OAuthServer({
  //model: require('./model'),
  //grants: ['auth_code', 'password'],
  //debug: true
//});
 
app.use(morgan('tiny'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Handle token grant requests
//app.all('/oauth/token', app.oauth.grant());

// this URL is auto authorize with demo token
app.get('/api/oauth/authorizex', function (req, res, next) {
  // If they aren't logged in, send them to your own login implementation
  let uri = req.query.redirect_uri;
  uri += "#state=" + req.query.state;
  uri += "&access_token=" + "demo";
  uri += "&token_type=Bearer";
  console.log(uri);
  res.redirect(uri);
});

app.get('/api/oauth/authorize', function (req, res, next) {
  if (!req.query.redirect_uri) {
    res.status(400).send({"ErrorCode" : "invalid_request", "Error" :"Redirection URI is required"});
  }
  if (validRedirectURLs.indexOf(req.query.redirect_uri) === -1) {
    res.status(400).send({"ErrorCode" : "invalid_request", "Error" :`invalid redirection URI: ${req.query.redirect_uri}`});
    return;
  }
  let login = 'api/login';
  let d = "?";
  let parmkeys = Object.keys(req.query);
  parmkeys.forEach((key) => {
    login += d + key + "=" + req.query[key];
    d = "&";
  });
  console.log(login);
  res.redirect(login);
});

app.get('/api/login', function(req, res, next) {
  console.log(`get: ${req.path}`);
  res.render('login');
});

app.post('api/login', function(req, res, next) {
  console.log(`post: ${req.path}`);
  res.sendStatus(500);
});

app.use(function(req, res) {
  res.send('Secret area');
});

app.listen(port, function() {
    console.log("server started on " + port);
});
