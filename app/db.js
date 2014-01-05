var App = require('./config');

var mongoUrl = process.env.MONGOHQ_URL || 'mongodb';
var mongojs = require('mongojs');
var db = mongojs(mongoUrl, ['projects']);

App.Config.database = db;
