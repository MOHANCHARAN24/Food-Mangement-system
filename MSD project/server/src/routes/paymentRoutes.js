import { Router } from 'express';
import { getPaymentHistory, getPaymentMethods } from '../controllers/paymentController.js';

const router = Router();

router.get('/methods', getPaymentMethods);
router.get('/history', getPaymentHistory);

export default router;
