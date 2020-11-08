const express = require("express");
const router = express.Router();
const upload = require('../../utils/multer');
const authRController = require("../../controllers/api/AuthR");

router.post("/signup", upload.single("photo"), authRController.register);
router.post("/signin", authRController.login);

module.exports = router;