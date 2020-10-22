const express = require("express");
const router = express.Router();
const productController =  require("../../controllers/api/ProductController");

router.post("/create", productController.createProduct);
router.get("/all", productController.findAll);
router.get("/id/:_id", productController.findOneById);
router.put("/update", productController.updateProduct);
router.delete("/",productController.deleteOneById);

module.exports = router;