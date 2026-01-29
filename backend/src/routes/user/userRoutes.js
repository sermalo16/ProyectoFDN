const express = require('express');
const router = express.Router();
const userController = require("../../controllers/user");

router.post('/sign-in', userController.login);




module.exports = router;