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
        TIME_FORMAT(course_time_start, '%h:%i %p') AS course_time_start,
        TIME_FORMAT(course_time_end, '%h:%i %p') AS course_time_end,
        ROUND(minutes/30,1) AS course_hours,
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
        course_no = ?
        `;

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

//get course by empno
export const getCoursesByEmpno = ({ empno }) => {
  return new Promise((resolve, reject) => {
    const queryString = `
      SELECT
        *
      FROM 
        course
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

      return resolve(rows);
    });
  });
};

// Remove Course
export const removeCourse = (session_user, { course_no }) => {
  return new Promise((resolve, reject) => {
    const queryString = `CALL deleteCourse(?, ?)`;

    const values = [session_user, course_no];

    db.query(queryString, values, (err, results) => {
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

export const addCourse = (
  session_user,
  {
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
    course_status,
    day1,
    day2,
    reason,
    room_no,
    empno
  }
) => {
  return new Promise((resolve, reject) => {
    const queryString = `
    CALL addCourse(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    var totalCourseCredit;
    // Compute course credit
    if (course_name == 'CMSC 190-1') {
      if (sais_class_count * (0.5 / 3) > 3) {
        totalCourseCredit = 3;
      } else {
        totalCourseCredit = sais_class_count * (0.5 / 3);
      }
    } else if (course_name == 'CMSC 190-2') {
      if (2.0 * sais_class_count * (0.5 / 3) > 3) {
        totalCourseCredit = 3;
      } else {
        totalCourseCredit = 2.0 * sais_class_count * (0.5 / 3);
      }
    } else if (is_lab == 'false') {
      console.log('not lab');
      if (sais_class_count <= 40) {
        totalCourseCredit = 2;
      } else {
        totalCourseCredit = 2.0 * ((sais_class_count - 40) / 120 + 1);
      }
    } else {
      totalCourseCredit = 1.5;
    }

    const values = [
      session_user,
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
      totalCourseCredit,
      is_lab,
      course_status,
      day1,
      day2,
      reason,
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
};

export const editCourse = (
  session_user,
  {
    course_no,
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
    course_credit,
    is_lab,
    course_status,
    day1,
    day2,
    reason,
    room_no,
    empno
  }
) => {
  return new Promise((resolve, reject) => {
    const queryString = `
      CALL editCourse(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)  
    `;
    var totalCourseCredit;
    // Compute course credit
    if (course_name == 'CMSC 190-1') {
      if (sais_class_count * (0.5 / 3) > 3) {
        totalCourseCredit = 3;
      } else {
        totalCourseCredit = sais_class_count * (0.5 / 3);
      }
    } else if (course_name == 'CMSC 190-2') {
      if (2.0 * sais_class_count * (0.5 / 3) > 3) {
        totalCourseCredit = 3;
      } else {
        totalCourseCredit = 2.0 * sais_class_count * (0.5 / 3);
      }
    } else if (is_lab == 'false') {
      console.log('not lab');
      if (sais_class_count <= 40) {
        totalCourseCredit = 2;
      } else {
        totalCourseCredit = 2.0 * ((sais_class_count - 40) / 120 + 1);
      }
    } else {
      totalCourseCredit = 1.5;
    }

    const values = [
      session_user,
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
      totalCourseCredit,
      is_lab,
      course_status,
      day1,
      day2,
      reason,
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
};

export const swapProf = (
  session_user,
  { course_no, empno, swap_course_no, swap_empno }
) => {
  return new Promise((resolve, reject) => {
    const queryString = `
      CALL swapProf(?,?,?,?,?)  
    `;

    const values = [session_user, course_no, empno, swap_course_no, swap_empno];
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
