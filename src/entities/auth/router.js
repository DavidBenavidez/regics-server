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
      await Ctrl.checkExists(req.body);
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

router.post('/api/login', async (req, res) => {
  try {
    await Ctrl.checkUser(req.body);
    const user = await Ctrl.login(req.body);
    req.session.user = user;

    res.status(200).json({
      status: 200,
      message: 'Successfully logged in',
      data: user
    });
  } catch (status) {
    let message = '';

    switch (status) {
      case 500:
        message = 'Internal server error while logging in';
        break;
      case 404:
        message = 'User does not exist';
        break;
      case 401:
        message = 'Incorrect username and password combination';
        break;
    }

    res.status(status).json({ status, message });
  }
});

router.post('/api/logout', (req, res) => {
  req.session.user = null;
  res.status(200).json({
    status: 200,
    message: 'Successfully logged out'
  });
});

router.post('/api/session', (req, res) => {
  res.status(200).json({
    status: 200,
    message: 'Successfully fetched current session',
    data: req.session.user ? req.session.user : null
  });
});

router.post('/api/check-session', (req, res) => {
  res.status(200).json({
    status: 200,
    message: 'Successfully fetched current session',
    data: req.session.user ? req.session.user : null
  });
});

export default router;
