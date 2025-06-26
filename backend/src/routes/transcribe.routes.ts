import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { TranscribeController } from '@/controllers/transcribe.controller';

const router: Router = Router();
const transcribeController = new TranscribeController();

router.post('/', asyncHandler(transcribeController.process));

// router.get('/:id', asyncHandler(transcribeController.getById));
// router.post('/', asyncHandler(transcribeController.create));
// router.put('/:id', asyncHandler(transcribeController.update));
// router.delete('/:id', asyncHandler(exampleController.delete));

export default router;
