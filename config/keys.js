dbPassword = process.env.MONGODB;
const mysql = require('mysql');
var db = mysql.createConnection({
    host: process.env.SQL_HOST,
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    database: process.env.SQL_DATABASE
  });
  
  db.connect(err => {
  
    if (err) console.log(err);
  
    else console.log("Database Connected!");
  
  });
module.exports = {
    mongoURI: dbPassword,
    database:db
};
