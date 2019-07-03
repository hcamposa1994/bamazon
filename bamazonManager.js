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
    ManagerOptions();
});

function ManagerOptions() {
    inquirer
    .prompt([
        {
        type: "list",
        message: "What would you like to do?",
        choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"],
        name: "option"
        },
    ])
    .then(function(inquirerResponse) {
        if (inquirerResponse.option === "View Products for Sale") {
            viewProducts();
        }
        else if (inquirerResponse.option === "View Low Inventory") {
            viewLowInventory();
        }
        else if (inquirerResponse.option === "Add to Inventory") {
            addToInventory();
        }
        else {
            addNewProduct();
        }
    });

}

function viewProducts() {
    connection.query("SELECT item_id, product_name, price, stock_quantity FROM products", function(err, res) {
        if (err) throw err;
        console.log(res);
        connection.end();
});  
}

function viewLowInventory() {
    connection.query("SELECT item_id, product_name, price, stock_quantity FROM products where stock_quantity < 5;", function(err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        console.log(res);
        connection.end();
});  
}

function addToInventory() {
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        var data = res;
        inquirer
        .prompt([
          {
            name: "item",
            type: "rawlist",
            message: "Which item would you like add more of?",
            choices: function() {
              var itemArray = [];
              for (let i = 0; i < data.length; i++) {
                itemArray.push(data[i].product_name);
              }
              return itemArray;
            }
          },
          {
            type: "number",
            message: "How much of the inventory would you like to add?",
            name: "quantity_amount"
          },
        ])
        .then(function(itemresponse) {
          var chosenItem;
          for (let i = 0; i < data.length; i++) {
            if(data[i].product_name === itemresponse.item) {
              chosenItem = data[i];
            }
          }
          var added_quantity = chosenItem.stock_quantity + itemresponse.quantity_amount;
          var query = connection.query(
            "UPDATE products SET ? WHERE ?",
            [
              {
                stock_quantity: added_quantity
              },
              {
                item_id: chosenItem.item_id
              }
            ],
            function(err, res) {
              if (err) throw err;
              console.log(res.affectedRows + " products updated!\n");
            }
          );
          console.log(query.sql);
          connection.end();
        });
    });  
}

function addNewProduct() {
  inquirer
  .prompt([
      {
          type: "input",
          message: "Enter the name of the product to add:",
          name: "item_name"
      },
      {
        type: "input",
        message: "Enter the depertment the new product belongs to:",
        name: "item_department"
      },
      {
        type: "number",
        message: "What is the price per unit of the product?",
        name: "item_price"
      },
      {
        type: "number",
        message: "Enter the starting inventory of the new product:",
        name: "item_stock"
      },
  ])
  .then(function(itemresponse) {
    console.log("Inserting a new product...\n");
    var query = connection.query(
      "INSERT INTO products SET ?",
      {
        product_name: itemresponse.item_name,
        department_name: itemresponse.item_department,
        price: itemresponse.item_price,
        stock_quantity: itemresponse.item_stock
      },
      function(err, res) {
        if (err) throw err;
        console.log(res.affectedRows + " product inserted!\n");
        connection.end();
      }
    );
    console.log(query.sql);
  });

}