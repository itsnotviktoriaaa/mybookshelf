let express = require('express');

let app = express();

app.use(express.static(__dirname + '/dist/frontend/'));

app.get('/*', (req, resp) => {
  resp.sendFile(__dirname + '/dist/frontend/index.html');
});

app.listen(process.env.PORT || 8080);
