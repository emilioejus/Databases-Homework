
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
	on p.supplier_id = s.id ;
	
select product_name, supplier_name from products p inner join suppliers s on p.supplier_id = s.id ;

