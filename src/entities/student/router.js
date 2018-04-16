import { Router } from 'express';
import * as Ctrl from './controller';
import * as Users from '../user/controller';

const router = Router();

// Get all students
router.get('/api/students/', async (req, res) => {
  try {
    const users = await Ctrl.getAllStudents();
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

// Get Student by Student Number
router.get('/api/students/:student_no', async (req, res) => {
  try {
    const user = await Ctrl.getStudentByStudNo(req.params);
    res.status(200).json({
      status: 200,
      message: 'Successfully fetched student',
      data: user
    });
  } catch (status) {
    res.status(status).json({ status });
  }
});

// Get Student by Student name
router.get('/api/students/name/:name', async (req, res) => {
  try {
    const user = await Ctrl.getStudentByName(req.params);
    res.status(200).json({
      status: 200,
      message: 'Successfully fetched student',
      data: user
    });
  } catch (status) {
    res.status(status).json({ status });
  }
});

// Get Students by Student status
router.get('/api/students/status/:status', async (req, res) => {
  try {
    const user = await Ctrl.getStudentByStatus(req.params);
    res.status(200).json({
      status: 200,
      message: 'Successfully fetched students',
      data: user
    });
  } catch (status) {
    res.status(status).json({ status });
  }
});

// Retrieve all advisers of a student
router.get('/api/students/advisers/:student_no', async (req, res) => {
  try {
    const user = await Ctrl.getAllAdvisersByStudNo(req.params);
    res.status(200).json({
      status: 200,
      message: 'Successfully fetched advisers',
      data: user
    });
  } catch (status) {
    res.status(status).json({ status });
  }
});

// update user adviser
router.put('/api/students/update-adviser', async (req, res) => {
  if (req.body.adviser && req.body.student_no) {
    try {
      await Ctrl.updateStudentAdviser(req.session.user.name, req.body);
      const user = await Ctrl.getStudentByStudNo({
        student_no: req.body.student_no
      });
      res.status(200).json({
        status: 200,
        message: 'Successfully updated student adviser',
        data: user
      });
    } catch (status) {
      res.status(status).json({ status });
    }
  } else {
    res.status(400).json({ status: 400 });
  }
});

// update user
router.put('/api/students/edit', async (req, res) => {
  if (req.body.student_no) {
    try {
      await Ctrl.updateStudent(req.session.user.name, req.body);
      const user = await Ctrl.getStudentByStudNo({
        student_no: req.body.student_no
      });
      res.status(200).json({
        status: 200,
        message: 'Successfully updated student',
        data: user
      });
    } catch (status) {
      res.status(status).json({ status });
    }
  } else {
    res.status(400).json({ status: 400 });
  }
});

// remove student
router.delete('/api/students/:student_no', async (req, res) => {
  try {
    const id = await Ctrl.removeStudent(req.session.user.name, req.params);

    res.status(200).json({
      status: 200,
      message: 'Successfully removed student',
      data: id
    });
  } catch (status) {
    res.status(status).json({ status, message });
  }
});

export default router;
