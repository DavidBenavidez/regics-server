import { Router } from 'express';
import * as Ctrl from './controller';

const router = Router();

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
      res.status(status).json({ status });
    }
  } else {
    res.status(400).json({ status: 400 });
  }
});

// Remove User
router.delete('/api/users/:empno', async (req, res) => {
  try {
    if (req.session.user.empno == req.params.empno) {
      return res.status(400).json({ status: 400 });
    }

    const id = await Ctrl.removeUser(req.session.user.name, req.params);

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
