const express = require("express");
const router = express.Router();

const authUController = require("../../controllers/api/AuthU");

router.get("/forgot", authUController.renderForgotView);
router.post("/forgot", authUController.forgotPassword);
router.post("/signup", authUController.register);
router.post("/signin", authUController.login);

module.exports = router;