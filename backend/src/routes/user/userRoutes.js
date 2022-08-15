const express = require('express');
const router = express.Router();
const userController = require("../../controllers/user");
const md_ensure = require('../../middlewares/aunthenticad');

router.get('/get-user', [md_ensure.ensureAuth],userController.getUser);
router.post('/post-user', userController.sign_up);
router.post('/sign-in', userController.login);




module.exports = router;