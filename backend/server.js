const express = require('express');
const port = 8081;
const cors = require('cors');
const app = express();
const index = require('./routes/index');
const init = require('./public/controllers/init');
const authentication = require('./public/controllers/authentication');
const recover = require('./public/controllers/recovery');
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(cors())

app.use('/app', index);
app.post('/init', init.createDatabase);
app.post('/auth', authentication.authentication);
app.post('/recover', recover.recover)


app.get('/check', authentication.check);

app.listen(port, () => console.log(`Server running on port ${port}`))