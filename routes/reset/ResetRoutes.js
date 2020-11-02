const express = require('express');
const router = express.Router();

const resetController = require("../../controllers/api/ResetController");


router.get("/changePass/:token", resetController.loadUpdateForm);
router.post("/changePass/:token", resetController.updatePassword);
router.get("/forgot", resetController.renderForgotView);
router.post("/forgot", resetController.forgotPassword);

module.exports = router;