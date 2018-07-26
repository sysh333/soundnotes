const express = require('express');
const bodyParser = require('body-parser');
const config = require('./config');
const noteRoute = require('./note.route');
const soundRoute = require('./sound.route');
const infoRoute = require('./info.route');

const app = express();

app.use(bodyParser.json());

// TODO add routes ----
//app.use('/api/note', noteRoute);
app.use('/api/sound', soundRoute);
app.use('/api/info', infoRoute);

// --------------------

app.listen(config.port, () =>
  console.info(`server started on port ${config.port}`),
);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something broke!' });
});
