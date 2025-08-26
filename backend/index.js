const express = require("express");
const morgan = require('morgan');
const path = require("path"); // <- importamos path
const { API_VERISION, IP_SERVER } = require("./config");
const app = express();
require("dotenv").config();
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


// ✅ Sirve imágenes de empleados (http://localhost:3308/uploads/empleados/foto.jpg)
app.use("/uploads", express.static(path.join(__dirname, "src", "uploads")));


//cargamos el archivo de rutas
const routes = require("./src/routes/index");


//Routes
app.use(`/api/${API_VERISION}`, routes);

//Starting server
app.listen(port, () => {
  console.log("########################");
  console.log("####### API REST #######");
  console.log("########################");
  console.log(`http://${IP_SERVER}:${port}/api/${API_VERISION}/`);
})