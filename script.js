// main.js

function fetchData() {
  const timestamp = new Date().toLocaleTimeString();

  // Update Pending Tasks
  document.getElementById('pending').innerHTML = `
    <li>🗓️ 02/07/25 21:41 | Req A | W-A → W-B | High | Chair | Patient<br><small>Updated at ${timestamp}</small></li>
  `;

  // Update In Progress Tasks
  document.getElementById('in-progress').innerHTML = `
    <li>⏰ 01/07/25 10:00 | W-B → W-C | High | Alice<br><small>Checked at ${timestamp}</small></li>
  `;

  // Update Resources
  document.getElementById('resources').innerHTML = `
    <li>👤 John – Idle 2h | Last Loc: W-C</li>
    <li>👤 Sarah – On Task | Last Loc: W-B</li>
    <li><small>Live Check: ${timestamp}</small></li>
  `;
}

// Run once immediately
fetchData();

// Then update every 10 seconds
setInterval(fetchData, 10000);
