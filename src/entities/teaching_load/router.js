import { Router } from 'express';
import * as Ctrl from './controller';

const router = Router();

// getAllTeachingLoads
router.get('/api/teaching_load', async (req, res) => {
  try {
    const professors = await Ctrl.getAllTeachingLoads(req.params);
    res.status(200).json({
      status: 200,
      data: professors
    });
  } catch (status) {
    res.status(status).json({ status });
  }
});

export default router;
