require('dotenv').config();
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
// const passport = require('./config/passport');

const cors = require('cors');
const app = express();

app.use(cors());

app.use(
  session({
    secret: process.env.SESSION_TOKEN_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

// app.use(passport.initialize());
// app.use(passport.session());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const db = require('./models');
db.client.sync();

const router = require('./routes');
app.use(cookieParser());
app.use(router);

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
