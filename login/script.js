var LoadIndex = 2;

window.addEventListener('load', onLoad);

function $(query) {
    let nodes = document.querySelectorAll(query);
    if (nodes.length == 1) return nodes[0];
    else return Array.from(nodes);
}

async function onLogin() {
    if (await checkLogin()) {
        unloadPage();
    }
    else {
        --LoadIndex;
        if (LoadIndex == 0) init();
    }
}

function onLoad() {
    --LoadIndex;
    if (LoadIndex == 0) init();
}

function init() {
    $('#login-tab').addEventListener('click', () => showTab('login'));
    $('#register-tab').addEventListener('click', () => showTab('register'));

    let loginForm = document.forms['login'],
        registerForm = document.forms['register'];

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        let name = loginForm['name'].value,
            password = loginForm['password'].value;

        if (await setLogin(name, password)) {
            unloadPage();
        }
        else {
            loginForm.elements[1].value = '';
            loginForm.elements[0].select();
            displayError('Name oder Passwort falsch.');
        }
    });

    registerForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        let name = registerForm['name'].value,
            password1 = registerForm['password1'].value,
            password2 = registerForm['password2'].value;

        if (password1 != password2) {
            registerForm.elements[1].value = '';
            registerForm.elements[2].value = '';
            registerForm.elements[1].focus();
            displayError('Passwörter nicht identisch.');
        }
        else if (await addLogin(name, password1)) {
            unloadPage();
        }
        else {
            registerForm.elements[0].select();
            displayError('Name schon vergeben.');
        }
    });

    showTab('login');
}

function showTab(name) {
    for (let form of document.forms) {
        form.style.display = (form.getAttribute('name') == name) ? 'block' : '';
        form.elements[0].focus();
    }

    displayError('');
}

function unloadPage() {
    let search = new URLSearchParams(window.location.search);
    window.location.href = search.get('from') ?? '/';
}

function displayError(error) {
    $('#error').innerText = error;
}