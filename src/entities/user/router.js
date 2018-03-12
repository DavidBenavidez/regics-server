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
      data: id
    });
  } catch (status) {
    res.status(status).json({ status });
  }
});

// Add User
router.post('/api/users', async (req, res) => {
  try {
    const id = await Ctrl.addUser(req.body);
    res.status(200).json({
      status: 200,
      message: 'Successfully added user',
      data: id
    });
  } catch (status) {
    res.status(status).json({ status });
  }
});

export default router;
