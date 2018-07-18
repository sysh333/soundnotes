const express = require('express');
const db = require('./connection');
var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })

const router = express.Router();

router.get('/', async (req, res, next) => {
  let connection;
  try {
    connection = await db.getConnection();
    const [rows] = await connection.query('select id, title, start_time, end_time, data_URL from sound');
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

router.post('/', upload.single('avatar'), async (req, res, next) => { 
  let connection;
  const sound_id = req.query.sound_id;

  try {
    connection = await db.getConnection();
    let formData = req.body;
    console.log(req);
    console.log(sound_id);
    console.log(req.body);
    console.log(req.file);
    console.log('form data', formData);

    //const queryInsert = 'INSERT INTO note (text, submit_time , sound_id) VALUES (?, ?, ?)';
    //const [result] = await connection.query(queryInsert, [text, time, sound_id]);
    res.json(formData);
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