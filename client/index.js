const form = document.querySelector('#form');
const playerForm = document.querySelector('#player');

/* async function start () {

    try {
        const response = await fetch("http://localhost:5000/test123");
        console.log(response);
        const data = await response.json();
        console.log(data);
    }catch(error) {
        console.log(error);
    }
    
}

start();
 */

/* fetch("https://jsonplaceholder.typicode.com/postss")
.then(response => response.ok ? response.json() : Promise.reject(response))
.then(data => console.log(data))
.catch(error => console.error(error)); */

/* fetch('http://localhost:5000/test')
  .then(response => response.ok ? response.json() : Promise.reject(response))
  .then(data => console.log(data))
  .catch(error => {
    error.json().then(errorData => console.error(errorData));
  }) */


form.addEventListener('submit', (event) => {
    event.preventDefault();

    const elements = event.target.elements;
    const data = {
        login: elements.login.value,
        password: elements.password.value
    }

    fetch("http://localhost:5000/auth", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.ok ? response.json() : Promise.reject(response))
    .then(data => console.log(data))
    .catch(error => error.json().then(errorData => console.error(errorData)))
});

playerForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const elements = event.target.elements;
    const data = {
        firstName: elements.firstName.value,
        middleName: elements.middleName.value,
        lastName: elements.lastName.value,
        sportsCategory: elements.sportsCategory.value,
        birthday: elements.birthday.value
    }

    console.log(data);

    fetch("http://localhost:5000/players", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.ok ? response.json() : Promise.reject(response))
    .then(data => console.log(data))
    .catch(error => error.json().then(errorData => console.error(errorData)))
});