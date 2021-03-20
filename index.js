const express = require('express');
const router = require('./src/routes');

const app = express();

app.use(express.json());
app.use('/api/v1/', router);

app.listen(process.env.PORT, () => {
  console.log(`Your server is start on port ${process.env.PORT}...`);
});
