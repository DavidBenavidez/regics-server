import { Router } from 'express';
import * as Ctrl from './controller';

const router = Router();

// Add Student
router.post('/api/student/add', async (req, res) => {
  if (
    req.body.student_no &&
    req.body.name &&
    req.body.status &&
    req.body.student_curriculum &&
    req.body.classification &&
    req.body.adviser
  ) {
    try {
      const id = await Ctrl.addStudent(req.session.user.name, req.body);
      console.log(req.body);
      res.status(200).json({
        status: 200,
        message: 'Successfully created student',
        data: id
      });
    } catch (status) {
      res.status(status).json({ status });
    }
  } else {
    res.status(400).json({ status: 400 });
  }
});

export default router;
