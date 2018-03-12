import { Router } from 'express';
import * as Ctrl from './controller';

const router = Router();

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

// Remove User
router.delete('/api/users/:empno', async (req, res) => {
  try {
    const id = await Ctrl.removeUser(req.params);

    res.status(200).json({
      status: 200,
      message: 'successfully deleted user',
      data: id
    });
  } catch (status) {
    res.status(status).json({ status });
  }
});

// Add User
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
      res.status(500).json({ status });
    }
  } else {
    res.status(400).json({ status: 400 });
  }
});

// update user
router.put('/api/users/', async (req, res) => {
  try {
    await Ctrl.editUser(req.body);
    const user = await Ctrl.getUser({ empno: req.body.empno });

    res.status(200).json({
      status: 200,
      message: 'Successfully edited user',
      data: user
    });
  } catch (status) {
    res.status(status).json({ status });
  }
});

export default router;
