const mysql = require('mysql2/promise');

const getConnection = async () =>
  mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'soundnotes',
  });

module.exports = {
  getConnection,
};
