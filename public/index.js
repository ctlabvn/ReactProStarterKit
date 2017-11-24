const path = require("path");
const bodyParser = require("body-parser");
const compression = require("compression");
const express = require("express"),
  app = express(),
  nonSPArouter = express.Router();

const configPaths = require("../config/paths");

const publicPath = path.resolve(
  process.env.NODE_ENV === "development" ? "../" : "./",
  "build"
);
console.log(publicPath);
// set port and engine
app.set("port", process.env.PORT || 80);

app.use(bodyParser.json({ limit: "5mb" }));
app.use(bodyParser.urlencoded({ extended: false }));

nonSPArouter.get("*", function(req, res) {
  res.render("bot", {
    img: "http://hottab.net/wp-content/uploads/hottab-logo-1-300x300.png",
    url: "http://hottab.net/",
    title:
      "#HOTTAB: Multilingual POS on your phone for Restaurants, Cafes, Bars",
    descriptionText:
      "HotTab POS is a reliable POS for your restaurant, cafe, bar or store that runs offline and operates in multiple languages on your android phone or tablet.",
    imageUrl: "http://hottab.net/wp-content/uploads/hottab-logo-1-300x300.png"
  });
});

app.use(function(req, res, next) {
  var ua = req.headers["user-agent"];

  if (/^(facebookexternalhit)|(Twitterbot)|(Pinterest)/gi.test(ua)) {
    console.log(ua, " is a bot");
    nonSPArouter(req, res, next);
  } else {
    next();
  }
});

// static folder and file, you can use nginx to server, and override file path with public path
app.use(compression({ level: 9 }));
app.use("/", express.static(publicPath));
app.get("*", (req, res) => {
  res.sendFile(publicPath + "/index.html");
});
app.set("view engine", "pug");
app.listen(app.get("port"), () => {
  //eslint-disable-next-line no-console
  console.log("Express is listening on port " + app.get("port") + "!");
});
