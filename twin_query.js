'use strict';

var Registry = require('azure-iothub').Registry;
var constants=require('./constants');
const express = require('express');
const router = express.Router();
//var connectionString = process.env.IOTHUB_CONNECTION_STRING;
var connectionString = constants.IOT_Hub_ConnectionString;
var registry = Registry.fromConnectionString(connectionString);


var query = registry.createQuery('SELECT * FROM devices', 100);

//router.get('/', function(req, res) {  
function twin_query(){
var onResults = function(err, results) {
  if (err) {
    
    console.error('Failed to fetch the results: ' + err.message);
    //res.setHeader('Content-Type', 'application/json');
    //res.status(404).json({ Error:'Failed to fetch the results'});
    } else {
    // Do something with the results
    results.forEach(function(twin) {
    console.log(twin.deviceId);
    //es.setHeader('Content-Type', 'application/json');
    //res.status(200) 
    });
    //res.status(200).json({ deviceIds:results});

    if (query.hasMoreResults) {
        query.nextAsTwin(onResults);
     
    }
  }
};
query.nextAsTwin(onResults);
}

//});

module.exports={
  method:twin_query
};