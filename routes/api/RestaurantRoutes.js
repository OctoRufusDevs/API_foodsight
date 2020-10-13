const express = require('express');
const router = express.Router();
const restaurantController = require('../../controllers/api/RestaurantController');

router.post("/create", restaurantController.createRestaurant);

module.exports = router;