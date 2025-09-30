class BlogPost {
    constructor(id, author, title, content, category) {
        this.id = id;
        this.author = author;
        this.title = title;
        this.content = content;
		this.category = category;
        this.time = new Date();
    }
}

module.exports = BlogPost;
