const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");

let app = express();
const port = 7033;

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

//File imports
const userRoutes = require("./routes/userRoutes");
const moderationRoutes = require("./routes/moderationRoutes");

//Setup rest api
app.use("/user", userRoutes);
app.use("/mod", moderationRoutes);

// 404 Error Handler
const endpointError = {status: 404, error: "No Endpoint Found"}
app.use((req, res) => {
    res.status(404).send(endpointError);
});


process.on('unhandledRejection', (reason, p) => {
    console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
});

//Create the http server.
var server = http.createServer(app);
server.listen(port);
console.log("The server has started on port " + port);
module.exports = app;