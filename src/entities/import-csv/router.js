import { Router } from 'express';
import * as Ctrl from './controller';

const router = Router();

router.post('/api/course/import', async (req, res) => {
  try {
    await Ctrl.importCourses(req.session.user.name, req.body.data);
    res.status(200).json({
      status: 200,
      message: 'Successfully created course'
    });
  } catch (status) {
    res.status(status).json({ status });
  }
});

export default router;
