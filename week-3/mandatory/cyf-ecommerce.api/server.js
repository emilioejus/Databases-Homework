const express = require('express');
const app = express();
const home = require('./router/router');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
console.log(`REQUEST RECEIVED!`);
console.log(` URL: ${req.path}`);
console.log(` PARAMS: ${JSON.stringify(req.params)}`);
console.log(` BODY: ${JSON.stringify(req.body, null, 2)}`);
console.log(` QUERY: ${JSON.stringify(req.query, null, 2)}`);
next();
});

const server = app.listen(process.env.PORT || 3001, ()=> {
    console.log(`server listening in port: ${server.address().port}  http://localhost:${server.address().port}`)
})

app.use('/', home);
app.use('/home', home);
