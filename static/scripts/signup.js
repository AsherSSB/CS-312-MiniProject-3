const signupForm = document.querySelector('#signup-form');
const usernameInput = document.querySelector('#username-input')
const passwordInput = document.querySelector('#password-input');
const passwordConfirm = document.querySelector('#password-confirm');

signupForm.addEventListener('submit', (event) => {
    console.log('submitting');
    event.preventDefault();
    processSignup();
})

async function processSignup() {
    console.log('processing');
    const signupInfoIsValid = validateSignupInfo();
    
    if (!signupInfoIsValid) {
        console.error('SIGNUP INFO INVLAID');
        return false;
    }

    console.log('POSTING');
    const signupSuccessful = await postSignup();

    if (!signupSuccessful) {
        console.error('SIGNUP UNSUCCESSFUL');
        return false;
    }

    // signed up 
    // TODO: redirect to login
    redirectHome();
}

function redirectHome() {
    window.location.href = '/';
}

async function postSignup() {
    console.log("sending signup");
    const formData = new FormData(signupForm);
    const dataObject = Object.fromEntries(formData);
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
    console.log('VALIDATING');
    const passwordsDontMatch = passwordInput.value != passwordConfirm.value;
    const invalidPassword = !validatePassword(passwordInput.value);
    const invalidUsername = !validateUsername(usernameInput.value)

    if (passwordsDontMatch) {
        passwordConfirm.classList.add('is-invalid');
        console.log('NO MATCH: ', passwordInput.value, passwordConfirm.value);
    }
    
    if (invalidPassword) {
        passwordInput.classList.add('is-invalid');
        console.log('INVALID PASS: ', passwordInput.value);
    }

    if (invalidUsername) {
        usernameInput.classList.add('is-invalid');
        console.log('INVALID NAME: ', usernameInput.value);
    }

    return !(passwordsDontMatch ||
        invalidPassword ||
        invalidUsername);
}

function validateUsername(username) {
    return ((containsUppercase(username) ||
        containsLowerCase(username)) && 
        !containsSpecialCharacter(username));
}

function validatePassword(password) {
    return (containsLowerCase(password) &&
        containsUppercase(password) &&
        containsSpecialCharacter(password) &&
        containsNumber(password));
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
