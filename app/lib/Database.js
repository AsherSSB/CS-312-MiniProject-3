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
    `, (err, res) => {
        if (err) {
            console.error('Error creating users table', err);
            return false;
        } else {
            console.log('Successfully initialized users table');
            return true;
        }
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
    `, (err, res) => {
        if (err) {
            console.error('Error creating blogs table', err);
            return false;
        } else {
            console.log('Successfully initialized blogs table');
            return true;
        }
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
    `, (err, res) => {
        if (err) {
            console.error('Error occured while getting blogs', err);
            return [];
        } else {
            return res;
        }
    });

    return blogs;
}

async function postBlog() {
    const result = await pool.query(`
        INSERT INTO blogs (creator_name, creator_user_id, title, category, body)
        VALUES ($1, $2, $3, $4, $5);
    `, (err, res) => {
        if (err) {
            console.error("Error while adding blog to database", err);
            return false;
        } else {
            return true
        }
    });

    return result;
}

module.exports = {
    initializeTables,
    getAllBlogs
}
