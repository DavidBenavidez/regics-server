import { Router } from 'express';
import * as Ctrl from './controller';

const router = Router();

router.put('/api/course/swap-prof', async (req, res) => {
  if (req.body.course_no && req.body.empno) {
    try {
      await Ctrl.swapProf(req.session.user.name, req.body);
      const user = await Ctrl.getCourse({ course_no: req.body.course_no });
      res.status(200).json({
        status: 200,
        message: 'Successfully swapped profs',
        data: user
      });
    } catch (status) {
      res.status(status).json({ status });
    }
  } else {
    res.status(400).json({ status: 400 });
  }
});

// Get all courses
router.get('/api/course', async (req, res) => {
  try {
    const users = await Ctrl.getAllCourses();
    res.status(200).json({
      status: 200,
      message: 'Successfully fetched courses',
      data: users
    });
  } catch (status) {
    res.status(status).json({ status });
  }
});

// Get course by course number
router.get('/api/course/:course_no', async (req, res) => {
  try {
    const users = await Ctrl.getCourse(req.params);
    res.status(200).json({
      status: 200,
      message: 'Successfully fetched course',
      data: users
    });
  } catch (status) {
    res.status(status).json({ status });
  }
});

//Get course by empno
router.get('/api/course/empno/:empno', async (req, res) => {
  try {
    const course = await Ctrl.getCoursesByEmpno(req.params);
    res.status(200).json({
      status: 200,
      message: 'Successfully fetched courses',
      data: course
    });
  } catch (status) {
    res.status(status).json({ status });
  }
});

// edit course
router.put('/api/course/edit', async (req, res) => {
  if (
    req.body.course_no &&
    req.body.course_name &&
    req.body.section &&
    req.body.class_size &&
    req.body.sais_class_count &&
    req.body.sais_waitlisted_count &&
    req.body.actual_count &&
    req.body.course_date &&
    req.body.course_time_start &&
    req.body.course_time_end &&
    req.body.minutes &&
    req.body.units &&
    (req.body.is_lab == 'true' || req.body.is_lab == 'false') &&
    (req.body.course_status == 'dissolved' ||
      req.body.course_status == 'petitioned' ||
      req.body.course_status == 'addition' ||
      req.body.course_status == 'approved') &&
    req.body.reason &&
    req.body.room_no &&
    req.body.empno
  ) {
    try {
      await Ctrl.editCourse(req.session.user.name, req.body);
      const user = await Ctrl.getCourse({ course_no: req.body.course_no });
      res.status(200).json({
        status: 200,
        message: 'Successfully edited course',
        data: user
      });
    } catch (status) {
      res.status(status).json({ status });
    }
  } else {
    res.status(400).json({ status: 400 });
  }
});

// Get all rooms
router.get('/api/rooms', async (req, res) => {
  try {
    const rooms = await Ctrl.getAllRooms();
    res.status(200).json({
      status: 200,
      message: 'Successfully fetched rooms',
      data: rooms
    });
  } catch (status) {
    res.status(status).json({ status });
  }
});

export default router;
