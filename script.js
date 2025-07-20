function getCurrentTime() {
  const now = new Date();
  return now.toLocaleString();
}

const locations = [
  "Ward A", "Ward B", "Ward C",
  "Theatre", "ICU", "X-Ray",
  "MRI", "ER", "Recovery",
  "Main Entrance", "Discharge Lounge"
];

const requesters = ["Req A", "Req B", "Req C", "Nurse D", "Dr. Smith"];
const patients = ["John D.", "Anna K.", "Sam T.", "Lucy P.", "Noah M."];
const priorities = ["High", "Very High", "Emergency"];
const taskTypes = ["Chair", "Bed", "Wheelchair", "Escort"];
const resources = ["Staff A", "Staff B", "Staff C", "Porter X", "Tech M"];

// Helper
function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Format task HTML depending on the column
function generateTaskHTML(task, column) {
  const base = `🗕️ ${task.time} | ${task.requester} | ${task.from} → ${task.to} | ${task.priority} | ${task.type} | ${task.patient}`;

  if (column === "pending") {
    return `${base} <button onclick="startTask(this)">Start</button>`;
  } else if (column === "in-progress") {
    return `${base} <button onclick="assignTask(this)">Assign</button>`;
  } else {
    return base;
  }
}

// Auto-generate a new task
function generatePendingTask() {
  const task = {
    time: getCurrentTime(),
    requester: getRandomItem(requesters),
    from: getRandomItem(locations),
    to: getRandomItem(locations),
    priority: getRandomItem(priorities),
    type: getRandomItem(taskTypes),
    patient: getRandomItem(patients)
  };

  const pendingList = document.getElementById("pending");
  if (pendingList) {
    const li = document.createElement("li");
    li.innerHTML = generateTaskHTML(task, "pending");
    pendingList.appendChild(li);
  } else {
    console.error("Pending list element with id 'pending' not found.");
  }
}

// Move task from pending to in-progress
function startTask(button) {
  const li = button.parentElement;
  button.remove(); // Remove "Start"
  li.innerHTML += ` <button onclick="assignTask(this)">Assign</button>`;
  document.getElementById("in-progress").appendChild(li);
}

// Assign task to resource and move to resources column
function assignTask(button) {
  const li = button.parentElement;
  button.remove(); // Remove "Assign"
  const assigned = getRandomItem(resources);
  li.innerHTML += ` | Assigned to: ${assigned}`;
  document.getElementById("resources").appendChild(li);
}

// Optional: Real-time clock display
function updateClock() {
  const now = new Date();
  const clock = document.getElementById("clock");
  if (clock) {
    clock.textContent = now.toLocaleTimeString();
  }
}

// Auto-run
setInterval(updateClock, 1000);
setInterval(generatePendingTask, 10000);
