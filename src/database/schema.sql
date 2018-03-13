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
    course_time TIME, 
    minutes INT NOT NULL, 
    units INT NOT NULL,
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
    adviser INT,
    CONSTRAINT FK_adviser FOREIGN KEY (adviser) REFERENCES system_user(empno) ON DELETE SET NULL
);

CREATE TABLE student_advisers_list(
    student_no VARCHAR(10),
    empno INT, 
    CONSTRAINT FK_student FOREIGN KEY (student_no) REFERENCES student(student_no) ON DELETE SET NULL,
    CONSTRAINT FK_EmpNo2 FOREIGN KEY (empno) REFERENCES system_user(empno) ON DELETE SET NULL
);

-- DUMMY  DATA
USE regicsserver;

insert into system_user (empno, name, username, email, password, system_position, status, teaching_load, is_adviser) values (DEFAULT, 'Meriel John', 'mjohn0', 'example@email.com', 'FZEvjCmKjFN', 'faculty', 'resigned', 29.1136, 'false');
insert into system_user (empno, name, username, email, password, system_position, status, teaching_load, is_adviser) values (DEFAULT, 'Anny Whelan', 'awhelan1', 'example1@email.com', '2VWKdGcd', 'head', 'resigned', 13.9978, 'false');
insert into system_user (empno, name, username, email, password, system_position, status, teaching_load, is_adviser) values (DEFAULT, 'Sandy Macvain', 'smacvain2', 'example2@email.com', 'Acieo9', 'member', 'on_leave', 10.9264, 'false');
insert into system_user (empno, name, username, email, password, system_position, status, teaching_load, is_adviser) values (DEFAULT, 'Thalia Beedell', 'tbeedell3', 'example3@email.com', '2GCz245', 'member', 'on_leave', 13.5265, 'false');
insert into system_user (empno, name, username, email, password, system_position, status, teaching_load, is_adviser) values (DEFAULT, 'Oswald Keast', 'okeast4', 'example4@email.com', 'Klm8iXSSp', 'member', 'active', 17.08, 'false');
insert into system_user (empno, name, username, email, password, system_position, status, teaching_load, is_adviser) values (DEFAULT, 'Hermia McCraine', 'hmccraine5', 'example5@email.com', 'tMMlu7ruu1', 'member', 'active', 16.1024, 'false');
insert into system_user (empno, name, username, email, password, system_position, status, teaching_load, is_adviser) values (DEFAULT, 'Ailbert Legg', 'alegg6', 'example6@email.com', 'Fy8OjUI', 'member', 'active', 21.1179, 'false');
insert into system_user (empno, name, username, email, password, system_position, status, teaching_load, is_adviser) values (DEFAULT, 'Linnie Creffeild', 'lcreffeild7', 'example7@email.com', 'LTZJm32EEpE', 'member', 'active', 10.8194, 'false');
insert into system_user (empno, name, username, email, password, system_position, status, teaching_load, is_adviser) values (DEFAULT, 'Gwenora Veschambre', 'gveschambre8', 'example8@email.com', 'UTfZ5Bkp', 'member', 'active', 14.5526, 'false');
insert into system_user (empno, name, username, email, password, system_position, status, teaching_load, is_adviser) values (DEFAULT, 'Starla Bodleigh', 'sbodleigh9', 'example9@email.com', 'QHbWCsu5C', 'member', 'active', 13.2486, 'false');
insert into system_user (empno, name, username, email, password, system_position, status, teaching_load, is_adviser) values (DEFAULT, 'Audrey Monger', 'amongera', 'example10@email.com', 'FlM1Mj', 'member', 'active', 29.0812, 'true');
insert into system_user (empno, name, username, email, password, system_position, status, teaching_load, is_adviser) values (DEFAULT, 'Markos Dudderidge', 'mdudderidgeb', 'example11@email.com', 'OomKCZ7', 'member', 'active', 16.8789, 'true');
insert into system_user (empno, name, username, email, password, system_position, status, teaching_load, is_adviser) values (DEFAULT, 'Suzanna Mellanby', 'smellanbyc', 'example12@email.com', 'rCz2bO', 'member', 'active', 22.5513, 'true');
insert into system_user (empno, name, username, email, password, system_position, status, teaching_load, is_adviser) values (DEFAULT, 'Elfie Mathewson', 'emathewsond', 'example13@email.com', 'tTsHGyPv', 'member', 'active', 20.6449, 'true');
insert into system_user (empno, name, username, email, password, system_position, status, teaching_load, is_adviser) values (DEFAULT, 'Cello Blaydon', 'cblaydone', 'example14@email.com', 'Pi3j7dfy', 'member', 'active', 24.9033, 'true');
insert into system_user (empno, name, username, email, password, system_position, status, teaching_load, is_adviser) values (DEFAULT, 'Talbot Bernat', 'tbernatf', 'example15@email.com', 'sSSdJH', 'member', 'active', 24.0789, 'true');
insert into system_user (empno, name, username, email, password, system_position, status, teaching_load, is_adviser) values (DEFAULT, 'Dov Goddard', 'dgoddardg', 'example16@email.com', 'R71u1DG', 'member', 'active', 15.784, 'true');
insert into system_user (empno, name, username, email, password, system_position, status, teaching_load, is_adviser) values (DEFAULT, 'Roseann Franklyn', 'rfranklynh', 'example17@email.com', 'eGfz799', 'faculty', 'active', 20.8323, 'true');
insert into system_user (empno, name, username, email, password, system_position, status, teaching_load, is_adviser) values (DEFAULT, 'Shaughn Tumielli', 'stumiellii', 'example18@email.com', 'vO4ndRz', 'faculty', 'active', 27.267, 'true');
insert into system_user (empno, name, username, email, password, system_position, status, teaching_load, is_adviser) values (DEFAULT, 'Cissy Giraudot', 'cgiraudotj', 'example19@email.com', 'wve0ducx', 'faculty', 'active', 16.1819, 'true');

insert into room (room_no, room_name) values (50, 'PCLAB 1');
insert into room (room_no, room_name) values (53, 'PCLAB 7');
insert into room (room_no, room_name) values (73, 'PCLAB 7');
insert into room (room_no, room_name) values (79, 'PCLAB 1');
insert into room (room_no, room_name) values (76, 'PCLAB 7');
insert into room (room_no, room_name) values (62, 'PCLAB 4');
insert into room (room_no, room_name) values (35, 'PCLAB 7');
insert into room (room_no, room_name) values (94, 'PCLAB 6');
insert into room (room_no, room_name) values (65, 'PCLAB 0');
insert into room (room_no, room_name) values (93, 'PCLAB 1');
insert into room (room_no, room_name) values (9, 'PCLAB 4');
insert into room (room_no, room_name) values (77, 'PCLAB 8');
insert into room (room_no, room_name) values (4, 'PCLAB 2');
insert into room (room_no, room_name) values (23, 'PCLAB 0');
insert into room (room_no, room_name) values (74, 'PCLAB 5');
insert into room (room_no, room_name) values (55, 'PCLAB 0');
insert into room (room_no, room_name) values (31, 'PCLAB 6');
insert into room (room_no, room_name) values (68, 'PCLAB 8');
insert into room (room_no, room_name) values (52, 'PCLAB 1');
insert into room (room_no, room_name) values (10, 'PCLAB 7');

insert into course (course_no, course_name, section, class_size, sais_class_count, sais_waitlisted_count, actual_count, course_date, minutes, units, room_no, empno) values (DEFAULT, 'duis aliquam convallis nunc proin at turpis a pede posuere nonummy integer non velit donec diam', 'JF-9L', 70, 64, 142, 12, '2018-03-24', 68, 3, 50, 1);
insert into course (course_no, course_name, section, class_size, sais_class_count, sais_waitlisted_count, actual_count, course_date, minutes, units, room_no, empno) values (DEFAULT, 'duis bibendum felis sed interdum venenatis turpis enim blandit mi in porttitor pede justo eu', 'YU-6L', 39, 55, 47, 86, '2018-03-24', 90, 2, 53, 2);
insert into course (course_no, course_name, section, class_size, sais_class_count, sais_waitlisted_count, actual_count, course_date, minutes, units, room_no, empno) values (DEFAULT, 'ornare imperdiet sapien urna pretium nisl ut volutpat sapien arcu sed augue aliquam erat volutpat in congue etiam', 'NE-4L', 96, 32, 139, 140, '2018-03-24', 87, 5, 73, 3);
insert into course (course_no, course_name, section, class_size, sais_class_count, sais_waitlisted_count, actual_count, course_date, minutes, units, room_no, empno) values (DEFAULT, 'at velit vivamus vel nulla eget eros elementum pellentesque quisque porta', 'LH-8L', 11, 129, 43, 107, '2018-03-24', 77, 3, 79, 4);
insert into course (course_no, course_name, section, class_size, sais_class_count, sais_waitlisted_count, actual_count, course_date, minutes, units, room_no, empno) values (DEFAULT, 'nascetur ridiculus mus etiam vel augue vestibulum rutrum rutrum neque aenean auctor gravida sem praesent id', 'OY-3L', 77, 49, 77, 14, '2018-03-24', 104, 3, 76, 5);
insert into course (course_no, course_name, section, class_size, sais_class_count, sais_waitlisted_count, actual_count, course_date, minutes, units, room_no, empno) values (DEFAULT, 'morbi porttitor lorem id ligula suspendisse ornare consequat lectus in est risus auctor sed tristique in tempus sit', 'BB-3L', 144, 77, 126, 130, '2018-03-24', 94, 2, 62, 6);
insert into course (course_no, course_name, section, class_size, sais_class_count, sais_waitlisted_count, actual_count, course_date, minutes, units, room_no, empno) values (DEFAULT, 'suspendisse ornare consequat lectus in est risus auctor sed tristique', 'UG-5L', 124, 131, 44, 108, '2018-03-24', 90, 2, 35, 7);
insert into course (course_no, course_name, section, class_size, sais_class_count, sais_waitlisted_count, actual_count, course_date, minutes, units, room_no, empno) values (DEFAULT, 'nulla eget eros elementum pellentesque quisque porta volutpat erat quisque erat eros viverra eget congue eget semper rutrum', 'SU-4L', 12, 94, 24, 88, '2018-03-24', 111, 2, 94, 8);
insert into course (course_no, course_name, section, class_size, sais_class_count, sais_waitlisted_count, actual_count, course_date, minutes, units, room_no, empno) values (DEFAULT, 'quam pede lobortis ligula sit amet eleifend pede libero quis orci nullam molestie nibh', 'DE-5L', 57, 105, 84, 82, '2018-03-24', 117, 4, 65, 9);
insert into course (course_no, course_name, section, class_size, sais_class_count, sais_waitlisted_count, actual_count, course_date, minutes, units, room_no, empno) values (DEFAULT, 'elit ac nulla sed vel enim sit amet nunc viverra dapibus nulla suscipit ligula in lacus curabitur at', 'YS-2L', 115, 127, 20, 77, '2018-03-24', 115, 4, 93, 10);
insert into course (course_no, course_name, section, class_size, sais_class_count, sais_waitlisted_count, actual_count, course_date, minutes, units, room_no, empno) values (DEFAULT, 'eros vestibulum ac est lacinia nisi venenatis tristique fusce congue diam id ornare', 'EG-4L', 54, 54, 56, 114, '2018-03-24', 111, 2, 9, 11);
insert into course (course_no, course_name, section, class_size, sais_class_count, sais_waitlisted_count, actual_count, course_date, minutes, units, room_no, empno) values (DEFAULT, 'ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae mauris viverra diam', 'OV-3L', 61, 83, 38, 116, '2018-03-24', 60, 4, 77, 12);
insert into course (course_no, course_name, section, class_size, sais_class_count, sais_waitlisted_count, actual_count, course_date, minutes, units, room_no, empno) values (DEFAULT, 'vivamus tortor duis mattis egestas metus aenean fermentum donec ut mauris eget massa tempor convallis', 'GH-4L', 138, 72, 72, 81, '2018-03-24', 120, 4, 4, 13);
insert into course (course_no, course_name, section, class_size, sais_class_count, sais_waitlisted_count, actual_count, course_date, minutes, units, room_no, empno) values (DEFAULT, 'non mauris morbi non lectus aliquam sit amet diam in magna bibendum imperdiet nullam orci pede', 'GR-8L', 35, 67, 10, 24, '2018-03-24', 64, 3, 23, 14);
insert into course (course_no, course_name, section, class_size, sais_class_count, sais_waitlisted_count, actual_count, course_date, minutes, units, room_no, empno) values (DEFAULT, 'dapibus nulla suscipit ligula in lacus curabitur at ipsum ac', 'BH-4L', 53, 61, 92, 149, '2018-03-24', 103, 5, 74, 15);
insert into course (course_no, course_name, section, class_size, sais_class_count, sais_waitlisted_count, actual_count, course_date, minutes, units, room_no, empno) values (DEFAULT, 'tempus sit amet sem fusce consequat nulla nisl nunc nisl duis bibendum felis sed interdum venenatis turpis', 'TQ-9L', 68, 75, 148, 149, '2018-03-24', 80, 5, 55, 16);
insert into course (course_no, course_name, section, class_size, sais_class_count, sais_waitlisted_count, actual_count, course_date, minutes, units, room_no, empno) values (DEFAULT, 'turpis a pede posuere nonummy integer non velit donec diam neque', 'IN-5L', 91, 145, 122, 19, '2018-03-24', 76, 2, 31, 17);
insert into course (course_no, course_name, section, class_size, sais_class_count, sais_waitlisted_count, actual_count, course_date, minutes, units, room_no, empno) values (DEFAULT, 'libero quis orci nullam molestie nibh in lectus pellentesque at nulla suspendisse potenti cras in', 'CR-4L', 116, 66, 141, 88, '2018-03-24', 72, 2, 68, 18);
insert into course (course_no, course_name, section, class_size, sais_class_count, sais_waitlisted_count, actual_count, course_date, minutes, units, room_no, empno) values (DEFAULT, 'justo aliquam quis turpis eget elit sodales scelerisque mauris sit amet eros', 'SA-8L', 127, 44, 37, 17, '2018-03-24', 109, 3, 52, 19);
insert into course (course_no, course_name, section, class_size, sais_class_count, sais_waitlisted_count, actual_count, course_date, minutes, units, room_no, empno) values (DEFAULT, 'sociis natoque penatibus et magnis dis parturient montes nascetur ridiculus mus etiam vel augue', 'IO-5L', 58, 68, 36, 13, '2018-03-24', 87, 2, 10, 20);

insert into student (student_no, name, status, adviser) values ('2018-23282', 'Eddy Purrier', 'loa', 1);
insert into student (student_no, name, status, adviser) values ('2017-30691', 'Robinetta Knappe', 'loa', 2);
insert into student (student_no, name, status, adviser) values ('2018-67066', 'Cosme Topping', 'dropped', 3);
insert into student (student_no, name, status, adviser) values ('2016-68009', 'Marice Goodchild', 'dropped', 4);
insert into student (student_no, name, status, adviser) values ('2018-05432', 'Dal Eagers', 'dismissed', 5);
insert into student (student_no, name, status, adviser) values ('2018-35865', 'Marmaduke Wintersgill', 'dismissed', 6);
insert into student (student_no, name, status, adviser) values ('2016-25262', 'Kendrick Payton', 'enrolled', 7);
insert into student (student_no, name, status, adviser) values ('2016-27560', 'Gussie Valsler', 'enrolled', 8);
insert into student (student_no, name, status, adviser) values ('2015-56535', 'Katya Fardy', 'enrolled', 9);
insert into student (student_no, name, status, adviser) values ('2017-82739', 'Alfred Bandiera', 'enrolled', 10);
insert into student (student_no, name, status, adviser) values ('2018-19733', 'Vannie Bilbrook', 'enrolled', 11);
insert into student (student_no, name, status, adviser) values ('2018-83712', 'Dennis Wankling', 'enrolled', 12);
insert into student (student_no, name, status, adviser) values ('2018-79569', 'Kippar Thresher', 'enrolled', 13);
insert into student (student_no, name, status, adviser) values ('2018-52649', 'Brewer Jirka', 'enrolled', 14);
insert into student (student_no, name, status, adviser) values ('2018-94008', 'Abram Morillas', 'enrolled', 15);
insert into student (student_no, name, status, adviser) values ('2018-02164', 'Enrique Frangello', 'enrolled', 16);
insert into student (student_no, name, status, adviser) values ('2018-75288', 'Shanon Stinchcombe', 'enrolled', 17);
insert into student (student_no, name, status, adviser) values ('2017-17335', 'Nedda Jorgensen', 'enrolled', 18);
insert into student (student_no, name, status, adviser) values ('2018-99049', 'Rozina MacGahy', 'enrolled', 19);
insert into student (student_no, name, status, adviser) values ('2017-24301', 'Robena Gundry', 'enrolled', 20);

insert into student_advisers_list (student_no, empno) values ('2018-23282', 1);
insert into student_advisers_list (student_no, empno) values ('2017-30691', 2);
insert into student_advisers_list (student_no, empno) values ('2018-67066', 3);
insert into student_advisers_list (student_no, empno) values ('2016-68009', 4);
insert into student_advisers_list (student_no, empno) values ('2018-05432', 5);
insert into student_advisers_list (student_no, empno) values ('2018-35865', 6);
insert into student_advisers_list (student_no, empno) values ('2016-25262', 7);
insert into student_advisers_list (student_no, empno) values ('2016-27560', 8);
insert into student_advisers_list (student_no, empno) values ('2015-56535', 9);
insert into student_advisers_list (student_no, empno) values ('2017-82739', 10);
insert into student_advisers_list (student_no, empno) values ('2018-19733', 11);
insert into student_advisers_list (student_no, empno) values ('2018-83712', 12);
insert into student_advisers_list (student_no, empno) values ('2018-79569', 13);
insert into student_advisers_list (student_no, empno) values ('2018-52649', 14);
insert into student_advisers_list (student_no, empno) values ('2018-94008', 15);
insert into student_advisers_list (student_no, empno) values ('2018-02164', 16);
insert into student_advisers_list (student_no, empno) values ('2018-75288', 17);
insert into student_advisers_list (student_no, empno) values ('2017-17335', 18);
insert into student_advisers_list (student_no, empno) values ('2018-99049', 19);
insert into student_advisers_list (student_no, empno) values ('2017-24301', 20);
