var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./mydb1.db3');

// Create Table
db.serialize(function() {
    db.run("CREATE TABLE IF NOT EXISTS Users (Name TEXT, Age INTEGER)");
});

// Insert into Table
db.serialize(function() {
	db.run("INSERT into Users(Name,Age) VALUES ('Mushtaq',24)");
    db.run("INSERT into Users(Name,Age) VALUES ('Fazil',23)");
    console.log('hello')
});

// Select All Data
db.serialize(function() {
	db.all("SELECT * from Users",function(err,rows){
		if(err){
			console.log(err);
		}
		else{
			console.log(rows);
		}
	});
});

// //Perform DELETE operation
// db.run("DELETE * from table_name where condition");
// //Perform UPDATE operation
db.serialize(function() {
    var val='13';
 db.run("UPDATE Users SET Age=? where Name=?",val,'Mushtaq',function(err,rows){
   
		if(err){
			console.log(err);
		}
		else{
            console.log('updated');
			console.log(rows);
		}
 });
});

