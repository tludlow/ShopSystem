const express = require("express");
const router = express.Router();
const db = require("../database");
const bcrypt = require('bcrypt-nodejs');
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const moment = require("moment");

//Standard functions used to handle password hashing.
var generateHash = function(password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(9));
}
var validPassword = function(password, hash){
    return bcrypt.compareSync(password, hash);
}

//Actual REST API route endpoints.
//The endpoint user to create a new user, requires the firstname and lastname of the user to be created.
router.post("/createUser", async (req, res)=> {
    let {firstname, lastname, password} = req.body;
    let username = firstname + "_" + lastname + "00";
    const userDatabaseInsert = {username, password: generateHash(password), first_name: firstname, last_name: lastname};

    let connection = await db.getConnection();
    
    try {
        //Check if the user already exists or not.
        var doesUserExist = await connection.query("SELECT COUNT(*) AS count FROM users WHERE username = ?", [username]);
        if(doesUserExist[0].count > 0) {
            res.status(200).send({ok: false, error: "A user with that username or email already exists in the system."});
            return;
        }

        //The user does not exist, go ahead and create the user.
        let insertingUser = await connection.query("INSERT INTO users SET ?", userDatabaseInsert);
        let dataJWT = {username, role: "student", iat: Math.floor(Date.now() / 1000) - 30};
        let token = jwt.sign(dataJWT, config.jwtSecret);
        res.status(200).send({ok: true, message: "User successfully created.", data: {username, firstname, lastname, token}});
    } catch (err) {
        console.log(err);
        res.status(200).send({ok: false, error: "There was an error creating your user."});
    } finally {
        connection.release();
    }
});

//Endpoint for logging in the user, takes username and password and returns a token.
router.post("/login", async (req, res)=> {
    let {username, password} = req.body;

    //Create the database connection.
    let connection = await db.getConnection();
    try {
        //Check if a user exists.
        var getUserFromUsername  = await connection.query("SELECT password, role FROM users WHERE username = ?", [username]);
        if(getUserFromUsername.length == 0) {
            res.status(200).send({ok: false, error: "A user with that username does not exist."});
            return;
        }
        //Compare the hashes.
        if(validPassword(password, getUserFromUsername[0].password)) {
            let dataJWT = {username, role: getUserFromUsername[0].role, iat: Math.floor(Date.now() / 1000) - 30};
            let token = jwt.sign(dataJWT, config.jwtSecret);
            res.status(200).send({ok: true, message: "You have been logged in.", data: {username, token}});
        } else {
            res.status(200).send({ok: false, error: "Your username and password do not match."});
        }
    } catch (err) {
        console.log(err);
        res.status(200).send({ok: false, error: "There was an error logging in your user."});
    } finally {
        connection.release();
    }
});





module.exports = router;