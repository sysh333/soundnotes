const express = require('express');
const db = require('./connection');
var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })

const router = express.Router();

router.get('/', async (req, res, next) => {
  let connection;
  const sound_id = req.query.sound_id;
  try {
    connection = await db.getConnection();
    const sound = await connection.query('select recordingData from `sound` WHERE `sound_id` = ? ',[sound_id]);
    res.send(sound);
    console.log(sound);
  } catch (err) {
     console.log('*** catch ***',err); //クエリをエラーにしてコメントを外すと出力される
    next(err);
  } finally {
    if (connection) {
      connection.close();
    }
  }
});

router.post('/', upload.single('avatar'), async (req, res, next) => { 
  let connection;
  const sound_id = req.query.sound_id;

  try {
    connection = await db.getConnection();
    let formData = req.body;
    const { title, startTime, endTime, recording} = req.body;
    console.log(sound_id);
    console.log('form data', formData);
    console.log(title);
    console.log(startTime);
    console.log(endTime);
    console.log(recording);


    const queryInsert = 'INSERT INTO sound (title, start_time , end_time, recordingData) VALUES (?, ?, ?, ?)';
    const [result] = await connection.query(queryInsert, [title, startTime, endTime, recording]);
    res.json(result.insertId);

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