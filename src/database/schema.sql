DROP USER IF EXISTS 'regicsserver'@'localhost';
CREATE USER 'regicsserver'@'localhost' IDENTIFIED BY 'regicsserver';

DROP DATABASE IF EXISTS regicsserver;
CREATE DATABASE regicsserver;

-- GRANT SUPER ON *.* TO ‘regicsserver’@’localhost’;
-- GRANT ALL PRIVILEGES ON regicsserver.* TO ‘regicsserver’@’localhost’ WITH GRANT OPTION;

GRANT ALL PRIVILEGES ON regicsserver.* TO 'regicsserver'@'localhost';
GRANT EXECUTE ON regicsserver.* TO 'regicsserver'@'localhost';

USE regicsserver;

CREATE TABLE system_user (
    empno INT NOT NULL PRIMARY KEY, 
    name VARCHAR(256) NOT NULL,
    username VARCHAR(256) NOT NULL,
    password VARCHAR(256) NOT NULL,
    status_id INT NOT NULL,
    system_position ENUM("faculty", "head", "member"),
    status ENUM("resigned", "on_leave", "active"),
    teaching_load FLOAT NOT NULL,
    Is_adviser TINYINT NOT NULL 
);

CREATE TABLE room(
    room_no INT PRIMARY KEY,
    room_name VARCHAR(256) NOT NULL
);

CREATE TABLE course( 
    course_no INT NOT NULL PRIMARY KEY,
    course_name VARCHAR(256) NOT NULL,
    section VARCHAR(5) NOT NULL,
    class_size INT NOT NULL,
    sais_class_count INT NOT NULL,
    sais_waitlisted_count INT NOT NULL,
    actual_count INT NOT NULL,
    course_date DATE, 
    course_time TIME, 
    minutes INT NOT NULL, 
    units INT NOT NULL,
    room_no INT NOT NULL, 
    empno INT NOT NULL,
    CONSTRAINT FK_RoomNo FOREIGN KEY (room_no)
    REFERENCES room(room_no),
    CONSTRAINT FK_EmpNo FOREIGN KEY (empno)
    REFERENCES system_user(empno)
 
);

CREATE TABLE student(
    student_no VARCHAR(10) NOT NULL PRIMARY KEY,
    name VARCHAR(256) NOT NULL,
    status enum("loa", "dropped", "enrolled", "dismissed") NOT NULL,
    adviser INT,
    CONSTRAINT FK_adviser FOREIGN KEY (adviser) REFERENCES system_user(empno)
);

CREATE TABLE student_advisers_list(
    student VARCHAR(10) NOT NULL,
    empno INT NOT NULL, 
    CONSTRAINT FK_student FOREIGN KEY (student) REFERENCES student(student_no),
    CONSTRAINT FK_EmpNo2 FOREIGN KEY (empno) REFERENCES system_user(empno)
);