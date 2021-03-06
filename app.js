var App = require('./app/config');
var express = require('express');
var _ = require('underscore');
var partials = require('express-partials');
var app = express();
var sass = require('node-sass');
var port = process.env.PORT || 3000;

//initialize the database
var db = require('./app/db').database;

// configuration
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.engine('jade', require('jade').__express);
app.use(express.static(__dirname + '/public'));
app.use(express.favicon());
app.use(partials());
app.use(sass.middleware({
  src: __dirname,
  dest: __dirname + '/public',
  debug: true
}));

app.get('/', function(request, response) {
  response.redirect('/example');
});

app.get('/__reset', function(request, response) {
  db.projects.remove();
  var exampleProject = require('./app/fixtures').exampleProject;
  db.projects.save({name: 'example', html: exampleProject.html, css: exampleProject.css, javascript: exampleProject.javascript}, function() {
    response.redirect('example');
  });
});

app.get('/:project', function(request, response) {
  var projectName = request.params['project'];
  require('./app/edit').connect(projectName);
  var db = App.Config.database;
  db.projects.find({name: projectName}, function(error, projects) {
    if (_.isEmpty(projects)) {
      db.projects.save({name: projectName, html: projectName, css: '', javascript: ''});
    }
    App.Config.project = projectName;
  });
  response.render('index');
});

var io = require('socket.io').listen(app.listen(port));
App.Config.io = io;

require('./app/chat');

console.log('Sand Castle server started on port ' + port + '.');
