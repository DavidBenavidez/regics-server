import { Router } from 'express';
import * as Ctrl from './controller';

const router = Router();

// Get all User Info
router.get('/api/users-info', async (req, res) => {
  try {
    const id = await Ctrl.getUsersInfo();
    res.status(200).json({
      status: 200,
      data: id
    });
  } catch (status) {
    res.status(status).json({ status });
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
