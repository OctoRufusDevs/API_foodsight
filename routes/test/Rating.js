const RestaurantController = require("../../controllers/api/RestaurantController");
const express = require("express");
const router = express.Router();

router.patch("/rateRestaurant", RestaurantController.rateRestaurant);

module.exports = router;