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

app.use(express.static("public"));


// Routes
var devicenamesRouter = require("./routes/devicenames");
app.use("/LoggedDeviceNames", devicenamesRouter);

var usernamesRouter = require("./routes/usernames");
app.use("/LoggedUserNames", usernamesRouter);

var ssPairsRouter = require("./routes/ss_pairs");
app.use("/StandingStillPairs", ssPairsRouter);

var ptPairsRouter = require("./routes/pt_pairs");
app.use("/PassingThroughPairs", ptPairsRouter);

var sessionsRouter = require("./routes/sessions");
app.use("/Sessions", sessionsRouter);

var adminpageRouter = require("./routes/adminpage");
app.use("/", adminpageRouter);

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