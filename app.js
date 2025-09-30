const express = require('express');
const path = require('path');
const app = express();

const homeRoutes = require('./app/routes/homeRoutes');

const { initializeTables } = require('./app/lib/Database');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'app/views'));

app.use(express.static(path.join(__dirname, 'static')));
app.use(express.urlencoded({ extended: true }));  // auto parse form data into object
app.use(express.json());  // automatically parse json request body into object

// routers
app.use('/', homeRoutes);

// database init
const databaseInitialized = initializeTables();

if (!databaseInitialized) {
    throw new Error('Failed to initialize database');
}

module.exports = app;
