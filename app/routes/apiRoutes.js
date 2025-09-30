const express = require('express');
const router = express.Router();
const BlogPost = require('../lib/BlogPost');

let blogs = []

router.post('/blog', (req, res) => {
    const payload = req.body;
    if (!payload) {
        return res.status(400).json({message: "blog posted unsuccessfully"});
	}

	let newBlog = new BlogPost(
		blogs.length, 
		payload.author, 
		payload.title, 
		payload.content, 
		payload.category
	); 

	blogs.push(newBlog);
	return res.status(201).json({message: "blog recieved successfully"});
});

router.delete('/blog/:id', (req, res) => {
    const blogId = parseInt(req.params.id);
    if (isNaN(blogId)) {
        return res.status(400).json({message: 'Invalid blog ID'});
	}

	const blogIndex = blogs.findIndex(blog => blog.id === blogId);

	if (blogIndex !== -1){
		blogs.splice(blogIndex, 1); 
		return res.status(200).json({message: `Blog ${blogId} successfully deleted`});

	} else {
		return res.status(404).json({message: 'Blog not found'});
	}
});

router.patch('/blog/:id', (req, res) => {
	const blogId = parseInt(req.params.id);
	const payload = req.body;

	if (isNaN(blogId)) {
		return res.status(400).json({message: 'Invalid blog ID'});
	}

	if (!payload) {
		return res.status(400).json({message: 'Invalid payload'});
	}

	const blogIndex = blogs.findIndex(blog => blog.id === blogId);

	if (blogIndex === -1) {
		return res.status(404).json({message: 'Blog not found'});
	}

	const targetBlog = blogs[blogIndex];
	const propertiesChanged = [];
	for	(key in payload){
		if (key in targetBlog) {
			targetBlog[key] = payload[key]
			propertiesChanged.push(key)
		}
	}
	return res.status(200).json({message: `Blog ${propertiesChanged.join(", ")} changed`});
});

module.exports = router;
