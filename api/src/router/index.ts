import { Router } from "express";
import RestaurantController from "../controllers/restaurants";
import ReviewController from "../controllers/reviews";
import UserController from "../controllers/users";

const router = Router();

router.use('/users', UserController);
router.use('/restaurants', RestaurantController);
router.use('/reviews', ReviewController);

export default router;