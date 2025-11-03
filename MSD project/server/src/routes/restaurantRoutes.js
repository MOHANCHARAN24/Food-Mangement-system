import { Router } from 'express';
import {
  getRestaurants,
  getTopRestaurants,
  getRestaurantById,
} from '../controllers/restaurantController.js';

const router = Router();

router.get('/top', getTopRestaurants);
router.get('/', getRestaurants);
router.get('/:id', getRestaurantById);

export default router;
