const AWS = require("aws-sdk");
const config = require("./config.js");
const uuidv1 = require("uuidv1");
const shortid = require("shortid");

const getUrls = function (req, res) {
  AWS.config.update(config.aws_remote_config);

  const docClient = new AWS.DynamoDB.DocumentClient();

  const params = {
    TableName: config.aws_table_name,
  };

  docClient.scan(params, function (err, data) {
    if (err) {
      console.log(err);
      res.send({
        success: false,
        message: err,
      });
    } else {
      const { Items } = data;
      console.log(Items);
      res.send({
        success: true,
      });
    }
  });
};

const addUrl = function (req, res) {
  AWS.config.update(config.aws_remote_config);
  const docClient = new AWS.DynamoDB.DocumentClient();
  console.log(req.body.fullUrl);
  var fullUrl = req.body.fullUrl;
  var shortUrl = shortid.generate();
  const Item = { fullUrl: fullUrl, shortUrl: shortUrl };
  Item.id = uuidv1();
  var params = {
    TableName: config.aws_table_name,
    Item: Item,
  };

  // Call DynamoDB to add the item to the table
  docClient.put(params, function (err, data) {
    if (err) {
      res.send({
        success: false,
        message: err,
      });
    } else {
      res.send({
        success: true,
        message: "Added url",
      });
    }
  });
};

module.exports = {
  getUrls,
  addUrl,
};
