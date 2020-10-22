const express = require('express');
const router = express.Router();
const RestaurantController = require('../../controllers/api/RestaurantController');

router.post("/create", RestaurantController.createRestaurant);
router.put("/update", RestaurantController.updateById);
router.get("/id/:_id",RestaurantController.finOneById);
router.get("/all", RestaurantController.findAll);
router.delete("/delete", RestaurantController.deleteOneByID);

module.exports = router;