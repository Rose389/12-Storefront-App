// npm install requirements
require("console.table");

var inquirer = require("inquirer");
var connection = require("./connection")

// data variables
var stock = 0;
var price = 0;
var prod = 0;
var qty = 0;

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
	var sql = 'SELECT item_id, product_name, stock_quantity FROM products';

	connection.query(sql, function(err, result){
			console.table(result);
			userInput();

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
			checkAvail(order, stock);
		});
}


// check if available quantity can fulfill order
function checkAvail(order, stock){
	prod = order.item_ID;
	qty = order.quantity;
	console.log("id: " + prod + ", qty: " + qty + ", inv: " + stock);

		// if no, let customer know
		if (stock < qty){
		console.log("We are unable to fulfill your order at this time.");

		// and prevent order from completing
		connection.end();

		} else {
		updateProduct(stock, order);		
		}
}


// else if yes, update the SQL database
function updateProduct(stock, order){
	console.log("Updating product " + order.item_ID);

	// update query variable to update product quantity,  to pass in orderQty?
	sql = 'UPDATE products SET stock_quantity = stock_quantity - ? WHERE item_ID = ?';
	var query = connection.query(sql, [order.item_ID, order.quantity], function(err, result){
		// show records updated
		console.log("New quantity: " + (stock - order.quantity));
		// and show customer the total cost of their purchase 
		console.log("Your order total is: " + (order.quantity * price));

		// end connection
		connection.end();
	});
}