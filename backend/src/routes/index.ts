import { Router } from 'express';
import exampleRoutes from './example.routes';
import transcribeRoutes from './transcribe.routes';

const router: Router = Router();

// Health check route
router.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    message: 'Server is healthy',
    timestamp: new Date().toISOString(),
  });
});

// Mount route modules
router.use('/examples', exampleRoutes);

router.use('/transcribe', transcribeRoutes);

export default router;
