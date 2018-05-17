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
  status
}) => {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, salt, function(err, hash) {
      const queryString = `
                CALL addUser(?, ?, ?, ?, ?, ?)
        `;
      const values = [
        name,
        username.toLowerCase(),
        email,
        hash,
        system_position,
        status
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
export const checkUser = ({ username }) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT * FROM system_user WHERE BINARY username = ?;
    `;
    if (username) {
      db.query(query, username.toLowerCase(), (err, res) => {
        if (err) {
          console.log(err.message);
          return reject(500);
        }

        res = res[0];

        if (!res) return reject(404);

        return resolve();
      });
    } else {
      return reject(404);
    }
  });
};

export const checkExists = ({ username }) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT * FROM system_user WHERE BINARY username = ?;
    `;
    if (username) {
      db.query(query, username.toLowerCase(), (err, res) => {
        if (err) {
          console.log(err.message);
          return reject(500);
        }

        res = res[0];

        if (res) return reject(405);

        return resolve();
      });
    } else {
      return reject(404);
    }
  });
};

export const checkEmail = ({ email }) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT * FROM system_user WHERE email = ?
    `;

    db.query(query, email, (err, res) => {
      if (err) {
        console.log(err.message);
        return reject(500);
      }

      if (res.length) return reject(406);

      return resolve();
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
        WHERE BINARY
          username = ?
      `;
    db.query(queryString, username.toLowerCase(), (err, rows) => {
      if (err) {
        console.log(err);
        return reject(500);
      }

      if (!rows.length) {
        return reject(404);
      }

      bcrypt.compare(password, rows[0].password, (error, isMatch) => {
        if (error) return reject(500);
        else if (!isMatch) return reject(404);
        // else if (rows[0].approved === 'false') return reject(405);
        return resolve(rows[0]);
      });
    });
  });
};

export const editUserFirstTime = empno => {
  return new Promise((resolve, reject) => {
    const queryString = `UPDATE system_user SET firstLogin='false' WHERE empno = ?`;

    db.query(queryString, empno, (err, res) => {
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
};

export const editUserApproved = (session_user, empno) => {
  return new Promise((resolve, reject) => {
    const queryString = `CALL approveUser(?,?)`;
    // console.log(session_user, empno);
    const values = [session_user, empno];
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
};
