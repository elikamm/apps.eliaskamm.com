start();

async function start() {
    let path = window.location.pathname;

    if (path != '/login/' && !(await checkLogin())) {
        window.location.href = '/login/?from=' + encodeURIComponent(path);
        return;
    }

    onLogin();
}

async function checkLogin() {
    return new Promise(async (resolve) => {
        let login = localStorage.getItem('login') || '',
            response = await fetch('https://io.eliaskamm.com/', {
            headers: {
                'Authorization': 'Basic ' + login,
                'X-Requested-With': 'XMLHttpRequest'
            },
            method: 'GET'
        });

        resolve(response.status != 401);
    });
}

async function setLogin(name, password) {
    return new Promise(async (resolve) => {
        let login = btoa(name + ':' + password),
            response = await fetch('https://io.eliaskamm.com/', {
            headers: {
                'Authorization': 'Basic ' + login,
                'X-Requested-With': 'XMLHttpRequest'
            },
            method: 'GET'
        });

        if (response.status != 401) {
            localStorage.setItem('login', login);
            resolve(true);
        }
        else resolve(false);
    });
}

async function addLogin(name, password) {
    return new Promise(async (resolve) => {
        let login = btoa(name + ':' + password),
            response = await fetch('https://io.eliaskamm.com/', {
            headers: {
                'Authorization': 'Basic ' + login,
                'X-Requested-With': 'XMLHttpRequest'
            },
            method: 'PUT'
        });

        if (response.status != 401) {
            localStorage.setItem('login', login);
            resolve(true);
        }
        else resolve(false);
    });
}

function resetLogin() {
    let path = window.location.pathname;

    localStorage.removeItem('login');
    window.location.href = '/login/?from=' + encodeURIComponent(path);
}

async function getIO(path) {
    return new Promise(async (resolve) => {
        let login = localStorage.getItem('login') || '',
            response = await fetch('https://io.eliaskamm.com' + path, {
            headers: {
                'Authorization': 'Basic ' + login,
                'X-Requested-With': 'XMLHttpRequest'
            },
            method: 'GET'
        });

        if (response.status == 401) {
            resetLogin();
        }
        else if (response.status == 200) {
            resolve(await response.text());
        }
        else {
            resolve(null);
        }
    });
}

async function setIO(path, data) {
    return new Promise(async (resolve) => {
        let login = localStorage.getItem('login') || '',
            response = await fetch('https://io.eliaskamm.com' + path, {
            headers: {
                'Authorization': 'Basic ' + login,
                'X-Requested-With': 'XMLHttpRequest'
            },
            method: 'POST',
            body: data
        });

        if (response.status == 401) {
            resetLogin();
        }
        else {
            resolve(response.status == 200);
        }
    });
}