const db = require("../database");
const bcrypt = require('bcrypt-nodejs');
const jwt = require("jsonwebtoken");

//The secret used in the signing and reading of json web tokens.
const jwtSecret = "justarandomsignaturethingdontcopyitbecauseidontactuallyuseit.";

//A function to verify the person making the action is off role teacher or admin.
async function jwtAuthMod(req, res, next) {
    const auth = req.get("authorization") || req.get("Authorization");
    if(!auth || typeof auth === "undefined") {
        res.status(200).send({ok: false, error: "Invalid auth token"});
        return;
    }
    const token = auth.split(" ")[1]; //come in the form Bearer TOKENHERE, we only want the TOKENHERE bit.
    try {
        let decodedToken = await jwt.verify(token, jwtSecret);
        let modRoles = ["teacher", "moderator", "admin"];
        if(modRoles.includes(decodedToken.role)) {
            next();
        } else {
            res.status(200).send({ok: false, error: "You don't have the right authorisation to perform moderation actions."});
        }
    } catch (err) {
        console.log(err)
        res.status(200).send({ok: false, error: "Auth token processing error"});
    }
};


module.exports = {jwtSecret, jwtAuthMod};