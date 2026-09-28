import { Router } from 'express';
import {
  getFarms,
  createFarm,
  addFieldToFarm,
  getDashboardStats
} from '../controllers/farmController.js';

const router = Router();

router.get('/', getFarms);
router.post('/', createFarm);
router.post('/:farmId/fields', addFieldToFarm);
router.get('/stats/dashboard', getDashboardStats);

export default router;
