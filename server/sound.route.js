const express = require('express');
const db = require('./connection');
const multer = require('multer');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
});
const upload = multer({ storage });

const router = express.Router();


router.get('/', async (req, res, next) => {
  let connection;
  const UID = req.headers['user-token'];
  console.log('get userID para =', UID);
  try {
    connection = await db.getConnection();
    const [rows] = await connection.query('select id, title, start_time, end_time from `sound` WHERE `user_ID` = ? ORDER BY id DESC', [UID]);
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
  const soundID = req.params.id;
  const UID = req.headers['user-token'];
  // console.log('sound.route.js UID = ', UID);
  try {
    connection = await db.getConnection();
    const [dbUID] = await connection.query('select user_ID from `sound` WHERE `id` = ? ', [soundID]);
    if (dbUID[0].user_ID === UID) {
      const [rows] = await connection.query('select id, text, submit_time from `note` WHERE `sound_id` = ? ORDER BY submit_time', [soundID]);
      res.json(rows);
    }
  } catch (err) {
    console.log('*** catch ***', err);
    next(err);
  } finally {
    if (connection) {
      connection.close();
    }
  }
});

router.get('/:id(\\d+)/', async (req, res, next) => {
  let connection;
  const soundID = req.params.id;
  const UID = req.headers['user-token'];
  try {
    connection = await db.getConnection();
    const [dbUID] = await connection.query('select user_ID from `sound` WHERE `id` = ? ', [soundID]);
    if (dbUID[0].user_ID === UID) {
      const [rows] = await connection.query('select id, title, start_time, end_time from `sound` WHERE `id` = ?', [soundID]);
      res.json(rows);
    }
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
  const soundID = req.params.id;
  const UID = req.headers['user-token'];
  // console.log('sound.route.js UID = ', UID);
  try {
    connection = await db.getConnection();
    const [dbUID] = await connection.query('select user_ID from `sound` WHERE `id` = ? ', [soundID]);
    if (dbUID[0].user_ID === UID) {
      fs.readFile(`./uploads/${soundID}.webm`, (error, data) => {
        if (error) {
          console.log(error);
        }
        res.set({
          'content-type': 'audio/webm',
        });
        res.send(data);
      });
    }
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
  const UID = req.headers['user-token'];
  try {
    connection = await db.getConnection();
    const { title, startTime } = req.body;
    const queryInsert = 'INSERT INTO sound (title,start_time,user_ID) VALUES (?,?,?)';
    const [result] = await connection.query(queryInsert, [title, startTime, UID]);
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
  const soundID = req.params.id;
  const { text, submit_time } = req.body;
  try {
    connection = await db.getConnection();
    const queryInsert = 'INSERT INTO note (text, submit_time , sound_id) VALUES (?, ?, ?)';
    const [result] = await connection.query(queryInsert, [text, submit_time, soundID]);

    res.json({ text, submit_time, soundID, id: result.insertId });
  } catch (err) {
    next(err);
    console.log('*** catch ***', err);
  } finally {
    if (connection) {
      connection.close();
    }
  }
});


router.post('/:id(\\d+)/raw', upload.single('recording'),(req, res) => {
  const file = req.file
  const meta = req.body
  // デッバグのため、アップしたファイルの名前を表示する
  console.log(file, meta)
  // アップ完了したら200ステータスを送る
  res.status(200).json({msg: 'アップロード完了'})
});


router.put('/:id(\\d+)/', async (req, res, next) => {
  let connection;
  const soundID = req.params.id;
  const { title, startTime, endTime } = req.body;
  try {
    connection = await db.getConnection();
    const queryInsert = 'UPDATE sound SET title = ?, start_time = ? ,end_time = ? WHERE `id` = ?';
    const [result] = await connection.query(queryInsert, [title, startTime, endTime, soundID]);
    res.json({ id: result.insertId });
  } catch (err) {
    next(err);
    console.log('*** catch ***', err);
  } finally {
    if (connection) {
      connection.close();
    }
  }
});


router.put('/note/:id(\\d+)/', async (req, res, next) => {
  let connection;
  const noteID = req.params.id;
  const { text } = req.body;
  try {
    connection = await db.getConnection();
    const queryInsert = 'UPDATE note SET text = ? WHERE `id` = ?';
    const [result] = await connection.query(queryInsert, [text, noteID]);
    res.json({ id: result.insertId });
  } catch (err) {
    next(err);
    console.log('*** catch ***', err);
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
