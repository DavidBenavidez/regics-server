import { Router } from 'express';

// INSERT ROUTERS HERE EXAMPLE BELOW
// import exampleRouter from './entities/exampleEntity/router';
import userRouter from './entities/user/router';
import authRouter from './entities/auth/router';
import studentRouter from './entities/student/router';
import profTeachingLoadRouter from './entities/professor_teaching_load/router';

const router = Router();

// USE ROUTER HERE EXAMPLE BELOW
//router.use(exampleRouter);
// router.use('/', authRouter);

router.use(userRouter);
router.use(authRouter);
router.use(studentRouter);
router.use(profTeachingLoadRouter);

export default router;
