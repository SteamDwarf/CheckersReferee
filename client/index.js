const form = document.querySelector('#form');
const playerForm = document.querySelector('#player');
const gameResultsGenerator = document.querySelector("#gameResultsGenerator");
const tournamentIDInput = document.querySelector("#tournamentIDInput");
const cyclesCountInput = document.querySelector("#cyclesCountInput");

form.addEventListener('submit', (event) => {
    event.preventDefault();

    const elements = event.target.elements;
    const data = {
        login: elements.login.value,
        password: elements.password.value
    }

    fetch("http://localhost:5000/api/auth", {
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


gameResultsGenerator.addEventListener("submit", generateGamesResults);

async function generateGamesResults(e) {
    e.preventDefault();

    const cyclesCount = cyclesCountInput.value;

    for(let i = 0; i < cyclesCount; i++) {
        console.log(`${i + 1} цикл`)
        await tournamentLifeCycle();
        console.log("=========================================")
    }
}

async function tournamentLifeCycle() {
    try {
        await fetch(`http://localhost:5000/api/games`, {
            method: "DELETE"
        });
        await fetch(`http://localhost:5000/api/player-stats`, {
            method: "DELETE"
        });

        const tournamentID = tournamentIDInput.value;
        let tournament = await(await fetch(`http://localhost:5000/api/tournaments/${tournamentID}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({   
                "isStarted": false,
                "isFinished": false,
                "gamesIDs": [
            
                ],
                "playersStatsIDs": [
                ]
            })
        })).json();

        tournament = await(await fetch(`http://localhost:5000/api/tournaments/start/${tournamentID}`, {
            method: "PUT"
        })).json();

        for(let i = 0; i < tournament.toursCount; i++) {
            const lastGamesIDs = tournament.gamesIDs[tournament.gamesIDs.length - 1];
            const updatedGames = [];

            if(lastGamesIDs.length > 0){
                const games = await Promise.all(lastGamesIDs.map(id => fetch(`http://localhost:5000/api/games/${id}`)));

                for(let i = 0; i < games?.length; i++) {
                    let game = await games[i].json();
                    
                    if(game.player1ID === "0") {
                        game.player2Score = 2;
                    } else if(game.player2ID === "0") {
                        game.player1Score = 2;
                    } else {
                        const player1Score = Math.floor(Math.random() * 3);
                        const player2Score = 2 - player1Score;

                        game.player1Score = player1Score;
                        game.player2Score = player2Score;
                    }

                    game = await(await fetch(`http://localhost:5000/api/games/${game._id}`, {
                        method: "PUT",
                        headers: {
                            'Content-Type': 'application/json;charset=utf-8'
                        },
                        body: JSON.stringify({player1Score: game.player1Score, player2Score: game.player2Score})
                    })).json();

                    updatedGames.push(game);
                }

                console.log(updatedGames);

                if(i < tournament.toursCount - 1) {
                    tournament = await(await fetch(`http://localhost:5000/api/tournaments/finish-tour/${tournamentID}`, {
                        method: "PUT"
                    })).json();
                }
                
            }
        
        }
        
    }catch(error) {
        console.error(error);
    }
}


//Функция для разбиения игр по турам
const gamesSplitByTours = (games, playersCount) => {
    const tours = playersCount % 2 === 0 ? playersCount - 1 : playersCount;
    const gamesInTour = (tours + 1) / 2;
    const splitedGames = [];

    for(let i = 0; i < tours; i++) {
        const tour = [];

        for(let j = i * gamesInTour; j < i * gamesInTour + gamesInTour; j++) {
            tour.push(games[j]);
        }

        splitedGames.push(tour);
    }
}