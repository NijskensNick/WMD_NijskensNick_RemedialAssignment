const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

// Global variables
const SERVER_HOST = process.env.SERVER_HOST;
const SERVER_PORT = process.env.SERVER_PORT;

// Middleware
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors());


// Routes
var devicenamesRouter = require("./routes/devicenames");
app.use("/LoggedDeviceNames", devicenamesRouter);

var usernamesRouter = require("./routes/usernames");
app.use("/LoggedUserNames", usernamesRouter);

// Listening message
app.listen(SERVER_PORT, (err) => {
    if(!err)
    {
        console.log("running on port " + SERVER_PORT);
    }
    else
    {
        console.error(err);
    }
})