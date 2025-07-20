// script.js

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

function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateTaskHTML(task) {
  return `📅 ${task.time} | ${task.requester} | ${task.from} → ${task.to} | ${task.priority} | ${task.type} | ${task.patient}`;
}

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

  const pendingList = document.getElementById("pending"); // ✅ Fixed ID
  if (pendingList) {
    const li = document.createElement("li");
    li.textContent = generateTaskHTML(task);
    pendingList.appendChild(li);
  } else {
    console.error("Pending list element not found!");
  }
}

function updateClock() {
  const now = new Date();
  const clock = document.getElementById("clock");
  if (clock) {
    clock.textContent = now.toLocaleTimeString();
  }
}

setInterval(updateClock, 1000);
setInterval(generatePendingTask, 10000);
