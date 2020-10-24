const express = require("express");
const router = express.Router();

const UserController = require('../../controllers/api/UserController');

router.post("/addFavoriteProduct", UserController.saveProduct);
router.post("/addFavoriteRestaurant", UserController.saveRestaurant);
router.get("/favoriteProducts", UserController.getFavProducts);
router.get("/favoriteRestaurant", UserController.getFavRestaurant);

module.exports = router;