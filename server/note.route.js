const express = require('express');
const db = require('./connection');

const router = express.Router();

router.get('/', async (req, res, next) => {
  let connection;
  try {
    connection = await db.getConnection();
    const [rows] = await connection.query('select id, text, submit_time from note WHERE sound_id=1 ORDER BY submit_time');
    res.json(rows);
  } catch (err) {
     console.log('*** catch ***',err); //クエリをエラーにしてコメントを外すと出力される
    next(err);
  } finally {
    if (connection) {
      connection.close();
    }
  }
});

module.exports = router;