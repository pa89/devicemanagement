'use strict';

var fs = require('fs');
var Transport = require('azure-iot-provisioning-device-http').Http;
var Protocol = require('azure-iot-device-http').Http;
//var Protocol=require('azure-iot-device-mqtt').Mqtt;
var Message = require('azure-iot-device').Message;
const express = require('express');
var constants = require('./constants');
// const socketio=require('socket.io');
// Feel free to change the preceding using statement to anyone of the following if you would like to try another protocol.
// var Transport = require('azure-iot-provisioning-device-amqp').Amqp;
// var Transport = require('azure-iot-provisioning-device-amqp').AmqpWs;
//var Transport = require('azure-iot-provisioning-device-mqtt').Mqtt;
// var Transport = require('azure-iot-provisioning-device-mqtt').MqttWs;
var X509Security = require('azure-iot-security-x509').X509Security;
var ProvisioningDeviceClient = require('azure-iot-provisioning-device').ProvisioningDeviceClient;
var Client = require('azure-iot-device').Client;
var provisioningHost = constants.PROVISIONING_HOST;
var idScope =constants.ID_SCOPE;
var registrationId = constants.REGISTRATION_ID;
var deviceCert = {
cert: fs.readFileSync(constants.DEVICE_CER).toString(),
key: fs.readFileSync(constants.DEVICE_KEY).toString()
};
var transport = new Transport();
var securityClient = new X509Security(registrationId, deviceCert);
var deviceClient = ProvisioningDeviceClient.create(provisioningHost, idScope, transport, securityClient);
const router = express.Router();


var assignedHub=null;
var deviceId=null;




//sqlite code---------------------------------------------------------------
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./mydb.db3');
var deviceData;
//sqlite code ends here-----------------------------------------------------------------------
function Register_Device(callback){
// Register the device.  Do not force a re-registration.
var er = null;
deviceClient.register(function(err,output) { 
    if(err)
    {
        console.error("error in provisioning"+err);
        callback(null,null,err);
    }
    else{
    console.log('registration succeeded');
    assignedHub=output.assignedHub;
    //assignedHub='smartwellIotHub.azure-devices.net';
    deviceId=output.deviceId;
    //deviceId='02122020device';
    console.log(assignedHub);
    console.log(deviceId);
    callback(assignedHub,deviceId,null);
    }
    });
}



module.exports={
method:Register_Device,
}








