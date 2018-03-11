import { Router } from 'express';
import * as Ctrl from './controller';

const router = Router();

// get all users
router.get('/api/users', async (req, res) => {
  try {
    const users = await Ctrl.getAllUsers();
    res.status(200).json({
      status: 200,
      message: 'Successfullyhahahasudqwiduqsd fetched users',
      data: users
    });
  } catch (status) {
    let message = '';
    switch (status) {
      case 500:
        message = 'Internal server error';
        break;
    }
    res.status(200).json({ status, message });
  }
});

// test cahnge
router.get('/api/testchange', async (req, res) => {
  try {
    const users = await Ctrl.getAllUsers();
    res.status(200).json({
      status: 200,
      message: ' testchangge',
      data: users
    });
  } catch (status) {
    let message = '';
    switch (status) {
      case 500:
        message = 'Internal server error';
        break;
      case 408:
        message = 'test message not found';
        break;
    }
    res.status(200).json({ status, message });
  }
});

// getUser
router.get('/api/users/:empno', async (req, res) => {
  try {
    const user = await Ctrl.getUser(req.params);
    res.status(200).json({
      status: 200,
      message: 'Successfully fetched user',
      data: user
    });
  } catch (status) {
    let message = '';
    switch (status) {
      case 404:
        message = 'User not found';
        break;
      case 500:
        message = 'Internal server error';
        break;
    }
    res.status(status).json({ status, message });
  }
});

// removeUser
router.delete('/api/users/:empno', async (req, res) => {
  try {
    const id = await Ctrl.removeUser(req.params);

    res.status(200).json({
      status: 200,
      message: 'Successfully removed user',
      data: id
    });
  } catch (status) {
    let message = '';
    switch (status) {
      case 404:
        message = 'User not found';
        break;
      case 500:
        message = 'Internal server error';
        break;
    }
    res.status(status).json({ status, message });
  }
});

export default router;
