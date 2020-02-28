var fs = require('fs');
//const deviceclient = require('./register_device');
var serverobj= require('./server');
var constants = require('./constants');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./mydb.db3');
var Message = require('azure-iot-device').Message;
var dateTime = require('node-datetime');
var dt = dateTime.create();
var data=null;
var telemetrydata=null;
var jsondata=null;
var jsondata1=null;
var flavors=null;
var enhancements=null;
var waterTypes=null;
var bottleSavedCount=null;
var parameters=[];
var deviceid=null;
var newval;

// Send Device Data to Cloud
function sendtelemetrytodevice(telemetry,client,devid,callback)
{
//console.log(DeviceId+'Send Tele');
if(client==null){
console.log('Device ID Null');
}
else{
deviceid = devid;
console.log('Sendtelemety:'+ JSON.stringify(telemetry));
var connectCallback = function (err) {
//console.log(deviceid)
  databaseoperations(telemetry,deviceid);

    client.on('message', function (msg) {
      console.log('Id: ' + msg.messageId + ' Body: ' + msg.data);
      // When using MQTT the following line is a no-op.
      client.complete(msg, printResultFor('Completed'));
    });
    // Create a message and send it to the IoT Hub every two seconds
      var sendInterval = setTimeout( function () {
      data = JSON.stringify(telemetry);
      var message = new Message(data);
    //   fs.writeFile(constants.Filepath+devid+constants.Fileextension,data,{'flag':'a'},function(err){
    //   if(err)
    //       console.log(err);
    //   else{
    //       console.log('successfully written to file');
    //   }
    // });
      
      console.log('Sending message: ' + message.getData());
      client.sendEvent(message, printResultFor('send')); 
    }, 6000);



client.on('error', function (err) {
console.error(err.message);

});

    client.on('disconnect', function () {
      clearInterval(sendInterval);
      client.removeAllListeners();
      client.open(connectCallback);
    });
  //}
};


var options = {
cert : fs.readFileSync(constants.DEVICE_CER, 'utf-8').toString(),
key : fs.readFileSync(constants.DEVICE_KEY, 'utf-8').toString(),

};

// Calling setOptions with the x509 certificate and key (and optionally, passphrase) will configure the client transport to use x509 when connecting to IoT Hub

client.setOptions(options);
client.open(connectCallback);

function printResultFor(op) {
  return function printResult(err, res) {
    if (err){ console.log(op + ' error: ' + err.toString());
    callback(err)
  }
    if (res) console.log(op + ' status: ' + res.constructor.name);
  };
}
}
}

function writetoafile(data)
{
fs.writeFile(constants.Filepath+deviceid+constants.Fileextension,data,{'flag':'a'},function(err){
  if(err)
      console.log(err);
  else{
      console.log('successfully written to file');
  }
});
}

//Save Telemetry Data in Local DB
function databaseoperations(telemetry,deviceid)
{ 
jsondata=JSON.stringify(telemetry);
//console.log("telemetry coming from client"+jsondata)
enhancements=JSON.stringify(telemetry.enhancements);
flavors=JSON.stringify(telemetry.flavors);
waterTypes=JSON.stringify(telemetry.waterType);
bottleSavedCount=JSON.stringify(telemetry.bottleSavedCount);
console.log('inside db'+ bottleSavedCount)
// // Create DeviceData Table
// db.serialize(function() {
// db.run("CREATE TABLE IF NOT EXISTS DeviceData (DeviceId TEXT PRIMARY KEY, DeviceTelemetry TEXT)");
// });
//Create DeviceEvent table
db.serialize(function() {
  db.run("CREATE TABLE IF NOT EXISTS DeviceEvent (DeviceId TEXT PRIMARY KEY, Flavors TEXT,Enhancements TEXT,WaterType TEXT,BottleSavedCount INT)");
  });
getDeviceID(deviceid);
function getDeviceID(deviceid){
//id ='2002'
var query = 'SELECT DeviceId FROM DeviceEvent where DeviceId=?';
db.get(query,deviceid,function (err, rows) {
  if(err){
      console.log(err);
  }
    return rows
    ? UpdateDatabase()
    : InsertIntoDatabase();
  
});
}
}

//Insert Record into DB if DeviceId doesnt exist
function InsertIntoDatabase(){
console.log(`No record found with the id ${deviceid}`);
console.log('Insert')
  db.serialize(function() {
  db.run("INSERT into DeviceEvent(DeviceId,Flavors,Enhancements,WaterType,BottleSavedCount) VALUES (?,?,?,?,?)",deviceid,flavors,enhancements,waterTypes,bottleSavedCount,function(err){
    if(err)
    console.log('Insertion Error'+err);
    else
    console.log('Inserted successfully');
  });
});
DisplayAllRows();
dt.format('m/d/Y H:M:S');
var filetime=new Date(dt.now());
var newdata='\n'+filetime+'{Flavor:'+flavors+' ,Enhancements: '+enhancements+',WaterTypes: '+waterTypes+',BottleSavedCount: '+bottleSavedCount+'}';
writetoafile(jsondata);
}

//Update Record in DB if DeviceId exists
function UpdateDatabase(){
console.log(`record found with the id ${deviceid}`);

  db.serialize(function() {

    let sql = `UPDATE DeviceEvent
                SET Flavors = ?,Enhancements=?,WaterType=?,BottleSavedCount=?
                WHERE DeviceId = ?`;

    bottleSavedCount=parseInt(bottleSavedCount)+1;
    console.log('count bottle:'+bottleSavedCount)
      db.run(sql,flavors,enhancements,waterTypes,bottleSavedCount,deviceid,function(err) {
      if (err) {
        return console.error('Update error'+err.message);
      }else{
        console.log(`Row(s) updated: ${this.changes}`);
        console.log('updated db successfully')
      }
          
    
    });
    
});

DisplayAllRows();
//DisplayBottleSavedCount();
dt.format('m/d/Y H:M:S');
var filetime=new Date(dt.now());
var newdata='\n'+filetime+'{Flavor:'+flavors+' ,Enhancements: '+enhancements+',WaterTypes: '+waterTypes+',BottleSavedCount: '+bottleSavedCount+'}';
writetoafile(newdata);
//Create DeviceEvents Table
// db.serialize(function() {
//    db.run("CREATE TABLE IF NOT EXISTS DeviceEvents (DeviceId TEXT, Slot1 TEXT,Slot2 TEXT,Slot3 TEXT,Slot4 TEXT,Slot5 TEXT,Slot6 TEXT,Slot7 TEXT,Slot8 TEXT)");
// });
}

//Display all records
function DisplayAllRows(){
db.serialize(function() {
db.all("SELECT * from DeviceEvent ",function(err,rows){
  if(err){
    console.log(err);
  }
  else{
    console.log(rows);
  }
});
});
}

//Return bottlesaved count
function DisplayBottleSavedCounts(callback){
  //var arr=[];
  db.serialize(function() {
  db.each("SELECT * from DeviceEvent  WHERE DeviceId=?",deviceid,function(err,rows){
    if(err){
      console.log(err);
    }
    else{
      
      console.log(`${rows.BottleSavedCount} is bottle count`);
      console.log(parseInt(rows.BottleSavedCount));
      bottleSavedCount=`${rows.BottleSavedCount}`;
      bottleSavedCount=parseInt(rows.BottleSavedCount)
      callback(bottleSavedCount);
      //return bottleSavedCount;
      
    }
  });
  });
  //console.log('Hi'+bottleSavedCount);
  //return bottleSavedCount;
 
  }

 //return latest bottlesaved count 
// function LatestBottleSavedCount(){
//   DisplayBottleSavedCount();
//   console.log('Hi inside'+newval);
//   return newval;
// }
module.exports={
methodtelemetry:sendtelemetrytodevice,
methodBottleSavedCount:DisplayBottleSavedCounts
}