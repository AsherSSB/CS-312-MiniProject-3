const express = require('express');
const path = require('path');
const app = express();

const homeRoutes = require('./app/routes/homeRoutes');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'app/views'));

app.use(express.static(path.join(__dirname, 'static')));
app.use(express.urlencoded({ extended: true }));  // auto parse form data into object
app.use(express.json());  // automatically parse json request body into object

app.use('/', homeRoutes);

module.exports = app;
