var App = require('./config');
var mongojs = require('mongojs');
var mongoUrl = process.env.MONGOHQ_URL || 'mongojs';
var database = mongojs(mongoUrl, ['projects']);

App.Config.database = database;

exports.database = database;
