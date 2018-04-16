import db from '../../database';
import bcrypt from 'bcryptjs';

const salt = bcrypt.genSaltSync(10);

function convertTime(time) {
  var finalTime = '';

  if (time.search('PM') != -1) {
    time = time.replace('PM', '');
    time = time.split(':');
    if (time[0] == 12) {
      finalTime += time[0];
    } else {
      finalTime += +time[0] + +12;
    }
    finalTime += ':' + time[1] + ':00';
  } else if (time.search('AM') != -1) {
    time = time.replace('AM', '');
    time = time.split(':');
    if (time[0] == '12') time[0] = '0';
    finalTime += time[0];
    finalTime += ':' + time[1] + ':00';
  }
  return finalTime;
}

export const getAllCourses = () => {
  return new Promise((resolve, reject) => {
    const queryString = `
      SELECT 
        course_no,
        UPPER(course_name) as course_name,
        UPPER(section) as section,
        class_size,
        sais_class_count,
        sais_waitlisted_count,
        actual_count,
        TIME_FORMAT(course_time_start, '%h:%i %p') AS course_time_start,
        TIME_FORMAT(course_time_end, '%h:%i %p') AS course_time_end,
        units,
        is_lab,
        room_name,
        day1,
        day2,
        hours,
        name,
        reason,
        course_status
        FROM
        course
      NATURAL JOIN
        system_user
      NATURAL JOIN
        room
      ORDER BY
        FIELD(course_status, 'addition', 'approved', 'petitioned', 'dissolved'),
        course_name,
        section,
        FIELD(is_lab, 'false', 'true')
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

export const getCourse = ({ course_no }) => {
  return new Promise((resolve, reject) => {
    const queryString = `
      SELECT 
        course_no,
        UPPER(course_name) as course_name,
        UPPER(section) as section,
        class_size,
        sais_class_count,
        sais_waitlisted_count,
        actual_count,
        units,
        is_lab,
        room_name,
        day1,
        day2,
        course_time_start,
        course_time_end,
        hours,
        name,
        reason,
        course_status
        FROM
        course
      NATURAL JOIN
        system_user
      NATURAL JOIN
        room
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
    course_time_start,
    course_time_end,
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

    course_time_start = convertTime(course_time_start);
    course_time_end = convertTime(course_time_end);
    const queryString = `
    CALL addCourse(?,?,?,?,?,?,?,?,?, time_to_sec(timediff('${course_time_end}','${course_time_start}'))/3600,?,?,?,?,?,?,?,?,?)
    `;
    const values = [
      session_user,
      course_name,
      section,
      class_size,
      sais_class_count,
      sais_waitlisted_count,
      actual_count,
      course_time_start,
      course_time_end,
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
    //For room conflict check
    const queryString2 = `SELECT course_name FROM course WHERE room_no = ? AND day1 = ? AND (course_time_start = ? OR (course_time_start BETWEEN ? AND ?) )`;
    const values2 = [
      room_no,
      day1,
      course_time_start,
      course_time_start,
      course_time_end
    ];
    db.query(queryString2, values2, (err2, results2) => {
      if (err2) {
        console.log(err2);
        return reject(500);
      } else if (results2.length > 0) {
        //if query2 returns rows, error.
        console.log('In conflict with ' + results2[0].course_name);
        return reject(405);
      } else {
        db.query(queryString, values, (err, results) => {
          if (err) {
            console.log(err);
            return reject(500);
          }
          return resolve(results.insertId);
        });
      }
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
    course_time_start,
    course_time_end,
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

    course_time_start = convertTime(course_time_start);
    course_time_end = convertTime(course_time_end);

    const queryString = `
      CALL editCourse(?, ?, ?, ?, ?, ?, ?, ?, ?, time_to_sec(timediff('${course_time_end}','${course_time_start}'))/3600, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)  
    `;

    const values = [
      session_user,
      course_name,
      section,
      class_size,
      sais_class_count,
      sais_waitlisted_count,
      actual_count,
      course_time_start,
      course_time_end,
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

    //For room conflict check
    const queryString2 = `SELECT course_name FROM course WHERE room_no = ? AND day1 = ? AND (course_time_start = ? OR (course_time_start BETWEEN ? AND ?) )`;
    const values2 = [
      room_no,
      day1,
      course_time_start,
      course_time_start,
      course_time_end
    ];
    db.query(queryString2, values2, (err2, results2) => {
      if (err2) {
        console.log(err2);
        return reject(500);
      } else if (results2.length > 0) {
        //if query2 returns rows, error.
        console.log('In conflict with ' + results2[0].course_name);
        return reject(405);
      } else {
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
      }
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

export const getAllRooms = () => {
  return new Promise((resolve, reject) => {
    const queryString = `
        SELECT 
          *
        FROM 
          room
        ORDER BY
          room_name
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
