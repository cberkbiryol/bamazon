DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
    item_id INTEGER(10) AUTO_INCREMENT NOT NULL,
    product_name VARCHAR(80),
    department_name VARCHAR(50),
    price FLOAT(5,2),
    stock_quantity INTEGER(5),
    product_sales FLOAT(5,2),
    PRIMARY KEY (item_id)
);

INSERT INTO products (product_name,department_name,price,stock_quantity,product_sales) 
VALUES ("MacBook Air (Late 2015)","Electronics",999.99,10,0),
("Raspberry pi 3","Electronics",29.99,40,0),
("Arduino Uno","Electronics",19.99,20,0),
("Tidy Cat - Cat Litter (20 lbs)","Pet Supplies",32.00,30,0),
("Fancy Feast - Wet Cat Food (24 ct)","Pet Supplies",12.59,20,0),
("Zoo Med Aquatic Turtle Food (12 oz)","Pet Supplies",9.99,6,0),
("Dash Rapid Egg Cooker (6 eggs)","Home and Kitchen",17.99,12,0),
("Aroma Essential Oil Diffuser","Home and Kitchen",12.99,7,0),
("Etekcity Digital Food Scale","Home and Kitchen",15.29,4,0),
("LEGO City ATV race team","Toys",15.99,80,0),
("Princess Castle Play Tent","Toys",22.99,10,0),
("FoxPrint Beach sand toy mold set","Toys",19.99,12,0),
("Viva Naturals Organic Jojoba Oil (12 ofl z)","Beauty and Personal Care",10.50,12,0),
("Bioderma Make-Up Removing Solution (16.7 fl oz)","Beauty and Personal Care",12.90,8,0),
("Muscle Jelly Muscle Relaxation Hot Cream (8.8 fl oz)","Beauty and Personal Care",13.46,13,0);

CREATE TABLE departments (
    department_id INTEGER(10) AUTO_INCREMENT NOT NULL,
    department_name VARCHAR(50),
    over_head_costs FLOAT(9,2),
    PRIMARY KEY (department_id)
);

INSERT INTO departments (department_name,over_head_costs)  
VALUES ("Electronics",50000),
("Pet Supplies",15000),
("Home and Kitchen",10000),
("Toys",10000),
("Beauty and Personal Care",18000);



