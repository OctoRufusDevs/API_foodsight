const express = require("express");
const router = express.Router();

const UserController = require('../../controllers/api/UserController');

router.post("/addFavoriteProduct", UserController.saveProduct);
router.post("/addFavoriteRestaurant", UserController.saveRestaurant);
router.post("/favoriteProducts", UserController.getFavProducts);
router.post("/favoriteRestaurant", UserController.getFavRestaurant);
router.post("/removeFavoriteRestaurant", UserController.removeFavRestaurant);
router.post("/removeFavoriteProduct", UserController.removeFavProduct);

module.exports = router;