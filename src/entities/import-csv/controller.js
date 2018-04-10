import db from '../../database';
import fs from 'fs';
const Json2csvParser = require('json2csv').Parser;

export const importCourses = (session_user, data) => {
  return new Promise((resolve, reject) => {
    course = {};
    course.course_status = NULL;
    course.minutes = NULL;
    course.course_status = 'addition';
    course.actual_count = NULL;
    course.reason = NULL;

    for (var i = 1; i < data.size(); i++) {
      if (data[i][0] != '') {
        course_code = data[i][0];
        course_name = data[i][1];
        i++;
      } else {
        course.units = ParseFloat(
          course_name.split(' ')[course_name.split(' ').size() - 1][2]
        ); //kunin sa name
        course.is_lab = 'true';
        professor = '';
        if (data[i][1] == 'Lect') {
          course.is_lab = 'false';
        }
        course.section = data[i][2];
        time = data[i][3].split('-');
        course.course_time_start = time[0];
        course.course_time_end = time[1];
        if (data[i][4] == 'WF') {
          course.day1 = 'Wed';
          course.day2 = 'Fri';
        } else if (data[i][4] == 'TTh') {
          course.day1 = 'Tue';
          course.day2 = 'Thu';
        } else {
          course.day1 = data[i][4];
          course.day2 = NULL;
        }
        course.room_no = data[i][5]
          .split(' ')
          [data[i][5].split(' ').size() - 1].slice(1, 6);
        professor = data[i][6];
        course.class_size = data[i][7];
        course.sais_class_count = data[i][8];
        course.sais_waitlisted_count = data[i][9];
        const queryString = 'SELECT empno FROM system_user WHERE = ?';

        db.query(queryString, professor, (err, results) => {
          if (err) {
            console.log(err);
            return reject(500);
          }
        });
        course.empno = results[0];
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
        if (sais_class_count <= 40) {
          totalCourseCredit = 2;
        } else {
          totalCourseCredit = 2.0 * ((sais_class_count - 40) / 120 + 1);
        }
      } else {
        totalCourseCredit = 1.5;
      }

      var values = [
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

      const queryString = `
		    	CALL addCourse(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
		    `;

      db.query(queryString, values, (err, results) => {
        if (err) {
          console.log(err);
          return reject(500);
        }
      });
    }

    return resolve();
  });
};
