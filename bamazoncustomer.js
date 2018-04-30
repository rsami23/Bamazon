// REQUIRED NPM PACKAGES FOR PROJECTS
require('console.table');
var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table");

// TEST CONNECTION TO DB
var connection = mysql.createConnection({
    host: "localhost",
    port: 8889,
    user: "root",
    password: "root",
    database: "Bamazon_db"
});

connection.connect(function(err){
    if (err) throw err;
    console.log("Connected as id " + connection.threadId);
    showProducts();
});

// SHOW ALL THE PRODUCT OPTIONS FOR CUSTOMER
function showProducts(){
    connection.query("SELECT * FROM products", function(err, res) {
        // CREATE TABLE TO DISPLAY PRODUCTS
        // var table = new Table({
        //     head: ["Item Id#", "Product Name", "Department Name",  "Price"],
        //     style: {
        //         head: ["blue"],
        //         compact: false,
        //         colAligns: ["center"],
        //     }
        // });
        // LOOP THROUGH ALL THE PRODUCTS AND ADD TO THE TABLE
        for (var i = 0; i < res.length; i++) {
            
        //   table.push([res[i].item_id, res[i].product_name, res[i].department_name, res[i].price]);
        //   console.log(table.toString());
        }
        console.table(res);
        purchase();
      });
}

// CREATE FUNCTION FOR CUSTOMER TO PURCHASE PRODUCTS
function purchase(){
    inquirer
        .prompt([
            {
                name: "id",
                type: "input",
                message: "What is the ID of the item you would like to purchase?",
                validate: function(value) {
                    if (isNaN(value) === false) {
                      return true;
                    }
                    return false;
                  }
            },
            {
                name: "numUnits",
                type: "input",
                message: "How many units of the item would you like to purchase?",
                validate: function(value) {
                    if (isNaN(value) === false) {
                      return true;
                    }
                    return false;
                  }
            }
        ])
        .then(function(answer){
            if (answer.numUnits > res[i].stock_quantity){
                res.stock_quantity -= answer.numUnits;
                console.log("Successfully added items to your order!");
                 
                
            } else if (answer.numUnits < res[i].stock_quanity){
                console.log("Sorry we don't have that quantity in stock at the moment.")
            }
        })
}
