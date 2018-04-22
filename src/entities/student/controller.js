import db from '../../database';

// R E T R I E V E
//gets all students
export const getAllStudents = () => {
  return new Promise((resolve, reject) => {
    const queryString = `
        SELECT
          a.student_no, a.name, a.status, a.student_curriculum, a.classification, b.name AS adviser, b.empno
        FROM
          student a, system_user b
        WHERE
          a.adviser = b.empno
        ORDER BY
          FIELD(a.status, 'enrolled', 'dropped', 'loa', 'dismissed'),
          a.name
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

//get student by student number
export const getStudentByStudNo = ({ student_no }) => {
  return new Promise((resolve, reject) => {
    const queryString = `
        SELECT * FROM student WHERE student_no = ?`;

    db.query(queryString, student_no, (err, rows) => {
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

//get student by name
export const getStudentByName = ({ name }) => {
  return new Promise((resolve, reject) => {
    const queryString = `
        SELECT * FROM student WHERE name = ?`;
    db.query(queryString, name, (err, rows) => {
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

//get student by status
export const getStudentByStatus = ({ status }) => {
  return new Promise((resolve, reject) => {
    const queryString = `
        SELECT * FROM student WHERE status = ?`;

    db.query(queryString, status, (err, rows) => {
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

//get all current advisers of students
export const getCurrentAdvisers = () => {
  return new Promise((resolve, reject) => {
    const queryString = `SELECT name, adviser FROM student`;

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

//Retrieve all advisers of a student based on student number
export const getAllAdvisersByStudNo = ({ student_no }) => {
  return new Promise((resolve, reject) => {
    var data = [];
    const queryString = `
    SELECT
      id,
      name,
      status,
      teaching_load
    FROM
      student_advisers_list
    NATURAL JOIN
      system_user
    WHERE
      student_no = ?
    ORDER BY
      id DESC`;

    db.query(queryString, student_no, (err, rows) => {
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

// retrieve an array of names of advisers
export const getAllAdviserNames = student_no => {
  return new Promise((resolve, reject) => {
    var data = [];
    const queryString = `
      SELECT
        id,
        name,
        status,
        teaching_load
      FROM
        student_advisers_list
      NATURAL JOIN
        system_user
      WHERE
        student_no = ?`;

    db.query(queryString, student_no, (err, rows) => {
      if (err) {
        console.log(err);
        return reject(500);
      }
      if (!rows.length) {
        return resolve(data);
      }

      for (var i = 0; i < rows.length; i++) {
        data.push(rows[i].name);
      }

      return resolve(data);
    });
  });
};

// U P D A T E
//update student's adviser and add to adviser history
export const updateStudentAdviser = (session_user, { adviser, student_no }) => {
  return new Promise((resolve, reject) => {
    const queryString = `CALL updateStudentAdviser(?,?,?)`;

    const values = [session_user, student_no, adviser];

    db.query(queryString, values, (err, rows) => {
      if (err) {
        console.log(err);
        return reject(500);
      }
      return resolve();
    });
  });
};

// Update student info
export const updateStudent = (
  session_user,
  { student_no, name, status, student_curriculum, classification }
) => {
  return new Promise((resolve, reject) => {
    const queryString = `CALL updateStudent(?,?,?,?,?,?)`;

    const values = [
      session_user,
      name,
      status,
      classification,
      student_curriculum,
      student_no
    ];

    db.query(queryString, values, (err, rows) => {
      if (err) {
        console.log(err);
        return reject(500);
      }
      return resolve();
    });
  });
};

//removes a student
export const removeStudent = (session_user, { student_no }) => {
  return new Promise((resolve, reject) => {
    const queryString = `
        CALL removeStudent(?, ?)
      `;

    const removeFromAdvisers = `CALL removeStudentFromAdvisersList(?)`;
    const values = [session_user, student_no];

    db.query(removeFromAdvisers, student_no, (err, results) => {
      if (err) {
        console.log(err);
        return reject(500);
      }

      if (!results.affectedRows) {
        console.log('Not in advisers List');
      }
    });

    db.query(queryString, values, (err, results) => {
      if (err) {
        console.log(err);
        return reject(500);
      }

      if (!results.affectedRows) {
        return reject(404);
      }

      return resolve(student_no);
    });
  });
};

export const addStudent = (
  session_user,
  { name, student_no, status, student_curriculum, classification, adviser }
) => {
  return new Promise((resolve, reject) => {
    const queryString = `CALL addStudent(? ,?, ?, ?, ?, ?, ?)`;
    const queryString2 = `CALL updateStudentAdviser(?, ?, ?)`;

    const values = [
      session_user,
      student_no,
      name,
      student_curriculum,
      status,
      classification,
      adviser
    ];

    db.query(queryString, values, (err, results) => {
      if (err) {
        console.log(err);
        return reject(500);
      }

      const values2 = [session_user, student_no, adviser];
      db.query(queryString2, values2, (err2, results2) => {
        if (err) {
          console.log(err);
          return reject(500);
        }
      });
      return resolve(results.insertId);
    });
  });
};
