import { Router } from 'express';
import * as Ctrl from './controller';

const router = Router();

router.post('/api/students/import', async (req, res) => {
  try {
    const string = await Ctrl.importStudent(req.session.user.name, req.body);
    res.status(200).json({
      status: 200,
      message: 'Successfully imported students',
      data: string
    });
  } catch (status) {
    res.status(status).json({ status });
  }
});

router.post('/api/course/import', async (req, res) => {
  try {
    const string = await Ctrl.importCourse(req.session.user.name, req.body);
    res.status(200).json({
      status: 200,
      message: 'Successfully imported courses',
      data: string
    });
  } catch (status) {
    res.status(status).json({ status });
  }
});

export default router;
