import db from '../../database';
import fs from 'fs';
import csv from 'fast-csv';

var csvStream = csv.createWriteStream({ headers: true });
var courseOfferingWS = fs.createWriteStream('CourseOffering.csv');
var teachingLoadWS = fs.createWriteStream('TeachingLoad.csv');
var StudentsCountWS = fs.createWriteStream('StudentsCount.csv');
var EnlistedStudentsWS = fs.createWriteStream('EnlistedStudents.csv');
var RoomsWS = fs.createWriteStream('Rooms.csv');

export const generateCourseOffering = () => {
  return new Promise((resolve, reject) => {
    const queryString = `
    SELECT 
      UPPER(course_name) as "Course Name",
      UPPER(section) as "Section",
      class_size as "Class Size",
      sais_class_count as "SAIS Class Count",
      sais_waitlisted_count as "SAIS Waitlisted Count",
      actual_count as "Actual Count",
      units as "Units",
      room_name as "Room Name",
      CONCAT(day1," ", day2) as Days,
      course_time_start as "Time Start",
      course_time_end as "Time End",
      hours as "Number of Hours",
      name as "Professor"
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
      FIELD(is_lab, 'false', 'true');
    `;

    var courses = [];

    db.query(queryString, (err, rows) => {
      if (err) {
        console.log(err);
        return reject(500);
      }

      if (!rows.length) {
        return reject(404);
      }

      for (var i = 0; i < rows.length; i++) {
        courses.push(rows[i]);
      }
      courseOfferingWS.on('finish', function() {
        console.log('DONE!');
      });

      csvStream.pipe(courseOfferingWS);
      for (var i = 0; i < courses.length; i++) {
        csvStream.write(courses[i]);
      }
      csvStream.end();

      return resolve(courses);
    });
  });
};

export const generateTeachingLoad = () => {
  return new Promise((resolve, reject) => {
    const queryString = `SELECT * FROM system_user ORDER BY name;`;
    const q1 = `SELECT * FROM course ORDER BY course_name`;
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
            subjects.push(allSub[j].course_name);
            totalTeachingLoad += allSub[j].course_credit;
          }
        }

        professor.push({
          name: rows[i].name,
          teaching_load: totalTeachingLoad,
          subjects: subjects
        });
        subjects = [];
      }

      if (err) {
        console.log(err);
        return reject(500);
      }

      teachingLoadWS.on('finish', function() {
        console.log('DONE!');
      });

      csvStream.pipe(teachingLoadWS);
      for (var i = 0; i < professor.length; i++) {
        if (professor[i].subjects.length > 1) {
          csvStream.write({
            name: professor[i].name,
            teaching_load: professor[i].teaching_load,
            subjects: professor[i].subjects[0]
          });
          for (var k = 1; k < professor[i].subjects.length; k++) {
            csvStream.write({
              name: '',
              teaching_load: '',
              subjects: professor[i].subjects[k]
            });
          }
        } else {
          csvStream.write(professor[i]);
        }
      }
      csvStream.end();

      return resolve(professor);
    });
  });
};

export const generateStudentCount = () => {
  return new Promise((resolve, reject) => {
    const queryString = `
        SELECT
          a.name as "Name", COUNT(CASE classification WHEN 'freshman' THEN 1 ELSE null END) AS "Freshman", 
          COUNT(CASE classification WHEN 'sophomore' THEN 1 ELSE null END) AS "Sophomore", 
          COUNT(CASE classification WHEN 'junior' THEN 1 ELSE null END) AS "Junior", 
          COUNT(CASE classification WHEN 'senior' THEN 1 ELSE null END) AS "Senior", 
          COUNT(student_no) AS "Total" 
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
        // if(rows[i]);
        if (rows[i].Freshman == 1) {
          f++;
          t++;
        }
        if (rows[i].Sophomore == 1) {
          so++;
          t++;
        }
        if (rows[i].Junior == 1) {
          j++;
          t++;
        }
        if (rows[i].Senior == 1) {
          se++;
          t++;
        }
      }

      StudentsCountWS.on('finish', function() {
        console.log('DONE!');
      });

      csvStream.pipe(StudentsCountWS);
      for (var i = 0; i < rows.length; i++) {
        csvStream.write(rows[i]);
      }
      csvStream.write({
        Name: 'Total',
        Freshman: f,
        Sophomore: so,
        Junior: j,
        Senior: se,
        Total: t
      });
      csvStream.end();

      return resolve(rows);
    });
  });
};

export const generateStudents = () => {
  return new Promise((resolve, reject) => {
    const queryString = `
        SELECT
          a.student_no, a.name, a.status, a.student_curriculum, a.classification, b.name AS adviser
        FROM
          student a, system_user b
        WHERE
          a.adviser = b.empno
        ORDER BY
          a.name
      `;

    db.query(queryString, (err, rows) => {
      if (err) {
        console.log(err);
        return reject(500);
      }

      EnlistedStudentsWS.on('finish', function() {
        console.log('DONE!');
      });

      csvStream.pipe(EnlistedStudentsWS);
      for (var i = 0; i < rows.length; i++) {
        csvStream.write(rows[i]);
      }
      csvStream.end();

      return resolve(rows);
    });
  });
};

export const generateRooms = () => {
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

      RoomsWS.on('finish', function() {
        console.log('DONE!');
      });

      csvStream.pipe(RoomsWS);
      for (var i = 0; i < rows.length; i++) {
        csvStream.write(rows[i]);
      }
      csvStream.end();

      return resolve(rows);
    });
  });
};
