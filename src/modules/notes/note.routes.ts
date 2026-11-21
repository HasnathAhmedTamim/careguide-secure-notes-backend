import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate';
import { asyncHandler } from '../../utils/asyncHandler';
import * as noteController from './note.controller';

const router = Router();

router.use(authenticate);

router.post('/', asyncHandler(noteController.create));
router.get('/', asyncHandler(noteController.list));
router.get('/:id', asyncHandler(noteController.getById));
router.patch('/:id', asyncHandler(noteController.update));
router.delete('/:id', asyncHandler(noteController.remove));

export default router;
