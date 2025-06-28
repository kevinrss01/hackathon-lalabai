import { Router } from 'express';
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

router.use('/transcribe', transcribeRoutes);

export default router;
