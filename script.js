// script.js (final update with full simulation + dual message broadcast + clean start)

let taskIdCounter = 1;

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

const resources = [
  { name: "Alice", status: "Available", lastLocation: "Ward A" },
  { name: "Bob", status: "Available", lastLocation: "X-Ray" },
  { name: "Cara", status: "Available", lastLocation: "ICU" },
  { name: "David", status: "Available", lastLocation: "ER" }
];

const broadcastMessages = [
  { text: "🔴 Lifts in B Block are not operational", urgent: true },
  { text: "⚠️ Remember to sanitise equipment between uses", urgent: false }
];

let broadcastIndex = 0;

function rotateBroadcast() {
  const msg = broadcastMessages[broadcastIndex];
  const broadcast = document.getElementById("broadcast");
  broadcast.textContent = msg.text;
  broadcast.className = msg.urgent ? "broadcast urgent" : "broadcast";
  broadcastIndex = (broadcastIndex + 1) % broadcastMessages.length;
}

function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function createResourceDropdown(taskId) {
  const select = document.createElement("select");
  select.innerHTML = `<option value="">Assign Resource</option>`;
  resources.forEach((res) => {
    if (res.status === "Available") {
      const option = document.createElement("option");
      option.value = res.name;
      option.textContent = res.name;
      select.appendChild(option);
    }
  });
  select.dataset.taskId = taskId;
  return select;
}

function generateTaskHTML(task) {
  const li = document.createElement("li");
  li.dataset.taskId = task.id;
  li.className = "task-item";
  if (task.priority === "Emergency") {
    li.classList.add("urgent");
    document.getElementById("alert-sound")?.play();
  }

  const timer = document.createElement("span");
  timer.textContent = "Elapsed: 0s";
  let seconds = 0;
  const interval = setInterval(() => {
    seconds++;
    timer.textContent = `Elapsed: ${seconds}s`;
    li.classList.remove("kpi-orange", "kpi-red");
    if (seconds > 300) li.classList.add("kpi-red");
    else if (seconds > 180) li.classList.add("kpi-orange");
  }, 1000);

  li.innerHTML = `
    <strong>${task.id}</strong> | ${task.time} | ${task.requester} | ${task.from} → ${task.to} | ${task.priority} | ${task.type} | ${task.patient}<br>
  `;

  const dropdown = createResourceDropdown(task.id);
  const startBtn = document.createElement("button");
  const holdBtn = document.createElement("button");
  const cancelBtn = document.createElement("button");

  startBtn.textContent = "Start";
  holdBtn.textContent = "Hold";
  cancelBtn.textContent = "Cancel";

  startBtn.disabled = true;
  dropdown.addEventListener("change", () => {
    startBtn.disabled = !dropdown.value;
  });

  startBtn.addEventListener("click", () => {
    const resource = resources.find(r => r.name === dropdown.value);
    if (resource) {
      resource.status = "On Task";
      resource.lastLocation = task.to;
      clearInterval(interval);
      addToInProgress(task, resource.name);
      li.remove();
      renderResources();
    }
  });

  holdBtn.addEventListener("click", () => {
    li.style.opacity = 0.5;
  });

  cancelBtn.addEventListener("click", () => {
    clearInterval(interval);
    li.remove();
  });

  li.appendChild(timer);
  li.appendChild(dropdown);
  li.appendChild(startBtn);
  li.appendChild(holdBtn);
  li.appendChild(cancelBtn);

  return li;
}

function generatePendingTask() {
  const isEmergency = Math.random() < 0.1; // 10% chance
  const task = {
    id: `TASK-${String(taskIdCounter++).padStart(4, "0")}`,
    time: getCurrentTime(),
    requester: getRandomItem(requesters),
    from: getRandomItem(locations),
    to: getRandomItem(locations),
    priority: isEmergency ? "Emergency" : getRandomItem(["High", "Very High"]),
    type: getRandomItem(taskTypes),
    patient: getRandomItem(patients)
  };

  const pendingList = document.getElementById("pending");
  if (pendingList) {
    const taskElement = generateTaskHTML(task);
    if (task.priority === "Emergency") {
      pendingList.prepend(taskElement);
    } else {
      pendingList.appendChild(taskElement);
    }
  }
}

function addToInProgress(task, resourceName) {
  const li = document.createElement("li");
  li.innerHTML = `
    <strong>${task.id}</strong> | ${task.from} → ${task.to} | ${task.priority} | ${resourceName}
  `;

  const completeBtn = document.createElement("button");
  completeBtn.textContent = "Complete";
  completeBtn.addEventListener("click", () => {
    const res = resources.find(r => r.name === resourceName);
    if (res) res.status = "Available";
    li.remove();
    renderResources();
  });

  li.appendChild(completeBtn);
  document.getElementById("in-progress").appendChild(li);
}

function renderResources() {
  const resList = document.getElementById("resources");
  resList.innerHTML = "";
  resources.forEach(res => {
    const li = document.createElement("li");
    li.textContent = `${res.name} | ${res.status} | Last: ${res.lastLocation}`;
    resList.appendChild(li);
  });
}

function updateClock() {
  const now = new Date();
  const clock = document.getElementById("clock");
  if (clock) clock.textContent = now.toLocaleTimeString();
}

setInterval(updateClock, 1000);
setInterval(generatePendingTask, 10000);
setInterval(rotateBroadcast, 10000);

document.addEventListener("DOMContentLoaded", () => {
  renderResources();
  rotateBroadcast();
});
