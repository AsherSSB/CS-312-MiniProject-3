require('dotenv').config()  // loading postgres credentials
const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.PG_USERNAME,
    password: process.env.PG_PASSWORD,
    host: 'localhost',
    port: 5432,  // default pgsql server port
    database: 'blogdb'
});

async function initializeTables() {
    const userTableCreated = await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
            user_id varchar(255) PRIMARY KEY,
            password varchar(255) NOT NULL,
            name varchar(255) NOT NULL
        );
    `)
    .then(_ => {
        console.log('Successfully initialized users table');
        return true;
    })
    .catch(err => {
        console.error('Error creating users table', err);
        return false;
    });

    // a lot of this table is allowed to be null to account for deleted users
    // content to still persist after deletion
    const blogsTableCreated = await pool.query(`
            CREATE TABLE IF NOT EXISTS blogs (
                blog_id serial PRIMARY KEY,
                creator_name varchar(255),
                creator_user_id varchar(255) REFERENCES users(user_id),
                title varchar(255) NOT NULL,
                category varchar(255),
                body text,
                date_created timestamp
            );
        `)
        .then(_ => {
            console.log('Successfully initialized blogs table');
            return true;
        })
        .catch(err => {
            console.error('Error creating blogs table', err);
            return false;
        });
        
    if (userTableCreated && blogsTableCreated) {
        return true;
    }

    return false;
}

async function getAllBlogs() {
    const blogs = await pool.query(`
            SELECT * 
            FROM blogs; 
        `) 
        .then(res => {
            return res.rows;
        })
        .catch(err => {
            console.error('Error occured while getting blogs', err);
            return [];
        });

    return blogs;
}


async function postBlog(creatorName, creatorUserId, title, category, body) {
    const result = await pool.query(`
            INSERT INTO blogs (creator_name, creator_user_id, title, category, body)
            VALUES ($1, $2, $3, $4, $5);
        `, [creatorName, creatorUserId, title, category, body]
        )
        .then(_ => true)
        .catch(err => {
            console.error("Error while adding blog to database", err);
            return false;
        });

    return result;
}

async function deleteBlog(blogId) {
    const result = await pool.query(`
            DELETE FROM blogs
            WHERE blog_id = $1;
        `, [blogId])
        .then(_ => true)
        .catch(err => {
            console.error('Error while deleting blog', err);
            return false;
        });

    return result;
}

async function editBlogBody(blogId, newBody) {
    const result = await pool.query(`
            UPDATE blogs
            SET body = $1
            WHERE blog_id = $2;
        `, [newBody, blogId])
        .then(res => {
            if (res.rowCount === 0) {
                return false;
            }

            return true;
        })
        .catch(err => {
            console.error('Error while editing blog', err);
            return false;
        });

    return result;
}

module.exports = {
    initializeTables,
    getAllBlogs,
    postBlog,
    deleteBlog,
    editBlogBody
}
