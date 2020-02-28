'use strict';
var fs = require('fs');
var provisioningServiceClient = require('azure-iot-provisioning-service').ProvisioningServiceClient;
var constants=require('./constants');
//const path = require('path');
const express = require('express');
const router = express.Router();

// var argv = require('yargs')
//   .usage('Usage: $0 --deviceid <DEVICE ID> --connectionstring <DEVICE PROVISIONING CONNECTION STRING> ')
//   .option('deviceid', {
//     alias: 'd',
//     describe: 'Unique identifier for the device that shall be created',
//     type: 'string',
//     demandOption: true
//   })
//   .option('connectionstring', {
//     alias: 'c',
//     describe: 'The connection string for the Device Provisioning instance',
//     type: 'string',
//     demandOption: true
//   })
//   .argv;

// var deviceID = argv.deviceid;
// var connectionString = argv.connectionstring;

var deviceID=constants.Device_Id;
var connectionString=constants.DPS_ConnectionString;
var serviceClient = provisioningServiceClient.fromConnectionString(connectionString);

//var certFile = path.join(__dirname, "/home/administrator/Desktop/certificates", deviceID + "-12122019.cer");
var certFile =constants.IndividualCertificate_Path;

if (!fs.existsSync(certFile)) {
    console.log('Certificate File not found:' + certFile);
    process.exit();
    } else {
    var certificate = fs.readFileSync(certFile, 'utf-8').toString();
};

var enrollment = {
    registrationId: deviceID,
    deviceID: deviceID,
    attestation: {
      type: 'x509',
      x509: {
        clientCertificates: {
          primary: {
            certificate: certificate
          }
        }
      }
    }
  };


//router.get('/', function(req, res) {  
function individual_enrolment()
{ 
serviceClient.createOrUpdateIndividualEnrollment(enrollment, function (err, enrollmentResponse) {
  if (err) {
    console.log('error creating the individual enrollment: ' + err);
    //res.setHeader('Content-Type', 'application/json');
    //res.status(404).json({Error:'error creating the individual enrollment'});
    
  } else {
    console.log("enrollment record returned: " + JSON.stringify(enrollmentResponse, null, 2));
    r//es.setHeader('Content-Type', 'application/json');
    //res.status(200).json({ success:enrollmentResponse});
  }
});
}
//});
module.exports={
  method:individual_enrolment
};