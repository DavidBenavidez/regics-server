import { Router } from 'express';
import * as Ctrl from './controller';

const router = Router();

// Get all advisers and the students assigned to them
router.get('/api/report-generation', async (req, res) => {
  try {
    const courses = await Ctrl.getCourses();

    status: 200,
      res.status(200).json({
        message: 'Successfully fetched courses',
        data: courses
      });
  } catch (status) {
    res.status(status).json({ status });
  }
});

export default router;
