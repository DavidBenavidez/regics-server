import db from '../../database';
import bcrypt from 'bcryptjs';

const salt = bcrypt.genSaltSync(10);

export const addUser = ({
  name,
  username,
  email,
  password,
  confirm_password,
  system_position,
  status,
  teaching_load
}) => {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, salt, function(err, hash) {
      const queryString = `
                CALL addUser(?, ?, ?, ?, ?, ?, ?)
        `;
      const values = [
        name,
        username,
        email,
        hash,
        system_position,
        status,
        teaching_load
      ];
      db.query(queryString, values, (err, results) => {
        if (err) {
          console.log(err);
          return reject(500);
        }
        return resolve(results.insertId);
      });
    });
  });
};

export const login = ({ username, password }) => {
  return new Promise((resolve, reject) => {
    const queryString = `
        SELECT 
          *
        FROM
          system_user
        WHERE
          username = ?
      `;
    db.query(queryString, username, (err, rows) => {
      if (err) {
        console.log(err);
        return reject(500);
      }

      if (!rows.length) {
        return reject(404);
      }

      bcrypt.compare(password, rows[0].password, (error, isMatch) => {
        if (error) return reject(500);
        else if (!isMatch) return reject(401);
        return resolve(rows[0]);
      });
    });
  });
};
