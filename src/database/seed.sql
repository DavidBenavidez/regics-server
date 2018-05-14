-- DUMMY  DATA
USE regicsserver;

CALL addUser ('Marie Betel de Robles', 'Betsy', 'mdderobles@up.edu.ph', 'password', 'head', 'active');
CALL addUser ('Anny Whelan', 'awhelan1', 'example1@email.com', '2VWKdGcd', 'faculty', 'active');
CALL addUser ('Sandy Macvain', 'smacvain2', 'example2@email.com', 'Acieo9', 'member', 'on_leave');
CALL addUser ('Thalia Beedell', 'tbeedell3', 'example3@email.com', '2GCz245', 'member', 'on_leave');
CALL addUser ('Oswald Keast', 'okeast4', 'example4@email.com', 'Klm8iXSSp', 'member', 'active');
CALL addUser ('Hermia McCraine', 'hmccraine5', 'example5@email.com', 'tMMlu7ruu1', 'member', 'active');
CALL addUser ('Ailbert Legg', 'alegg6', 'example6@email.com', 'Fy8OjUI', 'member', 'active');
CALL addUser ('Linnie Creffeild', 'lcreffeild7', 'example7@email.com', 'LTZJm32EEpE', 'member', 'active');
CALL addUser ('Gwenora Veschambre', 'gveschambre8', 'example8@email.com', 'UTfZ5Bkp', 'member', 'active');
CALL addUser ('Starla Bodleigh', 'sbodleigh9', 'example9@email.com', 'QHbWCsu5C', 'member', 'active');
CALL addUser ('Audrey Monger', 'amongera', 'example10@email.com', 'FlM1Mj', 'member', 'active');
CALL addUser ('Markos Dudderidge', 'mdudderidgeb', 'example11@email.com', 'OomKCZ7', 'member', 'active');
CALL addUser ('Suzanna Mellanby', 'smellanbyc', 'example12@email.com', 'rCz2bO', 'member', 'active');
CALL addUser ('Elfie Mathewson', 'emathewsond', 'example13@email.com', 'tTsHGyPv', 'member', 'active');
CALL addUser ('Cello Blaydon', 'cblaydone', 'example14@email.com', 'Pi3j7dfy', 'member', 'active');
CALL addUser ('Talbot Bernat', 'tbernatf', 'example15@email.com', 'sSSdJH', 'member', 'active');
CALL addUser ('Dov Goddard', 'dgoddardg', 'example16@email.com', 'R71u1DG', 'member', 'resigned');
CALL addUser ('Roseann Franklyn', 'rfranklynh', 'example17@email.com', 'eGfz799', 'faculty', 'active');
CALL addUser ('Shaughn Tumielli', 'stumiellii', 'example18@email.com', 'vO4ndRz', 'faculty', 'active');
CALL addUser ('Cissy Giraudot', 'cgiraudotj', 'example19@email.com', 'wve0ducx', 'faculty', 'active');

insert into room (room_no, room_name) values (112, 'C-112');
insert into room (room_no, room_name) values (114, 'C-114');
insert into room (room_no, room_name) values (115, 'C-115');
insert into room (room_no, room_name) values (116, 'C-116');
insert into room (room_no, room_name) values (117, 'C-117');
insert into room (room_no, room_name) values (118, 'C-118');
insert into room (room_no, room_name) values (119, 'C-119');
insert into room (room_no, room_name) values (120, 'Server Room');
insert into room (room_no, room_name) values (121, 'C-121');
insert into room (room_no, room_name) values (122, 'C-122');
insert into room (room_no, room_name) values (123, 'C-123');
insert into room (room_no, room_name) values (124, 'Library');
insert into room (room_no, room_name) values (125, 'C-125');
insert into room (room_no, room_name) values (126, 'C-126');
insert into room (room_no, room_name) values (127, 'C-127a');
insert into room (room_no, room_name) values (1272, 'C-127');
insert into room (room_no, room_name) values (128, 'Control Room');
insert into room (room_no, room_name) values (129, 'PCLAB 8');
insert into room (room_no, room_name) values (200, 'HPC Lab');
insert into room (room_no, room_name) values (201, 'PCLAB 1');
insert into room (room_no, room_name) values (202, 'PCLAB 4');
insert into room (room_no, room_name) values (203, 'PCLAB 2');
insert into room (room_no, room_name) values (204, 'PCLAB 5');
insert into room (room_no, room_name) values (205, 'PCLAB 3');
insert into room (room_no, room_name) values (206, 'ICSMH');
insert into room (room_no, room_name) values (300, 'Admin Staff');
insert into room (room_no, room_name) values (301, 'G5 Room');
insert into room (room_no, room_name) values (302, 'PCLAB 8');
insert into room (room_no, room_name) values (303, 'PCLAB 6');
insert into room (room_no, room_name) values (304, 'PCLAB 9');
insert into room (room_no, room_name) values (305, 'PCLAB 7');
insert into room (room_no, room_name) values (306, 'ICS LH 3');
insert into room (room_no, room_name) values (308, 'ICS LH 4');

CALL addCourse(
    'Betel de Robles', 
    'CMSC 128', 
    'A', 
    70, 
    64, 
    142, 
    12,  
    '7:00:00', 
    '8:00:00', 
    1, 
    3, 
    2.75, 
    'false', 
    'approved', 
    'Wednesday',
    'Friday',
    '', 
    206, 
    1
);
CALL addCourse(
    'Betel de Robles', 
    'CMSC 128', 
    'A-1L', 
    70, 
    64, 
    142, 
    12,  
    '10:00:00', 
    '13:00:00', 
    3, 
    3, 
    5.75, 
    'true', 
    'approved', 
    'Tuesday',
    NULL,
    '', 
    202, 
    1
);

CALL addCourse(
    'Betel de Robles', 
    'CMSC 128', 
    'A-2L', 
    70, 
    64, 
    142, 
    12,  
    '10:00:00', 
    '13:00:00', 
    3, 
    3, 
    2.75, 
    'true', 
    'approved', 
    'Tuesday',
    'Thursday',
    '', 
    204, 
    2
);

insert into student (student_no, name, status, classification, student_curriculum, adviser) values ('2018-23282', 'Eddy Purrier', 'loa','freshman','2018', 1);
insert into student (student_no, name, status, classification, student_curriculum, adviser) values ('2017-30691', 'Robinetta Knappe', 'loa','freshman','2018', 2);
insert into student (student_no, name, status, classification, student_curriculum, adviser) values ('2018-67066', 'Cosme Topping', 'dropped','freshman','2018', 3);
insert into student (student_no, name, status, classification, student_curriculum, adviser) values ('2016-68009', 'Marice Goodchild', 'dropped','freshman','2018', 4);
insert into student (student_no, name, status, classification, student_curriculum, adviser) values ('2018-05432', 'Dal Eagers', 'dismissed','freshman','2018', 5);
insert into student (student_no, name, status, classification, student_curriculum, adviser) values ('2018-35865', 'Marmaduke Wintersgill', 'dismissed','freshman','2018', 6);
insert into student (student_no, name, status, classification, student_curriculum, adviser) values ('2016-25262', 'Kendrick Payton', 'enrolled', 'sophomore', '2011', 7);
insert into student (student_no, name, status, classification, student_curriculum, adviser) values ('2016-27560', 'Gussie Valsler', 'enrolled', 'sophomore', '2011', 8);
insert into student (student_no, name, status, classification, student_curriculum, adviser) values ('2015-56535', 'Katya Fardy', 'enrolled', 'sophomore', '2011', 9);
insert into student (student_no, name, status, classification, student_curriculum, adviser) values ('2017-82739', 'Alfred Bandiera', 'enrolled', 'sophomore', '2011', 10);
insert into student (student_no, name, status, classification, student_curriculum, adviser) values ('2018-19733', 'Vannie Bilbrook', 'enrolled', 'sophomore', '2011', 11);
insert into student (student_no, name, status, classification, student_curriculum, adviser) values ('2018-83712', 'Dennis Wankling', 'enrolled', 'sophomore', '2011', 12);
insert into student (student_no, name, status, classification, student_curriculum, adviser) values ('2018-79569', 'Kippar Thresher', 'enrolled', 'sophomore', '2011', 13);
insert into student (student_no, name, status, classification, student_curriculum, adviser) values ('2018-52649', 'Brewer Jirka', 'enrolled', 'sophomore', '2011', 14);
insert into student (student_no, name, status, classification, student_curriculum, adviser) values ('2018-94008', 'Abram Morillas', 'enrolled', 'sophomore', '2011', 15);
insert into student (student_no, name, status, classification, student_curriculum, adviser) values ('2018-02164', 'Enrique Frangello', 'enrolled', 'sophomore', '2011', 16);
insert into student (student_no, name, status, classification, student_curriculum, adviser) values ('2018-75288', 'Shanon Stinchcombe', 'enrolled', 'junior', '2011', 17);
insert into student (student_no, name, status, classification, student_curriculum, adviser) values ('2017-17335', 'Nedda Jorgensen', 'enrolled', 'junior', '2011', 18);
insert into student (student_no, name, status, classification, student_curriculum, adviser) values ('2018-99049', 'Rozina MacGahy', 'enrolled', 'senior', '2011', 19);
insert into student (student_no, name, status, classification, student_curriculum, adviser) values ('2017-24301', 'Robena Gundry', 'enrolled', 'senior', '2011', 20);

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