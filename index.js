const express = require('express');
const router = require('./src/routes');

const app = express();
const port = 5005;

app.use(express.json());
app.use('/', router);

app.listen(port, () => {
  console.log(`Your server is start on port ${port}...`);
});
