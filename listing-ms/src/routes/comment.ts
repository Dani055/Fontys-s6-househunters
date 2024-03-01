import { Router } from 'express';
import { isAuth } from 'shared/middleware/is-auth';
import { handleCreateComment, handleRemoveComment } from '../controllers/comment.controller';

const router = Router()

router.post('/', isAuth, handleCreateComment);
router.delete('/:commentId', isAuth, handleRemoveComment);

export default router;