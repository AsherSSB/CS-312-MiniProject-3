const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const app = express();

const homeRoutes = require('./app/routes/homeRoutes');
const apiRoutes = require('./app/routes/apiRoutes');

const { initializeTables } = require('./app/lib/Database');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'app/views'));

app.use(express.static(path.join(__dirname, 'static')));
app.use(express.urlencoded({ extended: true }));  // auto parse form data into object
app.use(express.json());  // automatically parse json request body into object
app.use(cookieParser());  // allows access to cookies via req.cookies

// routers
app.use('/', homeRoutes);
app.use('/api', apiRoutes);

// database init
const databaseInitialized = initializeTables();

if (!databaseInitialized) {
    throw new Error('Failed to initialize database');
}

module.exports = app;
