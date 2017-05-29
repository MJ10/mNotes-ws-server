const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');

const app = express();
const expressWs = require('express-ws')(app);

const auth = require('./routes/auth');
const config = require('./config/db');

mongoose.connect(config.database);
mongoose.connection.on('connected', () => {
  console.log('connected to database');
});

mongoose.connection.on('error', (err) => {
  console.log('Error connecting to database :'+ err);
});

// const server = http.createServer(app);
// const wss = new WebSocket.Server({clientTracking: true ,server});

app.set('port', process.env.PORT || 3000);

app.use(cors());

app.use(bodyParser.json());

app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

app.use('/auth', auth);
app.get('/', (req, resp) => {
  resp.send("Invalid Route");
});

app.listen(app.get('port'), () => {
  console.log("Server started on port: " + app.get('port'));
});
