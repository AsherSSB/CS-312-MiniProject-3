const blogContainer = document.getElementById('blog-main-container');
const newBlogForm = document.getElementById('new-blog-container');
const timeDisplays = document.querySelectorAll('.blog-time');
const deleteButtons = document.querySelectorAll('.blog-delete');
const editButtons = document.querySelectorAll('.blog-edit');
const newBlogButton = document.getElementById('new-blog-button');
const submissionOverlay = document.getElementById('submission-overlay');
const editForm = document.getElementById('edit-blog-container');
const editModal = document.getElementById('staticEdit');

const serverURL = window.location.origin;
const windowBlogData = window.blogs;

const blogsDivArray = Array.from(blogContainer.children);

deleteButtons.forEach(element => {
    element.addEventListener('click', () => deleteBlog(element.closest('.row')));
});

editButtons.forEach(element => {
	element.addEventListener('click', () => editBlog(element.closest('.row')));
});

timeDisplays.forEach(element => {
    let defaultTime = element.innerHTML;
    const newTime = new Date(defaultTime);    
    let localTime = newTime.toLocaleString();
    element.innerHTML = localTime;
});

newBlogForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let formData = new FormData(newBlogForm);

    let blogData = {
        title: formData.get('title'),
        content: formData.get('content'),
        author: formData.get('author'),
		category: formData.get('category')
    }
    
    addBlog(blogData);
});

editForm.addEventListener('submit', (e) => {
    e.preventDefault();
    patchEdit()
});

function displayOverlay(headerText) {
    const overlayHeader = submissionOverlay.querySelector('h1');
    overlayHeader.innerHTML = headerText;
}

function addBlog(blogData) {
    fetch(serverURL+'/api/blog', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            title: blogData.title,
            content: blogData.content,
            author: blogData.author,
			category: blogData.category
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        window.location.reload();
    })
    .catch(error => console.log('Error: ', error));

}

function deleteBlog(blog) {
    const blogIndex = blogsDivArray.indexOf(blog);
    const blogId = windowBlogData[blogIndex]['id']; 

    fetch(serverURL+'/api/blog/'+blogId, {method: 'DELETE'})
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        window.location.reload();
    })
    .catch(error => console.log('Error: ', error));
}

function editBlog(blog) {
    const blogIndex = blogsDivArray.indexOf(blog);
    const blogId = windowBlogData[blogIndex]['id']; 
    editForm.dataset.blogId = blogId;
}

function patchEdit() {
    formData = new FormData(editForm);
    blogId = editForm.dataset.blogId;
    fetch(serverURL+'/api/blog/'+blogId, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            content: formData.get('content')
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        window.location.reload();
    })
    .catch(error => console.log('Error: ', error));
}

