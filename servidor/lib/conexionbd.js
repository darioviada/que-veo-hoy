var mysql      = require('mysql');

var connection = mysql.createConnection({
  host     : 'localhost',
  port     : '3306',
  user     : 'root',
  password : 'Trismegisto576',
  database : 'que_peli_veo',
});

module.exports = connection;

