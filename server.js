const express = require('express');
const app = express();
app.use(express.json());

app.listen(8080, () => {
  console.log('Server is up on 8080');
});

app.get('/', async (req, res, next) => {
  try {
    let returnjson = {
      statusCode: 200,
      body: {
        text: 'Hello World!',
      },
      isBase64Encoded: false,
    };
    res.json(returnjson);
  } catch (error) {
    return next(error);
  }
});

app.get('/healthcheck', async (req, res, next) => {
  try {
    let returnjson = {
      statusCode: 200,
      body: {
        message: `success. in Regions: ${process.env.AWS_REGION}`,
        text: '_AOKA_',
      },
      isBase64Encoded: false,
    };
    res.json(returnjson);
  } catch (error) {
    return next(error);
  }
});