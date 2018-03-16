import db from '../../database';

export const getAllTeachingLoads = () => {
  return new Promise((resolve, reject) => {
    const queryString = `
        select a.name, 
        GROUP_CONCAT(CONCAT(b.course_no,","),CONCAT(b.course_name,","),CONCAT(b.section,","),CONCAT(b.class_size,","),CONCAT(b.sais_class_count,","),CONCAT(b.sais_waitlisted_count,","),
        CONCAT(b.actual_count,","),CONCAT(b.course_date,","),CONCAT(b.minutes,","),CONCAT(b.units,","),CONCAT(b.room_no,","),CONCAT(b.empno,",") order by b.course_no desc separator ' | ') as SUBJECTS
        from system_user a left join course b on a.empno = b.empno group by a.name
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

// {
//   data:
//     [
//       {
//         prof: "lskdfja;sd",
//         teaching load: 32532,
//         subjects:
//           [
//             {
//               name: "CMSC 2",
//               units: 3,
//               etc.......
//             }, {
//               name: "CMSC 123125",
//               units: 5,
//               etc.......
//             }
//           ]
//       }, {
//         prof: "dsagdsa",
//         teaching load: 3232432324, (see computation; nasa group chat)
//         subjects:
//           [
//             {
//               name: "CMSC 232",
//               units: 3,
//               etc.......
//             }
//           ]
//       }
//     ]
// }
