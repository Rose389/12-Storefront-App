// npm install requirements
require("console.table");

var inquirer = require("inquirer");
var connection = require("./connection");

// data variables
var prod = 0;
var qty = 0;
var itemsArray = [];
var lowArray = [];
var changesArray = [];


// THE BASIC CODE
connection.connect(function(err){
	if(err) throw err;
	afterConnection();
});

// THE FUNCTIONS

////// Successfully Connected //////
function afterConnection(){
	console.log("\nThe bamazon Manager.\n");
	managerTask();
	
}; // end function


////// prompt manger for action //////
function managerTask(){
	inquirer
		.prompt ([
			// A list of task options
			{
				type: "list",
				name: "action",
				message: "Choose a Task",
				choices: ["View Products for Sale", 
						"View Low Inventory", 
						"Add to Inventory", 
						"Add New Product", "Exit"]
			}
		]) // end .prompt
		.then(function(Task) {

		////// Switch Case to call requested function //////
			switch (Task.action) {
				case "View Products for Sale":
			    viewAll();
			    break;

				case "View Low Inventory":
			    viewLow();
			    break;

				case "Add to Inventory":
				managerAdd();
			    break;

				case "Add New Product":
			    addNew();
			    break;

				case "Exit":
			    connection.end();
			    break;
			} // end switch
		}); // end .then
} // end function


////// Display All Products //////
// When case === `View Products for Sale`, 
	// list every available item: IDs, names, prices, and quantities.
function viewAll(){
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
		managerTask();
	}); // end query

} // end function


////// Display Only Products with Low Inventory //////
// When case === `View Low Inventory`, 
	// list all products WHERE stock_quantity < 5 
function viewLow(){
	// query database - get products
	connection.query('SELECT * FROM products WHERE stock_quantity < 5', function(err, result){	
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
			lowArray.push(item);
		}

		// console.table the array
		console.log("\nThe following products may need to be reordered:")
		console.table(lowArray);
		managerTask();
	}); // end query

} // end function



///////////// prompt manager for inventory info ////////////////
// When case === `Add to Inventory`, 
	// let manager "add more" to any item in store.
	// three functions

// function to specify product to adjust
function managerAdd(){
	inquirer
		.prompt ([
			// Ask for product ID
			{
				name: "adjID",
				message: "Which product quantity would you like to adjust?",
				type: "input",
			},
			// Ask for quantity to add
			{
				name: "addQty",
				message: "Enter number of units to adjust quantity.",
				type: "input",
			}
		]) // end .prompt
		.then(function(adjust) {
			qty = parseInt(adjust.addQty);
			prod = parseInt(adjust.adjID);
			addInv(adjust);
		}); // end .then
} // end function

// function to adjust database
function addInv(adjust) {
	var sql = 'UPDATE products SET stock_quantity = stock_quantity + ? WHERE item_ID = ?';
	// update product quantity in database
	connection.query(sql, [qty, prod], function(err, result){	
		if (err) throw err;
		// ask: update additional product
		inquirer
			.prompt ([
				{
					name: "another",
					message: "Adjust another product?",
					choices: ["Yes", "No"],
				},
			]) // end .prompt
		.then(function(confirm) {
			createChangesArray(adjust, itemsArray);
		}); // end .then
	}); // end query
}

// function to display changes
function createChangesArray(adjust, itemsArray) {
	// add line item to changesArray
	for (var a = 0; a < itemsArray.length; a++) {
		if (itemsArray[a].ID === prod){
			var update = {
					ID: prod,
					Name: itemsArray[a].Name,
					AmtAdj: qty,
					NewQty: itemsArray[a].Qty
				}
		} // end if
		changesArray.push(update);
	} // end for loop+
} // end function

function next(confirm) {
	// conditional display statement
	if (confirm.another === "Yes") {
		managerAdd();
	} else if (confirm.another === "No") {
		console.table(changesArray);
		managerTask();
	}
}

// If a manager selects `Add New Product`, 
	// it should allow the manager to add 
	// a completely new product to the store.
