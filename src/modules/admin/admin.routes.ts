import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import { asyncHandler } from '../../utils/asyncHandler';
import * as adminController from './admin.controller';

const router = Router();

router.use(authenticate, authorize('admin'));

router.get('/notes', asyncHandler(adminController.listNotes));

router.get('/users', asyncHandler(adminController.listUsers));
router.post('/users', asyncHandler(adminController.createUser));
router.get('/users/:id', asyncHandler(adminController.getUser));
router.patch('/users/:id', asyncHandler(adminController.updateUser));
router.delete('/users/:id', asyncHandler(adminController.deleteUser));

export default router;
