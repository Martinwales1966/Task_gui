let taskIdCounter = 1;

function getCurrentTime() {
  const now = new Date();
  return now.toLocaleString();
}

const locations = ["Ward A", "Ward B", "ICU", "Theatre", "ER", "MRI", "X-Ray"];
const requesters = ["Nurse A", "Dr. B", "Admin C"];
const patients = ["John", "Emma", "Raj", "Ali"];
const taskTypes = ["Wheelchair", "Bed", "Escort"];
const priorities = ["High", "Very High", "Emergency"];

const resources = [
  { name: "Alice", status: "Available", lastLocation: "ER" },
  { name: "Bob", status: "Available", lastLocation: "MRI" },
  { name: "Cara", status: "Available", lastLocation: "ICU" }
];

const broadcastMessages = [
  { text: "🔴 Lifts in B Block are not operational", urgent: true },
  { text: "⚠️ Sanitise equipment between uses", urgent: false }
];

let broadcastIndex = 0;
let audio;

// Embedded emergency alert sound
const emergencySoundBase64 = "data:audio/wav;base64,UklGRjQAAABXQVZFZm10IBAAAAABAAEA..."; // truncated

function playEmergencySound() {
  if (!audio) {
    audio = new Audio(emergencySoundBase64);
  }
  audio.play().catch(console.warn);
}

function rotateBroadcast() {
  const msg = broadcastMessages[broadcastIndex];
  const bar = document.getElementById("broadcast");
  bar.textContent = msg.text;
  bar.className = msg.urgent ? "broadcast urgent" : "broadcast";
  broadcastIndex = (broadcastIndex + 1) % broadcastMessages.length;
}

function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function createResourceDropdown(taskId) {
  const select = document.createElement("select");
  select.innerHTML = `<option value="">Assign Resource</option>`;
  resources.forEach(res => {
    if (res.status === "Available") {
      const option = document.createElement("option");
      option.value = res.name;
      option.textContent = res.name;
      select.appendChild(option);
    }
  });
  return select;
}

function generateTaskHTML(task) {
  const li = document.createElement("li");
  li.className = "task-item";
  li.dataset.taskId = task.id;

  const timer = document.createElement("span");
  timer.textContent = "Elapsed: 0s";
  let seconds = 0;

  const interval = setInterval(() => {
    seconds++;
    timer.textContent = `Elapsed: ${seconds}s`;
    li.classList.remove("kpi-orange", "kpi-red");
    if (seconds >= 300) li.classList.add("kpi-red");
    else if (seconds >= 180) li.classList.add("kpi-orange");
  }, 1000);

  if (task.priority === "Emergency") {
    li.classList.add("urgent");
    playEmergencySound();
  }

  li.innerHTML += `
    <strong>${task.id}</strong> | ${task.time}<br>
    ${task.requester} - ${task.patient}<br>
    ${task.from} → ${task.to}<br>
    ${task.priority} | ${task.type}<br>
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
    const res = resources.find(r => r.name === dropdown.value);
    if (res) {
      res.status = "On Task";
      res.lastLocation = task.to;
      clearInterval(interval);
      moveToInProgress(task, res.name);
      li.remove();
      updateCounters();
      renderResources();
    }
  });

  holdBtn.addEventListener("click", () => {
    li.style.opacity = 0.5;
  });

  cancelBtn.addEventListener("click", () => {
    clearInterval(interval);
    li.remove();
    updateCounters();
  });

  li.appendChild(timer);
  li.appendChild(dropdown);
  li.appendChild(startBtn);
  li.appendChild(holdBtn);
  li.appendChild(cancelBtn);

  return li;
}

function generatePendingTask(forcedTask = null) {
  const isEmergency = Math.random() < 0.1;
  const task = forcedTask || {
    id: `TASK-${String(taskIdCounter++).padStart(4, "0")}`,
    time: getCurrentTime(),
    requester: getRandomItem(requesters),
    patient: getRandomItem(patients),
    from: getRandomItem(locations),
    to: getRandomItem(locations),
    priority: isEmergency ? "Emergency" : getRandomItem(["High", "Very High"]),
    type: getRandomItem(taskTypes)
  };

  const el = generateTaskHTML(task);
  const pendingList = document.getElementById("pending");
  if (task.priority === "Emergency") {
    pendingList.prepend(el);
  } else {
    pendingList.appendChild(el);
  }
  updateCounters();
}

function moveToInProgress(task, resourceName) {
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
    updateCounters();
    renderResources();
  });

  li.appendChild(completeBtn);
  document.getElementById("in-progress").appendChild(li);
  updateCounters();
}

function renderResources() {
  const ul = document.getElementById("resources");
  ul.innerHTML = "";
  resources.forEach(res => {
    const li = document.createElement("li");
    li.textContent = `${res.name} | ${res.status} | Last: ${res.lastLocation}`;
    ul.appendChild(li);
  });
}

function updateClock() {
  const clock = document.getElementById("clock");
  if (clock) clock.textContent = new Date().toLocaleTimeString();
}

function updateCounters() {
  document.getElementById("pending-count").textContent =
    document.querySelectorAll("#pending .task-item").length;
  document.getElementById("progress-count").textContent =
    document.querySelectorAll("#in-progress li").length;
}

document.addEventListener("DOMContentLoaded", () => {
  renderResources();
  rotateBroadcast();
  updateCounters();

  document.getElementById("new-task-btn").addEventListener("click", () => {
    const requester = prompt("Requester?");
    const patient = prompt("Patient?");
    const from = prompt("From?");
    const to = prompt("To?");
    const type = prompt("Type?");
    const priority = prompt("Priority (High, Very High, Emergency)?");
    if (requester && patient && from && to && type) {
      generatePendingTask({
        id: `TASK-${String(taskIdCounter++).padStart(4, "0")}`,
        time: getCurrentTime(),
        requester,
        patient,
        from,
        to,
        type,
        priority: ["High", "Very High", "Emergency"].includes(priority)
          ? priority
          : "High"
      });
    }
  });
});

setInterval(updateClock, 1000);
setInterval(rotateBroadcast, 10000);
setInterval(generatePendingTask, 15000);
