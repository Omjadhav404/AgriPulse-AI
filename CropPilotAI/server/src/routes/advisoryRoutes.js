import { Router } from 'express';
import {
  createDiagnosis,
  getAdvisoryHistory,
  getAdvisoryById,
  deleteAdvisory
} from '../controllers/advisoryController.js';

const router = Router();

router.post('/diagnose', createDiagnosis);
router.get('/history', getAdvisoryHistory);
router.get('/:id', getAdvisoryById);
router.delete('/:id', deleteAdvisory);

export default router;
