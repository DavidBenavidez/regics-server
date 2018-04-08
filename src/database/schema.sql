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
    is_adviser ENUM("true", "false") NOT NULL
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
    course_date DATE, 
    course_time_start TIME,
    course_time_end TIME, 
    minutes INT NOT NULL, 
    units FLOAT NOT NULL,
    course_credit FLOAT NOT NULL,
    is_lab ENUM("true", "false") NOT NULL,
    course_status ENUM("dissolved", "petitioned", "addition", "approved") NOT NULL,
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
    status enum("loa", "dropped", "enrolled", "dismissed") NOT NULL,
    classification ENUM("freshman", "sophomore", "junior", "senior") NOT NULL,
    student_curriculum TEXT NOT NULL,
    adviser INT,
    CONSTRAINT FK_adviser FOREIGN KEY (adviser) REFERENCES system_user(empno) ON DELETE SET NULL
);

CREATE TABLE student_advisers_list(
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
CREATE PROCEDURE addUser (
    IN name VARCHAR(256),
    IN username VARCHAR(256),
    IN email VARCHAR(256),
    IN password VARCHAR(256),
    IN system_position ENUM("faculty", "head", "member"),
    IN status ENUM("resigned", "on_leave", "active"),
    IN teaching_load FLOAT,
    IN is_adviser ENUM("true", "false")
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
    teaching_load,
    is_adviser
  );
END;
$$
DELIMITER ;

-- On Delete
DROP PROCEDURE IF EXISTS deleteUser;
DELIMITER $$
CREATE PROCEDURE deleteUser (
  IN empno INT
)
BEGIN
  DELETE FROM system_user
  WHERE system_user.empno = empno;
END;
$$
DELIMITER ;

-- On Edit
DROP PROCEDURE IF EXISTS editUser;
DELIMITER $$
CREATE PROCEDURE editUser (
  IN name VARCHAR(256),
  IN username VARCHAR(256),
  IN email VARCHAR(256), 
  IN password VARCHAR(256),
  IN system_position ENUM("faculty", "head", "member"),
  IN status ENUM("resigned", "on_leave", "active"),
  IN teaching_load FLOAT,
  IN is_adviser ENUM("true", "false"),
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
    system_user.teaching_load = teaching_load,
    system_user.is_adviser = is_adviser
  WHERE system_user.empno = empno;
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
    IN course_date DATE, 
    IN course_time_start TIME,
    IN course_time_end TIME, 
    IN minutes INT, 
    IN units FLOAT,
    IN course_credit FLOAT,
    IN is_lab ENUM("true", "false"),
    IN course_status ENUM("dissolved", "petitioned", "addition", "approved"),
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
    course_date,
    course_time_start,
    course_time_end,
    minutes,
    units,
    course_credit,
    is_lab,
    course_status,
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
    IN course_date DATE, 
    IN course_time_start TIME,
    IN course_time_end TIME, 
    IN minutes INT, 
    IN units FLOAT,
    IN course_credit FLOAT,
    IN is_lab ENUM("true", "false"),
    IN course_status ENUM("dissolved", "petitioned", "addition", "approved"),
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
        course.course_date = course_date,
        course.course_time_start = course_time_start,
        course.course_time_end = course_time_end,
        course.minutes = minutes,
        course.units = units,
        course.course_credit = course_credit,
        course.is_lab = is_lab,
        course.course_status = course_status,
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
      concat('Deleted Course: ', course_name, ' Section: ', section),
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
    IN student_no VARCHAR(10),
    IN adviser INT
)
BEGIN
    UPDATE student
    SET
    student.adviser = adviser
    WHERE student.student_no = student_no;
    INSERT INTO student_advisers_list(student_no, empno) 
    VALUES (student_no, adviser);
END;
$$
DELIMITER ;


-- On Delete
DROP PROCEDURE IF EXISTS removeStudent;
DELIMITER $$
CREATE PROCEDURE removeStudent (
    IN student_no VARCHAR(10)
)
BEGIN
    DELETE FROM student
    WHERE student.student_no = student_no;
END;
$$
DELIMITER ;


-- TRIGGERS
-- On adding a user
DROP TRIGGER IF EXISTS new_user_log;
DELIMITER $$
CREATE TRIGGER new_user_log
AFTER INSERT ON system_user
FOR EACH ROW
  BEGIN
    CALL log(
      concat('Added New user: ', NEW.name, ' With email: ', NEW.email, ' With position: ', NEW.system_position),
      NEW.name
    );
  END;
$$
DELIMITER ;