import db from '../../database';
import bcrypt from 'bcryptjs';

const salt = bcrypt.genSaltSync(10);

function containsObject(obj, list) {
  var i;
  for (i = 0; i < list.length; i++) {
    if (list[i] === obj) {
      return true;
    }
  }
  return false;
}

export const getUser = ({ empno }) => {
  return new Promise((resolve, reject) => {
    const queryString = `
        SELECT 
          *
        FROM 
          system_user
        WHERE
          empno = ?
      `;

    db.query(queryString, empno, (err, rows) => {
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

// Get teaching load of professors
export const getAllTeachingLoads = () => {
  return new Promise((resolve, reject) => {
    const queryString = `SELECT * FROM system_user ORDER BY name;`;
    const q1 = `
      SELECT
        *
      FROM
        course 
      ORDER BY 
        FIELD(course_status, 'addition', 'approved', 'petitioned', 'dissolved'),
        course_name,
        section,
        FIELD(is_lab, 'false', 'true')
      `;

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
      var totalTeachingLoad;
      var totalCourseCredit;
      for (var i = 0; i < rows.length; i++) {
        totalTeachingLoad = 0;
        for (var j = 0; j < allSub.length; j++) {
          totalCourseCredit = 0;

          if (rows[i].empno == allSub[j].empno) {
            subjects.push({
              course_name: allSub[j].course_name,
              course_no: allSub[j].course_no,
              section: allSub[j].section,
              class_size: allSub[j].class_size,
              sais_class_count: allSub[j].sais_class_count,
              sais_waitlisted_count: allSub[j].sais_waitlisted_count,
              actual_count: allSub[j].actual_count,
              hours: allSub[j].hours,
              units: allSub[j].units,
              course_credit: allSub[j].course_credit,
              empno: allSub[j].room_no
            });
            totalTeachingLoad += allSub[j].course_credit;
          }
        }

        professor.push({
          empno: rows[i].empno,
          name: rows[i].name,
          status: rows[i].status,
          teaching_load: totalTeachingLoad,
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

// Get teaching load of professor
export const getTeachingLoad = ({ empno }) => {
  return new Promise((resolve, reject) => {
    const queryString = `
      SELECT
        room_no,
        course_no,
        course_name,
        section,
        class_size,
        sais_class_count,
        sais_waitlisted_count,
        actual_count,
        course_time_start,
        course_time_end,
        hours,
        units,
        course_credit,
        is_lab,
        course_status,
        day1,
        day2,
        reason,
        empno,
        name,
        room_name
      FROM
        course
      NATURAL JOIN
        room
      NATURAL JOIN
        system_user
      WHERE
        empno = ?
      ORDER BY
        FIELD(course_status, 'addition', 'approved', 'petitioned', 'dissolved'),
        course_name,
        section,
        FIELD(is_lab, 'false', 'true')
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

//Retrieve adviser and advisee per classification
export const getAllAdviseeClassification = () => {
  return new Promise((resolve, reject) => {
    const queryString = `
        SELECT
          a.name, COUNT(CASE classification WHEN 'freshman' THEN 1 ELSE null END) AS "freshman", 
          COUNT(CASE classification WHEN 'sophomore' THEN 1 ELSE null END) AS "sophomore", 
          COUNT(CASE classification WHEN 'junior' THEN 1 ELSE null END) AS "junior", 
          COUNT(CASE classification WHEN 'senior' THEN 1 ELSE null END) AS "senior", 
          COUNT(student_no) AS "total" 
        FROM
          system_user a
        JOIN
          student b
        ON
          a.empno = b.adviser
        GROUP BY
          empno
        ORDER BY
          a.name
      `;

    db.query(queryString, (err, rows) => {
      if (err) {
        console.log(err);
        return reject(500);
      }
      if (!rows.length) {
        return reject(404);
      }
      var f = 0,
        so = 0,
        j = 0,
        se = 0,
        t = 0;
      for (var i = 0; i < rows.length; i++) {
        f += rows[i].freshman;
        so += rows[i].sophomore;
        j += rows[i].junior;
        se += rows[i].senior;
        t +=
          rows[i].freshman +
          rows[i].sophomore +
          rows[i].junior +
          rows[i].senior;
      }
      rows.push({
        name: 'Total',
        freshman: f,
        sophomore: so,
        junior: j,
        senior: se,
        total: t
      });
      return resolve(rows);
    });
  });
};

export const removeUser = (session_user, { empno }) => {
  return new Promise((resolve, reject) => {
    const queryString = `CALL deleteUser(?, ?)`;

    const values = [session_user, empno];

    db.query(queryString, values, (err, results) => {
      if (err) {
        console.log(err);
        return reject(500);
      }
      if (!results.affectedRows) {
        return reject(404);
      }
      return resolve(empno);
    });
  });
};

export const getUsers = () => {
  return new Promise((resolve, reject) => {
    const queryString = `SELECT empno, name FROM system_user ORDER BY name`;

    db.query(queryString, (err, results) => {
      if (err) {
        console.log(err);
        return reject(500);
      }
      if (!results.length) {
        return reject(404);
      }
      return resolve(results);
    });
  });
};

export const getActiveUsers = () => {
  return new Promise((resolve, reject) => {
    const queryString = `SELECT empno, name FROM system_user WHERE status = 'active' ORDER BY empno`;

    db.query(queryString, (err, results) => {
      if (err) {
        console.log(err);
        return reject(500);
      }
      if (!results.length) {
        return reject(404);
      }
      return resolve(results);
    });
  });
};

export const editUser = (
  session_user,
  {
    empno,
    name,
    username,
    email,
    password,
    confirm_password,
    system_position,
    status,
    teaching_load
  }
) => {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, salt, function(err, hash) {
      const queryString = `
        CALL editUser(?,?,?,?,?,?,?,?,?);
      `;

      const values = [
        session_user,
        name,
        username,
        email,
        hash,
        system_position,
        status,
        teaching_load,
        empno
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
    });
  });
};

// List all advisers and the students assigned to them
export const getAdvisersAndAdvisees = () => {
  return new Promise((resolve, reject) => {
    const queryString = `SELECT b.name AS Advisers, GROUP_CONCAT(a.name SEPARATOR ', ') 
    AS ADVISEES FROM (select student_no, name, adviser from student) 
    AS a JOIN system_user AS b  
    WHERE b.empno = a.adviser GROUP BY b.empno`;

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

export const deleteAdviserAdvisee = (session_user, { id }) => {
  return new Promise((resolve, reject) => {
    const queryString = `CALL deleteAdviserAdvisee(?, ?)`;
    const values = [session_user, id];
    db.query(queryString, values, (err, results) => {
      if (err) {
        console.log(err);
        return reject(500);
      }
      if (!results.affectedRows) {
        return reject(404);
      }
      return resolve(id);
    });
  });
};

export const getSuggestedAdviser = () => {
  return new Promise((resolve, reject) => {
    var advisersString = 'SELECT empno FROM student_advisers_list';
    var count = [];
    var advisersArray = [];
    var minIndexes = [];
    var recommendedAdvisers = [];
    var queryString2 = 'SELECT * FROM system_user';

    db.query(queryString2, (err3, row3) => {
      var lessThanThree = [];
      if (err3) {
        console.log(err3);
        return reject(500);
      }
      if (!row3.length) {
        return reject(404);
      }
      if (row3.length < 3) {
        for (var i = 0; i < row3.length; i++) {
          lessThanThree.push({ empno: row3[i].empno, name: row3[i].name });
        }
      } else {
        db.query(advisersString, (err, row) => {
          if (err) {
            console.log(err);
            return reject(500);
          }
          if (!row.length) {
            return reject(404);
          }
          for (var i = 0; i < row.length; i++) {
            if (!containsObject({ empno: row[i].empno }, advisersArray))
              advisersArray.push({ empno: row[i].empno });
          }

          for (var i = 0; i < advisersArray.length; i++) {
            count[i] = 0;
          }

          for (var i = 0; i < row.length; i++) {
            for (var j = 0; j < advisersArray.length; j++) {
              if (row[i].empno == advisersArray[j].empno)
                count[j] = count[j] + 1;
            }
          }

          db.query(queryString2, (err2, row2) => {
            if (err2) {
              console.log(err2);
              return reject(500);
            }

            if (!row2.length) {
              return reject(404);
            }

            for (var counter = 0; counter < advisersArray.length; counter++) {
              if (advisersArray[counter].empno === row2[counter].empno) {
                if (row2[counter].status !== 'active') {
                  count.splice(count.indexOf(counter), 1);
                }
              }
            }

            var minValue1 = count[0];
            var minValue2 = count[0];
            var minValue3 = count[0];
            var minIndex1 = 0;
            var minIndex2 = 1;
            var minIndex3 = 2;

            for (var i = 0; i < count.length; i++) {
              if (count[i] < minValue1) {
                minValue1 = count[i];
                minIndex1 = i;
              }
            }

            for (var i = 0; i < count.length; i++) {
              if (count[i] < minValue2 && count[i] > minValue1) {
                minValue2 = count[i];
                minIndex2 = i;
              }
            }

            for (var i = 0; i < count.length; i++) {
              if (
                count[i] < minValue3 &&
                count[i] > minValue1 &&
                count[i] > minValue2
              ) {
                minValue3 = count[i];
                minIndex3 = i;
              }
            }

            minIndexes.push(minIndex1);
            minIndexes.push(minIndex2);
            minIndexes.push(minIndex3);

            for (var counter2 = 0; counter2 < row3.length; counter2++) {
              if (row3[counter2].empno == advisersArray[minIndex3].empno) {
                recommendedAdvisers.push({
                  empno: row3[counter2].empno,
                  name: row3[counter2].name
                });
              }
              if (row3[counter2].empno == advisersArray[minIndex2].empno) {
                recommendedAdvisers.push({
                  empno: row3[counter2].empno,
                  name: row3[counter2].name
                });
              }
              if (row3[counter2].empno == advisersArray[minIndex1].empno) {
                recommendedAdvisers.push({
                  empno: row3[counter2].empno,
                  name: row3[counter2].name
                });
              }
            }

            return resolve(advisersArray);
          });
        });
      }
    });
    // var noOfAdviseeArray = getAllAdviseeClassification(); //{{empno, noOfAdvisee},{empno, noOfAdvisee}}
    // var suggestedAdviserArray = {}; // array of top 3 profs w/ least number of advisee

    // /* ipasok mo muna lahat sa suggestedArray then sort mo then kunin mo ung index 0-3 */
    // noOfAdviseeArray.sort(function(a, b) {
    //   return a.total - b.total;
    // });

    // var count = 0;
    // var status;
    // var profName;
    // for (var i = 0; i < noOfAdviseeArray.length; i++) {
    //   if (count == 3)
    //     //if there are already top 3 advisers
    //     return resolve(suggestedAdviserArray);

    //   /* query if active */
    //   const queryString = `SELECT name, status from system_user where empno=?`;
    //   db.query(queryString, noOfAdviseeArray[i].empno, (err, row) => {
    //     if (err) {
    //       console.log(err);
    //       return reject(500);
    //     }
    //     if (!row.length) {
    //       return reject(404);
    //     }
    //     status = row[0].status;
    //     profName = row[0].name;
    //   });
    //   /* query end */

    //   if (status == 'active') {
    //     noOfAdviseeArray[i].name = profName; //add the name of the prof
    //     suggestedAdviserArray.push(noOfAdviseeArray[i]); //add the obj to the suggestedArray
    //     count++;
    //   }
    // }
  });
};
