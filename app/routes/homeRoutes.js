const express = require('express');
const router = express.Router();
const { getAllBlogs } = require('../lib/Database');

router.get('/', async (req, res) => {
    const blogs = await getAllBlogs();
    return res.render('home/index.ejs', {blogs: blogs} );
});

router.get('/signup', async (req, res) => {
    console.log('SIGNUP INVOKED');
    return res.render('home/signup.ejs', {} );
});

module.exports = router;
