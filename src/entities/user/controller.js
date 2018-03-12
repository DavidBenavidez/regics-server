import db from '../../database';

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
  status_id,
  system_position,
  status,
  teaching_load,
  is_adviser
}) => {
  return new Promise((resolve, reject) => {
    const queryString = `
      INSERT INTO
        system_user
      VALUES
        (DEFAULT,?,?,?,?,?,?,?,?,?)
      `;
    const values = [
      name,
      username,
      email,
      password,
      status_id,
      system_position,
      status,
      teaching_load,
      is_adviser
    ];
    db.query(queryString, values, (err, rows) => {
      if (err) {
        console.log(err);
        return reject(500);
      }
      return resolve(rows.insertId);
    });
  });
};
