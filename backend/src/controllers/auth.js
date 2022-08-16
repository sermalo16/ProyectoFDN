const jwt = require('../service/jwt');
const moment = require('moment');
const {connection} = require('../database/config.db');
const mysql = require('mysql');

function willExpiredToken(token){
    const {exp} = jwt.decodedToken(token);
    const currentDate = moment().unix();

    if(currentDate > exp){
        return true;
    }
    return false;
}

function refreshAccessToken(req, res){
    const { refreshToken } = req.body;
    const isTokenExpired = willExpiredToken(refreshToken);


    if(isTokenExpired){
        res.status(404).send({message: "El refreshToken ha expirado"});
    }else {
        const {id} = jwt.decodedToken(refreshToken);
        let insert = "select * from users where iduser = ?";
        let query = mysql.format(insert, id);
        connection.query(query, (err, results) => {
            if(err){
                res.status(500).send({message: "Error del servidor.", body: err});
            }else{
                if(results.length <= 0){
                    res.status(404).send({message: "Usuario no encontrado."});
                }else{
                    res.status(200).send({
                        accessToken: jwt.createAccessToken(results[0]),
                        refreshToken: refreshToken
                    });
                }
            }
        })
    }
}

module.exports = {
    refreshAccessToken
}