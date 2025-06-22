import { Router } from 'express';
import exampleRoutes from './example.routes';

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

// Add more route modules here as your API grows
// router.use('/users', userRoutes);
// router.use('/auth', authRoutes);

export default router;
