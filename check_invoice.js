const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // Replace with actual password if needed, but it's blank in properties
  database: 'quan_ly_phong_tro'
});

connection.query(
  'SELECT id, total_amount, status FROM invoices WHERE id = 19',
  function(err, results, fields) {
    if (err) {
      console.error("DB Error:", err.message);
      process.exit(1);
    }
    console.log("Invoice 19:", results);
    process.exit(0);
  }
);
