const path = require("path");
const express = require("express"),
  app = express();
const fetch = require("node-fetch");
const API_BASE = "http://donut-dot-hottab-in.appspot.com";
const API_SECRET_KEY = "qbktxJY33PKha53jkCpdu6CkFJNZvqds";

const defaultProps = {
  img: "http://hottab.net/wp-content/uploads/hottab-logo-1-300x300.png",
  url: "http://hottab.net/",
  title: "#HOTTAB: Multilingual POS on your phone for Restaurants, Cafes, Bars",
  descriptionText:
    "HotTab POS is a reliable POS for your restaurant, cafe, bar or store that runs offline and operates in multiple languages on your android phone or tablet.",
  imageUrl: "http://hottab.net/wp-content/uploads/hottab-logo-1-300x300.png"
};

const apiGet = (url, params) => {
  const urlParams = params
    ? Object.keys(params).map(
        key => `${key}=${encodeURIComponent(params[key])}`
      )
    : "";

  return fetch(`${API_BASE}${url}?secret_key=${API_SECRET_KEY}&${urlParams}`, {
    method: "GET",
    timeout: 10000
  })
    .then(res => res.json())
    .then(json => json.data || null)
    .catch(err => null);
};

// console.log(publicPath);
// set port and engine
app.set("port", process.env.PORT || 80);
app.set("views", path.join(__dirname, "./views"));
app.set("view engine", "pug");

app.get("/restaurant/:slug", (req, res, next) => {
  const { slug } = req.params;
  apiGet("/restaurant/outlet-by-slug", { slug }).then(ret => {
    if (ret) {
      res.render("bot", {
        img: ret.logo,
        url: ret.url,
        title: ret.name,
        descriptionText: ret.description,
        imageUrl: ret.logo
      });
    } else {
      next();
    }
  });
});

app.get("*", function(req, res) {
  res.render("bot", defaultProps);
});

app.listen(app.get("port"), () => {
  console.log("Express is listening on port " + app.get("port") + "!");
});
