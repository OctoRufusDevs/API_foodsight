const express = require("express");
const router = express.Router();

const authRController = require("../../controllers/api/AuthR");

router.post("/signup", authRController.register);
router.post("/signin", authRController.login);

module.exports = router;