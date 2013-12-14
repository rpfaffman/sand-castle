var express = require('express');
var app = express();
var sass = require('node-sass');
var port = 3000;

// configuration
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.engine('jade', require('jade').__express);
app.use(express.static(__dirname + '/public'))
app.use(sass.middleware({
  src: __dirname,
  dest: __dirname + '/public',
  debug: true
}));

app.get('/', function(request, response) {
  response.render('index');
});

var io = require('socket.io').listen(app.listen(port));

io.sockets.on('connection', function(socket) {
  console.log('connection established');
});

console.log('Sand Castle server started on port ' + port + '.');
