const express = require('express');
const bodyParser = require('body-parser');
const config = require('./config');
const noteRoute = require('./note.route');

const app = express();

app.use(bodyParser.json());

// TODO add routes ----
app.use('/api/note', noteRoute);


// --------------------

app.listen(config.port, () =>
  console.info(`server started on port ${config.port}`),
);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something broke!' });
});
