const express = require('express');
const router = express.Router();
const { getAllBlogs } = require('../lib/Database');

router.get('/', async (req, res) => {
    const blogs = await getAllBlogs();
    return res.render('home/index.ejs', {blogs: blogs} );
});

module.exports = router;
