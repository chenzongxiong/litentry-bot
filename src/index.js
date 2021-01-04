const sdk = require('matrix-js-sdk');
const bodyParser = require('body-parser');
const express = require('express');
const config = require('./config');
console.log(config);
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/', function (req, res) {
  res.send('Hello World');
})

app.post('/notify', function (req, res) {
  if (req.headers.authorization != config.basicAuthorization) {
    console.log('Error Authorization');
    return res.send('Error');
  }

  const { roomId, accessToken, userId, homeServerUrl } = config;
  const client = sdk.createClient({
    baseUrl: homeServerUrl,
    accessToken: accessToken,
    userId: userId,
  });
  console.log(req.body);

  const body = `<h2>${req.body.title}</h2><a href=\"${req.body.ruleUrl}\">${req.body.ruleName}</a><p>${req.body.message}</p>`;

  const content = {
    body: "LitentryBot: \n```json\nAlert\n```",
    formatted_body: body,
    format: 'org.matrix.custom.html',
    msgtype: 'm.text',
  };

  client.sendEvent(roomId, 'm.room.message', content, '', (err, res) => {
    if (err) {
      console.log(err);
    } else {
      console.log(res);
    }
  });

  res.send('Ok');
})

const port = 8040;
const server = app.listen(port, function () {
  const host = server.address().address;
  const port = server.address().port;
  console.log(`RiotBot listening at http://${host}:${port}`);
})
