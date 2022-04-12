require("dotenv").config();
const express = require("express");
const shortid = require("shortid");
const AWS = require("aws-sdk");
const config = require("./config.js");
// const bodyParser = require("body-parser");
// const mongoose = require("mongoose");
const { addUrl } = require("./dynamodb-controller");
const app = express();

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

const getUrls = () => {
  //   AWS.config.update(config.aws_remote_config);
  //   const docClient = new AWS.DynamoDB.DocumentClient();
  //   const params = {
  //     TableName: config.aws_table_name,
  //   };
  //   docClient.scan(params, function (err, data) {
  //     if (err) {
  //       console.log(err);
  //     } else {
  //       const { Items } = data;
  //       console.log(Items);
  //     }
  //   });
};
app.get("/", (req, res) => {
  AWS.config.update(config.aws_remote_config);

  const docClient = new AWS.DynamoDB.DocumentClient();

  const params = {
    TableName: config.aws_table_name,
  };

  docClient.scan(params, function (err, data) {
    if (err) {
      console.log(err);
    } else {
      const result = data;

      res.render("index", { urls: result.Items });
    }
  });
});

app.post("/shortUrls", addUrl, (req, res) => {
  var msg = shortid.generate();
  console.log(req.body.fullUrl);
  res.redirect("/");
});

app.get("/urls", (req, res) => {
  res.send("hi");
});

app.listen(3000, () => {
  console.log("started");
});
