DROP USER IF EXISTS 'regicsserver'@'localhost';
CREATE USER 'regicsserver'@'localhost' IDENTIFIED BY 'regicsserver';

DROP DATABASE IF EXISTS regicsserver;
CREATE DATABASE regicsserver;

GRANT ALL PRIVILEGES ON regicsserver.* TO 'regicsserver'@'localhost';
GRANT EXECUTE ON regicsserver.* TO 'regicsserver'@'localhost';

USE regicsserver;

CREATE TABLE system_user (
    empno INT NOT NULL PRIMARY KEY AUTO_INCREMENT, 
    name VARCHAR(256) NOT NULL,
    username VARCHAR(256) NOT NULL,
    email VARCHAR(256) NOT NULL,
    password VARCHAR(256) NOT NULL,
    system_position ENUM("faculty", "head", "member") NOT NULL,
    status ENUM("resigned", "on_leave", "active") NOT NULL,
    teaching_load FLOAT NOT NULL,
    firstLogin ENUM("true", "false") NOT NULL
);

CREATE TABLE room(
    room_no INT PRIMARY KEY,
    room_name VARCHAR(256) NOT NULL
);

CREATE TABLE course( 
    course_no INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    course_name VARCHAR(256) NOT NULL,
    section VARCHAR(5) NOT NULL,
    class_size INT NOT NULL,
    sais_class_count INT NOT NULL,
    sais_waitlisted_count INT NOT NULL,
    actual_count INT NOT NULL,
    course_time_start TIME,
    course_time_end TIME, 
    hours FLOAT NOT NULL, 
    units FLOAT NOT NULL,
    course_credit FLOAT NOT NULL,
    is_lab ENUM("true", "false") NOT NULL,
    course_status ENUM("dissolved", "petitioned", "addition", "approved") NOT NULL,
    day1 ENUM("Monday", "Tuesday", "Wednesday", "Thursday", "Friday") NOT NULL,
    day2 ENUM("Monday", "Tuesday", "Wednesday", "Thursday", "Friday"),
    reason TEXT NOT NULL,
    room_no INT, 
    empno INT,
    CONSTRAINT FK_RoomNo FOREIGN KEY (room_no)
    REFERENCES room(room_no) ON DELETE SET NULL,
    CONSTRAINT FK_EmpNo FOREIGN KEY (empno)
    REFERENCES system_user(empno) ON DELETE SET NULL
);

CREATE TABLE student(
    student_no VARCHAR(10) NOT NULL PRIMARY KEY,
    name VARCHAR(256) NOT NULL,
    student_curriculum TEXT NOT NULL,
    status ENUM("loa", "dropped", "enrolled", "dismissed") NOT NULL,
    classification ENUM("freshman", "sophomore", "junior", "senior") NOT NULL,
    adviser INT,
    CONSTRAINT FK_adviser FOREIGN KEY (adviser) REFERENCES system_user(empno) ON DELETE SET NULL
);

CREATE TABLE student_advisers_list(
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    student_no VARCHAR(10),
    empno INT, 
    CONSTRAINT FK_student FOREIGN KEY (student_no) REFERENCES student(student_no) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT FK_EmpNo2 FOREIGN KEY (empno) REFERENCES system_user(empno) ON DELETE SET NULL
);

CREATE TABLE log_data (
  log_no INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  log_timestamp TIMESTAMP NOT NULL,
  log_action VARCHAR(256) NOT NULL,
  log_user VARCHAR(256) NOT NULL
);

-- PROCEDURES
-- For adding to log
DROP PROCEDURE IF EXISTS log;
DELIMITER $$
CREATE PROCEDURE log (
  IN action VARCHAR(256),
  IN user VARCHAR(256)
)
BEGIN
  INSERT INTO log_data VALUES (
    DEFAULT,
    NOW(),
    action,
    user
  );
END;
$$
DELIMITER ;

-- SYSTEM_USER

-- Adding a user
DROP PROCEDURE IF EXISTS addUser;
DELIMITER $$
CREATE PROCEDURE addUser(
    IN name VARCHAR(256),
    IN username VARCHAR(256),
    IN email VARCHAR(256),
    IN password VARCHAR(256),
    IN system_position ENUM("faculty", "head", "member"),
    IN status ENUM("resigned", "on_leave", "active")
)
BEGIN
  INSERT INTO system_user
  VALUES (
    DEFAULT,
    name,
    username,
    email,
    password,
    system_position,
    status,
    0,
    'true'
  );
   CALL log(
      concat('New system user: ', name, ' Position: ', system_position),
      name
    );
END;
$$
DELIMITER ;

-- On Delete
DROP PROCEDURE IF EXISTS deleteUser;
DELIMITER $$
CREATE PROCEDURE deleteUser (
  IN session_user_name VARCHAR(256),
  IN empno INT
)
BEGIN
  DELETE FROM system_user
  WHERE system_user.empno = empno;
  CALL log(
      concat('Deleted system user: ', empno),
      session_user_name
    );
END;
$$
DELIMITER ;

-- On Edit
DROP PROCEDURE IF EXISTS editUser;
DELIMITER $$
CREATE PROCEDURE editUser (
  IN session_user_name VARCHAR(256),
  IN name VARCHAR(256),
  IN username VARCHAR(256),
  IN email VARCHAR(256), 
  IN password VARCHAR(256),
  IN system_position ENUM("faculty", "head", "member"),
  IN status ENUM("resigned", "on_leave", "active"),
  IN teaching_load FLOAT,
  IN empno INT
)
BEGIN
  UPDATE system_user
  SET
    system_user.name = name,
    system_user.username = username,
    system_user.email = email,
    system_user.password = password,
    system_user.system_position = system_position,
    system_user.status = status,
    system_user.teaching_load = teaching_load
  WHERE system_user.empno = empno;
  CALL log(
      concat('Edited system user: ', name, ' Position: ', system_position),
      session_user_name
    );
END;
$$
DELIMITER ;



-- COURSE
-- add course
DROP PROCEDURE IF EXISTS addCourse;
DELIMITER $$
CREATE PROCEDURE addCourse (
    IN session_user_name VARCHAR(256),
    IN course_name VARCHAR(256),
    IN section VARCHAR(5),
    IN class_size INT,
    IN sais_class_count INT,
    IN sais_waitlisted_count INT,
    IN actual_count INT,
    IN course_time_start TIME,
    IN course_time_end TIME, 
    IN hours FLOAT, 
    IN units FLOAT,
    IN course_credit FLOAT,
    IN is_lab ENUM("true", "false"),
    IN course_status ENUM("dissolved", "petitioned", "addition", "approved"),
    IN day1 ENUM("Monday", "Tuesday", "Wednesday", "Thursday", "Friday"),
    IN day2 ENUM("Monday", "Tuesday", "Wednesday", "Thursday", "Friday"),
    IN reason TEXT,
    IN room_no INT, 
    IN empno INT
)
BEGIN
  INSERT INTO course
  VALUES (
    DEFAULT,
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
    room_no,
    empno
  );
  CALL log(
      concat('Added Course: ', course_name, ' Section: ', section),
      session_user_name
  );
END;
$$
DELIMITER ;

-- Edit course
DROP PROCEDURE IF EXISTS editCourse;
DELIMITER $$
CREATE PROCEDURE editCourse (
    IN session_user_name VARCHAR(256),
    IN course_name VARCHAR(256),
    IN section VARCHAR(5),
    IN class_size INT,
    IN sais_class_count INT,
    IN sais_waitlisted_count INT,
    IN actual_count INT, 
    IN course_time_start TIME,
    IN course_time_end TIME, 
    IN hours FLOAT, 
    IN units FLOAT,
    IN course_credit FLOAT,
    IN is_lab ENUM("true", "false"),
    IN course_status ENUM("dissolved", "petitioned", "addition", "approved"),
    IN day1 ENUM("Monday", "Tuesday", "Wednesday", "Thursday", "Friday"),
    IN day2 ENUM("Monday", "Tuesday", "Wednesday", "Thursday", "Friday"),
    IN reason TEXT,
    IN room_no INT, 
    IN empno INT,
    IN course_no INT
)
BEGIN
    UPDATE course
    SET 
        course.course_name = course_name,
        course.section = section,
        course.class_size = class_size,
        course.sais_class_count = sais_class_count,
        course.sais_waitlisted_count = sais_waitlisted_count,
        course.actual_count = actual_count,
        course.course_time_start = course_time_start,
        course.course_time_end = course_time_end,
        course.hours = hours,
        course.units = units,
        course.course_credit = course_credit,
        course.is_lab = is_lab,
        course.course_status = course_status,
        course.day1 = day1,
        course.day2 = day2,
        course.reason = reason,
        course.room_no = room_no,
        course.empno = empno 
      WHERE 
        course.course_no = course_no;
      CALL log(
        concat('Edited Course: ', course_name, ' Section: ', section),
        session_user_name
      );
END;
$$
DELIMITER ;

-- On swap profs
DROP PROCEDURE IF EXISTS swapProf;
DELIMITER $$
CREATE PROCEDURE swapProf (
    IN session_user_name VARCHAR(256),
    IN course_no INT,
    IN empno INT,
    IN swap_course_no INT,
    IN swap_empno INT
)
BEGIN
    UPDATE course
    SET
    course.empno = empno
    WHERE course.course_no = swap_course_no;
    UPDATE course
    SET
    course.empno = swap_empno
    WHERE course.course_no = course_no;
    CALL log(
      concat('Swapped profs course num: ', course_no, ' empno: ', empno, ' and course num ', swap_course_no, ' empno ', swap_empno),
      session_user_name
    );
END;
$$
DELIMITER ;




-- Delete course procedure
DROP PROCEDURE IF EXISTS deleteCourse;
DELIMITER $$
CREATE PROCEDURE deleteCourse (
  IN session_user_name VARCHAR(256),
  IN course_num INT
)
BEGIN
    DELETE FROM course
    WHERE course_no = course_num;
    CALL log(
      concat('Deleted Course: ', course_num),
      session_user_name
    );
END;
$$
DELIMITER ; 


-- STUDENT

-- addStudent
DROP PROCEDURE IF EXISTS addStudent;
DELIMITER $$
CREATE PROCEDURE addStudent(
    IN session_user_name VARCHAR(256),
    IN student_no VARCHAR(10),
    IN name VARCHAR(256),
    IN student_curriculum TEXT,
    IN status ENUM("loa", "dropped", "enrolled", "dismissed"),
    IN classification ENUM("freshman", "sophomore", "junior", "senior"),
    IN adviser INT
)
BEGIN
  INSERT INTO student
  VALUES (
    student_no,
    name,
    student_curriculum,
    status,
    classification,
    adviser
      );
   CALL log(
      concat('New student: ', name, ' classification: ', classification),
      name
    );
END;
$$
DELIMITER ;



-- On update student adviser
DROP PROCEDURE IF EXISTS updateStudentAdviser;
DELIMITER $$
CREATE PROCEDURE updateStudentAdviser (
    IN session_user_name VARCHAR(256),
    IN student_no VARCHAR(10),
    IN adviser INT
)
BEGIN
    UPDATE student
    SET
    student.adviser = adviser
    WHERE student.student_no = student_no;
    INSERT INTO student_advisers_list  
    VALUES (DEFAULT, student_no, adviser);
    CALL log(
      concat('Updated student adviser of sudent with student number: ', student_no, ' Adviser_no: ', adviser),
      session_user_name
    );
END;
$$
DELIMITER ;

-- on edit student
DROP PROCEDURE IF EXISTS updateStudent;    
DELIMITER $$
CREATE PROCEDURE updateStudent (
    IN session_user_name VARCHAR(256),
    IN name VARCHAR(256),
    In status ENUM("loa", "dropped", "enrolled", "dismissed"),
    IN classification ENUM("freshman", "sophomore", "junior", "senior"),
    IN student_curriculum TEXT,
    IN student_no VARCHAR(10)
)
BEGIN
    UPDATE student
    SET
    student.name = name,
    student.status = status,
    student.classification = classification,
    student.student_curriculum = student_curriculum
    WHERE student.student_no = student_no;
    CALL log(
      concat('Updated student info of sudent with student number: ', student_no),
      session_user_name
    );
END;
$$
DELIMITER ;


-- STUDENT
-- On Edit
DROP PROCEDURE IF EXISTS updateStudentAdviser;
DELIMITER $$
CREATE PROCEDURE updateStudentAdviser (
      IN session_user_name VARCHAR(256),
    IN student_no VARCHAR(10),
    IN adviser INT
)
BEGIN
    UPDATE student
    SET
    student.adviser = adviser
    WHERE student.student_no = student_no;
    INSERT INTO student_advisers_list  
    VALUES (DEFAULT, student_no, adviser);
    CALL log(
      concat('Updated student adviser of sudent with student number: ', student_no, ' Adviser_no: ', adviser),
      session_user_name
    );
END;
$$
DELIMITER ;


-- On Delete
DROP PROCEDURE IF EXISTS removeStudentFromAdvisersList;
DELIMITER $$
CREATE PROCEDURE removeStudentFromAdvisersList (
    IN student_no VARCHAR(10)
)
BEGIN
    DELETE FROM student_advisers_list
    WHERE student_advisers_list.student_no = student_no;
END;
$$
DELIMITER ;

DROP PROCEDURE IF EXISTS removeStudent;
DELIMITER $$
CREATE PROCEDURE removeStudent (
    IN session_user_name VARCHAR(256),
    IN student_no VARCHAR(10)
)
BEGIN
    DELETE FROM student
    WHERE student.student_no = student_no;
    CALL log(
      concat('Deleted student: ', student_no),
      session_user_name
    );
END;
$$
DELIMITER ;

-- On delete adviser advisee
DROP PROCEDURE IF EXISTS deleteAdviserAdvisee;
DELIMITER $$
CREATE PROCEDURE deleteAdviserAdvisee (
    IN session_user_name VARCHAR(256),
    IN id INT
)
BEGIN
    DELETE FROM student_advisers_list
    WHERE student_advisers_list.id = id;
    CALL log(
      "Deleted from student advisers list",
      session_user_name
    );
END;
$$
DELIMITER ;


-- Reset student table
DROP PROCEDURE IF EXISTS clearStudentTable;
DELIMITER $$
CREATE PROCEDURE clearStudentTable()
BEGIN
DROP TABLE IF EXISTS student_advisers_list;
ALTER TABLE student DROP FOREIGN KEY FK_adviser;
DROP TABLE IF EXISTS student;
CREATE TABLE student(
    student_no VARCHAR(10) NOT NULL PRIMARY KEY,
    name VARCHAR(256) NOT NULL,
    student_curriculum TEXT NOT NULL,
    status ENUM("loa", "dropped", "enrolled", "dismissed") NOT NULL,
    classification ENUM("freshman", "sophomore", "junior", "senior") NOT NULL,
    adviser INT,
    CONSTRAINT FK_adviser FOREIGN KEY (adviser) REFERENCES system_user(empno) ON DELETE SET NULL
);
CREATE TABLE student_advisers_list(
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    student_no VARCHAR(10),
    empno INT, 
    CONSTRAINT FK_student FOREIGN KEY (student_no) REFERENCES student(student_no) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT FK_EmpNo2 FOREIGN KEY (empno) REFERENCES system_user(empno) ON DELETE SET NULL
);
END;
$$
DELIMITER ;

DROP PROCEDURE IF EXISTS clearCourseTable;
DELIMITER $$
CREATE PROCEDURE clearCourseTable()
BEGIN
DROP TABLE IF EXISTS course;
CREATE TABLE course( 
    course_no INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    course_name VARCHAR(256) NOT NULL,
    section VARCHAR(5) NOT NULL,
    class_size INT NOT NULL,
    sais_class_count INT NOT NULL,
    sais_waitlisted_count INT NOT NULL,
    actual_count INT NOT NULL,
    course_time_start TIME,
    course_time_end TIME, 
    hours FLOAT NOT NULL, 
    units FLOAT NOT NULL,
    course_credit FLOAT NOT NULL,
    is_lab ENUM("true", "false") NOT NULL,
    course_status ENUM("dissolved", "petitioned", "addition", "approved") NOT NULL,
    day1 ENUM("Monday", "Tuesday", "Wednesday", "Thursday", "Friday") NOT NULL,
    day2 ENUM("Monday", "Tuesday", "Wednesday", "Thursday", "Friday"),
    reason TEXT NOT NULL,
    room_no INT, 
    empno INT,
    CONSTRAINT FK_RoomNo FOREIGN KEY (room_no)
    REFERENCES room(room_no) ON DELETE SET NULL,
    CONSTRAINT FK_EmpNo FOREIGN KEY (empno)
    REFERENCES system_user(empno) ON DELETE SET NULL
);
END;
$$
DELIMITER ;

DELIMITER $$
DROP FUNCTION IF EXISTS CAP_FIRST$$
CREATE FUNCTION CAP_FIRST (input VARCHAR(255))

RETURNS VARCHAR(255)

DETERMINISTIC

BEGIN
  DECLARE len INT;
  DECLARE i INT;

  SET len   = CHAR_LENGTH(input);
  SET input = LOWER(input);
  SET i = 0;

  WHILE (i < len) DO
    IF (MID(input,i,1) = ' ' OR i = 0) THEN
      IF (i < len) THEN
        SET input = CONCAT(
          LEFT(input,i),
          UPPER(MID(input,i + 1,1)),
          RIGHT(input,len - i - 1)
        );
      END IF;
    END IF;
    SET i = i + 1;
  END WHILE;

  RETURN input;
END;