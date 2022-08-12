const express = require('express');
const router = express.Router();
const userController = require("../../controllers/user");

router.get('/get-user', userController.getUser);
router.post('/post-user', userController.insertUser);




module.exports = router;