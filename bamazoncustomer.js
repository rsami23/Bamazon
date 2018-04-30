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
                message: "What is the ID of the item you would like to purchase?"
            },
            {
                name: "numUnits",
                type: "input",
                message: "How many units of the item would you like to purchase?"
            }
        ])
        .then(function(answer){
            connection.query("SELECT * FROM products WHERE item_id = ?", [answer.id], function(err, res){
                if(answer.numUnits > res[0].stock_quantity){
                    console.log("\n------------------------------------------------------------\n");
                    console.log("Sorry the quantity requested is currently not in stock.");
                    console.log("Please come back later, or choose another item from the stock.");
                    console.log("\n------------------------------------------------------------\n");
                    // console.log(answer.numUnits > res[0].stock_quantity);
                } 
                else {
                    var totalCost = answer.numUnits * res[0].price;
                    var newQuantity = res[0].stock_quantity - answer.numUnits;
                    
                    console.log("\n------------------------------------------------------------\n");
                    console.log("Your chosen items have been added to your order!")
                    console.log("Your total for your items are: " + "$" + totalCost);
                    console.log("\n------------------------------------------------------------\n");
                    
                    // UPDATE STOCK_QUANTITY IN DB
                    connection.query("UPDATE products SET ? WHERE?", [{
                        stock_quantity: newQuantity
                    },{
                        item_id: answer.id
                    }], function(err, res){
                        if (err) throw err;
                    });

                }
            });
        }); 
};
