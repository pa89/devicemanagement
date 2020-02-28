
'use strict';
var fs = require('fs');
var mqtt = require('azure-iot-device-mqtt').Mqtt;
var clientFromConnectionString = require('azure-iot-device-mqtt').clientFromConnectionString;
var constants = require('./constants');
const express = require('express');
const router = express.Router();
//var wifistate=true;
var temp = require('./temp');
var telemetry=null;
const deviceclient = require('./register_device');
var constants = require('./constants');
var connectionString = constants.Device_ConnectionString;
const params= require('./server');
var parameters=[];
var deviceid;
var dateTime = require('node-datetime');
var dt = dateTime.create();
//var client = clientFromConnectionString(deviceclient.methoddeviceclient);
//var client = clientFromConnectionString(connectionString);

function upload(client,devid,callback){
//parameters=params.methodGetParameters();
//check wifistate
if(client==null){
//console.log('Client Null in FileUpload')
}
else{
// if(!wifistate){
//   console.log("device is offine");
//   }
//else{     
dt.format('m/d/Y H:M:S');
var filetime=new Date(dt.now());
var Filename=constants.Filepath+devid+constants.Fileextension;
  //console.log(Filename);
  fs.stat(Filename, function (err, stats) {
  const rr = fs.createReadStream(Filename);
  //upload file to blob
  client.uploadToBlob(Filename, rr,stats.size, function (err) {
      if (err) {
          console.error('Error uploading file: ' + err.toString());
          callback(err);
      } else {
        console.log('Filepath name:'+Filename);
          console.log('File uploaded to offlinedatablob');          
      }
  });
});
//}
}
};
module.exports={
methodupload:upload
}


