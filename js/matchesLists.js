const apiKey = '8442eb76a04142cfb7c0842e28923cd6';
const leaguesName = {
    PL: "https://api.football-data.org/v4/competitions/PL/matches",
    BL1: "https://api.football-data.org/v4/competitions/BL1/matches",
    PD: "https://api.football-data.org/v4/competitions/PD/matches",
    SA: "https://api.football-data.org/v4/competitions/SA/matches",
    FL1: "https://api.football-data.org/v4/competitions/FL1/matches",

    TablePL: "https://api.football-data.org/v4/competitions/PL/standings",
    TableBL1: "https://api.football-data.org/v4/competitions/BL1/standings",
    TablePD: "https://api.football-data.org/v4/competitions/PD/standings",
    TableSA: "https://api.football-data.org/v4/competitions/SA/standings",
    TableFL1: "https://api.football-data.org/v4/competitions/FL1/standings",

    StrikersPL: "https://api.football-data.org/v4/competitions/PL/scorers",
    StrikersBL1: "https://api.football-data.org/v4/competitions/BL1/scorers",
    StrikersPD: "https://api.football-data.org/v4/competitions/PD/scorers",
    StrikersSA: "https://api.football-data.org/v4/competitions/SA/scorers",
    StrikersFL1: "https://api.football-data.org/v4/competitions/FL1/scorers",

};

async function fetchTodayMatches(leagueCode) {
    try {
        const url = leaguesName[leagueCode];
        if (!url) {
            throw new Error(`Invalid league code: ${leagueCode}`);
        }

        const response = await fetch(url, {
            headers: {
                'X-Auth-Token': apiKey
            }
        });


        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        const matches = data.matches;

        const today = new Date().toISOString().split('T')[0];

        const todayMatches = matches.filter(match => match.utcDate.split('T')[0] === today);

        displayTodayMatches(todayMatches, leagueCode);

    } catch (error) {
        console.error(`Error fetching matches for league ${leagueCode}:`, error);
        document.getElementById('today_events').innerHTML = '<p>Failed to fetch match data.</p>';
    }
}


function displayTodayMatches(matches, leagueCode) {
    const leagueList = document.getElementById(`${leagueCode.toLowerCase()}_today_matches`);
    leagueList.innerHTML = '';

    if (matches.length === 0) {
        leagueList.innerHTML = 'Brak dzisiaj meczy';
        return;
    }

    matches.forEach(match => {
        const listItem = document.createElement('li');
        listItem.classList.add('match');
        listItem.innerHTML = `
            <div class="match-date">
                <span class="date">${new Date(match.utcDate).toLocaleString('pl-PL', {
            hour: '2-digit',
            minute: '2-digit'
        })}</span>
            </div>
            <div class="team_container">
                <div class="team home-team ${match.score.winner}">
                    <a href="../../team_info.html?team=${encodeURIComponent(match.homeTeam.shortName.split(' ').slice(0, 2).join('_'))}">
                        <img src="${match.homeTeam.crest}" alt="${match.homeTeam.name}" class="team-logo">
                        <span class="team-name">${match.homeTeam.shortName}</span>
                    </a>
                    <span class="score">${match.score.fullTime.home !== null ? match.score.fullTime.home : '-'}</span>
                </div>
                <div class="team away-team ${match.score.winner}">
                    <a href="../../team_info.html?team=${encodeURIComponent(match.awayTeam.shortName.split(' ').slice(0, 2).join('_'))}">
                        <img src="${match.awayTeam.crest}" alt="${match.awayTeam.shortName}" class="team-logo">
                        <span class="team-name">${match.awayTeam.shortName}</span>
                    </a>
                    <span class="score">${match.score.fullTime.away !== null ? match.score.fullTime.away : '-'}</span>
                </div>
                <div class="underline-bettwen-matches"></div>
            </div>
        `;
        leagueList.appendChild(listItem);
    });
}

async function fetchNextMatches(leagueCode) {
    try {
        const url = leaguesName[leagueCode];
        if (!url) {
            throw new Error(`Invalid league code: ${leagueCode}`);
        }

        const response = await fetch(url, {
            headers: {
                'X-Auth-Token': apiKey
            }
        });


        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        const matches = data.matches;
        const today = new Date().toISOString().split('T')[0];

        const currentMatchday = matches[0].season.currentMatchday;
        const nextMatchdayMatches = matches.filter(match => match.matchday === currentMatchday + 1);

        const remainingMatches = matches.filter(match =>
            match.matchday === currentMatchday && match.utcDate.split('T')[0] > today
        );

        displayNextMatches(remainingMatches, nextMatchdayMatches, leagueCode);


    } catch (error) {
        console.error(`Error fetching matches for league ${leagueCode}:`, error);
        document.getElementById('next_queue').innerHTML = '<p>Failed to fetch match data.</p>';

    }
}


function displayNextMatches(matches, matches2, leagueCode) {
    const CurrentMatchdayList = document.getElementById(`${leagueCode.toLowerCase()}_currentMatchday`);
    const NextMatchdayList = document.getElementById(`${leagueCode.toLowerCase()}_next_matches`);

    CurrentMatchdayList.innerHTML = '';
    NextMatchdayList.innerHTML = '';

    if (matches.length > 0) {
        const matchdayInfo = CurrentMatchdayList.querySelector('.matchday-info');
        if (!matchdayInfo) {
            const matchdayHeader = document.createElement('div');
            matchdayHeader.classList.add('matchday-info');
            matchdayHeader.textContent = `KOLEJKA: ${matches[0].matchday}`;
            CurrentMatchdayList.appendChild(matchdayHeader);
        }
    }

    matches.forEach(match => {

        const listItem = document.createElement('li');
        listItem.classList.add('match');
        listItem.innerHTML = `
            <div class="match-date">
                <span class="date">${new Date(match.utcDate).toLocaleString('pl-PL', {
            day: '2-digit',
            month: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        })}</span>
            </div>
            <div class="team_container">
                <div class="team home-team ${match.score.winner}">
                    <a href="../../team_info.html?team=${encodeURIComponent(match.homeTeam.shortName.split(' ').slice(0, 2).join('_'))}">
                        <img src="${match.homeTeam.crest}" alt="${match.homeTeam.name}" class="team-logo">
                        <span class="team-name">${match.homeTeam.shortName}</span>
                    </a>
                    <span class="score">${match.score.fullTime.home !== null ? match.score.fullTime.home : '-'}</span>
                </div>
                <div class="team away-team ${match.score.winner}">
                    <a href="../../team_info.html?team=${encodeURIComponent(match.awayTeam.shortName.split(' ').slice(0, 2).join('_'))}">
                        <img src="${match.awayTeam.crest}" alt="${match.awayTeam.shortName}" class="team-logo">
                        <span class="team-name">${match.awayTeam.shortName}</span>
                    </a>
                    <span class="score">${match.score.fullTime.away !== null ? match.score.fullTime.away : '-'}</span>
                </div>
                <div class="underline-bettwen-matches"></div>
            </div>
        `;
        CurrentMatchdayList.appendChild(listItem);
    });

    if (matches2.length > 0) {
        const matchdayInfo = NextMatchdayList.querySelector('.matchday-info');
        if (!matchdayInfo) {
            const matchdayHeader = document.createElement('div');
            matchdayHeader.classList.add('matchday-info');
            matchdayHeader.textContent = `KOLEJKA: ${matches2[0].matchday}`;
            NextMatchdayList.appendChild(matchdayHeader);
        }
    }
    matches2.forEach(match => {
        const listItem = document.createElement('li');
        listItem.classList.add('match');
        listItem.innerHTML = `
            <div class="match-date">
                <span class="date">${new Date(match.utcDate).toLocaleString('pl-PL', {
            day: '2-digit',
            month: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        })}</span>
            </div>
            <div class="team_container">
                <div class="team home-team ${match.score.winner}">
                    <a href="../../team_info.html?team=${encodeURIComponent(match.homeTeam.shortName.split(' ').slice(0, 2).join('_'))}">
                        <img src="${match.homeTeam.crest}" alt="${match.homeTeam.name}" class="team-logo">
                        <span class="team-name">${match.homeTeam.shortName}</span>
                    </a>
                    <span class="score">${match.score.fullTime.home !== null ? match.score.fullTime.home : '-'}</span>
                </div>
                <div class="team away-team ${match.score.winner}">
                    <a href="../../team_info.html?team=${encodeURIComponent(match.awayTeam.shortName.split(' ').slice(0, 2).join('_'))}">
                        <img src="${match.awayTeam.crest}" alt="${match.awayTeam.shortName}" class="team-logo">
                        <span class="team-name">${match.awayTeam.shortName}</span>
                    </a>
                    <span class="score">${match.score.fullTime.away !== null ? match.score.fullTime.away : '-'}</span>
                </div>
                <div class="underline-bettwen-matches"></div>
            </div>
        `;
        NextMatchdayList.appendChild(listItem);
    });
}

async function fetchAllNextMatches(leagueCode) {
    try {
        const url = leaguesName[leagueCode];
        if (!url) {
            throw new Error(`Invalid league code: ${leagueCode}`);
        }

        const response = await fetch(url, {
            headers: {
                'X-Auth-Token': apiKey
            }
        });


        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        const matches = data.matches;
        const today = new Date().toISOString().split('T')[0];

        const nextMatchdayMatches = matches.filter(match => match.utcDate.split('T')[0] > today);


        displayAllNextMatches(nextMatchdayMatches, leagueCode);


    } catch (error) {
        console.error(`Error fetching matches for league ${leagueCode}:`, error);
        document.getElementById('all_next_queues').innerHTML = '<p>Failed to fetch match data.</p>';

    }
}


function displayAllNextMatches(AllNextMatches, leagueCode) {
    const AllNextMatchesList = document.getElementById(`${leagueCode.toLowerCase()}_allnextMatchdays`);

    AllNextMatchesList.innerHTML = '';

    const matchesGroupedByMatchday = {};

    AllNextMatches.forEach(match => {
        if (!matchesGroupedByMatchday[match.matchday]) {
            matchesGroupedByMatchday[match.matchday] = [];
        }
        matchesGroupedByMatchday[match.matchday].push(match);
    });

    Object.keys(matchesGroupedByMatchday).forEach(matchday => {
        const matchdayHeader = document.createElement('div');
        matchdayHeader.classList.add('matchday-info');
        matchdayHeader.textContent = `KOLEJKA: ${matchday}`;
        AllNextMatchesList.appendChild(matchdayHeader);

        matchesGroupedByMatchday[matchday].forEach(match => {
            const listItem = document.createElement('li');
            listItem.classList.add('match');
            listItem.innerHTML = `
                <div class="match-date">
                    <span class="date ms-2">${new Date(match.utcDate).toLocaleString('pl-PL', {
                day: '2-digit',
                month: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            })}</span>
                </div>
                <div class="team_container">
                    <div class="team home-team ${match.score.winner}">
                        <a href="../../team_info.html?team=${encodeURIComponent(match.homeTeam.shortName.split(' ').slice(0, 2).join('_'))}">
                            <img src="${match.homeTeam.crest}" alt="${match.homeTeam.name}" class="team-logo">
                            <span class="team-name">${match.homeTeam.shortName}</span>
                        </a>
                        <span class="score">${match.score.fullTime.away !== null ? match.score.fullTime.away : '-'}</span>
                    </div>
                    <div class="team away-team ${match.score.winner}">
                    <a href="../../team_info.html?team=${encodeURIComponent(match.awayTeam.shortName.split(' ').slice(0, 2).join('_'))}">
                            <img src="${match.awayTeam.crest}" alt="${match.awayTeam.shortName}" class="team-logo">
                            <span class="team-name">${match.awayTeam.shortName}</span>
                        </a>
                    <span class="score">${match.score.fullTime.away !== null ? match.score.fullTime.away : '-'}</span>
                    </div>
                    <div class="underline-bettwen-matches"></div>
                </div>
            `;
            AllNextMatchesList.appendChild(listItem);
        });
    });
}


async function fetchPreviousMatches(leagueCode) {
    try {
        const url = leaguesName[leagueCode];
        if (!url) {
            throw new Error(`Invalid league code: ${leagueCode}`);
        }

        const response = await fetch(url, {
            headers: {
                'X-Auth-Token': apiKey
            }
        });


        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        const matches = data.matches;

        const currentMatchday = matches[0].season.currentMatchday;
        const previousMatchday = matches.filter(match => match.matchday === currentMatchday - 1);

        displayPreviousMatches(previousMatchday, leagueCode);


    } catch (error) {
        console.error(`Error fetching matches for league ${leagueCode}:`, error);
        document.getElementById('previous_queue').innerHTML = '<p>Failed to fetch match data.</p>';


    }
}

function displayPreviousMatches(previousQueue, leagueCode) {
    const PreviousMatchdayList = document.getElementById(`${leagueCode.toLowerCase()}_previousMatchday`);

    PreviousMatchdayList.innerHTML = '';

    if (previousQueue.length > 0) {
        const matchdayInfo = PreviousMatchdayList.querySelector('.matchday-info');
        if (!matchdayInfo) {
            const matchdayHeader = document.createElement('div');
            matchdayHeader.classList.add('matchday-info');
            matchdayHeader.textContent = `KOLEJKA: ${previousQueue[0].matchday}`;
            PreviousMatchdayList.appendChild(matchdayHeader);
        }
    }
    previousQueue.forEach(match => {
        const listItem = document.createElement('li');
        listItem.classList.add('match');
        listItem.innerHTML = `
            <div class="match-date">
                <span class="date">${new Date(match.utcDate).toLocaleString('pl-PL', {
            day: '2-digit',
            month: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        })}</span>
            </div>
            <div class="team_container">
                <div class="team home-team ${match.score.winner === 'HOME_TEAM' ? 'winner' : ''}">
                    <img src="${match.homeTeam.crest}" alt="${match.homeTeam.name}" class="team-logo">
                    <a href="../../team_info.html?team=${encodeURIComponent(match.homeTeam.shortName.split(' ').slice(0, 2).join('_'))}">
                        <span class="team-name">${match.homeTeam.shortName}</span>
                    </a>
                    <span class="score">${match.score.fullTime.home}</span>
                </div>
                <div class="team away-team ${match.score.winner === 'AWAY_TEAM' ? 'winner' : ''}">
                    <img src="${match.awayTeam.crest}" alt="${match.awayTeam.shortName}" class="team-logo">
                    <a href="../../team_info.html?team=${encodeURIComponent(match.awayTeam.shortName.split(' ').slice(0, 2).join('_'))}">
                        <span class="team-name">${match.awayTeam.shortName}</span>
                    </a>
                    <span class="score">${match.score.fullTime.away}</span>
                </div>
                <div class="underline-bettwen-matches"></div>
            </div>
        `;
        PreviousMatchdayList.appendChild(listItem);
    });

}

async function fetchAllPreviousMatches(leagueCode) {
    try {
        const url = leaguesName[leagueCode];
        if (!url) {
            throw new Error(`Invalid league code: ${leagueCode}`);
        }

        const response = await fetch(url, {
            headers: {
                'X-Auth-Token': apiKey
            }
        });


        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        const matches = data.matches;


        const AllpreviousMatches = matches.filter(match => match.status === "FINISHED");

        displayAllPreviousMatches(AllpreviousMatches, leagueCode);


    } catch (error) {
        console.error(`Error fetching matches for league ${leagueCode}:`, error);
        document.getElementById('all_previous_queues').innerHTML = '<p>Failed to fetch match data.</p>';


    }
}

function displayAllPreviousMatches(AllPreviousMatches, leagueCode) {
    const AllPreviousMatchdayList = document.getElementById(`${leagueCode.toLowerCase()}_allpreviousMatchday`);

    AllPreviousMatchdayList.innerHTML = '';

    const matchesGroupedByMatchday = {};

    AllPreviousMatches.forEach(match => {
        if (!matchesGroupedByMatchday[match.matchday]) {
            matchesGroupedByMatchday[match.matchday] = [];
        }
        matchesGroupedByMatchday[match.matchday].push(match);
    });

    Object.keys(matchesGroupedByMatchday).forEach(matchday => {
        const matchdayHeader = document.createElement('div');
        matchdayHeader.classList.add('matchday-info');
        matchdayHeader.textContent = `KOLEJKA: ${matchday}`;
        AllPreviousMatchdayList.appendChild(matchdayHeader);

        matchesGroupedByMatchday[matchday].forEach(match => {
            const listItem = document.createElement('li');
            listItem.classList.add('match');
            listItem.innerHTML = `
                <div class="match-date">
                    <span class="date ms-2">${new Date(match.utcDate).toLocaleString('pl-PL', {
                day: '2-digit',
                month: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            })}</span>
                </div>
                <div class="team_container">
                    <div class="team home-team ${match.score.winner === 'HOME_TEAM' ? 'winner' : ''}">
                        <img src="${match.homeTeam.crest}" alt="${match.homeTeam.name}" class="team-logo">
                         <a href="../../team_info.html?team=${encodeURIComponent(match.homeTeam.shortName.split(' ').slice(0, 2).join('_'))}">
                            <span class="team-name">${match.homeTeam.shortName}</span>
                        </a>
                        <span class="score">${match.score.fullTime.home}</span>
                    </div>
                    <div class="team away-team ${match.score.winner === 'AWAY_TEAM' ? 'winner' : ''}">
                        <img src="${match.awayTeam.crest}" alt="${match.awayTeam.shortName}" class="team-logo">
                    <a href="../../team_info.html?team=${encodeURIComponent(match.awayTeam.shortName.split(' ').slice(0, 2).join('_'))}">
                            <span class="team-name">${match.awayTeam.shortName}</span>
                        </a>
                        <span class="score">${match.score.fullTime.away}</span>
                    </div>
                    <div class="underline-bettwen-matches"></div>
                </div>
            `;
            AllPreviousMatchdayList.appendChild(listItem);
        });
    });
}


async function fetchLeaugeTable(leagueCode) {
    try {
        const url = leaguesName[leagueCode];
        if (!url) {
            throw new Error(`Invalid league code: ${leagueCode}`);
        }

        const response = await fetch(url, {
            headers: {
                'X-Auth-Token': apiKey
            }
        });


        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        const LeaugeTable = data.standings[0].table;

        displayLeaugeTable(LeaugeTable, leagueCode);

    } catch (error) {
        console.error(`Błąd pobierania tabeli dla ligi ${leagueCode}:`, error);
        document.getElementById('table_info').innerHTML = '<p>Nie udało się pobrać danych ligi.</p>';
    }
}


function displayLeaugeTable(table, leagueCode) {
    const TableList = document.getElementById(`${leagueCode.toLowerCase()}_teamsTable`);

    TableList.innerHTML = '';

    table.forEach(teamData => {
        const listItem = document.createElement('li');
        listItem.classList.add('standing_info');
        listItem.innerHTML = `
            <div class="table_container">
                <div class="position">${teamData.position}</div>
                <div class="team_name">
                    <img src="${teamData.team.crest}" alt="${teamData.team.shortName}" class="team_logo">
                        <a href="../../team_info.html?team=${encodeURIComponent(teamData.team.shortName.split(' ').slice(0, 2).join('_'))}">
                    ${teamData.team.shortName}</a>
                </div>
                <div class="playedGames">${teamData.playedGames}</div>
                <div class="wins">${teamData.won}</div>
                <div class="draws">${teamData.draw}</div>
                <div class="losts">${teamData.lost}</div>
                <div class="bilans">${teamData.goalsFor}:${teamData.goalsAgainst}</div>
                <div class="goalDifference">${teamData.goalDifference}</div>
                <div class="points">${teamData.points}</div>
                <div class="form">${teamData.form}</div>
            </div>
        <div class="underline_bettwen_standings"></div>
        `;

        TableList.appendChild(listItem);

        if (teamData.position >= 1 && teamData.position <= 4) {
            const positionDiv = listItem.querySelector('.position');
            positionDiv.classList.add('bg_blue');
        }

        if (teamData.position == 5) {
            const positionDiv = listItem.querySelector('.position');
            positionDiv.classList.add('bg_purple');
        }
        if (teamData.position == 6) {
            const positionDiv = listItem.querySelector('.position');
            positionDiv.classList.add('bg_gold');
        }
        if (teamData.position >= 18 && teamData.position <= 20) {
            const positionDiv = listItem.querySelector('.position');
            positionDiv.classList.add('bg_red');
        }
    });



}

async function fetchStrikersTable(leagueCode) {
    try {
        const url = leaguesName[leagueCode];
        if (!url) {
            throw new Error(`Invalid league code: ${leagueCode}`);
        }

        const response = await fetch(url, {
            headers: {
                'X-Auth-Token': apiKey
            }
        });


        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        const StrikersTable = data.scorers;

        displayStrikersTable(StrikersTable, leagueCode);

    } catch (error) {
        console.error(`Błąd pobierania tabeli dla ligi ${leagueCode}:`, error);
        document.getElementById('table_info').innerHTML = '<p>Nie udało się pobrać danych strzelców.</p>';
    }
}


function displayStrikersTable(strikers, leagueCode) {
    const StrikersList = document.getElementById(`${leagueCode.toLowerCase()}_StrikersTable`);

    StrikersList.innerHTML = '';

    strikers.forEach(striker => {
        const listItem = document.createElement('li');
        listItem.classList.add('standing_info');
        listItem.innerHTML = `
            <div class="table_container">
                <div class="player_name">
                    ${striker.player.lastName}. ${striker.player.firstName}
                </div>
                <div class="team_logo">
                    <img src="${striker.team.crest}" alt="${striker.team.shortName}">
                </div>
                <div class="team_name"> ${striker.team.shortName}</div>
                <div class="player_goals">${striker.goals}</div>
                <div class="player_assists">${striker.assists}</div>

            </div>
        <div class="underline_bettwen_standings"></div>
        `;

        StrikersList.appendChild(listItem);
    });
}

document.querySelector('.teams_table').addEventListener('click', function () {
    document.getElementById('strikers_table').style.display = 'none';
    document.getElementById('teams_table').style.display = 'block';

    this.classList.add('active');
    document.querySelector('.strikers_table').classList.remove('active');
});

document.querySelector('.strikers_table').addEventListener('click', function () {
    document.getElementById('teams_table').style.display = 'none';

    document.getElementById('strikers_table').style.display = 'block';

    this.classList.add('active');
    document.querySelector('.teams_table').classList.remove('active');
});
