const http = require("http");
const express = require("express");
const sessionExpress = require("express-session");
const socketIO = require("socket.io")
const sessionSocket = require("socket.io-express-session");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const ServerController = require("./controller/server-controller");
const config = require("./config/config.json");

const PORT = process.env.PORT || 3000;

var app = express();
var server = http.Server(app);
var session = sessionExpress({ secret: config.PUBLIC_KEY });

// Setup app
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session);

// Setup Passport
passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(user, done) {
  done(null, user);
});
app.use(passport.initialize());
app.use(passport.session());

// TODO: DO NOT SERVE EVERYTHING AS STATIC !!!
app.use(express.static(__dirname));


// Setup MongoDB
mongoose.connect(config.MONGO_URL, {
  useNewUrlParser : true,
  useCreateIndex: true
});
mongoose.connection.on("error", (error) => {
  console.log(error);
  process.exit(1);
});
mongoose.connection.on("connected", function () {
  console.log("connected to mongo");
});

// Routing
// TODO: move routing to route/index.js
require("./script/auth");
const mainRouting   = require("./route/main");
const secureRouting = require("./route/secure");

// TODO: WTF is this shit ?
const defaultExport = require("./generation/generationBenchmark");
app.get("/generation", function (req, res) {
  defaultExport().then(() => {
    res.sendFile(__dirname + "/generation/render/index.html");
  });
});
app.get("/game.html", passport.authenticate("jwt", { session : true }), function (req, res) {
  res.sendFile(__dirname + "/public/game.html");
});
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/public/index.html");
});
app.get("/index.html", function (req, res) {
  res.sendFile(__dirname + "/public/index.html");
});

app.post("/submit-chatline", passport.authenticate("jwt", { session : true }), function (req, res){
  const { message } = req.body;
  const { email, name } = req.user;
  // await ChatModel.create({ email, message });
  //console.log(self.gameControllers.length);
  serverController.gameControllers.forEach(controller => {
    controller.websocket.emit("new-message", {
      username: name,
      message,
    });
  });
  res.status(200).json({ status: "ok" });
});

app.use("/", mainRouting);
app.use("/", passport.authenticate("jwt", { session : true }), secureRouting);

app.use((req, res, next) => {
  res.status(404).json({ message: "404 - Not Found" });
});

app.use((err, req, res, next) => {
  console.log(err.message);
  res.status(err.status || 500).json({ error: err.message });
});

// Setup Websocket
var websocket = socketIO.listen(server);
websocket.use(sessionSocket(session));


// PRESS START TO PLAY
var serverController = new ServerController(websocket);

server.listen(PORT, function () {
  console.log("Listening on port: " + server.address().port);
  serverController.addGameController();
});
