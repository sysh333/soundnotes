const express = require('express');
const db = require('./connection');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
});
const upload = multer({ storage: storage })

const router = express.Router();


router.get('/', async (req, res, next) => {
  let connection;
  try {
    connection = await db.getConnection();
    const [rows] = await connection.query('select id, title, start_time, end_time from `sound` ORDER BY id DESC');
    res.json(rows);
  } catch (err) {
    console.log('*** catch ***', err);
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
  console.log('sound.route.js = ', sound_id);
  try {
    connection = await db.getConnection();
    const [rows] = await connection.query('select id, text, submit_time from `note` WHERE `sound_id` = ? ORDER BY submit_time', [sound_id]);
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

router.get('/:id(\\d+)/', async (req, res, next) => {
  let connection;
  const sound_id = req.params.id;
  try {
    connection = await db.getConnection();
    const [rows] = await connection.query('select id, title, start_time, end_time from `sound` WHERE `id` = ?',[sound_id]);
    res.json(rows);
  } catch (err) {
    console.log('*** catch ***', err);
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
    const fs = require("fs");
    fs.readFile(`./uploads/${sound_id}.webm`, (error, data) => {
      if (error) {
        console.log(error);
      }
      res.set({
        'content-type': 'audio/webm',
      });
      res.send(data);
    });
  } catch (err) {
    console.log('*** catch ***', err);
    next(err);
  } finally {
    if (connection) {
      connection.close();
    }
  }
});

router.post('/', async (req, res, next) => {
  let connection;
  try {
    connection = await db.getConnection();
    const { title, startTime } = req.body;
    const queryInsert = 'INSERT INTO sound (title,start_time) VALUES (?,?)';
    const [result] = await connection.query(queryInsert, [title, startTime]);
    res.json(result.insertId);
  } catch (err) {
    next(err);
    console.log('*** catch ***', err);
  } finally {
    if (connection) {
      connection.close();
    }
  }
});

router.post('/:id(\\d+)/note', async (req, res, next) => {
  let connection;
  const sound_id = req.params.id;
  const { text, submit_time } = req.body;
  try {
    connection = await db.getConnection();
    const queryInsert = 'INSERT INTO note (text, submit_time , sound_id) VALUES (?, ?, ?)';
    const [result] = await connection.query(queryInsert, [text, submit_time, sound_id]);

    res.json({ text, submit_time, sound_id, id: result.insertId });
  } catch (err) {
    next(err);
    console.log('*** catch ***', err);
  } finally {
    if (connection) {
      connection.close();
    }
  }
});


router.post('/:id(\\d+)/raw', upload.single('recording'), function(req, res) {
  console.log("multer sucsess");
});

router.put('/:id(\\d+)/', async (req, res, next) => {
  let connection;
  const sound_id = req.params.id;
  const { title, startTime, endTime } = req.body;
  try {
    connection = await db.getConnection();
    const queryInsert = 'UPDATE sound SET title = ?, start_time = ? ,end_time = ? WHERE `id` = ?';
    const [result] = await connection.query(queryInsert, [title, startTime, endTime, sound_id]);
    res.json({ id: result.insertId });
  } catch (err) {
    next(err);
    console.log('*** catch ***',err);
  } finally {
    if (connection) {
      connection.close();
    }
  }
});


router.delete('/:id(\\d+)/', async (req, res, next) => {
  let connection;
  const id = req.params.id;
  try {
    connection = await db.getConnection();
    const queryInsert = 'DELETE FROM sound where id = ?';
    const [result] = await connection.query(queryInsert, [id]);
    res.json(result);
  } catch (err) {
    next(err);
  } finally {
    if (connection) {
      connection.close();
    }
  }
  const fs = require('fs');
  fs.unlink(`./uploads/${id}.webm`, function (err) {
    if (err) {
      console.error(err);
    }
    else {
      console.log('finished!!');
    }
  });
});

module.exports = router;
