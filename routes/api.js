const express = require('express');
const router = express.Router();

const restaurantRouter = require('./api/RestaurantRoutes');
const productRouter =  require('./api/ProductRoutes');
const authRRouter = require('./api/AuthR');
const AuthMiddleware = require('../middleware/Auth');

router.use("/auth", authRRouter);
router.use(AuthMiddleware.verifyAuth);
router.use("/restaurant", restaurantRouter);
router.use("/product", productRouter)

module.exports = router;