import { Router } from 'express';

import authRouter from './entities/auth/router';

import userRouter from './entities/user/router';
import adminUserRouter from './entities/user/adminRouter';

import studentRouter from './entities/student/router';

import courseRouter from './entities/course/router';
import adminCourseRouter from './entities/course/adminRouter';
import adminStudentRouter from './entities/student/adminRouter';
import importRouter from './entities/importTable/router';

import logRouter from './entities/log/router';

const router = Router();

router.use(authRouter);

// Middleware for auth
router.use((req, res, next) => {
  if (req.session.user) {
    return next();
  }

  res.status(401).json({
    status: 401,
    message: 'Not logged in'
  });
});

router.use(userRouter);
router.use(courseRouter);
router.use(studentRouter);
router.use(importRouter);

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
router.use(adminUserRouter);
router.use(adminCourseRouter);
router.use(adminStudentRouter);

export default router;
