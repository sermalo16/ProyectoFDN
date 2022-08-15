const jwt = require("jwt-simple");
const moment = require("moment");
require("dotenv").config();

exports.ensureAuth = (req, res, next) => {
    if(!req.headers.authorization) {
        return res.status(403).send({message: "la peticion no esta autorizada. "});
    }

    const token = req.headers.authorization.replace(/['"]+/g, "");

    try{
        var payload = jwt.decode(token, process.env.SECRET_KEY);

        if(payload.exp <= moment.unix()){
            return res.status(404).send({message: "token ha expirado"});
        }
    } catch (ex){
        console.log(ex);

        return res.status(404).send({message: "Token invalido."});
    }

    req.user = payload;
    next();
}