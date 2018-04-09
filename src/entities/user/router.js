import { Router } from 'express';
import * as Ctrl from './controller';

const router = Router();

// Add user
router.post('/api/users', async (req, res) => {
  if (
    req.body.name &&
    req.body.username &&
    req.body.password &&
    req.body.password == req.body.confirm_password &&
    (req.body.system_position == 'faculty' ||
      req.body.system_position == 'head' ||
      req.body.system_position == 'member') &&
    (req.body.status == 'resigned' ||
      req.body.status == 'on_leave' ||
      req.body.status == 'active')
  ) {
    try {
      const id = await Ctrl.addUser(req.body);
      res.status(200).json({
        status: 200,
        message: 'Successfully created user',
        data: id
      });
    } catch (status) {
      res.status(status).json({ status });
    }
  } else {
    res.status(400).json({ status: 400 });
  }
});

// Get all advisers and the students assigned to them
router.get('/api/users/advisers', async (req, res) => {
  try {
    console.log('Tried');
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
router.get('/api/teaching_load', async (req, res) => {
  try {
    const professors = await Ctrl.getAllTeachingLoads();
    res.status(200).json({
      status: 200,
      data: professors
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
    req.body.password &&
    req.body.password == req.body.confirm_password &&
    (req.body.system_position == 'faculty' ||
      req.body.system_position == 'head' ||
      req.body.system_position == 'member') &&
    (req.body.status == 'resigned' ||
      req.body.status == 'on_leave' ||
      req.body.status == 'active') &&
    req.body.teaching_load
  ) {
    try {
      await Ctrl.editUser(req.session.user.name, req.body);
      const user = await Ctrl.getUser({ empno: req.body.empno });

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

// router.get('/api/prof_info/:empno', async (req, res) => {
//   try {
//     const professor = await Ctrl.getProfInfo(req.params);
//     res.status(200).json({
//       status: 200,
//       data: professor
//     });
//   } catch (status) {
//     res.status(status).json({ status });
//   }
// });

export default router;
