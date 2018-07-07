const express = require('express');
const db = require('./connection');

const router = express.Router();

router.get('/', async (req, res, next) => {
  let connection;
  const sound_id = 1;
  try {
    connection = await db.getConnection();
    const [rows] = await connection.query('select id, text, submit_time from `note` WHERE `sound_id` = ? ORDER BY submit_time',[sound_id]);
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