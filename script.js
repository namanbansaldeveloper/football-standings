const API_KEY = '40b3199e32604ef18db495c325f73be4';
const BASE_URL = 'https://api.football-data.org/v4/competitions';

async function loadLeagueData(code, tableId, scorersId) {
    const headers = { 'X-Auth-Token': API_KEY };

    try {
        // 1. Fetch Standings
        const stResponse = await fetch(`${BASE_URL}/${code}/standings`, { headers });
        const stData = await stResponse.json();
        
        let tableHtml = `<table class="table table-sm table-hover">
            <thead><tr><th>#</th><th>Team</th><th>PL</th><th>GD</th><th>Pts</th></tr></thead><tbody>`;
        
        stData.standings[0].table.forEach(item => {
            tableHtml += `<tr>
                <td>${item.position}</td>
                <td><img src="${item.team.crest}" width="20"> ${item.team.shortName}</td>
                <td>${item.playedGames}</td>
                <td>${item.goalDifference}</td>
                <td><strong>${item.points}</strong></td>
            </tr>`;
        });
        document.getElementById(tableId).innerHTML = tableHtml + `</tbody></table>`;

        // 2. Fetch Scorers
        const scResponse = await fetch(`${BASE_URL}/${code}/scorers`, { headers });
        const scData = await scResponse.json();
        
        let scorerHtml = `<ul class="list-group">`;
        scData.scorers.slice(0, 10).forEach(s => {
            scorerHtml += `<li class="list-group-item d-flex justify-content-between align-items-center">
                ${s.player.name} <span class="badge bg-primary rounded-pill">${s.goals}</span>
            </li>`;
        });
        document.getElementById(scorersId).innerHTML = scorerHtml + `</ul>`;

    } catch (error) {
        document.getElementById(tableId).innerHTML = `<p class="text-danger">Failed to load data for ${code}.</p>`;
    }
}

// Initializing the data
document.addEventListener('DOMContentLoaded', () => {
    // We load them one by one to avoid hitting the "10 requests per minute" limit too fast
    loadLeagueData('PL', 'pl-table', 'pl-scorers');
    
    // Add event listeners to tabs to load data only when the user clicks them (saves API calls!)
    document.querySelectorAll('button[data-bs-toggle="pill"]').forEach(button => {
        button.addEventListener('shown.bs.tab', (e) => {
            const target = e.target.getAttribute('data-bs-target');
            if(target === '#laliga') loadLeagueData('PD', 'laliga-table', 'laliga-scorers');
            if(target === '#seriea') loadLeagueData('SA', 'seriea-table', 'seriea-scorers');
            if(target === '#bundes') loadLeagueData('BL1', 'bundes-table', 'bundes-scorers');
        });
    });
});
