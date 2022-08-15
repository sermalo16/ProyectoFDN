const express = require('express');
const router = express.Router();
const userRoutes = require("./user/userRoutes");
const useAuth = require('./auth/auth');

/* GET home page. */
router.get('/', function(req, res, next) {
    //res.render('index', { title: 'Express' });
    res.status(200).json({ 'version': '1.0', 'application': 'BTDGROUP' });
});

//Rutas
router.use('/users', userRoutes);
router.use('/auth', useAuth);

module.exports = router;