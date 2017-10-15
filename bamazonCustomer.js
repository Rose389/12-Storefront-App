// npm install requirements
require("console.table");

var inquirer = require("inquirer");
var connection = require("./connection")

// data variables
var stock = 0;
var orderID = 0;
var orderQty = 0;

// the basic code
connection.connect(function(err){
	if(err) throw err;
	console.log("\nYou have entered bamazon.\n");
	afterConnection();
});


// THE FUNCTIONS

// display all products for sale
	// ids - names - prices
function afterConnection(){
	var sql = "SELECT item_id, product_name, stock_quantity FROM products";

	connection.query(sql, function(err, result){
			stock = result.stock_quantity;
			console.table(result);
			userInput(stock);

	});
}; // THIS PART WORKS

// prompt user for purchase info
function userInput(){
	inquirer
		.prompt ([
			// Ask for product ID
			{
				name: "item_ID",
				message: "Type product ID for items you wish to purchase.",
				type: "input",
			},
			// Ask for quantity to buy
			{
				name: "quantity",
				message: "How many of this product would you like to purchase?",
				type: "input",
			}
		])
		.then(function(order) {
			orderID = parseInt(order.item_ID);
			orderQty = parseInt(order.quantity);

			console.log("You have ordered " + orderQty + " units of item # " + orderID + ".");
			checkAvail(orderID, orderQty);
		});
}


// check if available quantity can fulfill order
function checkAvail(order){
	var sql = "SELECT stock_quantity FROM products WHERE item_id = " + orderID;
	connection.query(sql, function (err, result, order) {
		stock = parseInt(result.stock_quantity);
		console.log(stock);

		console.log(result.stock_quantity);
	    if (err) throw err;

		// if no, let customer know
		if (stock < orderQty){
		console.log("We are unable to fulfill your order at this time.")

		// and prevent order from completing
		connection.end();

		} else {
		updateProduct(stock, orderID, orderQty);		
		}
	});
}


// else if yes, update the SQL database
function updateProduct(stock, orderID, orderQty){
	// update query variable to retrieve id, price, and qty from database
	var sql = "SELECT item_id, price, stock_quantity FROM products";
	var query = connection.query(sql, function(err, result){
		// set updated qty for stock
		stock = stock - orderQty;
		price = result.price;
		// update query variable to update product quantity, nee to pass in orderQty?
		sql = "UPDATE products SET stock_quantity = " + stock + " WHERE item_ID = " + orderID;
		var query = connection.query(sql, function(err, result, orderQty, price){
			// show records updated
	    	// console.log("\n" + result.affectedRows + " record(s) updated\n");
		
			// and show customer the total cost of their purchase 
			console.log("Your order total is: " + (orderQty * price));

			// end connection
			connection.end();
		});
	});

}