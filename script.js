let taskIdCounter = 1;
let pendingTasks = [];
let inProgressTasks = [];
let resources = [
  { name: "Alice", status: "Available", last: "ER" },
  { name: "Bob", status: "Available", last: "MRI" },
  { name: "Cara", status: "Available", last: "ICU" }
];

const alertAudio = new Audio("data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEA..."); // Short beep sound base64 (cut here for brevity)

function openTaskForm() {
  const isEmergency = Math.random() < 0.1;
  const task = {
    id: `TASK-${String(taskIdCounter++).padStart(4, "0")}`,
    time: new Date().toLocaleTimeString(),
    requester: "Dr. B",
    escort: "Emma",
    from: "Ward A",
    to: "X-Ray",
    priority: isEmergency ? "Emergency" : "High",
    createdAt: Date.now()
  };
  generatePendingTask(task);
}

function generatePendingTask(task) {
  pendingTasks.push(task);
  if (task.priority === "Emergency") {
    alertAudio.play();
  }
  renderTasks();
}

function renderTasks() {
  const pendingList = document.getElementById("pending-tasks-list");
  const progressList = document.getElementById("inprogress-tasks-list");

  if (!pendingList || !progressList) return;

  pendingList.innerHTML = "";
  progressList.innerHTML = "";

  const sortedPending = pendingTasks.sort((a, b) => {
    if (a.priority === "Emergency" && b.priority !== "Emergency") return -1;
    if (b.priority === "Emergency" && a.priority !== "Emergency") return 1;
    return a.createdAt - b.createdAt;
  });

  sortedPending.forEach(task => {
    const li = document.createElement("li");
    li.className = task.priority === "Emergency" ? "emergency" : "";
    const elapsed = Math.floor((Date.now() - task.createdAt) / 1000);

    li.innerHTML = `
      <strong>${task.id}</strong> | ${task.time}<br>
      ${task.requester} - ${task.escort}<br>
      ${task.from} → ${task.to}<br>
      <span>${task.priority}</span> | Escort<br>
      <small>Elapsed: ${elapsed}s</small><br>
      <select><option>Assign Resource</option></select>
      <button>Start</button>
      <button>Hold</button>
      <button>Cancel</button>
    `;
    pendingList.appendChild(li);
  });

  updateCounters();
  renderResources();
}

function renderResources() {
  const list = document.getElementById("resource-list");
  if (!list) return;

  list.innerHTML = "";
  resources.forEach(r => {
    const li = document.createElement("li");
    li.textContent = `${r.name} | ${r.status} | Last: ${r.last}`;
    list.appendChild(li);
  });
}

function updateCounters() {
  document.getElementById("pending-counter").textContent = pendingTasks.length;
  document.getElementById("inprogress-counter").textContent = inProgressTasks.length;
}

function updateClock() {
  const now = new Date();
  const clock = document.getElementById("clock");
  if (clock) clock.textContent = now.toLocaleTimeString();
}

setInterval(updateClock, 1000);
setInterval(renderTasks, 5000); // Update elapsed time every 5s
updateClock();

function assignResource(task, resourceName) {
  const resource = resources.find(r => r.name === resourceName);
  if (!resource || resource.status !== "Available") return false;

  resource.status = "On Task";
  resource.currentTask = task.id;
  return true;
}

function startTask(taskId) {
  const task = pendingTasks.find(t => t.id === taskId);
  const select = document.querySelector(`#task-${taskId} select`);
  const resourceName = select?.value;

  if (!resourceName || resourceName === "Assign Resource") return;

  if (assignResource(task, resourceName)) {
    pendingTasks = pendingTasks.filter(t => t.id !== taskId);
    inProgressTasks.push({ ...task, startedAt: Date.now(), resource: resourceName });
    renderTasks();
  }
}

function returnTask(taskId) {
  const task = inProgressTasks.find(t => t.id === taskId);
  inProgressTasks = inProgressTasks.filter(t => t.id !== taskId);
  const res = resources.find(r => r.name === task.resource);
  if (res) {
    res.status = "Available";
    res.currentTask = null;
  }
  renderTasks();
}

function updateKPI() {
  const total = taskIdCounter - 1;
  const emergencies = pendingTasks.concat(inProgressTasks).filter(t => t.priority === "Emergency").length;

  const avg =
    inProgressTasks.length > 0
      ? Math.floor(
          inProgressTasks.reduce((sum, t) => sum + (Date.now() - t.startedAt), 0) /
            inProgressTasks.length /
            1000
        )
      : 0;

  document.getElementById("total-tasks").textContent = total;
  document.getElementById("emergency-tasks").textContent = emergencies;
  document.getElementById("avg-response").textContent = `${avg}s`;
}

setInterval(updateKPI, 2000);
