const express = require("express");
require("dotenv").config();
const app = express();

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/twitter", (req, res) => {
  res.send("Hello form Twitter");
});

app.get("/login", (req, res) => {
  res.send("<h1>Please login at Twitter</h1>");
});

app.get("/youtube", (req, res) => {
  res.send("<h2>AlphaKodePlay</h2>");
});
app.listen(process.env.PORT, () =>
  console.log(`listening on http://localhost:${process.env.PORT}`)
);
