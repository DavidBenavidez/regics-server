import { Router } from 'express';
import * as Ctrl from './controller';
import { countItems } from '../utils/';

const router = Router();

router.get('/api/logs/:page', async (req, res) => {
  try {
    const { pages } = await countItems('log_data', 15);
    if (req.params.page > pages) {
      res.status(400).json({
        status: 400,
        message: 'Invalid logs pagination'
      });
    } else {
      const logs = await Ctrl.getLogs(req.params.page);
      res.status(200).json({
        status: 200,
        message: 'Successfully fetched logs',
        data: { data: logs, pages: pages }
      });
    }
  } catch (status) {
    res
      .status(status)
      .json({ status, message: 'Internal server error while getting logs' });
  }
});

export default router;
