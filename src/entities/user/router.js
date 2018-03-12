import { Router } from 'express';
import * as Ctrl from './controller';

const router = Router();

// Get all Users
router.get('/api/users', async (req, res) => {
  try {
    const users = await Ctrl.getAllUsers();
    res.status(200).json({
      status: 200,
      message: 'Successfully fetched users',
      data: users
    });
  } catch (status) {
    res.status(200).json({ status });
  }
});

// Get User
router.get('/api/users/:empno', async (req, res) => {
  try {
    const user = await Ctrl.getUser(req.params);
    res.status(200).json({
      status: 200,
      message: 'Successfully fetched user',
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
      message: 'Successfully removed user',
      data: id
    });
  } catch (status) {
    res.status(status).json({ status });
  }
});

export default router;
