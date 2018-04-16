import { Router } from 'express';
import * as Ctrl from './controller';

const router = Router();

// Get all courses then output a csv file
router.get('/api/report-generation/course-offering', async (req, res) => {
  try {
    const courses = await Ctrl.generateCourseOffering();

    status: 200,
      res.status(200).json({
        message: 'Successfully generated report.',
        data: courses
      });
  } catch (status) {
    res.status(status).json({ status });
  }
});

router.get('/api/report-generation/teaching-load', async (req, res) => {
  try {
    const teachingLoad = await Ctrl.generateTeachingLoad();

    status: 200,
      res.status(200).json({
        message: 'Successfully generated report.',
        data: teachingLoad
      });
  } catch (status) {
    res.status(status).json({ status });
  }
});

router.get('/api/report-generation/student-count', async (req, res) => {
  try {
    const teachingLoad = await Ctrl.generateStudentCount();

    status: 200,
      res.status(200).json({
        message: 'Successfully generated report.',
        data: teachingLoad
      });
  } catch (status) {
    res.status(status).json({ status });
  }
});

router.get('/api/report-generation/students', async (req, res) => {
  try {
    const users = await Ctrl.generateStudents();
    res.status(200).json({
      status: 200,
      message: 'Successfully fetched students',
      data: users
    });
  } catch (status) {
    let message = '';
    res.status(status).json({ status });
  }
});

router.get('/api/report-generation/rooms', async (req, res) => {
  try {
    const rooms = await Ctrl.generateRooms();
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
