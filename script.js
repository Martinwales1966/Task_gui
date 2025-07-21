// script.js (final update with full simulation)

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
      addToInProgress(task, resource.name);
      li.remove();
      renderResources();
    }
  });

  holdBtn.addEventListener("click", () => {
    li.style.opacity = 0.5;
  });

  cancelBtn.addEventListener("click", () => {
    li.remove();
  });

  li.appendChild(dropdown);
  li.appendChild(startBtn);
  li.appendChild(holdBtn);
  li.appendChild(cancelBtn);
if (task.priority === "Emergency") {
  li.style.border = "2px solid red";
  li.style.background = "#ffe5e5";
}

  return li;
}

function generatePendingTask() {
  const task = {
  id: `TASK-${String(taskIdCounter++).padStart(4, "0")}`,
  time: getCurrentTime(),
  requester: getRandomItem(requesters),
  from: getRandomItem(locations),
  to: getRandomItem(locations),
  priority: getRandomItem(priorities),
  type: getRandomItem(taskTypes),
  patient: getRandomItem(patients)
};

// 🔴 Play alert if emergency
if (task.priority === "Emergency") {
  const audio = document.getElementById("emergencySound");
  if (audio) {
    audio.play().catch(() => {
      console.warn("Browser blocked autoplay — requires user interaction first.");
    });
  }
}


  const pendingList = document.getElementById("pending");
  if (pendingList) {
    const taskElement = generateTaskHTML(task);
    pendingList.appendChild(taskElement);
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
    if (res) {
      res.status = "Available";
    }
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
  if (clock) {
    clock.textContent = now.toLocaleTimeString();
  }
}

setInterval(updateClock, 1000);
setInterval(generatePendingTask, 10000);

document.addEventListener("DOMContentLoaded", renderResources);
