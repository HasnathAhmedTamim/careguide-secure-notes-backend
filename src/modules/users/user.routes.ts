import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate';
import { asyncHandler } from '../../utils/asyncHandler';
import * as userController from './user.controller';

const router = Router();

router.get(
  '/grouped-by-interests',
  authenticate,
  asyncHandler(userController.groupedByInterests)
);

router.get('/:id/posts', authenticate, asyncHandler(userController.userPosts));

export default router;
