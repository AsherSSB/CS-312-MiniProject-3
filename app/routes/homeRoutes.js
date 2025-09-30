const express = require('express');
const router = express.Router();

let blogs = []

router.get('/', (req, res) => {
    return res.render('home/index.ejs', {blogs: blogs});
});

module.exports = router;
