import db from '../../database';
import bcrypt from 'bcryptjs';

const salt = bcrypt.genSaltSync(10);

export const getAllCourses = () => {
  return new Promise((resolve, reject) => {
    const queryString = `
        SELECT 
        course_no,
        course_name,
        section,
        class_size,
        sais_class_count,
        sais_waitlisted_count,
        actual_count,
        date_format(course_date, "%W") AS course_date,
        TIME_FORMAT(course_time_start, '%h:%i%p') AS course_time_start,
        TIME_FORMAT(course_time_end, '%h:%i%p') AS course_time_end,
        minutes/30 AS course_hours,
        units,
        is_lab,
        room_no,
        empno
        FROM 
          course
        ORDER BY
          course_name
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

export const getCourse = ({ course_no }) => {
  return new Promise((resolve, reject) => {
    const queryString = `
      SELECT *
      FROM 
        course
      WHERE 
        course_no = ?`;

    db.query(queryString, course_no, (err, rows) => {
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

// Remove Course
export const removeCourse = ({ course_no }) => {
  return new Promise((resolve, reject) => {
    const queryString = `
        DELETE 
          FROM course
        WHERE 
          course_no = ?
      `;
    db.query(queryString, course_no, (err, results) => {
      if (err) {
        console.log(err);
        return reject(500);
      }

      if (!results.affectedRows) {
        return reject(404);
      }
      return resolve(course_no);
    });
  });
};

export const addCourse = ({
  course_name,
  section,
  class_size,
  sais_class_count,
  sais_waitlisted_count,
  actual_count,
  course_date,
  course_time_start,
  course_time_end,
  minutes,
  units,
  is_lab,
  room_no,
  empno
}) => {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, salt, function(err, hash) {
      const queryString = `
              INSERT INTO course VALUES (DEFAULT, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `;
      const values = [
        course_name,
        section,
        class_size,
        sais_class_count,
        sais_waitlisted_count,
        actual_count,
        course_date,
        course_time,
        minutes,
        units,
        is_lab,
        room_no,
        empno
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

export const editCourse = ({
  course_no,
  course_name,
  section,
  class_size,
  sais_class_count,
  sais_waitlisted_count,
  actual_count,
  course_date,
  course_time,
  minutes,
  units,
  is_lab,
  room_no,
  empno
}) => {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, salt, function(err, hash) {
      const queryString = `
        UPDATE system_user 
        SET 
          course_name = ?,
          section = ?,
          class_size = ?,
          sais_class_count = ?,
          sais_waitlisted_count = ?,
          actual_count = ?,
          course_date = ?,
          course_time = ?,
          minutes = ?,
          units = ?,
          is_lab = ?,
          room_no = ?,
          empno = ? 
        WHERE 
          course_no = ?`;

      const values = [
        course_name,
        section,
        class_size,
        sais_class_count,
        sais_waitlisted_count,
        actual_count,
        course_date,
        course_time,
        minutes,
        units,
        is_lab,
        room_no,
        empno,
        course_no
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
