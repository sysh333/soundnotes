const express = require('express');
const db = require('./connection');
var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })

const router = express.Router();

router.get('/', async (req, res, next) => {
  let connection;
  const sound_id = req.query.sound_id;
  try {
    //connection = await db.getConnection();
    //const sound = await connection.query('select recordingData from `sound` WHERE `id` = ? ',[sound_id]);
    var fs = require("fs");
    fs.readFile("./uploads/1d08f3fa9d49c54475111d27ac063a47", (error, data) => {
      if (error) {
        console.log(error);
      }
      console.log(data);
      res.set({
        'content-type': 'audio/webm'
      });
     res.send(data);
     console.log("data----" , data)
     });
    
    
    //res.send(sound);
    //console.log("sound = " , sound);
  } catch (err) {
     console.log('*** catch ***',err); //クエリをエラーにしてコメントを外すと出力される
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
    console.log(sound_id);
    console.log(title);
    console.log(startTime);
    console.log(endTime);
    console.log(req.file);


    const queryInsert = 'INSERT INTO sound (title, start_time , end_time) VALUES (?, ?, ?)';
    const [result] = await connection.query(queryInsert, [title, startTime, endTime]);
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