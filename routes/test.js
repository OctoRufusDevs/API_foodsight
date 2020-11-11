const express = require('express');
const router = express.Router();

const authURouter = require('./test/AuthU');
const RestaurantController = require('../controllers/api/RestaurantController');
const ProductController = require('../controllers/api/ProductController');
const AuthUMiddleware = require('../middleware/AuthU');
const UserRoutes = require('./test/UserRoutes');
const RatingRoutes = require('./test/Rating');

router.use("/guestAllRestaurants", RestaurantController.findAll);
router.use("/guestAllProducts", ProductController.findAll);
router.use("/", RatingRoutes);

router.use("/authU", authURouter);
router.use(AuthUMiddleware.verifyAuth);

router.use("/",UserRoutes)



module.exports = router;

