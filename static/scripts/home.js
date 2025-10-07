const blogContainer = document.getElementById('blog-main-container');
const newBlogForm = document.getElementById('new-blog-container');
const timeDisplays = document.querySelectorAll('.blog-time');
const deleteButtons = document.querySelectorAll('.blog-delete');
const editButtons = document.querySelectorAll('.blog-edit');
const newBlogButton = document.getElementById('new-blog-button');
const submissionOverlay = document.getElementById('submission-overlay');
const editForm = document.getElementById('edit-blog-container');
const editModal = document.getElementById('staticEdit');
const warningMessageModalElement = document.getElementById('staticMessageModal');
const warningMessageModal = new bootstrap.Modal(warningMessageModalElement);
const warningMessage = document.getElementById('staticMessage')

const serverURL = window.location.origin;

let currentlyEditingId = -1;

// TODO: show modal on error
// modal.show();
// modal.hide();

editButtons.forEach(element => {
    element.addEventListener('click', (_) => {
        currentlyEditingId = element.dataset.blogid;
    });
});

deleteButtons.forEach(element => {
    element.addEventListener('click', (_) => {
        deleteButtonTriggered(element);
    });
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

function deleteButtonTriggered(deleteButton) {
    const blogId = deleteButton.dataset.blogid;
    fetch(serverURL+'/api/blog/'+blogId, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        const data = response.json();
        if (!response.ok) {
            warningMessageModal.show();
            throw new Error(response.status, response.message);
        }

        return data;
    })
    .then(data => {
        console.log(data);
    })
    .catch(err => {
        console.error(err);
    });
}

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
        const data = response.json();
        if (!response.ok) {
            warningMessageModal.show();

            throw new Error(`HTTP Error: ${response.status}`);
        }
        return data;
    })
    .then(_ => {
        window.location.reload();
    })
    .catch(error => {
        console.error(error);
    });
}

function patchEdit() {
    formData = new FormData(editForm);

    const blogId = currentlyEditingId;

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

