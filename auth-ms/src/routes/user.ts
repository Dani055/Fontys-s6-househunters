import { Router } from 'express';
import { handleDeleteUser, handleGetUserByUsername, handleGetUsersBulk } from '../controllers/user.controller';
import { isAuth } from 'shared/middleware/is-auth';

const router = Router()
router.get('/:username', handleGetUserByUsername);
router.delete('/:userId',isAuth, handleDeleteUser);
router.post('/getBulk', handleGetUsersBulk);

export default router;