import db from '../../database';

export const getAllTeachingLoads = () => {
  return new Promise((resolve, reject) => {
    const queryString = `select * from system_user;`;
    const q1 = `select * from course`;
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
      for (var i = 0; i < rows.length; i++) {
        for (var j = 0; j < allSub.length; j++) {
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
              empno: allSub[j].room_no
            });
          }
        }

        professor.push({
          name: rows[i].name,
          teaching_load: rows[i].teaching_load,
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
