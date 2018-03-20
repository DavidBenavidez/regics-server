import { Router } from 'express';
import * as Ctrl from './controller';

const router = Router();

// Get all advisers and the students assigned to them
router.get('/api/report-generation/generate', async (req, res) => {
  try {
    const users = await Ctrl.getUser();
    res.status(200).json({
      status: 200,
      message: 'Successfully fetched advisers',
      data: users
    });
  } catch (status) {
    res.status(status).json({ status });
  }
});

export default router;
