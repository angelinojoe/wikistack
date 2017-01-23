const morgan = require('morgan');
const express = require( 'express' );
const app = express(); // creates an instance of an express application
const nunjucks = require('nunjucks');
var wikiRouter = require('./routes/wiki');
//const routes = require('./routes');
const bodyParser = require('body-parser');
var models = require('./models');


// point nunjucks to the directory containing templates and turn off caching; configure returns an Environment
// instance, which we'll want to use to add Markdown support later.
var env = nunjucks.configure('views', {noCache: true});
// have res.render work with html files
app.set('view engine', 'html');
// when res.render works with html files, have it use nunjucks to do so
app.engine('html', nunjucks.render);

//MIDDLEWARE
app.use(morgan('dev') );
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
//app.use('/', routes);
app.use('/wiki', wikiRouter);
app.use(express.static('public'));

//WHY THE EMPTY OBJECT??
//since sync is async and returns a promise, when first model is synced,
//start syncing 2nd table, then start the server. Need our tables defined ]\
//befire we take server requests
models.User.sync()
.then(function(){
   return models.Page.sync();
})
.then(function(){
    var server = app.listen(3000, function(){
    console.log('Server listening on port 3000');
    });
})
.catch(console.error);

