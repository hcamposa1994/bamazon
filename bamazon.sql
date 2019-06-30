drop database if exists bamazon;

create database bamazon;

use bamazon;

create table products (
  item_id int not null auto_increment,
  product_name varchar(45),
  department_name varchar(45),
  price decimal(10,2) null,
  stock_quantity int null,
  PRIMARY KEY (item_id)
  );
  
insert into products (product_name, department_name, price, stock_quantity)
values ("dumbells", "fitness", 45, 23), ("bike", "fitness", 50, 7), ("gym shoes", "fitness", 80, 15), 
("kettlebell", "fitness", 20, 35), ("swim goggles", "fitness", 15, 73), ("rice cooker", "appliances", 29, 150),
("steamer", "appliances", 80, 135), ("heater", "appliances", 150, 230), ("toaster", "appliances", 15, 584),
("can opener", "appliances", 8, 1375);