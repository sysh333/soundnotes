const express = require('express');
const db = require('./connection');

const router = express.Router();

router.get('/', async (req, res, next) => {
  let connection;
  const sound_id = req.query.sound_id;
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

router.post('/', async (req, res, next) => {
  let connection;
  const { text, time, sound_id } = req.body;

  try {
    connection = await db.getConnection();

    const queryInsert = 'INSERT INTO note (text, submit_time , sound_id) VALUES (?, ?, ?)';
    const [result] = await connection.query(queryInsert, [text, time, sound_id]);

    res.json({ text, time, sound_id, id: result.insertId});
  } catch (err) {
    next(err);
    console.log('*** catch ***',err); //クエリをエラーにしてコメントを外すと出力される
  } finally {
    if (connection) {
      connection.close();
    }
  }
});


module.exports = router;