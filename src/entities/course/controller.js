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
            units,
            is_lab,
            room_name,
            room_no,
            day1,
            day2,
            TIME_FORMAT(course_time_start, '%h:%i%p') AS course_time_start,
            TIME_FORMAT(course_time_end, '%h:%i%p') AS course_time_end,
            name,
            empno,
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
        TIME_FORMAT(course_time_start, '%h:%i %p') AS course_time_start,
        TIME_FORMAT(course_time_end, '%h:%i %p') AS course_time_end,
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
    if (course_status == 'dissolved') {
      if (actual_count >= 10) {
        return reject(407);
      }
    }

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
    const queryString2 = `SELECT course_name FROM course WHERE room_no = ? AND ((day1 = ? OR day2 = ?) OR (day1 = ? OR day2 = ?)) AND ((course_time_start >= ? AND course_time_start < ?) OR (course_time_end > ? AND course_time_end <= ?))`;
    const values2 = [
      room_no,
      day1,
      day1,
      day2,
      day2,
      course_time_start,
      course_time_end,
      course_time_start,
      course_time_end
    ];

    var time = [
      empno,
      day1,
      day1,
      day2,
      day2,
      course_time_start,
      course_time_end,
      course_time_start,
      course_time_end
    ];
    const queryString3 = `SELECT * FROM course WHERE empno = ? AND ((day1 = ? OR day2 = ?) OR (day1 = ? OR day2 = ?)) AND ((course_time_start >= ? AND course_time_start < ?) OR (course_time_end > ? AND course_time_end <= ?))`;

    db.query(queryString3, time, (err, results) => {
      if (err) {
        console.log(err);
        return reject(500);
      }
      if (results.length) {
        //not empty, not
        console.log('conflict with prof of subject ' + results[0].course_name);
        return reject(405);
      } else {
        db.query(queryString2, values2, (err2, results2) => {
          if (err2) {
            console.log(err2);
            return reject(500);
          }

          if (results2.length > 0) {
            console.log(
              'Room conflict with subject ' + results2[0].course_name
            );
            return reject(406);
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
    if (course_status === 'dissolved') {
      if (actual_count > 10) {
        return reject(407);
      }
    }
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
    const queryString2 = `SELECT course_name, section FROM course WHERE room_no = ? AND course_no != ? AND ((day1 = ? OR day2 = ?) OR (day1 = ? OR day2 = ?)) AND ((course_time_start >= ? AND course_time_start < ?) OR (course_time_end > ? AND course_time_end <= ?))`;
    const values2 = [
      room_no,
      course_no,
      day1,
      day1,
      day2,
      day2,
      course_time_start,
      course_time_end,
      course_time_start,
      course_time_end
    ];

    var time = [
      empno,
      course_no,
      day1,
      day1,
      day2,
      day2,
      course_time_start,
      course_time_end,
      course_time_start,
      course_time_end
    ];
    const queryString3 = `SELECT course_name, section FROM course WHERE empno = ? AND course_no != ? AND ((day1 = ? OR day2 = ?) OR (day1 = ? OR day2 = ?)) AND ((course_time_start >= ? AND course_time_start < ?) OR (course_time_end > ? AND course_time_end <= ?))`;

    db.query(queryString3, time, (err, results) => {
      if (err) {
        console.log(err);
        return reject(500);
      }
      if (results.length) {
        //not empty, not
        console.log('conflict with prof of subject ' + results[0].course_name);
        return reject(405);
      } else {
        db.query(queryString2, values2, (err2, results2) => {
          if (err2) {
            console.log(err2);
            return reject(500);
          }

          if (results2.length > 0) {
            console.log(
              'Room conflict with subject ' + results2[0].course_name
            );
            return reject(406);
          } else {
            db.query(queryString, values, (err, results) => {
              if (err) {
                console.log(err);
                return reject(500);
              }
              // return resolve(results.insertId);
            });
          }
        });
      }
    });
    const queryString4 = `SELECT * FROM system_user ORDER BY name;`;
    const q1 = `
      SELECT
        course_credit,
        empno
      FROM
        course
      `;

    var allSub = [];

    db.query(q1, (err, rows1) => {
      if (err) {
        console.log(err);
        return reject(500);
      }
      for (var a = 0; a < rows1.length; a++) {
        allSub.push(rows1[a]);
      }
      db.query(queryString4, (err, rows) => {
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
                course_credit: allSub[j].course_credit,
                empno: allSub[j].room_no
              });
              totalTeachingLoad += allSub[j].course_credit;
            }
          }
          professor.push({
            empno: rows[i].empno,
            teaching_load: totalTeachingLoad
          });
          subjects = [];
        }

        if (err) {
          console.log(err);
          return reject(500);
        }
        var newQueryString = `UPDATE system_user SET teaching_load = ? WHERE empno = ?`;
        for (var i = 0; i < professor.length; i++) {
          var newValues = [professor[i].teaching_load, professor[i].empno];
          db.query(newQueryString, newValues, (err, rows) => {
            if (err) {
              console.log(err);
              return reject(500);
            }
          });
        }
        return resolve(professor);
      });
    });
  });
};

export const swapProf = (
  session_user,
  { course_no, empno, swap_course_no, swap_empno }
) => {
  return new Promise((resolve, reject) => {
    const queryString1 = `SELECT * FROM course WHERE course_no = ?`;

    db.query(queryString1, swap_course_no, (err, res1) => {
      if (err) {
        console.log(err);
        return reject(500);
      }

      var time = [
        empno,
        course_no,
        res1[0].day1,
        res1[0].day1,
        res1[0].day2,
        res1[0].day2,
        res1[0].course_time_start,
        res1[0].course_time_end,
        res1[0].course_time_start,
        res1[0].course_time_end
      ];

      const queryString2 = `SELECT course_name, section FROM course WHERE empno = ? AND course_no != ? AND ((day1 = ? OR day2 = ?) OR (day1 = ? OR day2 = ?)) AND ((course_time_start >= ? AND course_time_start < ?) OR (course_time_end > ? AND course_time_end <= ?))`;

      db.query(queryString2, time, (err, res2) => {
        if (err) {
          console.log(err);
          return reject(500);
        }

        if (res2.length) {
          return reject(405);
        } else {
          db.query(queryString1, course_no, (err, res3) => {
            if (err) {
              console.log(err);
              return reject(500);
            }

            time = [
              swap_empno,
              swap_course_no,
              res3[0].day1,
              res3[0].day1,
              res3[0].day2,
              res3[0].day2,
              res3[0].course_time_start,
              res3[0].course_time_end,
              res3[0].course_time_start,
              res3[0].course_time_end
            ];

            db.query(queryString2, time, (err, res4) => {
              if (err) {
                console.log(err);
                return reject(500);
              }

              if (res4.length) {
                return reject(406);
              } else {
                const queryString = `
                  CALL swapProf(?,?,?,?,?)  
                `;

                const values = [
                  session_user,
                  course_no,
                  empno,
                  swap_course_no,
                  swap_empno
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
              }
            });
          });
        }
      });
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
