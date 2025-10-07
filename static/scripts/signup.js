const signupForm = document.querySelector('#signup-form');
const userIdInput = document.querySelector('#userid-input');
const usernameInput = document.querySelector('#username-input')
const passwordInput = document.querySelector('#password-input');
const passwordConfirm = document.querySelector('#password-confirm');

signupForm.addEventListener('submit', (event) => {
    console.debug('submitting');
    event.preventDefault();
    processSignup();
})

async function processSignup() {
    console.debug('processing');
    const signupInfoIsValid = validateSignupInfo();
    
    if (!signupInfoIsValid) {
        console.error('SIGNUP INFO INVLAID');
        return false;
    }

    console.debug('POSTING');
    const signupSuccessful = await postSignup();

    if (!signupSuccessful) {
        console.error('SIGNUP UNSUCCESSFUL');
        return false;
    }

    redirectToLogin();
}

function redirectToLogin() {
    window.location.href = '/login';
}

async function postSignup() {
    console.debug("sending signup");
    const formData = new FormData(signupForm);
    const dataObject = Object.fromEntries(formData);
    delete dataObject['password-confirm'];
    const jsonData = JSON.stringify(dataObject);
    return fetch('/api/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: jsonData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(response.status, response.statusText);
        }
    })
    .then(_ => {
        console.log('Signup recieved');
        return true;
    })
    .catch(err => {
        console.error('Error occured while sending signup, ', err);
        return false;
    });
}

function validateSignupInfo() {
    console.debug('VALIDATING');
    const passwordsDontMatch = passwordInput.value != passwordConfirm.value;
    const invalidPassword = !validatePassword(passwordInput.value);
    const invalidUserId = !validateUserId(userIdInput.value);
    const invalidUsername = !validateUsername(usernameInput.value)

    if (passwordsDontMatch) {
        passwordConfirm.classList.add('is-invalid');
    }
    
    if (invalidPassword) {
        passwordInput.classList.add('is-invalid');
    }

    if (invalidUsername) {
        usernameInput.classList.add('is-invalid');
    }

    if (invalidUsername) {
        userIdInput.classList.add('is-invalid');
    }

    return !(passwordsDontMatch ||
        invalidPassword ||
        invalidUsername ||
        invalidUserId);
}

function validateUserId(userId) {
    return (containsLowerCase(userId) || containsUppercase(userId)) && 
        withinVarchar255(userId);
}

function validateUsername(username) {
    return ((containsUppercase(username) ||
        containsLowerCase(username)) && 
        !containsSpecialCharacter(username) &&
        withinVarchar255(username));
}

function validatePassword(password) {
    return (containsLowerCase(password) &&
        containsUppercase(password) &&
        containsSpecialCharacter(password) &&
        containsNumber(password) &&
        withinVarchar255(password));
}

function containsLowerCase(string) {
    return /[a-z]/.test(string);
}

function containsUppercase(string) {
    return /[A-Z]/.test(string);
}

function containsNumber(string) {
    return /[1-9]/.test(string);
}

function containsSpecialCharacter(string) {
    return /[!@#$%^&*()_+\-=\[\]{}|;:'",.<>\/?]/.test(string);
}

function withinVarchar255(string) {
    return string.length <= 255;
}
