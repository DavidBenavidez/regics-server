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

// router.get('/api/prof_info/:empno', async (req, res) => {
//   try {
//     const professor = await Ctrl.getProfInfo(req.params);
//     res.status(200).json({
//       status: 200,
//       data: professor
//     });
//   } catch (status) {
//     res.status(status).json({ status });
//   }
// });
export default router;
