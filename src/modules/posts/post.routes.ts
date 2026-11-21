import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate';
import { asyncHandler } from '../../utils/asyncHandler';
import * as postController from './post.controller';

const router = Router();

router.use(authenticate);

router.get('/', asyncHandler(postController.list));
router.post('/', asyncHandler(postController.create));

export default router;
