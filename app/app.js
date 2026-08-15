const express = require("express");
const app = express();

// Global variables
const SERVER_HOST = process.env.SERVER_HOST;
const SERVER_PORT = process.env.SERVER_PORT;

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