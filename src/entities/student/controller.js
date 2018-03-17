import db from '../../database';

// R E T R I E V E
//gets all students
export const getAllStudents = () => {
  return new Promise((resolve, reject) => {
    const queryString = `
        SELECT *
        FROM student
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

//get student by classification
export const getStudentByClassification = ({ classification }) => {
  return new Promise((resolve, reject) => {
    const queryString = `
        SELECT * FROM student WHERE classification = ?`;

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

//Retrieve adviser and advisee per classification
export const getAllAdviseeClassification = ({ student_no }) => {
  return new Promise((resolve, reject) => {
    const queryString = `
        select a.name, count(case classification when 'Freshman' then 1 else null end) as "Freshmen", 
        count(case classification when 'sophomore' then 1 else null end) as "Sophomore", 
        count(case classification when 'junior' then 1 else null end) as "Junior", 
        count(case classification when 'senior' then 1 else null end) as "Senior", 
        count(student_no) as "Total" 
        from system_user a join student b on a.empno = b.adviser group by empno
      `;

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

//get all current advisers of students
export const getCurrentAdvisers = ({}) => {
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
    const queryString = `
    SELECT 
      b.student_no, 
      b.name, 
      GROUP_CONCAT(a.name SEPARATOR ', ') AS Advisers 
    FROM (
      SELECT name, student_no AS student_no 
      FROM student_advisers_list 
      JOIN system_user USING(empno)
    ) 
    AS a JOIN student AS b WHERE b.student_no = ? `;

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

// U P D A T E
//update student's adviser and add to adviser history
export const updateStudentAdviser = ({ adviser, student_no }) => {
  return new Promise((resolve, reject) => {
    const queryString = `UPDATE student SET adviser = ? WHERE student_no = ?; 
    INSERT INTO student_advisers_list(student_no, empno) VALUES (?, ?)`;

    const values = [adviser, student_no, student_no, adviser];

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
export const removeStudent = ({ student_no }) => {
  return new Promise((resolve, reject) => {
    const queryString = `
        DELETE 
          FROM student
        WHERE 
          student_no = ?
      `;

    db.query(queryString, student_no, (err, results) => {
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
