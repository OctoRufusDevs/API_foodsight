const express = require('express');
const router = express.Router();
const RestaurantController = require('../../controllers/api/RestaurantController');
const upload = require('../../utils/multer');

//router.post("/create", upload.single("image"),RestaurantController.createRestaurant);
router.put("/update", upload.single("photo"), RestaurantController.updateById);
router.get("/id/:_id",RestaurantController.finOneById);
router.get("/all", RestaurantController.findAll);
router.delete("/delete", RestaurantController.deleteOneByID);


module.exports = router;