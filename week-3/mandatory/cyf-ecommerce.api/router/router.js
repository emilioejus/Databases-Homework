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

// varoables sql
const productsName =  `SELECT product_name,supplier_name 
FROM products p 
INNER JOIN suppliers s 
    ON p.supplier_id = s.id 
WHERE p.product_name = $1`;
const customerId = `SELECT * FROM customers where id = $1`


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

router.get('/productsName', (req, res)=> {
    let name = req.query.name;
    pool.connect((err, client, release) => {
        if(err) {
            return console.error('Error acquiring client', err.stack)
        }
        client.query(productsName, [name], (err, result)=> {
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

router.get('/productsAll', (req, res)=> {
    pool.query(`SELECT product_name,supplier_name 
                    FROM products p 
                    INNER JOIN suppliers s 
                    ON p.supplier_id = s.id `, (error, result)=> {
                        if(error) {
                            return console.error(error.message)
                        }
        res.json(result.rows);
    })
});

router.get('/customers/:customerId', (req, res)=> {
    let id = parseInt(req.params.customerId);
    pool.connect((err, client, release)=> {
        if(err) {
            return console.error('Error acquiring client', err.stack)
        }
        client.query(customerId, [id], (err, result)=> {
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
})

module.exports = router;