const { config } = require('dotenv');
const express = require('express');
const {Pool} = require('pg');
require("dotenv").config();


const router = express.Router();

const pool = new Pool({
    // user: PGUSER,
    // host: PGHOST,
    // database: PGDATABASE,
    // password: PASSWORD,
    // port: PGPORT  
    user: 'postgres',
    host: 'localhost',
    database: 'cyf-ecommerce',
    password: 'root',
    port: 5432
})

// variables sql
const productsName =  `SELECT product_name,supplier_name 
                       FROM products p 
                       INNER JOIN suppliers s 
                           ON p.supplier_id = s.id 
                       WHERE p.product_name = $1`;
const productsAll = `SELECT product_name,supplier_name 
                     FROM products p 
                     INNER JOIN suppliers s 
                        ON p.supplier_id = s.id `
const customerId = `SELECT * FROM customers where id = $1`;
const newCustomer = `INSERT INTO customers(name, address, city, country) VALUES($1, $2, $3, $4)`;
const existSupplier = `SELECT * FROM suppliers where id = $1`;
const newProducts = `INSERT INTO products (product_name, unit_price, supplier_id) VALUES($1, $2, $3)`;
const existCustomer = `SELECT * FROM customers WHERE id = $1`;
const newOrder = `INSERT INTO orders (order_date, order_reference, customer_id) VALUES($1, $2, $3)`;
const updateCustomer = `UPDATE customers SET name = $1, address= $2, city = $3, country = $4 WHERE id = $5`;
const existOrder = `SELECT * FROM orders WHERE id = $1;`;
const deleteOrder = `DELETE FROM  orders WHERE id = $1`;
const customerOrder = `SELECT * FROM orders WHERE customer_id = $1`;
const deleteCustomer = `DELETE FROM customers WHERE id = $1`;
const orderFromCustomerId = `SELECT order_reference, order_date, product_name, unit_price, supplier_name, quantity
                             FROM customers c
                             INNER JOIN orders o
                                ON c.id = o.customer_id
                             INNER JOIN order_items oi
                                ON   o.id = oi.order_id
                             INNER JOIN products p
                                ON oi.product_id = p.id 
                             INNER JOIN suppliers s
                                ON p.supplier_id = s.id
                             WHERE c.id = $1`;


//get
router.get('/', (req,res)=> {
    res.send('Hello World, the server is ready!!!!')
});

router.get('/customers', (req, res)=> {
    pool.query('SELECT * FROM customers', (error, result)=> {
        res.json(result.rows);
    })
});

router.get('/suppliers', (req, res)=> {
    pool.query('SELECT * FROM suppliers', (error, result)=> {
        res.json(result.rows);
    })
});

router.get('/products', (req, res)=> {
    let name = req.query.name;
    pool.connect((err, client, release) => {
        if(err) {
            return console.error('Error acquiring client', err.stack)
        }
        let query;
        let value;
        if(name) {
            query =  productsName;
            value = [name];
        }else {
            query = productsAll;
            value = [];
        }
        client.query(query, value, (err, result)=> {
            release();
            if(err) {
                res.status(500).send(err.stack)
            }else if(result.rowCount > 0) {
                res.status(200).json(result.rows)
            }else {
                res.status(404).send(`Row not found`)
            }
        })
    })
});

router.get('/customers/:customerId', (req, res)=> {
    let id = parseInt(req.params.customerId);
    if(isNaN(id)) {
        return res.send(`id is not a number`)
    }
    pool.connect((err, client, release)=> {
        if(err) {
            return console.error('Error acquiring client', err.stack)
        }
        client.query(customerId, [id], (err, result)=> {
            // release();
            if(err) {
                res.status(500).send(err.stack)
            }else if(result.rowCount > 0) {
                res.status(200).json(result.rows)
            }else {
                res.status(404).send(`Row not found`)
            }
        });
    });
});

router.get('/customers/:customerId/orders', (req, res)=> {
    let id = parseInt(req.params.customerId);

    isNaN(id) && res.send(`Id is not a number`);

    pool.connect((err, client, release)=> {
        err && res.status(500).send('Error acquiring client', err.stack);
        client.query(customerId, [id], (err, result)=> {
            err && res.status(500).send(`SQL Error: ${err}`);
            if(result.rowCount > 0) {
                client.query(orderFromCustomerId, [id], (err, result)=> {
                    release()
                    err && res.status(500).send(`SQL Error: ${err}`);
                    res.status(200).send(`All ordes for this customer ${JSON.stringify(result.rows, null, 2) }`)
                })
            }else {
                res.send(`Error ${id} not exist`)
            }
        });
    });
});

// post
router.post('/customers', (req, res)=> {
    let {name, address, city, country} = req.body;
    let customerValue = [name, address, city, country];
    pool.connect((err, client, release)=> {
        if(err) {
            return console.error('Error acquiring client', err.stack)
        }
        client.query(newCustomer, customerValue, (err, result)=> {
            if(err){
                res.status(500).send(`${err}`)
            }else if(result.rowCount > 0) {
                res.status(201).send(`customer created successfully`)
            }
        });
    });
});

router.post('/products', (req, res)=> {
    let {product_name, unit_price, supplier_id} = req.body;
    let values = [product_name, unit_price, supplier_id];
    console.log(values)
   
    unit_price % 1 && res.send(`${unit_price} not positive or whole`);
    pool.connect((err, client, release)=> {
        if(err) {
            return console.error('Error acquiring client', err.stack)
        }
        client.query(existSupplier, [supplier_id], (err, result)=> {
            if(err) {
                release();
                return res.status(500).send(`${err}`)
            }else if(result.rowCount > 0) {
                client.query(newProducts, values, (err, result)=> {
                    release();
                    if(err) {
                        return res.status(500).send(`${err} 333`)
                    }else if(result.rowCount > 0) {
                        res.status(201).send(`Create product succesfuly`)
                    }
                })
            }
        });
    });
});

router.post('/customers/:customerId/orders', (req,res)=> {
    let id = parseInt(req.params.customerId);
    let {order_date, order_reference} = req.body;
    let values = [order_date, order_reference, id];
    
    
    pool.connect((err, client, release)=> {
        if(err) {
            return res.send('Error acquiring client', err.stack)
        }
        client.query(existCustomer, [id], (err, result)=> {
            if(err) {
                release();
                return res.status(500).send(`SQL Error: ${err}`)
            }else if(result.rowCount > 0) {
                client.query(newOrder, values, (err, result)=> {
                    release();
                    if(err) {
                        return res.status(500).send(`SQL Error: ${err}`)
                    }else if(result.rowCount > 0) {
                        res.status(201).send(`create order succesfuly`)
                    }
                })
            }else {
                res.send(`Error ${id} not exist`)
            }
        })
    })
});

// put
router.put('/customers/:customerId', (req, res)=> {
    let id = parseInt(req.params.customerId);
    let {name, address, city, country} = req.body;
    let values = [name, address, city, country, id];

    isNaN(id) && res.send(`Id is not a number`);

    pool.connect((err, client, release)=> {
        err && res.status(500).send(`SQL Error: ${err}`);
        client.query(existCustomer, [id], (err, result)=> {
            err && res.status(500).send(`SQL Error: ${err}`)
            if(result.rowCount > 0) {
                client.query(updateCustomer, values, (err, result)=> {
                    release();
                    err && res.status(500).send(`SQL Error: ${err}`)
                    res.status(201).send(`Update customer succesfuly`)
                })
            }else {
                res.send(`Error ${id} not exist`)
            }
        })
    })
})

// delete
router.delete('/orders/:orderId', (req, res)=> {
    let id = parseInt(req.params.orderId);

    pool.connect((err, client, release)=> {
        err && console.error('Error acquiring client', err.stack);
        client.query(existOrder, [id], (err, result)=> {
            err && res.status(500).send(`SQL Error: ${err}`);
            if(result.rowCount > 0) {
                client.query(deleteOrder, [id], (err, result)=> {
                    release();
                    err && res.status(500).send(`SQL Error: ${err}`);
                    res.status(200).send(`Order removed`)
                })
            }else {
                res.send(`Error ${id} not exist`)
            }
        })
    })
})

router.delete('/customers/:cutomerId', (req, res)=> {
    let id = parseInt(req.params.cutomerId);

    pool.connect((err, client, release)=> {
        err && console.error('Error acquiring client', err.stack);
        client.query(existCustomer, [id], (err, result)=> {
            err && res.status(500).send(`SQL Error: ${err}`);
            if(result.rowCount > 0) {
                client.query(customerOrder, [id], (err, result)=> {
                    err && res.status(500).send(`SQL Error: ${err}`);
                    if(result.rowCount > 0) {
                        res.send(`This customer have a order`)
                    }else {
                        client.query(deleteCustomer, [id], (err, result)=> {
                            err && res.status(500).send(`SQL Error: ${err}`);
                            res.status(200).send(`Customer removed`)
                        })
                    }
                })
            }else {
                res.send(`Error ${id} not exist`)
            }

        });
    });
});


module.exports = router;