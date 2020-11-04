const express = require("express");
const router = express.Router();
const productController =  require("../../controllers/api/ProductController");
const upload = require('../../utils/multer');

router.post("/create", upload.single("image"), productController.createProduct);
router.get("/all", productController.findAll);
router.get("/id/:_id", productController.findOneById);
router.put("/update", upload.single("image"), productController.updateProduct);
router.delete("/",productController.deleteOneById);

module.exports = router;