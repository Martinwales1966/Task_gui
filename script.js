let taskIdCounter = 1;
let pendingTasks = [];
let inProgressTasks = [];
let resources = [
  { name: "Alice", status: "Available", last: "ER" },
  { name: "Bob", status: "Available", last: "MRI" },
  { name: "Cara", status: "Available", last: "ICU" }
];

function openTaskForm() {
  generatePendingTask({
    id: `TASK-${String(taskIdCounter++).padStart(4, "0")}`,
    time: new Date().toLocaleTimeString(),
    requester: "Dr. B",
    escort: "Emma",
    from: "Ward A",
    to: "X-Ray",
    priority: "High"
  });
}

function generatePendingTask(task) {
  pendingTasks.push(task);
  renderTasks();
}

function renderTasks() {
  const pendingList = document.getElementById("pending-tasks-list");
  const progressList = document.getElementById("inprogress-tasks-list");

  if (!pendingList || !progressList) {
    console.error("Missing task list elements in DOM.");
    return;
  }

  pendingList.innerHTML = "";
  progressList.innerHTML = "";

  pendingTasks.forEach(task => {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${task.id}</strong> | ${task.time}<br>
      ${task.requester} - ${task.escort}<br>
      ${task.from} → ${task.to}<br>
      ${task.priority} | Escort<br>
      <small>Elapsed: 0s</small><br>
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

function updateCounters() {
  const pendingCounter = document.getElementById("pending-counter");
  const inprogressCounter = document.getElementById("inprogress-counter");

  if (pendingCounter) pendingCounter.textContent = pendingTasks.length;
  if (inprogressCounter) inprogressCounter.textContent = inProgressTasks.length;
}

function renderResources() {
  const list = document.getElementById("resource-list");
  if (!list) {
    console.error("resource-list not found in DOM.");
    return;
  }

  list.innerHTML = "";
  resources.forEach(r => {
    const li = document.createElement("li");
    li.textContent = `${r.name} | ${r.status} | Last: ${r.last}`;
    list.appendChild(li);
  });
}

function updateClock() {
  const now = new Date();
  const clock = document.getElementById("clock");
  if (clock) clock.textContent = now.toLocaleTimeString();
}

setInterval(updateClock, 1000);
updateClock();
