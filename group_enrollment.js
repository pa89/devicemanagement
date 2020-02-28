'use strict';
var fs = require('fs');
var constants=require('./constants');
const express = require('express');
const router = express.Router();

var provisioningServiceClient = require('azure-iot-provisioning-service').ProvisioningServiceClient;

// var argv = require('yargs')
//   .usage('Usage: $0 --connectionstring <DEVICE PROVISIONING CONNECTION STRING> --certificagte <PATH TO CERTIFICATE> ')
//   .option('connectionstring', {
//     alias: 'c',
//     describe: 'The connection string for the Device Provisioning instance',
//     type: 'string',
//     demandOption: true
//   })
//   .option('certificate', {
//     alias: 'ce',
//     describe: 'certificated used for group enrollment',
//     type: 'string',
//     demandOption: true
//   })
//   .argv;

// var connectionString = argv.connectionString;
// var certificate = argv.certificate;
var connectionString=constants.DPS_ConnectionString;
var certificate=constants.RootCertificate;
var serviceClient = provisioningServiceClient.fromConnectionString(connectionString);

// var enrollment = {
//   enrollmentGroupId:constants.EnrollmentGroupId,
//   attestation: {
//     type: 'x509',
//     x509: {
//       signingCertificates: {
//         primary: {
//           certificate: fs.readFileSync(certificate, 'utf-8').toString(),
//         }
//       }
//     }
//   },
//   provisioningStatus: 'enabled'
// };

//router.get('/', function(req, res) {
function group_enrolment()
{
  var enrollment = {
    enrollmentGroupId:constants.EnrollmentGroupId,
    attestation: {
      type: 'x509',
      x509: {
        signingCertificates: {
          primary: {
            certificate: fs.readFileSync(certificate, 'utf-8').toString(),
          }
        }
      }
    },
    provisioningStatus: 'enabled'
  };
serviceClient.createOrUpdateEnrollmentGroup(enrollment, function (err, enrollmentResponse) {
  if (err) {
    console.log('error creating the group enrollment: ' + err);
    //res.status(404).json({Error:'error creating the group enrollment'});
   
  } else {
    console.log("enrollment record returned: " + JSON.stringify(enrollmentResponse, null, 2));
    enrollmentResponse.provisioningStatus = 'enabled';
    serviceClient.createOrUpdateEnrollmentGroup(enrollmentResponse, function (err, enrollmentResponse) {
      if (err) {
        console.log('error updating the group enrollment: ' + err);
       // res.setHeader('Content-Type', 'application/json');
        //res.status(404).json({Error:'error updating the group enrollment'});
      } else {
        console.log("updated enrollment record returned: " + JSON.stringify(enrollmentResponse, null, 2));
       // res.setHeader('Content-Type', 'application/json');
        //res.status(200).json({ enrollment :enrollmentResponse});
      }
    });
  }
});
return enrollment.enrollmentGroupId;
}
//});

// router.get('/:id', function(req, res) {
//   var enrollmentGroupId=req.params.id;
//   var enrollment = {
//     enrollmentGroupId:enrollmentGroupId,
//     attestation: {
//       type: 'x509',
//       x509: {
//         signingCertificates: {
//           primary: {
//             certificate: fs.readFileSync(certificate, 'utf-8').toString(),
//           }
//         }
//       }
//     },
//     provisioningStatus: 'enabled'
//   };
// serviceClient.createOrUpdateEnrollmentGroup(enrollment, function (err, enrollmentResponse) {
//   if (err) {
//     console.log('error creating the group enrollment: ' + err);
//     res.status(404).json({Error:'error creating the group enrollment'});
   
//   } else {
//     console.log("enrollment record returned: " + JSON.stringify(enrollmentResponse, null, 2));
//     enrollmentResponse.provisioningStatus = 'enabled';
//     serviceClient.createOrUpdateEnrollmentGroup(enrollmentResponse, function (err, enrollmentResponse) {
//       if (err) {
//         console.log('error updating the group enrollment: ' + err);
//         res.setHeader('Content-Type', 'application/json');
//         res.status(404).json({Error:'error updating the group enrollment'});
//       } else {
//         console.log("updated enrollment record returned: " + JSON.stringify(enrollmentResponse, null, 2));
//         res.setHeader('Content-Type', 'application/json');
//         res.status(200).json({ enrollment :enrollmentResponse});
//       }
//     });
//   }
// });
// });
module.exports={
  method:group_enrolment
};