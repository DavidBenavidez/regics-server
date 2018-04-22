import db from '../../database';

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

export const importStudent = ({ data }) => {
  return new Promise((resolve, reject) => {
    // const queryString = `CALL addStudent(? ,?, ?, ?, ?, ?, ?)`;
    // const values = [
    //   session_user,
    //   student_no,
    //   name,
    //   student_curriculum,
    //   status,
    //   classification,
    //   adviser
    // ];

    var advisers = data[0].slice(6, data[0].length);
    data[0] = data[0].slice(0, 6);
    console.log(data[0]);
    console.log(advisers);
    return resolve(data);
    // db.query(queryString, values, (err, results) => {
    //   if (err) {
    //     console.log(err);
    //     return reject(500);
    //   }
    //   return resolve(results.insertId);
    // });
  });
};
