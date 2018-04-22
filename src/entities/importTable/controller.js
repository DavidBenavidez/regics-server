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

export const importTeaachingLoad = data => {
  return new Promise((resolve, reject) => {
    const queryString = `insert `;
    data = data.splice(1, data.length);

    for (var i = 0; i < data.length; i++) {
      db.query(queryString, (err, rows) => {
        if (err) {
          console.log(err);
          return reject(500);
        }
        return resolve(rows);
      });
    }
  });
};
