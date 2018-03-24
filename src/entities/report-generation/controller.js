import db from '../../database';
import fs from 'fs';
const Json2csvParser = require('json2csv').Parser;

export const getCourses = () => {
  return new Promise((resolve, reject) => {
    const queryString = `
        SELECT 
          *
        FROM 
          course
      `;

    db.query(queryString, (err, rows) => {
      if (err) {
        console.log(err);
        return reject(500);
      }

      if (!rows.length) {
        return reject(404);
      }

      const fields = [
        'course_no',
        'course_name',
        'section',
        'class_size',
        'sais_class_count',
        'sais_waitlisted_count',
        'actual_count',
        'course_date',
        'course_time_start',
        'course_time_end',
        'minutes',
        'units',
        'is_lab',
        'course_status',
        'reason',
        'room_no',
        'empno'
      ];

      const json2csvParser = new Json2csvParser({ fields });
      const csv = json2csvParser.parse(rows);

      return resolve({ data: csv });
    });
  });
};
