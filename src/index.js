import express from 'express';
import bodyParser from 'body-parser';
import logger from 'morgan';
import session from 'express-session';
import store from 'express-mysql-session';
import db from './database';

import router from './router';

const app = express();
const MySQLStore = store(session);
const sessionStore = new MySQLStore({}, db);
const cors = require('cors');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(logger('dev'));
app.use(cors());

app.options('*', cors());

app.use(
  session({
    key: 'regicssystem',
    secret: 'regicssystem',
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false },
    store: sessionStore,
    createDatabaseTable: true,
    checkExpirationInterval: 900000,
    expiration: 86400000
  })
);

app.use(router);

const port = process.env.PORT || 3001;

const server = app.listen(port, () => {
  console.log(`Server is running at port: ${port}`);
});

export default server;
