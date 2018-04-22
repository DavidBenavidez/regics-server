import mysql from 'mysql';

const db = mysql.createConnection({
  host: 'localhost',
  user: 'regicsserver',
  password: 'regicsserver',
  db: 'regicsserver'
});

db.on('ready', () => console.log('Database is connected')).on('error', err => {
  console.log('Error in connecting to database');
  console.log(err.message);
});

db.connect(err => {
  if (err) {
    console.log('Error in connecting to database');
    console.log(err.message);
  } else {
    console.log('Success in connecting to database');
  }
});

db.query('USE regicsserver');

export default db;
