const {connection} = require("../database/config.db");
const mysql = require('mysql');
const moment = require("moment");

function getUser(req, res){
    connection.query("SELECT * FROM users", (error, results) =>{
        if(error)
            throw error;
            res.status(200).json(results);
    });
}

function insertUser(req, res){
    const {email, username, password, repeatPassword, active, user_description} = req.body;
    const create_date = moment().format();
    let insert = "INSERT INTO users (useremail, username, create_date, password, active, user_description) VALUES (?,?,?,?,?,?)";
    let query = mysql.format(insert, [email, username, create_date, repeatPassword, active, user_description]);

    connection.query(query, function(err, result){
        if(err){
            res.status(500).send({error: err })
        }else{
            res.status(200).json(result);
        }
    })

}



module.exports = {
    getUser,
    insertUser
}