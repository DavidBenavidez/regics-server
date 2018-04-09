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

router.use(userRouter);
router.use(authRouter);

// Middleware for auth
router.use((req, res, next) => {
  if (req.session.user) {
    return next();
  }

  res.status(401).json({
    status: 401,
    message: 'Must be logged in'
  });
});

// USE ROUTER HERE EXAMPLE BELOW
// router.use(exampleRouter);

router.use(courseRouter);
router.use(studentRouter);
router.use(reportGenerationRouter);

router.use((req, res, next) => {
  if (req.session.user.system_position === 'head') {
    return next();
  }

  res.status(401).json({
    status: 401,
    message: 'You have no correct privilege to access this data'
  });
});

router.use(logRouter);

export default router;
