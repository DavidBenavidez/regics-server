import db from '../../database';
import bcrypt from 'bcryptjs';

const salt = bcrypt.genSaltSync(10);

export const getUser = ({ empno }) => {
  return new Promise((resolve, reject) => {
    const queryString = `
        SELECT 
          *
        FROM 
          system_user
        WHERE
          empno = ?
      `;

    db.query(queryString, empno, (err, rows) => {
      if (err) {
        console.log(err);
        return reject(500);
      }

      if (!rows.length) {
        return reject(404);
      }
      return resolve(rows[0]);
    });
  });
};

export const addUser = ({ name, username, password, status }) => {
  return new Promise((resolve, reject) => {
    const queryString = `
            INSERT INTO
              system_user
            VALUES
              (DEFAULT, ?, ?, ?, 0, "faculty", ?, 0, 1)
        `; // DEFAULT works only if empno is AUTO_INCREMENT

    const values = [name, username, password, status];

    db.query(queryString, values, (err, results) => {
      if (err) {
        console.log(err);
        return reject(500);
      }

      return resolve(results.insertId);
    });
  });
};

export const removeUser = ({ empno }) => {
  return new Promise((resolve, reject) => {
    const queryString = `
        DELETE 
          FROM system_user
        WHERE 
          empno = ?
      `;

    db.query(queryString, empno, (err, results) => {
      if (err) {
        console.log(err);
        return reject(500);
      }

      if (!results.affectedRows) {
        return reject(404);
      }
      return resolve(empno);
    });
  });
};

export const addUser = ({
  name,
  username,
  email,
  password,
  confirm_password,
  status_id,
  system_position,
  status,
  teaching_load,
  is_adviser
}) => {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, salt, function(err, hash) {
      const queryString = `
              INSERT INTO system_user VALUES (DEFAULT, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `;
      const values = [
        name,
        username,
        email,
        hash,
        status_id,
        system_position,
        status,
        teaching_load,
        is_adviser
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

export const editUser = ({
  empno,
  name,
  username,
  email,
  password,
  confirm_password,
  status_id,
  system_position,
  status,
  teaching_load,
  is_adviser
}) => {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, salt, function(err, hash) {
      const queryString = `
        UPDATE system_user 
        SET 
        name = ?, 
        username = ?, 
        email = ?, 
        password = ?, 
        status_id = ?, 
        system_position = ?, 
        status = ?, 
        teaching_load = ?, 
        is_adviser = ? 
        WHERE 
        empno = ?`;

      const values = [
        name,
        username,
        email,
        hash,
        status_id,
        system_position,
        status,
        teaching_load,
        is_adviser,
        empno
      ];

      db.query(queryString, values, (err, res) => {
        if (err) {
          console.log(err);
          return reject(500);
        }

        if (!res.affectedRows) {
          return reject(404);
        }

        return resolve();
      });
    });
  });
};
