const API_KEY = '40b3199e32604ef18db495c325f73be4';
const BASE_URL = 'https://api.football-data.org/v4/competitions';

// Map the tab IDs from HTML to the API league codes
const leagueMap = {
    'pl': 'PL',
    'laliga': 'PD',
    'seriea': 'SA',
    'bundes': 'BL1',
    'ligue1': 'FL1'
};

/**
 * Main function to fetch and render data for a league
 */
async function loadLeagueData(code, tabId) {
    const tableContainer = document.getElementById(`${tabId}-table`);
    const scorersContainer = document.getElementById(`${tabId}-scorers`);
    const headers = { 'X-Auth-Token': API_KEY };

    console.log(`Initiating fetch for ${code}...`);

    try {
        // 1. Get Standings
        const stRes = await fetch(`${BASE_URL}/${code}/standings`, { headers });
        if (!stRes.ok) throw new Error(`Status: ${stRes.status}`);
        const stData = await stRes.json();
        
        let tableHtml = `<table class="table table-sm table-hover border">
            <thead class="table-light"><tr><th>#</th><th>Team</th><th>W-D-L</th><th>GD</th><th>Pts</th></tr></thead><tbody>`;
        
        stData.standings[0].table.forEach(row => {
            tableHtml += `<tr>
                <td>${row.position}</td>
                <td><img src="${row.team.crest}" class="crest" onerror="this.style.visibility='hidden'"> ${row.team.shortName}</td>
                <td>${row.won}-${row.draw}-${row.lost}</td>
                <td>${row.goalDifference}</td>
                <td><strong>${row.points}</strong></td>
            </tr>`;
        });
        tableContainer.innerHTML = tableHtml + `</tbody></table>`;

        // 2. Get Top Scorers
        const scRes = await fetch(`${BASE_URL}/${code}/scorers`, { headers });
        const scData = await scRes.json();
        
        let scorerHtml = `<ul class="list-group">`;
        scData.scorers.slice(0, 10).forEach(s => {
            scorerHtml += `<li class="list-group-item d-flex justify-content-between align-items-center">
                <span>${s.player.name}<br><small class="text-muted">${s.team.shortName}</small></span>
                <span class="badge bg-primary rounded-pill">${s.goals}</span>
            </li>`;
        });
        scorersContainer.innerHTML = scorerHtml + `</ul>`;

    } catch (err) {
        console.error("Error fetching data:", err);
        tableContainer.innerHTML = `<div class="alert alert-warning">API limit reached or league restricted. Try again in 60 seconds.</div>`;
        scorersContainer.innerHTML = "";
    }
}

/**
 * App Initialization
 */
document.addEventListener('DOMContentLoaded', () => {
    // Load Premier League by default
    loadLeagueData('PL', 'pl');

    // Attach listeners to tabs for other leagues
    const tabs = document.querySelectorAll('button[data-bs-toggle="pill"]');
    tabs.forEach(tab => {
        tab.addEventListener('shown.bs.tab', (e) => {
            const targetTabId = e.target.getAttribute('data-bs-target').replace('#', '');
            const apiCode = leagueMap[targetTabId];
            
            // Only load if the content is still "Loading..." to save API requests
            if (document.getElementById(`${targetTabId}-table`).innerText === "Loading...") {
                loadLeagueData(apiCode, targetTabId);
            }
        });
    });
});
