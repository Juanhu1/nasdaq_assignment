/* 
 * provide a REST service for querying last index of nasdaq.com
 * Usage:
 *      /getindex
 * Result:
 *      JSON Object:
 *          {
 *              index: last value (integer),
 *              date: date of value (datetime)
 *          }
 *      if Error, result object:
 *          {
 *              index: -1,  
 *              error: error msg 
 *          }    
 *          
 *  Database: mySql on localhost, 
 *      table structure: 
 *          CREATE TABLE `indextable` (
 *                `ID` int(11) NOT NULL AUTO_INCREMENT,
 *                `indexvalue` int(11) NOT NULL,
 *                `date` datetime NOT NULL,
 *               PRIMARY KEY (`ID`)
 *          )
 */  


const HTTP_PORT=3000 ;   
const express = require('express') ;
const app = express() ; 

function getIndexFromDatabase() {
    return new Promise( (resolve,reject)=> {
        var mysql = require('mysql') ;
        var connection = mysql.createConnection({
          host     : 'localhost',  
          user     : 'root',
          password : '',
          database : 'nasdaq'
        });  
        var result=-1 ;
        connection.connect() ;
        connection.query('SELECT indexvalue,date FROM indextable', function (err, rows, fields) {
          if (err) {
              reject(err) ;
          } else {
            if (rows.length<1) {
                  reject("database empty") ;
            } else {
                result={ 
                           index: rows[rows.length-1].indexvalue,
                           date: rows[rows.length-1].date
                       } ;          
                resolve(result) ;
              }
            }}) ;
        connection.end() ;
    });
}

app.get('/getindex', function (req, res) {
  getIndexFromDatabase().then( function(value) {      
     res.send( JSON.stringify( value  )) ;
 }, function(error) {
     res.send( { index:-1,
                 error: error
     }) ;
 }); 
}) ;

app.listen(HTTP_PORT, () => console.log('Listening on port '+HTTP_PORT )) ;