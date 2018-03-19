import db from '../../database';
import bcrypt from 'bcryptjs';
import fs from 'fs';

// const Json2csvParser = require('json2csv').Parser;
// const ws = fs.createWriteStream('./mycsv');
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

// Get teaching load of professors
export const getAllTeachingLoads = () => {
  return new Promise((resolve, reject) => {
    const queryString = `select * from system_user;`;
    const q1 = `select * from course`;
    var allSub = [];

    db.query(q1, (err, rows1) => {
      for (var a = 0; a < rows1.length; a++) {
        allSub.push(rows1[a]);
      }
      if (err) {
        console.log(err);
        return reject(500);
      }
    });

    db.query(queryString, (err, rows) => {
      var subjects = [];
      var professor = [];
      for (var i = 0; i < rows.length; i++) {
        for (var j = 0; j < allSub.length; j++) {
          if (rows[i].empno == allSub[j].empno) {
            subjects.push({
              course_name: allSub[j].course_name,
              course_no: allSub[j].course_no,
              section: allSub[j].section,
              class_size: allSub[j].class_size,
              sais_class_count: allSub[j].sais_class_count,
              sais_waitlisted_count: allSub[j].sais_waitlisted_count,
              actual_count: allSub[j].actual_count,
              course_date: allSub[j].course_date,
              minutes: allSub[j].minutes,
              units: allSub[j].units,
              empno: allSub[j].room_no
            });
          }
        }

        professor.push({
          name: rows[i].name,
          teaching_load: rows[i].teaching_load,
          subjects: subjects
        });
        subjects = [];
      }

      if (err) {
        console.log(err);
        return reject(500);
      }
      return resolve(professor);
    });
  });
};

//Retrieve adviser and advisee per classification
export const getAllAdviseeClassification = () => {
  return new Promise((resolve, reject) => {
    const queryString = `
        SELECT
          a.name, COUNT(CASE classification WHEN 'freshman' THEN 1 ELSE null END) AS "freshman", 
          COUNT(CASE classification WHEN 'sophomore' THEN 1 ELSE null END) AS "sophomore", 
          COUNT(CASE classification WHEN 'junior' THEN 1 ELSE null END) AS "junior", 
          COUNT(CASE classification WHEN 'senior' THEN 1 ELSE null END) AS "senior", 
          COUNT(student_no) AS "total" 
        FROM
          system_user a
        JOIN
          student b
        ON
          a.empno = b.adviser
        GROUP BY
          empno
        ORDER BY
          a.name
      `;

    db.query(queryString, (err, rows) => {
      if (err) {
        console.log(err);
        return reject(500);
      }
      if (!rows.length) {
        return reject(404);
      }
      return resolve(rows);
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
  system_position,
  status,
  teaching_load,
  is_adviser
}) => {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, salt, function(err, hash) {
      const queryString = `
              INSERT INTO system_user VALUES (DEFAULT, ?, ?, ?, ?, ?, ?, ?, ?)
          `;
      const values = [
        name,
        username,
        email,
        hash,
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

// List all advisers and the students assigned to them
export const getAdvisersAndAdvisees = () => {
  return new Promise((resolve, reject) => {
    const queryString = `SELECT b.name AS Advisers, GROUP_CONCAT(a.name SEPARATOR ', ') 
    AS ADVISEES FROM (select student_no, name, adviser from student) 
    AS a JOIN system_user AS b  
    WHERE b.empno = a.adviser GROUP BY b.empno`;

    db.query(queryString, (err, rows) => {
      if (err) {
        console.log(err);
        return reject(500);
      }

      if (!rows.length) {
        return reject(404);
      }

      return resolve(rows);
    });
  });
};

// export const getProfInfo = ({ empno }) => {
//   return new Promise((resolve, reject) => {
//     const queryString = `
//         SELECT name, system_position, status, teaching_load FROM system_user WHERE empno = ?`;

//     db.query(queryString, empno, (err, rows) => {
//       if (err) {
//         console.log(err);
//         return reject(500);
//       }
//       if (!rows.length) {
//         return reject(404);
//       }
//       return resolve(rows);
//     });
//   });
// };
