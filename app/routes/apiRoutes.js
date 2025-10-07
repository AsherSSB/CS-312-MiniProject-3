const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();
const DB = require('../lib/Database');

function validateJwt(req) {
    return jwt.verify(req.cookies.jwt, process.env.JWT_SECRET);
}

router.post('/login', async (req, res) => {
    const payload = req.body;
    const loginSuccessful = await DB.validateLogin(payload.userid, payload.password);

    if (!loginSuccessful) {
        return res.status(401).json({message: 'Login failed'});
    }

    jwtSecret = process.env.JWT_SECRET;
    const data = { userId: payload.userid };
    const token = jwt.sign(data, jwtSecret);

    res.cookie('jwt', token, {
        httpOnly: true,
        maxAge: 36000000 // 10hr 
    });

    res.cookie('userId', payload.userid, {
        maxAge: 36000000 // 10hr 
    });

    return res.status(200).json({ 
        message: 'Login successful',
        userId: payload.userid,
        ttl: 36000000
    });
});

router.post('/signup', async (req, res) => {
    const payload = req.body;

    if (!payload) {
        return res.status(400).json({message: 'failed to post signup, bad request body'});
    }

    const alreadyRegistered = await DB.checkUsernameExists(payload.username);
    
    if (alreadyRegistered) {
        return res.status(400).json({message: 'username already registered'});
    }
    
    const userSuccessfullyAdded = await DB.addUser(
        payload.userid, payload.username, payload.password)

    if (!userSuccessfullyAdded) {
        return res.status(500).json(
            {message: 'server error while adding user to database'});
    }


    return res.status(201).json({message: 'successfully registered user'});
});

router.post('/blog', async (req, res) => {
    const payload = req.body;

    if (!payload) {
        return res.status(400).json({message: 'blog posted unsuccessfully'});
	}

    const author = payload.author;
	const title = payload.title;
	const body = payload.content;
	const category = payload.category;
    const userId = req.cookies.userId;

    const successfullyPosted = await DB.postBlog(author, userId, title, category, body)

    if (!successfullyPosted) {
	    return res.status(400).json({message: 'bad request posting blog'});
    }

	return res.status(201).json({message: 'blog recieved successfully'});
});

router.delete('/blog/:id', async (req, res) => {
    const blogId = parseInt(req.params.id);
    if (isNaN(blogId)) {
        return res.status(400).json({message: 'Invalid blog ID'});
	}

    const blogAuthor = await DB.getBlogAuthorId(blogId);

    if (req.cookies.userId !== blogAuthor) {
        return res.status(403).json({message: 'You are not the author of this post'});
    }

    if (!validateJwt(req)) {
        return res.status(403).json({message: 'Your session has expired'});
    }

    const result = await DB.deleteBlog(blogId);
    
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

    if(!validateJwt(req)) {
        return res.status(403).json({message: 'expired JWT'});
    }

    const blogAuthor = await DB.getBlogAuthorId(blogId);

    if(req.cookies.userId != blogAuthor) {
        return res.status(403).json({message: 'Wrong author'});
    }

    const result = await DB.editBlogBody(blogId, payload.content);

	if (!result) {
		return res.status(404).json({message: 'Blog not found'});
	}

	return res.status(200).json({message: `Blog successfully changed`});
});

module.exports = router;
