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
const resources = ["Porter 1", "Porter 2", "Porter 3", "Nurse A", "Tech B"];

function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateTask() {
  return {
    id: Date.now(),
    time: getCurrentTime(),
    requester: getRandomItem(requesters),
    from: getRandomItem(locations),
    to: getRandomItem(locations),
    priority: getRandomItem(priorities),
    type: getRandomItem(taskTypes),
    patient: getRandomItem(patients),
  };
}

function createTaskElement(task, stage) {
  const li = document.createElement("li");
  li.textContent = `🗕️ ${task.time} | ${task.requester} | ${task.from} → ${task.to} | ${task.priority} | ${task.type} | ${task.patient}`;

  const button = document.createElement("button");
  if (stage === "pending") {
    button.textContent = "Start";
    button.onclick = () => moveToInProgress(task, li);
  } else if (stage === "in-progress") {
    button.textContent = "Assign";
    button.onclick = () => assignResource(task, li);
  } else if (stage === "resources") {
    button.textContent = "Complete";
    button.onclick = () => li.remove();
  }

  li.appendChild(button);
  return li;
}

function moveToInProgress(task, li) {
  li.remove();
  const inProgressList = document.getElementById("in-progress");
  const taskElement = createTaskElement(task, "in-progress");
  inProgressList.appendChild(taskElement);
}

function assignResource(task, li) {
  li.remove();
  const resourceList = document.getElementById("resources");
  const assigned = getRandomItem(resources);
  task.assigned = assigned;

  const liResource = document.createElement("li");
  liResource.textContent = `👥 ${assigned} assigned to ${task.patient} | ${task.from} → ${task.to} | ${task.priority}`;
  
  const button = document.createElement("button");
  button.textContent = "Complete";
  button.onclick = () => liResource.remove();

  liResource.appendChild(button);
  resourceList.appendChild(liResource);
}

function generatePendingTask() {
  const task = generateTask();
  const pendingList = document.getElementById("pending");
  if (pendingList) {
    const li = createTaskElement(task, "pending");
    pendingList.appendChild(li);
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
