
create table mentors(
	id serial 		primary key,
	name 			varchar(30),
	yearsInGlasgow	int,
	address 		varchar(120),
	programmingLF	varchar(30)
)

insert into mentors (name, yearsinglasgow, address, programminglf) values ('Pablo Picasso', 5, 'local host5000', 'Javascript');
insert into mentors (name, yearsinglasgow, address, programminglf) values ('Victor Lou', 3, 'local host4000', 'Phyton');
insert into mentors (name, yearsinglasgow, address, programminglf) values ('Daniela Cosan', 7, 'local host6000', 'Php');
insert into mentors (name, yearsinglasgow, address, programminglf) values ('Mario Silva', 1, 'local host3000', 'C++');
insert into mentors (name, yearsinglasgow, address, programminglf) values ('Lay Mirf', 5, 'local host3001', 'Java');


create table students(
	id		serial primary key,
	name		varchar(30),
	address 	varchar(120),
	graduated	boolean
)

insert into students  (name, address, graduated) values ('Hinata Hid', '4 avenew', true);
insert into students  (name, address, graduated) values ('Thanos Galax', '356 forlake', true);
insert into students  (name, address, graduated) values ('Safiro Leminton', '42 springfil', false);
insert into students  (name, address, graduated) values ('Margo lifty', 'dowtown', true);
insert into students  (name, address, graduated) values ('Daniel Silva', 'avenue 45', false);
insert into students  (name, address, graduated) values ('Hiden Kamikase', 'Chinatown', false);
insert into students  (name, address, graduated) values ('Omar Fuentes', 'Central Park', true);
insert into students  (name, address, graduated) values ('Albert All', 'avenue 55 in the box', true);
insert into students  (name, address, graduated) values ('Calletana Morales', 'Kissime 45', false);
insert into students  (name, address, graduated) values ('Maria Olivares', 'Weswork', false);


create table classes(
	id 			serial primary key,
	mentor		varchar(30),
	topic		varchar(30),
	date		date,
	location	varchar(120)
)

insert into classes (mentor, topic, date, location) values ('Pablo Picasso', 'Javascript', '2021/03/12', 'local host5000');
insert into classes (mentor, topic, date, location) values ('Mario Silva', 'C++', '2021/02/12', 'local host3000');


select * from mentors;
select * from students s ;
select * from  classes c ;


select s.id,
	   name,
	   address,
	   topic   
from
	   classes c 
inner join students s
	on s.graduated = false 
where
	s.graduated = false
	
	
select * from mentors m where m.yearsinglasgow > 5;	
select * from mentors m where m.programminglf in('Javascript');
select * from students s where s.graduated in(true);
select * from classes c where c."date" < '2021/06/01';
select * from students s where s.graduated in(true);


--task
select * from customers c ;
select * from order_items oi ; 
select * from orders o ;
select * from orders o order by order_date ;
select * from products p ;
select * from suppliers s ;

select product_name,
	   supplier_name
from 
	   products p
inner join suppliers s 
	on p.supplier_id = s.id 
	
select product_name,supplier_name from products p inner join suppliers s on p.supplier_id = s.id 

--1. Retrieve all the customers names and addresses who lives in United States
select name, address from customers c where c.country = 'United States';

--2. Retrieve all the customers ordered by ascending name
select name from customers c order by name;

--3. Retrieve all the products which cost more than 100
select * from products p where unit_price > 100;

--4. Retrieve all the products whose name contains the word `socks`
select * from products p where p.product_name like '%socks' ;

--5. Retrieve the 5 most expensive products
select * from products p order by unit_price  desc limit 5; 

--6. Retrieve all the products with their corresponding suppliers. The result should only contain the columns `product_name`, `unit_price` and `supplier_name`
select product_name ,
	   unit_price,
	   supplier_name
	   
from products p
join suppliers s 
	on	p.id = s.id

--7. Retrieve all the products sold by suppliers based in the United Kingdom. The result should only contain the columns `product_name` and `supplier_name`.
select product_name, supplier_name
from products p
join suppliers s 
	on p.id = s.id 
where s.country = 'United Kingdom'	;
	
--8. Retrieve all orders from customer ID `1`
select * from orders o where customer_id = 1;

--9. Retrieve all orders from customer named `Hope Crosby`
select o
from orders o
inner join customers c 
	on o.customer_id = c.id 
where c."name" = 'Hope Crosby';

--10. Retrieve all the products in the order `ORD006`. The result should only contain the columns `product_name`, `unit_price` and `quantity`.
select product_name, unit_price
from orders o 
inner join order_items oi 
	on o.id = oi.order_id 
inner join products p 
	on p.id = oi.product_id 
where o.order_reference = 'ORD006';

--11. Retrieve all the products with their supplier for all orders of all customers. The result should only contain the columns `name` (from customer), `order_reference` `order_date`, `product_name`, `supplier_name` and `quantity`.
select  c."name", o.order_reference, o.order_date, p.product_name, s.supplier_name, oi.quantity 
from customers c 
inner join orders o 
	on c.id = o.customer_id 
inner join order_items oi 
	on o.id = oi.order_id 
inner join products p 
	on oi.product_id = p.id 
inner join suppliers s 
	on p.supplier_id = s.id;

--12. Retrieve the names of all customers who bought a product from a supplier from China.

select  c."name" 
from customers c 
inner join orders o 
	on c.id = o.customer_id 
inner join order_items oi 
	on o.id = oi.order_id 
inner join products p 
	on oi.product_id = p.id 
inner join suppliers s 
	on p.supplier_id = s.id
where s.country = 'China'	