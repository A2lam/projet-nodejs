import { Router } from 'express';
import listRouter from './lists';
import userRouter from './users';
import setHeaders from './middleware/setHeaders';

const router = Router();

router.use(setHeaders);

router.use(listRouter);

router.use(userRouter);

export default router;
