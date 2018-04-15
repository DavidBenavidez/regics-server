import { Router } from 'express';
import * as Ctrl from './controller';

const router = Router();

// Get all courses then output a csv file
router.get('/api/report-generation', async (req, res) => {
  try {
    const courses = await Ctrl.getCourses();

    status: 200,
      res.status(200).json({
        message: 'Successfully genrated report.',
        data: courses
      });
  } catch (status) {
    res.status(status).json({ status });
  }
});

export default router;
