import { Router } from 'express';
import * as Ctrl from './controller';

const router = Router();

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

// Remove Course
router.delete('/api/course/delete/:course_no', async (req, res) => {
  try {
    const id = await Ctrl.removeCourse(req.params);
    res.status(200).json({
      status: 200,
      message: 'successfully deleted course',
      data: id
    });
  } catch (status) {
    res.status(status).json({ status });
  }
});

// update course
router.put('/api/users/update', async (req, res) => {
  try {
    await Ctrl.editCourse(req.body);
    const user = await Ctrl.getCourse({ course_no: req.body.course_no });
    res.status(200).json({
      status: 200,
      message: 'Successfully edited course',
      data: user
    });
  } catch (status) {
    res.status(status).json({ status });
  }
});

export default router;
