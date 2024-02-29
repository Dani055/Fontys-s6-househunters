import { Router } from 'express';
import { handleGetUserByUsername, handleGetUsersBulk } from '../controllers/user.controller';

const router = Router()
router.get('/:username', handleGetUserByUsername);
router.post('/getBulk', handleGetUsersBulk);

export default router;