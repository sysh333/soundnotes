const express = require('express');
const db = require('./connection');
var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })

const router = express.Router();


router.get('/:id(\\d+)/note', async (req, res, next) => {
  let connection;
  const sound_id = req.params.id;
  try {
    connection = await db.getConnection();
    const [rows] = await connection.query('select id, text, submit_time from `note` WHERE `sound_id` = ? ORDER BY submit_time',[sound_id]);
    res.json(rows);
  } catch (err) {
     console.log('*** catch ***',err);
    next(err);
  } finally {
    if (connection) {
      connection.close();
    }
  }
});

router.post('/:id(\\d+)/note', async (req, res, next) => {
  let connection;
  const sound_id = req.params.id;
  const { text, time } = req.body;
  try {
    connection = await db.getConnection();
    const queryInsert = 'INSERT INTO note (text, submit_time , sound_id) VALUES (?, ?, ?)';
    const [result] = await connection.query(queryInsert, [text, time, sound_id]);

    res.json({ text, time, sound_id, id: result.insertId});
  } catch (err) {
    next(err);
    console.log('*** catch ***',err);
  } finally {
    if (connection) {
      connection.close();
    }
  }
});



router.get('/:id(\\d+)/raw', async (req, res, next) => {
  let connection;
  const sound_id = req.params.id;
  try {
    var fs = require("fs");
    fs.readFile("./uploads/d4f818aa28c7cfc4d469f15b78de61fb", (error, data) => {
      if (error) {
        console.log(error);
      }
      res.set({
        'content-type': 'audio/webm'
      });
     res.send(data);
     });
  } catch (err) {
     console.log('*** catch ***',err); 
    next(err);
  } finally {
    if (connection) {
      connection.close();
    }
  }
});

router.post('/', upload.single('recording'), async (req, res, next) => { 
  let connection;
  const sound_id = req.query.sound_id;
  try {
    connection = await db.getConnection();
    const { title, startTime, endTime} = req.body;
    console.log(req.file);
    const queryInsert = 'INSERT INTO sound (title, start_time , end_time) VALUES (?, ?, ?)';
    const [result] = await connection.query(queryInsert, [title, startTime, endTime]);
    res.json(result.insertId);

  } catch (err) {
    next(err);
    console.log('*** catch ***',err); 
  } finally {
    if (connection) {
      connection.close();
    }
  }
});

module.exports = router;