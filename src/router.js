import { Router } from 'express';

// INSERT ROUTERS HERE EXAMPLE BELOW
// import exampleRouter from './entities/exampleEntity/router';
import userRouter from './entities/user/router';

const router = Router();

// USE ROUTER HERE EXAMPLE BELOW
//router.use(exampleRouter);
// router.use('/', authRouter);
router.use(userRouter);

export default router;
