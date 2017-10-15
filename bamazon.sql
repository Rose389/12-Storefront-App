

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
	item_id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
	product_name VARCHAR(100) NOT NULL,
	department_name VARCHAR(50),
	price INT NOT NULL,
	stock_quantity INT,
);

INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES 
("Banana Cream Pie", "Bakery", 13.75, 3), ("Meatloaf", "Deli", 10.50, 5), ("Coffee, Brewed", "Deli", 2.50, 25);

