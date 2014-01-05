var App = require('./config');

var mongoUrl = process.env.MONGOHQ_URL || 'mongodb';
var mongojs = require('mongojs');
var database = mongojs(mongoUrl, ['projects']);

App.Config.database = database;

exports.database = database;
