function fetchData() {
  const timestamp = new Date().toLocaleTimeString();

  document.getElementById('pending').innerHTML = `
    <li>📅 02/07/25 21:41 | Req A | W-A → W-B | High | Chair | Patient<br><small>Updated: ${timestamp}</small></li>
  `;

  document.getElementById('in-progress').innerHTML = `
    <li>🕒 01/07/25 10:00 | W-B → W-C | High | Alice<br><small>Updated: ${timestamp}</small></li>
  `;

  document.getElementById('resources').innerHTML = `
    <li>👤 John – Idle 2h | Last Loc: W-C</li>
    <li>👤 Sarah – On Task | Last Loc: W-B</li>
    <li>🕒 Last Update: ${timestamp}</li>
  `;
}

// Initial load
fetchData();

// Refresh every 10 seconds
setInterval(fetchData, 10000);
