const express = require('express');
const db = require('./connection');

const router = express.Router();

router.get('/', async (req, res, next) => {
  let connection;
  const sound_id = req.query.sound_id;
  try {
    connection = await db.getConnection();
    const [rows] = await connection.query('select title, start_time, end_time from `sound` WHERE `id` = ?',[sound_id]);
    res.json(rows);
  } catch (err) {
     console.log('*** catch info ***',err); //クエリをエラーにしてコメントを外すと出力される
    next(err);
  } finally {
    if (connection) {
      connection.close();
    }
  }
});


module.exports = router;