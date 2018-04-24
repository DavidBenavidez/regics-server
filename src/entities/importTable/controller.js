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

export const importStudent = (session_user, { data }) => {
  return new Promise((resolve, reject) => {
    const clearTable = `CALL clearStudentTable()`;
    const queryString = `CALL addStudent(? ,?, ?, ?, ?, ?, ?)`;
    const queryString2 = `CALL updateStudentAdviser(?, ?, ?)`;
    var advisers = '';
    var advisersArray = [];
    var values = [];
    var values2 = [];

    db.query(clearTable, (err3, results3) => {
      if (err3) {
        console.log(err3);
        return reject(500);
      }
    });

    for (var i = 0; i < data.length; i++) {
      advisers = data[i][7];

      data[i] = data[i].slice(0, 7);
      advisers = advisers.split(',');
      advisers = advisers.splice(0, advisers.length - 1);

      values = [
        session_user,
        data[i][0],
        data[i][1],
        data[i][3],
        data[i][2],
        data[i][4],
        data[i][6]
      ];

      db.query(queryString, values, (err, results) => {
        if (err) {
          console.log(err);
          return reject(500);
        }
      });
      values2 = [session_user, values[1], values[6], values[7]];

      db.query(queryString2, values2, (err2, results2) => {
        if (err2) {
          console.log(err2);
          return reject(500);
        }
      });

      if (advisers) {
        for (var k = 0; k < advisers.length; k++) {
          values2 = [session_user, values[1], advisers[k]];
          db.query(queryString2, values2, (err2, results2) => {
            if (err2) {
              console.log(err2);
              return reject(500);
            }
          });
        }
      }
    }
    return resolve(data);
  });
};

export const importCourse = (session_user, { data }) => {
  return new Promise((resolve, reject) => {
    const clearTable = `CALL clearCourseTable()`;
    data = data.splice(1, data.length);

    // clear course table
    db.query(clearTable, (err3, results3) => {
      if (err3) {
        console.log(err3);
        return reject(500);
      }
    });

    for (var i = 0; i < data.length; i++) {
      data[i][13] = convertTime(data[i][13]);
      data[i][14] = convertTime(data[i][14]);

      var totalCourseCredit;

      // Compute course credit
      if (data[i][1] == 'CMSC 190-1') {
        if (data[i][4] * (0.5 / 3) > 3) {
          totalCourseCredit = 3;
        } else {
          totalCourseCredit = data[i][4] * (0.5 / 3);
        }
      } else if (data[i][1] == 'CMSC 190-2') {
        if (2.0 * data[i][4] * (0.5 / 3) > 3) {
          totalCourseCredit = 3;
        } else {
          totalCourseCredit = 2.0 * data[i][4] * (0.5 / 3);
        }
      } else if (data[i][8] == 'false') {
        if (data[i][4] <= 40) {
          totalCourseCredit = 2;
        } else {
          totalCourseCredit = 2.0 * ((data[i][4] - 40) / 120 + 1);
        }
      } else {
        totalCourseCredit = 1.5;
      }
      var queryString;
      var values;
      if (!data[i][8]) {
        queryString = `CALL addCourse(?,?,?,?,?,?,?,?,?, time_to_sec(timediff('${data[
          i
        ][14]}','${data[i][13]}'))/3600,?,?,?,?,?,?,?,?,?)`;
        values = [
          session_user,
          data[i][1],
          data[i][2],
          data[i][3],
          data[i][4],
          data[i][5],
          data[i][6],
          data[i][13],
          data[i][14],
          data[i][7],
          totalCourseCredit,
          data[i][8],
          data[i][16],
          data[i][11],
          data[i][12],
          data[i][17],
          data[i][10],
          data[i][15]
        ];
      } else {
        queryString = `CALL addCourse(?,?,?,?,?,?,?,?,?, time_to_sec(timediff('${data[
          i
        ][14]}','${data[i][13]}'))/3600,?,?,?,?,?,NULL,?,?,?)`;
        var values = [
          session_user,
          data[i][1],
          data[i][2],
          data[i][3],
          data[i][4],
          data[i][5],
          data[i][6],
          data[i][13],
          data[i][14],
          data[i][7],
          totalCourseCredit,
          data[i][8],
          data[i][16],
          data[i][11],
          data[i][17],
          data[i][10],
          data[i][15]
        ];
      }
      db.query(queryString, values, (err, results) => {
        if (err) {
          console.log(err);
          return reject(500);
        }
      });
    }
    return resolve(data);
  });
};
