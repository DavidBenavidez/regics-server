import { Router } from 'express';
import * as Ctrl from './controller';

const router = Router();

router.get('/api/logs/', async (req, res) => {
  try {
    const logs = await Ctrl.getLogs();
    res.status(200).json({
      status: 200,
      message: 'Successfully fetched logs',
      data: logs
    });
  } catch (status) {
    res
      .status(status)
      .json({ status, message: 'Internal server error while getting logs' });
  }
});

export default router;
