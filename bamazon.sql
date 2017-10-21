

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
	item_id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
	product_name VARCHAR(100) NOT NULL,
	department_name VARCHAR(50),
	price SMALLMONEY NOT NULL,
	stock_quantity INT,
	);

INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES 
	("Banana Cream Pie", "Bakery", 24.00, 3), 
	("Oatmeal Cookies, Dozen", "Bakery", 12.00, 5), 
	("Blueberry Muffin, Large", "Bakery", 2.50, 25),
	("Chicken Breast, Barbequed", "Deli", 3.75, 3), 
	("Amish Potatoe Salad, per lb", "Deli", 6.50, 10), 
	("Provolone, per lb", "Deli", 10.50, 23),
	("Milk-Whole, 1 gal", "Dairy", 6.99, 7), 
	("Butter-Unsalted, 1 lb", "Dairy", 4.79, 5), 
	("Mozzarella Stick, single", "Dairy", 0.79, 25),
	("Peanutbutter Cups", "Candy", 2.39, 3),
	("Gummi Bears, 6 oz", "Candy", 2.99, 9), 
	("Candied Ginger", "Candy", 7.99, 8);

