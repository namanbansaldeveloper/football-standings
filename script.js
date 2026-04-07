const API_KEY = '40b3199e32604ef18db495c325f73be4';
const BASE_URL = 'https://api.football-data.org/v4/competitions';

// Map tab IDs to API competition codes
const leagueMap = {
    'pl': 'PL',
    'laliga': 'PD',
    'seriea': 'SA',
    'bundes': 'BL1',
    'ligue1': 'FL1'
};

/**
 * Fetch and Display data
 */
async function loadLeague(code, tabId) {
    const tableDiv = document.getElementById(`${tabId}-table`);
    const scorersDiv = document.getElementById(`${tabId}-scorers`);
    const headers = { 'X-Auth-Token': API_KEY };

    console.log(`Requesting: ${code}`);

    try {
        // 1. Fetch Standings
        const stRes = await fetch(`${BASE_URL}/${code}/standings`, { headers });
        
        if (stRes.status === 429) throw new Error("Rate limit hit. Wait 60s.");
        if (stRes.status === 403) throw new Error("League restricted on Free Tier.");
        if (!stRes.ok) throw new Error("Error loading data.");

        const stData = await stRes.json();
        
        let tableHtml = `<table class="table table-sm table-hover mt-2">
            <thead><tr><th>#</th><th>Team</th><th>W-D-L</th><th>GD</th><th>Pts</th></tr></thead><tbody>`;
        
        stData.standings[0].table.forEach(row => {
            tableHtml += `<tr>
                <td>${row.position}</td>
                <td><img src="${row.team.crest}" class="crest" onerror="this.style.visibility='hidden'"> ${row.team.shortName}</td>
                <td>${row.won}-${row.draw}-${row.lost}</td>
                <td>${row.goalDifference}</td>
                <td><strong>${row.points}</strong></td>
            </tr>`;
        });
        tableDiv.innerHTML = tableHtml + `</tbody></table>`;

        // 2. Fetch Scorers
        const scRes = await fetch(`${BASE_URL}/${code}/scorers`, { headers });
        const scData = await scRes.json();
        
        let scorerHtml = `<ul class="list-group list-group-flush mt-2">`;
        scData.scorers.slice(0, 10).forEach(s => {
            scorerHtml += `<li class="list-group-item d-flex justify-content-between align-items-center">
                <span>${s.player.name}<br><small class="text-muted">${s.team.shortName}</small></span>
                <span class="badge bg-primary rounded-pill">${s.goals}</span>
            </li>`;
        });
        scorersDiv.innerHTML = scorerHtml + `</ul>`;

    } catch (err) {
        console.error(err);
        tableDiv.innerHTML = `<div class="alert alert-warning py-2 small">${err.message}</div>`;
        scorersDiv.innerHTML = "";
    }
}

/**
 * App Setup
 */
document.addEventListener('DOMContentLoaded', () => {
    // Initial Load: Premier League
    loadLeague('PL', 'pl');

    // Handle Tab Clicks
    const tabs = document.querySelectorAll('button[data-bs-toggle="pill"]');
    tabs.forEach(tab => {
        tab.addEventListener('shown.bs.tab', (e) => {
            const targetId = e.target.getAttribute('data-bs-target').replace('#', '');
            const code = leagueMap[targetId];
            
            // Only fetch if content hasn't been loaded yet
            if (document.getElementById(`${targetId}-table`).innerText === "Loading...") {
                loadLeague(code, targetId);
            }
        });
    });
});
