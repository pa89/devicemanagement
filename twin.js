// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

"use strict";

var Registry = require('azure-iothub').Registry;
var constants=require('./constants');
const express = require('express');
const router = express.Router();
//const deviceclient = require('./register_device');
const params= require('./server');
var connectionString = constants.IOT_Hub_ConnectionString;
//var deviceId = constants.Device_ID;
//var parameters=[];

//var deviceId= params.deviceId;

var registry = Registry.fromConnectionString(connectionString);

//router.get('/', function(req, res) {
function twin(deviceId){
  //parameters=params.methodGetParameters();
  //deviceId=parameters[1];
registry.getTwin(deviceId, function(err, twin) {
if (err) {
  console.error(err.message);
  } else {
  console.log(JSON.stringify(twin, null, 2));
  var twinPatch = {
    tags: {
      city: "Redmond"
    },
    properties: {
      desired: {
        status: 'stopped'
        }
      }
  };
  
    // method 1: using the update method directly on the twin
  twin.update(twinPatch, function(err, twin) {
      if (err) {
        console.error(err.message);
        //res.setHeader('Content-Type', 'application/json');
        //res.status(404).json({ Message:'error'});
      } else {
        console.log(JSON.stringify(twin, null, 2));
        // method 2: using the updateTwin method on the Registry object
      registry.updateTwin(twin.deviceId, { properties: { desired: { status: 'Running' }}}, twin.etag, function(err, twin) {
          if (err) {
            console.error(err.message);
          //res.setHeader('Content-Type', 'application/json');
          //res.status(404).json({ Message:'error'});
            } else {
        console.log(JSON.stringify(twin, null, 2));
            //res.setHeader('Content-Type', 'application/json');
            //res.status(200).json({ twinData:twin});
        }
        });
      }
    });
  }
});
}
// });  
module.exports={
method:twin
};