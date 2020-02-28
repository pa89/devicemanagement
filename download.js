/*const azureStorage = require('azure-storage');
const path = require('path');
 
const azureStorageConfig = {
    accountName: "",
    accountKey: "",
    blobURL: "",
    containerName: ""
};
 
const downloadBlob = async (blobName, downloadFilePath) => {
    return new Promise((resolve, reject) => {
        const name = path.basename(blobName);
        const blobService = azureStorage.createBlobService(azureStorageConfig.accountName, azureStorageConfig.accountKey); 
        blobService.getBlobToLocalFile(azureStorageConfig.containerName, blobName, `${downloadFilePath}${name}`, function(error, serverBlob) {
            if (error) {
                reject(error);
            } else {
                resolve(downloadFilePath);
            }
        });
    });
};
 
downloadBlob('images/6350402094004393-11.jpeg','./downloads/');*/

const azureStorage = require('azure-storage');
const path = require('path');
var Promise = require('promise');
var constants=require('./constants');
const express = require('express');
const router = express.Router();


const azureStorageConfig = {

    accountName: "smartwelldevsan",

    accountKey: "TkImz7bKiW112NFvWC2dv85RWwbRc8WJQl/gtdbVP9vo5cSfLBaAzPf+/htjk6mExu98L7uLY1+/1ePXSDstgQ==",

    blobURL: "https://smartwelldevsan.blob.core.windows.net/smartwell-device-offlinedata-sync",
    
    containerName: "smartwell-device-offlinedata-sync"
    //containerName: "fileuploadtestdevice2"

};
var accountName=constants.accountName;
var accountKey=constants.accountKey;
var blobURL=constants.blobURL;
var containerName=constants.containerName;

//router.get('/', function(req, res) {
function download(){
const downloadBlob = async (blobName, downloadFilePath) => {
    return new Promise((resolve, reject) => {
        const name = path.basename(blobName);
        const blobService = azureStorage.createBlobService(azureStorageConfig.accountName,azureStorageConfig.accountKey); 
        blobService.getBlobToLocalFile(azureStorageConfig.containerName, blobName, `${downloadFilePath}${name}`, function(error, serverBlob) {
            if (!resolve) {
                console.log('error');
                reject('error');
                //res.setHeader('Content-Type', 'application/json');
                //res.status(404).json({Error:'error'});
            } else {
                console.log(name);
                resolve(downloadFilePath);
                console.log(downloadFilePath);
               // res.setHeader('Content-Type', 'application/json');
               // res.status(200).json({Message:'successful download'});
            }
        });
    }).catch('error');
};
downloadBlob('fileuploadtestdevice2//sample.txt','//home//administrator//Desktop//certificates');
}
//});
module.exports={
    method:download
};
 

