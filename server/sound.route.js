const express = require('express');
const db = require('./connection');
var multer = require('multer');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
var upload = multer({ storage: storage })

const router = express.Router();


router.get('/', async (req, res, next) => {
  let connection;
  try {
    connection = await db.getConnection();
    const [rows] = await connection.query('select id, title, start_time from `sound` ORDER BY start_time');
    res.json(rows);
    console.log(rows);
  } catch (err) {
     console.log('*** catch ***',err);
    next(err);
  } finally {
    if (connection) {
      connection.close();
    }
  }
});

router.get('/:id(\\d+)/note', async (req, res, next) => {
  let connection;
  const sound_id = req.params.id;
  try {
    connection = await db.getConnection();
    const [rows] = await connection.query('select id, text, submit_time from `note` WHERE `sound_id` = ? ORDER BY submit_time',[sound_id]);
    res.json(rows);
    console.log(rows);
  } catch (err) {
     console.log('*** catch ***',err);
    next(err);
  } finally {
    if (connection) {
      connection.close();
    }
  }
});

router.get('/:id(\\d+)/', async (req, res, next) => {
  let connection;
  const sound_id = req.params.id;
  try {
    connection = await db.getConnection();
    const [rows] = await connection.query('select id, title, start_time, end_time from `sound` WHERE `id` = ?',[sound_id]);
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

router.get('/:id(\\d+)/raw', async (req, res, next) => {
  let connection;
  const sound_id = req.params.id;
  try {
    var fs = require("fs");
    fs.readFile(`./uploads/${sound_id}.webm`, (error, data) => {
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


router.post('/:id(\\d+)/raw', upload.single('recording'), function(req, res) {
  console.log("multer sucsess");
});


router.post('/', async (req, res, next) => { 
  let connection;
  try {
    connection = await db.getConnection();
    const { title, startTime, endTime} = req.body; //  <----あとで　endtime　を消す！！
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

router.put('/:id(\\d+)/', async (req, res, next) => {
  let connection;
  const sound_id = req.params.id;
  const { endTime } = req.body;
  try {
    connection = await db.getConnection();
    const queryInsert = 'UPDATE sound ? WHERE `sound_id` = ?';
    const [result] = await connection.query(queryInsert, [endTime, sound_id]);
    res.json({ id: result.insertId});
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