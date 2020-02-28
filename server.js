const http = require('http');
const https = require('https');
const express = require('express');
var constants = require('./constants');
var Protocol = require('azure-iot-device-http').Http;
var Client = require('azure-iot-device').Client;
const path = require('path');
const app = express();
const socketio=require('socket.io');
const server = http.createServer(app);
const io=socketio(server);
const grp_provisioning = require('./register_device');
const ind_enrollment= require('./individual_enrollment');
const grp_enrollment= require('./group_enrollment');
const upload_to_blob= require('./upload');
const twindevice= require('./twin');
const twinquery= require('./twin_query');
const download= require('./download');
const devicetelemetry=require('./sendtelemetry');
const port = process.env.PORT ||constants.PORT;
server.listen(port);
var client=null;
var deviceId=null;
var parameters=[];
const router = express.Router();
console.debug('Server listening on port ' + port);


//create device client
function createdeviceclient(param1,param2){
return Client.fromConnectionString('HostName='+param1+';'+'DeviceId='+param2+';'+'x509=true;',Protocol);
}

//Establishing Socket Connection
io.on('connection', function(socket){
    socket.on('registerDevice',(message) => {
        console.log(message);
        if(client != null)
        {
            console.log("Closing Client ")
            client.close();
        }
            //Provision a Device
            /*parameters = grp_provisioning.method(callback=>{
            socket.emit('Error','Error in Provisioning');
            });*/
        
            parameters = grp_provisioning.method(function(assignedIoTHub,deviceid,err)
            {
                if(err == null)
                {
                console.log("ass Iot Hub :" + assignedIoTHub);
                console.log("ClientId :" + deviceid);
                deviceId=deviceid;
                //console.log('parameters'+deviceid);
                client=createdeviceclient(assignedIoTHub,deviceId);
                socket.emit('Provisioning',deviceId);
                }
                else{
                    socket.emit('Error','Error in Provisioning');
                }
            });
           
        
        /*else
        {
            console.log("Client already exist :" + JSON.stringify(client.deviceId))
            socket.emit('Provisioning',client.deviceId)
        }*/
       
});

//if (deviceId){
    //Change to Provision status
    socket.on('status',(data)=>{
        console.log(data);
    });
    socket.on('dispenseevent', (message) => {
        //Send telemetry 
        console.log(deviceId+'Inside message');
        devicetelemetry.methodtelemetry(message,client,deviceId,callback=>{
        socket.emit('TelemetryError','Error in sending telemetry');
        });
        // fs.writeFile(constants.Filepath+"log"+constants.Fileextension,data,{'flag':'a'},function(err){
        // if(err)
        // console.log(err);
        // else{
        // console.log('successfully written to  a log file');
        // }
        // });
        var bottlesavedcount=devicetelemetry.methodBottleSavedCount(function(data,err) {
            if(data){
                console.log('something'+data);
                socket.emit('UpdatedBottleSavedCounts',data);
            }
            else{
                console.log(err);
            }
        });

        //Query Device Twin
        //twinquery.method();
        //twindevice.method(deviceId);
    
         //Offline Sync
       
});
socket.on('internetconnectionstate',(wifistate)=>{
    if(wifistate==false){
        //socket.on('OfflineSync',(message)=>{
            //console.log(wifistate+"inside fileupload")
            upload_to_blob.methodupload(client,deviceId,callback=>{
                    socket.emit('FileUploadError','Error in File Upload')
            });
       // });
    }
});
//}
});

    /*
    //Receive Telemetry from Device
    socket.on('message', (message) => {
        //console.log(message)
        //Send telemetry 
        devicetelemetry.methodtelemetry(message,client,callback=>{
            socket.emit('TelemetryError','Error in sending telemetry');
        });
        
        //Query Device Twin
        twinquery.method();
        twindevice.method(parameters[1]);
    })

    //Offline Sync
    socket.on('OfflineSync',(message)=>{
        console.log(message)
        upload_to_blob.methodupload(client,callback=>{
                socket.emit('FileUploadError','Error in File Upload')
        });
    })*/


app.use(express.json());


