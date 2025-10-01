const express = require('express');
const router = express.Router();
const { postBlog, deleteBlog, editBlogBody } = require('../lib/Database');

router.post('/blog', async (req, res) => {
    const payload = req.body;
    if (!payload) {
        return res.status(400).json({message: "blog posted unsuccessfully"});
	}

    const author = payload.author
	const title = payload.title
	const body = payload.content
	const category = payload.category

    // TODO: replace 0 with user id when JWT implement
    const successfullyPosted = postBlog(author, 0, title, category, body)

    if (!successfullyPosted) {
	    return res.status(400).json({message: "bad request posting blog"});
    }

	return res.status(201).json({message: "blog recieved successfully"});
});

router.delete('/blog/:id', async (req, res) => {
    const blogId = parseInt(req.params.id);
    if (isNaN(blogId)) {
        return res.status(400).json({message: 'Invalid blog ID'});
	}

    const result = await deleteBlog(blogId);
    
    if (result) {
        return res.status(200).json({message: `Blog ${blogId} successfully deleted`});
    }

    return res.status(400).json({message: 'Bad Request'});
});

router.patch('/blog/:id', async (req, res) => {
	const blogId = parseInt(req.params.id);
	const payload = req.body;

	if (isNaN(blogId)) {
		return res.status(400).json({message: 'Invalid blog ID'});
	}

	if (!payload) {
		return res.status(400).json({message: 'Invalid payload'});
	}

    const result = await editBlogBody(blogId, payload.content);

	if (!result) {
		return res.status(404).json({message: 'Blog not found'});
	}

	return res.status(200).json({message: `Blog successfully changed`});
});

module.exports = router;
