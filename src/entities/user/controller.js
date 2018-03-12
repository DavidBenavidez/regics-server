import db from '../../database';

export const getAllUsers = () => {
  return new Promise((resolve, reject) => {
    const queryString = `
        SELECT *
        FROM system_user
      `;

    db.query(queryString, (err, rows) => {
      if (err) {
        console.log(err);
        return reject(500);
      }
      return resolve(rows);
    });
  });
};

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
