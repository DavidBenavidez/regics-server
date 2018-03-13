import db from '../../database';

// export const getAllUsers = () => {
//   return new Promise((resolve, reject) => {
//     const queryString = `
//         SELECT *
//         FROM system_user
//       `;

//     db.query(queryString, (err, rows) => {
//       if (err) {
//         console.log(err);
//         return reject(500);
//       }
//       return resolve(rows);
//     });
//   });
// };

IN empno INT,
  IN prof_name VARCHAR(256),
  IN course VARCHAR(256),
  IN section VARCHAR(256),
  IN time TIME,
  IN day DAY,
  IN room INT,
  IN class_size INT,
  IN units FLOAT,
  IN teaching_load FLOAT,
  IN total_teaching_load FLOAT


export const add_teaching_load = ({ empno, prof_name, course, section, time, day, room, class_size, units, teaching_load, total_teaching_load  }) => {
  return new Promise((resolve, reject) => {
    const query = `
      CALL add_teaching_load(?, ?, ?,?, ?, ?,?, ?, ?,?, ?)
    `;

    const values = [uempno, prof_name, course, section, time, day, room, class_size, units, teaching_load, total_teaching_loade];
    db.query(query, values, (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return reject(400);
        }
        console.log(err.message);
        return reject(500);
      }

      return resolve(result[0][0]);
    });
  });
};


export const update_teaching_load = ({ empno, prof_name, course, section, time, day, room, class_size, units, teaching_load, total_teaching_load  }) => {
  return new Promise((resolve, reject) => {
    const query = `
      CALL update_teaching_load(?, ?, ?,?, ?, ?,?, ?, ?,?, ?)
    `;

    const values = [uempno, prof_name, course, section, time, day, room, class_size, units, teaching_load, total_teaching_loade];
    db.query(query, values, (err, result) => {
      if (err) {
        if (!results.affectedRows) {
        return reject(404);
      }
        console.log(err.message);
        return reject(500);
      }

      return resolve(result[0][0]);
    });
  });
};

export const getUser = ({ empno }) => {
  return new Promise((resolve, reject) => {
    const queryString = `
        SELECT 
          *
        FROM 
          prof_teaching_load
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

export const deleteEmployee = ({ empno }) => {
  return new Promise((resolve, reject) => {
    const queryString = `
        CALL deleteEmployee(?)
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
