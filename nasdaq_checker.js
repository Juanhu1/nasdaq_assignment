/* 
 * periodically check nasdaq.com and store the index value in database
 * Database structure: see nasdaq_rest.js
 */


const INTERVAL_TIME=10*60000 ;

const phantom = require('phantom');

periodicCheck() ; //for the start
setInterval(periodicCheck, INTERVAL_TIME);    

function putIndexToDatabase(value) {
    var mysql = require('mysql') ;
    var connection = mysql.createConnection({
      host     : 'localhost',
      user     : 'root',
      password : '',
      database : 'nasdaq'
    });

    connection.connect(function(err) {
        if (err) {
            throw err;
        }
    }) ;
    var query='INSERT INTO `indextable`(`indexvalue`, `date`) VALUES ('+value+',\''+ (new Date()).toLocaleString()+ '\')' ;
    console.log(query) ;
    connection.query(query, function (err, rows, fields) {
      if (err) throw err ;
    }) ;
    connection.end() ;
}


async function periodicCheck() {
    
    const instance = await phantom.create();
    const page = await instance.createPage();
    const status = await page.open('https://www.nasdaq.com/');
    const content = await page.property('content');
    try {
        page.evaluateJavaScript('function() { return index ; }').then( function(data){
            if (data!==undefined) {
                putIndexToDatabase(data) ;
                console.log(data) ;
            }
            instance.exit();
        }, function(error) {
            instance.exit();    
        });    
    }
    catch (err) {
        console.log("Error in execution:", err) ;
        window.clearInterval() ;
    }
} ;
