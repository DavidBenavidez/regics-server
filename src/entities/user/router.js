import { Router } from 'express';
import * as Ctrl from './controller';
import { countItems } from '../utils/';

const router = Router();

// Get all advisers and the students assigned to them
router.get('/api/users/advisers', async (req, res) => {
  try {
    const users = await Ctrl.getAdvisersAndAdvisees();
    res.status(200).json({
      status: 200,
      message: 'Successfully fetched advisers',
      data: users
    });
  } catch (status) {
    res.status(status).json({ status });
  }
});

// Get all advisee count by classification
router.get('/api/students-count', async (req, res) => {
  try {
    const users = await Ctrl.getAllAdviseeClassification();
    res.status(200).json({
      status: 200,
      message: 'Successfully fetched users',
      data: users
    });
  } catch (status) {
    let message = '';
    res.status(status).json({ status });
  }
});

// Get All Users/Professors/Instructors
router.get('/api/users', async (req, res) => {
  try {
    const id = await Ctrl.getUsers();
    res.status(200).json({
      status: 200,
      data: id
    });
  } catch (status) {
    res.status(status).json({ status });
  }
});

//Get suggested adviser
router.get('/api/users/suggested-advisers', async (req, res) => {
  try {
    const users = await Ctrl.getSuggestedAdviser();
    res.status(200).json({
      status: 200,
      message: 'Successfully fetched advisers',
      data: users
    });
  } catch (status) {
    res.status(status).json({ status });
  }
});

// Get active users
router.get('/api/users/active', async (req, res) => {
  try {
    const id = await Ctrl.getActiveUsers();
    res.status(200).json({
      status: 200,
      data: id
    });
  } catch (status) {
    res.status(status).json({ status });
  }
});

// Get User
router.get('/api/users/:empno', async (req, res) => {
  try {
    const user = await Ctrl.getUser(req.params);
    res.status(200).json({
      status: 200,
      data: user
    });
  } catch (status) {
    res.status(status).json({ status });
  }
});

// getAllTeachingLoads
router.get('/api/teaching_load/:page', async (req, res) => {
  try {
    const { pages } = await countItems('log_data', 15);
    if (req.params.page > pages) {
      res.status(400).json({
        status: 400,
        message: 'Invalid logs pagination'
      });
    } else {
      const professors = await Ctrl.getAllTeachingLoads(req.params.page);
      res.status(200).json({
        status: 200,
        data: { data: professors, pages: pages }
      });
    }
  } catch (status) {
    res.status(status).json({ status });
  }
});

// get teaching load by prof
router.get('/api/teaching-load/:empno', async (req, res) => {
  try {
    const courses = await Ctrl.getTeachingLoad(req.params);
    res.status(200).json({
      status: 200,
      data: courses
    });
  } catch (status) {
    res.status(status).json({ status });
  }
});

// update user
router.put('/api/users/', async (req, res) => {
  if (
    req.body.empno &&
    req.body.name &&
    req.body.username &&
    req.body.email &&
    (req.body.status == 'resigned' ||
      req.body.status == 'on_leave' ||
      req.body.status == 'active') &&
    req.body.teaching_load != null
  ) {
    try {
      await Ctrl.checkExists(req.body);
      await Ctrl.checkEmail(req.body);
      await Ctrl.editUser(req.session.user.name, req.body);
      const user = await Ctrl.getUser({ empno: req.body.empno });

      req.session.user.name = user.name;
      req.session.user.firstName = user.name.split(' ')[0];
      req.session.user.status = user.status;
      req.session.user.username = user.username;
      req.session.user.email = user.email;
      res.status(200).json({
        status: 200,
        message: 'Successfully edited user',
        data: user
      });
    } catch (status) {
      res.status(status).json({ status });
    }
  } else {
    res.status(400).json({ status: 400 });
  }
});

router.put('/api/users/editPassword', async (req, res) => {
  if (
    req.body.username &&
    req.body.password &&
    req.body.new_password === req.body.confirm_password &&
    req.body.new_password !== req.body.password
  ) {
    try {
      var user = await Ctrl.checkPassword(req.body);
      await Ctrl.editPassword(req.session.user.name, req.body);
      res.status(200).json({
        status: 200,
        message: 'Successfully updated password',
        data: user
      });
    } catch (status) {
      res.status(status).json({ status });
    }
  } else {
    res.status(400).json({ status: 400 });
  }
});

// Remove Adviser/Advisee
router.delete('/api/deleteStudentAdviser/:id', async (req, res) => {
  try {
    const id = await Ctrl.deleteAdviserAdvisee(
      req.session.user.name,
      req.params.id
    );

    res.status(200).json({
      status: 200,
      message: 'successfully deleted user',
      data: id
    });
  } catch (status) {
    res.status(status).json({ status });
  }
});

export default router;
