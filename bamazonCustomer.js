// npm install requirements
require("console.table");

var inquirer = require("inquirer");
var connection = require("./connection")

// data variables
var prod = 0;
var qty = 0;
var itemsArray = [];
var total = 0;
var cart = 0;

// the basic code
connection.connect(function(err){
	if(err) throw err;
	console.log("\nYou have entered bamazon.\n");
	afterConnection();
});


// THE FUNCTIONS

////////////// display all products for sale ////////////////
	// ids - names - prices
function afterConnection(){
		createArray();
	
}; // THIS PART WORKS


	///// create array of items for table/////
	function createArray(){
		// query database - get products
		connection.query('SELECT * FROM products', function(err, result){	
			if (err) throw err;

			// for loop of result
			for (var i = 0; i < result.length; i++) {
				// create variable for each product with properties matching column header
				var item = {
					ID: result[i].item_id,
					Name: result[i].product_name,
					Department: result[i].department_name,
					Price: "$" + result[i].price,
					Qty: result[i].stock_quantity,
				};

				// push each item to the array
				itemsArray.push(item);
			}

			// console.table the array
			console.table(itemsArray);
			userInput();
		}); // end query

	} // end function

////////////// prompt user for purchase info ////////////////
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
		]) // end .prompt
		.then(function(order) {
			checkAvail(order, itemsArray);
		}); // end .then
} // end function


////////////// check if available quantity can fulfill order ////////////////
function checkAvail(order, itemsArray){
	prod = parseInt(order.item_ID);
	qty = parseInt(order.quantity);

	for (var a = 0; a < itemsArray.length; a++) {
		if (itemsArray[a].ID === prod && itemsArray[a].Qty < qty){
			// if no, let customer know
			console.log("We are unable to fulfill your order at this time. \nInsufficient Quantity");
			// and prevent order from completing
			connection.end();
			} 
		else if (itemsArray[a].ID === prod && itemsArray[a].Qty > qty){
			updateProduct(order);		
		} // end if else
	}; // end for loop
} // end function

		// else if yes, update the SQL database
		function updateProduct(order){
			console.log("\nUpdating product " + prod);

			// update query variable to update product quantity,  to pass in orderQty?
			var sql = 'UPDATE products SET stock_quantity = stock_quantity - ? WHERE item_ID = ?';
			var query = connection.query(sql, [qty, prod], function(err, result){
				if (err) throw err;
				totalCost(order);
			});
		}

/////////////// Display updated qty and cost ////////////////
function totalCost(order){
	// query database - get products
	connection.query('SELECT * FROM products WHERE item_id = ?', prod, function(err, result){	
		if (err) throw err;
		cart = cart + qty;
		total = total + (qty * result[0].price);
		// show records updated
		console.log("New (" + result[0].product_name + ") quantity: " + (result[0].stock_quantity));
		// and show customer the total cost of their purchase 
		console.log("\n\nYou have purchased " + cart + " items.\nYour updated order total is: $" + total + "\n");
		// purchase more?
		askAgain();
	}); // end query
} // end function


////////////// prompt user for another purchase ////////////////
function askAgain(){
	inquirer
		.prompt ([
			// Ask for product ID
			{
				type: "list",
				name: "Again",
				message: "Would you like to purchase another item?",
				choices: ["Yes", "No"],
			},
		]) // end .prompt
		.then(function(ans) {
			if (ans.Again === "Yes") {
				userInput();
			} else {
				// end connection
				connection.end();
			}
		}); // end .then
} // end function