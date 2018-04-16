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

// Get teaching load of professors
export const getAllTeachingLoads = () => {
  return new Promise((resolve, reject) => {
    const queryString = `SELECT * FROM system_user ORDER BY name;`;
    const q1 = `SELECT * FROM course ORDER BY course_name`;
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
      var totalTeachingLoad;
      var totalCourseCredit;
      for (var i = 0; i < rows.length; i++) {
        totalTeachingLoad = 0;
        for (var j = 0; j < allSub.length; j++) {
          totalCourseCredit = 0;

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
              course_credit: allSub[j].course_credit,
              empno: allSub[j].room_no
            });
            totalTeachingLoad += allSub[j].course_credit;
          }
        }

        professor.push({
          name: rows[i].name,
          teaching_load: totalTeachingLoad,
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

// Get teaching load of professor
export const getTeachingLoad = ({ empno }) => {
  return new Promise((resolve, reject) => {
    const queryString = `
      SELECT
        *
      FROM
        course
      NATURAL JOIN
        room
      WHERE
        course_status = "addition"
      AND
        empno = ?
      ORDER BY
        course_name,
        section,
        FIELD(is_lab, 'false', 'true')
    `;

    db.query(queryString, empno, (err, rows) => {
      if (err) {
        console.log(err);
        return reject(500);
      }
      return resolve(rows);
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
      var f = 0,
        so = 0,
        j = 0,
        se = 0,
        t = 0;
      for (var i = 0; i < rows.length; i++) {
        if (rows[i].freshman == 1) {
          f++;
          t++;
        }
        if (rows[i].sophomore == 1) {
          so++;
          t++;
        }
        if (rows[i].junior == 1) {
          j++;
          t++;
        }
        if (rows[i].senior == 1) {
          se++;
          t++;
        }
      }
      rows.push({
        name: 'total',
        freshman: f,
        sophomore: so,
        junior: j,
        senior: se,
        total: t
      });
      return resolve(rows);
    });
  });
};

export const removeUser = (session_user, { empno }) => {
  return new Promise((resolve, reject) => {
    const queryString = `CALL deleteUser(?, ?)`;

    const values = [session_user, empno];

    db.query(queryString, values, (err, results) => {
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

export const getUsers = () => {
  return new Promise((resolve, reject) => {
    const queryString = `SELECT empno, name FROM system_user ORDER BY name`;

    db.query(queryString, (err, results) => {
      if (err) {
        console.log(err);
        return reject(500);
      }
      if (!results.length) {
        return reject(404);
      }
      return resolve(results);
    });
  });
};

export const getActiveUsers = () => {
  return new Promise((resolve, reject) => {
    const queryString = `SELECT empno, name FROM system_user WHERE status = 'active' ORDER BY empno`;

    db.query(queryString, (err, results) => {
      if (err) {
        console.log(err);
        return reject(500);
      }
      if (!results.length) {
        return reject(404);
      }
      return resolve(results);
    });
  });
};

export const editUser = (
  session_user,
  {
    empno,
    name,
    username,
    email,
    password,
    confirm_password,
    system_position,
    status,
    teaching_load
  }
) => {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, salt, function(err, hash) {
      const queryString = `
        CALL editUser(?,?,?,?,?,?,?,?,?);
      `;

      const values = [
        session_user,
        name,
        username,
        email,
        hash,
        system_position,
        status,
        teaching_load,
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

export const deleteAdviserAdvisee = (session_user, { id }) => {
  return new Promise((resolve, reject) => {
    const queryString = `CALL deleteAdviserAdvisee(?, ?)`;
    const values = [session_user, id];
    db.query(queryString, values, (err, results) => {
      if (err) {
        console.log(err);
        return reject(500);
      }
      if (!results.affectedRows) {
        return reject(404);
      }
      return resolve(id);
    });
  });
};

// stdnt num, empno,
//

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
