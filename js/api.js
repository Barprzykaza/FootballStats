const apiKey = '8442eb76a04142cfb7c0842e28923cd6';
const leaguesName = {
    PL: "https://api.football-data.org/v4/competitions/PL/matches",
    BL1: "https://api.football-data.org/v4/competitions/BL1/matches",
    PD: "https://api.football-data.org/v4/competitions/PD/matches",
    SA: "https://api.football-data.org/v4/competitions/SA/matches",
    FL1: "https://api.football-data.org/v4/competitions/FL1/matches",
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
        console.error('Error fetching matches:', error);
        document.getElementById('matches-container').innerHTML = '<p>Failed to fetch match data.</p>';

    }
}

function displayTodayMatches(matches, leagueCode) {
    const leagueList = document.getElementById(`${leagueCode.toLowerCase()}_matches`);
    leagueList.innerHTML = ''; 

    if (matches.length === 0) {
        leagueList.innerHTML = '<p>Brak meczy</p>';
        return;
    }

    matches.forEach((match) => {
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
                <div class="team home-team ${match.score.winner === 'HOME_TEAM' ? 'winner' : ''}">
                    <a href="./team_info.html?team=${match.homeTeam.shortName}">
                    <img src="${match.homeTeam.crest}" alt="${match.homeTeam.name}" class="team-logo">
                    <span class="team-name">${match.homeTeam.shortName}</span></a>
                    <span class="score">${match.score.fullTime.home !== null ? match.score.fullTime.home : '-'}</span>
                </div>
                <div class="team away-team ${match.score.winner === 'AWAY_TEAM' ? 'winner' : ''}">
                    <a href="./team_info.html?team=${match.awayTeam.shortName}">
                    <img src="${match.awayTeam.crest}" alt="${match.awayTeam.shortName}" class="team-logo">
                    <span class="team-name">${match.awayTeam.shortName}</span></a>
                    <span class="score">${match.score.fullTime.away !== null ? match.score.fullTime.away : '-'}</span>
                </div>
                <div class="underline-bettwen-matches"></div>
            </div>
        `;

        leagueList.appendChild(listItem);
    });
}

const currentDate = new Date();
const formattedDate = currentDate.toLocaleString('pl-PL', {
    month: 'long',
    day: 'numeric',
});
document.getElementById('current-date').textContent = formattedDate;


document.addEventListener('DOMContentLoaded', function () {
    flatpickr("#datepicker", {
        inline: true, 
        dateFormat: "d-m-Y", 
        locale: "pl", 
        onChange: function (selectedDates, dateStr) {
            const selectedDate = selectedDates[0].toLocaleDateString('pl-PL', {
                day: '2-digit',
                month: '2-digit',
            });
            filterMatchesByDate(selectedDate); 
        },
    });

    fetchTodayMatches('PL');
    fetchTodayMatches('BL1');
    fetchTodayMatches('PD');
    fetchTodayMatches('SA');
    fetchTodayMatches('FL1');

});
