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
      return resolve(rows[0]);
    });
  });
};

//get all current adviser from student
export const getCurrentAdvisers = ({ student_no }) => {
  return new Promise((resolve, reject) => {
    const queryString = `
        SELECT name, adviser
		FROM student
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

//Retrieve all advisers of a student based on student number
export const getAllAdvisersByStudNo = ({ student_no }) => {
  return new Promise((resolve, reject) => {
    const queryString = `
        SELECT b.student_no, b.name,
		(SELECT 
		name 
		FROM system_user 
		WHERE empno = b.adviser) AS currentAdviser,
		GROUP_CONCAT(a.name SEPARATOR ', ') AS Advisers
		FROM (
		  SELECT name, student AS student_no 
		  FROM student_advisers_list JOIN system_user USING(empno)
		) 
		AS a JOIN student AS b WHERE b.student_no = ?

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

// U P D A T E
//update student's adviser and add to adviser history
export const updateAdviser = ({ adviser, student_no }) => {
  return new Promise((resolve, reject) => {
    const queryString = `UPDATE student SET adviser = ? WHERE student_no = ?; INSERT INTO student_advisers_list(student, empno) VALUES (?, ?);`;
    const values = [adviser, student_no, student_no, adviser];

    db.query(queryString, values, (err, rows) => {
      if (err) {
        console.log(err);
        return reject(500);
      }
      return resolve(rows);
    });
  });
};

//removes a student
/*export const removeUser = ({ empno }) => {
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
*/
