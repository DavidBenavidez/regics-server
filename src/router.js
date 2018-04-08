import { Router } from 'express';

// INSERT ROUTERS HERE EXAMPLE BELOW
// import exampleRouter from './entities/exampleEntity/router';
import userRouter from './entities/user/router';
import authRouter from './entities/auth/router';
import studentRouter from './entities/student/router';
import courseRouter from './entities/course/router';
import reportGenerationRouter from './entities/report-generation/router';
import logRouter from './entities/log/router';

const router = Router();

// USE ROUTER HERE EXAMPLE BELOW
// router.use(exampleRouter);

router.use(userRouter);
router.use(authRouter);
router.use(courseRouter);
router.use(studentRouter);
router.use(reportGenerationRouter);
router.use(logRouter);

export default router;
