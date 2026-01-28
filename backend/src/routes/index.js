const express = require('express');
const router = express.Router();
const userRoutes = require("./user/userRoutes");
const employeeRoutes = require("./employee/employeeRoutes");
const deparmentRoutes = require("./company/deparmentRoutes");
const inventoryRoutes = require("./inventory/inventoryRoutes");
const categoryRoutes = require("./inventory/categoryRoutes");
const asigmentRoutes = require("./asigment/asigmentRoutes");
const companyRoutes = require("./company/companyRoutes");
const useAuth = require('./auth/auth');

/* GET home page. */
router.get('/', function(req, res, next) {
    //res.render('index', { title: 'Express' });
    res.status(200).json({ 'version': '1.0', 'application': 'GRUPOFUNO' });
});

//Rutas
router.use('/users', userRoutes);
router.use('/employee', employeeRoutes);
router.use("/department", deparmentRoutes);
router.use('/company', companyRoutes);
router.use('/auth', useAuth);
router.use('/inventory', inventoryRoutes);
router.use('/category', categoryRoutes);
router.use('/asigment', asigmentRoutes);
router.use('/', useAuth);

module.exports = router;