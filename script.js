// Replace with your actual API key from football-data.org
const API_KEY = '40b3199e32604ef18db495c325f73be4';
const BASE_URL = 'https://api.football-data.org/v4/competitions';

/**
 * Main function to fetch and display league data
 * @param {string} code - The league code (e.g., 'PL', 'PD')
 * @param {string} elementId - The ID of the HTML div to fill
 */
async function loadLeague(code, elementId) {
    const container = document.getElementById(elementId);
    
    try {
        const response = await fetch(`${BASE_URL}/${code}/standings`, {
            headers: { 'X-Auth-Token': API_KEY }
        });
        const data = await response.json();
        const tableData = data.standings[0].table;

        // Generate HTML for the table
        let html = `
            <table class="table table-hover">
                <thead>
                    <tr>
                        <th>Pos</th>
                        <th>Team</th>
                        <th>GP</th>
                        <th>W</th>
                        <th>D</th>
                        <th>L</th>
                        <th>GD</th>
                        <th>Pts</th>
                    </tr>
                </thead>
                <tbody>
        `;

        tableData.forEach(item => {
            html += `
                <tr>
                    <td>${item.position}</td>
                    <td><img src="${item.team.crest}" width="25" class="me-2"> ${item.team.shortName}</td>
                    <td>${item.playedGames}</td>
                    <td>${item.won}</td>
                    <td>${item.draw}</td>
                    <td>${item.lost}</td>
                    <td>${item.goalDifference}</td>
                    <td><strong>${item.points}</strong></td>
                </tr>
            `;
        });

        html += `</tbody></table>`;
        container.innerHTML = html;

    } catch (error) {
        container.innerHTML = `<div class="alert alert-danger">Error loading data. Check your API key.</div>`;
        console.error("Fetch error:", error);
    }
}

// Execute when the page loads
document.addEventListener('DOMContentLoaded', () => {
    // Initial load for Premier League
    loadLeague('PL', 'pl-table');
    
    // In a full version, you'd add listeners to your tabs to call 
    // loadLeague('PD', 'laliga-table'), etc., when clicked.
});
