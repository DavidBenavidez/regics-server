import db from '../../database';

export const getAllTeachingLoads = ({ empno }) => {
  return new Promise((resolve, reject) => {
    const queryString = `
        SELECT 
          *
        FROM 
          course
      `;

    db.query(queryString, empno, (err, rows) => {
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
