const express = require('express');
const router = express.Router();
const { getAllBlogs } = require('../lib/Database');

router.get('/', async (_, res) => {
    const blogs = await getAllBlogs();
    return res.render('home/index.ejs', {blogs: blogs} );
});

router.get('/signup', async (_, res) => {
    return res.render('home/signup.ejs', {} );
});

router.get('/login', (_, res) => {
    return res.render('home/login.ejs', {} );
});

module.exports = router;
