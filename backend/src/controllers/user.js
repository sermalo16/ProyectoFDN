const {connection} = require("../database/config.db");
const mysql = require('mysql');
const moment = require("moment");
const bcrypt = require('bcryptjs');

function getUser(req, res){
    connection.query("SELECT * FROM users", (error, results) =>{
        if(error){
            throw error;
        }
        res.status(200).json(results);
    });
}

function insertUser(req, res){
    const {email, username, password, repeatPassword, active, user_description} = req.body;
    const create_date = moment().format();

    if(!email){
        res.status(404).send({message: "Correo no ingresado."});
    }else if(!username){
        res.status(404).send({message: "Nombre de usuario no ingresado."});
    }else{
        if(!password || !repeatPassword){
            res.status(404).send({message: "la contraseña no fue ingresada."});
        }else{
            if(password !== repeatPassword){
                res.status(404).send({message: "las contraseñas no son iguales."});
            }else{
                bcrypt.hash(repeatPassword, 8, function(err, hash){
                    if(err){
                        res.status(500).send({message: "Error al encriptar la contraseña."});
                    }else{
                        let insert = "INSERT INTO users (useremail, username, create_date, password, active, user_description) VALUES (?,?,?,?,?,?)";
                        let query = mysql.format(insert, [email.toLowerCase(), username.toLowerCase(), create_date, hash, 1, user_description]);
                        connection.query(query, (err, result)=>{
                            if(err){
                                res.status(500).send({message: "Usuario/Correo ya han sido registrados."});
                            }else{
                                if(!result){
                                    res.status(500).send({message: "Error al crear usuario."});
                                }else{
                                    res.status(200).send({message: "Usuario creado exitosamente.", body: result});
                                }
                            }
                        });
                    }
                });
            }
        }
    }

}

function login(req, res){
    const {user, password} = req.body;

    if (!user){
        res.status(404).send({message: "Usuaro/Correo no ingresado."});
    }else if(!password){
        res.status(404).send({message: "Contraseña no ingresada."});
    }else{
        if(user.indexOf("@") > 0){
            let select = "select useremail, password, active from users where useremail = ?"
            let query = mysql.format(select, user);
            connection.query(query, async (error, results) =>{
                if(error){
                    res.status(500).send({message: "Error al encontrar el usuario"});
                }else{
                    if(results.length <= 0){
                        res.status(404).send({message: "Usuario/Correo no existe."})
                    }else{
                        if(!results[0].active){
                            res.status(404).send({mesage: "Usuario esta inactivo."});
                        }else{
                            bcrypt.compare(password, results[0].password, (err, check) => {
                                if(err){
                                    res.status(500).send({message: "Error del servior."});
                                }else if(!check){
                                    res.status(404).send({message: "la clave es incorrecta."})
                                }else{
                                    res.status(200).send({message: "todo bien."})
                                }
                            });
                        }
                    }
                }
            });
        }else{
            let select = "select username, password, active from users where username = ?"
            let query = mysql.format(select, user);
            connection.query(query, async (error, results) =>{
                if(error){
                    res.status(500).send({message: "Error al encontrar el usuario"});
                }else{
                    if(results.length <= 0){
                        res.status(404).send({message: "Usuario/Correo no existe."})
                    }else{
                        if(!results[0].active){
                            res.status(404).send({mesage: "Usuario esta inactivo."});
                        }else{
                            bcrypt.compare(password, results[0].password, (err, check) => {
                                if(err){
                                    res.status(500).send({message: "Error del servior."});
                                }else if(!check){
                                    res.status(404).send({message: "la clave es incorrecta."})
                                }else{
                                    res.status(200).send({message: "todo bien."})
                                }
                            });
                        }
                    }
                }
            });
        }
    }
}


module.exports = {
    getUser,
    insertUser,
    login
}