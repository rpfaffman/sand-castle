var App = require('./config');
var io = App.Config.io;
var db = App.Config.database;

var edit = io
  .of('/edit')
  .on('connection', function(socket) {
    console.log('setting socket param project to ' + App.Config.project);
    socket.set('project', App.Config.project);
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

var loadProject = function(socket) {
  socket.get('project', function(err, projectName) {
    console.log('attempting to find project with this name: ' + projectName);
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
