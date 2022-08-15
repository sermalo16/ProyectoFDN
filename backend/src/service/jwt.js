const jwt = require("jwt-simple");
const moment = require("moment");
require("dotenv").config();

exports.createAccessToken = function(user){
    const payload = {
        id: user.iduser,
        user: !user.username ? user.useremail: user.username,
        description: user.user_description,
        createToken: moment().unix(),
        exp: moment().add(3, "hours").unix()
    }

    return jwt.encode(payload, process.env.SECRET_KEY);
};

exports.createRefreshToken = function(user){
    const payload = {
        id: user.iduser,
        exp: moment().add(3, "hours").unix()
    };

    return jwt.encode(payload, process.env.SECRET_KEY);
};

exports.decodedToken = function(token){
    return jwt.decode(token, process.env.SECRET_KEY, true);
}