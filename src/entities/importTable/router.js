import { Router } from 'express';
import * as Ctrl from './controller';

const router = Router();

router.post('/api/students/import', async (req, res) => {
  try {
    const string = await Ctrl.importStudent(req.body);
    res.status(200).json({
      status: 200,
      message: 'Successfully imported students',
      data: string
    });
  } catch (status) {
    res.status(status).json({ status });
  }
});

export default router;
