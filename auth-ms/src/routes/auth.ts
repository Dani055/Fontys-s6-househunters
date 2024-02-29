
import { Router } from 'express';
import { isAuth } from 'shared/middleware/is-auth';
import { requireEmailPassword } from '../middleware/requireEmailPassword';
import { handleGetuserByToken, handleLogin, handleRegister } from '../controllers/auth.controller';

const router = Router()
router.post('/login', requireEmailPassword, handleLogin);
router.post('/register', handleRegister);
router.get('/checkkey', isAuth, handleGetuserByToken);

export default router;
