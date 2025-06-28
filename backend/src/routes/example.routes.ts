import { Router } from 'express';
import { ExampleController } from '../controllers/example.controller';
import { asyncHandler } from '../utils/asyncHandler';

const router: Router = Router();
const exampleController = new ExampleController();

// Example routes
router.get('/', asyncHandler(exampleController.getAll));
router.get('/:id', asyncHandler(exampleController.getById));
router.post('/', asyncHandler(exampleController.create));
router.put('/:id', asyncHandler(exampleController.update));
router.delete('/:id', asyncHandler(exampleController.delete));

// Travel research route
router.post('/travel/research', exampleController.researchTravel);

export default router;
