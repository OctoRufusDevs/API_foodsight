const express = require("express");
const router = express.Router();

const authUController = require("../../controllers/api/AuthU");

router.post("/signup", authUController.register);
router.post("/signin", authUController.login);

module.exports = router;