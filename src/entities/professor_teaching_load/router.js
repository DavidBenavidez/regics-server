import { Router } from 'express';
import * as Ctrl from './controller';

const router = Router();

router.get('/api/prof_teaching_load', async (req, res) => {
  try {
    const users = await Ctrl.getAllUsers();
    res.status(200).json({
      status: 200,
      message: 'Successfully fetched users',
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

// getUser
router.get('/api/prof_teaching_load/:empnum', async (req, res) => {
  try {
    const user = await Ctrl.getEmployee(req.params);
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

// add
router.post('/api/prof_teaching_load/add', async (req, res) => {
  try {
    const user = await Ctrl.add_teaching_load(req.body);

    res.status(200).json({
      status: 200,
      message: 'Successfully created account',
      data: user
    });
  } catch (status) {
    let message = '';
    switch (status) {
      case 500:
        message = 'Internal server error on creating new account';
        break;
      case 400:
        message = 'Username already exists';
        break;
    }

    res.status(status).json({ status, message });
  }
});

// update
router.post('/api/prof_teaching_load/update', async (req, res) => {
  try {
    const user = await Ctrl.update_teaching_load(req.body);

    res.status(200).json({
      status: 200,
      message: 'Successfully updated account',
      data: user
    });
  } catch (status) {
    let message = '';
    switch (status) {
      case 500:
        message = 'Internal server error on updating account';
        break;
      case 404:
        message = 'User not found';
        break;
    }

    res.status(status).json({ status, message });
  }
});


router.delete('/api/prof_teaching_load/delete/:empnum', async (req, res) => {
  try {
    const id = await Ctrl.deleteEmployee(req.params);

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