var express = require('express');
var _ = require('underscore');
var partials = require('express-partials');
var app = express();
var sass = require('node-sass');
var port = process.env.PORT || 3000;
var mongoUrl = process.env.MONGOHQ_URL || 'mongodb';

// persistence
var mongojs = require('mongojs');
var db = mongojs(mongoUrl, ['projects']);
console.log('connected to mongo db with database name: ' + mongoUrl);

// configuration
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.engine('jade', require('jade').__express);
app.use(express.static(__dirname + '/public'));
app.use(partials());
app.use(sass.middleware({
  src: __dirname,
  dest: __dirname + '/public',
  debug: true
}));

app.get('/', function(request, response) { response.render('index'); });

app.get('/destroy', function(request, response) { db.projects.remove(); });

var currentProject = 'default';
app.get('/:project', function(request, response) {
  var projectName = request.params['project'];
  db.projects.find({name: projectName}, function(error, projects) {
    if (_.isEmpty(projects)) {
      console.log('no project found.  creating new one');
      db.projects.save({name: projectName, html: projectName, css: '', javascript: ''});
    } else {
      console.log(projects);
    }
    currentProject = projectName;
  });

  console.log('=============================')
  db.projects.find(function(err, projects) {
    console.log(projects);
  });
  response.render('index');
});

var io = require('socket.io').listen(app.listen(port));

var loadProject = function(socket) {
  socket.get('project', function(err, projectName) {
    db.projects.find({name: projectName}, function(err, projects) {
      if (projects.length != 0) {
        var project = projects[0];
        socket.emit('code submit', { type: 'html', code: project.html });
        socket.emit('code submit', { type: 'css', code: project.css });
        socket.emit('code submit', { type: 'javascript', code: project.javascript });
      }
    });
  });
};

var edit = io
  .of('/edit')
  .on('connection', function(socket) {
    socket.set('project', currentProject);
    loadProject(socket);
    socket.on('code submit', function(data) {
      (data.type === 'javascript') ? socket.broadcast.emit('code submit', data) : edit.emit('code submit', data);

      var projectData = {};
      projectData[data.type] = data.code;
      socket.get('project', function(err, projectName) {
        db.projects.findAndModify({
          query: { name: projectName },
          update: { $set: projectData }
        });
      });
    });

    socket.on('code edit', function(data) { socket.broadcast.emit('code edit', data); });
  });

var chat = io
  .of('/chat')
  .on('connection', function(socket) {
    socket.set('alias', 'guest' + io.sockets.clients().length);
    socket.emit('message', { sender: 'Server', message: 'Welcome to Sand Castle!  Press [ENTER] to chat with other visitors.' });

    // sending messages
    socket.on('message', function(data) {
      socket.get('alias', function(err, alias) {
        data.sender = alias;
        if(data.message.length > 0) { chat.emit('message', data); };
      });
    });

    // changing usernames/aliases
    socket.on('alias', function(data) {
      socket.set('alias', data.args.join(' '));
      socket.emit('message', { sender: 'Server', message: 'Alias successfully changed.' });
    });
  });

console.log('Sand Castle server started on port ' + port + '.');
