var App = require('./config');

var mongoUrl = process.env.MONGOHQ_URL || 'mongodb';
var mongojs = require('mongojs');
console.log("<<<<< Attempting to connect database to " + mongoUrl);
var database = mongojs(mongoUrl, ['projects']);

App.Config.database = database;

exports.database = database;
