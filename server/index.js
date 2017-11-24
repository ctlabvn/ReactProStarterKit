const path = require("path");
const express = require("express"),
  app = express();

// console.log(publicPath);
// set port and engine
app.set("port", process.env.PORT || 80);
app.set("view engine", "pug");

app.get("*", function(req, res) {
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

app.listen(app.get("port"), () => {
  console.log("Express is listening on port " + app.get("port") + "!");
});
