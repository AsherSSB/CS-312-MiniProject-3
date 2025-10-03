const loginForm = document.querySelector('#login-form');
const userIdInput = document.querySelector('#userid-input');

loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const loginSuccessful = await submitLogin();

    if (loginSuccessful) {
        console.debug('buh');
        window.location.href = '/';
    }
});

async function submitLogin() {
    const formData = new FormData(loginForm);
    const dataObject = Object.fromEntries(formData);
    const dataJson = JSON.stringify(dataObject);
    
    return fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: dataJson
    })
    .then(response => {
        if (!response.ok) {
            console.debug('unauthorized');
            userIdInput.classList.add('is-invalid');
            throw new Error('unauthorized');
        }
    })
    .then(_ => {
        return true;
    })
    .catch(err => {
        console.error('Error while logging in, ', err);
        return false;
    });
}

