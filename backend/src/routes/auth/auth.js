const express = require("express");
const AuthController = require("../../controllers/auth");

const router = express.Router();

router.post("/refresh-access-token", AuthController.refreshAccessToken);

module.exports = router;