const signupForm = document.querySelector('#signup-form');
const usernameInput = document.querySelector('#username-input')
const passwordInput = document.querySelector('#password-input');
const passwordConfirm = document.querySelector('#password-confirm');

console.log(`DEBUG: \n${signupForm}\n${passwordInput}\n${passwordConfirm}`);

signupForm.addEventListener('submit', (event) => {
    event.preventDefault();
    processSignup();
})

function processSignup() {
    processSignupInfo();
}

function processSignupInfo() {
    const passwordsDontMatch = passwordInput.value != passwordConfirm.value;
    const invalidPassword = !validatePassword(passwordInput.value);
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

    return (passwordsDontMatch &&
        invalidPassword &&
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
