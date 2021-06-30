const express = require('express');
const app = express();
const {Pool} = require('pg');


const server = app.listen(process.env.PORT || 5000, ()=> {
    console.log(`server listening on port ${server.address().port}  http://localhost:${server.address().port}`)
})

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'cyf-ecommerce',
    password: 'root',
    port: 5432
});

app.get('/', (req,res)=> {
    res.send('Hello World, the server is ready!!!!')
});

app.get('/customers', (req, res)=> {
    pool.query('SELECT * FROM customers', (error, result)=> {
        res.json(result.rows);
    })
});

app.get('/suppliers', (req, res)=> {
    pool.query('SELECT * FROM suppliers', (error, result)=> {
        res.json(result.rows);
    })
});

app.get('/products', (req, res)=> {
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
