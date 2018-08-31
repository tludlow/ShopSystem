const express = require("express");
const router = express.Router();
const db = require("../database");
const bcrypt = require('bcrypt-nodejs');
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const moment = require("moment");





router.post("/behaviourAction", config.jwtAuthMod, async (req, res)=> {
    let {student_id, comment, type, level} = req.body;
    let connection = await db.getConnection();
    try {
        const auth = req.get("authorization") || req.get("Authorization");
        const token = auth.split(" ")[1];
        let decodedToken = await jwt.verify(token, config.jwtSecret);
        let moderatorID = await connection.query("SELECT user_id, role FROM users WHERE username = ?", [decodedToken.username]);
        let behaviourInsert = await connection.query("INSERT INTO behaviours(student_id, moderator_id, type, level, comment) VALUES(?, ?, ?, ?, ?)", [student_id, moderatorID[0].user_id, type, level, comment]);
        res.status(200).send({ok: true, message: "You have created a moderation action."});
    } catch (err) {
        console.log(err);
        res.status(200).send({ok: false, error: "An error occured creating the behaviour action."});
    } finally {
        connection.release();
    }
});



module.exports = router;