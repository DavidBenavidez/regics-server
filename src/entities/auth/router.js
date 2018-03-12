import { Router } from 'express';
import * as Ctrl from './controller';

const router = Router();

router.post('/api/login', async (req, res) => {
  try {
    const user = await Ctrl.login(req.body);
    req.session.user = user;
    res.status(200).json({
      status: 200,
      message: 'Successfully logged in',
      data: user
    });
  } catch (status) {
    res.status(status).json({ status });
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

export default router;
