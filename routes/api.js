const express = require('express');
const router = express.Router();

const restaurantRouter = require('./api/RestaurantRoutes');
const productRouter =  require('./api/ProductRoutes');

router.use("/restaurant", restaurantRouter);
router.use("/product", productRouter)

module.exports = router;