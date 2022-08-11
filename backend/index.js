const express = require("express");
const morgan = require('morgan');
require("dotenv").config();
const app = express();
const port = process.env.PORT||5000;

//middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());

// Configure Header HTTP (este codigo soluciona el problema de cors)
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method"
    );
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    res.header("Allow", "GET, POST, OPTIONS, PUT, DELETE");
    next();
  });

//cargamos el archivo de rutas
const routes = require("./src/routes/index");


//Routes
app.use('/api', routes);

//Starting server

app.listen(port, () => {
    console.log(`Servidor iniciado en el puerto: ${port}`);
})