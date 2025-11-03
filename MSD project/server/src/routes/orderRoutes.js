import { Router } from 'express';
import {
	createOrder,
	getOrders,
	confirmPayment,
	updateOrderStatus,
} from '../controllers/orderController.js';

const router = Router();

router.get('/', getOrders);
router.post('/', createOrder);
router.post('/:id/pay', confirmPayment);
router.patch('/:id/status', updateOrderStatus);

export default router;
