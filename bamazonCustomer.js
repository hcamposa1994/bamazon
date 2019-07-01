var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
  
    port: 3306,
  
    user: "root",
  
    password: "Odalis1998!",
    database: "bamazon"
  });

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    showItems();
});

function showItems() {
    console.log("Selecting all items...\n");
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        console.log(res);
        var data = res;
        askUser(data);
});  
}

function askUser(response) {
    inquirer
    .prompt([
      {
        name: "item",
        type: "rawlist",
        message: "Which item would you like to buy?",
        choices: function() {
          var itemArray = [];
          for (let i = 0; i < response.length; i++) {
            itemArray.push(response[i].product_name);
          }
          return itemArray;
        }
      },
      {
        type: "number",
        message: "How many units of the product would you like to purchase?",
        name: "quantity_amount"
      },
    ])
    .then(function(itemresponse) {
      var chosenItem;
      for (let i = 0; i < response.length; i++) {
        if(response[i].product_name === itemresponse.item) {
          chosenItem = response[i];
        }
      }
      if (parseFloat(itemresponse.quantity_amount) > chosenItem.stock_quantity) {
        console.log("Insufficient quantity!");
        connection.end();
      }
    });
  }
  
