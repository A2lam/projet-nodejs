import { Router } from 'express';

import find from './middleware/find';
import findOne from './middleware/findOne';
import createOne from './middleware/createOne';
import deleteOne from './middleware/deleteOne';
import updateOne from './middleware/updateOne';

const router = Router();

// Users
router.get('/users', find);

// User
router.post('/users', createOne);
router.get('/users/:email', findOne);
router.delete('/users/:email', deleteOne);
router.patch('/users/:email', updateOne);

export default router;
