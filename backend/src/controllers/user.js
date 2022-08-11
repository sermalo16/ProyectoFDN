const {connection} = require("../database/config.db");

function GetInfo(req, res){
    connection.query("SELECT * FROM ejemplo", (error, results) =>{
        if(error)
            throw error;
            res.status(200).json(results);
    });
}



module.exports = {
    GetInfo
}